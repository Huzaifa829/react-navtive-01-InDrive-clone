import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import * as Location from 'expo-location';

export default function Index() {
  const [region, setRegion] = useState<any>();
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [moving, setMoving]=useState<any>(false)
  const overlayAnimation = useRef(new Animated.Value(0)).current;
  let isMoving = false;

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.010,
        longitudeDelta: 0.0011,
      })
      console.log(location);
      
    })();
  }, []);
  const handleRegionChange = (newRegion:any) => {
    if (!isMoving) {
      setMoving(true);
      isMoving = true; // Set the flag to true

      // Animate the overlay down
      Animated.timing(overlayAnimation, {
        toValue: 300, // Move it down by 300 units
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleRegionChangeComplete = (newRegion:any) => {
    console.log("false");
    Animated.timing(overlayAnimation, {
      toValue: 0, // Move it back to original position
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMoving(false)



  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={handleRegionChange} 
        onRegionChangeComplete={handleRegionChangeComplete}
      >
           <Marker coordinate={region} />
      </MapView>

      {/* Animated Bottom Overlay */}
      <Animated.View style={[styles.overlay, { transform: [{ translateY: overlayAnimation }] }]}>
        
        {/* Car Type Selector */}
        <View style={styles.carTypeContainer}>
          <TouchableOpacity style={styles.carTypeButton}>
            <FontAwesome5 name="car" size={24} color="black" />
            <Text style={styles.iconText}>Car</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.carTypeButton}>
            <MaterialCommunityIcons name="bike" size={24} color="black" />
            <Text style={styles.iconText}>Bike</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.carTypeButton}>
            <MaterialIcons name="electric-rickshaw" size={24} color="black" />
            <Text style={styles.iconText}>Rickshaw</Text>
          </TouchableOpacity>
        </View>

        {/* Location Details */}
        <View style={styles.locationDetails}>
          <Text style={styles.locationText}>Your Location: 123 Main Street</Text>
        </View>

        {/* Input Fields */}
        {/* <TextInput style={styles.input} placeholder="Where to?" />
        <TextInput style={styles.input} placeholder="Offers available" /> */}

        {/* Find a Driver Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Find a Driver</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  carTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  carTypeButton: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
  },
  locationDetails: {
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#34a853',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
