import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
  // Estados para capturar los datos
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [age, setAge] = useState('');

  return (
    <ImageBackground 
      source={{ uri: "https://wallpaperaccess.com/full/215112.jpg" }} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <Text style={styles.title}>NEW PLAYER</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        <View style={styles.inputContainer}>
          {/* Campo 1: Username */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaa"
            onChangeText={setUsername}
          />

          {/* Campo 2: GamerTag (ID de juego) */}
          <TextInput
            style={styles.input}
            placeholder="GamerTag (e.g. Ghost99)"
            placeholderTextColor="#aaa"
            onChangeText={setGamerTag}
          />

          {/* Campo 3: Email */}
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            onChangeText={setEmail}
          />

          {/* Campo 4: Edad */}
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            onChangeText={setAge}
          />

          {/* Campo 5: Contraseña */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={styles.btnRegister} 
          onPress={() => alert(`Bienvenido, ${gamerTag}!`)}
        >
          <Text style={styles.btnText}>START ADVENTURE</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flexGrow: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', // Más oscuro para leer mejor los inputs
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  title: {
    color: '#00ffcc',
    fontSize: 40,
    fontWeight: 'bold',
    textShadowColor: '#00ffcc',
    textShadowRadius: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 30,
  },
  inputContainer: {
    width: '85%',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  btnRegister: {
    backgroundColor: '#00ffcc',
    width: '85%',
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#00ffcc',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  btnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: 'white',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});