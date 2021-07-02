import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import MapScreen from './Screens/Home';
import MapScreen from './Screens/MapScreen';
import Login from './Screens/Login';
import LocationPicker from './Components/LocationPicker';
export default function App() {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
