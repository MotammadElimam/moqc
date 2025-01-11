import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    I18nManager,
    SafeAreaView,
    ImageBackground,
    Image,
    Pressable,
    FlatList,
    Modal,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';
import API from "../api";
const Axios = require('axios');

import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';

import { AsyncStorage } from 'react-native';
import i18n from '../i18n';
import { ActivityIndicator } from 'react-native-paper';
import HeaderTop from "./Header";
import DropShadow from 'react-native-drop-shadow';



class ITList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {


        };
        this.getLanguage()
    }

    componentDidMount() {
    }

    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }



    render() {

        return (
            <View style={{ flex: 10 }}>
                <HeaderTop pagename={i18n.t("Dashboard")} navigation={this.props.navigation} back={true} />

                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' ,padding:20}}>
                    <TouchableOpacity style={{ borderColor: "#C8DACE", height: 200, width: 180, borderRadius: 30, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}
                        onPress={()=>this.props.navigation.navigate("ItApprovedStudents")}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{i18n.t('Last Stage Approval')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ borderColor: "#C8DACE", margin: 20, height: 200, width: 180, borderRadius: 30, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.props.navigation.navigate("ItStudent")}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{i18n.t('View All Students')}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={{ borderColor: "#C8DACE", margin: 20, height: 200, width: 180, borderRadius: 30, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.props.navigation.navigate("CreateEmail")}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{i18n.t('Email')}</Text>
                        </TouchableOpacity>
                    </View>

                </ImageBackground >
            </View >
        )
    }
}
export default ITList

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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalView: {
        marginHorizontal: 10,
        width: 350,
        height: "55%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 }
});