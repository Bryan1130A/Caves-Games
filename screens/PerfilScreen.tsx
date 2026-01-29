import { ActivityIndicator, Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../superbase/Config'

export default function PerfilScreen({ navigation }: any) {
  const [uid, setUid] = useState<string>('')
  const [correo, setCorreo] = useState<string>('')

  const [telefono, setTelefono] = useState<string>('') // lo que está guardado
  const [telefonoEdit, setTelefonoEdit] = useState<string>('') // ✅ lo editable

  const [usuario, setUsuario] = useState<string>('')
  const [usuarioEdit, setUsuarioEdit] = useState<string>('')

  const [cargando, setCargando] = useState<boolean>(true)
  const [guardando, setGuardando] = useState<boolean>(false)

  useEffect(() => {
    traerPerfil()
  }, [])

  async function traerPerfil() {
    try {
      setCargando(true)

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      const session = sessionData.session
      if (!session?.user) {
        Alert.alert('Sesión', 'No hay sesión iniciada')
        navigation.navigate('Login')
        return
      }

      const user = session.user
      setUid(user.id)

      const { data, error } = await supabase
        .from('registro')
        .select('usuario, correo, telefono')
        .eq('uid', user.id)
        .maybeSingle()

      if (error) throw error

      const nombre = data?.usuario ?? ''
      const cor = data?.correo ?? (user.email ?? '')
      const tel = data?.telefono ?? ''

      setUsuario(nombre)
      setUsuarioEdit(nombre)
      setCorreo(cor)

      setTelefono(tel)
      setTelefonoEdit(tel) // ✅ cargar también al editable
    } catch (e: any) {
      console.log(e)
      Alert.alert('Error', 'No se pudo cargar el perfil')
    } finally {
      setCargando(false)
    }
  }

  async function guardarUsuario() {
    if (!uid) return

    const nuevo = usuarioEdit.trim()
    if (!nuevo) {
      Alert.alert('Validación', 'El nombre de usuario no puede estar vacío')
      return
    }

    // ✅ validar teléfono editable
    const telEdit = telefonoEdit.trim()
    if (!telEdit) {
      Alert.alert('Validación', 'El número de teléfono no puede estar vacío')
      return
    }

    const telLimpio = telEdit.replace(/\D/g, '')
    if (telLimpio.length < 10) {
      Alert.alert('Validación', 'El número debe tener al menos 10 dígitos')
      return
    }

    try {
      setGuardando(true)

      const { error } = await supabase
        .from('registro')
        .upsert(
          { uid: uid, usuario: nuevo, correo: correo, telefono: telLimpio },
          { onConflict: 'uid' }
        )

      if (error) throw error

      setUsuario(nuevo)
      setTelefono(telLimpio)        // ✅ actualiza lo guardado
      setTelefonoEdit(telLimpio)    // ✅ deja el input sincronizado

      Alert.alert('Listo', 'Datos actualizados correctamente')
    } catch (e: any) {
      console.log(e)
      Alert.alert('Error', 'No se pudo guardar el usuario')
    } finally {
      setGuardando(false)
    }
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    navigation.navigate('Login')
  }

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#80FF00" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    )
  }

  return (
    <ImageBackground
      source={{ uri: 'https://www.soy502.com/sites/default/files/styles/full_node/public/jill_valentine.jpg' }}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={styles.avatarGlow}>
          <Image source={{ uri: 'https://i.postimg.cc/3R0g2k7m/user.png' }} style={styles.avatar} />
        </View>

        <Text style={styles.titulo}>MI PERFIL</Text>
        <Text style={styles.subtitulo}>USUARIO ACTIVO</Text>

        <View style={styles.card}>
          <Text style={styles.label}>CORREO:</Text>
          <Text style={styles.value}>{correo || 'Sin correo'}</Text>

          <Text style={styles.label}>TELÉFONO:</Text>
          {/* ✅ ahora editable */}
          <TextInput
            value={telefonoEdit}
            onChangeText={setTelefonoEdit}
            placeholder="Escribe tu teléfono"
            placeholderTextColor="rgba(255,255,255,0.35)"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text style={styles.label}>USUARIO:</Text>
          <TextInput
            value={usuarioEdit}
            onChangeText={setUsuarioEdit}
            placeholder="Escribe tu usuario"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          <Text style={styles.label}>ESTADO:</Text>
          <Text style={styles.estado}>CONECTADO</Text>

          <TouchableOpacity
            style={[styles.boton, guardando && { opacity: 0.7 }]}
            onPress={guardarUsuario}
            disabled={guardando}
          >
            <Text style={styles.botonTexto}>{guardando ? 'GUARDANDO...' : 'GUARDAR'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.boton2} onPress={traerPerfil}>
          <Text style={styles.botonTexto2}>RECARGAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton2} onPress={() => navigation.navigate('Score')}>
          <Text style={styles.botonTexto2}>VER PUNTUACIONES</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton2} onPress={() => navigation.navigate('Game')}>
          <Text style={styles.botonTexto2}>JUGAR AHORA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonSalir} onPress={cerrarSesion}>
          <Text style={styles.botonTexto}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },

  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 25 },

  loadingText: { marginTop: 10, color: '#cfcfcf', fontWeight: '700' },

  avatarGlow: {
    shadowColor: '#80FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 18,
    elevation: 18,
    marginBottom: 14,
  },

  avatar: {
    width: 220,
    height: 160,
    borderRadius: 18,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#80FF00',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  titulo: { fontSize: 28, fontWeight: '900', color: '#ffffff', letterSpacing: 2 },

  subtitulo: { color: '#80FF00', marginBottom: 20, fontWeight: 'bold', letterSpacing: 1 },

  card: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 20,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#80FF00',
  },

  label: { fontSize: 13, color: '#b9b9b9', fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },

  value: { fontSize: 16, marginBottom: 6, color: '#ffffff', fontWeight: '600' },

  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: '#80FF00',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    marginBottom: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },

  estado: { fontSize: 18, fontWeight: '900', color: '#80FF00', marginBottom: 10, letterSpacing: 1 },

  boton: {
    backgroundColor: '#80FF00',
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#80FF00',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },

  botonTexto: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },

  boton2: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#80FF00',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },

  botonTexto2: { color: '#80FF00', fontSize: 16, fontWeight: '900', letterSpacing: 1 },

  botonSalir: {
    backgroundColor: '#111',
    width: '100%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#80FF00',
  },
})
