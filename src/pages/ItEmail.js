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

import CheckBox from 'react-native-check-box'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { AsyncStorage } from 'react-native';
import i18n from '../i18n';
import HeaderTop from './Header'
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';


class Email extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            emails: [],
            email: '',
            password: '',
            createModal: false,
            updateid: '',
            updatename: "",
            updatepassword: "",
            updateModal: false,
            show_spinner: true
        };
    }

    componentDidMount() {
        this.getEmailDetails()
    }

    getEmailDetails = async () => {
        this.setState({ show_spinner: true })
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.get(`https://moqc.ae/api/microsoft_emails`, {
            headers: { "token": token }
        });
        this.setState({ show_spinner: false })
        if (response.status === 200) {
            this.setState({ emails: response.data })
        }
    }

    async createEmail() {
        this.setState({ show_spinner: true })
        let token = await AsyncStorage.getItem("@moqc:token")
        var body = new FormData()
        body.append("email", this.state.email)
        body.append("password", this.state.password)
        const response = await axios.post(`https://moqc.ae/api/microsoft_email_create`, body,
            {
                headers: { "token": token }
            });

        if (response.status === 200) {
            this.setState({ createModal: false, show_spinner: false })
            this.getEmailDetails()
        }
    }

    async updateEmails() {
        this.setState({ show_spinner: true })
        let token = await AsyncStorage.getItem("@moqc:token")
        var body = new FormData()
        body.append("email", this.state.updatename)
        body.append("password", this.state.updatepassword)
        const response = await axios.post(`https://moqc.ae/api/microsoft_email_update/${this.state.updateid}`, body,
            {
                headers: { "token": token }
            });
        if (response.status === 200) {
            this.setState({ updateModal: false, show_spinner: false })
            this.getEmailDetails()
        }
    }

    async updateEmail(emails) {
        this.setState({
            updateModal: true, updateClassItem: emails, updatename: emails.email,
            updatepassword: emails.password, updateid: emails.id
        })
    }

    async deleteEmail(id) {
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.delete(`https://moqc.ae/api/microsoft_email_delete/${id}`,
            {
                headers: { "token": token }
            });
        if (response.status === 200) {
            this.getEmailDetails()
        }
    }

    renderItem = ({ item }) => (
        <View
            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
                <Text>{item.email}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text>{item?.password}</Text>
            </View>
            <View style={{ width: '20%', flexDirection: 'row' }}>
                <Icon onPress={() => this.deleteEmail(item.id)} active size={20} name='trash-can-outline' type="MaterialCommunityIcons" style={{ color: "red", marginHorizontal: 5, fontSize: 20 }} />
                <Icon onPress={() => this.updateEmail(item)} active size={20} name='edit' type="MaterialIcons" style={{ color: "#579976", marginHorizontal: 5, fontSize: 20 }} />
            </View>
        </View>
    );

    render() {
        return (
            <View style={{ flex: 10 }}>
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    <HeaderTop pagename={i18n.t("Email")} navigation={this.props.navigation} back={true} />

                    <View style={{ margin: 10 }}>
                        <TouchableOpacity onPress={() => this.setState({ createModal: true })}>
                            <Icon active size={20} name='add-circle' type="MaterialIcons" style={{ color: "#579976", fontSize: 40 }} />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity onPress={() => this.setState({ createModal: true })} style={{ display: 'none', flexDirection: 'row', marginVertical: 10 }}>
                        <Icon active size={20} name='add' type="MaterialIcons" style={{ fontSize: 20 }} />
                        <Text style={{ fontSize: 15 }}>Create New Classes</Text>
                    </TouchableOpacity> */}

                    <View
                        style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Email')}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Password')}</Text>
                        </View>

                        <View style={{ width: '20%', flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Action')}</Text>
                        </View>
                    </View>
                    {this.state.show_spinner ? <ActivityIndicator size="large" color='green'/> :
                        <FlatList
                            data={this.state.emails}
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
                                <Text style={styles.heading}>Create new MailId</Text>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Email Id')}</Text>
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.email}
                                        onChangeText={(e) => this.setState({ email: e })}></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Password')}</Text>
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.password}
                                        onChangeText={(e) => this.setState({ password: e })}></TextInput>
                                </View>


                                <View style={{ flexDirection: 'row', bottom: 20, margin: 20, marginBottom: 10, position: 'absolute', right: 0 }}>
                                    <Pressable>
                                        <Button disabled={!this.state.email || !this.state.password} onPress={() => this.createEmail()} style={{ backgroundColor: '#579976', width: '100%', padding: 20, color: '#579976' }}><Text style={{ fontWeight: 'bold', color: '#fff' }}>{i18n.t('Submit')}</Text></Button>
                                    </Pressable>
                                    <Pressable style={{marginHorizontal:10}}>
                                        <Button onPress={() => this.setState({createModal:false})} style={{ backgroundColor: '#579976', width: '100%', padding: 20, color: '#579976' }}><Text style={{ fontWeight: 'bold', color: '#fff' }}>{i18n.t('Cancel')}</Text></Button>
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
                                <Text style={styles.heading}>{i18n.t('Update MailId')}</Text>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Email Id')}</Text>
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updatename}
                                        onChangeText={(e) => {
                                            var clas = this.state.updateClassItem
                                            clas.email = e
                                            this.setState({ updateClassItem: clas, updatename: e })
                                        }}
                                    ></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Password')}</Text>
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updatepassword}
                                        onChangeText={(e) => {
                                            var clas = this.state.updateClassItem
                                            clas.password = e
                                            this.setState({ updateClassItem: clas, updatepassword: e })
                                        }}></TextInput>
                                </View>

                                <View style={{ flexDirection: 'row', bottom: 20, margin: 20, marginBottom: 10, position: 'absolute', right: 0 }}>
                                    <Pressable disabled={!this.state.updatename || !this.state.updatepassword} onPress={() => this.updateEmails()}>
                                        <Text style={{ color: 'green', fontSize: 16, marginHorizontal: 10 }}>{i18n.t('Update')}</Text>
                                    </Pressable>
                                    <Pressable onPress={() => this.setState({updateModal:false})}>
                                        <Text style={{ color: 'green', fontSize: 16, marginHorizontal: 10 }}>{i18n.t('Cancel')}</Text>
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
export default Email

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