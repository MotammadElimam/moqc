// import { useNavigation } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import { Animated, Dimensions, Image, Text, View } from 'react-native';
// import { Gyroscope } from 'react-native-sensors';
import HeaderTop from "./Header";
import i18n from "../i18n";
// import SideMenu from "./components/sideMenu";
// // Function to calculate Haversine distance
// // ... (same as previous code)

// // Function to calculate Qibla direction
// // ... (same as previous code)

// const Qibla = () => {
//   const [qiblaDirection, setQiblaDirection] = useState(0);
//   const [deviceOrientation, setDeviceOrientation] = useState(0);
//   const animatedValue = new Animated.Value(0); // Animated value for rotation

//   useEffect(() => {
//     // Access user location and calculate Qibla direction
//     // ... (same as previous code)

//     // Subscribe to device orientation
//     const subscription = Gyroscope?.addListener(({ x, y, z }) => {
//       // Calculate device orientation based on sensor data (replace with your implementation)
//       const degrees = Math.atan2(y, x) * 180 / Math.PI;
//       setDeviceOrientation((degrees + 360) % 360); // Adjust for compass direction (0-360)
//     });

//     // Unsubscribe on unmount
//     return () => subscription?.remove();
//   }, []);

//   const rotateToQibla = () => {
//     Animated.timing(animatedValue, {
//       toValue: qiblaDirection,
//       duration: 1000, // Adjust animation duration as desired
//       useNativeDriver: true, // Use native driver for smoother animation
//     }).start();
//   };

//   useEffect(() => {
//     rotateToQibla(); // Animate on component mount
//   }, [qiblaDirection]);

//   const screen = Dimensions.get('window');
//   const compassSize = Math.min(screen.width, screen.height) * 0.7; // Adjust compass size

//   const compassStyles = {
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       position:"relative",
//       zIndex:0
//     },
//     dial: {
//       width: compassSize,
//       height: compassSize,
//       borderRadius: compassSize / 2,
//       backgroundColor: '#ddd',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginTop:500
//     },
//     needle: {
//       position: 'absolute',
//       justifyContent:"center",
//       alignItems:"center",
//       width: compassSize * 0.1,
//       height: compassSize * 0.5,
//       // backgroundColor: '#f00', // Adjust needle color
//       transform: [{ rotate: animatedValue.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) }],
//     },
//   };
// const navigation=useNavigation()
//   return (
//     <View>
//        <HeaderTop pagename={i18n.t("Qibla")} navigation={navigation} back={false}  />

//     <View style={compassStyles.container}>
//       {/* <SideMenu /> */}

//       <View style={compassStyles.dial}>

//         {/* Add compass markings here */}

//         <Animated.View style={compassStyles.needle} >
//         <Image source={require('../assets/compass_g.png')}  style={{width:compassSize,resizeMode:"contain"}}   />

//           </Animated.View>
//        <Text>{deviceOrientation}</Text>
//       </View>

//     </View>

//     <SideMenu />
//     </View>
//   );
// };

// export default Qibla;
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ImageBackground, PermissionsAndroid, Platform, Animated } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { magnetometer, setUpdateIntervalForType as setMagnetometerUpdateInterval } from 'react-native-sensors';
import { getGreatCircleBearing } from 'geolib';
import SideMenu from "./components/sideMenu";

const QIBLA_LATITUDE = 21.4225;
const QIBLA_LONGITUDE = 39.8262;

const Qibla = (props) => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [isTeleported, setIsTeleported] = useState(false); // Track teleportation state
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    const subscription = magnetometer.subscribe(({ x, y, z }) => {
      setMagnetometerData({ x, y, z });
    });

    setMagnetometerUpdateInterval(SensorTypes.magnetometer, 100); // 100ms update interval

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      const bearing = getGreatCircleBearing(
        { latitude: location.latitude, longitude: location.longitude },
        { latitude: QIBLA_LATITUDE, longitude: QIBLA_LONGITUDE }
      );
      setQiblaDirection(bearing);
    }
  }, [location]);

  const calculateDegree = (magnetometer) => {
    let { x, y } = magnetometer;
    if (typeof x !== 'undefined') {
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      return (angle + 360) % 360;
    }
    return 0;
  };

  const heading = useMemo(() => calculateDegree(magnetometerData), [magnetometerData]);

  useEffect(() => {
    const angle = (360 - (heading - qiblaDirection)) % 360;
    rotation.setValue(angle); // Set the rotation value directly
  }, [heading, qiblaDirection]);

  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  // Teleportation detection
  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100); // 100ms
    setUpdateIntervalForType(SensorTypes.gyroscope, 100); // 100ms

    const accelSubscription = accelerometer.subscribe(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      if (magnitude > 20) { // Example threshold for rapid movement
        setIsTeleported(true);
      }
    });

    const gyroSubscription = gyroscope.subscribe(({ x, y, z }) => {
      const rotation = Math.sqrt(x * x + y * y + z * z);
      if (rotation > 5) { // Example threshold for rapid rotation
        setIsTeleported(true);
      }
    });

    return () => {
      accelSubscription.unsubscribe();
      gyroSubscription.unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1, gap: 10, backgroundColor: "#fff" }}>
      <HeaderTop pagename={i18n.t("Qiblah")} navigation={props.navigation} back={false} />
      <ImageBackground
        source={require("../assets/qiblah.png")}
        style={{
          height: '100%',
          resizeMode: "cover",
        }}>

        {!isTeleported ? (
          <View style={styles.teleportContainer}>
            <Text style={styles.teleportText}>
              يرجى نقل هاتفك إلى مكان آخر قبل التحقق من اتجاه القبلة.
            </Text>
          </View>
        ) : (
          <>
            <View style={{ alignItems: "center", paddingTop: 70 }}>
              <Text style={styles.text}>اتجاه القبلة: {Math.round(qiblaDirection > 180 ? qiblaDirection - 360 : qiblaDirection)}°</Text>
              <Text style={styles.text}>اتجه نحو {heading < 180 ? "اليسار" : "اليمين"} {Math.round(heading)}°</Text>
            </View>
            <View style={styles.container}>
              < Animated.Image
                source={require('../assets/needle.png')}
                style={[
                  styles.compass,
                  {
                    transform: [{ rotate: rotate }],
                  },
                ]}
              />
            </View>
          </>
        )}
      </ImageBackground>
      <SideMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    margin: 10,
    color: "white"
  },
  compass: {
    width: 200,
    height: 200,
  },
  teleportContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  teleportText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Qibla;