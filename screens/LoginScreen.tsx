import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, Image,
  Alert, ImageBackground, Dimensions,
} from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../superbase/Config';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {

  const [usuario, setUsuario] = useState('')
  const [contrasenia, setContrasenia] = useState('')

  async function login() {
    if (!usuario.trim() || !contrasenia.trim()) {
      Alert.alert("Error", "Ingrese usuario y contraseña")
      return
    }

    const { data, error } = await supabase
      .from('registro')
      .select('*')

    if (error) {
      Alert.alert("Error", "Error al consultar la base de datos")
      return
    }

    if (!data || data.length === 0) {
      Alert.alert("Error", "No hay usuarios registrados")
      return
    }

    const user = data.find(
      (item: any) =>
        item.usuario?.trim() === usuario.trim() &&
        item.contrasenia?.trim() === contrasenia.trim()
    )

    if (!user) {
      Alert.alert("Error", "Usuario o contraseña incorrectos")
      return
    }

    navigation.navigate('Home') 
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
                source={{ uri: 'data:image/jpeg;base64,/9j/4QWCRXhpZgAASUkq...' }} // Tu Base64
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
                placeholder="USUARIO"
                placeholderTextColor="#aaa"
                onChangeText={(texto) => setUsuario(texto)}
                style={styles.inputs}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="CONTRASEÑA"
                placeholderTextColor="#aaa"
                onChangeText={(texto) => setContrasenia(texto)}
                secureTextEntry={true}
                style={styles.inputs}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.primaryButton}
              onPress={() => login()}
            >
              <Text style={styles.buttonText}>ENTRAR AL JUEGO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Welcome')} // Para volver
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
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    width: width,
    height: height,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
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
  form: {
    width: '100%',
    gap: 15,
  },
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
  secondaryButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.6,
    fontWeight: 'bold',
  }
})