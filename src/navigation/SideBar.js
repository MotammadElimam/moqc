// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-i
// n -menu-options/

import React from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Image,
    Text,
    Linking,
    Platform,
    TouchableOpacity
} from 'react-native';
import RNRestart from 'react-native-restart';

import { AsyncStorage } from 'react-native';

//import {DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import {Content} from 'native-base';
import Social from '../pages/components/social';

const SideBar = (props) => {
    const BASE_PATH = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/';
    const proileImage = 'react_logo.png';
    return (
        <SafeAreaView style={{
            flex: 10
        }}>
            <Content>
                <Text style={{textAlign:"center",fontWeight:"bold",fontSize:20,marginBottom:15}}>MENU</Text>
                {/*Top Large Image */}
                <View style={{        
                    backgroundColor:"#31314f",
                    height:125,
                    width:125,
                    borderRadius:100,
                    justifyContent:"center",
                    alignSelf:"center",
                    alignContent:"center"
                }}>
                    <Image
                    source={require('../assets/round-w.png')}
                    style={styles.sideMenuProfileIcon}/>
                </View>
                
                <Text
                    style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: "center",
                    textAlign: "center",
                    fontSize: 20,
                    marginTop:15,
                    fontWeight:"bold"
                }}>
                    Welcome Admin
                </Text>
                <View
                    style={{
                    width: '100%',
                    borderColor: 'black',
                    borderTopWidth: 1,
                    marginTop: 20,
                    marginBottom: 20
                }}></View>
                <View
                    style={{
                    flex: 9,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <View
                        style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: "center"
                    }}>
                        <View
                            style={{
                            display: "flex",
                            flex: 0.25,
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>

                            <Image
                                source={require('../assets/dashboard.png')}
                                style={{
                                height: 40,
                                width: 40
                            }}/>
                        </View>
                        <View
                            style={{
                            display: "flex",
                            flex: 0.75,
                            justifyContent: "center",
                            alignItems: 'flex-start'
                        }}>

                            <Text
                                style={{
                                fontSize: 20,
                                marginRight: 10,
                                marginLeft: 10
                            }}>DASHBOARD</Text>
                        </View>
                    </View>
                    <View
                        style={{
                        width: '100%',
                        borderColor: 'black',
                        borderTopWidth: 1,
                        marginTop: 20,
                        marginBottom: 20
                    }}></View>
                    <View
                        style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: "center"
                    }}>
                        <View
                            style={{
                            display: "flex",
                            flex: 0.25,
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>

                            <Image
                                source={require('../assets/profile.png')}
                                style={{
                                height: 40,
                                width: 40
                            }}/>
                        </View>

                        <View
                            style={{
                            display: "flex",
                            flex: 0.75,
                            justifyContent: "center",
                            alignItems: 'flex-start'
                        }}>

                            <Text
                                style={{
                                fontSize: 20,
                                marginRight: 10,
                                marginLeft: 10
                            }}>PROFILE</Text>
                        </View>
                    </View>

                    <View
                        style={{
                        width: '100%',
                        borderColor: 'black',
                        borderTopWidth: 1,
                        marginTop: 20,
                        marginBottom: 20
                    }}></View>

                    <View
                        style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: "center"
                    }}>
                        <View
                            style={{
                            display: "flex",
                            flex: 0.25,
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>

                            <Image
                                source={require('../assets/contact.png')}
                                style={{
                                height: 40,
                                width: 40
                            }}/>
                        </View>

                        <View
                            style={{
                            display: "flex",
                            flex: 0.75,
                            justifyContent: "center",
                            alignItems: 'flex-start'
                        }}>

                            <Text
                                style={{
                                fontSize: 20,
                                marginRight: 10,
                                marginLeft: 10
                            }}>CONTACT US</Text>
                        </View>
                    </View>
                    <View
                        style={{
                        width: '100%',
                        borderColor: 'black',
                        borderTopWidth: 1,
                        marginTop: 20,
                        marginBottom: 20
                    }}></View>

                    <View
                        style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: "center"
                    }}>
                        <View
                            style={{
                            display: "flex",
                            flex: 0.25,
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>

                            <Image
                                source={require('../assets/setting.png')}
                                style={{
                                height: 40,
                                width: 40
                            }}/>
                        </View>

                        <View
                            style={{
                            display: "flex",
                            flex: 0.75,
                            justifyContent: "center",
                            alignItems: 'flex-start'
                        }}>

                            <Text
                                style={{
                                fontSize: 20,
                                marginRight: 10,
                                marginLeft: 10
                            }}>SETTINGS</Text>
                        </View>
                    </View>
                    <View
                        style={{
                        width: '100%',
                        borderColor: 'black',
                        borderTopWidth: 1,
                        marginTop: 20,
                        marginBottom: 60
                    }}></View>

                 <Social />
                    
                    <View
                        style={{
                        width: '100%',
                        borderColor: 'black',
                        borderTopWidth: 1,
                        marginTop: 60,
                        marginBottom: 20
                    }}></View>
                    <TouchableOpacity
                    onPress = {async() => {
                        const asyncStorageKeys = await AsyncStorage.getAllKeys();
                            if (asyncStorageKeys.length > 0) {
                            if (Platform.OS === 'android') {
                                await AsyncStorage.clear();
                                RNRestart.Restart();

                            }
                            if (Platform.OS === 'ios') {
                                await AsyncStorage.multiRemove(asyncStorageKeys);
                                RNRestart.Restart();

                            }
                            }
                    }}
                        style={{
                        flex: 1,
                        flexDirection: 'row'
                    }}>

                        <Image
                            source={require('../assets/logout.png')}
                            style={{
                            height: 30,
                            width: 30
                        }}/>

                        <Text
                            style={{
                            fontSize: 20,
                            marginRight: 10,
                            marginLeft: 10
                        }}>LOG OUT</Text>
                    </TouchableOpacity>
                </View>
            </Content>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    sideMenuProfileIcon: {
        resizeMode: 'cover',
        width: 100,
        height: 100,
        alignSelf: 'center'
    },
    iconStyle: {
        width: 15,
        height: 15,
        marginHorizontal: 5
    },
    customItem: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default SideBar;