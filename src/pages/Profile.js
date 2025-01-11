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
    PermissionsAndroid,
    ActivityIndicator,
    Alert
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
import Toast from 'react-native-simple-toast';
import DateTimePicker from 'react-native-date-picker';
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

class Profile extends React.Component {
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
            emiratesimage: '',
            attachmentname: '',
            show_spinner: true
        };
    }

    componentDidMount() {
        this.getStudentProfile();
    }

    getStudentProfile = async () => {
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.post(`https://moqc.ae/api/profile`, '',
            {
                headers: { "token": token }
            });
        if (response.status === 200) {
            this.setState({
                show_spinner: false,
                studentDetail: response.data,
            })


        }
    }

    update = async () => {
        this.setState({ show_spinner: true })
        let token = await AsyncStorage.getItem("@moqc:token")
        let body = new FormData()
        body.append("username", this.state.studentDetail.username)
        body.append("first_name", this.state.studentDetail.first_name)
        body.append("last_name", this.state.studentDetail.last_name)
        // body.append("nationality", this.state.studentDetail.nationality)
        // body.append("contact_phone", this.state.studentDetail.contact_phone)
        // body.append("gender", this.state.studentDetail.gender)
        // body.append("detail_address", this.state.studentDetail.detail_address)
        // body.append("dob", this.state.studentDetail.dob)
        body.append("passport_expiration", this.state.studentDetail.passport_expiration)
        body.append("emirates_id_expiration", this.state.studentDetail.emirates_id_expiration)
        const response = await axios.post(`https://moqc.ae/api/editProfile`,
            body,
            {
                headers: { "token": token }
            });
        if (response.status === 200) {
            this.setState({ show_spinner: false })
            Toast.showWithGravity('Update Successfull', Toast.SHORT, Toast.CENTER);
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
            let token = await AsyncStorage.getItem("@moqc:token")
            var body = new FormData()
            body.append("name", this.state.attachmentname)
            body.append('file', res[0])
            // body.append("attachment", this.state.attachment)

            axios.post(`https://moqc.ae/api/profile_upload`, body,
                { headers: { "token": token } }).then(res => {
                    Toast.showWithGravity('Update Successfull', Toast.SHORT, Toast.TOP);
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
        this.setState({ show_spinner: true })
        var body = new FormData()
        body.append("name", this.state.attachmentname)
        body.append('file', JSON.stringify({
            uri: this.state.attachment.uri,
            type: this.state.attachment.type,
            name: this.state.attachment.fileName,
        }))
        // body.append("attachment", this.state.attachment)

        const response = axios.post(`https://moqc.ae/api/profile_upload`, body)
        if (response.status === 200) {
            this.setState({ show_spinner: false })
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

    formatDate(date) {
        var d = new Date(date);
        d = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
        this.setState({ formattedDate: d })
        return d
    }

    onChangePassportExp = (event, selectedDate) => {
        this.setState({ openDate: false })
        const currentDate = selectedDate || date;
        this.formatDate(selectedDate)

        var clas = this.state.studentDetail
        clas.passport_expiration = this.formatDate(selectedDate)
        this.setState({ studentDetail: clas })
    };
    onChangeEmiratesExp = (event, selectedDate) => {
        this.setState({ openDate1: false })
        const currentDate = selectedDate || date;
        this.formatDate(selectedDate)

        var clas = this.state.studentDetail
        clas.emirates_id_expiration = this.formatDate(selectedDate)
        this.setState({ studentDetail: clas })
        console.log("datedfdf", this.state.studentDetail)
    };
     logout=async() =>{
        
        this.props.navigation.navigate("Landing")
        await AsyncStorage.clear()
        
    }

    deleteAccount=async()=>{
        Alert.alert(
            i18n.t("Delete Account"),
            i18n.t('Are you sure you want to delete your account?'),
            [
              {
                text: i18n.t('Cancel'),
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: i18n.t('Delete Account'),
                onPress: () => {
                  // Put your account deletion logic here
                  this.logout()
                },
                style: 'destructive',
              },
            ],
            { cancelable: false }
          );
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
                    <Content>
                        <View >
                            {this.state.show_spinner ? <ActivityIndicator /> :
                                <Image
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        height: 80,
                                        width: 80,
                                        margin: 10,
                                        borderRadius: 50,
                                    }}
                                    source={{ uri: item.profile_picture }} />}

                            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                                <Pressable
                                    onPress={() => { this.docPicker(); this.setState({ attachmentname: 'profile_picture' }) }}><Text>{i18n.t('Change Profile Picture')}</Text></Pressable>
                                <Icon active size={20} name='file-upload' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />
                            </View>
                        </View>

                        <View style={{ margin: 10 }}>
                            <View style={{ backgroundColor: '#ffff', borderRadius: 10, borderWidth: 1, borderColor: '#D5D5D5', padding: 10 }}>
                                <View style={{ backgroundColor: '#F7F8FA', borderRadius: 10, padding: 10 }}>
                                    <View style={{ marginVertical: 5, flexDirection: 'column', alignItems: "center" }}>
                                        <Text style={{ width: '100%', fontWeight: 'bold' }}>{i18n.t('UserName')} </Text>
                                        <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                            onChangeText={(e) => {
                                                var clas = this.state.studentDetail
                                                clas.username = e
                                                this.setState({ studentDetail: clas })
                                            }}>{item.username}</TextInput>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ paddingEnd: 5, width: '50%', marginVertical: 5, flexDirection: 'column', alignItems: "center" }}>
                                            <Text style={{ width: '100%', fontWeight: 'bold' }}>{i18n.t('First Name')}</Text>
                                            <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                                onChangeText={(e) => {
                                                    var clas = this.state.studentDetail
                                                    clas.first_name = e
                                                    this.setState({ studentDetail: clas })
                                                }}>{item.first_name}</TextInput>
                                        </View>
                                         <View style={{ width: '50%', marginVertical: 5, flexDirection: 'column', alignItems: "center" }}>
                                            <Text style={{ width: '100%', fontWeight: 'bold' }}>{i18n.t('Last Name')}</Text>
                                            <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                                onChangeText={(e) => {
                                                    var clas = this.state.studentDetail
                                                    clas.last_name = e
                                                    this.setState({ studentDetail: clas })
                                                }}>{item.last_name}</TextInput>
                                        </View> 
                                    </View>


                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '30%', marginVertical: 5, flexDirection: 'column', alignItems: "center" }}>
                                            <Text style={{ width: '100%', fontWeight: 'bold' }}>{i18n.t('Passport')} : </Text>
                                            <View style={{ width: '100%', flexDirection: 'row', padding: 5, height: 50, borderWidth: 0, borderRadius: 10 }}>
                                                {/* <Pressable ><Text>{this.state.studentDetail.passport}</Text></Pressable> */}
                                                <Icon onPress={() => { this.docPicker(); this.setState({ attachmentname: 'passport' }) }} active size={20} name='attach-file' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />
                                                <Icon onPress={() => this.historyDownload()} active size={20} name='file-download' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />
                                            </View>

                                        </View>

                                        <View style={{ width: '70%', marginVertical: 5, flexDirection: 'column', alignItems: "center" }}>
                                            <Text style={{ width: '100%', fontWeight: 'bold' }}>{i18n.t('Passport Expiry')} : </Text>
                                            <Pressable style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }} onPress={() => this.setState({ openDate: true })}>
                                                <Text >{this.state.studentDetail.passport_expiration}</Text>
                                            </Pressable>

                                            {this.state.openDate && (
                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    value={new Date(item.passport_expiration)}
                                                    mode='date'
                                                    is24Hour={true}
                                                    display="default"
                                                    onChange={this.onChangePassportExp}
                                                />
                                            )}

                                        </View>
                                    </View>



                                    <View style={{flexDirection:'row'}}>
                                        <View style={{width:'30%', marginVertical: 5, flexDirection: 'column', alignItems: "center" }}>
                                            <Text style={{ width: '100%', fontWeight: 'bold' }}>{i18n.t('Emirates ID')} : </Text>
                                            <View style={{width: '100%', flexDirection: 'row', padding: 5, height: 50, borderWidth: 0, borderRadius: 10 }}>
                                                {/* <Pressable
                                                ><Text>{this.state.studentDetail.emirates_id}</Text></Pressable> */}
                                                <Icon onPress={() => { this.docPicker(); this.setState({ attachmentname: 'emirates_id' }) }} active size={20} name='attach-file' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />

                                                <Icon onPress={() => this.historyDownload()} active size={20} name='file-download' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />
                                            </View>

                                        </View>
                                        <View style={{width: '70%', marginVertical: 5, flexDirection: 'column', alignItems: "center" }}>
                                            <Text style={{ width: '100%', fontWeight: 'bold' }}>{i18n.t('Emirates Expiry')} : </Text>
                                            <Pressable style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }} onPress={() => this.setState({ openDate1: true })}>
                                                <Text >{this.state.studentDetail.emirates_id_expiration}</Text>
                                            </Pressable>

                                            {this.state.openDate1 && (
                                                <DateTimePicker
                                                    value={new Date()}
                                                    mode='date'
                                                    is24Hour={true}
                                                    display="default"
                                                    onChange={this.onChangeEmiratesExp}
                                                />
                                            )}
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
                                    <View>
                                    <Pressable onPress={() => this.update()} style={{  alignSelf: 'flex-end' }}><Text style={{ fontWeight: 'bold', fontSize: 16, color: 'green' }}>{i18n.t('Update')}</Text></Pressable>
                                    
                                    <Pressable onPress={() => this.deleteAccount()} style={{  alignSelf: 'flex-end',backgroundColor:"red" ,paddingHorizontal:15,paddingVertical:8,borderRadius:8,marginTop:8}}>
                                        <Text style={{color:"#fff"}} >{i18n.t("Delete Account")}</Text>
                                    </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>


                    </Content>

                </ImageBackground>
                {/* <Footer location={"profile"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(Profile)

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