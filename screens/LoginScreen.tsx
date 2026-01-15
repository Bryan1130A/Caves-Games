import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen({ navigation }: any) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [accepted, setAccepted] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome user</Text>
      <Text style={styles.subtitle}>Sign up to join</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{uri: 'https://i.pravatar.cc/150'}}
          style={styles.avatar}
        />

        <TouchableOpacity style={styles.plusButton}>
          <AntDesign name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={user}
        onChangeText={setUser}
      />

    
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Terms */}
      <TouchableOpacity
        style={styles.termsContainer}
        onPress={() => setAccepted(!accepted)}
      >
        <View style={[styles.checkbox, accepted && styles.checkboxActive]} />
        <Text style={styles.termsText}>
          I agree to the Terms of Service
        </Text>
      </TouchableOpacity>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Back */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginBottom: 25,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 25,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  plusButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#84cc16',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 10,
    borderRadius: 4,
  },
  checkboxActive: {
    backgroundColor: '#84cc16',
  },
  termsText: {
    fontSize: 13,
    color: '#555',
  },
  button: {
    backgroundColor: '#84cc16',
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backText: {
    marginTop: 15,
    color: '#2563eb',
  },
})
