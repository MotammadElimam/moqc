import React, { Component } from "react";
import { withTranslation } from 'react-i18next';
import RNPickerSelect from 'react-native-picker-select';
import { Pressable, StyleSheet, ImageBackground, Image, Modal, I18nManager, View, TouchableOpacity, Dimensions, Alert } from 'react-native'
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

import { AsyncStorage } from 'react-native';
import DropShadow from "react-native-drop-shadow";
import FooterBottom from "./Footer";
import { auto } from "async";
import API from "../api/";
import { TextInput } from "react-native-gesture-handler";
var FormData = require('form-data');
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DatePicker from 'react-native-date-picker'
import { Picker } from "@react-native-picker/picker"; // Import Picker
import Social from "./components/social";
import { TextInputMask } from 'react-native-masked-text';
import axios from "axios";

class Signup4 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rtl: false,
            countries: [],
            country: null,
            full_name: this.props.data.full_name || "",
            // last_name: this.props.data.last_name ||"",
            // age: this.props.data.age || "",


            contact_phone: this.props.data.contact_phone || "",
            dob: this.props.data.dob || new Date(),
            formattedDate: new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2),
            openDate: false,
            validFirstName: this.props.data.full_name !== '',
            // validLastName: this.props.data.last_name !== '',

            validPhone: this.props.data.contact_phone !== '',
            // validAge: this.props.data.age !== '',
            validDob: this.props.data.dob && new Date(this.props.data.dob).toDateString() !== new Date().toDateString(),
            nationality: this.props.data.nationality || "",
            validNationality: this.props.data.nationality !== '',
            educational_qualification: this.props.data.educational_qualification || "",
            validEducational: this.props.data.educational_qualification !== '',
            country_of_residence: this.props.data.country_of_residence || "",
            validCountry: this.props.data.country_of_residence !== '',
            emirates_state: this.props.data.emirates_state || "",
            validState: this.props.data.emirates_state !== '',


        };
    }

    getCountries = async () => {
        try {
            const res = await axios.get("https://moqc.ae/api/countries");
            if (res.data && Array.isArray(res.data)) {
                this.setState({ countries: res.data });
                // console.log("COuntries Data", this.state.countries)
            } else {
                console.error("Unexpected API response format", res.data);
            }
        } catch (error) {
            console.error("Failed to fetch countries:", error);
            alert("Unable to fetch countries. Please try again later.");
        }
    };
    onChange = (selectedDate) => {
        let currentDate;
        if (selectedDate instanceof Date && !isNaN(selectedDate)) {
            currentDate = selectedDate;
        } else {
            currentDate = new Date(selectedDate);
        }
        const formattedDate =
            currentDate.getFullYear() +
            "-" +
            ("0" + (currentDate.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + currentDate.getDate()).slice(-2);
        this.setState({
            dob: formattedDate,
            formattedDate,
        }),
            () => {
                this.validateField("dob");
            }
        this.handleInputChange({ dob: formattedDate });
    };
    validateField = (fieldName) => {
        const { full_name, nationality, educational_qualification, country_of_residence, emirates_state, contact_phone, dob } = this.state;
        let isValid = true;

        switch (fieldName) {
            case 'full_name':
                isValid = !!full_name;
                this.setState({ validFirstName: isValid });
                break;
            case 'nationality':
                isValid = !!nationality;
                this.setState({ validNationality: isValid });
                break;
            case 'educational_qualification':
                isValid = !!educational_qualification;
                this.setState({ validEducational: isValid });
                break;
            case 'country_of_residence':
                isValid = !!country_of_residence;
                this.setState({ validCountry: isValid });
                break;
            case 'emirates_state':
                isValid = country_of_residence === "230" ? !!emirates_state : true;
                this.setState({ validState: isValid });
                break;
            case 'contact_phone':
                isValid = !!contact_phone;
                this.setState({ validPhone: isValid });
                break;
            case 'dob':
                const currentDate = new Date();
                const selectedDate = new Date(dob);
                isValid = dob && selectedDate.toDateString() !== currentDate.toDateString();
                this.setState({ validDob: isValid });
                break;
            default:
                break;
        }

        return isValid;
    };
    componentDidMount = async () => {
        this.getCountries();


    };
    //    handleInputChange = (value) => {
    //        this.setState(value, () => {
    //            // Validate the specific field that was changed
    //            Object.keys(value).forEach((key) => {
    //                this.validateField(key);
    //            });
    //        });
    //        this.props.updateParentState(value);
    //    };
    //
    handleInputChange = (value) => {
        const key = Object.keys(value)[0];
        let unmaskedValue = value[key];
        if (key === "contact_phone") {
            unmaskedValue = unmaskedValue.replace(/[\(\)\-\s]/g, "");
        }
        this.setState({ [key]: unmaskedValue }, () => {
            this.validateField(key);
        });
        this.props.updateParentState({ [key]: unmaskedValue });
    };

    validateInputs = () => {
        const { full_name, nationality, educational_qualification, country_of_residence, emirates_state, contact_phone } = this.state;
        let valid = true;

        // Reset validation states
        this.setState({
            validFirstName: true,
            validNationality: true,
            validEducational: true,
            validCountry: true,
            validState: true,
            validPhone: true,
            // validAge: true,
        });

        // Validate all fields
        valid = this.validateField('full_name') && valid;
        valid = this.validateField('nationality') && valid;
        valid = this.validateField('educational_qualification') && valid;
        valid = this.validateField('country_of_residence') && valid;
        if (country_of_residence === "230") {
            valid = this.validateField('emirates_state') && valid;
        }
        valid = this.validateField('contact_phone') && valid;

        return valid;
    };

    handleNext = () => {
        if (this.validateInputs()) {
            this.props.updateParentState({ active_step: this.props.data.active_step + 1 });
        }
    };
    render() {
        const { t, i18n } = this.props;
        console.log(this.state.gender)
        return (
            <View style={{ marginTop: 30, flex: 1, marginBottom: 20 }}>
                <View style={{ flex: 10, flexDirection: "column", }}>
                    <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", alignContent: "flex-start", alignSelf: "flex-start", paddingHorizontal: 20, paddingVertical: 5 }}>
                        <Text style={{ fontWeight: "bold" }}>
                            {i18n.t("Full Name")}
                        </Text>
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input
                                style={{
                                    borderRadius: 0,
                                    backgroundColor: "#EEEFF4",

                                    marginTop: 5,
                                    borderBottomWidth: 0,
                                    padding: 15,
                                    width: width - 50,
                                    textAlign: this.state.rtl
                                        ? 'left'
                                        : 'right'
                                }}
                                value={this.state.full_name}
                                onChangeText={(full_name) => this.handleInputChange({ full_name })}
                                placeholder={i18n.t("Full Name")} />
                        </Item>
                        {!this.state.validFirstName && (
                            <Text style={{ color: "red" }}>{t("Please enter your full name")}</Text>
                        )}
                    </View>
                    {/* <View
                        style={{
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            alignSelf: "flex-start",
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                            zIndex: 999,
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>{i18n.t("Nationality")}</Text>
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Picker
                                selectedValue={this.state.nationality}
                                onValueChange={(nationality) => this.handleInputChange({ nationality })}
                                style={{
                                    height: 50,
                                    width: width - 80,
                                    backgroundColor: "#EEEFF4",
                                    marginTop: 5,
                                    zIndex: 999,
                                    position: "relative",
                                }}
                            >
                                <Picker.Item label={i18n.t("Select a nationality")} value="" />
                                {this.state.countries.map((country, index) => (
                                    <Picker.Item
                                        key={index}
                                        label={country.country_name_ar}
                                        value={country.id}
                                    />
                                ))}
                            </Picker>
                        </Item>
                        {!this.state.validNationality && (
                            <Text style={{ color: "red" }}>{t("Please select your nationality")}</Text>
                        )}
                    </View> */}

                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            alignSelf: 'flex-start',
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                            textAlign: 'right',
                            zIndex: 999,
                        }}
                    >
                        <Text style={{ fontWeight: 'bold' }}>{i18n.t('Nationality')}</Text>

                        <RNPickerSelect
                            value={this.state.nationality}
                            onValueChange={(nationality) => this.handleInputChange({ nationality })}
                            items={[
                                { label: i18n.t('Select a nationality'), value: '' },
                                ...this.state.countries.map((country) => ({
                                    label: country.country_name_ar,
                                    value: country.id,
                                })),
                            ]}
                            style={{
                                inputIOS: {
                                    height: 50,
                                    width: width - 80,
                                    backgroundColor: '#EEEFF4',
                                    marginTop: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    textAlign: 'right',
                                },
                                inputAndroid: {
                                    height: 50,
                                    width: width - 80,
                                    backgroundColor: '#EEEFF4',
                                    marginTop: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    textAlign: 'right',
                                },
                            }}
                        />
                        {!this.state.validNationality && (
                            <Text style={{ color: 'red' }}>{i18n.t('Please select your nationality')}</Text>
                        )}
                    </View>

                    {/* Date of Birth Field */}
                    <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", paddingHorizontal: 20, paddingVertical: 5 }}>
                        <Text style={{ fontWeight: "bold" }}>{i18n.t("Date of Birth")}</Text>
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
                                {this.state.formattedDate}
                            </Text>

                        </Pressable>
                        {!this.state.validDob &&
                            <Text style={{ color: "red" }}>
                                {i18n.t("Please select a valid date of birth")}
                            </Text>
                        }
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={this.state.openDate}
                            onRequestClose={() => this.setState({ openDate: false })}
                        >
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                                <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: width - 40 }}>
                                    <DatePicker
                                        date={new Date(this.state.dob)}
                                        mode="date"
                                        onDateChange={(dob) => this.onChange(dob)}
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

                    <View
                        style={{
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            alignSelf: "flex-start",
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>{i18n.t("Educational Qualification")}</Text>
                        <RNPickerSelect
                            value={this.state.educational_qualification} // Selected value bound to state
                            onValueChange={(educational_qualification) =>
                                this.handleInputChange({ educational_qualification })
                            }
                            items={[
                                { label: i18n.t('Educational Qualification'), value: '' },
                                { label: i18n.t('Primary'), value: '1' },
                                { label: i18n.t('Secondary'), value: '2' },
                                { label: i18n.t('University'), value: '3' },
                                { label: i18n.t('Postgraduate'), value: '4' },
                            ]}
                            style={{
                                inputIOS: {
                                    height: 50,
                                    width: width - 80,
                                    backgroundColor: '#EEEFF4',
                                    marginTop: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    textAlign: 'right',
                                },
                                inputAndroid: {
                                    height: 50,
                                    width: width - 80,
                                    backgroundColor: '#EEEFF4',
                                    marginTop: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    textAlign: 'right',
                                },
                            }}
                        />
                        {!this.state.validEducational && (
                            <Text style={{ color: "red" }}>{t("Please select your educational qualification")}</Text>
                        )}
                    </View>


                    <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", paddingHorizontal: 20, paddingVertical: 5 }}>
                        {/* Phone Field */}
                        <Text style={{ fontWeight: "bold" }}>{i18n.t("Phone")}</Text>
                        <Item style={{ borderBottomWidth: 0 }}>
                            <TextInputMask
                                type={"custom"}
                                options={{
                                    mask: "(999) 999-9999" // Phone number format
                                }}
                                keyboardType={"number-pad"}
                                style={{
                                    borderRadius: 0,
                                    backgroundColor: "#EEEFF4",
                                    marginTop: 5,
                                    borderBottomWidth: 0,
                                    padding: 10,
                                    width: width - 80,
                                    textAlign: this.state.rtl
                                        ? 'left'
                                        : 'right'
                                }}
                                value={this.state.contact_phone} // Display the unmasked state value with the mask applied
                                onChangeText={(maskedValue) => this.handleInputChange({ contact_phone: maskedValue })}
                                placeholder={i18n.t("Phone")}
                                maxLength={14}
                            />
                        </Item>
                        {!this.state.validPhone && (
                            <Text style={{ color: "red" }}>{i18n.t("Please enter your phone number")}</Text>
                        )}
                    </View>
                    {/* Country Dropdown */}
                    <View
                        style={{
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            alignSelf: "flex-start",
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>{i18n.t("Country of residence")}</Text>
                        <RNPickerSelect
                            value={this.state.country_of_residence}
                            onValueChange={(country_of_residence) =>
                                this.handleInputChange({ country_of_residence })
                            }
                            items={[
                                { label: i18n.t('Country of residence'), value: '' },
                                ...this.state.countries.map((country) => ({
                                    label: country.country_name_ar,
                                    value: country.id,
                                })),
                            ]}
                            style={{
                                inputIOS: {
                                    height: 50,
                                    width: width - 80,
                                    backgroundColor: '#EEEFF4',
                                    marginTop: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    textAlign: 'right'
                                },
                                inputAndroid: {
                                    height: 50,
                                    width: width - 80,
                                    backgroundColor: '#EEEFF4',
                                    marginTop: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    textAlign: 'right'
                                },
                            }}
                        />

                        {!this.state.validCountry && (
                            <Text style={{ color: "red" }}>{t("Please select country of residence")}</Text>
                        )}
                    </View>









                    {/* Country Dropdown */}
                    {this.state.country_of_residence === '230' ?
                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                alignSelf: "flex-start",
                                paddingHorizontal: 20,
                                paddingVertical: 5,
                            }}
                        >
                            <Text style={{ fontWeight: "bold" }}>{i18n.t("EMIRATE")}</Text>
                            <RNPickerSelect
                                value={this.state.emirates_state} // Bound to state
                                onValueChange={(emirates_state) => this.handleInputChange({ emirates_state })}
                                items={[
                                    { label: i18n.t('Select EMIRATE'), value: '' },
                                    { label: i18n.t('Dubai'), value: '1' },
                                    { label: i18n.t('Sharjah'), value: '2' },
                                    { label: i18n.t('Abu Dhabi'), value: '3' },
                                    { label: i18n.t('Ajman'), value: '4' },
                                    { label: i18n.t('Umm Al Quwain'), value: '5' },
                                    { label: i18n.t('Fujairah'), value: '6' },
                                    { label: i18n.t('Ras Al-Khaimah'), value: '7' },
                                ]}
                                style={{
                                    inputIOS: {
                                        height: 50,
                                        width: width - 80,
                                        backgroundColor: '#EEEFF4',
                                        marginTop: 5,
                                        paddingHorizontal: 10,
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        textAlign:'right'
                                    },
                                    inputAndroid: {
                                        height: 50,
                                        width: width - 80,
                                        backgroundColor: '#EEEFF4',
                                        marginTop: 5,
                                        paddingHorizontal: 10,
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        textAlign:'right'
                                    },
                                }}
                            />
                            {this.state.country_of_residence === '230' && !this.state.validState && (
                                <Text style={{ color: "red" }}>{t("Please select EMIRATE")}</Text>
                            )}
                        </View> : <Text></Text>}














                    {/* Age Field */}
                    {/* <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", paddingHorizontal: 20, paddingVertical: 5 }}>
                        <Text style={{ fontWeight: "bold" }}>{i18n.t("Age")}</Text>
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input
                                keyboardType={"number-pad"}
                                style={{
                                    borderRadius: 0,
                                    backgroundColor: "#EEEFF4",
                                    marginTop: 5,
                                    borderBottomWidth: 0,
                                    padding: 10,
                                    width: width - 50, // Ensure the same width
                                    textAlign: this.state.rtl ? 'left' : 'right'
                                }}
                                value={this.state.age}
                                onChangeText={(age) => this.handleInputChange({ age })}
                                placeholder={i18n.t("Age")}
                            />
                        </Item>
                        {!this.state.validAge && (
                            <Text style={{ color: "red" }}>{t("Please enter your age")}</Text>
                        )}

                    </View> */}


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
                            <Icon type="AntDesign" name="caretright" style={{ fontSize: 10, transform: [{ rotate: '180deg' }] }} />


                        </Button>
                    </View>

                </View>
                <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center", marginRight: 10, marginLeft: 10, marginTop: 10 }}>

                </View>
            </View>

        );
    }
}

export default withTranslation()(Signup4);