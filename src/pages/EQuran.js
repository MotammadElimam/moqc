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
    Linking
} from 'react-native';
import API from "../api/";
const Axios = require('axios');

import CheckBox from 'react-native-check-box'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DocumentPicker from "react-native-document-picker";
import { ActivityIndicator, FAB } from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import RNFetchBlob from 'rn-fetch-blob'
import HeaderTop from "./Header";
import YoutubePlayer from "react-native-youtube-iframe";
import i18n from '../i18n';
import { AsyncStorage } from 'react-native';
import Sound from 'react-native-sound';
// import SoundPlayer from 'react-native-sound-player'
// import TrackPlayer from 'react-native-track-player';
Sound.setCategory('Playback');
import Video from 'react-native-video';
import axios from 'axios';
import SideMenu from './components/sideMenu';

class EQuran extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            quranList: [],
            name_en: '',
            name_ar: "",
            attachment: '',
            updateModal: false,
            updateLessonItem: [],
            updatename_en: '',
            updatename_ar: '',
            language: '',
            link: '',
            show_spinner: true,
            showVideoPlayer: false,
            section_id: 2,
            token: ""

        };
        this.getLanguage()
    }

    componentDidMount() {

        this.getQuranList()
        console.log("PROPS", this.props)
    }

    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        let token = await AsyncStorage.getItem("@moqc:token");
        await this.setState({ language: language, token })
    }

    getQuranList = async () => {
        this.setState({ show_spinner: true })
        const response = await axios.get(`https://moqc.ae/api/equran_list`);
        this.setState({ show_spinner: false })
        if (response.status === 200) {
            this.setState({ quranList: response.data })
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

    historyDownload(link, name) {
        this.setState({ showVideoPlayer: false })
        //Function to check the platform
        //If iOS the start downloading
        //If Android then ask for runtime permission
        if (Platform.OS === 'ios') {
            this.downloadFile(link, name);
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
                        this.downloadFile(link, name);
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

    async downloadFile(link, name) {
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
                    name,
                description: 'link',
                title: name
            },
        };
        config(options)
            .fetch('GET', `https://moqc.ae/${link}`)
            .then((res) => {
                //Showing alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
                alert('Download Successfull.');
            });
    }

    async playVideo(link) {

        link = link.replace('https://www.youtube.com/embed/', '')
        await this.setState({ link: link, showVideoPlayer: true })
    }

    async playAudio(link) {
        // try {
        //     // or play from url
        //     console.log(link)
        //     SoundPlayer.playUrl(`https://moqc.ae${link}`)
        // } catch (e) {
        //     console.log(`cannot play the sound file`, e)
        // }
        console.log(link)
        var sound = new Sound(`https://moqc.ae${link}`, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // when loaded successfully
            console.log(sound);
        });
        sound.setVolume(1);


        setTimeout(() => {
            sound.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }, 1000);
        return () => {
            sound.release();
        };
    }

    // start = async (link) => {
    //     // Set up the player
    //     await TrackPlayer.setupPlayer();

    //     // Add a track to the queue
    //     await TrackPlayer.add({
    //         id: 'trackId',
    //         url: require(`https://moqc.ae${link}`),
    //         title: 'Track Title',
    //         artist: 'Track Artist',
    //     });

    //     // Start playing it
    //     // await TrackPlayer.play();
    // };


    renderItem = ({ item }) => (
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', marginHorizontal: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* <View style={{ flex: 1 }}>
                <Text>{item.id}</Text>
            </View> */}
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: "left",fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"  }}>{this.state.language == 'en' ? item.name_en : item.name_ar}</Text>
            </View>

            <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                {item.pdf && <Icon onPress={() => Linking.openURL(`https://moqc.ae/${item.pdf}`) } active size={30} name='picture-as-pdf' type="MaterialIcons" style={{ color: "#31314f", fontSize: 25 }} />}
                {item.audio && <Icon onPress={() => this.playAudio(item.audio)} active size={30} name='mic' type="MaterialIcons" style={{ color: "#579976", fontSize: 25, marginHorizontal: 5 }} />}
                {Boolean(item.video) && <Icon onPress={() => this.playVideo(item.video)} active size={30} name='ondemand-video' type="MaterialIcons" style={{ color: "red", fontSize: 25 }} />}
            </View>
        </View>
    );


    render() {

        return (
            <Container style={{ flex: 1 }}>

                <View style={{ flex: 10 }}>
                    <HeaderTop pagename={i18n.t("EQURAN")} navigation={this.props.navigation} />
                    <ImageBackground
                        source={require('../assets/bg_img.png')}
                        style={{

                            flex: 10,
                        }}>
                    <View style={{ flexDirection: 'row', backgroundColor: "#f6f6f6", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, margin: 10, alignItems: 'center', marginTop: 10 }}>
                        <Pressable onPress={() => this.setState({ section_id: 2 })} style={{ flex: 1, borderRadius: 12, backgroundColor: this.state.section_id == 2 ? "#579976" : "#f6f6f6", padding: 10 }}><Text style={{ textAlign: "center", color: this.state.section_id == 2 ? "#f6f6f6" : "#579976",fontFamily:"GESSTwoMedium-Medium"  }}  >القران الكريم</Text></Pressable>
                        {Boolean( this.state.token) && <Pressable onPress={() => this.setState({ section_id: 1 })} style={{ flex: 1, borderRadius: 12, backgroundColor: this.state.section_id == 1 ? "#579976" : "#f6f6f6", padding: 10 }}>
                            <Text style={{ textAlign: "center", color: this.state.section_id == 1 ? "#f6f6f6" : "#579976",fontFamily:"GESSTwoMedium-Medium",fontWeight:"400" }}>تحفة الاطفال</Text>
                            </Pressable>}
                        </View>
                        {/* <View style={{margin:10}}>
                            <TouchableOpacity onPress={() => this.setState({ createModal: true })}>
                                <Icon active size={20} name='add-circle' type="MaterialIcons" style={{ color: "#579976", fontSize: 40 }} />
                            </TouchableOpacity>
                        </View> */}
                        {/* <View style={{ margin: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                                <View style={{ borderColor: '#D5D5D5', borderWidth: 1, borderRadius: 15, padding: 10, height: 120, width: 100, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon active size={20} name='picture-as-pdf' type="MaterialIcons" style={{ color: "#E34752", fontSize: 50 }} />
                                    <Text style={{ fontWeight: 'bold', color: '#31314F', fontSize: 16 }}>{i18n.t('PDF')}</Text>
                                </View>
                                <View style={{ borderColor: '#D5D5D5', borderWidth: 1, borderRadius: 15, padding: 10, height: 120, width: 100, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon active size={20} name='mic' type="MaterialIcons" style={{ color: "#E34752", fontSize: 50 }} />
                                    <Text style={{ fontWeight: 'bold', color: '#31314F', fontSize: 16 }}>{i18n.t('Audio')}</Text>
                                </View>
                                <View style={{ borderColor: '#D5D5D5', borderWidth: 1, borderRadius: 15, padding: 10, height: 120, width: 100, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon active size={50} name='ondemand-video' type="MaterialIcons" style={{ color: "#E34752", fontSize: 50 }} />
                                    <Text style={{ fontWeight: 'bold', color: '#31314F', fontSize: 16 }}>{i18n.t('Video')}</Text>
                                </View>
                            </View> */}


                        {this.state.showVideoPlayer ?
                            <YoutubePlayer
                                height={300}
                                videoId={this.state.link}
                            /> : null}
                        {/* <Video source={{ uri: `https://moqc.ae/assets/equran/1646391980.mp3` }}
                                ref={(ref) => {
                                    this.player = ref
                                }}
                                onBuffer={() => console.log("buff")}
                                onError={() => console.log("err")}
                                style={styles.backgroundVideo} /> */}

                        {this.state.show_spinner ? <ActivityIndicator size='large' /> :
                            <View style={{ margin: 15, borderWidth: 1, borderRadius: 20, borderColor: '#D5D5D5', minHeight: 430 }}>
                                <FlatList
                                    data={this.state.quranList.filter(item => item.section_id == this.state.section_id)}
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.id}
                                />
                                <View style={{ height: 30 }}></View>
                            </View>
                        }
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
                            transparent={true}
                            visible={this.state.createModal}
                            statusBarTranslucent={true}

                            onRequestClose={() => {
                                this.setState({ createModal: false });
                            }}
                        ><SafeAreaView style={{ flex: 1 }}>

                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.heading}>Upload E-Lessons</Text>
                                        <View style={{ marginVertical: 10 }}>
                                            <Text>English Name</Text>
                                            <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                                value={this.state.name_en}
                                                onChangeText={(e) => this.setState({ name_en: e })}></TextInput>
                                        </View>
                                        <View style={{ marginVertical: 10 }}>
                                            <Text>Arabic Name</Text>
                                            <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                                value={this.state.name_ar}
                                                onChangeText={(e) => this.setState({ name_ar: e })}></TextInput>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <Pressable
                                                onPress={() => this.docPicker()}
                                            >
                                                <Image style={{ height: 100, width: 100 }} source={require('../assets/upload.jpg')} />
                                                <Text style={{ color: '#579976' }}> {'Click to upload'}</Text>
                                            </Pressable>
                                            <Pressable style={{ position: 'absolute', right: 0, bottom: 10 }}>
                                                <Button disabled={!this.state.name_en || !this.state.name_ar || !this.state.attachment} onPress={() => this.uploadAPICall()} style={{ backgroundColor: '#579976', width: '100%', padding: 20, color: '#579976' }}><Text style={{ fontWeight: 'bold', color: '#fff' }}>{'Submit'}</Text></Button>
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
                        ><SafeAreaView style={{ flex: 1 }}>

                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.heading}>Upload E-Lessons</Text>
                                        <View style={{ marginVertical: 10 }}>
                                            <Text>English Name</Text>
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
                                            <Text>Arabic Name</Text>
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
                                                <Image style={{ height: 100, width: 100 }} source={require('../assets/upload.jpg')} />
                                                <Text style={{ color: '#579976' }}> {'Click to upload'}</Text>
                                            </Pressable>
                                            <Pressable style={{ position: 'absolute', right: 0, bottom: 10 }}>
                                                <Button onPress={() => this.updateLessons()} style={{ backgroundColor: '#579976', width: '100%', padding: 20, color: '#579976' }}><Text style={{ fontWeight: 'bold', color: '#fff' }}>{'Submit'}</Text></Button>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View></SafeAreaView>
                        </Modal>


                    </ImageBackground>
                </View>
                <SideMenu />


            </Container>
        )
    }
}
export default EQuran

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
    backgroundVideo: {
        width: 300,
        height: 300
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

    tabItem: {

    }

});