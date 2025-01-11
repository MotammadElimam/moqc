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
    Dimensions,
    Modal,
    Pressable,
    PermissionsAndroid
} from 'react-native';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input } from 'native-base';
import GetLocation from 'react-native-get-location'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import API from "../api";
import Axios from 'axios'
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from 'rn-fetch-blob'
import i18n from '../i18n';
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class StudentProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            studentDetail: [],
            openModal: false,
            editItem: '',
            username: '',
            fullname: '',
            email: '',
            password: '',
            phone: '',
            gender: '',
            dob: '',
            nationality: '',
            fname: '',
            upload: false,
            attachment: '',
            profilepic: '',
            passportimage: '',
            attachmentname: '',
            showSpinner: false
        };
    }

    componentDidMount() {
        this.getStudentProfile();
    }

    getStudentProfile = async () => {
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.get(`https://moqc.ae/api/student_profile`,
            {
                headers: { "token": token }
            });
        if (response.status === 200) {
            this.setState({
                studentDetail: response.data,
            })
            response.data.data.map(item => {
                if (item.title == "Profile Picture") {
                    this.setState({ profilepic: item.value })
                }
                else if (item.title == "Passport Image") {
                    this.setState({ passportimage: item.value })
                }

            })
        }
        console.log(this.state.profilepic)
    }

    update = async () => {
        this.setState({ showSpinner: true })
        let token = await AsyncStorage.getItem("@moqc:token")
        let body = new FormData()
        body.append("first_name", this.state.studentDetail.first_name)
        body.append("last_name", this.state.studentDetail.last_name)
        body.append("nationality", this.state.studentDetail.nationality)
        body.append("contact_phone", this.state.studentDetail.contact_phone)
        body.append("gender", this.state.studentDetail.gender)
        body.append("detail_address", this.state.studentDetail.detail_address)
        body.append("dob", this.state.studentDetail.dob)
        body.append("passport_expiry", this.state.studentDetail.passport_expiry)
        const response = await axios.post(`https://moqc.ae/api/student_profile_update`,
            body,
            {
                headers: { "token": token }
            });
        if (response.status === 200) {
            this.setState({ showSpinner: false })
            this.getStudentProfile()
        }
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
            var body = new FormData()
            body.append("id", this.state.studentDetail.id)
            body.append("name", this.state.attachmentname)
            body.append('attachment', res[0])
            // body.append("attachment", this.state.attachment)

            axios.post(`https://moqc.ae/api/student_file_upload`, body,
                { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
                    this.getStudentProfile()
                })

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("error -----", err);
            } else {
                throw err;
            }
        }
    }

    async uploadAPICall() {
        this.setState({ showSpinner: true })
        var body = new FormData()
        body.append("id", this.state.studentDetail.id)
        body.append("name", this.state.attachmentname)
        body.append('attachment', JSON.stringify({
            uri: this.state.attachment.uri,
            type: this.state.attachment.type,
            name: this.state.attachment.fileName,
        }))
        // body.append("attachment", this.state.attachment)

        const response = axios.post(`https://moqc.ae/api/student_file_upload`, body)
        if (response.status === 200) {
            this.setState({ showSpinner: false })
            this.getStudentProfile()
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
            .fetch('GET', `https://moqc.ae/${this.state.passportimage}`)
            .then((res) => {
                //Showing alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
                alert('Download Successfull.');
            });
    }

    render() {
        var item = this.state.studentDetail
        return (
            <Container style={{ flex: 1 }}>
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10
                    }}>
                    {this.state.showSpinner ? <ActivityIndicator size='large' color='green' /> :
                        <Content>
          

                            <View style={{ margin: 10 }}>
                                <View style={{ backgroundColor: '#ffff', borderRadius: 10, borderWidth: 1, borderColor: '#D5D5D5', padding: 10 }}>
                                    <View style={{ backgroundColor: '#F7F8FA', borderRadius: 10, padding: 10 }}>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('First Name')} : </Text>
                                            <Text disabled={true} style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                                
                                                >{item.first_name}</Text>
                                        </View>
                                        {/* <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('Last Name')} : </Text>
                                            <Text style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                               >{item.last_name}</Text>
                                        </View> */}
                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('Nationality')} : </Text>
                                            <Text style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                                onChangeText={(e) => {
                                                    var clas = this.state.studentDetail
                                                    clas.nationality = e
                                                    this.setState({ studentDetail: clas })
                                                }}>{item.nationality?.country_name}</Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('Gender')} : </Text>
                                            <Text style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                                onChangeText={(e) => {
                                                    var clas = this.state.studentDetail
                                                    clas.gender = e
                                                    this.setState({ studentDetail: clas })
                                                }}>{item.gender == 1 ? "Male" : "Female"}</Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('Contact Number')} : </Text>
                                            <Text style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                                onChangeText={(e) => {
                                                    var clas = this.state.studentDetail
                                                    clas.contact_phone = e
                                                    this.setState({ studentDetail: clas })
                                                }}>{item.contact_phone}</Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('Address')} : </Text>
                                            <Text style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                                onChangeText={(e) => {
                                                    var clas = this.state.studentDetail
                                                    clas.detail_address = e
                                                    this.setState({ studentDetail: clas })
                                                }}>{item.detail_address}</Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('Date of Birth')} : </Text>
                                            <Text style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                                onChangeText={(e) => {
                                                    var clas = this.state.studentDetail
                                                    clas.dob = e
                                                    this.setState({ studentDetail: clas })
                                                }}>{item.dob}</Text>
                                        </View>

                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('Passport Expiry')} : </Text>
                                            <TextInput style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                                onChangeText={(e) => {
                                                    var clas = this.state.studentDetail
                                                    clas.passport_expiry = e
                                                    this.setState({ studentDetail: clas })
                                                }}>{item.passport_expiry}</TextInput>
                                        </View>

                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('Passport')} : </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}>
                                                <Pressable disabled
                                                    onPress={() => { this.docPicker(); this.setState({ attachmentname: 'passportimage' }) }}><Text>{i18n.t('Select File')}</Text></Pressable>
                                                <Icon onPress={() => this.uploadAPICall()} active size={20} name='file-upload' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />

                                                <Icon onPress={() => this.historyDownload()} active size={20} name='file-download' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />
                                            </View>

                                        </View>

                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('Emirates Expiry')} : </Text>
                                            <TextInput style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                                onChangeText={(e) => {
                                                    var clas = this.state.studentDetail
                                                    clas.emirates_expiry = e
                                                    this.setState({ studentDetail: clas })
                                                }}>{item.id_date}</TextInput>
                                        </View>

                                        <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                            <Text style={{ width: '30%', fontWeight: 'bold' }}>{i18n.t('Emirates ID')} : </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}>
                                                <Pressable
                                                    onPress={() => { this.docPicker(); this.setState({ attachmentname: 'emiratesimage' }) }}><Text>{i18n.t('Select File')}</Text></Pressable>
                                                <Icon onPress={() => this.uploadAPICall()} active size={20} name='file-upload' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />

                                                <Icon onPress={() => this.historyDownload()} active size={20} name='file-download' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />
                                            </View>

                                        </View>

                                        {/* <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                        <Text style={{ width: '30%', fontWeight: 'bold' }}>Emirates Id Expiry : </Text>
                                        <TextInput style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                            onChangeText={(e) => {
                                                var clas = this.state.studentDetail
                                                clas.emirates_expiry = e
                                                this.setState({ studentDetail: clas })
                                            }}>{item.emirates_expiry}</TextInput>
                                    </View>

                                    <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: "center" }}>
                                        <Text style={{ width: '30%', fontWeight: 'bold' }}>Emirates Id : </Text>
                                        {this.state.upload ? <Pressable style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                            onPress={() => this.uploadAPICall()}><Text>Upload</Text></Pressable> :
                                            <Pressable style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}
                                                onPress={() => this.docPicker()}><Text>Select File</Text></Pressable>}
                                    </View> */}

<Pressable onPress={async() => {
      let token = await AsyncStorage.getItem("@moqc:token")
      console.log(token)
    axios.post("https://moqc.ae/api/student_delete",{},{headers:{token:token}}).then(async(res)=>{
        console.log(res.data)
        this.props.navigation.navigate("Landing"),
        await AsyncStorage.clear()
    })
}} style={{ bottom: 0, alignSelf: 'flex-end' }}>
    <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white' ,backgroundColor:"#eb445a",paddingHorizontal:8,paddingVertical:5,borderRadius:5 }}>{i18n.t('Delete Profile')}</Text>
    </Pressable>
                                    
                                      {item.can_update==1?  <Pressable onPress={() => this.update()} style={{ bottom: 0, alignSelf: 'flex-end' }}><Text style={{ fontWeight: 'bold', fontSize: 16, color: 'green' }}>{i18n.t('Update')}</Text></Pressable>:null}
                                    </View>
                                </View>
                            </View>


                        </Content>}

                </ImageBackground>
                {/* <Footer location={"profile"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(StudentProfile)

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
        height: 220,
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
        elevation: 5
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