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
import TabTeam from './TabTeam';


const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class Team extends React.Component {
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

    render() {
        const { t, i18n } = this.props;
        return (
            <Container style={{ flex: 10 }}>
                <HeaderTop pagename={"Team"} navigation={this.props.navigation} back={true} />
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    <TabTeam />


                </ImageBackground>
                {/* <Footer location={"dashboard"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(Team)

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