import { Image, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native'
import React from 'react'

export default function WelcomeScreen({ navigation }: any) {

    return (
        <ImageBackground 
            source={{ uri: "https://wallpaperaccess.com/full/215112.jpg" }} 
            style={styles.container}
        >
            <View style={styles.overlay}>
                
                <Text style={styles.title}>CAVES GAMES</Text>
                <Text style={styles.subtitle}>Ready to Play?</Text>

                <TouchableOpacity 
                    onPress={() => navigation.navigate("Login")} 
                    style={styles.btnPrimary}
                >
                    <View style={styles.contentBtn}>
                        <Text style={styles.textBtn}>LOGIN</Text>
                        <Image style={styles.icon} source={require("../assets/images/consola.png")} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => navigation.navigate("Register")} 
                    style={styles.btnSecondary}
                >
                    <View style={styles.contentBtn}>
                        <Text style={styles.textBtn}>SIGN UP</Text>
                        <Image style={styles.icon} source={require("../assets/images/motocicleta.png")} />
                    </View>
                </TouchableOpacity>

            </View>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Oscurece la imagen de fondo
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: '#00ffcc', // Verde neón tipo gamer
        fontSize: 45,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 255, 204, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    subtitle: {
        color: 'white',
        fontSize: 18,
        marginBottom: 40,
        letterSpacing: 2
    },
    icon: {
        height: 40,
        width: 40,
        marginLeft: 10
    },
    contentBtn: {
        flexDirection: 'row', 
        alignItems: "center",
    },
    textBtn: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white'
    },
    btnPrimary: {
        backgroundColor: "#6200ee", // Morado eléctrico
        height: 70,
        width: "70%",
        borderRadius: 15, // Menos redondeado para estilo moderno
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        borderWidth: 2,
        borderColor: '#00ffcc'
    },
    btnSecondary: {
        backgroundColor: "transparent",
        height: 70,
        width: "70%",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        borderWidth: 2,
        borderColor: 'white'
    }
})