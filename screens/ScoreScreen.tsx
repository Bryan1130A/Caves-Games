import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ScoreScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Puntajes</Text>

      <View style={styles.card}>
        <Text style={styles.name}>Jugador: Bryan</Text>
        <Text style={styles.score}>Puntos: 1500</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>Jugador: Alex</Text>
        <Text style={styles.score}>Puntos: 1200</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>Jugador: Maria</Text>
        <Text style={styles.score}>Puntos: 980</Text>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,                     
    backgroundColor: '#fff',
    padding: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0dc0ec',            // azul del login
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f1f5f9',  // gris claro
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#0dc0ec',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 16,
    color: '#555',
  },
})
