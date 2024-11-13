import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Animated, Keyboard, TouchableOpacity, TextInput, Text } from 'react-native';

const CustomerPrice = forwardRef(({ onSetPrice }: any, ref) => {
  // const {onSetPrice} = props
  const overlayAnimationPrice = useRef(new Animated.Value(500)).current;
  const [PriceQuery, setPriceQuery] = useState<any>('');

  // Expose PriceVeiw to the parent component through ref
  useImperativeHandle(ref, () => ({
    PriceVeiw: () => {
      console.log('working');
      Animated.timing(overlayAnimationPrice, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
  }));
  const closeSearchView = () => {
    Keyboard.dismiss(); // Hide keyboard
    Animated.timing(overlayAnimationPrice, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleSetPrice = () => {
    Keyboard.dismiss(); // Hide keyboard and trigger overlay close
    onSetPrice(PriceQuery); // Pass the price back to ParentComponent
    closeSearchView(); // Close overlay
  };

  return (
    <Animated.View style={[styles.overlayPriceCSS, { transform: [{ translateY: overlayAnimationPrice }] }]}>
     <TouchableOpacity style={styles.closeButton} onPress={closeSearchView}>
          <FontAwesome name="close" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Enter your price"
          value={PriceQuery}
          onChangeText={setPriceQuery}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity onPress={handleSetPrice} style={styles.searchButton}>
        <Text style={styles.buttonText}>Set Price</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  overlayPriceCSS: {
    position: 'absolute',
    bottom: 0,
    width: "100%",
    backgroundColor: '#36454F',
    padding: 15,
    height: 500,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomerPrice;
