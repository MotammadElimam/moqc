import React, { Component } from "react";
import { withTranslation } from 'react-i18next';

import { StyleSheet, ImageBackground, Image, I18nManager, View, Alert, TextInput } from 'react-native'
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    Text,
    Body,
    Left,
    Right,
    Item,
    Form,
    Footer,
    FooterTab
} from "native-base";
import DropShadow from "react-native-drop-shadow";
import FooterBottom from "./Footer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AsyncStorage } from 'react-native';
import API from "../api/";
import Axios from 'axios'
import i18n from "../i18n";
import RNRestart from 'react-native-restart';
import Social from "./components/social";




var FormData = require('form-data');

class Login extends Component {

    constructor(props) {
        //Icon.loadFont();
        super(props);

        this.state = {
            rtl: false,
            username: null,
            password: null
        };
        this.checkLastLogin()
    }

    componentDidMount() {
        if (I18nManager.isRTL === true) {
            this.setState({ rtl: true })
        } else {
            this.setState({ rtl: false })
        }
    }
    checkLastLogin = async () => {
        let token = await AsyncStorage.getItem("@moqc:token");
        let is_student = await AsyncStorage.getItem("is_student")
        console.log("is_student", is_student)
        if (token) {
            Axios.defaults.headers.common['token'] = token
            if (is_student == 0) {
                this.props.navigation.navigate("Home")
            }
            else {
                let class_id = await AsyncStorage.getItem("class_id")
                this.props.navigation.navigate("HomeStudent", { class_id: class_id })
            }
        }
    }
    save_info = async (info) => {
        console.log(info)
        await AsyncStorage.setItem("@moqc:token", info.result.token);
        await AsyncStorage.setItem("@moqc:username", info.result.user.username);
        await AsyncStorage.setItem("@moqc:user_id", info.result.user.id);
        await AsyncStorage.setItem("@moqc:first_name", info.result.user.first_name);
        await AsyncStorage.setItem("@moqc:last_name", info.result.user.last_name);
        await AsyncStorage.setItem("@moqc:email", info.result.user.email);
        await AsyncStorage.setItem("@moqc:page_access", JSON.stringify(info.result.user.page_access));
        await AsyncStorage.setItem("@moqc:photo", info.result.user.photo);
        await AsyncStorage.setItem("role", info.result.role)
        await AsyncStorage.setItem("is_student", JSON.stringify(info.result.is_student))

        Axios.defaults.headers.common['token'] = info.result.token

        if (info.result.is_student == 1) {
            await AsyncStorage.setItem("class_id", info.result.user.student_class)

            // this.props.navigation.navigate("HomeStudent", { class_id: info.result.user.student_class })
        }
        else {

            //  this.props.navigation.navigate("Home")

        }
        await RNRestart.Restart();
    }

    checkLogin = async () => {
      this.setState({ show_spinner: true });
    
      const formData = new FormData();
      formData.append('username', this.state.username);
      formData.append('password', this.state.password);
    
      const config = {
        method: 'post',
        url: 'https://moqc.ae/api/user/login',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      };
    
      try {
        const response = await Axios(config);
    
        this.setState({ show_spinner: false });
    
        if (response.data && response.data.status === false) {
          Alert.alert(
            "Error",
            response.data.result.message || "Something went wrong, please check email/password",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        } else if (response.data && response.data.result && response.data.result.message) {
          Alert.alert(
            "Success Message",
            response.data.result.message,
            [{ text: "OK", onPress: () => this.save_info(response.data) }],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            "Error",
            "Unexpected response from the server.",
            [{ text: "OK" }],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.error('Login Error:', error.message);
        this.setState({ show_spinner: false });
    
        if (error.response) {
          Alert.alert(
            "Error",
            `Server Error: ${error.response.status} - ${error.response.data?.message || 'Unexpected Error'}`,
            [{ text: "OK" }],
            { cancelable: false }
          );
        } else if (error.request) {
          Alert.alert(
            "Error",
            "No response from the server. Please check your network connection.",
            [{ text: "OK" }],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            "Error",
            `Error: ${error.message}`,
            [{ text: "OK" }],
            { cancelable: false }
          );
        }
      }
    };
    
    
    render() {
        const { t, i18n } = this.props;
        console.log(this.state.username)
        return (
            <Container
                style={{
                    display: 'flex',

                    direction: this.state.rtl
                        ? 'rtl'
                        : 'ltr'
                }}>

                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        width: '100%',
                        height: '100%',

                    }}>

                    <View
                        style={{
                            backgroundColor: '#31314f',
                            borderBottomColor: '#31314f',
                            height: 80
                        }}>



                        <Title
                            style={{

                                marginTop: 10,
                                color: '#8f7c7b',
                                textAlign: "center"
                            }}>{i18n.t('Members')}</Title>



                    </View>
                    <View
                        style={{
                            marginTop: -30

                        }}
                    >
                        <View
                            style={{

                                justifyContent: "center",
                                alignItems: "center",

                            }}>
                            <Image
                                style={{
                                    height: 150,
                                    width: 150,
                                    borderRadius: 150,




                                }}
                                source={require('../assets/round.png')} />

                            <Text style={{ marginTop: 5, color: "#ed9995", fontSize: 22, fontWeight: "600", fontFamily: "GESSTwoMedium-Medium" }}>{i18n.t('SIGN IN')}</Text>

                        </View>

                    </View>

                    <View
                        padder
                        style={{


                        }}>
                        <View style={{

                            marginTop: 20

                        }}>
                        </View>

                        <View style={{


                        }}>
                            <View
                                style={{
                                    shadowColor: "#31314f",
                                    shadowOffset: {
                                        width: -10,
                                        height: 5
                                    },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                    borderRadius: 40,

                                }}>
                                <View
                                    style={{
                                        elevation: 1,

                                        borderColor: "#fff",
                                        borderRadius: 30,
                                        backgroundColor: "white",
                                        padding: 20,
                                        borderBottomColor: "black",
                                        marginRight: 30,
                                        marginLeft: 30
                                    }}
                                >


                                    <View
                                        style={{

                                            borderColor: "#eee",
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            backgroundColor: "white",
                                            padding: 5,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 25,
                                            paddingHorizontal: 5,
                                            paddingVertical: 10,

                                            marginBottom: 10

                                        }}>
                                        <Icon active type="FontAwesome" name="user" />
                                        <TextInput

                                            style={{
                                                textAlign: this.state.rtl
                                                    ? 'right'
                                                    : 'left',
                                                flex: 1,
                                                marginStart: 10

                                            }}
                                            value={this.state.username}
                                            onChangeText={(username) => this.setState({ username })}
                                            placeholder={i18n.t("Username")} />
                                    </View>

                                    <View
                                        style={{
                                            borderColor: "#eee",
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            backgroundColor: "white",
                                            padding: 5,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 25,
                                            paddingHorizontal: 5,
                                            paddingVertical: 10,

                                        }}>
                                        <Icon active type="FontAwesome" name="lock" />
                                        <TextInput
                                            style={{
                                                textAlign: this.state.rtl
                                                    ? 'right'
                                                    : 'left',
                                                flex: 1,
                                                marginStart: 10,
                                            }}
                                            secureTextEntry={true}
                                            value={this.state.password}
                                            onChangeText={(password) => this.setState({ password })}
                                            placeholder={i18n.t("Password")} />
                                    </View>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <TouchableOpacity
                                            onPress={(e) => this.checkLogin()}
                                        >
                                            <View
                                                style={{
                                                    elevation: 1,

                                                    borderColor: "#fff",
                                                    borderRadius: 30,
                                                    backgroundColor: "white",
                                                    padding: 1,
                                                    borderBottomColor: "black",

                                                    marginTop: 5,
                                                    marginBottom: 0,
                                                    width: 150,
                                                    padding: 10,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >


                                                <Text style={{ fontWeight: "bold", fontFamily: "GESSTwoMedium-Medium", fontWeight: "400" }}>{i18n.t('SIGN IN')}
                                                    <Icon style={{ fontSize: 14 }} type="AntDesign" name={i18n.language == 'ar' ? "left" : "right"} /></Text>

                                            </View>



                                        </TouchableOpacity>
                                    </View>

                                </View>


                            </View>

                        </View>
                        <View
                            style={{

                                jusifyContent: 'center',
                                alignItems: "center",
                                marginTop: 15,
                                fontWeight: "bold",
                                gap: 8
                            }}>



                        </View>

                        {/* <TouchableOpacity
                                onPress={(e) => this.props.navigation.navigate("Home") }
                            >
                                <View
                                    style={{
                                        elevation: 1,

                                        borderColor: "#fff",
                                        borderRadius: 30,
                                        backgroundColor: "white",
                                        padding: 1,
                                        borderBottomColor: "black",

                                        marginTop: 5,
                                        marginBottom: 0,

                                        padding: 10,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center"
                                    }}
                                >


                                    <Text style={{ fontWeight: "bold" ,textAlign:"center",fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"}}>{i18n.t('Skip')}
                                       </Text>

                                </View>



                            </TouchableOpacity> */}
                        <TouchableOpacity onPress={(e) => this.props.navigation.navigate("Signup")}>
                            <View
                                style={{
                                    elevation: 1, 
                                    borderColor: "#fff",
                                    borderRadius: 30,
                                    backgroundColor: "white",
                                    padding: 1,
                                    borderBottomColor: "black",
                                    marginTop: 5,
                                    marginBottom: 0,
                                    padding: 10,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center"
                                }}>
                                <Text style={{ fontWeight: "bold", color: "#ed9995" }}>{i18n.t('REGISTER')} <Icon style={{ fontSize: 14, color: "#ed9995", transform: [{ rotate: '180deg' }] }} type="AntDesign" name="right" /></Text>
                            </View>
                        </TouchableOpacity>
                        {/* <View
                            style={{
                                marginTop: 5,
                                marginBottom: 5,
                                flex: 4,
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                flexDirection: "row",
                            }}>
                            <TouchableOpacity
                                style={{
                                    width: 150,
                                    padding: 0,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "transparent",
                                    borderColor: "transparent"

                                }}
                                onPress={() => this.props.navigation.navigate("Register")}

                            >
                                <Text style={{ fontWeight: "bold", color: "#ed9995" }}>{i18n.t('REGISTER')} <Icon style={{ fontSize: 14, color: "#ed9995" }} type="AntDesign" name="right" /></Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={(e) => this.checkLogin()}
                            >
                                <View
                                    style={{
                                        elevation: 1,

                                        borderColor: "#fff",
                                        borderRadius: 30,
                                        backgroundColor: "white",
                                        padding: 1,
                                        borderBottomColor: "black",
                                        marginRight: 30,
                                        marginLeft: 30,
                                        marginTop: 0,
                                        marginBottom: 10,
                                        width: 150,
                                        padding: 10,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center"
                                    }}
                                >


                                    <Text style={{ fontWeight: "bold" }}>{i18n.t('SIGN IN')}
                                        <Icon style={{ fontSize: 14 }} type="AntDesign" name="right" /></Text>

                                </View>



                            </TouchableOpacity>

                        </View> */}





                        <View style={{ height: 120 }}></View>
                        <Social />
                    </View>
                </ImageBackground>

                {/* <FooterBottom {...this.props}/> */}
            </Container>
        );
    }
}

export default withTranslation()(Login);