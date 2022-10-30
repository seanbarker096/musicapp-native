import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { PermissionStatus } from 'expo-media-library';
import * as mime from 'mime';
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from 'react-native';

const EXT_TO_MIME_TYPE_MAP: {[index: string]: string}
= {
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".mp4": "video/mp4"
}

//TODO: Use npm mime-type module
export default function TestApiComponent() {
  const [movies, setMovies] = useState('original state');
  const [fileUri, setFileUri] = useState('')
  const [ext, setExt] = useState("")

  const uuid = '12345'

  useEffect(() => {
    // TODO: Need to ensure the ENV env var is passed into expo and therefore webpack build so axios works properly
  const res = fetch("http://192.168.1.217:5000/api/fileservice/0.1/test/")
  .then((response) => response.json())
  .then(json => setMovies(json.test));
  }, []);

  async function handleUploadButtonClick(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    let mimeType: string| null = ""
    if(!result.cancelled){
      console.log(result.uri)
      const regexArray = result.uri.match(/\.[0-9a-z]+$/i)
      const extension = regexArray ? regexArray[0] : undefined
      setExt(extension ?? "")
      console.log(extension)
      mimeType = extension ? mime.getType(result.uri) : ""
    }
    


    if (!result.cancelled) {
      console.log(mimeType)
       try {

      const response = await FileSystem.uploadAsync(`http://192.168.1.217:5000/api/fileservice/0.1/files/upload_file`, result.uri, {
      httpMethod: 'POST',
      fieldName: 'file',
      mimeType: 'multipart/form-data',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      parameters: {'uuid': uuid, 'mime_type': `${mimeType}`} 
    });
    console.log("file upload response", response)
  }catch(error){
    console.log(error)
  }
  
   
    }
  }

  async function handleDownloadButtonClick(){
    try {
    const response =  await FileSystem.downloadAsync(
      `http://192.168.1.217:5000/api/fileservice/0.1/files/${uuid}`, 
      FileSystem.documentDirectory + `test.jpg`)
     
        console.log(response)
        setFileUri(response.uri)
    

    
        console.log("requesting perms")
      const permissionResponse = await MediaLibrary.requestPermissionsAsync()

      console.log("checking access", permissionResponse)
      if(permissionResponse.status === PermissionStatus.GRANTED){
        console.log("saving to library")
        console.log(response.uri)
        const res = await MediaLibrary.saveToLibraryAsync(response.uri)
        console.log("saved", res)
      }

    } catch(error){
      console.log("error")
      console.log(error)
    }
}

  return (
    <>
    <View style={styles.container}>
      <Text>{movies}</Text>
      <Button title="Upload file" onPress={handleUploadButtonClick} ></Button>
    </View>
    <View style={styles.container}>
      <Text>{fileUri}</Text>
      <Button title="Download file" onPress={handleDownloadButtonClick} ></Button>
    </View>
  </>
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
