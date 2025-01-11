import React, {Component} from "react";
import {withTranslation} from 'react-i18next';

import { Image, I18nManager, View,TouchableOpacity} from 'react-native'
import {

    Button,
    Icon,
    Text,
    Footer,
    FooterTab
} from "native-base";
import DropShadow from "react-native-drop-shadow";

class FooterBottom extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.location)
        this.state = {
            rtl: false
        };
    }

    componentDidMount() {
        if (I18nManager.isRTL === true) {
            this.setState({rtl: true})
        } else {
            this.setState({rtl: false})
        }
    }

    render() {
        const {t, i18n} = this.props;
        if(this.props.location == "home"){
            return (
                <View style={{height:80,justifyContent:"space-evenly",alignItems:"center",flexDirection:"row"}}>
                      
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Dashboard")}>
                            <Image
                                source={require('../assets/dash_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Dashboard
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Notifications")}>
                            <Image
                                source={require('../assets/noti_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Notification
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Image
                                source={require('../assets/home_a.png')}
                                style={{
                                height:80,
                                width:80,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15,
                                
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center",marginBottom:60}}>
                                Home
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")}>
    
                            <Image
                                source={require('../assets/profile_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Profile
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Compass")}>
    
                            <Image
                                source={require('../assets/qiblah_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Qiblah
                            </Text>
                        </TouchableOpacity>
                    </View>
            );
        }
        if(this.props.location == "dashboard"){
            return(
                    <View style={{height:80,justifyContent:"space-evenly",alignItems:"center",flexDirection:"row"}}>    
                        <TouchableOpacity>
                            <Image
                                source={require('../assets/dash_a.png')}
                                style={{
                                height:80,
                                width:80,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center",marginBottom:60}}>
                                Dashboard
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Notifications")}>
                            <Image
                                source={require('../assets/noti_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Notification
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                            <Image
                                source={require('../assets/home_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15,
                                
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Home
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")}>
    
                            <Image
                                source={require('../assets/profile_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Profile
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Compass")}>
    
                            <Image
                                source={require('../assets/qiblah_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Qiblah
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
        }
        if(this.props.location == "notifications"){
            return(
                    <View style={{height:80,justifyContent:"space-evenly",alignItems:"center",flexDirection:"row"}}>    
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Dashboard")}>
                            <Image
                                source={require('../assets/dash_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Dashboard
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Image
                                source={require('../assets/noti_a.png')}
                                style={{
                                height:80,
                                width:80,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center",marginBottom:60}}>
                                Notification
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                            <Image
                                source={require('../assets/home_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15,
                                
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Home
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")}>
    
                            <Image
                                source={require('../assets/profile_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Profile
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Compass")}>
    
                            <Image
                                source={require('../assets/qiblah_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Qiblah
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
        }
        if(this.props.location == "profile"){
            return(
                    <View style={{height:80,justifyContent:"space-evenly",alignItems:"center",flexDirection:"row"}}>    
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Dashboard")}>
                            <Image
                                source={require('../assets/dash_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Dashboard
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Notifications")}>
                            <Image
                                source={require('../assets/noti_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Notification
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                            <Image
                                source={require('../assets/home_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15,
                                
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Home
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
    
                            <Image
                                source={require('../assets/profile_a.png')}
                                style={{
                                height:80,
                                width:80,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center",marginBottom:60}}>
                                Profile
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Compass")}>
    
                            <Image
                                source={require('../assets/qiblah_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Qiblah
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
        }
        if(this.props.location == "qiblah"){
            return(
                    <View style={{height:80,justifyContent:"space-evenly",alignItems:"center",flexDirection:"row"}}>    
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Dashboard")}>
                            <Image
                                source={require('../assets/dash_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Dashboard
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Notifications")}>
                            <Image
                                source={require('../assets/noti_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Notification
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                            <Image
                                source={require('../assets/home_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15,
                                
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Home
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile")}>
    
                            <Image
                                source={require('../assets/profile_f.png')}
                                style={{
                                height:35,
                                width:35,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center"}}>
                                Profile
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
    
                            <Image
                                source={require('../assets/qiblah_a.png')}
                                style={{
                                height:80,
                                width:80,
                                resizeMode:"contain",
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                            <Text style={{fontSize:10,textAlign:"center",marginBottom:60}}>
                                Qiblah
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
        }
    }
}

export default withTranslation()(FooterBottom);


// return (
//     <View >
//             <View style={{
//                 flex: 1,
//                 flexDirection: 'column',
//                 backgroundColor: '#f8f4f4',
//                 justifyContent:"space-between"

//             }}>
//                 <View style={{ position: 'absolute',justifyContent:"center" , alignItems:"center", alignSelf: 'center', backgroundColor: 'white', width: 90, height: 90, borderRadius: 50, bottom: 35, zIndex: 10, elevation: 200, borderColor:"red",}}>
//                             <DropShadow 
//                             style={{
//                                 shadowColor: "#000",
//                                 shadowOffset: {
//                                 width: 0,
//                                 height: 0,
//                                 },
//                                 shadowOpacity: 3,
//                                 shadowRadius: 5,
//                             }}
//                             >
                                
//                                 <View
//                                     style={{
//                                         backgroundColor:"#f15a58", padding:23,borderRadius:100,}}>
//                                     <Icon
//                                         name='home'
//                                         type="Entypo"
//                                         color='#fff'
//                                         containerStyle={{ alignSelf: 'center', color:"white" }}
//                                         reverse
//                                         size={28}
//                                         onPress={() => {}}
//                                         style={{color:"white"}}
//                                     />
//                                 </View>

//                             </DropShadow>
                            
//                 </View>
//                 <View style={{ position: 'absolute', backgroundColor: '#fff', bottom: 0, zIndex: 1, width: '100%', height: 80, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, elevation: 100, }}>
//                     <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft:10 }}>
//                         <Icon
//                             name='home'
//                             type="Entypo"
//                             color='#fff'
//                             onPress={() => {}}
//                             containerStyle={{ marginHorizontal: 16 }}
//                         />
//                         <Text>Test</Text>

                        
//                     </View>
//                     <View style={{ flexDirection: 'column', justifyContent: 'center', marginRight:50 }}>
//                         <Icon
//                             name='home'
//                             type="Entypo"
//                             color='#fff'
//                             onPress={() => {}}
//                             containerStyle={{ marginHorizontal: 16 }}
//                         />
//                         <Text>Test</Text>
                        
//                     </View>
//                     <View style={{ flexDirection: 'column', justifyContent: 'center' , marginLeft:50 }}>
//                         <Icon
//                             name='home'
//                             type="Entypo"
//                             color='#fff'
//                             onPress={() => {}}
//                             containerStyle={{ marginHorizontal: 16 }}
//                         />
//                         <Text>Test</Text>
//                     </View>
//                     <View style={{ flexDirection: 'column', justifyContent: 'center', marginRight:10 }}>
//                         <Icon
//                             name='home'
//                             type="Entypo"
//                             color='#fff'
//                             onPress={() => {}}
//                             containerStyle={{ marginHorizontal: 16 }}
//                         />
//                         <Text>Test</Text>
//                     </View>
//                 </View>
                
//             </View>

//             </View>
//     );




// return (
//     <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",elevation:30,marginBottom:10}}>
        
//         <View style={{ flexDirection: 'column', justifyContent: 'center', textAlign:"center",alignItems:"center", marginLeft:15 }}>
//                  <Icon
//                     name='home'
//                     type="Entypo"
//                     color='#fff'
//                     onPress={() => {}}
//                 />
//                 <Text style={{fontSize:10}}>Dashboard</Text>                        
//             </View>
//             <View style={{ flexDirection: 'column', justifyContent: 'center', textAlign:"center",alignItems:"center" }}>
//                  <Icon
//                     name='home'
//                     type="Entypo"
//                     color='#fff'
//                     onPress={() => {}}
//                 />
//                 <Text style={{fontSize:10,textAlign:"center"}}>Notifications</Text>                        
//             </View>
//             <View style={{ flexDirection: 'column', justifyContent: 'center',alignContent:"center",alignItems:"center" }}>
//             <DropShadow 
//                     style={{
//                         shadowColor: "#000",
//                         shadowOffset: {
//                         width: 0,
//                         height: 0,
//                         },
//                         shadowOpacity: 3,
//                         shadowRadius: 5,
//                     }}
//                     >
//                 <View style={{backgroundColor:"red",height:70,width:70,alignItems:"center",justifyContent:"center",textAlign:"center",alignItems:"center",borderRadius:50}}>
//                     <Icon
//                         name='home'
//                         type="Entypo"
//                         color='#fff'
//                         onPress={() => {}}
//                     />
//                 </View>
//                 </DropShadow>
//                 <Text style={{marginBottom : 30,fontSize:10}}>Home</Text>                        
//             </View>
//             <View style={{ flexDirection: 'column', justifyContent: 'center', textAlign:"center",alignItems:"center",}}>
//                  <Icon
//                     name='home'
//                     type="Entypo"
//                     color='#fff'
//                     onPress={() => {}}
//                 />
//                 <Text style={{fontSize:10}}>Profile</Text>                        
//             </View>
//             <View style={{ flexDirection: 'column', justifyContent: 'center',textAlign:"center",alignItems:"center", marginRight:15 }}>
//                  <Icon
//                     name='home'
//                     type="Entypo"
//                     color='#fff'
//                     onPress={() => {}}
//                 />
//                 <Text style={{fontSize:10}}>Qiblah</Text>                        
//             </View>



//     </View>
// );