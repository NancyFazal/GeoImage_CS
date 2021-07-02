import React, { useState } from 'react';
import {View, Button, Text, ActivityIndicator, Alert, StyleSheet} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView , {Marker} from 'react-native-maps';
import Header from '../Components/Header';

const LocationPicker = props =>{
    const [isFetching, setIsFetching] = useState(false);
    const [pickedLocation, setPickedLocation] = useState();
    const [region, setRegion] = useState({
      latitude: 37.090,
       longitude: 95.712,
       latitudeDelta: 0.001,
       longitudeDelta: 0.001
   });
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
    const getLocationHandler = async () => {
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
            lat: location.coords.latitude,
            lng: location.coords.longitude
          });
        } catch (err) {
          Alert.alert(
            'Could not fetch location!',
            'Please try again later or pick a location on the map.',
            [{ text: 'Okay' }]
          );
        }
        setIsFetching(false);
      };
    return (
      <View style={styles.container}>
      <Header title="O-Mopsi"/>
        <MapView style={styles.mapContainer} 
          region = {{latitude: 37.090,
              longitude: pickedLocation.lat,
              latitudeDelta: pickedLocation.lng,
              longitudeDelta: 0.001}}
              showsUserLocation={true}
          >
          <MapView.Marker
              coordinate={{
              latitude: pickedLocation.lat,
              longitude: pickedLocation.lng}}
              title={"Me"}
           />
          </MapView>
          <Button title="Generate Targets"/>
      </View>   
  );
};
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
    height: 400,
    marginBottom: 20  
  }
});
export default LocationPicker;