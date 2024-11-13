import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from './screen/HomePage';
import AuthScreen from './screen/AuthScreen';


const Drawer = createDrawerNavigator();

export default function Index() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomePage} options={{headerTransparent:true,
          title:'Find Driver',
          headerTitle:""
        }}/>
        <Drawer.Screen name="AuthScreen" component={AuthScreen} options={{headerTransparent:true,
          title:'Login page',
          headerTitle:""
        }}/>
        
      </Drawer.Navigator>
    </NavigationContainer>
  );
}