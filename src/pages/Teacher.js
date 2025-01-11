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
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import GetLocation from 'react-native-get-location'
import axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import API from "../api/";
import MyTabs from './Tab';
import Teacher1 from './Teacher1';


const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class Teacher extends React.Component {
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
            searchText: ''
        };

        this.checkAccess();
        this.load_data();
        this.getStudents();
    }
    checkAccess = async () => {
        let access = await AsyncStorage.getItem("@moqc:page_access");
        access = JSON.parse(access);
        await this.setState({
            students: access.students[0],
            students_approved: access.students_approved[0],
            students_registered_new: access.students_registered_new[0],
            students_registered: access.students_registered[0],
            team: access.team[0],
            contact: access.contact[0],
        })
    }

    navigatePage = async (id) => {
        await AsyncStorage.setItem("@moqc:current_user_teacher", id);
        this.props.navigation.navigate("StudentsTeacher");

    }
    componentWillUnmount() {
    }

    componentDidMount() {
        // this.registerForPushNotificationsAsync(); this._notificationSubscription =
        // Notifications.addListener(this._handleNotification);
    }
    getStudents = async () => {
        var students = [];
        await API.teacherStudents()
            .then(resp => {
                this.setState({ show_spinner: false })
                resp.map((m) => {
                    students.push(m);
                })
            })
        this.setState({
            students
        })
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

    async onSearch(e) {

        await this.setState({ searchText: e })
        console.log("hii", this.state.searchText)
        var searchArray = this.state.students
        searchArray = searchArray.filter(item =>
            item.first_name.toLowerCase().indexOf(this.state.searchText) > -1
        )
        this.setState({ students: searchArray })

    }

    render() {
        const { t, i18n } = this.props;
        console.log("classPROPS", this.props)
        var classes = this.props.route.params.classes
        return (
            <Container style={{ flex: 10 }}>
                <HeaderTop pagename={"Teacher Dashboard"} navigation={this.props.navigation} back={true} />
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                        <Teacher1 />
                    {/* <MyTabs classes={classes} /> */}
                    {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Students List</Text>
                    </View>

                    <View style={styles.input}>
                        <Icon active size={20} name='search' type="MaterialIcons" style={{ left: 0, fontSize: 20, padding: 6, borderRadius: 30 }} />
                        <TextInput
                            onChangeText={(text) => { this.onSearch(text) }}
                            placeholder='Search'
                        />
                    </View>

                    <Content>
                        <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>

                            {
                                typeof (this.state.students) !== 'string' ?
                                    this.state.students.map((m, i) => {
                                        return <TouchableOpacity
                                            key={i}
                                            onPress={() => this.navigatePage(m.id)}
                                        >

                                            <View style={{ width: 180, height: 220, borderWidth: 1, borderRadius: 20, margin: 5, backgroundColor: "white", justifyContent: "center", alignItems: "center", padding: 10, borderColor: "#CFDED5" }}>
                                                <Image
                                                    // source={{ uri: "https://moqc.ae" + m.profile_pic }}
                                                    source={require('../assets/user_m.png')}
                                                    style={{
                                                        height: 100,
                                                        width: 100,
                                                        resizeMode: "cover",
                                                        borderRadius: 100
                                                    }} />
                                                <View style={{}}>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={{ fontWeight: "bold" }} numberOfLines={1} ellipsizeMode='tail'>Name: {m.first_name}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={{ fontWeight: "bold" }} numberOfLines={1} ellipsizeMode='tail'>Gender: {m.gender.gender_en}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={{ fontWeight: "bold" }} numberOfLines={1} ellipsizeMode='tail'>Email: {m.email}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                        </TouchableOpacity>
                                    }

                                    ) : null
                            }
                        </View>
                    </Content>


                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ padding: 5 }}>
                            Showing 1-{this.state.students.length}
                        </Text>
                        <View style={{ flexDirection: "row", borderWidth: 1, borderRadius: 8, height: 30 }}>
                            <TouchableOpacity>
                                <Text style={{ padding: 5 }}>Previous</Text>
                            </TouchableOpacity>
                            <Text style={{ width: 20, textAlign: "center", backgroundColor: "#CFDED5", padding: 5 }}>
                                1
                            </Text>
                            <TouchableOpacity style={{ padding: 5 }}>
                                <Text>Next</Text>
                            </TouchableOpacity>
                        </View>

                    </View> */}

                </ImageBackground>
                {/* <Footer location={"dashboard"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(Teacher)

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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        width: '90%',
        borderRadius: 10,
        flexDirection: 'row',
        borderColor: '#000'
    },
});