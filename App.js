import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import MapScreen from './Screens/Home';
import MapScreen from './Screens/MapScreen';
import GameArea from './Screens/GameArea';
import Login from './Screens/Login';
import LocationPicker from './Components/LocationPicker';
import Photo from './Screens/Photo';
export default function App() {
  return (
    <View style={styles.container}>
      <Photo />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
