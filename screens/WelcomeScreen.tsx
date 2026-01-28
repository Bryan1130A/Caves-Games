import { StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground, Dimensions } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ImageBackground
        source={require('../assets/image/img1.webp')} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>

          <View style={styles.header}>
            <View style={styles.logoGlow}>
              <Image
                source={{ uri: 'data:image/jpeg;base64,/9j/4QWCRXhpZgAA...' }} 
                style={styles.logo}
              />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>CAVES <Text style={styles.highlight}>GAMES</Text></Text>
            <View style={styles.divider} />
            <Text style={styles.subtitle}>EL NIVEL SIGUIENTE COMIENZA AQUÍ</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Login')} 
            >
              <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')} 
            >
              <Text style={styles.registerButtonText}>REGISTRARSE</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    paddingHorizontal: 30,
    paddingVertical: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
  },
  logoGlow: {
    shadowColor: '#a2ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
    backgroundColor: 'rgba(162, 255, 0, 0.1)',
    borderRadius: 75,
    padding: 10,
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#a2ff00',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  highlight: {
    color: '#a2ff00',
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: '#a2ff00',
    marginVertical: 15,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    letterSpacing: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    width: '100%',
    marginBottom: 30,
    gap: 12, 
  },
  primaryButton: {
    backgroundColor: '#a2ff00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#a2ff00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff', 
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
})