import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button, Alert} from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView , {Marker, Circle} from 'react-native-maps';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import * as geolib from 'geolib';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  //new
  const [isChangingRadius, setIsChangingRadius] = useState(false);
  const [radius, setRadius] = useState(100);
  const changeRadiusHandler = () =>{
    setIsChangingRadius(true);
  };
  const onFinishRadiusEdit = () =>{
    setIsChangingRadius(false);
  }
  //
  const [pickedLocation, setPickedLocation] = useState({
        latitude:62.59828203570094,
        longitude:29.743811008682826
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
       latitude: 37.090,
        longitude: 95.712,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    });
  const [center, setCenter] = useState({
    latitude:62.59828203570094,
    longitude:29.743811008682826
  });
  /*const updateRadius = (e) =>({
      return (
        
      )
  }) */
  useEffect(() => {
    const verifyPermissions = async () => {
      const result = await Permissions.askAsync(Permissions.LOCATION);
      if (result.status !== 'granted') {
        Alert.alert(
          'Insufficient permissions!',
          'You need to grant location permissions to use this app.',
          [{ text: 'Okay' }]
        );
        return false;
      }
      return true;
    };
    (async () => {
      const hasPermission = await verifyPermissions();
      if (!hasPermission) {
        return;
      }
      try {
        setIsFetching(true);
        const location = await Location.getCurrentPositionAsync({
          timeout: 5000
        });
        setPickedLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003 
        });

      } catch (err) {
        Alert.alert(
          'Could not fetch location!',
          'Please try again later or pick a location on the map.',
          [{ text: 'Okay' }]
        );
      }
      setIsFetching(false);
    }) (); 
  },[]);
  return (
    <View style={styles.container}>
    <Header title="O-Mopsi"/>
      <MapView style={styles.mapContainer} 
        //provider={MapView.PROVIDER_GOOGLE}
        region = {{latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta}}
              //showsUserLocation={true}
              //followUserLocation={true}
        >
        <MapView.Marker
            coordinate={{
            latitude: region.latitude,
            longitude:region.longitude}}
            title={radius.toString()+ 'm'}
         />
         <MapView.Circle
                key = { (region.latitude + region.longitude).toString() }
                center = {pickedLocation}
                radius = {radius}
                strokeWidth = { 2 }
                strokeColor = { '#1a66ff' }
                fillColor = { 'rgba(230,238,255,0.5)' }
        />
        </MapView>
        <View style={styles.footer}>
            {isChangingRadius == true
           ? (<View style={styles.buttonContainer}>
            <Button title="Increase" onPress={()=>setRadius(radius+5)}/>
            <Button title= "Ok" onPress={()=>setIsChangingRadius(false)}/>
            <Button title="decrease" onPress={()=>setRadius(radius-5)}/>
            </View>)
           : <Button title="Reset Radius" onPress={changeRadiusHandler}/>
          }     
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  mapContainer: {
    width: '100%',
    height: 500,
    marginBottom: 20  
  },
  footer:{
    width: '100%',
    height: 70,
    backgroundColor:'#FF7F50',
    alignItems: 'center',
    justifyContent: 'center'
},
buttonContainer:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly'
}
});
