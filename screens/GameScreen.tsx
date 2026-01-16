import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

export default function GameScreen() {
  return (
    <View style={styles.container}>

      <Image
source={{ uri: 'https://www.trecebits.com/wp-content/uploads/2023/07/Juegos-de-Tetris.webp' }}
       style={styles.image}
      />

      <Text style={styles.title}>Zona de Juego</Text>
      <Text style={styles.subtitle}>Prepárate para jugar 🎮</Text>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,                      
    justifyContent: 'center',     
    alignItems: 'center',        
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: 250,                  
    height: 180,                 
    resizeMode: 'contain',       
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',             
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
})
