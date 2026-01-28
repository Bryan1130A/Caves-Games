import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  TouchableOpacity, 
  Image, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ImageBackground,
  Dimensions
} from 'react-native';
import { supabase } from '../superbase/Config';

const { height, width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }: any) {
  const [usuario, setusuario] = useState('');
  const [correo, setcorreo] = useState('');
  const [telefono, settelefono] = useState('');
  const [contrasenia, setcontrasenia] = useState('');

  async function registro() {
    if (!usuario || !correo || !telefono || !contrasenia) {
      Alert.alert("CAMPOS INCOMPLETOS", "Debes llenar todos los datos para la batalla.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: correo,
      password: contrasenia,
    });

    if (error) {
      Alert.alert("ERROR DE ACCESO", error.message);
      return;
    }

    if (data.user != null) {
      GuardarRegistro(data.user.id);
      navigation.navigate("Login");
    }
  }

  async function GuardarRegistro(uid: string) {
    const { error } = await supabase
      .from('registro')
      .insert([{ uid, usuario, correo, telefono }]);

    if (error) {
      Alert.alert("ERROR DB", error.message);
    } else {
      Alert.alert("¡REGISTRADO!", "Tu perfil ha sido creado.");
      limpiarCampos();
    }
  }

  function limpiarCampos() {
    setusuario(''); setcorreo(''); settelefono(''); setcontrasenia('');
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/image/img3.webp')} // Tu imagen de soldado
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{flex: 1}}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContainer} 
              showsVerticalScrollIndicator={false}
            >
              
              <View style={styles.logoContainer}>
                <View style={styles.neonCircle}>
                  <Image
                    source={{ uri: 'https://www.freepik.com/photos/gaming-logo-png' }} 
                    style={styles.logo}
                  />
                </View>
              </View>

              <Text style={styles.mainTitle}>REGISTRO</Text>
              <Text style={styles.subTitle}>ÚNETE AL ESCUADRÓN</Text>

              <View style={styles.form}>
                <TextInput
                  placeholder="NOMBRE DE USUARIO"
                  placeholderTextColor="#888"
                  style={styles.input}
                  onChangeText={setusuario}
                  value={usuario}
                />
                <TextInput
                  placeholder="CORREO ELECTRÓNICO"
                  placeholderTextColor="#888"
                  style={styles.input}
                  keyboardType="email-address"
                  onChangeText={setcorreo}
                  value={correo}
                />
                <TextInput
                  placeholder="TELÉFONO"
                  placeholderTextColor="#888"
                  style={styles.input}
                  keyboardType="phone-pad"
                  onChangeText={settelefono}
                  value={telefono}
                />
                <TextInput
                  placeholder="CONTRASEÑA"
                  placeholderTextColor="#888"
                  style={styles.input}
                  secureTextEntry={true}
                  onChangeText={setcontrasenia}
                  value={contrasenia}
                />

                <TouchableOpacity style={styles.btnMain} onPress={registro}>
                  <Text style={styles.btnText}>REGISTRARSE</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.backLink}>
                  <Text style={styles.backText}>REGRESAR</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  background: { 
    width: width, 
    height: height, 
    position: 'absolute' 
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    paddingHorizontal: 40 
  },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingVertical: 50
  },
  logoContainer: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neonCircle: {
    borderWidth: 3,
    borderColor: '#80FF00',
    borderRadius: 60,
    padding: 10,
    shadowColor: '#80FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 20, 
  },
  logo: { 
    width: 80, 
    height: 80,
    borderRadius: 40
  },
  mainTitle: { 
    fontSize: 30, 
    fontWeight: '900', 
    color: '#FFF', 
    letterSpacing: 3 
  },
  subTitle: { 
    fontSize: 12, 
    color: '#80FF00', 
    fontWeight: 'bold', 
    marginBottom: 30, 
    letterSpacing: 2 
  },
  form: { 
    width: '100%' 
  },
  input: {
    backgroundColor: '#FFF', 
    borderRadius: 5,
    padding: 15,
    fontSize: 14,
    color: '#000',
    marginBottom: 15,
    fontWeight: 'bold'
  },
  btnMain: {
    backgroundColor: '#80FF00', 
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    // Sombra del botón
    shadowColor: '#80FF00',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  btnText: { 
    color: '#000', 
    fontSize: 16, 
    fontWeight: '900' 
  },
  backLink: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  backText: { 
    color: '#AAA', 
    fontSize: 12, 
    fontWeight: 'bold' 
  }
});