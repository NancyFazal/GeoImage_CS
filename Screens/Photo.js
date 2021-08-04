import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
export default function PhotoHandler() {
    const [pickedImage, setPickedImage] = useState(); 
    const verifyPermissions = async () =>{
        const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if(result.status != 'granted'){
            Alert.alert(
                'Insufficient Permissions!',
                'You need to grant camera permissions to use this app',
                [{text: 'Okay'}]
            );
            return false;
        }
            return true;

    };
    const imagetakenHandler = async () =>{
        const hasPermission = await verifyPermissions();
        if(!hasPermission){
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 0.5,
              base64: true
          }); 
          console.log(image);
         //setPickedImage(image);
    };
    return (
        <View style={styles.container}>
            {/* {Alert.alert(
            "Success",
            "Take photo",
            [
              {text: "Open Camera",
              onPress: () => {imagetakenHandler}
              },
            ]
          )}   */}
          <Button 
          title= 'Open Camera' 
          onPress= {imagetakenHandler}
          />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});