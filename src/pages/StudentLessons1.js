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
    Alert,
    Platform,
    PermissionsAndroid
} from 'react-native';
import API from "../api";
const Axios = require('axios');

import CheckBox from 'react-native-check-box'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DocumentPicker from "react-native-document-picker";
import { ActivityIndicator, FAB } from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import RNFetchBlob from 'rn-fetch-blob'
import { open } from '../store';
import i18n from '../i18n';
import { AsyncStorage } from 'react-native';
import axios from 'axios';


class StudentLesson1 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            lessons: [],
            name_en: '',
            name_ar: "",
            attachment: '',
            updateModal: false,
            updateLessonItem: [],
            updatename_en: '',
            updatename_ar: '',
            language: '',
            show_spinner: true

        };
    }

    componentDidMount() {
        this.getLessons()
        this.getLanguage()
    }

    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    getLessons = async () => {
        open.next(true)
        this.setState({ show_spinner: true })
        var course_id = this.props.route.params.course_id
        const response = await axios.get(`https://moqc.ae/api/course_eleasons/${course_id}`);
        this.setState({ show_spinner: false })
        console.log('course',course_id)
        if (response.status === 200) {
            this.setState({ lessons: response.data })
        }
        open.next(false)
    }

    async docPicker() {
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],
            });
            console.log(
                JSON.stringify(res),
                res.uri,
                res.type, // mime type
                res.name,
                res.size
            );

            this.setState({ attachment: JSON.stringify(res) })

            //here you can call your API and send the data to that API
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("error -----", err);
            } else {
                throw err;
            }
        }
    }

    historyDownload(link) {
        //Function to check the platform
        //If iOS the start downloading
        //If Android then ask for runtime permission
        if (Platform.OS === 'ios') {
            this.downloadFile();
        } else {
            try {
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'storage title',
                        message: 'storage_permission',
                    },
                ).then(granted => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        //Once user grant the permission start downloading
                        console.log('Storage Permission Granted.');
                        this.downloadFile(link);
                    } else {
                        //If permission denied then show alert 'Storage Permission 
                        Alert.alert('storage_permission');
                    }
                });
            } catch (err) {
                //To handle permission related issue
                console.log('error', err);
            }
        }
    }

    async downloadFile(link) {
        const { config, fs } = RNFetchBlob;
        let DownloadDir = fs.dirs.DownloadDir;
        let date = new Date();
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                //Related to the Android only
                useDownloadManager: true,
                notification: true,
                path:
                    DownloadDir +
                    '/Download',
                description: link,
            },
        };
        config(options)
            .fetch('GET', `https://moqc.ae/eleason/${link}`)
            .then((res) => {
                //Showing alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
                alert('Download Successfull.');
            });
    }


    renderItem = ({ item }) => (
        <View onPress={() => this.props.navigation.navigate("CourseStudents")}
            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
                <Text>{item.created_at.split(" ")[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text>{this.state.language == 'en' ? item.name_en : item.name_ar}</Text>
            </View>
            <View style={{ width: '20%', flexDirection: 'row' }}>
                <Icon onPress={() => this.historyDownload(item.link)} active size={20} name='file-download' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} />
                {/* <Icon onPress={() => this.updateLesson(item)} active size={20} name='edit' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} /> */}
                {/* <Icon onPress={() => this.deleteLessons(item.id)} active size={20} name='trash-can-outline' type="MaterialCommunityIcons" style={{ color: "red", fontSize: 20 }} /> */}
            </View>
        </View>
    );


    render() {

        return (
            <Container style={{ flex: 10, }}>
                <ScrollView>

                    <ImageBackground
                        source={require('../assets/bg_img.png')}
                        style={{
                            flex: 10,

                        }}>

                        <View
                            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Created at')}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Name')}</Text>
                            </View>

                            <View style={{ width: '20%', flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Download')}</Text>
                            </View>
                        </View>
                        {this.state.show_spinner ? <ActivityIndicator size='large' color='green' /> :
                            this.state.lessons.length ?
                                <FlatList
                                    data={this.state.lessons}
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.id}
                                /> :
                                <Text style={{ fontSize: 18, justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>{i18n.t('No Data Available')}</Text>
                        }

                    </ImageBackground>

                </ScrollView>
            </Container>
        )
    }
}
export default StudentLesson1

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    sectionWrapper: {
        padding: 20
    },
    heading: {
        fontSize: 20,
        marginBottom: 5,
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
        height: "50%",
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 20,
        bottom: 90,
        color: '#fff',
        backgroundColor: '#579976'
    },
});