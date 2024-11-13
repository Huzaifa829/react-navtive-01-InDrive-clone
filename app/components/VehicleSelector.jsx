import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const VehicleSelector = ({ onSelect }) => {
  const [selectedType, setSelectedType] = useState('car');

  const handleSelect = (type) => {
    setSelectedType(type);
    onSelect(type);
  };

  return (
    <View style={styles.carTypeContainer}>
      {/* Car Button */}
      <TouchableOpacity
        style={[
          styles.carTypeButton,
          selectedType === 'car' && styles.selectedButton,
        ]}
        onPress={() => handleSelect('car')}
      >
        <FontAwesome5 name="car" size={24} color={
            selectedType === 'car' ? 'white':'black'
        } />
        <Text style={selectedType === 'car' ? styles.iconTextWhite: styles.iconText}>Car</Text>
      </TouchableOpacity>

      {/* Bike Button */}
      <TouchableOpacity
        style={[
          styles.carTypeButton,
          selectedType === 'bike' && styles.selectedButton,
        ]}
        onPress={() => handleSelect('bike')}
      >
        <MaterialCommunityIcons name="bike" size={24} color={
            selectedType === 'bike' ? 'white':'black'
        } />
        <Text style={selectedType === 'bike' ? styles.iconTextWhite: styles.iconText}>Bike</Text>
      </TouchableOpacity>

      {/* Rickshaw Button */}
      <TouchableOpacity
        style={[
          styles.carTypeButton,
          selectedType === 'rickshaw' && styles.selectedButton,
        ]}
        onPress={() => handleSelect('rickshaw')}
      >
        <MaterialIcons name="electric-rickshaw" size={24} color={
            selectedType === 'rickshaw' ? 'white':'black'
        } />
        <Text style={selectedType === 'rickshaw' ? styles.iconTextWhite: styles.iconText}>Rickshaw</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  carTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  carTypeButton: {
    width: 70, // Fixed width for equal-sized buttons
    height: 70, // Fixed height for equal-sized buttons
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  selectedButton: {
    backgroundColor: 'green',
  },
  iconText: {
    marginTop: 5,
    color: 'black',
    fontSize: 12,
  },
  iconTextWhite: {
    marginTop: 5,
    color: 'white',
    fontSize: 12,
  },
});

export default VehicleSelector;
