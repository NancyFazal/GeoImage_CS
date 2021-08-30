import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
const axios = require('axios');
export default function PhotoHandler() {
    const [pickedImage, setPickedImage] = useState(null); 
    const [postId, setPostID] = useState({});
    const [error, setError] = useState();
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
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              //allowsEditing: true,
              quality: 1,
              aspect: [1, 1],
              base64: true,
              exif: true
          }); 
        console.log('Media type:', image.mediaTypes)
        console.log('EXIF', image.exif)
        //console.log('EXPO', image.base64)
         setPickedImage(image.base64);
    };
    //WHATWG fetch API
//  const toDataURL = url => fetch(url)
//   .then(response => response.blob())
//   .then(blob => new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.onloadend = () => resolve(reader.result)
//     reader.onerror = reject
//     reader.readAsDataURL(blob)
//   }))
// toDataURL(pickedImage)
//   .then(dataUrl => {
//     console.log('RESULT:', dataUrl)
//   })
    //
    // var headers = {
    //     "Content-Type": "application/json",                                                                                                
    //     "Access-Control-Origin": "*"
    //  }     
    const param = {
        request_type: "upload_photo",
            UserId: "629",
            Latitude: "1",
            Longitude: "2",
            LatitudeFromOSM: "3",
            LongitudeFromOSM: "4",
            Timestamp: "1629360683",
            Direction: "0",
            Description: "app_testing",
            Project: "NancyGame",
            Format: "jpg",
            Valid: "Y",
            Software: "NancyGame_v01",
            Phone: "Android",
            img_data:pickedImage
    };
    //let formData = new URLSearchParams();
    // //let formData = new FormData();
    // formData.append('request_type', 'upload_photo');
    // formData.append('UserId', 629);
    // formData.append('Latitude',1);
    // formData.append('Longitude', 2);
    // formData.append('LatitudeFromOSM', 9);
    // formData.append('LatitudeFromOSM', 9);
    // formData.append('Timestamp', 6216293606839);
    // formData.append('Direction', 0);
    // formData.append('Description', 'app_testing');
    // formData.append('Project', 'NancyGame');
    // formData.append('Format', 'jpg');
    // formData.append('Valid', 'Y');
    // formData.append('Software', 'NancyGame_v01');
    // formData.append('Phone', 'Android');
    // formData.append('img_data', pickedImage);
    // console.log(formData);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(param)  
    };
    // useEffect(() => {
        // (async () => {
        // const param = {
        //     request_type: "upload_photo",
        //     UserId: "629",
        //     Latitude: "1",
        //     Longitude: "2",
        //     LatitudeFromOSM: "3",
        //     LongitudeFromOSM: "4",
        //     Timestamp: "1629669054",
        //     Direction: "0",
        //     Description: "app_testingss",
        //     Project: "NancyGame",
        //     Format: "jpg",
        //     Valid: "Y",
        //     Software: "NancyGame_v01",
        //     Phone: "Android",
        //     img_data:pickedImage
        // };
        // const response = await axios.post('http://cs.uef.fi/mopsi_dev/nancy/server.php?param=', param)
        //   console.log(response);
        // })
        //   .then((response) => {
        //     console.log(response);
        //   }, (error) => {
        //     console.log(error);
        //   });
    //      fetch('http://cs.uef.fi/mopsi_dev/nancy/server.php?', options)
    //     .then( response => response.json() )
    //     .then( response => {console.log(response)})
    //     .catch(error =>{
    //         console.log("Error: ". error)
    //     }) 
    // }, [pickedImage])
    useEffect(() => {
        console.log("inside useeffect of Photo Component");
        //const param = `request_type=upload_photo&UserId=629&Latitude=1&Longitude=2&LatitudeFromOSM=3&LongitudeFromOSM=4&Timestamp=1629360683&Direction=0&Description=app_testing&Project=NancyGame&Format=jpg&Valid=Y&Software=NancyGame_v01&Phone=Android&img_data=`,${pickedImage};
        const requestOptions = {
            method: 'POST',
            //headers: 'Content-Type: application/json'
            headers: 'Content-type: application/x-www-form-urlencoded',
            //body: JSON.stringify(param)
        };
        //fetch('http://cs.uef.fi/mopsi_dev/nancy/server.php',requestOptions)
        if(pickedImage != null){
            let response = fetch(`http://cs.uef.fi/mopsi_dev/nancy/server.php?param={"request_type":"upload_photo","UserId":"629","Latitude":"1","Longitude":"2","LatitudeFromOSM":"3","LongitudeFromOSM":"4","Timestamp":"1630055818","Direction":"0","Description":"friday","Project":"NancyGame","Format":"jpg","Valid":"Y","Software":"NancyGame_v01","Phone":"Android","img_data":"${pickedImage}"}`, requestOptions)
            .then(response => response.json())
            .then(console.log(response))
            //.then(data => console.log('success'));
            //new approach
            // .then(data => {
            //     if (!data.ok) {
            //       throw Error(data.status);
            //      }
            //      return data.json();
            //     }).then(data => {
            //     console.log(data);
            //     })
                .catch(e => {
                console.log(e);
                });
        }
        else{
            return;
        }
        //
    //     //new code block
    //     .then(async response => {
    //         const isJson = response.headers.get('content-type')?.includes('multipart/form-data');
    //         const data = isJson && await response.json();
    //         console.log("data from photo");
    //         console.log(data);

    //         // check for error response
    //         if (!response.ok) {
    //             // get error message from body or default to response status
    //             const error = (data && data.message) || response.status;
    //             return Promise.reject(error);
    //             console.log(error);
    //         }

    //         //setPostID({ postId: data.id })
    //     })
    //     .catch(error => {
    //         setError({ errorMessage: error.toString() });
    //        console.error('There was an error!', error);
    //        console.log("error from photo component". error)
    //     });
    //     //ends here
     }, [pickedImage])
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
        flex: 1,
        marginTop: 30

    }
});