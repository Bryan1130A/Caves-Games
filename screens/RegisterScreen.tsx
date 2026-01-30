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
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import { supabase } from '../superbase/Config';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system'; 

const { height, width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }: any) {
  const [usuario, setusuario] = useState('');
  const [correo, setcorreo] = useState('');
  const [telefono, settelefono] = useState('');
  const [contrasenia, setcontrasenia] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

  const seleccionarImagen = () => {
    Alert.alert(
      "FOTO DE PERFIL",
      "Selecciona una opción para tu avatar:",
      [
        { text: "Cámara", onPress: () => abrirCamara() },
        { text: "Galería", onPress: () => abrirGaleria() },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const abrirCamara = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return Alert.alert("Error", "Permiso denegado");
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const abrirGaleria = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  async function subirFotoStorage(uri: string, userId: string) {
    try {
      if (!uri) return null;

      const file = new File(uri);
      const matrizBits = await file.bytes();
      
      const fileName = `usuarios/${userId}.png`;
      
      const { data, error } = await supabase.storage
        .from('perfiles')
        .upload(fileName, matrizBits, {
          contentType: 'image/png',
          upsert: true 
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('perfiles')
        .getPublicUrl(fileName);

      return urlData.publicUrl;

    } catch (e) {
      console.log("Error al subir imagen:", e);
      return null;
    }
  }

  async function registro() {
    if (!usuario || !correo || !telefono || !contrasenia) {
      Alert.alert("CAMPOS INCOMPLETOS", "Llena todos los datos.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({ 
        email: correo, 
        password: contrasenia 
      });

      if (authError) throw authError;

      if (data.user != null) {
        let fotoUrl = null;
        
        if (image) {
          fotoUrl = await subirFotoStorage(image, data.user.id);
        }

        await GuardarRegistro(data.user.id, fotoUrl);
      }
    } catch (error: any) {
      Alert.alert("ERROR", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function GuardarRegistro(uid: string, fotoUrl: string | null) {
    const { error } = await supabase
      .from('registro')
      .insert([
        { 
          uid: uid, 
          usuario: usuario, 
          correo: correo, 
          telefono: telefono, 
          avatar: fotoUrl 
        }
      ]);

    if (error) {
      Alert.alert("ERROR DB", error.message);
    } else {
      Alert.alert("¡ÉXITO!", "Usuario creado correctamente.");
      navigation.navigate("Login");
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/image/img3.webp')} style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
              
              <View style={styles.logoContainer}>
                <TouchableOpacity style={styles.neonCircle} onPress={seleccionarImagen}>
                  <Image
                    source={image ? { uri: image } : { uri: 'https://cdn-icons-png.flaticon.com/512/3242/3242257.png' }} 
                    style={styles.logo}
                  />
                </TouchableOpacity>
                <Text style={styles.uploadText}>SUBIR FOTO</Text>
              </View>

              <Text style={styles.mainTitle}>REGISTRO</Text>
              <Text style={styles.subTitle}>ÚNETE AL ESCUADRÓN</Text>

              <View style={styles.form}>
                <TextInput placeholder="NOMBRE DE USUARIO" placeholderTextColor="#888" style={styles.input} onChangeText={setusuario} value={usuario} />
                <TextInput placeholder="CORREO ELECTRÓNICO" placeholderTextColor="#888" style={styles.input} keyboardType="email-address" onChangeText={setcorreo} value={correo} />
                <TextInput placeholder="TELÉFONO" placeholderTextColor="#888" style={styles.input} keyboardType="phone-pad" onChangeText={settelefono} value={telefono} />
                <TextInput placeholder="CONTRASEÑA" placeholderTextColor="#888" style={styles.input} secureTextEntry={true} onChangeText={setcontrasenia} value={contrasenia} />

                <TouchableOpacity style={styles.btnMain} onPress={registro} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.btnText}>REGISTRARSE</Text>
                  )}
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
  container: { flex: 1, backgroundColor: '#000' },
  background: { width: width, height: height, position: 'absolute' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 40 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  logoContainer: { marginBottom: 15, alignItems: 'center' },
  neonCircle: {
    borderWidth: 3, borderColor: '#80FF00', borderRadius: 60, padding: 2,
    shadowColor: '#80FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15, elevation: 20, 
  },
  logo: { width: 100, height: 100, borderRadius: 50 },
  uploadText: { color: '#80FF00', fontSize: 10, marginTop: 5, fontWeight: 'bold' },
  mainTitle: { fontSize: 30, fontWeight: '900', color: '#FFF', letterSpacing: 3 },
  subTitle: { fontSize: 12, color: '#80FF00', fontWeight: 'bold', marginBottom: 30, letterSpacing: 2 },
  form: { width: '100%' },
  input: { backgroundColor: '#FFF', borderRadius: 5, padding: 15, fontSize: 14, color: '#000', marginBottom: 15, fontWeight: 'bold' },
  btnMain: { backgroundColor: '#80FF00', paddingVertical: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#000', fontSize: 16, fontWeight: '900' },
  backLink: { marginTop: 20, alignItems: 'center' },
  backText: { color: '#AAA', fontSize: 12, fontWeight: 'bold' }
});