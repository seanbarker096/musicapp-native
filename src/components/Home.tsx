import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function TestApiComponent() {
  const [movies, setMovies] = useState("test");

  const data = {}

  useEffect(() => {
  fetch("api/fileservice/0.1/test/").then((response) => {
      console.log(response);
      setMovies(JSON.stringify(response));
    });
  }, []);

  async function handleButtonClick(){
    const body = {
      uuid: '12345678',
      mime_type: 'application/octet-stream'
    }
    const response = await axios.post("/api/fileservice/0.1/upload/", data, {headers: {"Accept": "application/json"}})
    
  }

  return (
    <View style={styles.container}>
      <Text>{movies}</Text>
      <Button title="test" onPress={handleButtonClick} ></Button>
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
