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
import { AsyncStorage } from 'react-native';
import axios from 'axios';



class Course extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            updateModal: false,
            courses: [],
            language: '',
            show_spinner:true,
            id:0

        };
        this.getLanguage()
    }

    componentDidMount() {
        console.log("course134")
        this.getStudentProfile()
        
    }
    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    getCourses = async () => {
        this.setState({show_spinner:true})
        
        const response = await axios.get(`https://moqc.ae/api/courses/`);
        this.setState({show_spinner:false})
        if (response.status === 200) {
            open.next(false)
            
            this.setState({ courses: response.data.filter((item)=>item.teacher_id==this.state.id) })
        }
    }

    async createCourse() {
        var body = new FormData()
        body.append("id", this.state.id)
        body.append("class_name", this.state.name_en)
        body.append("name_ar", this.state.name_ar)
        body.append("class_teacher", this.state.teacher)
        const response = await axios.post(`https://moqc.ae/api/classes/create`, body);

        if (response.status === 200) {
            this.setState({ createModal: false })
            this.getCourses()
        }
    }

    async updateCourses() {
        var body = new FormData()
        body.append("id", this.state.updateid)
        body.append("class_name", this.state.updatename_en)
        body.append("name_ar", this.state.updatename_ar)
        body.append("class_teacher", this.state.updateteacher)
        const response = await axios.post(`https://moqc.ae/classes/update`, body);

        if (response.status === 200) {
            this.setState({ updateModal: false })
            this.getClasses()
        }
    }
    getStudentProfile = async () => {
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.post(`https://moqc.ae/api/profile`, '',
            {
                headers: { "token": token }
            }).then(res=>{
               this.setState({id:res.data.id})
               this.getCourses()
            });
          
   
    }

    async updateCourse(courses) {
        this.setState({
            updateModal: true, updateClassItem: courses, updatename_en: courses.course_name_en,
            updatename_ar: courses.course_name_ar, updateid: courses.id, updateteacher: courses.class_teacher
        })
    }


    renderItem = ({ item }) => (
        <View
            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
                <Text>{this.state.language == 'en' ? item.course_name_en : item.course_name_ar}</Text>
            </View>

            <View style={{ width: '20%', flexDirection: 'row' }}>
                {/* <Icon onPress={() => this.updateCourse(item)} active size={20} name='edit' type="MaterialIcons" style={{ color: "#579976", marginHorizontal: 5, fontSize: 20 }} /> */}

                <Icon onPress={() => this.props.navigation.navigate("CourseStudents", { course_id: item.id })} active size={20} name='remove-red-eye' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} />
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
                {/* <HeaderTop pagename={i18n.t("Courses")} navigation={this.props.navigation} back={true} /> */}
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    {/* <Text style={styles.heading}>Courses</Text> */}

                    {/* <View style={{}}>
                        <TouchableOpacity onPress={() => this.setState({ createModal: true })}>
                            <Icon active size={20} name='add-circle' type="MaterialIcons" style={{ color: "#579976", fontSize: 40 }} />
                        </TouchableOpacity>
                    </View> */}

<HeaderTop pagename={i18n.t("Dashboard")} navigation={this.props.navigation} back={true} />
                    <View
                        style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Course Name')}</Text>
                        </View>

                        <View style={{ width: '20%', flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('View')}</Text>
                        </View>
                    </View>
                    {this.state.show_spinner ? <ActivityIndicator size="large" /> :
                    this.state.courses.length !=0 ?
                        <FlatList
                            data={this.state.courses}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id}
                        /> :
                        <Text style={{justifyContent:'center', textAlign:'center'}}>{i18n.t('No Courses')}</Text>
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
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.name_en}
                                        onChangeText={(e) => this.setState({ name_en: e })}></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{('Arabic Name')}</Text>
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.name_ar}
                                        onChangeText={(e) => this.setState({ name_ar: e })}></TextInput>
                                </View>
                                <View>
                                    <Text>{i18n.t('Teacher')}</Text>
                                    <View style={{ borderRadius: 10, padding: 10, borderWidth: 1, width: '100%' }}>
                                        <Picker
                                            placeholder="Select One"
                                            placeholderStyle={{ color: "#2874F0" }}
                                            style={{ height: 20 }}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ teacher: itemValue })}
                                        >
                                            <Picker.Item label="10e" value="10e" />
                                            <Picker.Item label="10e2" value="10e2" />

                                        </Picker>
                                    </View>
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
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
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
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updatename_ar}
                                        onChangeText={(e) => {
                                            var lesson = this.state.updateClassItem
                                            lesson.name_ar = e
                                            this.setState({ updateClassItem: lesson, updatename_ar: e })
                                        }}></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Teacher')}</Text>
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updateteacher}
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
export default Course

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