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
    ActivityIndicator
} from 'react-native';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import GetLocation from 'react-native-get-location'
import axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import API from "../api/";


const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class Support extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: "4",
            students_approved: "none",
            students_registered_new: "none",
            students_registered: "none",
            team: "none",
            contact: "none",
            students: [],
            show_spinner: true,
            searchText: '',
            per_page: 10,
            page: 1,
            pages: 1,
            from: 1,
            to: 10
        };

        this.checkAccess();
        this.load_data();
        this.getStudents();

    }
    checkAccess = async () => {
        let access = await AsyncStorage.getItem("@moqc:page_access");
        access = JSON.parse(access);
        await this.setState({
            students: access.students[0],
            students_approved: access.students_approved[0],
            students_registered_new: access.students_registered_new[0],
            students_registered: access.students_registered[0],
            team: access.team[0],
            contact: access.contact[0],
        })
    }

    navigatePage = async (student) => {
        await AsyncStorage.setItem("@moqc:current_user", student.id);
        await AsyncStorage.setItem("showButton", "true");
        this.props.navigation.navigate("StudentsSupport",{student});

    }

    componentWillUnmount() {
    }

    componentDidMount() {

        // this.registerForPushNotificationsAsync(); this._notificationSubscription =
        // Notifications.addListener(this._handleNotification);
    }
    getStudents = async () => {
        let token = await AsyncStorage.getItem("@moqc:token")
        await axios.get(`https://moqc.ae/api/get_register_students?stage=0&page=${this.state.page}&per_page=${this.state.per_page}&name=${this.state.searchText}`,
            { headers: { "token": token } })
            .then(response => {
              
                
                this.setState({
                    students: response.data.data,
                    pages: response.data.total_results,
                    from: response.data.from,
                    to: response.data.to,
                    show_spinner: false
                })
                
            })
            .catch(error => {
                console.log(error.response);
            });

       
        // var students = [];
        // await API.students()
        //     .then(resp => {
        //         this.setState({ show_spinner: false })
        //         resp.map((m) => {
        //             students.push(m);
        //         })
        //     })
        // this.setState({
        //     students
        // })
    }
    load_data = async () => {
        let lang = await AsyncStorage.getItem("@moqc:language");
      
        if (lang == null || lang == "null") {

            // i18n     .changeLanguage(i18n.language === 'ar'     ? 'en'     : 'ar')
            // .then(() => {         I18nManager.forceRTL(i18n.language === 'ar');
            // RNRestart.Restart();     });
            return;
        }
    }

    async onSearch(e) {
        var searchArray = this.state.students
        await this.setState({ searchText: e })

        searchArray = searchArray.filter(item =>
            item.first_name.toLowerCase().indexOf(this.state.searchText) > -1
        )
        this.setState({ students: searchArray })

    }

    render() {
        const { t, i18n } = this.props;
        return (
            <Container style={{ flex: 10 }}>
                <HeaderTop pagename={"C.S Dashboard"} navigation={this.props.navigation} back={true} />
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        margin: 10,
                        flex: 10
                    }}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: '#549A78', fontWeight: "bold", fontSize: 20 }}>{i18n.t("Students List")}</Text>
                    </View>

                    <View style={styles.input}>
                        <Icon active size={20} name='search' type="MaterialIcons" style={{ left: 0, fontSize: 20, padding: 6, borderRadius: 30 }} />
                        <TextInput
                            onChangeText={(text) => { this.setState({ searchText: text }); this.getStudents() }}
                            placeholder='Search'
                        />
                    </View>


                    {this.state.show_spinner ? <ActivityIndicator size="large" style={{flex:1}} /> :
                        <Content>
                            <View style={{ }}>

                                {
                                    
                                        this.state.students.map((m, i) => {
                                            return <TouchableOpacity
                                                key={i}
                                                onPress={() => this.navigatePage(m)}

                                            >
                                                <View style={{ elevation: 1, margin:5}}>


                                                    <View style={{  borderWidth: 1, borderRadius: 20, margin: 5, backgroundColor: "white", borderColor: "#CFDED5" }}>
                                                        <View style={{ height: 20, backgroundColor: '#C8DACE', borderTopEndRadius: 20, borderTopStartRadius: 20 }}></View>
                                                        <View style={{paddingHorizontal:15,paddingVertical:10}}>
                                                    
                                                            <View style={{  paddingHorizontal:3}}>
                                                                <View style={{ flexDirection: "row" }}>
                                                                    <Text style={{ fontWeight: "bold" }} numberOfLines={1} ellipsizeMode='tail'> {m.first_name}  {m.last_name}</Text>
                                                                </View>
                                                                <View style={{ flexDirection: "row" }}>
                                                                    <Text style={{ fontWeight: "bold" }} numberOfLines={1} ellipsizeMode='tail'> {m.gender==1?i18n.t("Male"):i18n.t("Female")}</Text>
                                                                </View>
                                                                <View style={{ flexDirection: "row" }}>
                                                                    <Text style={{ fontWeight: "bold" }} numberOfLines={1} ellipsizeMode='tail'> {m.email}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        }

                                        ) 
                                }
                            </View>
                        </Content>}
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ padding: 5 }}>
                            {t("Showing")} {this.state.from}-{this.state.to}
                        </Text>
                        <View style={{ flexDirection: "row", borderWidth: 1, borderRadius: 8, height: 30 }}>
                            <TouchableOpacity disabled={this.state.page <= 1} onPress={() => { this.setState({ page: this.state.page - 1 }); this.getStudents() }}>
                                <Text style={{ padding: 5 }}>{i18n.t('Previous')}</Text>
                            </TouchableOpacity>
                            <Text style={{ width: 20, textAlign: "center", backgroundColor: "#CFDED5", padding: 5 }}>
                                {this.state.page}
                            </Text>
                            <TouchableOpacity disabled={this.state.page >= this.state.pages} style={{ padding: 5 }} onPress={() => { this.setState({ page: this.state.page + 1 }); this.getStudents() }}>
                                <Text>{i18n.t('Next')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
                {/* <Footer location={"dashboard"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(Support)

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
    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        width: '90%',
        borderRadius: 10,
        flexDirection: 'row',
        borderColor: '#000'
    },
});