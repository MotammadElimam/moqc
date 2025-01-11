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
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker } from 'native-base';

import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';



import RNFetchBlob from 'rn-fetch-blob'
import Toast from 'react-native-simple-toast';
import i18n from '../i18n';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import axios from 'axios';


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


class TeamPermissions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confpass: '',
            categories: [],
            pageAccess: [],
            permissions: []
        }
        this.getPermissions()
    }

    componentDidMount() {


    }


    getPermissions = async () => {
        this.setState({ show_spinner: true })
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.get(`https://moqc.ae/api/permissions`);
        this.setState({ show_spinner: false })
        if (response.status === 200) {
            this.setState({
                categories: response.data.categories,
                permissions: response.data.permissions
            })
            this.getUserPermission()
        }
    }

    getUserPermission = async () => {
        this.setState({ show_spinner: true })
        var team_id = this.props.route.params.team_id
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.post(`https://moqc.ae/api/profile/${team_id}`, '',
            {
                headers: { "token": token }
            });
        this.setState({ show_spinner: false })
        if (response.status === 200) {
            this.setState({
                pageAccess: response.data.page_access,
            })
            for (let i = 0; i < this.state.permissions.length; i++) {
                let exist = false
                for (let x in this.state.pageAccess) {

                    if (x == this.state.permissions[i].name) {
                        exist = true
                    }
                }
                if (!exist) {
                    this.state.pageAccess[this.state.permissions[i].name] = ['none']
                }
            }
            this.setState({ pageAccess: this.state.pageAccess })

        }
    }

    async updatePermission(name, value) {
        let access = {}
        for (let [x, amount] of Object.entries(this.state.pageAccess)) {
            if (x == name) {
                amount = []
                amount.push(value)
            }
            access[x] = amount
        }
        this.setState({ pageAccess: access })
        await AsyncStorage.setItem("@moqc:page_access", JSON.stringify(access));
    }

    getSelectedValue(permission) {
        for (let [x, amount] of Object.entries(this.state.pageAccess)) {
            if (x == permission.name) {
                return amount?.[0]
            }
        }
    }


    Save = async () => {
        let token = await AsyncStorage.getItem("@moqc:token")
        let body = new FormData()

        var team_id = this.props.route.params.team_id
        body.append("page_access", JSON.stringify(this.state.pageAccess))
        const response = await axios.post(`https://moqc.ae/api/page_access/${team_id}`,
            body,
            {
                headers: { "token": token }
            });
        if (response.status === 200) {
            Toast.showWithGravity('Update Successfull', Toast.SHORT, Toast.CENTER);
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <ImageBackground
                        source={require('../assets/bg_img.png')}
                    >
                        <View style={{ margin: 20,direction:i18n.language=='en'?'ltr':'rtl' }}>
                            {this.state.categories.map(item => {
                                return <View style={{direction:i18n.language=='en'?'ltr':'rtl'}} >
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, }}>{item['name_'+i18n.language]}</Text>
                                    {item.permissions.map(permission => {
                                        return <View style={{  marginBottom:5}}>
                                            <Text >{permission['name_'+i18n.language]}</Text>
                                            <View style={{ borderRadius: 10, padding: 5, borderWidth: 1, width: '100%' }}>
                                                
                                                <Picker
                                                    placeholder={i18n.t("Select One")}
                                                    placeholderStyle={{ color: "#2874F0" }}
                                                    selectedValue={this.getSelectedValue(permission)}
                                                    style={{  }}
                                                    onValueChange={(itemValue, itemIndex) => this.updatePermission(permission.name, itemValue)}
                                                >
                                                    <Picker.Item label={i18n.t("None")} value="none" />
                                                    <Picker.Item label={i18n.t("Write")} value="write" />
                                                    <Picker.Item label={i18n.t("Read")} value="read" />


                                                </Picker>
                                            </View>
                                            {/* <RadioForm
                                                radio_props={data}
                                                initial={2}
                                                formHorizontal={true}
                                                labelHorizontal={true}
                                                buttonColor={'#2196f3'}
                                                animation={true}
                                                onPress={(value) => { this.setState({ value: value }) }}
                                                st
                                            /> */}
                                        </View>
                                    })}
                                </View>
                            })}

                            <Pressable onPress={() => this.Save()} style={{ bottom: 0, alignSelf: 'flex-end' }}><Text style={{ fontWeight: 'bold', fontSize: 16, color: 'green' }}>{i18n.t('Save')}</Text></Pressable>


                        </View>


                    </ImageBackground>
                    {/* <Footer location={"profile"} navigation={this.props.navigation}/> */}
                </View>
            </ScrollView>
        )
    }
}

export default withTranslation()(TeamPermissions)

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