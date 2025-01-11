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
import API from "../api/";
const Axios = require('axios');

import CheckBox from 'react-native-check-box'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import HeaderTop from "./Header";
import { AsyncStorage } from 'react-native';
import i18n from '../i18n';
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

class TeacherClasses extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            classes: [],
            name_en: '',
            name_ar: '',
            teacher: '',
            createModal: false,
            updateid: '',
            updatename_en: "",
            updatename_ar: "",
            updateteacher: "",
            updateModal: false,
            language:'',
            show_spinner:true

        };
        this.getLanguage()
    }

    componentDidMount() {
        this.getClasses()
    }

    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    getClasses = async () => {
        this.setState({show_spinner:true})
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.get("https://moqc.ae/api/teacher_classes",
            {
                headers: { "token": token }
            });
            this.setState({show_spinner:false})
        if (response.status === 200) {
            this.setState({ classes: response.data })
        }
    }

    async createClass() {
        let token = await AsyncStorage.getItem("@moqc:token")
        var body = new FormData()
        body.append("id", this.state.id)
        body.append("class_name", this.state.name_en)
        body.append("name_ar", this.state.name_ar)
        body.append("class_teacher", this.state.teacher)
        const response = await axios.post(`https://moqc.ae/api/classes/create`, body,
            {
                headers: { "token": token }
            });

        if (response.status === 200) {
            this.setState({ createModal: false })
            this.getClasses()
        }
    }

    async updateClasses() {
        let token = await AsyncStorage.getItem("@moqc:token")
        var body = new FormData()
        body.append("id", this.state.updateid)
        body.append("class_name", this.state.updatename_en)
        body.append("name_ar", this.state.updatename_ar)
        body.append("class_teacher", this.state.updateteacher)
        const response = await axios.post(`https://moqc.ae/classes/update`, body,
        {
            headers: { "token": token }
        });

        if (response.status === 200) {
            this.setState({ updateModal: false })
            this.getClasses()
        }
    }

    async updateClass(classes) {
        this.setState({
            updateModal: true, updateClassItem: classes, updatename_en: classes.class_name,
            updatename_ar: classes.name_ar, updateid: classes.id, updateteacher: classes.class_teacher
        })
    }


    renderItem = ({ item }) => (
        <View
            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
                <Text>{this.state.language == 'en' ? item.class_name :item.name_ar}</Text>
            </View>
            {/* <View style={{ flex: 1 }}>
                <Text>{item.teacher.first_name} {item.teacher.last_name}</Text>
            </View> */}
            <View style={{ width: '20%', flexDirection: 'row' }}>
                <Icon onPress={() => this.props.navigation.navigate("Course", { class_id: item.id })} active size={20} name='remove-red-eye' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} />
            </View>
        </View>
    );

    render() {

        return (
            <View style={{ flex: 10 }}>
                <HeaderTop pagename={"courses"} navigation={this.props.navigation} back={true} />

                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>

                    <View
                        style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Class Name')}</Text>
                        </View>

                        <View style={{ width: '20%', flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('View')}</Text>
                        </View>
                    </View>
                    {this.state.show_spinner ? <ActivityIndicator size='large'/> : 
                    <FlatList
                        data={this.state.classes}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                    />
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
                                <Text style={styles.heading}>{i18n.t('Create new course')}</Text>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('English Name')}</Text>
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.name_en}
                                        onChangeText={(e) => this.setState({ name_en: e })}></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Arabic Name')}</Text>
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
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Pressable style={{ position: 'absolute', right: 0, bottom: 10 }}>
                                        <Button onPress={() => this.createClass()} style={{ backgroundColor: '#579976', width: '100%', padding: 20, color: '#579976' }}><Text style={{ fontWeight: 'bold', color: '#fff' }}>{'Submit'}</Text></Button>
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
                                <Text style={styles.heading}>Update Class</Text>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>English Name</Text>
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
                                    <Text>Arabic Name</Text>
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updatename_ar}
                                        onChangeText={(e) => {
                                            var lesson = this.state.updateClassItem
                                            lesson.name_ar = e
                                            this.setState({ updateClassItem: lesson, updatename_ar: e })
                                        }}></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>Teacher</Text>
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updateteacher}
                                        onChangeText={(e) => {
                                            var lesson = this.state.updateClassItem
                                            lesson.name_ar = e
                                            this.setState({ updateClassItem: lesson, updatename_ar: e })
                                        }}></TextInput>
                                </View>


                                <View style={{ flexDirection: 'row', bottom: 20, margin: 20, marginBottom: 10, position: 'absolute', right: 0 }}>
                                    <Pressable onPress={() => this.updateClasses()}>
                                        <Text style={{ color: 'green', fontSize: 16, marginHorizontal: 10 }}>Update</Text>
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
export default TeacherClasses

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