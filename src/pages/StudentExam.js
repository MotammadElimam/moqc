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
    Dimensions,
    Modal,
    Pressable,
    Alert,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DocumentPicker from "react-native-document-picker";
import ActionButton from 'react-native-action-button';
import Axios from 'axios'

import HeaderTop from "./Header";
import { open } from '../store';
import { Backdrop } from 'react-native-backdrop';
import { AsyncStorage } from 'react-native';
import i18n from '../i18n';
import axios from 'axios';

class StudentExam extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            result: [],
            language: ''
        }
    }

    componentDidMount() {
        this.getResult()
        this.getLanguage()
    }

    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    getResult = async () => {
        let token = await AsyncStorage.getItem("@moqc:token");
        var course_id = this.props.route.params.course_id
        const response = await axios.get(`https://moqc.ae/api/student_exams/${course_id}`);
        if (response.status === 200) {
            this.setState({ result: response.data })
        }
    }


    renderItem = ({ item }) => (
        <View
            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
                <Text>{this.state.language == 'en' ? item.name_en : item.name_ar}</Text>
            </View>
            {/* <Backdrop
                visible={open}
            >
                <View>
                    <ActivityIndicator />
                </View>
            </Backdrop> */}
            <View style={{ flex: 1 }}>
                <Text>
                    {item.date}
                </Text>
            </View>
            <View style={{ width: '20%', }}>
                <Text>
                    {item.result}
                </Text>
            </View>
        </View>

    );

    render() {
        return (
            <Container style={{ flex: 10 }}>
                <ScrollView>

                    {/* <HeaderTop pagename={"Dashboard"} navigation={this.props.navigation} back={true} /> */}

                    <ImageBackground
                        source={require('../assets/bg_img.png')}
                        style={{
                            flex: 10,
                        }}>



                        <View
                            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Name')}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Date')}</Text>
                            </View>
                            <View style={{ width: '20%', }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Result')}</Text>
                            </View>
                        </View>
                        <FlatList
                            data={this.state.result}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id}
                        />

                    </ImageBackground>

                </ScrollView>
            </Container>
        );
    }
}
export default StudentExam


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
        margin: 10,
        width: '100%',
        height: "100%",
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        padding: 10,
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
    }
});