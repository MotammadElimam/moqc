import React, { Component } from "react";
import { withTranslation } from 'react-i18next';
import { I18nManager } from 'react-native'
import {
    Container,
    Content,
    Text,
    View,
    Item,
    Input,
} from "native-base";
import {
    Button,
    Icon,

} from "native-base";
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from "@react-native-picker/picker"; // Import Picker
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import Dimensions from "react-native/Libraries/Utilities/Dimensions";
import axios from "axios";
let width = Dimensions.get("window").width;

class Signup5 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rtl: false,
            countries: [],
            available_courses: [],
            country: "",
            email: this.props.data.email || "",
            validEmail: this.props.data.email !== '',
            password: this.props.data.password || "",
            validPassword: this.props.data.password !== '',
            joined: this.props.data.joined || "",
            connection: this.props.data.connection || "",
            source: this.props.data.source || "",
            partsMemorize: this.props.data.partsMemorize || "",
            class_join: this.props.data.class_join || "",
            validJoined: this.props.data.joined !== '',
            validSource: this.props.data.source !== '',
        };
    }

    getCountries = async () => {
        try {
            const res = await axios.get("https://moqc.ae/api/countries");
            //            console.log("API Response:", res.data);
            if (res.data && Array.isArray(res.data)) {
                this.setState({ countries: res.data });
            } else {
                console.error("Unexpected API response format", res.data);
            }
        } catch (error) {
            console.error("Failed to fetch countries:", error);
            alert("Unable to fetch countries. Please try again later.");
        }
    };
    componentDidMount = async () => {
        this.getCountries();
        this.getCourses();
        // if (I18nManager.isRTL === true) {
        //     this.setState({ rtl: true });
        // } else {
        //     this.setState({ rtl: false });
        // }
    };


    validateField = (fieldName) => {
        const { email, password, joined, source, } = this.state;
        let isValid = true;

        switch (fieldName) {


            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = !!email && emailRegex.test(email);
                this.setState({ validEmail: isValid });
                break;
            case 'password':
                isValid = !!password && password.length >= 6;
                this.setState({ validPassword: isValid });
                break;
            case 'joined':
                isValid = !!joined;
                this.setState({ validJoined: isValid });
                break;
            case 'source':
                isValid = !!source;
                this.setState({ validSource: isValid });
                break;
            default:
                break;
        }

        return isValid;
    };

    handleInputChange = (value) => {
        this.setState(value, () => {
            Object.keys(value).forEach((key) => {
                this.validateField(key);
            });
        });
        this.props.updateParentState(value);
    };

    validateInputs = () => {
        const { email, password, joined, source, } = this.state;
        let valid = true;

        // Reset validation states
        this.setState({
            validEmail: true,
            validPassword: true,


            validJoined: true,
            validSource: true,

        });

        // Validate all fields

        valid = this.validateField('email') && valid;
        valid = this.validateField('password') && valid;

        valid = this.validateField('joined') && valid;
        valid = this.validateField('source') && valid;

        return valid;
    };

    handleNext = () => {
        if (this.validateInputs()) {
            this.props.updateParentState({ active_step: this.props.data.active_step + 1 });
        }
    };

    getCourses = async () => {
        try {
            const res = await axios.get("https://moqc.ae/api/available_courses");
            if (res.data && Array.isArray(res.data)) {
                this.setState({ available_courses: res.data });
                console.log("COurses Data", this.state.courses)
            } else {
                console.error("Unexpected API response format", res.data);
            }
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            alert("Unable to fetch courses. Please try again later.");
        }
    };


    render() {
        const { t, i18n } = this.props;
        const pickerOptions = Array.from({ length: 31 }, (_, index) => ({
            label: `${index}`,
            value: `${index}`,
        }));
        return (

            <View style={{ marginTop: 30, flex: 1, marginBottom: 20 }}>
                <View style={{ flex: 10, flexDirection: "column" }}>
                    <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", alignContent: "flex-start", alignSelf: "flex-start", paddingHorizontal: 20, paddingVertical: 5 }}>
                        <Text style={{ fontWeight: "bold" }}>
                            {i18n.t("Email")}
                        </Text>
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input
                                style={{
                                    borderRadius: 0,
                                    backgroundColor: "#EEEFF4",
                                    marginTop: 5,
                                    borderBottomWidth: 0,
                                    padding: 10,
                                    width: width - 50,
                                    textAlign: this.state.rtl
                                        ? 'left' : 'right'
                                }}
                                value={this.state.email}
                                onChangeText={(email) => this.handleInputChange({ email })}
                                placeholder={i18n.t("Email")} />
                        </Item>
                        {!this.state.validEmail && (
                            <Text style={{ color: "red" }}>{t("Please enter your email")}</Text>
                        )}
                    </View>

                    <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", alignContent: "flex-start", alignSelf: "flex-start", paddingHorizontal: 20, paddingVertical: 5 }}>
                        <Text style={{ fontWeight: "bold" }}>
                            {i18n.t("Password")}
                        </Text>
                        <Item style={{ borderBottomWidth: 0 }}>
                            <Input
                                style={{
                                    borderRadius: 0,
                                    backgroundColor: "#EEEFF4",
                                    marginTop: 5,
                                    borderBottomWidth: 0,
                                    padding: 10,
                                    width: width - 50,
                                    textAlign: this.state.rtl
                                        ? 'left'
                                        : 'right'
                                }}
                                value={this.state.password}
                                onChangeText={(password) => this.handleInputChange({ password })}
                                placeholder={i18n.t("Password")}
                                secureTextEntry={true}
                            />
                        </Item>
                        {!this.state.validPassword && (
                            <Text style={{ color: "red" }}>{t("Please enter password")}</Text>
                        )}
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
                        <Text style={{ fontWeight: "bold" }}>
                            {i18n.t("Did You Join MOQC Before?")}

                        </Text>
                        <RNPickerSelect
                            value={this.state.joined} // Bound to state
                            onValueChange={(joined) => this.handleInputChange({ joined })}
                            items={[
                                { label: i18n.t('Select an option'), value: '' },
                                { label: i18n.t('Yes'), value: 'yes' },
                                { label: i18n.t('No'), value: 'no' },
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
                        {!this.state.validJoined && (
                            <Text style={{ color: "red" }}>{t("Please select an option")}</Text>
                        )}
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
                        <Text style={{ fontWeight: "bold" }}>
                            {i18n.t("Functional connection")}

                        </Text>
                        <RNPickerSelect
                            value={this.state.connection}
                            onValueChange={(connection) => this.handleInputChange({ connection })}
                            items={[
                                { label: i18n.t('There is No'), value: 'There is No' },
                                { label: i18n.t('Student'), value: 'Student' },
                                { label: i18n.t('Employee'), value: 'Employee' },
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
                    </View>

                    {/* How did you find out about the center? Dropdown */}
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
                        <Text style={{ fontWeight: "bold" }}>
                            {i18n.t("How did you know about MOQC")}

                        </Text>
                        <RNPickerSelect
                            value={this.state.source} // Bound to state
                            onValueChange={(source) => this.handleInputChange({ source })}
                            items={[
                                { label: i18n.t('Select an option'), value: '' },
                                { label: i18n.t('X platform (Twitter)'), value: '1' },
                                { label: i18n.t('Instagram'), value: '2' },
                                { label: i18n.t('Website'), value: '3' },
                                { label: i18n.t('Friend'), value: '4' },
                                { label: i18n.t('Telegram'), value: '5' },
                                { label: i18n.t('YouTube'), value: '6' },
                                { label: i18n.t('WhatsApp'), value: '7' },
                                { label: i18n.t('Tik Tok'), value: '8' },
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
                        {!this.state.validSource && (
                            <Text style={{ color: "red" }}>{t("Please select an option")}</Text>
                        )}
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
                        <Text style={{ fontWeight: "bold" }}>
                            {t("No.of parts you memorize?")}

                        </Text>
                        <RNPickerSelect
                            value={this.state.partsMemorize}
                            onValueChange={(partsMemorize) => this.handleInputChange({ partsMemorize })}
                            items={[
                                { label: t("Select an option"), value: '' },
                                ...pickerOptions,
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
                        <Text style={{ fontWeight: "bold" }}>
                            {i18n.t("Name of Class you would like To Join")}

                        </Text>
                        <RNPickerSelect
                            value={this.state.class_join}
                            onValueChange={(class_join) => this.handleInputChange({ class_join })}
                            items={[
                                { label: i18n.t('Select an option'), value: '' },
                                ...this.state.available_courses.map((course) => ({
                                    label: course.course_name_ar,
                                    value: course.id, 
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
                            <Icon type="AntDesign" name="caretright" style={{ fontSize: 10, transform: [{ rotate: '180deg' }] }} />


                        </Button>
                    </View>
                </View>
            </View>
            //                </ImageBackground>
            //            </Container>
        );
    }
}

export default withTranslation()(Signup5);
