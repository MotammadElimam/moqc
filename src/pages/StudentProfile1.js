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
import StudentProfile from './StudentProfile';
import TabStProfile from './TabStProfile';


const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class StudentProfile1 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        
        };
    }
 

    render() {
        const { t, i18n } = this.props;
        return (
            <Container style={{ flex: 10 }}>
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    <TabStProfile/>           
                </ImageBackground>
                {/* <Footer location={"dashboard"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(StudentProfile1)

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