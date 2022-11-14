import { registerRootComponent } from "expo";
import 'expo-dev-client'; // Allows better error messages during development (https://docs.expo.dev/development/installation/#add-better-error-handlers)
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TestAuth from "./components/Auth";
import TestApiComponent from "./components/Home";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tssx to start dsfasdforking on your app!</Text>
      <StatusBar style="auto" />
      <TestApiComponent></TestApiComponent>
      <TestAuth></TestAuth>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

registerRootComponent(App);
