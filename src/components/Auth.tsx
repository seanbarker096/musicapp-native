import * as SecureStore from 'expo-secure-store';
import { Button, StyleSheet, View } from 'react-native';


//TODO: Use npm mime-type module
export default function TestAuth() {

  async function handleSignUpClick(){
    try {
        const response =  await fetch(`http://192.168.1.217:5000/api/auth/0.1/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'seanbarker',
                password: 'test',
                first_name: 'Sean',
                second_name: 'Barker',
                email: 'sbarker@email.com'
            })
        })
        
        const json = await response.json()
        console.log(response)
        
        let result = await SecureStore.setItemAsync("music_app_a_tk", json.token)
        let result2 = await SecureStore.setItemAsync("music_app_r_tk", json.r_token)
    
        } catch(error){
          console.log("error")
          console.log(error)
        }
  }

  async function getTokens(){
    
  }

  return (
    <>
    <View style={styles.container}>
      <Button title="Sign Up" onPress={handleSignUpClick} ></Button>
    </View>
    <View style={styles.container}>
      <Button title="Get tokens" onPress={handleGetTokens} ></Button>
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
