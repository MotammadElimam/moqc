import React, { Component } from "react";
import { withTranslation } from 'react-i18next';

import { Image, I18nManager, View, TouchableOpacity } from 'react-native'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Picker } from 'native-base';

import { AsyncStorage } from 'react-native';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import RNRestart from 'react-native-restart';
import { ShowMenu } from "../store";

class HeaderTop extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            rtl: false,
            visible: false,
            show:false
        };
    }

    componentDidMount() {
        ShowMenu.subscribe(value=>{
            this.setState({show:value})
        })
        // console.log(I18nManager)
        // if (I18nManager.isRTL === true) {
        //     this.setState({ rtl: true })
        // } else {
        //     this.setState({ rtl: false })
        // }
    }

    async logout() {
        this.props.navigation.navigate("Landing")
        await AsyncStorage.clear()
    }
    componentWillUnmount(){
      //  ShowMenu.unsubscribe()
    }


    render() {
        const { t, i18n } = this.props;
//        console.log(i18n.language)
        return (
            <Header style={{ backgroundColor: "#31314f" }}>
                <Left style={{ flexDirection: "row", alignItems: "center" }} >
                    {/* <TouchableOpacity style={{marginRight:10}} onPress={() => this.props.navigation.openDrawer()}>
                    <Image
                        source={require('../assets/lines.png')}
                        style={{
                        height:18,
                        width:23,
                        resizeMode:"contain"
                        
                    }}/>
                </TouchableOpacity>
                 */}

                    {
                        this.props.back ?
                            <TouchableOpacity 
                            style={{width:32,height:32,borderRadius:32,backgroundColor:"#fff",alignItems:"center",justifyContent:"center"}}
                            onPress={() => this.props.navigation.goBack(null)}>
                                <Image
                                    source={require('../assets/right.png')}
                                    style={{
                                        height: 20,
                                        width: 20,
                                        borderRadius:20,
                                        resizeMode: "contain",
                                       
                                    }} />
                            </TouchableOpacity>
                            :
                            <View></View>
                    }
                    <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={() => this.props.navigation.navigate("Home")}>
                        <Image source={require('../assets/moqc.png')} style={{ width: 35, height: 35, borderRadius: 40, borderWidth: 1, borderColor: "#e3e3e3" }} ></Image>
                    </TouchableOpacity>
                </Left>

                <Body style={{marginHorizontal:5,alignItems:"center"}}>
                    <Title style={{ color: "white" ,fontFamily:"GESSTwoMedium-Medium",fontWeight:"400" }} >{this.props.pagename}</Title>
                </Body>

                <Right style={{ flexDirection: "row", alignItems: "center" }} >
                    {/* <TouchableOpacity onPress={async()=>{
                        var lang=i18n.language=="ar"?"en":"ar"
                         await AsyncStorage.setItem('@moqc:language', lang);
                         i18n
                             .changeLanguage(lang)
                             .then(() => {
            
                                 I18nManager.forceRTL(lang=='ar');
                                 RNRestart.Restart();
                                // this.props.navigation.navigate("Home")
                             });
                    }}>
                        <Image source={i18n.language=='ar'? require("../assets/uk.png"):require("../assets/ar.png")} style={{width:25,height:25,marginHorizontal:5}} />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity style={{ backgroundColor: '#fff', borderRadius: 50 }} onPress={() => this.props.navigation.navigate("Compass")}>
                        <Image source={require('../assets/qiblah_f.png')} style={{ width: 20, height: 20 }} ></Image>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => this.props.navigation.navigate("Notification")}>
                        <Image
                            source={require('../assets/bell.png')}
                            style={{
                                height: 20,
                                width: 20,
                                resizeMode: "contain"
                            }} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={{ marginRight: 10 }}>
                        <Image
                            source={require('../assets/mail.png')}
                            style={{
                                height: 15,
                                width: 20,
                                resizeMode: "contain"

                            }} />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity style={{ margin: 2 }} onPress={() => this.props.navigation.navigate("Radio")}>

                        <Image source={require('../assets/radio.png')} style={{ height: 30, width: 30, resizeMode: "contain" }} />

                    </TouchableOpacity> */}

                    <View style={{ marginHorizontal: 5, flexDirection: 'row', width: 20 }}>

                        <Menu
                            visible={this.state.visible}
                            anchor={<TouchableOpacity onPress={() => {
                                //this.setState({ visible: true })
                               ShowMenu.next(!this.state.show)
                              this.setState({show:!this.state.show})
                           
                                }}>
                                <Image
                                    source={require('../assets/more.png')}
                                    style={{
                                        height: 30,
                                        width: 30,
                                        resizeMode: "contain",
                                        tintColor:"#fff"

                                    }} /></TouchableOpacity>}
                            onRequestClose={() => this.setState({ visible: false })}
                        >
                            <MenuItem onPress={() => {
                                this.setState({ visible: false });
                                this.props.navigation.navigate("MediaCards")
                            }}>{i18n.t('Media Cards')}</MenuItem>
                            <MenuItem onPress={() => {
                                this.setState({ visible: false });
                                this.props.navigation.navigate("E-Quran")
                            }}>{i18n.t('E-Quran')}</MenuItem>
                            <MenuItem onPress={() => {
                                this.setState({ visible: false });
                                this.logout()
                            }}>{i18n.t('Logout١')}</MenuItem>
                            <MenuDivider />
                        </Menu>
                    </View>

                    {/* <TouchableOpacity style={{}} onPress={() => this.logout()}>
                        <Image
                            source={require('../assets/pp_f.png')}
                            style={{
                                height: 30,
                                width: 30,
                                resizeMode: "contain"

                            }} />
                    </TouchableOpacity> */}
                </Right>
            </Header>
        );
    }
}

export default withTranslation()(HeaderTop);

