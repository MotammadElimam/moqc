import React, { Component } from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";

import { BottomNavigation, Button, Divider, IconButton } from "react-native-paper";
import Discover from "./Discover";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import List from "./List";
import Live from "./Live";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WebView from "react-native-webview";
import Axios from 'axios'
import i18n from "../../i18n";
import axios from "axios";
const Tab = createBottomTabNavigator();

export default class Radio extends Component {

  constructor(props) {
    super(props)
    this.state = {
      index: 0, routers: [
        { key: 'discover', title: 'Discover', icon: 'queue-music' },
        { key: 'list', title: 'List', icon: 'album' },
        { key: 'live', title: 'Live', icon: 'history' },
      ],
      network: true
    }
    
  }
  
componentDidMount()
{
  this.getConnectionInfo()
}
  async getConnectionInfo() {
    const response = await axios.get(`https://moqc.ae/api/equran_list`);
    console.log(response)
    if (response.status === 200) {
      this.setState({ network: true })
    }
    else {
      this.setState({ network: false })
    }
  }


  render() {
    let WebViewRef;
    return (
      <View style={{ flex: 1 }}>
        { /*
                <Tab.Navigator 
                initialRouteName="discover"
                 screenOptions={{
                    tabBarActiveTintColor: '#497c67',
                  }}
  >
      <Tab.Screen name="list"     options={{
          tabBarLabel: 'List',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="star-outline" color={color} size={size} />
          ),
        }} component={List} />
      <Tab.Screen name="discover"
      options={{
        tabBarLabel: 'Discover',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="circle-outline" color={color} size={size} />
        ),
      }}
       component={Discover} />
      <Tab.Screen name="live" component={List} options={{
        tabBarLabel: 'Live',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="microphone" color={color} size={size} />
        ),
      }} />
    </Tab.Navigator>
    */}
        {this.state.network ?
          <WebView 
          ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
          allowsInlineMediaPlayback="true"
            originWhitelist={["*"]}
            useWebKit={true}
            onError={()=>{
              this.setState({network:false})
          }} 
            allowingReadAccessToURL="true" allowsBackForwardNavigationGestures="true"
            source={{ uri: "https://radio.moqc.ae" }} style={{ flex: 1 }} ></WebView> :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
             <Image source={require('../../assets/internet.png')} style={{height:200,marginBottom:20,width:165}} />
                        <Text>{i18n.t("You have no Internet Connection")}</Text>
                        <Button style={{backgroundColor:'#31314F', color:'#CB565D',marginTop:15}} onPress={() =>{
                            this.setState({network:true})
                            WebViewRef && WebViewRef.reload()}}><Text style={{color:'#CB565D'}}>{i18n.t('Retry')}</Text></Button>
          </View>
        }

        {/* <View style={{ position: 'absolute', right: 20, bottom: 90, zIndex: 10 }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("Landing")}>
            <Image source={require('../../assets/moqc.png')} style={{ width: 44, height: 44, borderRadius: 44, borderWidth: 1, borderColor: "#e3e3e3" }} ></Image>
          </TouchableOpacity>
        </View> */}
      </View>
    )
  }
}