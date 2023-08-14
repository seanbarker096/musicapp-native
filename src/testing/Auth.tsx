
import { Button, StyleSheet, View } from 'react-native';
// import * as Keychain from 'react-native-keychain';
import * as SecureStore from 'expo-secure-store';

export default function TestAuthComponent() {
 
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
        
        const json = await response.json();
        
        // let result = await Keychain.setGenericPassword('access_token', json.token, {service: "music_app_access"});
        // let result2 = await Keychain.setGenericPassword("refresh_token", json.r_token, {service: "music_app_refresh"})

        let reuslt = await SecureStore.setItemAsync('access_token', json.token)
        let result2 = await SecureStore.setItemAsync('refresh_token', json.r_token)
    
        } catch(error){
          console.warn(error);
        }
  }

  async function handleGetTokens(){
     let accessToken = await SecureStore.getItemAsync('access_token');
     let refreshToken = await SecureStore.getItemAsync('refresh_token');
  }

  async function handleLogin(){
    try {
    const response =  await fetch(`http://192.168.1.217:5000/api/auth/0.1/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'seanbarker',
                password: 'test',
            })
        })
      } catch(error) {
        console.error(error);
      }
  }
  
  return (
    <>
    <View style={styles.container}>
      <Button title="Sign Up" onPress={handleSignUpClick} ></Button>
    </View>
    <View style={styles.container}>
      <Button title="Get tokens" onPress={handleGetTokens} ></Button>
    </View>
    <View style={styles.container}>
      <Button title="Login" onPress={handleLogin} ></Button>
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