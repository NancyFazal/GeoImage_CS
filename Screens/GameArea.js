import React, { useState, useEffect } from 'react';
import { TextInput, Platform, Text, View, StyleSheet, Button, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import PhotoHandler from './Photo';
import * as geolib from 'geolib';
import { event } from 'react-native-reanimated';
export default function GameArea() {
    //const [location, setLocation] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [generateTargets, setGenerateTargets] = useState(true);
    const [targets, setTargets] = useState([]);
    const [distances, setDistances] = useState([]);
    const [index, setIndex] = useState(null);
    const [gesture, setGesture] = useState({});
    const [draggingMap, setdraggingMap] = useState(false);
    const [numofTargets, setNumofTargets] = useState(null);
    const [conditionCounter, setConditionCounter] = useState(0);
    //User location
    const [pickedLocation, setPickedLocation] = useState({
        latitude: 62.59828203570094,
        longitude: 29.743811008682826
    });
    const [errorMsg, setErrorMsg] = useState(null);
    const [region, setRegion] = useState({
        latitude: 62.59828203570094,
        longitude: 29.743811008682826,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    });
    const [mapBounds, setMapBounds] = useState({
        n: null,
        s: null,
        e: null,
        w: null
    });
    const [mapRef, updateMapRef] = useState(null);
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
                    'Please try again.',
                    [{ text: 'Okay' }]
                );
            }
            setIsFetching(false);
        })();
    }, []);
    const getBoundaries = () => {
        if (mapRef === null) {
            return;
        }
        mapRef
            .getMapBoundaries()
            .then((res) => {
                //console.log(res);
                //console.log(mapRef);
                setMapBounds({
                    n: res.northEast.latitude,
                    e: res.northEast.longitude,
                    s: res.southWest.latitude,
                    w: res.southWest.longitude
                });
            })
            .catch((err) => console.log(err));
    };
    const onRegionChangeComplete = (region) => {
        if (draggingMap === true && targets.length == 0) {
            getBoundaries();
            setRegion({
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta
            })
            setdraggingMap(false);
        }
        else {
            return;
        }
    }
    const ondraggingMap = () => {
        setdraggingMap(true);
    }
    // useEffect(() => {
    //     console.log("Inside UseEffect 2");
    //     (async () => {
    //         var url = `https://cs.uef.fi/mopsi_dev/nancy/server.php?param={"request_type":"query_osm_bounds","n":${mapBounds.n},"s":${mapBounds.s},"e":${mapBounds.e},"w":${mapBounds.w},"limit":3}`;
    //         try {
    //             let response = await fetch(
    //                 url,
    //             );
    //             let responseJson = await response.json();
    //             setTargets(responseJson);
    //         } catch (error) {
    //             console.error(error);//better show an error alert here
    //         }
    //     })()
    // }, [mapBounds]);
    // console.log("updated mapbounds");
    // console.log(mapBounds);
    // console.log("targets fetched within bounds");
    // console.log(targets);
    //const generatedTargets = () => {
    //
    async function generatedTargets() {
        // setGenerateTargets(true);
        //console.log("button clicked");
        var url = `https://cs.uef.fi/mopsi_dev/nancy/server.php?param={"request_type":"query_osm_bounds","n":${mapBounds.n},"s":${mapBounds.s},"e":${mapBounds.e},"w":${mapBounds.w},"limit":${numofTargets}}`;
        console.log(url);
        if (numofTargets == null) {
            Alert.alert(
                "Missing",
                "Enter Number of targets first",
                [
                    { text: "OK" }
                ]
            );
        }
        else {
            try {
                let response = await fetch(
                    url,
                );
                let responseJson = await response.json();
                console.log("Targets generated");
                console.log(responseJson);
                setTargets(responseJson);// may be one array with objects
                setGenerateTargets(false);
            } catch (error) {
                Alert.alert(
                    "Failed: Network Error",
                    "Try again",
                    [
                        { text: "OK" }
                    ]
                );
                console.error(error);//better show an error alert here
            }
        }
    }
    //}
    useEffect(() => {
        console.log('inside useEffect hook for measuring targets distances');
        var lat1 = pickedLocation.latitude; // user location
        var lng1 = pickedLocation.longitude;
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
            const distance = R * c * 1000; // in metres
            console.log('distance is'. d);
            const distance1 = 20;
            if(distance1<=20){
                setConditionCounter(c => c + 1);
                <PhotoHandler key={conditionCounter} />; 
                // {Alert.alert(
                //     "Success",
                //     "Take photo",
                //     [
                //       {text: "Open Camera"}
                //     ]
                //   )} 
            }
            else{
                targets_distance.push(distance1);
            }
        }
        console.log(targets_distance);
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
    }, [pickedLocation]);
    // const targetsDistance = () =>{
    // var lat1 = pickedLocation.latitude; // user location
    // var lng1 = pickedLocation.longitude;
    // console.log("targets distance");
    // const R = 6371; // metres
    // let targets_distance = [];
    // for (i = 0; i < targets.length; i++) {
    //   const φ1 = lat1 * Math.PI / 180;
    //   const φ2 = targets[i].lat * Math.PI / 180;
    //   const Δφ = (targets[i].lat - lat1) * Math.PI / 180;
    //   const Δλ = (targets[i].lng - lng1) * Math.PI / 180;
    //   const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    //     Math.cos(φ1) * Math.cos(φ2) *
    //     Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //   const d = R * c; // in metres

    //   targets_distance.push(d*1000);
    // }
    // console.log(targets_distance);
    // var index = 0;
    // var value = targets_distance[0];
    // for (var i = 1; i < targets_distance.length; i++) {
    //   if (targets_distance[i] < value) {
    //     value = targets_distance[i];
    //     index = i;
    //   }
    // }
    // console.log("smallest element is " + value + "at index " + index);
    // setIndex(index);
    // setDistances(targets_distance);
    // }
    //User location changed
    useEffect(() => {
        (async () => {
            //if (pickedLocation) {
            try {
                await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.BestForNavigation,
                        distanceInterval: 10,
                        timeInterval: 10000,
                    },
                    (loc) => {
                        //setLocation({ coords: pos.coords });
                        console.log("event fired");
                        var today = new Date();
                        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        var dateTime = date + ' ' + time;
                        console.log(dateTime);
                        console.log(loc.coords);
                        setPickedLocation({
                            latitude: loc.coords.latitude,
                            longitude: loc.coords.longitude
                        });
                    }
                );
            } catch (e) {
                Alert.alert("Error");
            }
            //} 
        })();
    }, []);
    // console.log('after async watch');
    // console.log(pickedLocation);
    // const displayFooter = () => {
    //     if (generateTargets == true) {
    //         return (<View>
    //             <TextInput
    //                 value={numofTargets}
    //                 onChangeText={numofTargets => setNumofTargets(numofTargets)}
    //                 placeholder={'No. of Targets'}
    //                 style={styles.input}
    //             />
    //             <Button title="Generate Targets" onPress={generatedTargets} />
    //         </View>)
    //     }
    //     else {
    //         return (
    //             <View>
    //                 <Button title="Play" />
    //             </View>
    //         )
    //     }
    // }
    //function to set number of targets
    const setNumberOfTargets = (numofTargets) =>{
        setNumofTargets(numofTargets);
    }
    //
    return (
        <View style={styles.container}>
            <Header title="O-Mopsi Crowdsourcing" />
            {conditionCounter?
            <PhotoHandler />:
            <MapView style={styles.mapContainer}
                region={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta
                }}
                showsUserLocation={true}
                followUserLocation={true}
                ref={(ref) => updateMapRef(ref)}
                onPanDrag={ondraggingMap}
                onRegionChangeComplete={onRegionChangeComplete}
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
            </MapView>}
            <Footer 
                Targets = {generateTargets}
                numberOfTargets = {numofTargets}
                setNumTargets = {setNumberOfTargets}
                osmTargets = {generatedTargets}
            />
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