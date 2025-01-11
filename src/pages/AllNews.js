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
import RenderHtml from 'react-native-render-html';
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import SideMenu from './components/sideMenu';


class AllNews extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            news: [],
            language: '',
            showSpinner: true
        };
        this.getLanguage()
    }

    componentDidMount() {
        this.news();
    }
    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    news = async () => {
        this.setState({ showSpinner: true })
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.get(`https://moqc.ae/api/media`,
            {
                headers: { "token": token }
            });

        if (response.status === 200) {
            this.setState({ showSpinner: false })
            this.setState({ news: response.data })
        }
    }


    render() {

        return (
            <Container>
                <ScrollView style={{ flex: 1 }}>
<SideMenu />
                    <ImageBackground
                        source={require('../assets/bg_img.png')}
                        style={{
                            flex: 10
                        }}>
                        <HeaderTop pagename={i18n.t('All NEWS')} navigation={this.props.navigation} back={true} />

                        {this.state.showSpinner ? <ActivityIndicator size="large" color="green" /> :
                            this.state.news.map(item => {
                                return <View style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("NewsDetails", { id: item.id })} style={{ margin: 20 }}>
                                        <Image style={{ height: 200, width: '100%', borderRadius: 20 ,resizeMode:"contain"}} source={{ uri: `https://moqc.ae${item.image_path}` }} />
                                        <Text style={{ fontSize: 10, color: '#D04454', textAlign: 'right', margin: 10,fontFamily:"GESSTwoMedium-Medium",fontWeight:"400"  }}>{i18n.t('Published on')} : {item.published_date}</Text>
                                        <Text style={styles.heading}>{this.state.language == 'en' ? item.title_english : item.title_arabic}</Text>
                                        {/* <RenderHtml
                                source={{html: this.state.language == 'en' ? item.description_arabic : item.description_arabic}}
                            /> */}
                                    </TouchableOpacity>
                                </View>
                            })}


                    </ImageBackground>

                    {/* <Footer location={"profile"} navigation={this.props.navigation}/> */}
                </ScrollView>
            </Container>
        )
    }
}

export default withTranslation()(AllNews)

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
        textAlign: 'center',
        color: '#31314F',
        fontFamily:"GESSTwoMedium-Medium",
        fontWeight:"400" 
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