import React, { useState, useEffect } from 'react';
import { TextInput, Platform, Text, View, StyleSheet, Button, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import * as geolib from 'geolib';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isChangingRadius, setIsChangingRadius] = useState(false);
  const [radius, setRadius] = useState(3000);
  const [generateTargets, setGenerateTargets] = useState(false);
  const [targets, setTargets] = useState([]);
  const [distances, setDistances] = useState([]);
  const [index, setIndex] = useState(null);
  const [coords, setCoords] = useState([]);
  const [num, setNum] = useState();

  const changeRadiusHandler = () => {
    setIsChangingRadius(true);
  };
  const onFinishRadiusEdit = () => {
    setIsChangingRadius(false);
    setGenerateTargets(true);
  }
  const [pickedLocation, setPickedLocation] = useState({
    latitude: 62.59828203570094,
    longitude: 29.743811008682826
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.090,
    longitude: 95.712,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002
  });
  const [center, setCenter] = useState({
    latitude: 62.59828203570094,
    longitude: 29.743811008682826
  });
  // console.log("coordinates for polyline");
  // console.log(coords);
  console.log("first render");
  useEffect(() => {
    console.log("Inside UseEffect 1");
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
        return; //add alert box
      }
      try {
        setIsFetching(true);
        console.log("second render");
        const location = await Location.getCurrentPositionAsync({
          timeout: 5000
        });
        setPickedLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        console.log("third render");
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        });
        console.log("fourth render");

      } catch (err) {
        Alert.alert(
          'Could not fetch location!',
          'Please try again.',
          [{ text: 'Okay' }]
        );
      }
      setIsFetching(false);
      console.log("fifth render");
    })();
  }, []);
  //trying with useEffect now
  /* useEffect(() => {
   console.log("inside use effect");
   console.log(region.latitude);
   //(async () => {
   async function onGenerateTargets(){
   var url = `https://cs.uef.fi/mopsi_dev/nancy/server.php?param={"request_type":"query_osm_circle","lat":${region.latitude},"lng":${region.longitude},"radius":3,"limit":10}`;
   console.log(url);
   try {
     let response = await fetch(
       url,
     );
     let responseJson = await response.json();
     console.log(responseJson);
     setTargets(responseJson);
     console.log("not working");
   } catch (error) {
     console.error(error);
   }
}
}, [generateTargets]);*/
  useEffect(() => {
    console.log("Inside UseEffect 2"); //logs the output
    //fetch(`https://cs.uef.fi/mopsi_dev/nancy/server.php?param={"request_type":"query_osm_circle","lat":${region.latitude},"lng":${region.longitude},"radius":${radius/1000},"limit":${num}}`)
    //   .then((response)=>{
    //   console.log('resolved');
    //   return response.json();
    // }).then(data=>{
    //   setTargets(data);
    // }).catch((err)=>{
    //   Alert.alert(
    //     "Failed: Network Error",
    //     "Try again",
    //     [
    //       { text: "OK"}
    //     ]
    //   );
    //   console.log('rejected', err);
    // })
    (async () => {
      var url = `https://cs.uef.fi/mopsi_dev/nancy/server.php?param={"request_type":"query_osm_circle","lat":${region.latitude},"lng":${region.longitude},"radius":${radius / 1000},"limit":${num}}`;
      try {
        let response = await fetch(
          url,
        );
        let responseJson = await response.json();
        console.log(url);
        //console.log(responseJson); //does not log the output
        setTargets(responseJson);
      } catch (error) {
        console.error(error);//better show an error alert here
      }
    })()
  }, [generateTargets]);
  const test = () => {
    console.log("testing");
  }
  //USEEFFECT 3
  useEffect(() => {
    console.log("inside third hook");
    var lat1 = pickedLocation.latitude;
    //console.log(lat1);
    var lng1 = pickedLocation.longitude;
    //console.log(lng1);
    console.log(targets);
    console.log("targets distance");
    const R = 6371; // metres
    let targets_distance = [];
    for (var i = 0; i < targets.length; i++) {
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = targets[i].lat * Math.PI / 180;
      const Δφ = (targets[i].lat - lat1) * Math.PI / 180;
      const Δλ = (targets[i].lng - lng1) * Math.PI / 180;
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // in metres
      //console.log(d);
      targets_distance.push(d);
    }
    setDistances(targets_distance);
    console.log(targets_distance);
  }, [pickedLocation]);
  //USEEFFECT 3
  //return targets;
  // console.log("outside useeffect hook");
  // console.log(targets);
  const generatedTargets = () => {
    var lat1 = pickedLocation.latitude; // user location
    console.log(lat1);
    var lng1 = pickedLocation.longitude;
    console.log(lng1);
    console.log(targets);
    console.log("targets distance");
    const R = 6371; // metres
    let targets_distance = [];
    for (i = 0; i < targets.length; i++) {
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = targets[i].lat * Math.PI / 180;
      const Δφ = (targets[i].lat - lat1) * Math.PI / 180;
      const Δλ = (targets[i].lng - lng1) * Math.PI / 180;
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // in metres
      //console.log(d);
      targets_distance.push(d);
    }
    console.log(targets_distance);
    //const min = Math.min(...targets_distance);
    var index = 0;
    var value = targets_distance[0];
    for (var i = 1; i < targets_distance.length; i++) {
      if (targets_distance[i] < value) {
        value = targets_distance[i];
        index = i;
      }
    }
    console.log("smallest element is " + value + "at index " + index);
    setIndex(index);
    setDistances(targets_distance);
  }
  //custmoize shortest distance target marker
  //   const shortestDistance = () =>{
  //     console.log('is there targets');
  //     console.log(targets);
  //     targets.map((target, index) => (
  //       <MapView.Marker
  //       key={index}
  //       coordinate={{
  //       latitude: target.lat,
  //       longitude: target.lng}}
  //       title={target.name}
  // />
  // ))
  //   }
  const displayFooter = () => {
    if (isChangingRadius == false && generateTargets == false) {
      return (<View>
        <Button title="Reset Radius" onPress={changeRadiusHandler} />
      </View>)
    } else if (isChangingRadius == true) {
      return (<View style={styles.buttonContainer}>
        <Button title=" + " onPress={() => setRadius(radius + 500)} />
        <Button title="Generate targets" onPress={onFinishRadiusEdit} />
        <Button title=" - " onPress={() => setRadius(radius - 500)} />
        <TextInput
          value={num}
          onChangeText={num => setNum(num)}
          placeholder={'Targets'}
          style={styles.input}
        />
      </View>)
    }
    else {
      return (<View>
        <Button title="Play" onPress={test} />
      </View>)
    }
  }
  return (
    <View style={styles.container}>
      <Header title="O-Mopsi Crowdsourcing" />
      <MapView style={styles.mapContainer}
        //provider={MapView.PROVIDER_GOOGLE}
        region={{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta
        }}
        showsUserLocation={true}
        followUserLocation={true}
        userLocationUpdateInterval={2000}
        onUserLocationChange={event => (
          //console.log(event.nativeEvent.coordinate.latitude)
          console.log('event fired'),
          setPickedLocation({
          latitude:event.nativeEvent.coordinate.latitude,
          longitude:event.nativeEvent.coordinate.longitude
          })
          // setCoords({latitude:event.nativeEvent.coordinate.latitude,
          // longitude:event.nativeEvent.coordinate.longitude})
        )
        }
      >
        {
          targets.map((target, index) => (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: target.lat,
                longitude: target.lng
              }}
              title={target.name}
            />
          ))}
        <MapView.Circle
          key={(region.latitude + region.longitude).toString()}
          center={pickedLocation}
          radius={radius}
          strokeWidth={2}
          strokeColor={'#1a66ff'}
          fillColor={'rgba(230,238,255,0.5)'}
        />
        {/* <Polyline
		    coordinates={[
            { latitude: 37.8025259, longitude: -122.4351431 },
			      { latitude: 37.7896386, longitude: -122.421646 },
			      { latitude: 37.7665248, longitude: -122.4161628 },
			      { latitude: 37.7734153, longitude: -122.4577787 },
			      { latitude: 37.7948605, longitude: -122.4596065 },
		      	{ latitude: 37.8025259, longitude: -122.4351431 }]}
		    strokeColor="rgb(255,0,0)" 
		    strokeWidth={5}
	/> */}
      </MapView>
      <View style={styles.footer}>
        {displayFooter()}
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
  footer: {
    width: '100%',
    height: 70,
    backgroundColor: '#FF7F50',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly'
  }
});
