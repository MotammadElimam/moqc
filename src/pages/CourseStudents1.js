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
} from 'react-native';
import API from "../api/";
const Axios = require('axios');

import CheckBox from 'react-native-check-box'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CourseStudents from './CourseStudents';
import i18n from '../i18n';
import { Linking } from 'react-native'
import axios from 'axios';



class CourseStudents1 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            courses: [],
            notes:[]

        };
    }

    componentDidMount() {
        this.getStudents()
    }

    getCourses = async () => {
        
        const response = await axiosios.get("https://moqc.ae/api/courses");
        if (response.status === 200) {
            this.setState({ courses: response.data })
        }

        const res = await axios.get("https://moqc.ae/api/notes");
        if (res.status === 200) {
            this.setState({ notes: res.data })
        }
    }


    getStudents = async () => {
        var course_id = this.props.route.params.course_id
        console.log("courseee", course_id)
        const response = await axios.get(`https://moqc.ae/api/course_students/${course_id}`);
        if (response.status === 200) {
            this.setState({ students: response.data })
        }
    }



    renderItem = ({ item }) => (
        <TouchableOpacity
            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 / 2 }}>
                <Text>{item.first_name}</Text>
            </View>
            {/* <View style={{ flex: 2 / 4, marginHorizontal: 5 }}>
                <Text>{item.student_email}</Text>
            </View> */}
            <View style={{ flex: 1 / 2,flexDirection:"row" }}>
                <Pressable onPress={()=>{
                    Linking.openURL('https://wa.me/'+item.contact_phone)
                }}>
                    <Image source={require("../assets/whatsapp.png")} style={{width:20,height:20}} />
                </Pressable>
                <Text style={{marginHorizontal:10}}>{item.contact_phone}</Text>
            </View>
        </TouchableOpacity>
    );

    render() {

        return (
            <View style={{ flex: 10 }}>
                {/* <TouchableOpacity onPress={() => this.setState({ createModal: true })} style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <Icon active size={20} name='add' type="MaterialIcons" style={{ fontSize: 20 }} />
                    <Text style={{ fontSize: 15 }}>Create New Course</Text>
                </TouchableOpacity> */}
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    <View
                        style={{backgroundColor:'#D5D5D5', borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10,flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 / 2 }}>
                            <Text style={{fontWeight:'bold',fontSize:15}}>{i18n.t('Name')}</Text>
                        </View>
                        {/* <View style={{ flex: 2 / 4, marginHorizontal: 5 }}>
                            <Text style={{fontWeight:'bold',fontSize:15}}>{i18n.t('Email')}</Text>
                        </View> */}
                        <View style={{ flex: 1 / 2 }}>
                            <Text style={{fontWeight:'bold',fontSize:15}}>{i18n.t('Phone')}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={this.state.students}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                    />
                </ImageBackground>
            </View>
        )
    }
}
export default CourseStudents1

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    sectionWrapper: {
        padding: 20
    },
    heading: {
        borderWidth: 1,
        fontSize: 20,
        margin: 15,
        borderRadius: 10,
        borderColor: "#2b8634",
        textAlign: "center"
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
    }
});