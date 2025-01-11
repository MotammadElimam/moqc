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
    ActivityIndicator
} from 'react-native';
import API from "../api/";
const Axios = require('axios');
import HeaderTop from "./Header";
import { open } from '../store';
import { Backdrop } from 'react-native-backdrop';
import CheckBox from 'react-native-check-box'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from '../i18n';
import { t } from 'i18n-js';
import { AsyncStorage } from 'react-native';
import axios from 'axios';




class CourseActions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            updateModal: false,
            courses: [],
            language: '',
            show_spinner: true

        };
       
    }

    componentDidMount() {
        this.getCourses()
        this.getLanguage()
    }

    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    getCourses = async () => {
        console.log('c11')
        open.next(true)
        this.setState({ show_spinner: true })
        var class_id = this.props.route.params.class_id
        const response = await axios.get(`https://moqc.ae/api/courses/${class_id}`);
        this.setState({ show_spinner: false })
        if (response.status === 200) {
            open.next(false)
            this.setState({ courses: response.data })
        }
    }

    async createCourse() {
        var class_id = this.props.route.params.class_id
        var body = new FormData()
        body.append("class_id", class_id)
        body.append("course_name_en", this.state.name_en)
        body.append("course_name_ar", this.state.name_ar)
        const response = await axios.post(`https://moqc.ae/api/course_create`, body);

        if (response.status === 200) {
            this.setState({ createModal: false })
            this.getCourses()
        }
    }

    async updateCourses() {
        var class_id = this.props.route.params.class_id
        var body = new FormData()
        body.append("course_name_en", this.state.updatename_en)
        body.append("course_name_ar", this.state.updatename_ar)
        const response = await axios.post(`https://moqc.ae/api/course_update/${this.state.updateid}`, body);

        if (response.status === 200) {
            this.setState({ updateModal: false })
            this.getCourses()
        }
    }

    async updateCourse(courses) {
        this.setState({
            updateModal: true, updateClassItem: courses, updatename_en: courses.course_name_en,
            updatename_ar: courses.course_name_ar, updateid: courses.id,
        })
    }

    async deleteCourse(id) {
        const response = await axios.delete(`https://moqc.ae/api/course_delete/${id}`);
        if (response.status === 200) {
            this.getCourses()
        }
    }

    renderItem = ({ item }) => (
        <View
            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
                <Text>{this.state.language == 'en' ? item.course_name_en : item.course_name_ar}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text>{item.teacher.first_name + ' ' + item.teacher.last_name}</Text>
            </View>
            <View style={{ width: '20%', flexDirection: 'row' }}>
                <Icon onPress={() => this.updateCourse(item)} active size={20} name='edit' type="MaterialIcons" style={{ color: "#579976", marginHorizontal: 5, fontSize: 20 }} />
                <Icon onPress={() => this.deleteCourse(item.id)} active size={20} name='trash-can-outline' type="MaterialCommunityIcons" style={{ color: "red", marginHorizontal: 5, fontSize: 20 }} />
                {/* <Icon onPress={() => this.props.navigation.navigate("CourseStudents", { course_id: item.id })} active size={20} name='remove-red-eye' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} /> */}
            </View>
        </View>
    );

    render() {
        return (
            <View style={{ flex: 10 }}>
                {/* <TouchableOpacity onPress={() => this.setState({ createModal: true })} style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <Icon active size={20} name='add' type="MaterialIcons" style={{ fontSize: 20 }} />
                    <Text style={{ fontSize: 15 }}>Create New Course</Text>
                </TouchableOpacity> */}
                <HeaderTop pagename={i18n.t("Courses")} navigation={this.props.navigation} back={true} />
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    {/* <Text style={styles.heading}>Courses</Text> */}

                    <View style={{ margin: 10 }}>
                        <TouchableOpacity onPress={() => this.setState({ createModal: true })}>
                            <Icon active size={20} name='add-circle' type="MaterialIcons" style={{ color: "#579976", fontSize: 40 }} />
                        </TouchableOpacity>
                    </View>


                    <View
                        style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Course Name')}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Teacher')}</Text>
                        </View>

                        <View style={{ width: '20%', flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('View')}</Text>
                        </View>
                    </View>
                    {this.state.show_spinner ? <ActivityIndicator size="large" /> :
                        this.state.courses.length != 0 ?
                            <FlatList
                                data={this.state.courses}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id}
                            />
                            : <Text style={{justifyContent:'center', textAlign:'center',alignItems:'center'}}>{i18n.t('No Courses')}</Text>
                    }

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.createModal}
                        statusBarTranslucent={true}

                        onRequestClose={() => {
                            this.setState({ createModal: false });
                        }}
                    ><SafeAreaView style={{flex:1}}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.heading}>{i18n.t('Create New Course')}</Text>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('English Name')}</Text>
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.name_en}
                                        onChangeText={(e) => this.setState({ name_en: e })}></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Arabic Name')}</Text>
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.name_ar}
                                        onChangeText={(e) => this.setState({ name_ar: e })}></TextInput>
                                </View>

                                <View style={{ flexDirection: 'row', bottom: 20, margin: 20, marginBottom: 10, position: 'absolute', right: 0 }}>
                                    <Pressable>
                                        <Button onPress={() => this.createCourse()} style={{ backgroundColor: '#579976', width: '100%', padding: 20, color: '#579976' }}><Text style={{ fontWeight: 'bold', color: '#fff' }}>{i18n.t('Submit')}</Text></Button>
                                    </Pressable>
                                </View>
                            </View>
                        </View></SafeAreaView>
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.updateModal}
                        statusBarTranslucent={true}

                        onRequestClose={() => {
                            this.setState({ updateModal: false });
                        }}
                    ><SafeAreaView style={{flex:1}}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.heading}>{i18n.t('Update Course')}</Text>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('English Name')}</Text>
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updatename_en}
                                        onChangeText={(e) => {
                                            var lesson = this.state.updateClassItem
                                            lesson.name_en = e
                                            this.setState({ updateClassItem: lesson, updatename_en: e })
                                        }}
                                    ></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Arabic Name')}</Text>
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updatename_ar}
                                        onChangeText={(e) => {
                                            var lesson = this.state.updateClassItem
                                            lesson.name_ar = e
                                            this.setState({ updateClassItem: lesson, updatename_ar: e })
                                        }}></TextInput>
                                </View>

                                <View style={{ flexDirection: 'row', bottom: 20, margin: 20, marginBottom: 10, position: 'absolute', right: 0 }}>
                                    <Pressable onPress={() => this.updateCourses()}>
                                        <Text style={{ color: 'green', fontSize: 16, marginHorizontal: 10 }}>{i18n.t('Update')}</Text>
                                    </Pressable>

                                </View>

                            </View>
                        </View></SafeAreaView>
                    </Modal>

                </ImageBackground>
            </View>
        )
    }
}
export default CourseActions

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    sectionWrapper: {
        padding: 20
    },
    heading: {
        fontSize: 20,

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