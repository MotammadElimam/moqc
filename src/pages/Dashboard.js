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
    Dimensions
} from 'react-native';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input } from 'native-base';
import GetLocation from 'react-native-get-location'
import axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import i18next from 'i18next';

const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            students: "none",
            student_approved: "none",
            students_registered_new: "none",
            students_registered: "none",
            team: "none",
            contact: "none",
            classes: "none",
            access:{}
        };

        this.checkAccess();

    }
    checkAccess = async () => {
        let access = await AsyncStorage.getItem("@moqc:page_access");
        access = JSON.parse(access);
        await this.setState({
            students: access.students[0],
            student_approved: access.students_approved[0],
            students_registered_new: access.students_registered_new[0],
            students_registered: access.students_registered[0],
            team: access.team[0],
            contact: access.contact[0],
            course: access.course[0],
            access:access
        })
        console.log("accesss", this.state.classes)
    }

    componentDidMount() {
        this.load_data();
        // this.registerForPushNotificationsAsync(); this._notificationSubscription =
        // Notifications.addListener(this._handleNotification);
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
            <Container style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ flex: 1 }}>
                        <HeaderTop pagename={i18n.t("Dashboard")} navigation={this.props.navigation} back={false} />

                        <ImageBackground
                            source={require('../assets/bg_img.png')}
                            style={{
                                flex: 10,
                            }}>
                            <View style={{ margin: 20 }}>
                                <View>
                                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>{i18n.t('Select your Dashboard and Navigate')}</Text>
                                </View>

                                <View style={{ marginVertical: 10 }}>
                                    {/* <View style={{
                                    borderWidth: 1,
                                    borderColor: "grey",
                                    flexDirection: "row",
                                    justifyContent: 'center',
                                    alignItems: "center",
                                    borderRadius: 15,
                                    width: width - 50,
                                    height: 40,
                                    paddingHorizontal: 10
                                }}>
                                    <Input placeholder='search' />
                                    <Icon active name='search' type="MaterialIcons" style={{ fontSize: 16, padding: 6, textAlign: "center", justifyContent: "center", borderRadius: 30 }} />
                                </View> */}
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'center',gap:10 }}>
                                    {
                                        this.state.students != "none" &&

                                            <TouchableOpacity
                                            style={styles.item}
                                                onPress={() => this.props.navigation.navigate("Support")}>
                                                <Image
                                                    source={require('../assets/cs_dash.png')}
                                                    style={{
                                                        height: 150,
                                                        width: 150,
                                                        resizeMode: "cover",
                                                    }} />
                                                <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: 'center', paddingHorizontal: 10 }}>
                                                    {i18n.t('Customer Service Dashboard')}
                                                </Text>

                                            </TouchableOpacity>
                                           
                                    }

                                    {
                                        this.state.courses != "none" || this.state.student_approved != "none"||this.state.access?.exams!="none" ||this.state.access?.manage_course!="none"?
                                            <TouchableOpacity style={styles.item}
                                                onPress={() => this.props.navigation.navigate("Teacher")}>
                                                <Image
                                                    source={require('../assets/teacher_dash.png')}
                                                    style={{
                                                        height: 150,
                                                        width: 150,
                                                        resizeMode: "cover",
                                                    }} />
                                                <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: 'center', paddingHorizontal: 10 }}>
                                                    {i18n.t('Teacher Dashboard')}
                                                </Text>
                                            </TouchableOpacity>
                                            :
                                            null
                                    }
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'center',gap:10 }}>
                                    {
                                        this.state.students_registered_new != "none" || this.state.students_registered != "none" ?
                                            <TouchableOpacity style={styles.item}
                                                onPress={() => this.props.navigation.navigate("IT")}>
                                                <Image
                                                    source={require('../assets/it_dash.png')}
                                                    style={{
                                                        height: 150,
                                                        width: 150,
                                                        resizeMode: "cover",
                                                    }} />
                                                <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: 'center', paddingHorizontal: 10 }}>
                                                    {i18n.t('IT Dashboard')}
                                                </Text>
                                            </TouchableOpacity>
                                            :
                                            null
                                    }

                                    {
                                        this.state.team != "none" ?
                                            <TouchableOpacity style={styles.item}
                                                onPress={() => this.props.navigation.navigate("Team")}>
                                                <Image
                                                    source={require('../assets/team_dash.png')}
                                                    style={{
                                                        height: 150,
                                                        width: 150,
                                                        resizeMode: "cover",

                                                    }} />
                                                <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: 'center', paddingHorizontal: 10 }}>
                                                    {i18n.t('Team')}
                                                </Text>
                                            </TouchableOpacity>
                                            : null

                                    }
                                </View>

                                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {
                                    this.state.students_registered_new == "write" ?
                                        <TouchableOpacity style={{
                                            justifyContent: "center", textAlign: 'center', padding: 10, borderWidth: 1, shadowRadius: 20,
                                            borderRadius: 20, borderColor: '#D2DFD4', shadowColor: '#D2DFD4', shadowOffset: { width: 10, height: 10 },
                                            width:180,marginBottom:10,height:200
                                        }}
                                            onPress={() => this.props.navigation.navigate("TeacherClasses")}>
                                            <Image
                                                source={require('../assets/it_dash.png')}
                                                style={{
                                                    height: 150,
                                                    width: 150,
                                                    resizeMode: "cover",

                                                }} />
                                            <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: 'center', paddingHorizontal: 10 }}>
                                                {i18n.t('View Classes')}
                                            </Text>
                                        </TouchableOpacity>
                                        : null

                                }


                                 {
                                    this.state.students_registered_new == "write" ?
                                        <TouchableOpacity style={{
                                            justifyContent: "center", textAlign: 'center', padding: 10, borderWidth: 1, shadowRadius: 20,
                                            borderRadius: 20, borderColor: '#D2DFD4', shadowColor: '#D2DFD4', shadowOffset: { width: 10, height: 10 },
                                            width:180,marginBottom:10,height:200
                                        }}
                                            onPress={() => this.props.navigation.navigate("CreateExam")}>
                                            <Image
                                                source={require('../assets/it_dash.png')}
                                                style={{
                                                    height: 150,
                                                    width: 150,
                                                    resizeMode: "cover",

                                                }} />
                                            <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: 'center', paddingHorizontal: 10 }}>
                                                {i18n.t('Create Exams')}
                                            </Text>
                                        </TouchableOpacity>
                                        : null

                                }

                            </View> */}
                            </View>
                        </ImageBackground>

                    </View>
                </ScrollView>
            </Container>
        )
    }
}

export default withTranslation()(Dashboard)

const styles = StyleSheet.create({
    item:{justifyContent: "center",alignItems:"center", textAlign: 'center', padding: 10, borderWidth: 1, shadowRadius: 20,
    borderRadius: 20, borderColor: '#D2DFD4', shadowColor: '#D2DFD4', shadowOffset: { width: 10, height: 10 },
    width: 165, marginBottom: 10, height: 220,marginHorizontal:5},
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
        justifyContent: 'center'
    },
    textInput: {
        textAlign: I18nManager.isRTL
            ? 'right'
            : 'left'
    }
});