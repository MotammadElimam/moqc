import React, { Component } from "react";
import { withTranslation } from 'react-i18next';
import axios from 'axios';
import { StyleSheet, ImageBackground, Image, I18nManager, View, TouchableOpacity, Dimensions, Alert, Pressable, Modal } from 'react-native'
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
import DatePicker from 'react-native-date-picker';
import { AsyncStorage } from 'react-native';
import DropShadow from "react-native-drop-shadow";
import FooterBottom from "./Footer";
import { auto } from "async";
import ImagePicker from "react-native-customized-image-picker";
import API from "../api/";
import { TextInput } from "react-native-gesture-handler";
import Social from "./components/social";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
var FormData = require('form-data');
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import { ActivityIndicator } from 'react-native-paper';

class Signup6 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rtl: false,
            gender: 0,
            user: 0,
            user_img: require("../assets/select_picture_m.png"),
            passport: this.props.data.passport || null,
            // passport_expiry: this.props.passport_expiry || '',
            id_expiry: this.props.data.id_expiry || new Date(),
            formattedDate: new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2),
            passport_base64: this.props.data.passport_base64 || null,
            passport_name: this.props.data.passport_name || null,
            passport_type: this.props.data.passport_type || null,
            id_front: this.props.data.id_front || null,
            id_expiry: this.props.id_expiry || '',
            id_front_base64: this.props.data.id_front_base64 || null,
            id_front_name: this.props.data.id_front_name || null,
            id_front_type: this.props.data.id_front_type || null,
            id_back: this.props.data.id_back || null,
            id_back_base64: this.props.data.id_back_base64 || null,
            id_back_name: this.props.data.id_back_name || null,
            id_back_type: this.props.data.id_back_type || null,
            form: [],
            showEmiratesId: false,
            show_spinner: false,
            openDate: false,
            openDate1: false
        };
        // this.validateField = this.validateField.bind(this);
        this.onChange = this.onChange.bind(this);
    }



    handleImage = async (type, response) => {
        this.setState({ show_spinner: true });
        if (response.didCancel) {
            this.setState({ show_spinner: false });
            console.log("User cancelled image picker");
        } else if (response.error) {
            this.setState({ show_spinner: false });
            console.log("Image picker error: ", response.error);
        } else {
            const selected_img = response.uri || response.assets?.[0]?.uri;
            const image_base64 = response.base64 || response.assets?.[0]?.base64;
            const fileName = response.fileName || response.assets?.[0]?.fileName || "unknown_file";
            const fileType = response.type || response.assets?.[0]?.type || "unknown_type";
            const updateState = {
                [`${type}`]: selected_img,
                [`${type}_base64`]: image_base64,
                [`${type}_name`]: fileName,
                [`${type}_type`]: fileType,
            };
            this.setState(updateState);
            this.props.updateParentState(updateState);

            const formData = new FormData();
            formData.append('file', {
                uri: selected_img,
                type: fileType,
                name: fileName,
            });

            try {
                this.setState({ show_spinner: true });
                const apiResponse = await axios.post('https://moqc.ae/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (apiResponse.status === 200) {
                    const responseData = apiResponse.data;
                    const uploadedImageUrl = responseData.file;
                    this.props.updateParentState({
                        [`${type}`]: uploadedImageUrl,
                        [`${type}_base64`]: image_base64,
                        [`${type}_name`]: fileName,
                        [`${type}_type`]: fileType,
                    });

                    console.log('Image upload successful:', uploadedImageUrl);
                } else {
                    const errorState = {
                        [`${type}`]: null,
                        [`${type}_base64`]: null,
                        [`${type}_name`]: null,
                        [`${type}_type`]: null,
                    };
                    Alert.alert('Error', `Image upload failed with status: ${apiResponse.status}`, [{ text: 'OK' }], { cancelable: false });
                    console.log('Image upload failed. Status:', apiResponse.status);
                }
            } catch (error) {
                const errorState = {
                    [`${type}`]: null,
                    [`${type}_base64`]: null,
                    [`${type}_name`]: null,
                    [`${type}_type`]: null,
                };
                Alert.alert('Error', error.message, [{ text: 'OK' }], { cancelable: false });
                console.log('Error uploading image:', error);
            } finally {
                this.setState({ show_spinner: false });
            }
        }
    };

    onChange = (selectedDate, field) => {
        let currentDate;

        if (selectedDate instanceof Date && !isNaN(selectedDate)) {
            currentDate = selectedDate;
        } else if (typeof selectedDate === "string") {
            currentDate = new Date(selectedDate);
            if (isNaN(currentDate)) {
                console.error("Invalid date string:", selectedDate);
                return;
            }
        } else {
            console.error("Invalid date input:", selectedDate);
            return;
        }

        const formattedDate = `${currentDate.getFullYear()}-${("0" + (currentDate.getMonth() + 1)).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}`;

        this.props.updateParentState({ [field]: formattedDate });

        // Update appropriate field and formatted date state
        if (field === "id_expiry") {
            this.setState({
                id_expiry: formattedDate,
                formattedIdExpiry: formattedDate,
            });
        } else if (field === "passport_expiry") {
            this.setState({
                passport_expiry: formattedDate,
                formattedPassportExpiry: formattedDate,
            });
        }
    };

    // validateField(fieldName) {
    //     if (fieldName === "id_expiry") {
    //         const isValid = this.state.id_expiry && this.state.id_expiry !== "";
    //         if (!isValid) {
    //             console.error("ID Expiry is invalid");
    //         }
    //     } else {
    //         console.warn("Unhandled field validation:", fieldName);
    //     }
    // }
    // Image picker for both passport and emirates id
    openImagePicker = (type) => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => this.handleImage(type, response));
    };

    // Camera capture for both passport and emirates id
    handleCameraLaunch = async (type) => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
        };

        launchCamera(options, (response) => this.handleImage(type, response));
    };
    validate = () => {
        const { passport, id_front, passport_expiry, id_expiry, rtl } = this.state;
    
        let errors = {};
    
        // Conditional validation messages based on RTL
        const errorMessages = {
            id_front: rtl ? "يرجى تحميل بطاقة هوية إماراتية صالحة." : "Please upload a valid Emirates ID.",
            id_expiry: rtl ? "يرجى تقديم تاريخ انتهاء صالح في المستقبل لبطاقة الهوية الإماراتية." : "Please provide a valid future expiry date for the Emirates ID.",
            passport: rtl ? "يرجى تحميل جواز سفر صالح." : "Please upload a valid passport.",
            passport_expiry: rtl ? "يرجى تقديم تاريخ انتهاء صالح في المستقبل لجواز السفر." : "Please provide a valid future expiry date for the passport.",
            validationError: rtl ? "خطأ في التحقق" : "Validation Error"
        };
    
        // Normalize today's date to avoid time issues
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to midnight for date-only comparison
    
        // Helper function to parse and validate a date
        const parseAndValidateDate = (dateStr) => {
            const date = new Date(dateStr);
            return date instanceof Date && !isNaN(date.getTime()) && date > today;
        };
    
        // Validate Emirates ID
        if (!id_front || id_front.trim() === "") {
            errors.id_front = errorMessages.id_front;
        }
        if (!id_expiry || !parseAndValidateDate(id_expiry)) {
            errors.id_expiry = errorMessages.id_expiry;
        }
    
        // Validate Passport
        if (!passport || passport.trim() === "") {
            errors.passport = errorMessages.passport;
        }
        if (!passport_expiry || !parseAndValidateDate(passport_expiry)) {
            errors.passport_expiry = errorMessages.passport_expiry;
        }
    
        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            Alert.alert(errorMessages.validationError, firstError);
            this.setState({ isValid: false });
            return false;
        }
    
        // No errors
        this.setState({ isValid: true });
        return true;
    };
     
    validateExpiryField = (field, value) => {
        const [month, year] = value.split("/");
        const isValidFormat = /^((0[1-9])|(1[0-2]))\/\d{4}$/.test(value);
        const isMonthValid = month && parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12;
        const isValid = isValidFormat && isMonthValid;
        this.setState({ [`valid${field.charAt(0).toUpperCase() + field.slice(1)}`]: isValid });

        return isValid;
    };

    handleExpiryInputChange = (field, value) => {
        const formattedValue = value.replace(/[^0-9/]/g, "");
        if (formattedValue.length === 2 && !formattedValue.includes("/")) {
            value = formattedValue + "/";
        }

        this.setState({ [field]: value });
        if (field === "id_expiry" || field === "passport_expiry") {
            this.props.updateParentState({
                [field]: value,
            });
        }
    };

    handleNext = () => {
        if (this.validate()) {
            this.props.updateParentState({
                active_step: this.props.data.active_step + 1,
            });
        } else {
            console.log("Validation failed");
        }
    };

    resetImage = (type) => {
        if (type === "passport") {
            this.setState({
                passport: null,
                passport_base64: null,
            });
        } else if (type === "id_front") {
            this.setState({
                id_front: null,
                id_front_base64: null,
            });
        } else if (type === "id_back") {
            this.setState({
                id_back: null,
                id_back_base64: null,
            });
        }
    };


    componentDidMount = async () => {
        let nationality = this.props.data.nationality;
        let residence = this.props.data.country_of_residence;
        if (nationality === 'AE') {
            this.setState({ showEmiratesId: true });
        }
        if (I18nManager.isRTL === true) {
            this.setState({ rtl: true });
        } else {
            this.setState({ rtl: false });
        }
    };

    render() {
        const { t, i18n } = this.props;
        const { showEmiratesId, passport, id_front, id_back } = this.state;
        const spinner = this.state.show_spinner;

        return (
            <View style={{ marginTop: 30, flex: 1, marginBottom: 20 }}>
                <View style={{
                    flex: 10,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    flexWrap: "wrap", // Allow wrapping to the next line
                    alignItems: "center", // Center items vertically
                }}>
                    {spinner ? (
                        <ActivityIndicator size="large" color="green" />
                    ) : (
                        <>

                            

                            {/* First View */}
                            <View style={{
                                flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 20, width: "50%", // Adjust width to fit two items per row
                            }}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {i18n.t("Front Photo of ID")}
                                </Text>
                                <Image
                                    style={{
                                        height: 150,
                                        width: 150,
                                        marginTop: 20
                                    }}
                                    source={id_front ? { uri: id_front } : require('../assets/documents.png')} />
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => this.openImagePicker('id_front')}>
                                        <Image
                                            style={{
                                                resizeMode: "contain",
                                                width: 40,
                                            }}
                                            source={require('../assets/attach-doc.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.handleCameraLaunch('id_front')}>
                                        <Image
                                            style={{
                                                resizeMode: "contain",
                                                width: 40,
                                                marginHorizontal: 5
                                            }}
                                            source={require('../assets/camera-doc.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.resetImage('id_front')}>
                                        <Image
                                            style={{
                                                resizeMode: "contain",
                                                width: 40,
                                            }}
                                            source={require('../assets/trash-doc.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>

{/* Second View */}
<View style={{
                                flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 20, width: "50%", // Adjust width to fit two items per row
                            }}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {i18n.t("Back Photo of ID")}
                                </Text>
                                <Image
                                    style={{
                                        height: 150,
                                        width: 150,
                                        marginTop: 20
                                    }}
                                    source={id_back ? { uri: id_back } : require('../assets/documents.png')} />
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => this.openImagePicker('id_back')}>
                                        <Image
                                            style={{
                                                resizeMode: "contain",
                                                width: 40,
                                            }}
                                            source={require('../assets/attach-doc.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.handleCameraLaunch('id_back')}>
                                        <Image
                                            style={{
                                                resizeMode: "contain",
                                                width: 40,
                                                marginHorizontal: 5
                                            }}
                                            source={require('../assets/camera-doc.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.resetImage('id_back')}>
                                        <Image
                                            style={{
                                                resizeMode: "contain",
                                                width: 40,
                                            }}
                                            source={require('../assets/trash-doc.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>


                            <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 0, width: '100%' }}>
                                <Text style={{ fontWeight: "bold", textAlign:'left' }}> {i18n.t("ID Expiry")}</Text>
                                <Pressable onPress={() => this.setState({ openDate: true })}>
                                    <Text
                                        style={{
                                            borderRadius: 0,
                                            backgroundColor: "#EEEFF4",
                                            marginTop: 5,
                                            borderBottomWidth: 0,
                                            padding: 10,
                                            width: width - 80,
                                            textAlign: this.state.rtl ? "right" : "left",
                                        }}
                                    >
                                        {this.state.formattedIdExpiry}
                                    </Text>
                                </Pressable>
                                <Modal
                                    transparent={true}
                                    animationType="slide"
                                    visible={this.state.openDate}
                                    onRequestClose={() => this.setState({ openDate: false })}
                                >
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                                        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: width - 40 }}>
                                            <DatePicker
                                                date={this.state.id_expiry ? new Date(this.state.id_expiry) : new Date()}
                                                mode="date"
                                                onDateChange={(date) => this.onChange(date, "id_expiry")}
                                                locale="en"
                                            />
                                            <Pressable
                                                style={{
                                                    backgroundColor: "#007bff",
                                                    padding: 10,
                                                    borderRadius: 5,
                                                    marginTop: 20,
                                                }}
                                                onPress={() => this.setState({ openDate: false })}
                                            >
                                                <Text style={{ color: "white", textAlign: "center" }}>Close</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Modal>
                            </View>

                            {/* Third View (Centering the third view) */}
                            <View style={{
                                flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 20, width: "100%", // Center this view
                            }}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {i18n.t("Passport")}
                                </Text>
                                <Image
                                    style={{
                                        height: 150,
                                        width: 150,
                                        marginTop: 20
                                    }}
                                    source={passport ? { uri: passport } : require('../assets/documents.png')} />
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity onPress={() => this.openImagePicker('passport')}>
                                        <Image
                                            style={{
                                                resizeMode: "contain",
                                                width: 40,
                                            }}
                                            source={require('../assets/attach-doc.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.handleCameraLaunch('passport')}>
                                        <Image
                                            style={{
                                                resizeMode: "contain",
                                                width: 40,
                                                marginHorizontal: 5
                                            }}
                                            source={require('../assets/camera-doc.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.resetImage('passport')}>
                                        <Image
                                            style={{
                                                resizeMode: "contain",
                                                width: 40,
                                            }}
                                            source={require('../assets/trash-doc.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>


                            {/* Passport Expiry Field */}
                            <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 0, width: '100%' }}>
                                <Text style={{ fontWeight: "bold",textAlign:'left' }}> {i18n.t("Passport Expiry")}</Text>
                                <Pressable onPress={() => this.setState({ openDate1: true })}>
                                    <Text
                                        style={{
                                            borderRadius: 0,
                                            backgroundColor: "#EEEFF4",
                                            marginTop: 5,
                                            borderBottomWidth: 0,
                                            padding: 10,
                                            width: width - 80,
                                            textAlign: this.state.rtl ? "right" : "left",
                                        }}
                                    >
                                        {this.state.formattedPassportExpiry}
                                    </Text>
                                </Pressable>
                                <Modal
                                    transparent={true}
                                    animationType="slide"
                                    visible={this.state.openDate1}
                                    onRequestClose={() => this.setState({ openDate1: false })}
                                >
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                                        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: width - 40 }}>
                                            <DatePicker
                                                date={this.state.passport_expiry ? new Date(this.state.passport_expiry) : new Date()}
                                                mode="date"
                                                onDateChange={(date) => this.onChange(date, "passport_expiry")}
                                                locale="en"
                                            />
                                            <Pressable
                                                style={{
                                                    backgroundColor: "#007bff",
                                                    padding: 10,
                                                    borderRadius: 5,
                                                    marginTop: 20,
                                                }}
                                                onPress={() => this.setState({ openDate1: false })}
                                            >
                                                <Text style={{ color: "white", textAlign: "center" }}>Close</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </>
                    )}

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

export default withTranslation()(Signup6);
