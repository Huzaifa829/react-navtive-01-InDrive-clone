import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import VehicleSelector from '../components/VehicleSelector';
import CustomerPrice from '../components/CustomerPrice';
import polyline from '@mapbox/polyline';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Animated, Keyboard, FlatList, Platform } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import {onAuthStateChanged } from "firebase/auth";
import {auth} from "@/config/firebase/config"
// import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function HomePage({navigation}:any) {
  const [price, setPrice] = useState('Offer your fare');
 
  const [showCustomerPrice, setShowCustomerPrice] = useState(false);
  const [region, setRegion] = useState<any>({
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
    latitudeDelta: 0.010,
    longitudeDelta: 0.0011,
  });
  const [routeCoordinates, setRouteCoordinates] = useState<any>([]);
  const [marklocationWheretoGO, setmarklocationWheretoGO] = useState<any>(null)
  const [location, setLocation] = useState<any>({
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
    latitudeDelta: 0.010,
    longitudeDelta: 0.0011,
  });
  const [whereToGolocation, setwhereToGolocation] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [moving, setMoving] = useState<any>(false)
  const overlayAnimation = useRef(new Animated.Value(0)).current;
  const overlayAnimationSearch = useRef(new Animated.Value(500)).current;
  const searchInputRef = useRef<TextInput>(null);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<any>('');
  const [places, setPlaces] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [placeText, setplaceText] = useState<any>("")
  const [selectedVehicle, setSelectedVehicle] = useState<any>('car');
  let isMoving = false;
  const apiKey: any = 'AlzaSyPPA95gwmMY5VRCMNPiZ3qsmRWtF7SkM4s';
  const customerPriceRef = useRef<any>();


  const handleOpenCustomerPrice = () => {
    customerPriceRef.current?.PriceVeiw(); // Call the PriceVeiw function from CustomerPrice
  };

  const handleSetPrice = (enteredPrice:any) => {
    // Set the price from CustomerPrice component
    setPrice(enteredPrice || 'Offer your fare');
  };

  // Function to handle selection from VehicleSelector
  const handleVehicleSelect = (type: any) => {
    setSelectedVehicle(type);
  };
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

  // ye vo comment jis per keyboard ke kholne or band hone per function apply hote
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
  //     setKeyboardVisible(true)
  //     console.log(Platform.OS);

  //     Animated.timing(overlayAnimationSearch, {
  //       toValue: Platform.OS === "ios" ? 0 : 500 / 2,
  //       // toValue: 500/2,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start();
  //     const keyboardDidHideListener = Keyboard.addListener(
  //       'keyboardDidHide',
  //       () => {
  //         setKeyboardVisible(false);
  //         // Animate overlay back down when keyboard hides
  //         Animated.timing(overlayAnimationSearch, {
  //           toValue: 0,
  //           duration: 300,
  //           useNativeDriver: true,
  //         }).start();
  //       }
  //     );

  //     // Cleanup the event listeners on unmount
  //     return () => {
  //       keyboardDidHideListener.remove();
  //       keyboardDidShowListener.remove();
  //     };
  //   })
  // }, [])
  const fetchPlaces = async () => {
    if (!searchQuery.trim()) return; // Don't fetch if search query is empty

    // Ensure location is available
    if (!location || location.latitude === undefined || location.longitude === undefined) {
      console.error('Location is not available');
      return;
    }
    setLoading(true)

    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=5000&keyword=${encodeURIComponent(searchQuery)}&key=AlzaSyPPA95gwmMY5VRCMNPiZ3qsmRWtF7SkM4s`);

      if (!response.ok) {
        console.error('Error: Network response was not ok', response.status);
        return;
      }

      const res = await response.json();

      // Check if 'results' is available in the response object
      if (res) {
        setPlaces(res.results);
        Keyboard.dismiss();

        console.log('Places found:', res.results);
      } else {
        console.log('No results found or unexpected response format:', res);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    }
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

  const whereToGo = (item: any) => {
    console.log(item.name);
    setplaceText(item.name)
    setmarklocationWheretoGO({
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,

    })
    setRegion({
      ...region,
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    })
    Keyboard.dismiss(); // Hide keyboard
    Animated.timing(overlayAnimationSearch, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start();


  }
  // Step 2: Function to Fetch Route
  const fetchRoute = async () => {
    // console.log(location.latitude);
    // console.log(location.longitude);
    // console.log(marklocationWheretoGO.latitude);
    // console.log(marklocationWheretoGO.longitude);

    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/directions/json?destination=${marklocationWheretoGO.latitude},${marklocationWheretoGO.longitude}&origin=${location.latitude},${location.longitude}&key=AlzaSyPPA95gwmMY5VRCMNPiZ3qsmRWtF7SkM4s`
      );

      if (!response.ok) {
        console.error('Error fetching directions:', response.status);
        return;
      }

      const data = await response.json();

      // Step 3: Parse and Set Route Coordinates
      if (data && data.routes && data.routes[0] && data.routes[0].legs[0].steps) {
        // Decode each step's polyline points
        let routeCoordinates: any = [];
        data.routes[0].legs[0].steps.forEach((step: any) => {
          const stepPolyline = step.polyline.points;
          const decodedPoints = polyline.decode(stepPolyline).map(([lat, lng]: any) => ({
            latitude: lat,
            longitude: lng,
          }));
          routeCoordinates = routeCoordinates.concat(decodedPoints);
        });

        // console.log('Route Coordinates:', routeCoordinates);
        setRouteCoordinates(routeCoordinates);
        setRegion({
          ...region,
          latitudeDelta: 0.110,
          longitudeDelta: 0.2010,
        })
      } else {
        // console.log('Route data not available:', data);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const FindDriver = () => {
    // console.log(navigation.navigate());
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
        navigation.navigate('AuthScreen');
      }})
  }
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={handleRegionChange}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        <Marker coordinate={location}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="map-marker" size={40} color="red" />
            <FontAwesome5 name="home" size={20} color="white" style={styles.topIcon} />
          </View>
        </Marker>
        {
          marklocationWheretoGO ? (
            <Marker coordinate={marklocationWheretoGO} />

          ) : ''
        }
        {
          marklocationWheretoGO && location ? (
            <Polyline coordinates={routeCoordinates} strokeWidth={3} strokeColor="skyblue" />

          ) : ''
        }
      </MapView>

      {/* Animated Bottom Overlay */}
      <Animated.View style={[styles.overlay, { transform: [{ translateY: overlayAnimation }] }]}>

        {
          marklocationWheretoGO && location ? (
            <View style={styles.MainDivDirectionBtn}>
              <TouchableOpacity onPress={fetchRoute} style={styles.directionBtn} >
                <Text style={styles.directionBtnText}>Direction</Text>
              </TouchableOpacity>
            </View>

          ) : ''
        }
        {/* Car Type Selector */}
        <VehicleSelector onSelect={handleVehicleSelect} />

        {/* Location Details */}
        <View style={styles.locationDetails}>
          <Text style={styles.locationText}>Your Location: 123 Main Street</Text>
        </View>

        <TouchableOpacity onPress={SearchVeiw} style={styles.inputContainer}>
          <MaterialIcons name="search" size={24} color="#888" style={styles.icon} />
          <Text style={styles.locationText}>
            {
              placeText != "" ? (
                placeText
              ) : `Search the place`
            }
          </Text>
        </TouchableOpacity>

        {/* "Offers available" Input Field */}
        <TouchableOpacity onPress={handleOpenCustomerPrice} style={styles.inputContainer}>
        <MaterialCommunityIcons name="cash" size={24} color="#888" style={styles.icon} />
        <Text style={styles.locationText}>{price}</Text>
      </TouchableOpacity>

        {/* Find a Driver Button */}
        <TouchableOpacity onPress={FindDriver} style={styles.button}>
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
        {loading === false ? (
          <Text style={{ color: 'red' }}>Please enter location where to go</Text>
        ) : places.length === 0 ? (
          <Text style={{ color: 'red' }}>Jani ye location yaha hai he nai</Text>
        ) : (
          <FlatList
            data={places}
            keyExtractor={(item: any) => item.place_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => whereToGo(item)}>
                <View style={styles.placeItem}>
                  <Text style={styles.placeName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </Animated.View>
      <CustomerPrice ref={customerPriceRef} onSetPrice={handleSetPrice} />

    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIcon: {
    position: 'absolute',
    top: 3, // Adjust as needed to position the icon over the marker
  },

  directionBtnText: {
    color: "white",
    fontSize: 15
  },
  MainDivDirectionBtn: {
    flex: 1,
    alignItems: 'flex-start',
    marginVertical: 10,
    fontWeight: "800",
    position: 'absolute',
    top: -60,
    left: 10
  },
  directionBtn: {
    backgroundColor: "#34a853",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 4,

  },
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
    marginHorizontal: 9,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
