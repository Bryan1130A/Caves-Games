import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GameScreen from "../screens/GameScreen";
import LoginScreen from "../screens/LoginScreen";
import PerfilScreen from "../screens/PerfilScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import ScoreScreen from "../screens/ScoreScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Game" component={GameScreen} options={{headerShown: false}} />
      <Stack.Screen name="Perfil" component={PerfilScreen} options={{headerShown: false}} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Score" component={ScoreScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}
