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
    FlatList,
    ScrollView,
    PermissionsAndroid
} from 'react-native';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, ListItem, CheckBox, SwipeRow } from 'native-base';
import GetLocation from 'react-native-get-location'
import axios from 'axios';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import Swipeout from 'react-native-swipeout';
import i18n from '../i18n';
import Axios from 'axios'
import RNFetchBlob from 'rn-fetch-blob'
import { ActivityIndicator } from 'react-native-paper';


class MediaCards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mediaCards: [],
            show_spinner: true
        };
    }


    componentDidMount() {
        this.getMediaCards()
    }

    getMediaCards = async () => {
        this.setState({ show_spinner: true })
        const response = await axios.get(`https://moqc.ae/api/media_cards`);
        this.setState({ show_spinner: false })
        if (response.status === 200) {
            this.setState({ mediaCards: response.data })
        }
    }

    historyDownload(link, name) {
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
                    `/Card`,
                description: 'link',
                title: 'Card'
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




    render() {
        return (
            <Container>
                <ScrollView>
                    <HeaderTop pagename={i18n.t("Media Cards")} navigation={this.props.navigation} back={false} />
                    <ImageBackground
                        source={require('../assets/bg_img.png')}
                        style={{
                            flex: 10,
                        }}>

                        <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={{ borderColor: '#D5D5D5', borderWidth: 1, borderRadius: 15, padding: 10, height: 120, width: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon active size={20} name='picture-as-pdf' type="MaterialIcons" style={{ color: "#E34752", fontSize: 50 }} />
                                <Text style={{ fontWeight: 'bold', color: '#31314F', fontSize: 16 }}>{i18n.t('PDF')}</Text>
                            </View>
                            <View style={{ borderColor: '#D5D5D5', borderWidth: 1, borderRadius: 15, padding: 10, height: 120, width: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon active size={20} name='image' type="MaterialIcons" style={{ color: "#E34752", fontSize: 50 }} />
                                <Text style={{ fontWeight: 'bold', color: '#31314F', fontSize: 16 }}>{i18n.t('PNG/JPG')}</Text>
                            </View>

                        </View>
                        {this.state.show_spinner ? <ActivityIndicator size='large' /> :

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 20, borderWidth: 1, borderRadius: 20, borderColor: '#D5D5D5' }}>
                                {this.state.mediaCards.map(item => {
                                    return <View style={{ padding: 10 }}>
                                        {item.type == "pdf" ? <Icon onPress={() => this.historyDownload(item.link)} name='file-pdf-o' type="FontAwesome" style={{
                                            color: "red", fontSize: 150, marginB
                                                : 10
                                        }} /> :
                                            <Image style={{ height: 150, width: 160, borderRadius: 10 }} source={{ uri: `https://moqc.ae${item.link}` }} />}

                                    </View>
                                })}
                            </View>
                        }

                    </ImageBackground>
                    {/* <Footer location={"notifications"} navigation={this.props.navigation}/> */}

                </ScrollView>
            </Container>
        )
    }
}

export default withTranslation()(MediaCards)

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    sectionWrapper: {
        padding: 20
    },
    heading: {
        fontSize: 20,
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
    }
});