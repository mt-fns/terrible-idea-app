import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

function postLocation(url, location) {
  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: location,
      userId: 55,
      id: 101,
      title: "Post title",
      body: "Post body",
    }),
  })
  .then((response) => response.json())
  .then((responseData) => {
    console.log(JSON.stringify(responseData));
  })
}


function updateLocation(url, location) {

}

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [prevLocation, setPrevLoc] = useState(null);
  const url = "https://jsonplaceholder.typicode.com/posts";

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} showsUserLocation={true} 
        onUserLocationChange={(e) => {
          if (!prevLocation) {
            setPrevLoc(e.nativeEvent.coordinate);
            console.log("Current Coords", e.nativeEvent.coordinate);
            postLocation(url, e.nativeEvent.coordinate);
          }
          else {

          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});