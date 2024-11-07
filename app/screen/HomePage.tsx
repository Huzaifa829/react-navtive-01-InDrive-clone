import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Animated, Keyboard, FlatList, Platform } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
// import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function HomePage() {
  const [region, setRegion] = useState<any>({
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
    latitudeDelta: 0.010,
    longitudeDelta: 0.0011,
  });
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [moving, setMoving] = useState<any>(false)
  const overlayAnimation = useRef(new Animated.Value(0)).current;
  const overlayAnimationSearch = useRef(new Animated.Value(500)).current;
  const searchInputRef = useRef<TextInput>(null);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<any>('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  let isMoving = false;
  const apiKey = 'AlzaSyPPA95gwmMY5VRCMNPiZ3qsmRWtF7SkM4s'; 

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        ...location.coords,
        latitudeDelta: 0.010,
        longitudeDelta: 0.0011,
      });
      setRegion({
        ...location.coords,
        latitudeDelta: 0.010,
        longitudeDelta: 0.0011,
      })
      console.log(location);
      Animated.timing(overlayAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

    })();
  }, []);
  useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',()=>{
    setKeyboardVisible(true)
    console.log(Platform.OS);
    
    Animated.timing(overlayAnimationSearch, {
      toValue: Platform.OS === "ios" ? 0 :500/2,
      // toValue: 500/2,
      duration: 300,
      useNativeDriver: true,
    }).start();
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        // Animate overlay back down when keyboard hides
        Animated.timing(overlayAnimationSearch, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    // Cleanup the event listeners on unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  })
  }, [])
  const fetchPlaces = async () => {
    if (searchQuery.trim() === '') return; // Don't fetch if search query is empty
    
    console.log('working');
    console.log(searchQuery)
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'AlzaSyPPA95gwmMY5VRCMNPiZ3qsmRWtF7SkM4s'
      }
    };

    fetch(`https://api.gomaps.pro/v3/places/search?query=${searchQuery}&ll=${location.coords.latitude}%2C${location.coords.longitude}&radius=100000`, options)


      .then(res => res.json())
      .then(res => {
        setPlaces(res.results)
        console.log('====================================');
        console.log(res.results);
        console.log('====================================');
      })
      .catch(err => console.error(err));
    
    
  };

  useEffect(() => {
    fetchPlaces(); // Fetch places when the app loads
  }, []);
  const handleRegionChange = (newRegion: any) => {
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

  const handleRegionChangeComplete = (newRegion: any) => {
    // console.log("false");
    Animated.timing(overlayAnimation, {
      toValue: 0, // Move it back to original position
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMoving(false)
    isMoving = true;
  };
  const SearchVeiw = () => {
    console.log('working')
    Animated.timing(overlayAnimationSearch, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      searchInputRef.current?.focus(); // Show keyboard
    });
  }
  const closeSearchView = () => {
    Keyboard.dismiss(); // Hide keyboard
    Animated.timing(overlayAnimationSearch, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const PriceVeiw = () => {
    console.log('working2')
  }
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

        <TouchableOpacity onPress={SearchVeiw} style={styles.inputContainer}>
          <MaterialIcons name="search" size={24} color="#888" style={styles.icon} />
        </TouchableOpacity>

        {/* "Offers available" Input Field */}
        <TouchableOpacity onPress={PriceVeiw} style={styles.inputContainer}>
          <MaterialCommunityIcons name="cash" size={24} color="#888" style={styles.icon} />
          {/* <TextInput style={styles.input} placeholder="Offers available" /> */}
          <Text style={styles.locationText}>Offer your fare</Text>
        </TouchableOpacity>

        {/* Find a Driver Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Find a Driver</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.overlaySearch, { transform: [{ translateY: overlayAnimationSearch }] }]}>
        <TouchableOpacity style={styles.closeButton} onPress={closeSearchView}>
          <FontAwesome name="close" size={24} color="black" />
        </TouchableOpacity>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for places"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity onPress={fetchPlaces} style={styles.SearchButton}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        {loading ? (
        <Text style={{color:'red'}}>Loading...</Text>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item:any) => item.id.toString()} // Ensure unique keys for list items
          renderItem={({ item }) => (
            <View style={styles.placeItem}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text>{item.address}</Text>
              {item.rating && <Text>Rating: {item.rating}</Text>}
            </View>
          )}
        />
      )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  placeName: {
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50, // Adjust as needed
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 10,
    padding: 10,
    elevation: 2, // for shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    paddingVertical: 10
  },
  icon: {
    marginRight: 8,
  },
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
  overlaySearch: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#36454F',
    padding: 15,
    height: 500,
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
  SearchButton: {
    backgroundColor: '#34a853',
    paddingVertical: 10,
    marginHorizontal:9,
    marginVertical:10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
