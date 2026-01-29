import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Alert } from 'react-native'
import { Audio } from 'expo-av'
import { supabase } from '../superbase/Config'

type Enemy = {
  id: string
  lane: -1 | 0 | 1
  z: number
  hp: number
}

type Bullet = {
  id: string
  lane: -1 | 0 | 1
  t: number // 0..1 (progreso visual)
}

const rid = () => Math.random().toString(36).slice(2)
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))

// ✅ Colores tipo Perfil
const ACCENT = '#80FF00'
const PANEL = 'rgba(0,0,0,0.70)'

export default function GameScreen() {
  const [lane, setLane] = useState<-1 | 0 | 1>(0)
  const [enemies, setEnemies] = useState<Enemy[]>([{ id: rid(), lane: 0, z: 85, hp: 2 }])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [ammo, setAmmo] = useState(12)
  const [gameOver, setGameOver] = useState(false)

  // ✅ usuario = uid (en tu tabla "puntuaciones" la columna usuario guarda el uid)
  const [uid, setUid] = useState('')
  const scoreGuardadoRef = useRef(false)

  // recoil
  const [recoil, setRecoil] = useState(0)
  const recoilRef = useRef<any>(null)

  // ✅ balas visuales
  const [bullets, setBullets] = useState<Bullet[]>([])

  // ✅ música / sfx
  const musicaRef = useRef<Audio.Sound | null>(null)
  const disparoRef = useRef<Audio.Sound | null>(null)
  const [audioOn, setAudioOn] = useState(true)

  const tick = useMemo(() => clamp(140 - level * 8, 60, 140), [level])

  // ✅ cargar UID de sesión (YA NO email)
  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        const user = data.session?.user
        if (user?.id) setUid(user.id)
      } catch (e) {
        console.log('Sesion error:', e)
      }
    })()
  }, [])

  // ✅ Música + sonidos
  useEffect(() => {
    ;(async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        })

        // 🎵 música (pon tu archivo)
        const { sound: music } = await Audio.Sound.createAsync(
          require('../assets/music/beats-20-474734.mp3'),
          { isLooping: true, volume: 0.45 }
        )
        musicaRef.current = music

        // 🔫 sfx disparo (pon tu archivo)
        const { sound: shootSfx } = await Audio.Sound.createAsync(
          require('../assets/music/lazer-gun-432285.mp3'),
          { volume: 0.9 }
        )
        disparoRef.current = shootSfx

        if (audioOn) {
          await musicaRef.current.playAsync()
        }
      } catch (e) {
        console.log('Audio error:', e)
      }
    })()

    return () => {
      ;(async () => {
        try {
          if (musicaRef.current) {
            await musicaRef.current.stopAsync()
            await musicaRef.current.unloadAsync()
            musicaRef.current = null
          }
          if (disparoRef.current) {
            await disparoRef.current.unloadAsync()
            disparoRef.current = null
          }
        } catch {}
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ✅ prender/apagar música
  useEffect(() => {
    ;(async () => {
      try {
        if (!musicaRef.current) return
        if (audioOn) await musicaRef.current.playAsync()
        else await musicaRef.current.pauseAsync()
      } catch {}
    })()
  }, [audioOn])

  // ✅ animación simple de balas (visual)
  useEffect(() => {
    const id = setInterval(() => {
      setBullets((prev) =>
        prev
          .map((b) => ({ ...b, t: b.t + 0.12 }))
          .filter((b) => b.t <= 1)
      )
    }, 30)
    return () => clearInterval(id)
  }, [])

  // ✅ guardar score al Game Over (usuario=uid)
  useEffect(() => {
    if (!gameOver) return
    if (scoreGuardadoRef.current) return
    scoreGuardadoRef.current = true

    ;(async () => {
      try {
        if (!uid) {
          console.log('No hay uid para guardar score')
          return
        }
        console.log('uid:', uid)
console.log('score:', score)

const { error } = await supabase
  .from('puntuaciones')
  
  .insert({
    uid: uid,
    puntuaciones: score,
  })



        if (error) throw error
      } catch (e: any) {
        console.log('Guardar puntuacion error:', e)
        Alert.alert('Error', 'No se pudo guardar la puntuación')
      }
    })()
  }, [gameOver, score, uid])

  // loop juego
  useEffect(() => {
    if (gameOver) return

    const loop = setInterval(() => {
      const nextLevel = Math.floor(score / 180) + 1
      if (nextLevel !== level) setLevel(nextLevel)

      setEnemies((prev) => {
        let moved = prev.map((e) => ({
          ...e,
          z: e.z - (4 + level * 0.7),
        }))

        if (moved.some((e) => e.z <= 0)) {
          setGameOver(true)
          return moved
        }

        const spawnChance = Math.min(0.22 + level * 0.03, 0.55)
        if (Math.random() < spawnChance) {
          const newLane: -1 | 0 | 1 = ([-1, 0, 1][Math.floor(Math.random() * 3)] as any)
          const hp = level >= 6 && Math.random() < 0.35 ? 3 : level >= 3 ? 2 : 1
          moved = moved.concat([{ id: rid(), lane: newLane, z: 100, hp }])
        }

        return moved.filter((e) => e.hp > 0)
      })

      setScore((s) => s + 2)
      setAmmo((a) => (a < 12 ? a + 1 : a))
    }, tick)

    return () => clearInterval(loop)
  }, [gameOver, tick, level, score])

  function moveLeft() {
    if (gameOver) return
    setLane((l) => (l === -1 ? -1 : (l - 1) as any))
  }

  function moveRight() {
    if (gameOver) return
    setLane((l) => (l === 1 ? 1 : (l + 1) as any))
  }

  async function playShootSound() {
    try {
      if (!audioOn) return
      if (!disparoRef.current) return
      await disparoRef.current.replayAsync()
    } catch {}
  }

  function shoot() {
    if (gameOver) return
    if (ammo <= 0) return

    setAmmo((a) => Math.max(0, a - 3))

    // ✅ bala roja visual
    setBullets((b) => b.concat([{ id: rid(), lane, t: 0 }]))

    // ✅ sonido disparo
    playShootSound()

    // recoil
    setRecoil(1)
    if (recoilRef.current) clearTimeout(recoilRef.current)
    recoilRef.current = setTimeout(() => setRecoil(0), 110)

    // pega al enemigo más cercano en tu carril (tu lógica igual)
    setEnemies((prev) => {
      const targets = prev
        .filter((e) => e.lane === lane)
        .sort((a, b) => a.z - b.z)

      if (targets.length === 0) return prev

      const t = targets[0]
      const next = prev.map((e) => (e.id === t.id ? { ...e, hp: e.hp - 1 } : e))
      const killed = next.filter((e) => e.hp <= 0)

      if (killed.length > 0) setScore((s) => s + 60 * killed.length)
      return next.filter((e) => e.hp > 0)
    })
  }

  function reset() {
    setLane(0)
    setEnemies([{ id: rid(), lane: 0, z: 85, hp: 2 }])
    setScore(0)
    setLevel(1)
    setAmmo(12)
    setGameOver(false)
    setRecoil(0)
    setBullets([])

    // ✅ permitir guardar en el siguiente game over
    scoreGuardadoRef.current = false
  }

  const nearest = useMemo(() => {
    if (enemies.length === 0) return null
    return enemies.slice().sort((a, b) => a.z - b.z)[0]
  }, [enemies])

  const enemyLeft = nearest?.lane === -1 ? '28%' : nearest?.lane === 1 ? '62%' : '45%'
  const enemyScale = nearest ? clamp((110 - nearest.z) / 40, 0.6, 2.6) : 1
  const enemyAlpha = nearest ? clamp((120 - nearest.z) / 100, 0.2, 1) : 0
  const crosshairLeft = lane === -1 ? '34%' : lane === 1 ? '58%' : '46%'

  // ✅ posición de balas por carril
  const bulletLeftForLane = (l: -1 | 0 | 1) => (l === -1 ? '34%' : l === 1 ? '58%' : '46%')

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=70' }}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      {/* HUD TOP */}
      <View style={styles.hud}>
        <Text style={styles.title}>FPS MARINE</Text>

        <View style={styles.hudRow}>
          <Text style={styles.stat}>⭐ {score}</Text>
          <Text style={styles.stat}>LV {level}</Text>
          <Text style={styles.stat}>🔫 {ammo}</Text>
        </View>

        <View style={styles.hudRow}>
          <TouchableOpacity style={styles.audioBtn} onPress={() => setAudioOn((v) => !v)}>
            <Text style={styles.audioText}>{audioOn ? '🔊 AUDIO' : '🔇 AUDIO'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.tip}>Dispara al carril donde estés (← / →) • Sobrevive</Text>
      </View>

      {/* ESCENA */}
      <View style={styles.scene}>
        <View style={styles.ceiling} />
        <View style={styles.floor} />

        <View style={[styles.frame, { transform: [{ scale: 1.0 }] }]} />
        <View style={[styles.frame, { transform: [{ scale: 0.82 }] }]} />
        <View style={[styles.frame, { transform: [{ scale: 0.66 }] }]} />
        <View style={[styles.frame, { transform: [{ scale: 0.52 }] }]} />
        <View style={[styles.frame, { transform: [{ scale: 0.40 }] }]} />

        <View style={[styles.laneLine, { left: '36%' }]} />
        <View style={[styles.laneLine, { left: '50%' }]} />
        <View style={[styles.laneLine, { left: '64%' }]} />

        {/* ✅ BALAS ROJAS */}
        {bullets.map((b) => (
          <View
            key={b.id}
            style={[
              styles.bullet,
              {
                left: bulletLeftForLane(b.lane),
                top: `${70 - b.t * 35}%`,
                opacity: 1 - b.t * 0.6,
                transform: [{ scale: 1 + b.t * 0.2 }],
              },
            ]}
          />
        ))}

        {/* ENEMIGO */}
        {nearest && (
          <View
            style={[
              styles.enemyWrap,
              { left: enemyLeft, opacity: enemyAlpha, transform: [{ scale: enemyScale }] },
            ]}
          >
            <Text style={styles.enemyText}>{nearest.hp >= 3 ? '🛸' : '👾'}</Text>
            <View style={styles.hpBar}>
              <View style={[styles.hpFill, { width: `${(nearest.hp / 3) * 100}%` }]} />
            </View>
          </View>
        )}

        {/* MIRA */}
        <View style={[styles.crosshair, { left: crosshairLeft }]} />

        {/* ARMA */}
        <View style={[styles.weapon, recoil ? styles.weaponRecoil : null]}>
          <Text style={styles.weaponText}>▮▮▮</Text>
          <Text style={styles.weaponSub}>PLASMA</Text>
        </View>
      </View>

      {/* CONTROLES */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrl} onPress={moveLeft} disabled={gameOver}>
          <Text style={styles.ctrlText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shoot, (ammo <= 0 || gameOver) && { opacity: 0.5 }]}
          onPress={shoot}
          disabled={ammo <= 0 || gameOver}
        >
          <Text style={styles.ctrlText}>DISPARAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrl} onPress={moveRight} disabled={gameOver}>
          <Text style={styles.ctrlText}>→</Text>
        </TouchableOpacity>
      </View>

      {gameOver && (
        <View style={styles.gameOver}>
          <Text style={styles.overTitle}>GAME OVER</Text>
          <Text style={styles.overSub}>Puntaje: {score}</Text>
          <TouchableOpacity style={styles.restart} onPress={reset}>
            <Text style={styles.restartText}>REINICIAR</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },

  hud: { paddingTop: 18, paddingHorizontal: 16, paddingBottom: 10, alignItems: 'center' },
  title: { color: ACCENT, fontWeight: '900', fontSize: 22, letterSpacing: 2 },
  hudRow: { marginTop: 10, flexDirection: 'row' },
  stat: {
    color: '#fff',
    fontWeight: '900',
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: 'rgba(128,255,0,0.35)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: 6,
  },
  tip: { marginTop: 8, color: 'rgba(255,255,255,0.78)', fontWeight: '700' },

  audioBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: PANEL,
    borderWidth: 1.5,
    borderColor: 'rgba(128,255,0,0.35)',
  },
  audioText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },

  scene: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(128,255,0,0.25)',
    backgroundColor: 'rgba(10,16,28,0.55)',
  },

  ceiling: { position: 'absolute', top: 0, left: 0, right: 0, height: '52%', backgroundColor: 'rgba(255,255,255,0.04)' },
  floor: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '48%', backgroundColor: 'rgba(128,255,0,0.05)' },

  frame: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    top: '12%',
    bottom: '14%',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  laneLine: { position: 'absolute', top: '20%', bottom: '10%', width: 2, backgroundColor: 'rgba(255,255,255,0.06)' },

  crosshair: {
    position: 'absolute',
    top: '48%',
    width: 26,
    height: 26,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(128,255,0,0.92)',
    shadowColor: ACCENT,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  bullet: {
    position: 'absolute',
    width: 8,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#ff2b2b',
    shadowColor: '#ff2b2b',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  enemyWrap: { position: 'absolute', top: '33%', alignItems: 'center' },
  enemyText: { fontSize: 32 },
  hpBar: {
    marginTop: 6,
    width: 68,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  hpFill: { height: '100%', backgroundColor: 'rgba(128,255,0,0.95)' },

  weapon: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 120,
    height: 84,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 2,
    borderColor: 'rgba(128,255,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weaponRecoil: { transform: [{ translateY: 4 }, { rotate: '-1.5deg' }] },
  weaponText: { color: '#fff', fontWeight: '900', fontSize: 30, letterSpacing: 2 },
  weaponSub: { color: 'rgba(255,255,255,0.75)', fontWeight: '900', letterSpacing: 1 },

  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 18, gap: 12 },
  ctrl: {
    width: 74,
    height: 56,
    borderRadius: 16,
    backgroundColor: PANEL,
    borderWidth: 2,
    borderColor: 'rgba(128,255,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shoot: {
    minWidth: 170,
    height: 56,
    borderRadius: 16,
    backgroundColor: ACCENT,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  ctrlText: { color: '#fff', fontWeight: '900', letterSpacing: 1.2, fontSize: 16 },

  gameOver: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: '44%',
    padding: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.82)',
    borderWidth: 2,
    borderColor: 'rgba(239,68,68,0.65)',
    alignItems: 'center',
  },
  overTitle: { color: '#ef4444', fontSize: 30, fontWeight: '900', letterSpacing: 2 },
  overSub: { color: 'rgba(255,255,255,0.85)', marginTop: 8, marginBottom: 14 },
  restart: { paddingVertical: 12, paddingHorizontal: 22, borderRadius: 14, backgroundColor: ACCENT, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)' },
  restartText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },
})
