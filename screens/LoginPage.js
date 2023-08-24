import { View, Text, TouchableOpacity,StyleSheet,StatusBar,Image } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';

export default function LoginPage({ onLogin }) {
  const [user_name, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const onPressLogin = async () => {
    try {
      const response = await fetch('http://192.168.43.210:3000/api/users/get_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name, password }),
      });

      const data = await response.json();


      if (data.success) {
        onLogin(true, data.user_id);
        // Success unoth home page navigate wenawa
      } else {
        onLogin(false);

      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/logo.png")} />
      <Text style={styles.noteTxt} >Notes App</Text>

<StatusBar style="auto" />
    <View style={styles.inputView}>
      <TextInput
        placeholder="UserName"
        placeholderTextColor="#003f5c"
        onChangeText={setUserName}
        style={styles.TextInput}
      />
       </View>
       <View style={styles.inputView}>
      <TextInput     
      style={styles.TextInput}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#003f5c"
        onChangeText={setPassword}
    
      />
      </View>
      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    
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
  image: {
    marginBottom: 30,
    marginLeft:30,
    width:200,
    height:150,
    borderRadius:50
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 40,
    backgroundColor:"#FFC0CB",
    
  },
 
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
  noteTxt:{
    marginTop:-10,
    marginBottom:20,
    borderRadius:50,
    fontFamily:"Baskerville-Bold",
    fontSize:30
  }
});
