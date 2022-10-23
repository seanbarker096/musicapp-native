import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from 'react-native';

export default function TestApiComponent() {
  const [movies, setMovies] = useState('original state');

  useEffect(() => {
    // TODO: Need to ensure the ENV env var is passed into expo and therefore webpack build so axios works properly
  console.log("sdfdsafsda")
  const res = fetch("http://192.168.1.217:5000/api/fileservice/0.1/test/")
  .then((response) => response.json())
  .then(json => setMovies(json.test));
  }, []);

  async function handleButtonClick(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });
    
    console.log(result)

    if (!result.cancelled) {
      console.log(result)

      console.log(result);

      const response = await FileSystem.uploadAsync(`http://192.168.1.217:5000/api/fileservice/0.1/upload_file`, result.uri, {
      httpMethod: 'POST',
      fieldName: 'file',
      mimeType: 'multipart/form-data',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      parameters: {'uuid': '12345'}
    });
  
    console.log("file upload response", response)
    }

 
    
  }

  return (
    <View style={styles.container}>
      <Text>{movies}</Text>
      <Button title="Upload file" onPress={handleButtonClick} ></Button>
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
