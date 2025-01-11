import React, { Component } from "react";
import { withTranslation } from 'react-i18next';

import { StyleSheet, ImageBackground, Image, I18nManager, View, Alert } from 'react-native'
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
    Input,
    Form,
    Footer,
    FooterTab,
    Picker
} from "native-base";
import DropShadow from "react-native-drop-shadow";
import FooterBottom from "./Footer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AsyncStorage } from 'react-native';
import API from "../api/";
import Axios from 'axios'
import i18n from "../i18n";
import RNRestart from 'react-native-restart';
import axios from "axios";
import Social from "./components/social";



var FormData = require('form-data');

class Register extends Component {

    constructor(props) {
        //Icon.loadFont();
        super(props);

        this.state = {
            rtl: false,
            name: null,
            password: null,
            email:"",
            cpassword:"",
            loading:false,
            newEmail:false,
            joined_moqc:""
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
            axios.defaults.headers.common['token'] = token
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

        axios.defaults.headers.common['token'] = info.result.token
        RNRestart.Restart();
        if (info.result.is_student == 1) {
            await AsyncStorage.setItem("class_id", info.result.user.student_class)
          //  this.props.navigation.navigate("HomeStudent", { class_id: info.result.user.student_class })
        }
        else {
          //  this.props.navigation.navigate("Home")
           
        }
       
    }


    checkLogin = async () => {
        this.setState({ show_spinner: true })

        const formData = new FormData();
        formData.append('name', this.state.name);
        formData.append('password', this.state.password);
        formData.append("email",this.state.email)

       var resp=await axios.post('https://moqc.ae/api/register',formData)
            .then(res => {
                console.log(res.data)
                let resp=res.data
                this.setState({ show_spinner: false })
                if (resp.status == false) {
                    var massage=res.data.result.messages
                    massage= massage.replace(/<p>/g,"")
                    massage= massage.replace(/</g,'')
                    massage= massage.replace(/p>/g,'')

                    Alert.alert(
                        "Error",
                        massage,
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                } else {
                    Alert.alert(
                        "Success Message",
                        resp.result.message,
                        [
                            { text: "OK", onPress: () => this.save_info(resp) }
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch(err => {
                console.log(err)
                alert(err)
            });

    }
    render() {
        const { t, i18n } = this.props;
        
        return (
            <Container
                style={{
                    display: 'flex',
                    flex: 10,
                    direction: this.state.rtl
                        ? 'rtl'
                        : 'ltr'
                }}>

                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        width: '100%',
                        height: '100%',
                        flex: 10
                    }}>

                    <Header
                        style={{
                            backgroundColor: '#31314f',
                            borderBottomColor: '#31314f',
                        }}>



                        <Title
                            style={{
                                flex: 1,
                                marginTop: 10,
                                color: '#8f7c7b',
                                textAlign: "center"
                            }}>{i18n.t('Members')}</Title>



                    </Header>
                    <View
                        style={{
                            backgroundColor: '#31314f',
                            flex: 0.1,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            <Image
                                style={{
                                    height: 150,
                                    width: 150,
                                    marginTop: 100
                                }}
                                source={require('../assets/round.png')} />

                            <Text style={{ marginTop: 5, color: "#ed9995", fontSize: 22, fontWeight: "600" }}>{i18n.t('ٌRegister')}</Text>

                        </View>

                    </View>

                    <Content
                        padder
                        style={{
                            flex: 14,
                            marginTop: 120
                        }}>
                        <View style={{
                            flex: 2,
                            marginTop: 20

                        }}>
                        </View>

                        <Form style={{
                            flex: 8,

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


                                    <Item
                                        style={{
                                            elevation: 0,
                                            borderColor: "#fff",
                                            borderRadius: 0,
                                            backgroundColor: "white",
                                            padding: 5,
                                            borderBottomColor: "black"
                                        }}>
                                      
                                        <Input
                                            style={{
                                                textAlign: this.state.rtl
                                                    ? 'right'
                                                    : 'left'
                                            }}
                                            value={this.state.name}
                                            onChangeText={(name) => this.setState({ name })}
                                            placeholder={i18n.t("Your Full name")} />
                                    </Item>

                                    <Item
                                        style={{
                                            elevation: 0,
                                            borderColor: "#fff",
                                            borderRadius: 0,
                                            backgroundColor: "white",
                                            padding: 5,
                                            borderBottomColor: "black"
                                        }}>
                                      
                                        <Input
                                            style={{
                                                textAlign: this.state.rtl
                                                    ? 'right'
                                                    : 'left'
                                            }}
                                            value={this.state.email}
                                            onChangeText={(email) => this.setState({ email })}
                                            placeholder={i18n.t("Email")} />
                                    </Item>

                                    <Item
                                        style={{
                                            elevation: 0,
                                            borderColor: "#fff",
                                            borderRadius: 0,
                                            backgroundColor: "white",
                                            padding: 5,
                                            borderBottomColor: "black"
                                        }}>
                                       
                                        <Input
                                            style={{
                                                textAlign: this.state.rtl
                                                    ? 'right'
                                                    : 'left'
                                            }}
                                            secureTextEntry={true}
                                            value={this.state.password}
                                            onChangeText={(password) => this.setState({ password })}
                                            placeholder={i18n.t("Password")} />
                                    </Item>

                                    <Item
                                        style={{
                                            elevation: 0,
                                            borderColor: "#fff",
                                            borderRadius: 0,
                                            backgroundColor: "white",
                                            padding: 5,
                                            borderBottomColor: "black"
                                        }}>
                                       
                                        <Input
                                            style={{
                                                textAlign: this.state.rtl
                                                    ? 'left'
                                                    : 'right'
                                            }}
                                            secureTextEntry={true}
                                            value={this.state.cpassword}
                                            onChangeText={(cpassword) => this.setState({ cpassword })}
                                            placeholder={i18n.t("Password confirm")} />
                                    </Item>


                                    {/* Have you been to MOQC before? */}
                                            <View style={{ padding: 5, marginVertical: 10 }}>
                                              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                                              {i18n.t("Have you been to MOQC before?")}

                                              </Text>
                                              <Item
                                                picker
                                                style={{
                                                  elevation: 0,
                                                  borderColor: "#fff",
                                                  borderRadius: 0,
                                                  backgroundColor: "white",
                                                  borderBottomColor: "black"
                                                }}>
                                                <Picker
                                                  mode="dropdown"
                                                  iosIcon={<Icon name="arrow-down" />}
                                                  style={{
                                                    textAlign: this.state.rtl ? 'right' : 'left'
                                                  }}
                                                    selectedValue={i18n.t(this.state.joined_moqc)}
                                                  onValueChange={(value) => this.setState({joined_moqc: value })}
                                                >
                                                  <Picker.Item label={i18n.t("Select Option")} value="" />
                                                  <Picker.Item label={i18n.t("Yes")} value="yes" />
                                                  <Picker.Item label={i18n.t("No")}value="no" />
                                                </Picker>
                                              </Item>
                                            </View>

                                    <Text style={{textAlign:"center",color:"#f45b5b",marginTop:5}}>
                                {this.state.password&&this.state.password!=this.state.cpassword?i18n.t("please rewtire the same password"):""}
                                </Text>

                                <View
                            style={{
                                marginTop: 15,
                                marginBottom: 0,
                                flex: 2,
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                flexDirection: "row",
                            }}>
                       
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
                                        marginBottom: 0,
                                        width: 150,
                                        padding: 10,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center"
                                    }}
                                >


                                    <Text style={{ fontWeight: "bold" }}>{i18n.t('Register')}
                                        <Icon style={{ fontSize: 14 }} type="AntDesign" name={i18n.language=='ar'?"left":"right"} /></Text>

                                </View>



                            </TouchableOpacity>
                            

                        </View>

                                </View>

                                


                            </View>
                        </Form>
 
                      
                        <View
                            style={{
                                flex: 1,
                                jusifyContent: 'center',
                                alignItems: "center",
                                marginTop: 15,
                                fontWeight: "bold",
                                marginBottom:15
                            }}>
                            <Text>{i18n.t('have an account?')} <Text></Text>
                                <Text
                                    onPress={() => this.props.navigation.navigate("Login")}
                                    style={{
                                        color: '#ed9995',
                                        fontWeight: "bold"
                                    }}>
                                    {i18n.t('Login')}</Text>
                            </Text>

                        </View>





                        <Social/>
                    </Content>
                </ImageBackground>

                {/* <FooterBottom {...this.props}/> */}
            </Container>
        );
    }
}

export default withTranslation()(Register);