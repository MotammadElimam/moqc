import React, { Component } from "react";
import { withTranslation } from 'react-i18next';

import { StyleSheet, ImageBackground, PermissionsAndroid, Platform, Image, I18nManager, View, TouchableOpacity, Alert } from 'react-native'
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
} from "native-base";
// import ImagePicker from "react-native-customized-image-picker";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
//import ImagePicker from 'react-native-image-picker';
import AsyncStorage from 'react-native';
import DropShadow from "react-native-drop-shadow";
import FooterBottom from "./Footer";
import { auto } from "async";
import axios from 'axios';
import API from "../api/";
import Social from "./components/social";
import { ActivityIndicator } from 'react-native-paper';
var FormData = require('form-data');



class Signup2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rtl: false,
            gender: 0,
            user: 0,
            user_img: require("../assets/select_picture_m.png"),
            selected_img: this.props.data.selected_img || null,
            image_base64: this.props.data.image_base64 || null,
            isValid: false,
            selected_img_name: this.props.data.selected_img_name || null,
            selected_img_type: this.props.data.selected_img_type || null,
            show_spinner: false
        };
    }
    selectImage = () => {
        Alert.alert(
            "Select Image Source",
            "Choose where to pick the image from:",
            [
                { text: "Camera", onPress: this.handleCameraLaunch },
                { text: "File", onPress: this.openImagePicker },
                { text: "Cancel", onPress: () => console.log('Cancelled'), style: "cancel" },
            ],
            { cancelable: true }
        );
    };
    openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, this.handleResponse);
    };

    handleCameraLaunch = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message: "This app needs access to your camera to take photos.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Camera permission granted");
                this.launchCamera();
            } else {
                console.log("Camera permission denied");
                Alert.alert("Permission Denied", "Camera access is required to take a photo.");
            }
        } else {
            // For iOS, permissions are handled automatically or need configuration in Xcode
            this.launchCamera();
        }
    };
    launchCamera = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
        };
        launchCamera(options, this.handleResponse);
    };


    handleResponse = async (response) => {
        this.setState({ show_spinner: true });

        if (response.didCancel) {
            this.setState({ show_spinner: false });
            console.log('User cancelled image picker');
        } else if (response.error) {
            this.setState({ show_spinner: false });
            console.log('Image picker error: ', response.error);
        } else {
            const asset = response.assets?.[0];
            const selected_img = asset.uri;
            const image_base64 = asset.base64;
            const selected_img_name = asset.fileName;
            const selected_img_type = asset.type;

            this.setState({ selected_img, image_base64, selected_img_name, selected_img_type });

            const formData = new FormData();
            formData.append('file', {
                uri: selected_img,
                type: selected_img_type,
                name: selected_img_name,
            });

            try {
                const apiResponse = await axios.post('https://moqc.ae/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (apiResponse.status === 200) {
                    const responseData = apiResponse.data;
                    const uploadedImageUrl = responseData.file;
                    this.validate();
                    this.props.updateParentState({
                        selected_img: uploadedImageUrl,
                        image_base64,
                        selected_img_name,
                        selected_img_type,
                    });

                    console.log('Image upload successful:', uploadedImageUrl);
                } else {
                    this.setState({ selected_img: null, image_base64: null, selected_img_name: null, selected_img_type: null });
                    Alert.alert(
                        'Error',
                        apiResponse.status,
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                    console.log('Image upload failed. Status:',);
                }
            } catch (error) {
                this.setState({ selected_img: null, image_base64: null, selected_img_name: null, selected_img_type: null });
                Alert.alert(
                    'Error',
                    error
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                console.log('Error uploading image:', error);
            } finally {
                this.setState({ show_spinner: false });
            }
        }
    };
    validate = () => {
        const { selected_img } = this.state;
        const isValid = selected_img !== null && selected_img !== "";
        this.setState({ isValid });
        return isValid;
    };

    handleNext = () => {
        if (this.validate()) {
            this.props.updateParentState({ active_step: this.props.data.active_step + 1 });
        }
    };

    componentDidMount = async () => {
        const { gender } = this.props.data;
        this.setState({ gender })
        if (gender == 2) {
            this.setState({
                user_img: require("../assets/select_picture_f.png"),

            })
        }
        if (I18nManager.isRTL === true) {
            this.setState({ rtl: true })
        } else {
            this.setState({ rtl: false })
        }
    }
    saveUser = async (props) => {
        if (this.state.image_base64 == null) {
            Alert.alert(
                "Select Profile Pic",
                "Please Select Profile Picture",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );

            return;
        }
        let reg_token = await AsyncStorage.getItem("@moqc:reg_token");
        const formData = new FormData();
        formData.append('registration_token', JSON.parse(reg_token));
        formData.append('profile_pic', this.state.image_base64);

        API.signup(formData)
            .then(async (resp) => {
                this.setState({ show_spinner: false })
                console.log(resp)

                if (resp == "success") {
                    this.props.navigation.navigate("Signup4")
                } else {
                    const { navigate } = this.props.navigation;
                    Alert.alert(
                        "Error",
                        "There's an Error in Backend.",
                        [
                            { text: "OK", onPress: () => { console.log("Error") } }
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch(err => {
                console.log(err)
                alert(err)
            });

        await AsyncStorage.setItem('@moqc:gender', JSON.stringify(this.state.gender));
        console.log("saved");
        let gender = await AsyncStorage.getItem("@moqc:gender");
        console.log(gender);
        console.log("Fetched")


    }

    render() {
        const { t, i18n } = this.props;
        console.log(this.state.gender);
        const spinner = this.state.show_spinner;
        return (
            <View style={{ marginTop: 30, flex: 1, marginBottom: 20 }}>
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                }}>
                </View>
                {spinner ? (
                    <ActivityIndicator size="large" color="green" />
                ) : (
                    <View style={{ flex: 10, flexDirection: "column", justifyContent: "center", alignItems: "center", alignSelf: "center", }}>
                        <TouchableOpacity onPress={(e) => this.selectImage()}>
                            {
                                this.state.selected_img === null ?

                                    (
                                        <Image
                                            source={this.state.selected_img === null ? this.state.user_img : this.state.selected_img}
                                            style={{
                                                height: 250,
                                                width: 200,
                                                marginRight: 15,
                                                marginLeft: 15,
                                                resizeMode: "contain"
                                            }} />
                                    )

                                    :

                                    (
                                        <Image
                                            source={{ uri: this.state.selected_img }}
                                            style={{
                                                height: 170,
                                                width: 170,
                                                marginRight: 15,
                                                marginLeft: 15,
                                                resizeMode: "contain",
                                                borderRadius: 100,
                                                marginTop: 40
                                            }} />
                                    )
                            }

                        </TouchableOpacity>
                        {!this.state.isValid && <Text style={{ color: "red" }}>{t("Please upload image")}</Text>}
                    </View>)}
                <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center", marginRight: 10, marginLeft: 10, marginTop: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        {i18n.t("Upload your image here")}
                    </Text>
                </View>

                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center",
                        marginTop: 5,
                        marginBottom: 5,
                    }}>
                    <Button
                        onPress={this.handleNext}
                        style={{
                            width: 100,
                            borderRadius: 30,
                            justifyContent: "center",
                            alignContent: "center",
                            backgroundColor: "#31314f",
                        }}
                    >
                        <Text style={{ color: "#fff", marginRight: 10 }}>{t("Next")}</Text>
                        <Icon type="AntDesign" name="caretright" style={{ fontSize: 10,transform: [{ rotate: '180deg' }] }} />

                    </Button>
                </View>
            </View>
        );
    }
}

export default withTranslation()(Signup2);