import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';

export default function RegisterScreen() {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const registrar = async () => {
    if (!usuario || !correo || !telefono || !contrasenia) {
      Alert.alert('Error', 'Llena todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario,
          correo,
          telefono,
          contrasenia,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.error || 'No se pudo registrar');
        return;
      }

      Alert.alert('Éxito', 'Usuario registrado correctamente');

      setUsuario('');
      setCorreo('');
      setTelefono('');
      setContrasenia('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Usuario"
        style={styles.input}
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        placeholder="Correo"
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={contrasenia}
        onChangeText={setContrasenia}
        secureTextEntry
      />

      <TouchableOpacity style={styles.boton} onPress={registrar}>
        <Text style={styles.textoBoton}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  boton: {
    backgroundColor: '#80FF00',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    fontWeight: 'bold',
    color: '#000',
  },
});