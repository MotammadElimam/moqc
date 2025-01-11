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
import { ScrollView } from 'react-native-gesture-handler';



class TeacherList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            exams: "none",
            classes: "none",
            students_approved: 'none',
            manage_course:"none",access:{}

        };
        this.getLanguage()
    }

    componentDidMount() {
        this.checkAccess()
    }

    checkAccess = async () => {
        let access = await AsyncStorage.getItem("@moqc:page_access");
        access = JSON.parse(access);
        console.log(access)
        await this.setState({
            students_approved: access.students_approved[0],
            exams: access.exams[0],
            classes:'none',
            course: access.course[0],
            courses: access.courses[0],
            manage_course: access.manage_course[0],
            access

        })
    }
    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    render() {

        return (
            <ScrollView>
            <View style={{ flex: 1 }}>
                <HeaderTop pagename={i18n.t("Dashboard")} navigation={this.props.navigation} back={true} />

                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    <View style={{  paddingTop:20 }}>

                        {/* {this.state.students_approved != "none" ?
                            <TouchableOpacity style={{ borderColor: "#C8DACE", margin: 20, height: 200, width: 180, borderRadius: 30, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => this.props.navigation.navigate("Teacher", { classes: this.state.classes })}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{i18n.t('View All Students')}</Text>
                            </TouchableOpacity>
                            : null
                        } */}

                        {this.state.students_approved!="none"&&<TouchableOpacity style={styles.listItem}
                            onPress={() => this.props.navigation.navigate("CSApprovedStudents")}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{i18n.t(`Second stage Approval`)}</Text></TouchableOpacity>}
                        
                        {this.state.courses != "none" &&
                        <TouchableOpacity style={styles.listItem}

                            onPress={() => this.props.navigation.navigate("Course")}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{i18n.t('Courses')}</Text>
                        </TouchableOpacity>
                        }

                        {this.state.manage_course != "none" &&
                        <TouchableOpacity style={styles.listItem}
                                onPress={() => this.props.navigation.navigate("ManageCourse", { })}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{i18n.t('Manages Course')}</Text>
                            </TouchableOpacity>
                          }

                        {this.state.exams != "none" &&
                            <TouchableOpacity style={styles.listItem}
                                onPress={() => this.props.navigation.navigate("CreateExam")}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{i18n.t('Exams')}</Text>
                            </TouchableOpacity>
                            
                        }
                    </View>

                </ImageBackground >
            </View >
            </ScrollView>
        )
    }
}
export default TeacherList

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    listItem:{
        borderColor: "#C8DACE",
        borderBottomWidth:1,
        borderRadius:12,
        paddingHorizontal:0,
        paddingVertical:8
    },

    sectionWrap: {
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