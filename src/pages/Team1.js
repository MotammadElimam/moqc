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
    FlatList,
    ActivityIndicator
} from 'react-native';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Switch, Input, ListItem, Form, Picker } from 'native-base';
import GetLocation from 'react-native-get-location'
import axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import Swipeout from 'react-native-swipeout';
import ImagePicker from "react-native-customized-image-picker";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import i18n from '../i18n';
import DocumentPicker from "react-native-document-picker";
import Axios from 'axios'

var swipeoutBtns = [
    {
        text: 'Button'
    }
]


const data = [
    {
        label: 'Write',
        value: 'write'
    },
    {
        label: 'Read',
        value: 'read'
    },
    {
        label: 'None',
        value: 'none'

    }
];

class Team1 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            lat: 25.3268748,
            lng: 55.3852859,
            todayData: [],
            city: "Dubai",
            play: true,
            selected: "4",
            team: [],
            modal: false,
            selected_img: null,
            image_base64: null,
            show_spinner: true,
            newMemberPic: require("../assets/team_img.png"),
            username: '',
            first_name: "",
            last_name: '',
            email: '',
            password: ''
        };
        this.getAllTeam();

    }
    selectImage = async () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            includeBase64: true,

        }).then(image => {
            this.setState({
                selected_img: image[0].path,
                image_base64: image[0].data,
            })
        });
    }
    getAllTeam = async () => {
        this.setState({ show_spinner: true })
        let token = await AsyncStorage.getItem("@moqc:token")
        await axios.get('https://moqc.ae/api/team/members',
            { headers: { "token": token } })
            .then(response => {
                this.setState({
                    team: response.data,
                    show_spinner: false
                })
            })
            .catch(error => {
                console.log(error);
            });
    }
    componentDidMount() {
        // this.registerForPushNotificationsAsync(); this._notificationSubscription =
        // Notifications.addListener(this._handleNotification);
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
            this.setState({ newMemberPic: res[0] })


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

    addTeam = async () => {
        let token = await AsyncStorage.getItem("@moqc:token")
        let body = new FormData()
        body.append("username", this.state.username)
        body.append("first_name", this.state.firstname)
        body.append("last_name", this.state.lastname)
        body.append("email", this.state.email)
        body.append("profile_picture", this.state.newMemberPic)
        body.append("password", this.state.password)

        const response = await axios.post(`https://moqc.ae/api/addTeamMemeber`,
            body,
            {
                headers: { "token": token }
            });
        if (response.status === 200) {
            this.setState({ showSpinner: false })

        }
    }

    renderItem = ({ item }) => (
        <View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("TeamView1", { team_id: item.id })}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#D5D5D5', padding: 10, margin: 10 }}>
             
                <View>
                    <Text>    {item.username}</Text>
                    <Text style={{overflow:"hidden"}}>   {item.first_name + ' ' + item.last_name}</Text>
                    <Text style={{overflow:"hidden"}}>    {item.email}</Text>
                </View>
                <View>
                    <Text style={{ padding: 10, color: '#ffff', backgroundColor: '#222643', fontWeight: 'bold', borderRadius: 10 }}>{i18n.t('View')}</Text>
                </View>
            </TouchableOpacity>
        </View>

    );


    render() {
        const { t, i18n } = this.props;
        console.log(this.state.selected)
        return (
            <Container style={{ flex: 10 }}>
                {/* <HeaderTop pagename={"Team"} navigation={this.props.navigation} back={true} /> */}
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        width: '100%',
                        height: '100%',
                        flex: 10
                    }}>
                    <View style={{ margin: 10 }}>
                        <TouchableOpacity onPress={() => this.setState({ modal: true })}>
                            <Icon active size={20} name='add-circle' type="MaterialIcons" style={{ color: "#579976", fontSize: 40 }} />
                        </TouchableOpacity>
                    </View>

                    {this.state.show_spinner ? <ActivityIndicator size='large' /> :
                        <ScrollView>

                            <FlatList
                                data={this.state.team}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id}
                            />

                        </ScrollView>}

                </ImageBackground>
                {/* <Footer location={"home"} navigation={this.props.navigation} /> */}


                <Modal
                    onRequestClose={() => {
                        this.setState({ modal: false });
                    }}
                    visible={this.state.modal}><SafeAreaView style={{flex:1}}>
                    <View style={{ flex: 1, backgroundColor: "white", borderRadius: 20, padding: 10 }}>
                        <Content>
                            <View style={{ flex: 10 }}>
                                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", marginVertical: 10 }}>
                                    <Image
                                        source={require("../assets/team_add.png")}
                                        style={{
                                            height: 30,
                                            width: 30,
                                            resizeMode: "cover"
                                        }} />
                                    <Text style={{ fontWeight: "bold" }}> {i18n.t('Add New Member')}</Text>
                                </View>

                                <View >
                                    <Pressable onPress={() => { this.docPicker() }}>
                                        <Image
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                alignSelf: 'center',
                                                height: 120,
                                                width: 100,
                                                resizeMode: "contain"
                                            }}
                                            source={this.state.newMemberPic} />
                                    </Pressable>
                                </View>

                                <View style={{ margin: 20 }}>
                                    <View style={{ marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Username')}</Text>
                                        <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                            onChangeText={(e) => {
                                                this.setState({ username: e })
                                            }}></TextInput>
                                    </View>
                                    <View style={{ marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('First Name')}</Text>

                                        <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                            onChangeText={(e) => {
                                                this.setState({ firstname: e })
                                            }}></TextInput>
                                    </View>
                                    <View style={{ marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Last Name')}</Text>

                                        <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                            onChangeText={(e) => {
                                                this.setState({ lastname: e })
                                            }}></TextInput>
                                    </View>

                                    <View style={{ marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Email')}</Text>

                                        <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                            onChangeText={(e) => {
                                                this.setState({ email: e })
                                            }}></TextInput>

                                    </View>
                                    <View style={{ marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Password')}</Text>

                                        <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                            onChangeText={(e) => {
                                                this.setState({ password: e })
                                            }}></TextInput>
                                    </View>
                                </View>

                            </View>
                            <View style={{ justifyContent: "flex-end", flexDirection: "row", alignItems: "flex-end", alignContent: "flex-end" }}>
                                <Pressable style={{ marginHorizontal: 10 }} onPress={() => this.addTeam()}>
                                    <Text style={{ fontSize: 18, color: 'green' }}>
                                        Add
                                    </Text>

                                </Pressable>
                                <Pressable onPress={() => this.setState({ modal: false })}>
                                    <Text style={{ fontSize: 18, color: 'green' }}>
                                        Cancel
                                    </Text>

                                </Pressable>
                            </View>
                        </Content>
                    </View></SafeAreaView>
                </Modal >
            </Container >
        )
    }
}

export default withTranslation()(Team1)

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
    }
});