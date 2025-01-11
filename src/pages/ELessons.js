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
    PermissionsAndroid,
    ActivityIndicator
} from 'react-native';
import API from "../api/";
const Axios = require('axios');

import CheckBox from 'react-native-check-box'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DocumentPicker from "react-native-document-picker";
import ActionButton from 'react-native-action-button';
import RNFetchBlob from 'rn-fetch-blob'
import i18n from '../i18n';
import { AsyncStorage } from 'react-native';
import axios from 'axios';


class ELessons extends React.Component {

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
        this.getLanguage()
    }

    componentDidMount() {
        this.getLessons()
    }

    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    getLessons = async () => {
        this.setState({ show_spinner: true })
        var course_id = this.props.route.params.course_id
        const response = await axios.get(`https://moqc.ae/api/course_eleasons/${course_id}`);
        if (response.status === 200) {
            this.setState({ show_spinner: false })
            this.setState({ lessons: response.data })
        }
    }

    async uploadAPICall() {
        var body = new FormData()
        body.append("name_en", this.state.name_en)
        body.append("name_ar", this.state.name_ar)
        body.append("attachment", this.state.attachment)
        var course_id = this.props.route.params.course_id
        const response = await axios.post(`https://moqc.ae/api/eleason_create/${course_id}`, body);

        if (response.status === 200) {
            this.setState({ createModal: false })
            this.getLessons()
        }
    }

    async deleteLessons(id) {
        const response = await axios.delete(`https://moqc.ae/api/eleason_delete/${id}`);
        if (response.status === 200) {
            this.getLessons()
        }
    }
    async updateLessons() {
        var course_id = this.props.route.params.course_id
        var body = new FormData()
        body.append("name_en", this.state.updatename_en)
        body.append("name_ar", this.state.updatename_ar)
        body.append("attachment", this.state.attachment)
        const response = await axios.post(`https://moqc.ae/api/eleason_update/${this.state.updateLessonItem.id}`, body);

        if (response.status === 200) {
            this.setState({ updateModal: false })
            this.getLessons()
        }
    }

    async updateLesson(lesson) {
        this.setState({
            updateModal: true, updateLessonItem: lesson, updatename_en: lesson.name_en,
            updatename_ar: lesson.name_ar
        })
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
        this.setState({ show_spinner: true })
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
                this.setState({ show_spinner: false })
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
                {this.state.show_spinner ? <ActivityIndicator /> :
                    <Icon onPress={() => this.historyDownload(item.link)} active size={20} name='file-download' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} />}
                <Icon onPress={() => this.updateLesson(item)} active size={20} name='edit' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />
                <Icon onPress={() => this.deleteLessons(item.id)} active size={20} name='trash-can-outline' type="MaterialCommunityIcons" style={{ color: "red", fontSize: 20 }} />
            </View>
        </View>
    );


    render() {

        return (
            <Container>
                <ScrollView>

                    <ImageBackground
                        source={require('../assets/bg_img.png')}
                        style={{
                            flex: 10,
                        }}>
                        <View style={{ margin: 10 }}>
                            <TouchableOpacity onPress={() => this.setState({ createModal: true })}>
                                <Icon active size={20} name='add-circle' type="MaterialIcons" style={{ color: "#579976", fontSize: 40 }} />
                            </TouchableOpacity>
                        </View>
                        {/* <ActionButton
                            buttonColor="#579976" onPress={() => this.setState({ createModal: true })}>
                        </ActionButton> */}
                        <View
                            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Created at')}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Name')}</Text>
                            </View>

                            <View style={{ width: '20%', flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Action')}</Text>
                            </View>
                        </View>
                        {this.state.show_spinner ? <ActivityIndicator /> :
                            <FlatList
                                data={this.state.lessons}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id}
                            />}
                        {/* <FAB
                                style={styles.fab}
                                small
                                icon="plus"
                                onPress={() => this.setState({ createModal: true })}

                            /> */}


                        {/* <View style={{ position: 'absolute', zIndex: 10, right: 20, bottom: 90 }}>
                            <TouchableOpacity onPress={() => this.setState({ createModal: true })}>
                                <Icon active size={20} name='add-circle' type="MaterialIcons" style={{ color: "#579976", fontSize: 44 }} />
                            </TouchableOpacity>
                        </View> */}


                        <Modal
                            animationType="slide"
                            
                            visible={this.state.createModal}
                            statusBarTranslucent={true}

                            onRequestClose={() => {
                                this.setState({ createModal: false });
                            }}
                        ><SafeAreaView style={{flex:1}}>
                            

                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.heading}>{i18n.t('Upload E-Lessons')}</Text>
                                    <View style={{ marginVertical: 10 }}>
                                        <Text>{i18n.t('English Name')}</Text>
                                        <TextInput style={{ padding: 10, height: 40,  borderWidth: 1, borderRadius: 10 }}
                                            value={this.state.name_en}
                                            onChangeText={(e) => this.setState({ name_en: e })}></TextInput>
                                    </View>
                                    <View style={{ marginVertical: 10 }}>
                                        <Text>{i18n.t('Arabic Name')}</Text>
                                        <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                            value={this.state.name_ar}
                                            onChangeText={(e) => this.setState({ name_ar: e })}></TextInput>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Pressable
                                            onPress={() => this.docPicker()}
                                        >
                                            <Image style={{ height: 24, width: 24 }} source={require('../assets/upload.jpg')} />
                                            <Text style={{ color: '#579976' }}> {'Click to upload'}</Text>
                                        </Pressable>
                                      
                                            
                                       
                                    </View>
                                    <Button disabled={!this.state.name_en || !this.state.name_ar || !this.state.attachment} onPress={() => this.uploadAPICall()} style={{ backgroundColor: '#579976',width:"100%",  padding: 20, color: '#579976',justifyContent:"center" }}><Text style={{ fontWeight: 'bold', color: '#fff' }}>{i18n.t('Submit')}</Text></Button>
                                    <Button style={{backgroundColor:"#fff",borderColor:"#579976",borderWidth:1,borderRadius:10,marginVertical:10,width:"100%",alignItems:"center",justifyContent:"center"}} onPress={()=>{this.setState({ createModal: false });}} >
                                            <Text style={{textAlign:"center",}}>{i18n.t("cancel")}</Text>
                                        </Button>

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
                                    <Text style={styles.heading}>{i18n.t('Upload E-Lessons')}</Text>
                                    <View style={{ marginVertical: 10 }}>
                                        <Text>{i18n.t('English Name')}</Text>
                                        <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                            value={this.state.updatename_en}
                                            onChangeText={(e) => {
                                                var lesson = this.state.updateLessonItem
                                                lesson.name_en = e
                                                this.setState({ updateLessonItem: lesson, updatename_en: e })
                                            }}
                                        ></TextInput>
                                    </View>
                                    <View style={{ marginVertical: 10 }}>
                                        <Text>{i18n.t('Arabic Name')}</Text>
                                        <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                            value={this.state.updatename_ar}
                                            onChangeText={(e) => {
                                                var lesson = this.state.updateLessonItem
                                                lesson.name_ar = e
                                                this.setState({ updateLessonItem: lesson, updatename_ar: e })
                                            }}></TextInput>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <Pressable onPress={() => this.docPicker()}>
                                            <Image style={{ height: 24, width: 24 }} source={require('../assets/upload.jpg')} />
                                            <Text style={{ color: '#579976' }}> {'Click to upload'}</Text>
                                        </Pressable>
                                       
                                    </View>
                                   
                                            <Button onPress={() => this.updateLessons()} style={{ backgroundColor: '#579976',width:"100%", padding: 20, color: '#579976',alignItems:"center",justifyContent:"center" }}><Text style={{ fontWeight: 'bold',textAlign:"center", color: '#fff' }}>{i18n.t('Submit')}</Text></Button>
                                        <Button style={{backgroundColor:"#fff",borderColor:"#579976",borderWidth:1,borderRadius:10,marginVertical:10,width:"100%",alignItems:"center",justifyContent:"center"}} onPress={()=>{this.setState({ updateModal: false });}} >
                                            <Text style={{textAlign:"center",}}>{i18n.t("cancel")}</Text>
                                        </Button>
                                        
                                </View>
                            </View></SafeAreaView>
                        </Modal>


                    </ImageBackground>

                </ScrollView>
            </Container>
        )
    }
}
export default ELessons

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
       
        alignItems: "center",
      
       
    },
    modalView: {
      
        backgroundColor: "white",
       
        padding: 20,
        width:"100%"
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