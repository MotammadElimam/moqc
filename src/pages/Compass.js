import React, { Component, useCallback, useEffect, useState } from "react";
import { Text, View, Image, Dimensions, StyleSheet, ImageBackground } from "react-native";
import { Grid, Col, Row } from "react-native-easy-grid";
import { magnetometer as magnetometerSensor, SensorTypes, setUpdateIntervalForType } from "react-native-sensors";
import LPF from "lpf";
import AnimatedLinearGradient from 'react-native-animated-linear-gradient'
import Footer from "./Footer";
import HeaderTop from "./Header";
import { AsyncStorage } from 'react-native';
import i18n from "../i18n";
import { LogBox } from 'react-native';
import SideMenu from "./components/sideMenu";

LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

const { height, width } = Dimensions.get("window");
const presetColors = {
  instagram: [
    '#D7AD00',
    '#549871',
    '#DF5655',
    '#5D66A3',
  ],
};
var _subscription=undefined;
const  Compass =(props)=>{

const [magnetometer,setMagnetometer]=useState(0)
const [qiblah_img,setQiblah_img]=useState("../assets/compass_y.png")
const [qiblah_img_c,setQiblah_img_c]=useState(1)
const [city,setCity]=useState("Dubai")
  useEffect(()=>{
    initApp()
    return function cleanup(){
   //  magnetometerSensor.unsubscribe()
    } 
    
  },[])

  const initApp=useCallback(()=>{
    LPF.init([]);
    LPF.smoothing = 0.2;
    _subscribe()
    getCity();
    setInterval(() => {
    changeBg()
    }, 3000);
  },)


const  getCity = async () => {
    let lang = await AsyncStorage.getItem("@moqc:location");
   // console.log('city', lang.toString().replaceAll('"'));
    setCity(lang)
  }
 

const  _toggle = () => {
    if (_subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };
const updateSensonr=useCallback((data)=>{
  setMagnetometer(_angle(data))
  //console.log('sensor',data)
},[magnetometer])

 const changeBg = () => {
    // console.log("TIMER")

    // console.log(qiblah_img_c)

    if (qiblah_img_c == 1) {
      setQiblah_img(require("../assets/compass_g.png"));
      setQiblah_img_c(2);
      
    }
    if (qiblah_img_c == 2) {
      setQiblah_img(require("../assets/compass_r.png"));
      setQiblah_img_c(3);
      
    }
    if (qiblah_img_c == 3) {
      setQiblah_img(require("../assets/compass_b.png"));
      setQiblah_img_c(4);
     
    }
    if (qiblah_img_c == 4) {
      setQiblah_img(require("../assets/compass_y.png"));
      setQiblah_img_c(1);
     
    }
   // console.log('qiblah_img',qiblah_img)

  }
const  _subscribe = async () => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 16);
 magnetometerSensor.subscribe(data=>{
  
    updateSensonr(data)
   })
   
   
  };

  const _unsubscribe = () => {
    _subscription && _subscription?.unsubscribe();
    _subscription = null;
  };

const  _angle = magnetometer => {
    let angle = 0;
    if (magnetometer) {
      let { x, y } = magnetometer;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
    }
    return Math.round(LPF.next(angle));
  };

 const _direction = degree => {
    if (degree >= 22.5 && degree < 67.5) {
      return "NE";
    } else if (degree >= 67.5 && degree < 112.5) {
      return "E";
    } else if (degree >= 112.5 && degree < 157.5) {
      return "SE";
    } else if (degree >= 157.5 && degree < 202.5) {
      return "S";
    } else if (degree >= 202.5 && degree < 247.5) {
      return "SW";
    } else if (degree >= 247.5 && degree < 292.5) {
      return "W";
    } else if (degree >= 292.5 && degree < 337.5) {
      return "NW";
    } else {
      return "N";
    }
  };

  // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
const  _degree = magnetometer => {
    return( magnetometer - 90) >= 0
      ? (magnetometer - 90)
      : (magnetometer + 271);
  };

 
    // console.log(qiblah_img)
    return (
      <View style={{ flex: 10, backgroundColor: "white" }}>
        <SideMenu />
        <HeaderTop pagename={i18n.t("Qiblah")} navigation={props.navigation} back={false} />



        <View style={{ flex: 1 }}>
          <AnimatedLinearGradient customColors={presetColors.instagram} speed={1000}
          >
            <ImageBackground
              source={require("../assets/qiblah.png")}
              style={{
                height: '100%',
                resizeMode: "cover",
              }}>
              <View style={{ flex: 10 }}>

                <View style={{ backgroundColor: "transparent", justifyContent: "center", alignContent: "center", marginTop: 65 }}>
                  <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, color: "white" }} >{i18n.t('QIBLAH DIRECTION')}</Text>
                </View>
                <View style={{ flex: 1.5, backgroundColor: "orange", backgroundColor: "trnsparent", justifyContent: "center", alignContent: "center", flexDirection: "row" }}>
                  <View
                    style={{ backgroundColor: "white", marginTop: 20, width: 220, height: 55, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center" }}
                  >
                    <Image
                    onError={(e) => console.log('imageError1',e.nativeEvent.error)}
                      // onPress={() => this.setState({ user: 1 })}
                      source={qiblah_img}
                      style={{
                        height: 65,
                        width: 60,
                        marginTop: -15,
                        resizeMode: "cover"
                      }} />
                    <Text style={{ fontWeight: '500', fontSize: 22, textTransform: 'uppercase' }}>{city}</Text>
                  </View>
                </View>
                <View style={{ flex: 5, backgroundColor: "transparent", alignContent: "center", justifyContent: "center", alignItems: "center" }}>

                  <Image
                  alt="qiblah needle"
                  onError={(e) => console.log('imageError',e.nativeEvent.error)}
                    source={require("../assets/needle.png")}
                    style={{
                      height: 300,
                     
                      resizeMode:"contain",
                      width:300,
                      transform: [
                        { rotate: `${(360 - magnetometer*1)}deg` },
                      ],
                    }}
                  />
                </View>
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                  {/* <Text style={{ fontWeight: "bold", color: "white", fontSize: 24 }}>{magnetometer>180? 360 - magnetometer:magnetometer}°</Text>
                  <Text>{magnetometer<180?"اتجه يساراً":"اتجه يميناً"}</Text> */}

                </View>


              </View>
            </ImageBackground>

          </AnimatedLinearGradient>
        </View>
        {/* <Footer location={"qiblah"} navigation={props.navigation}/> */}
      </View>


    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 200,
    width: 350,
  },
})


export default Compass