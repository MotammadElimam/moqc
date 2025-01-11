import 'react-native-gesture-handler';
import React from 'react';

import { View, TouchableOpacity, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import '../i18n';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Inner';

// Import Custom Sidebar
import SideBar from './SideBar';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = (props) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{ width: 25, height: 25, marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};

function landing({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="Landing"
        component={Landing}
        options={{
          title: 'Language', //Set Header Title
          headerStyle: {
            backgroundColor: '#31314f', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

function LoginStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerMode: 'none',
      }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: 'Login', //Set Header Title
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          title: 'Sign Up', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: 'blue',
          itemStyle: { marginVertical: 5 },
        }}
        
        drawerContent={(props) => <SideBar {...props} />}>
        <Drawer.Screen
          name="Landing"
          
          options={{ gestureEnabled: false ,drawerLabel: 'Language' }}
          component={landing}
        />
        <Drawer.Screen
          name="Login"
          options={{     headerMode: 'none' , gestureEnabled: false, drawerLabel: 'Login' }}
          component={LoginStack}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
