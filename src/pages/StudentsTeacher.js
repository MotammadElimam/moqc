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
    Alert,
    Modal,
    Pressable,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form, DatePicker } from 'native-base';
import GetLocation from 'react-native-get-location'
import Axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import API from "../api";
var FormData = require('form-data');
import { WebView } from 'react-native-webview';
import axios from 'axios';


const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class StudentsTeacher extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: "4",
            students: "none",
            students_approved: "none",
            students_registered_new: "none",
            students_registered: "none",
            team: "none",
            contact: "none",
            students: [],
            profile_pic: "https://moqc.ae/assets/admin/users/default.jpg",
            gender: null,
            country: null,
            student_data: [],
            modal: false,
            url_data: "",
            approval: false,
            CheckDate: new Date(),
            class: null,
            level: null,
            suggestion: "",
            capacity: "",
            lessonDate: "",
            teamGroup: "",
            classes: []
        };

    }

    getClasses = async () => {
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.get(`https://moqc.ae/api/classes`,
            {
                headers: { "token": token }
            });
        if (response.status === 200) {
            await this.setState({ classes: response.data })
            console.log("classess", this.state.classes)
        }
    }
    rejectStudent = async () => {
        let user = await AsyncStorage.getItem("@moqc:current_user_teacher");
        await API.rejectStudent(user)
            .then(resp => {
                console.log(resp)
                Alert.alert(
                    "Success",
                    "Student Rejected",
                    [
                        {
                            text: "OK", onPress: () => {
                                this.props.navigation.goBack();
                            }

                        }
                    ],
                    { cancelable: false }
                );

            })

    }
    acceptStudent = async (status) => {
        let user = await AsyncStorage.getItem("@moqc:current_user_teacher");
        if (this.state.class === null) {
            Alert.alert(
                "Error",
                "Please Select Class to proceed",
                [
                    {
                        text: "OK", onPress: () => {
                            console.log("Okay")
                        }
                    }
                ],
                { cancelable: false }
            );
            return;
        }
        if (this.state.level === null) {
            Alert.alert(
                "Error",
                "Please Select Level to proceed",
                [
                    {
                        text: "OK", onPress: () => {
                            console.log("Okay")
                        }
                    }
                ],
                { cancelable: false }
            );
            return;
        }
        if (this.state.suggestion == "") {
            Alert.alert(
                "Error",
                "Please provide Suggestion to proceed",
                [
                    {
                        text: "OK", onPress: () => {
                            console.log("Okay")
                        }
                    }
                ],
                { cancelable: false }
            );
            return;
        }

        if (this.state.capacity == "") {
            Alert.alert(
                "Error",
                "Please provide Memorization Capacity to proceed",
                [
                    {
                        text: "OK", onPress: () => {
                            console.log("Okay")
                        }
                    }
                ],
                { cancelable: false }
            );
            return;
        }

        if (this.state.lessonDate == "") {
            Alert.alert(
                "Error",
                "Please provide Lesson Date to proceed",
                [
                    {
                        text: "OK", onPress: () => {
                            console.log("Okay")
                        }
                    }
                ],
                { cancelable: false }
            );
            return;
        }
        if (this.state.teamGroup == "") {
            Alert.alert(
                "Error",
                "Please provide team group to proceed",
                [
                    {
                        text: "OK", onPress: () => {
                            console.log("Okay")
                        }
                    }
                ],
                { cancelable: false }
            );
            return;
        }

        const formData = new FormData();
        formData.append('class', this.state.class);
        formData.append('level', this.state.level);
        formData.append('suggestions', this.state.suggestion);
        formData.append('course', 6);
        formData.append('capacity', this.state.capacity);
        formData.append('lessondate', this.state.lessonDate);
        formData.append('groupname', this.state.teamGroup);
        formData.append('status', status);
        console.log("formdata", this.state)


        await API.approveTeacherStudents(user, formData)
            .then(resp => {
                console.log("redfpodfpd", resp)
                Alert.alert(
                    "Success",
                    "Student Approved",
                    [
                        {
                            text: "OK", onPress: () => {
                                this.props.navigation.goBack();
                            }

                        }
                    ],
                    { cancelable: false }
                );

            }).catch(e=>{
                console.log(e.response.message)
            })
    }
    componentDidMount() {
        this.load_data();
        this.getStudents();
        // this.registerForPushNotificationsAsync(); this._notificationSubscription =
        // Notifications.addListener(this._handleNotification);
        this.getClasses()
    }
    getStudents = async () => {
        let user = await AsyncStorage.getItem("@moqc:current_user_teacher");


        await API.getTeacherStudents(user)
            .then(resp => {
                var student_data = [];
              /*  resp.student_data.map((m) => {
                    student_data.push(m)
                    if (m.name == "profilepicture") {
                        this.setState({
                            profile_pic: m.value
                        })
                    }
                })
                */
                this.setState({
                    students: resp,
                    gender: resp.gender==1?'Male':"Female",
                    country: resp.country.country_name,
                    student_data: student_data
                })

            })

    }
    updateIframe = (val) => {
        this.setState({
            url_data: val,
            modal: true
        })

    }
    setDate = () => {

    }
    load_data = async () => {
        let lang = await AsyncStorage.getItem("@moqc:language");
        console.log("this is happenging", lang);
        if (lang == null || lang == "null") {

            // i18n     .changeLanguage(i18n.language === 'ar'     ? 'en'     : 'ar')
            // .then(() => {         I18nManager.forceRTL(i18n.language === 'ar');
            // RNRestart.Restart();     });
            return;
        }
    }

    render() {
        const { t, i18n } = this.props;
        return (
            <Container style={{ flex: 10 }}>
                
                <HeaderTop pagename={"Dashboard"} navigation={this.props.navigation} back={true} />
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                        margin: 20
                    }}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        {/* <Text style={{ fontWeight: "bold", fontSize: 20 }}>Students Detail</Text> */}
                    </View>
                    <Content>
                        {/* <DropShadow
                            style={{
                                shadowColor: "#31314f",
                                shadowOffset: {
                                    width: -10,
                                    height: 5
                                },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                borderRadius: 40,
                                marginTop: 30

                            }}> */}
                        <View
                            style={{
                                elevation: 1,
                                padding: 2,
                            }}
                        >
                            {/* <View style={{ textAlign: 'center', justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                                <Image
                                    source={{ uri: this.state.profile_pic }}
                                    style={{
                                        height: 150,
                                        width: 150,
                                        borderRadius: 100,
                                        borderWidth: 1, marginVertical: 10,

                                    }} />
                            </View> */}
                            <View style={{ justifyContent: 'space-between', marginHorizontal: 20 }}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Name')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{this.state.students.first_name}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                    <Text style={{ fontWeight: "bold" }}>{i18n.t('Email')}:</Text>
                                    <Text style={{ fontWeight: "normal" }}>{this.state.students.student_email}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                    <Text style={{ fontWeight: "bold" }}>{i18n.t('Nationality')}:</Text>
                                    <Text style={{ fontWeight: "normal" }}>{/*this.state.students.nationality*/}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                    <Text style={{ fontWeight: "bold" }}>{i18n.t('Date of Birth')}:</Text>
                                    <Text style={{ fontWeight: "normal" }}>{this.state.students.dob}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                    <Text style={{ fontWeight: "bold" }}>{i18n.t('Gender')}:</Text>
                                    <Text style={{ fontWeight: "normal" }}>{this.state.gender}</Text>

                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                    <Text style={{ fontWeight: "bold" }}>{i18n.t('Contact')}:</Text>
                                    <Text style={{ fontWeight: "normal" }}>{this.state.students.contact_phone}</Text>

                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                    <Text style={{ fontWeight: "bold" }}>{i18n.t('Country')}:</Text>
                                    <Text style={{ fontWeight: "normal" }}>{/*this.state.country*/}</Text>
                                </View>
                                <View style={{ marginTop: 20, }}>
                                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{i18n.t('Documents')}</Text>
                                </View>


                                <View style={{ marginVertical: 2 }}>
                                    {this.state.student_data.map((m, i) => {
                                        if (m.name !== "profilepicture") {
                                            return (
                                                <TouchableOpacity style={{ marginVertical: 2, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#D5D5D5' }}
                                                    onPress={() => { this.updateIframe(m.value) }} key={i}>
                                                    <Text>{m.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        }
                                    })}
                                </View>


                                <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <TouchableOpacity style={{ backgroundColor: "green", borderRadius: 10, padding: 10 }} onPress={() => { this.setState({ approval: true }) }}>
                                        <Text style={{ color: '#fff' }}>
                                            {i18n.t('Approve')}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: "red", borderRadius: 10, padding: 10 }} onPress={() => { this.rejectStudent() }}>
                                        <Text style={{ color: '#fff' }}>
                                            {i18n.t('Reject')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                        {/* </DropShadow> */}
                    </Content>
                </ImageBackground>


                {/* <Footer location={"dashboard"} navigation={this.props.navigation} /> */}
                <Modal
                    visible={this.state.modal}><SafeAreaView style={{flex:1}}>
                    <View style={{ backgroundColor: '#D5D5D5', padding: 10, height: '100%', borderRadius: 10 }}>

                        <WebView
                            source={{
                                uri: this.state.url_data
                            }}

                        />
                        <View style={{ justifyContent: "flex-end", alignContent: "flex-end" }}>
                            <Pressable onPress={() => { this.setState({ modal: false }) }} style={{ padding: 10, backgroundColor: "red" }}>
                                <Text style={{ color: '#fff', justifyContent: "center", textAlign: 'center', }}>{i18n.t('Close')}</Text>

                            </Pressable>
                        </View>

                    </View></SafeAreaView>
                </Modal>

                <Modal
                    visible={this.state.approval}
                    transparent={true}
                ><SafeAreaView style={{flex:1}}>
                    <View style={{ backgroundColor: "white", padding: 10, height: '100%', borderRadius: 10 }}>
                        <Content>
                            <Text style={{ fontWeight: "bold" }}>
                                {i18n.t('Class Name')}
                            </Text>
                            <View
                                style={{
                                    elevation: 1,
                                    flexDirection: "row",
                                    width: '100%'
                                }}
                            >
                                <View style={{ borderRadius: 10, padding: 10, borderWidth: 1, width: '100%' }}>
                                    <Picker
                                        placeholder="Select One"
                                        placeholderStyle={{ color: "#2874F0" }}
                                        style={{ height: 20 }}
                                        selectedValue={this.state.class}
                                        onValueChange={(s) => this.setState({ class: s })}
                                    >
                                        {this.state.classes.map(item => {
                                            return <Picker.Item label={item.class_name} value={item.id} />
                                        })}

                                    </Picker>

                                </View>

                            </View>


                            <Text style={{ fontWeight: "bold" }}>{i18n.t('Level')}</Text>
                            <View
                                style={{
                                    elevation: 1,
                                    flexDirection: "row",
                                    width: '100%'
                                }}
                            >
                                <View style={{ borderRadius: 10, padding: 10, borderWidth: 1, width: '100%' }}>
                                    <Picker
                                        placeholder="Select One"
                                        placeholderStyle={{ color: "#2874F0" }}
                                        style={{ height: 20 }}
                                        selectedValue={this.state.level}
                                        onValueChange={(s) => this.setState({ level: s })}
                                    >
                                        <Picker.Item label="Beginner" value="1" />
                                        <Picker.Item label="Expert" value="2" />
                                        <Picker.Item label="Excellent" value="3" />

                                    </Picker>
                                </View>

                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {i18n.t('Suggestion')}
                                </Text>
                                <TextInput
                                    style={{
                                        borderWidth: 1, borderRadius: 10, width: "100%", padding: 5, marginTop: 5,
                                        textAlign: this.state.rtl
                                            ? 'right'
                                            : 'left'
                                    }}
                                    value={this.state.suggestion}
                                    onChangeText={(suggestion) => this.setState({ suggestion })}
                                    placeholder="Suggestion" />

                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {i18n.t('Capacity of Memorization')}
                                </Text>
                                <TextInput
                                    style={{
                                        borderWidth: 1, borderRadius: 10, width: "100%", padding: 5, marginTop: 5,
                                        textAlign: this.state.rtl
                                            ? 'right'
                                            : 'left'
                                    }}
                                    value={this.state.capacity}
                                    onChangeText={(capacity) => this.setState({ capacity })}
                                    placeholder="Capacity" />

                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {i18n.t('Lesson Date')}
                                </Text>
                                <TextInput
                                    style={{
                                        borderWidth: 1, borderRadius: 10, width: "100%", padding: 5, marginTop: 5,
                                        textAlign: this.state.rtl
                                            ? 'right'
                                            : 'left'
                                    }}
                                    value={this.state.lessonDate}
                                    onChangeText={(lessonDate) => this.setState({ lessonDate })}
                                    placeholder="Lesson Date" />

                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {i18n.t('Name of group in team')}
                                </Text>
                                <TextInput
                                    style={{
                                        borderWidth: 1, borderRadius: 10, width: "100%", padding: 5, marginTop: 5,
                                        textAlign: this.state.rtl
                                            ? 'right'
                                            : 'left'
                                    }}
                                    value={this.state.teamGroup}
                                    onChangeText={(teamGroup) => this.setState({ teamGroup })}
                                    placeholder="Group name" />

                            </View>
                            <View style={{ justifyContent: "space-evenly", alignContent: "flex-end", flexDirection: "row", marginVertical: 10 }}>
                                <Pressable onPress={() => { this.acceptStudent("approve") }} style={{ padding: 10, backgroundColor: "green", borderRadius: 10 }}>
                                    <Text style={{ color: '#fff' }}>{i18n.t('Approve')}</Text>
                                </Pressable>
                                <Pressable onPress={() => { this.acceptStudent("reject") }} style={{ padding: 10, backgroundColor: "red", borderRadius: 10 }}>
                                    <Text style={{ color: '#fff' }}>{i18n.t('Reject')}</Text>
                                </Pressable>
                                <Pressable onPress={() => { this.setState({ approval: false }) }} style={{ padding: 10, backgroundColor: "red", borderRadius: 10 }}>
                                    <Text style={{ color: '#fff' }}>{i18n.t('Close')}</Text>
                                </Pressable>
                            </View>
                        </Content>
                    </View></SafeAreaView>
                </Modal>

            </Container>
        )
    }
}

export default withTranslation()(StudentsTeacher)

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
    }
});