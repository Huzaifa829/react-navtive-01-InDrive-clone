import React, { useRef } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Animated, PanResponder } from 'react-native';

export default function Index() {
  const slideAnim = useRef(new Animated.Value(0)).current; // Initial animation value

  // Create a PanResponder to detect when the map is moved
  const panResponder = PanResponder.create({
    onPanResponderGrant: () => {
      // Start sliding down when user interacts with the map
      Animated.timing(slideAnim, {
        toValue: 100, // Adjust to control how far down it goes
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderRelease: () => {
      // Slide back up when user stops interacting with the map
      Animated.timing(slideAnim, {
        toValue: 0, // Return to original position
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
  });

  return (
    <View style={styles.container}>
      {/* Map with PanResponder */}
      <MapView style={styles.map} {...panResponder.panHandlers} />

      {/* Animated Bottom Overlay */}
      <Animated.View style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}>
        
        {/* Car Type Selector */}
        <View style={styles.carTypeContainer}>
          <TouchableOpacity style={styles.carTypeButton}>
            <Image source={{ uri: 'car-icon-url' }} style={styles.icon} />
            <Text style={styles.iconText}>Car</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.carTypeButton}>
            <Image source={{ uri: 'bike-icon-url' }} style={styles.icon} />
            <Text style={styles.iconText}>Bike</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.carTypeButton}>
            <Image source={{ uri: 'rickshaw-icon-url' }} style={styles.icon} />
            <Text style={styles.iconText}>Rickshaw</Text>
          </TouchableOpacity>
        </View>

        {/* Location Details */}
        <View style={styles.locationDetails}>
          <Text style={styles.locationText}>Your Location: 123 Main Street</Text>
        </View>

        {/* Input Fields */}
        <TextInput style={styles.input} placeholder="Where to?" />
        <TextInput style={styles.input} placeholder="Offers available" />

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
  icon: {
    width: 40,
    height: 40,
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
