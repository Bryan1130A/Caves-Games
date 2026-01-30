import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ImageBackground, Dimensions, ActivityIndicator,}
 from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { supabase } from '../superbase/Config'

import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'

const { width, height } = Dimensions.get('window')

const KEY_BIO_ENABLED = 'bio_enabled'
const KEY_REFRESH_TOKEN = 'sb_refresh_token'

export default function LoginScreen({ navigation }: any) {
  const [usuario, setUsuario] = useState('')  
  const [contrasenia, setContrasenia] = useState('')

  const [loading, setLoading] = useState(false)//
  const [bioDisponible, setBioDisponible] = useState(false)
  const [bioEnabled, setBioEnabled] = useState(false)

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync()
      const enrolled = await LocalAuthentication.isEnrolledAsync()
      const enabled = (await SecureStore.getItemAsync(KEY_BIO_ENABLED)) === '1'

      setBioDisponible(compatible && enrolled)
      setBioEnabled(enabled)

      // si ya está activado, intenta biometría al abrir login
      if (compatible && enrolled && enabled) {
        await loginConBiometria()
      }
    })()
  }, [])

  async function login() {
    if (!usuario.trim() || !contrasenia.trim()) {
      Alert.alert('Error', 'Ingrese correo y contraseña')
      return
    }

    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: usuario.trim(),
        password: contrasenia.trim(),
      })

      if (error) {
        Alert.alert('Error', error.message)
        return
      }

      // Guardar refresh token para poder entrar luego con biometría
      const refreshToken = data.session?.refresh_token
      if (refreshToken) {
        await SecureStore.setItemAsync(KEY_REFRESH_TOKEN, refreshToken)
      }

      // Preguntar si quiere activar biometría (solo si está disponible)
      if (bioDisponible && !bioEnabled) {
        Alert.alert(
          'Activar huella / FaceID',
          '¿Quieres iniciar con biometría la próxima vez?',
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Sí',
              onPress: async () => {
                await SecureStore.setItemAsync(KEY_BIO_ENABLED, '1')
                setBioEnabled(true)
                Alert.alert('Listo ', 'Biometría activada')
              },
            },
          ]
        )
      }

      navigation.navigate('Perfil')
    } catch (e: any) {
      console.log(e)
      Alert.alert('Error', e?.message ?? 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  async function loginConBiometria() {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync()
      const enrolled = await LocalAuthentication.isEnrolledAsync()
      if (!compatible || !enrolled) {
        Alert.alert('Biometría', 'Tu dispositivo no tiene huella/FaceID configurado')
        return
      }

      const enabled = (await SecureStore.getItemAsync(KEY_BIO_ENABLED)) === '1'
      if (!enabled) {
        Alert.alert('Biometría', 'Primero inicia sesión con contraseña y actívala')
        return
      }

      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Iniciar con huella / FaceID',
        fallbackLabel: 'Usar contraseña',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      })

      if (!res.success) return

      // recuperar refresh token guardado
      const refreshToken = await SecureStore.getItemAsync(KEY_REFRESH_TOKEN)
      if (!refreshToken) {
        Alert.alert('Biometría', 'No hay sesión guardada. Inicia con contraseña una vez.')
        return
      }

      setLoading(true)

      // recrear sesión con refresh token
      const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
      if (error) {
        // si falla, desactiva biometría para que no moleste
        await SecureStore.deleteItemAsync(KEY_BIO_ENABLED)
        await SecureStore.deleteItemAsync(KEY_REFRESH_TOKEN)
        setBioEnabled(false)
        Alert.alert('Biometría', 'Se venció la sesión. Inicia con contraseña otra vez.')
        return
      }

      // actualizar refresh token
      const newRefresh = data.session?.refresh_token
      if (newRefresh) await SecureStore.setItemAsync(KEY_REFRESH_TOKEN, newRefresh)

      navigation.navigate('Perfil')
    } catch (e: any) {
      console.log(e)
      // no bloquees: usuario puede usar contraseña normal
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require('../assets/image/img2.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <View style={styles.logoGlow}>
              <Image
  source={{ uri: 'https://static.interleo.es/imagenes_big/9789873/978987361266.JPG' }}
  style={styles.logo}
/>

            </View>
            <Text style={styles.titulo}>BIENVENIDO</Text>
            <Text style={styles.subtitulo}>INICIA SESIÓN PARA JUGAR</Text>
          </View>

          {/* FORMULARIO */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="correo"
                placeholderTextColor="#aaa"
                value={usuario}
                onChangeText={setUsuario}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.inputs}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="contraseña"
                placeholderTextColor="#aaa"
                value={contrasenia}
                onChangeText={setContrasenia}
                secureTextEntry
                style={styles.inputs}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={login}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.buttonText}>ENTRAR AL JUEGO</Text>
              )}
            </TouchableOpacity>

            {/* BOTÓN BIOMÉTRICO */}
            {bioDisponible && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.bioButton, loading && { opacity: 0.7 }]}
                onPress={loginConBiometria}
                disabled={loading}
              >
                <Text style={styles.bioButtonText}>ENTRAR CON HUELLA / FACEID</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Welcome')}
            >
              <Text style={styles.secondaryButtonText}>REGRESAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { width, height, position: 'absolute' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: 40 },
  logoGlow: {
    shadowColor: '#a2ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#a2ff00',
  },
  titulo: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  subtitulo: {
    fontSize: 12,
    color: '#a2ff00',
    letterSpacing: 1,
    fontWeight: 'bold',
    marginTop: 5,
  },
  form: { width: '100%', gap: 15 },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(162, 255, 0, 0.3)',
  },
  inputs: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#a2ff00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#a2ff00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },

  bioButton: {
    borderWidth: 2,
    borderColor: '#a2ff00',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(162, 255, 0, 0.10)',
  },
  bioButtonText: {
    color: '#a2ff00',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },

  secondaryButton: { paddingVertical: 10, alignItems: 'center' },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.6,
    fontWeight: 'bold',
  },
})
