import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, StyleSheet, Button, Alert, Image, ActivityIndicator} from 'react-native';
import axios from 'axios';
export default function Login() {
    const [isLoading, setLoading] = useState(true);  
    const [isloggedin, setIsloggedin] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState([]);
    console.log(name);
    console.log(password);
    const onLoginClick = ()=>{
      if(name === ''){
        Alert.alert(
          "Username is missing",
          "enter your name",
          [
            { text: "OK"}
          ]
        );
      }
      else if(password ===''){
        Alert.alert(
          "Password is missing",
          "enter your password",
          [
            { text: "OK"}
          ]
        );
      }
      else {
      console.log("Login button clicked");
        // axios
        //   .get('https://jsonplaceholder.typicode.com/posts/1')
        //   .then((response)=> {
        //     console.log('resolved');
        //     return response.json();
        //   }).then (data =>{
        //     console.log(data);
        //   })
        //   .catch(function (error) {
        //     // handle error
        //     alert(error.message);
        //   })
        //   .finally(function () {
        //     // always executed
        //     alert('Finally called');
        //   });
      
      fetch(`https://cs.uef.fi/mopsi_dev/nancy/server.php?param={%22request_type%22:%22login_to_mopsi%22,%22username%22:%22${name}%22,%22password%22:%22${password}%22}`)
      //fetch('http://cs.uef.fi/mopsi_dev/nancy/server.php?param={"request_type":"login_to_mopsi","username":"nancy","password":"nanbarcyook"}')
      .then((response)=>{
      console.log('resolved');
      return response.json();
    }).then(data=>{
      //setResponse(JSON.parse(data));
      console.log(data);
    }).catch((err)=>{
      console.log('rejected', err);
    })
    //Using traditional http request method
//     var request = new XMLHttpRequest();
//     request.onreadystatechange = (e) => {
//         if (request.readyState !== 4) {
//         return;
//   }
//   if (request.status === 200) {
//     console.log('success', request.responseText);
//   } else {
//     console.error('error');
//   }
// };
// request.open('GET', 'http://cs.uef.fi/mopsi_dev/nancy/server.php?param={"request_type":"login_to_mopsi","username":"nancy","password":"nanbarcyook"}');
// request.send();
//http ends here
      }
  } 
  return (
        <View style={styles.container}>
        <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../assets/Logo.png')}/>
        </View>
        <TextInput
          value={name}
          onChangeText={name =>setName(name)}
          placeholder={'Username'}
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={password=> setPassword(password)}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
        />
        <Button
          title={'Login'}
          style={styles.input} 
          onPress={onLoginClick}
          />
        </View>
    )
  }
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    input: {
      width: 220,
      height: 44,
      padding: 10,
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 10,
    },
    imageContainer: {
      height: '22%',
      width: '37%',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'black',
      marginVertical: 20,
      overflow:'hidden',
    },
    image:{
      height: '100%',
      width: '100%'
    }
  });