import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import 'expo-dev-client'; // Allows better error messages during development (https://docs.expo.dev/development/installation/#add-better-error-handlers)
import { StyleSheet } from 'react-native';
import AppShell from './app/app-shell/AppShell/AppShell';

const Stack = createNativeStackNavigator();

export default function App() {
  return <AppShell></AppShell>;
}

function myFunc() {
  console.log('dsfrsd');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

registerRootComponent(App);
