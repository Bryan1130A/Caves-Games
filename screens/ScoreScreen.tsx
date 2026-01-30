import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { supabase } from '../superbase/Config'

type RowTop = { uid: string; puntuaciones: number }
type RowRegistro = { uid: string; usuario: string }

type ScoreUI = {
  usuario: string
  puntuaciones: number
}

const ACCENT = '#80FF00'
const PANEL = 'rgba(0,0,0,0.70)'

export default function ScoreScreen({ navigation }: any) {
  const [scores, setScores] = useState<ScoreUI[]>([])
  const [cargando, setCargando] = useState(true)

  async function traerTop10() {
    try {
      setCargando(true)

      const { data: top, error: topError } = await supabase
        .from('puntuaciones')
        .select('uid, puntuaciones')
        .order('puntuaciones', { ascending: false })
        .limit(10)

      if (topError) throw topError

      const topRows = (top ?? []) as RowTop[]

      const uids = (top ?? []).map((x: any) => x.uid).filter(Boolean)

      if (uids.length === 0) {
        setScores([])
        return
      }

      const { data: regs, error: regError } = await supabase
        .from('registro')
        .select('uid, usuario')
        .in('uid', uids)

      if (regError) throw regError

      const mapa = new Map((regs ?? []).map((r: any) => [r.uid, r.usuario]))

      const final: ScoreUI[] = (top ?? []).map((t: any) => ({
        usuario: mapa.get(t.uid) ?? 'Jugador',
        puntuaciones: t.puntuaciones ?? 0,
      }))

      setScores(final)
    } catch (e) {
      console.log('traerTop10 error:', e)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    traerTop10()

    const channel = supabase
      .channel('top10-puntuaciones')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'puntuaciones' }, () => {
        traerTop10()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <ImageBackground
      source={{ uri: 'https://www.soy502.com/sites/default/files/styles/full_node/public/jill_valentine.jpg' }}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.titulo}>TOP 10</Text>
        <Text style={styles.subtitulo}>PUNTUACIONES MÁS ALTAS</Text>

        {cargando ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={ACCENT} />
            <Text style={styles.loadingText}>Cargando puntajes...</Text>
          </View>
        ) : (
          <FlatList
            data={scores}
            keyExtractor={(_, i) => String(i)}
            ListEmptyComponent={
              <View style={styles.card}>
                <Text style={styles.value}>Aún no hay puntajes guardados.</Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <Text style={styles.label}>LUGAR:</Text>
                <Text style={styles.value}>#{index + 1}</Text>

                <Text style={styles.label}>JUGADOR:</Text>
                <Text style={styles.value}>{item.usuario}</Text>

                <Text style={styles.label}>PUNTUACIÓN:</Text>
                <Text style={styles.estado}>{item.puntuaciones}</Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity style={styles.boton2} onPress={traerTop10}>
          <Text style={styles.botonTexto2}>RECARGAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonSalir} onPress={() => navigation.goBack?.()}>
          <Text style={styles.botonTexto}>VOLVER</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },

  container: { flex: 1, padding: 25, paddingTop: 55 },

  loadingBox: { alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  loadingText: { marginTop: 10, color: '#cfcfcf', fontWeight: '700' },

  titulo: { fontSize: 28, fontWeight: '900', color: '#ffffff', letterSpacing: 2, textAlign: 'center' },
  subtitulo: { color: ACCENT, marginBottom: 18, fontWeight: 'bold', letterSpacing: 1, textAlign: 'center' },

  card: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: ACCENT,
  },

  label: { fontSize: 13, color: '#b9b9b9', fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },
  value: { fontSize: 16, marginBottom: 6, color: '#ffffff', fontWeight: '600' },

  estado: { fontSize: 18, fontWeight: '900', color: ACCENT, marginBottom: 4, letterSpacing: 1 },

  boton2: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ACCENT,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  botonTexto2: { color: ACCENT, fontSize: 16, fontWeight: '900', letterSpacing: 1 },

  botonSalir: {
    backgroundColor: '#111',
    width: '100%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: ACCENT,
    marginTop: 10,
  },
  botonTexto: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
})
