import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { PermissionStatus } from 'expo-media-library';
import * as mime from 'mime/lite';
import { useState } from "react";
import { Button, StyleSheet, Text, View } from 'react-native';
//TODO: Use npm mime-type module
export default function TestApiComponent() {
  const [movies, setMovies] = useState('original state');
  const [fileUri, setFileUri] = useState('')
  const [ext, setExt] = useState("")
  const [fileId, setFileId] = useState(undefined)

  const uuid = '12345'


  // useEffect(() => {
  //   // TODO: Need to ensure the ENV env var is passed into expo and therefore webpack build so axios works properly
  // // const res = fetch("http://192.168.1.217:5000/api/fileservice/0.1/test/")
  // // .then((response) => response.json())
  // // .then(json => setMovies(json.test));
  // // }, []);


  async function handleUploadButtonClick() {
    await ImagePicker.requestMediaLibraryPermissionsAsync();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    let mimeType: string | null = '';
    if (!result.cancelled) {
      const regexArray = result.uri.match(/\.[0-9a-z]+$/i);
      const extension = regexArray ? regexArray[0] : undefined;
      setExt(extension ?? '');
      mimeType = extension ? mime.getType(result.uri) : '';

      try {
        const response = await FileSystem.uploadAsync(
          `http://192.168.1.217:5000/api/fileservice/0.1/files/upload_file/`,
          result.uri,
          {
            httpMethod: 'POST',
            fieldName: 'file',
            mimeType: 'multipart/form-data',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            parameters: {
              uuid: uuid,
              mime_type: `${mimeType}`,
              file_name: `test-file-name${extension}`,
            },
          },
        );

        const parsed_response = JSON.parse(response.body);

        setFileId(parsed_response.file.id);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function handleDownloadButtonClick(){
    try {
    const response =  await FileSystem.downloadAsync(
      `http://192.168.1.217:5000/api/fileservice/0.1/files/${uuid}/`, 
      FileSystem.documentDirectory + `test.mp4`)
    
        setFileUri(response.uri);
    

    
      const permissionResponse = await MediaLibrary.requestPermissionsAsync()

    
      if (permissionResponse.status === PermissionStatus.GRANTED) {
        const res = await MediaLibrary.saveToLibraryAsync(response.uri);
      }

    } catch(error){
      console.error('error');
    }
}

async function handlePostButtonClick(){
  try {
    const response = await fetch(
      `http://192.168.1.217:5000/api/posts/0.1/posts/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_id: 123,
          content: 'my great post',
          attachment_file_ids: `["${fileId}"]`,
        }),
      },
    );
  } catch(err){
    console.error(err);
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
      <Button title="Download file" onPress={handleDownloadButtonClick}></Button>
    </View>
    <View style={styles.container}>
      <Text>{fileUri}</Text>
      <Button title="Create post" onPress={handlePostButtonClick}></Button>
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
