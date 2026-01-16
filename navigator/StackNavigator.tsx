
import GameScreen from "../screens/GameScreen"
import LoginScreen from "../screens/LoginScreen"
import PerfilScreen from "../screens/PerfilScreen";
import RegisterScreen from "../screens/RegisterScreen"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from "../screens/WelcomeScreen";
import ScoreScreen from "../screens/ScoreScreen";

const Stack = createNativeStackNavigator()

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Score" component={ScoreScreen} />

      

    </Stack.Navigator>
  )
}

