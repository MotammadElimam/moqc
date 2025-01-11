import React, { Component } from "react";
import { withTranslation } from 'react-i18next';
import axios from "axios";
import { StyleSheet, ImageBackground, Image, I18nManager, View, TouchableOpacity, Alert, ScrollView } from 'react-native'
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
    Toast
} from "native-base";
import ROOT from 'native-base'
import { AsyncStorage } from 'react-native';
import DropShadow from "react-native-drop-shadow";
import FooterBottom from "./Footer";
import { auto } from "async";
import API from "../api/";
import Step1 from "./Signup1";
//import Step2 from "./components/step2";
//import Step3 from "./components/step3";
//import Step4 from "./components/step4";
//import Step5 from "./components/step5";
//import Step6 from "./components/step6";
import Step2 from "./Signup2";
import Step3 from "./Signup3";
import Step4 from "./Signup4";
import Step5 from "./Signup5";
import Step6 from "./Signup6";
import Step7 from "./Signup7";
import Success from "./components/success";
import Social from "./components/social";
import { AudioRecorder, AudioUtils } from 'react-native-audio';
var FormData = require('form-data');

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rtl: true,
            active_step: 0,
            gender: 0,
            user: 0,
            selected_img: null,
            image_base64: null,
            selected_img_name: null,
            selected_img_type: null,
            full_name: "",
            // last_name: "",
            email: "",
            password: "",
            contact_phone: "",
            dob: "",
            age: "",
            nationality: '',
            country_of_residence: '',
            emirates_state: '',
            educational_qualification: '',
            joined: '',
            connection: 'There is No',
            partsMemorize: '0',
            class_join: '',
            source: '',
            passport: null,
            passport_expiry: '',
            passport_base64: null,
            passport_name: null,
            passport_type: null,
            emirates_id: null,
            emirates_id_base64: null,
            emirates_id_name: null,
            emirates_id_type: null,
            audioPath: AudioUtils.DocumentDirectoryPath + '/sound.aac',
            base64_voice: null,


            id_front: null,
            id_expiry: '',
            id_front_base64: null,
            id_front_name: null,
            id_front_type: null,
            id_back: null,
            id_back_base64: null,
            id_back_name: null,
            id_back_type: null,


            day: '',
            month: '',
            year: "",
            qualification_id: "",
            //            voice_clip: null,
            //            passport: null,
            passport_expiry: '',
            country: 230,
            job_id: "",
            location_id: "",
            memorized: 0,
            course: "",
            categories: [],
            //            emirates_id: null,
            id_expiration: '',
            qalifications: [],
            jobs: [],
            countries: [],
            locations: [],
            qualifications: [],
            courses: [],
            course_id: "",

            stepsData: {},

        };
    }

    updateParentState = (data) => {
        //    console.log('Received data from child:', data);

        this.setState({ ...data }, () => {
            console.log(
                "All Fields in the Parent state:",
                "rtl =", this.state.rtl,
                ", active_step =", this.state.active_step,
                ", gender =", this.state.gender,
                ", user =", this.state.user,
                ", selected_img =", this.state.selected_img,
                ", passport =", this.state.passport,
                ", passport ID =", this.state.passport_expiry,
                ", id  front=", this.state.id_front,
                ", id  back=", this.state.id_back,
                ", id  Expiry=", this.state.id_expiry,
                ", full_name =", this.state.full_name,
                ", email =", this.state.email,
                ", password =", this.state.password,

                ", contact_number =", this.state.contact_phone,
                ", dob =", this.state.dob,
                ", nationality =", this.state.nationality,
                ", country_of_residence =", this.state.country_of_residence,
                ", emirates_state =", this.state.emirates_state,
                ", educational_qualification =", this.state.educational_qualification,
                ", joined =", this.state.joined,
                ", connection =", this.state.connection,
                ", class_join =", this.state.class_join,
                ", source =", this.state.source,
                ", audioPath =", this.state.audioPath,
                ", No of parts memorized =", this.state.partsMemorize,
                ", Classes want to join =", this.state.class_join,



                //  ", base64_voice =", this.state.base64_voice
            );
        });
    };


    getCourses = async () => {
        try {
            const res = await axios.get("https://moqc.ae/api/available_courses");
            if (res.data && Array.isArray(res.data)) {
                this.setState({ courses: res.data });
                console.log("COurses Data", this.state.courses)
            } else {
                console.error("Unexpected API response format", res.data);
            }
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            alert("Unable to fetch courses. Please try again later.");
        }
    };
    steps = [
        { name_en: "Gender", name_ar: "النوع" },
        { name_en: "Profile 1", name_ar: "الملف الشحصي" },
        { name_en: "Profile 2", name_ar: "الملف الشحصي" },
        { name_en: "Profile 3", name_ar: "الملف الشحصي" },
        { name_en: "Profile 3", name_ar: "الملف الشحصي" },
        { name_en: "Documents", name_ar: "وثائق" },
        { name_en: "Voice Recording", name_ar: "تسجيل صوتي" },
    ]
    componentDidMount = async () => {
        this.getCourses();


        axios.get("https://moqc.ae/api/qualifications")
            .then(res => {
                this.setState({ qualifications: res.data })
            })
            .catch(e => console.log(e))

        axios.get("https://moqc.ae/api/get_jobs")
            .then(res => {
                this.setState({ jobs: res.data })
            })
            .catch(e => console.log(e))

        axios.get("https://moqc.ae/api/get_locations")
            .then(res => {
                this.setState({ locations: res.data })
            })
            .catch(e => console.log(e))
        axios.get("https://moqc.ae/api/courses")
            .then(res => {
                this.setState({ courses: res.data.filter(x => x.availability == 1) })
            })
            .catch(e => console.log(e))
        axios.get("https://moqc.ae/api/countries")
            .then(res => {
                console.log('countries')
                this.setState({ countries: res.data })
            })
            .catch(e => console.log(e))
    }
    saveGender = async (props) => {
        if (this.state.gender == 0) {
            Alert.alert(
                "Select Gender",
                "Please Select Gender to proceed",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );

            return;


        }
        await AsyncStorage.setItem('@moqc:gender', JSON.stringify(this.state.gender));

        const formData = new FormData();
        formData.append('gender', this.state.gender);

        API.signup(formData)
            .then(async (resp) => {
                this.setState({ show_spinner: false })
                console.log(resp.registration_token)
                await AsyncStorage.setItem('@moqc:reg_token', JSON.stringify(resp.registration_token));

                if (resp.registration_token) {
                    this.props.navigation.navigate("Signup2")
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




        // this.props.navigation.navigate("Signup2")


    }


    resetState = () => {
        this.setState({
            rtl: true,
            active_step: 0,
            gender: 0,
            user: 0,
            selected_img: null,
            image_base64: null,
            selected_img_name: null,
            selected_img_type: null,
            full_name: "",
            email: "",
            password: "",
            contact_phone: "",
            dob: "",
            age: "",
            nationality: '',
            country_of_residence: '',
            emirates_state: '',
            educational_qualification: '',
            joined: '',
            connection: 'There is No',
            partsMemorize: '0',
            class_join: '',
            source: '',
            passport: null,
            passport_expiry: '',
            passport_base64: null,
            passport_name: null,
            passport_type: null,
            emirates_id: null,
            emirates_id_base64: null,
            emirates_id_name: null,
            emirates_id_type: null,
            audioPath: AudioUtils.DocumentDirectoryPath + '/sound.aac',
            base64_voice: null,
            id_front: null,
            id_expiry: '',
            id_front_base64: null,
            id_front_name: null,
            id_front_type: null,
            id_back: null,
            id_back_base64: null,
            id_back_name: null,
            id_back_type: null,
            day: '',
            month: '',
            year: "",
            qualification_id: "",
            passport_expiry: '',
            country: 230,
            job_id: "",
            location_id: "",
            memorized: 0,
            course: "",
            categories: [],
            id_expiration: '',
            qalifications: [],
            jobs: [],
            countries: [],
            locations: [],
            qualifications: [],
            courses: [],
            course_id: "",

            stepsData: {},

        })
    }
    step(val) {
        const stepProps = {
            data: this.state.stepsData[val] || {}, // Pass current step's data
            updateData: (data) => this.updateStepData(val, data), // Update function
        };
        switch (val) {
            case 0:
                return <Step1 ref={this.step1Ref} data={this.state} updateParentState={this.updateParentState} update={(data) => this.setState(data)} />;

            case 1:
                return <Step2 ref={this.step2Ref} data={this.state} updateParentState={this.updateParentState} update={(data) => this.setState(data)} />;
            case 2:
                return <Step3 data={this.state} updateParentState={this.updateParentState} update={(data) => this.setState(data)} />;
            case 3:
                return <Step4 ref={this.step4Ref} data={this.state} updateParentState={this.updateParentState} update={(data) => this.setState(data)} />;
            case 4:
                return <Step5 data={this.state} updateParentState={this.updateParentState} update={(data) => this.setState(data)} />;
            case 5:
                return <Step6 data={this.state} updateParentState={this.updateParentState} update={(data) => this.setState(data)} />;
            case 6:
                return <Step7 data={this.state} updateParentState={this.updateParentState} update={(data) => this.setState(data)} resetState={this.resetState}/>;

            case 7:
                return <Success />
        }
    };

    render() {
        const { t, i18n } = this.props;
        console.log(this.state.gender)
        return (<View style={{ flex: 1 }}>
            <Container
                style={{
                    flex: 1,
                    direction: this.state.rtl
                        ? 'rtl'
                        : 'ltr'
                }}>
               <ImageBackground
    style={{
        width: '100%',
        height: '100%',
        flex: 1
    }}
>
    
            <Header
                style={{
                    backgroundColor: '#31314f',
                    borderBottomColor: '#31314f',
                }}
            >
                <Title
                    style={{
                        marginTop: 5,
                        color: '#8f7c7b', 
                        textAlign: "center", 
                        fontFamily: "GESSTwoMedium-Medium"
                    }}
                >
                    {t('Registeration')}
                </Title>
            </Header>
            {this.state.courses.length > 0 ? (
                <>
            <View
                style={{
                    backgroundColor: '#fff',
                    position: "relative",
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        top: -20
                    }}
                >
                    <Image
                        style={{
                            height: 80,
                            width: 80,
                        }}
                        source={require('../assets/round.png')} 
                    />

                    {this.state.active_step < 7 ? (
                        <Text style={{ marginTop: 5, fontWeight: "bold", fontFamily: "GESSTwoMedium-Medium" }}>
                            {t('Step')} {this.state.active_step + 1}/7
                        </Text>
                    ) : <Text></Text>}
                </View>
            </View>

            {this.state.active_step < 7 && (
                <View
                    style={{
                        height: 2,
                        backgroundColor: "lightgrey",
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 20,
                        marginBottom: -20
                    }}
                />
            )}

            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", }}>
                {this.state.active_step < 7 ? this.steps.map((item, index) => {
                    return (
                        <View key={index} style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                            <Button onPress={() => {
                                if (index <= this.state.active_step) {
                                    this.setState({ active_step: index });
                                } else {
                                    alert("Please complete the current step before proceeding.");
                                }
                            }}
                                style={{
                                    width: 40, 
                                    height: 40, 
                                    textAlign: "center", 
                                    borderRadius: 100, 
                                    backgroundColor: this.state.active_step === index ? "#313145" : "#dee1ed"
                                }}
                            >
                                <Text style={{ textAlign: "center", fontWeight: "bold", fontFamily: "GESSTwoMedium-Medium" }}>
                                    {index + 1}
                                </Text>
                            </Button>
                            <Text style={{ fontSize: 8, marginTop: 3 }}>
                                {this.state.rtl ? item.name_ar : item.name_en}
                            </Text>
                        </View>
                    );
                }) : <View></View>}
            </View>

            <ScrollView>
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    {this.step(this.state.active_step)}
                </View>

                <Social />
            </ScrollView>

            <View></View>
            </>
    ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  }}>
        <Text style={{ textAlign: 'center',borderWidth: 2,borderColor: 'black', borderRadius: 20, padding: 10,margin: 20,width: '95%', }}>
        {i18n.t("Registration is complete, stay tuned for new Quranic sessions coming soon")}
           
        </Text>
    </View>
    )}
</ImageBackground>


                {/* <FooterBottom {...this.props}/> */}
            </Container>
        </View>
        );
    }
}

export default withTranslation()(Signup);