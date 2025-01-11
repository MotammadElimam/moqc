import React, { useLayoutEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    I18nManager,
    SafeAreaView,
    ImageBackground,
    Image,
    Dimensions,
    Modal,
    Pressable,
    PermissionsAndroid
} from 'react-native';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input } from 'native-base';
import GetLocation from 'react-native-get-location'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import API from "../api";
import Axios from 'axios'
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from 'rn-fetch-blob'
import Toast from 'react-native-simple-toast';
import i18n from '../i18n';
import axios from 'axios';


class TeamPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confpass: ''
        }
    }


    reset = async () => {
        let token = await AsyncStorage.getItem("@moqc:token")
        var team_id = this.props.route.params.team_id
        let body = new FormData()

        body.append("password", this.state.password)
        const response = await axios.post(`https://moqc.ae/api/editTeamMemeber/${team_id}`,
            body,
            {
                headers: { "token": token }
            });
        if (response.status === 200) {
            Toast.showWithGravity('Password Reset Successfull', Toast.SHORT, Toast.CENTER);
        }
    }

    render() {
        return (
            <Container style={{ flex: 1 }}>
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                        margin: 20
                    }}>
                    <View style={{ borderWidth: 1, borderRadius: 20, borderColor: '#D5D5D5', padding: 20 }}>

                        <View style={{ marginVertical: 5, flexDirection: 'column', alignItems: "center" }}>
                            <Text style={{width: '100%', fontWeight: 'bold' }}>{i18n.t('New Password')} : </Text>
                            <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                onChangeText={(e) => {

                                    this.setState({ password: e })
                                }}></TextInput>
                        </View>

                        <View style={{ marginVertical: 5, flexDirection: 'column', alignItems: "center" }}>
                            <Text style={{ width: '100%', fontWeight: 'bold' }}>{i18n.t('Confirm Password')} : </Text>
                            <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                onChangeText={(e) => {

                                    this.setState({ confpass: e })
                                }}></TextInput>
                            {/* {this.state.password!==this.state.confpass ? <Text>{i18n.t('Should be same as above')}</Text>:""} */}
                        </View>

                        <Pressable onPress={() => this.reset()} style={{ bottom: 0, alignSelf: 'flex-end' }}><Text style={{ fontWeight: 'bold', fontSize: 16, color: 'green' }}>{i18n.t('Reset')}</Text></Pressable>
                    </View>
                </ImageBackground>
                {/* <Footer location={"profile"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(TeamPassword)

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    sectionWrapper: {
        padding: 20
    },
    heading: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'left'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    regularText: {
        textAlign: 'left'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textInput: {
        textAlign: I18nManager.isRTL
            ? 'right'
            : 'left'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalView: {
        marginHorizontal: 10,
        width: 350,
        height: 220,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});