import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Button, StyleSheet, Text, View } from 'react-native';

export default function TestApiComponent() {
  const [movies, setMovies] = useState("test");

  // useEffect(() => {
  // axios.get("api/fileservice/0.1/test/").then((response) => {
  //     console.log(response);
  //     setMovies(JSON.stringify(response));
  //   });
  // }, []);

  async function handleButtonClick(){

    await ImagePicker.requestMediaLibraryPermissionsAsync(false)

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    
    console.log(result)

    if (!result.cancelled) {
      console.log(result)

      console.log(result);

      const response = await FileSystem.uploadAsync(`http://127.0.0.1:5000/api/fileservice/0.1/upload/1234`, result.uri, {
      fieldName: 'bytes',
      httpMethod: 'PATCH',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
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
