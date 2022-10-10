import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TestApiComponent from "./components/Home";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tssx to start dsfasdforking on your app!</Text>
      <StatusBar style="auto" />
      <TestApiComponent></TestApiComponent>
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
