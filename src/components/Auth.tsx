
import { Button, StyleSheet, View } from 'react-native';
// import * as Keychain from 'react-native-keychain';

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
        
        const json = await response.json()
        console.log(response)
        
        // let result = await Keychain.setGenericPassword('access_token', json.token, {service: "music_app_access"});
        // let result2 = await Keychain.setGenericPassword("refresh_token", json.r_token, {service: "music_app_refresh"})
    
        } catch(error){
          console.log("error")
          console.log(error)
        }
  }

  async function handleGetTokens(){
    // let accessToken = await Keychain.getGenericPassword({service:"music_app_access"});
    // let refreshToken = await Keychain.getGenericPassword({service: "music_app_refresh"});

    // console.log("accessToken", accessToken)
    // console.log("refresh token", refreshToken)
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