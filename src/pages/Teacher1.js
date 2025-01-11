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
    ActivityIndicator,
    Modal,
    TouchableHighlight
} from 'react-native';
import { Backdrop } from "react-native-backdrop";
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
import MyTabs from './Tab';
import open from '../store'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class Teacher1 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: "4",
            students: [],
            students_approved: "none",
            students_registered_new: "none",
            students_registered: "none",
            team: "none",
            contact: "none",
            students: [],
            searchText: '',
            show_spinner: true ,
            student:null,
            show:false,
            showId:false
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

    navigatePage = async (id) => {
        await AsyncStorage.setItem("@moqc:current_user_teacher", id);
        this.props.navigation.navigate("StudentsTeacher");
    }


    getStudents = async () => {
        this.setState({ show_spinner: true })
        var students = [];
     var token=   await AsyncStorage.getItem("@moqc:token");
     console.log(token)
     axios.get("https://moqc.ae/api/students",{headers:{token:token}})
     .then(res=>{
        this.setState({students:res.data,show_spinner:false})
     })
     .catch(e=>console.log(e))
        // await API.teacherStudents()
        //     .then(resp => {
        //         this.setState({ show_spinner: false })
        //         resp.map((m) => {
        //             students.push(m);
        //         })
        //     })

        // await this.setState({
        //     students
        // })
       
    }

    
    load_data = async () => {
        let lang = await AsyncStorage.getItem("@moqc:language");
        console.log("this is happenging", lang);
        if (lang == null || lang == "null") {

            // i18n     .changeLanguage(i18n.language === 'ar'     ? 'en'     : 'ar')
            // .then(() => {         I18nManager.forceRTL(i18n.language === 'ar');
            // RNRestart.Restart();     });
            return;
        }
    }

    async onSearch(e) {

        await this.setState({ searchText: e })
        // var searchArray = this.state.students
        // searchArray = searchArray.filter(item =>
        //     item.first_name.toLowerCase().indexOf(this.state.searchText) > -1
        // )
        // this.setState({ students: searchArray })

    }

    render() {
        const { t, i18n } = this.props;
        return (
            <Container style={{ flex: 10 }}>
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                        margin: 10
                    }}>
                    {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Students List</Text>
                    </View> */}

                    <View style={styles.input}>
                        <Icon active size={20} name='search' type="MaterialIcons" style={{ left: 0, fontSize: 20, padding: 6, borderRadius: 30 }} />
                        <TextInput
                            onChangeText={(text) => { this.onSearch(text) }}
                            placeholder={t('Search')}
                        />
                    </View>

                    {this.state.show_spinner ? <ActivityIndicator size="large" color="green" /> :
                        <Content>
                            <View style={{   }}>

                                {
                                    typeof (this.state.students) !== 'string' ?
                                        this.state.students.filter(item => item.first_name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) > -1).map((m, i) => {
                                            return <TouchableOpacity
                                                key={i}
                                                onPress={() =>{
                                                    this.setState({show:true,student:m})
                                                   //  this.navigatePage(m.id)
                                                    }}
                                            >

                                                <View style={{ flex:1, borderWidth: 1, borderRadius: 20, margin: 5, backgroundColor: "white", borderColor: "#CFDED5" }}>
                                                <View style={{width:'100%',height:20,paddingHorizontal:10, backgroundColor: '#C8DACE', borderTopEndRadius: 20, borderTopStartRadius: 20 }}></View>
                                                    
                                                    <View style={{  paddingHorizontal:10,paddingVertical:5}}>
                              
                                                    <View style={{}}>
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontWeight: "bold" }} numberOfLines={1} ellipsizeMode='tail'> {m.first_name}</Text>
                                                        </View>
                                                        {/* <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontWeight: "bold" }} numberOfLines={1} ellipsizeMode='tail'>{i18n.t('Gender')}: {m.gender.gender_en}</Text>
                                                        </View> */}
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontWeight: "bold" }} numberOfLines={1} ellipsizeMode='tail'>{m.student_email}</Text>
                                                        </View>
                                                    </View>
                                                    </View>
                                                </View>

                                            </TouchableOpacity>
                                            
                                        }

                                        ) : null
                                }

                                            <Modal visible={this.state.show} ><SafeAreaView style={{flex:1}}>

                                                <View style={{flex:1,paddingHorizontal:15}}>
                                                    <Pressable onPress={()=>this.setState({show:false})}>
                                                        <Image source={require("../assets/cancel.png")} style={{width:30,height:30}} />
                                                    </Pressable>
                                                    <ScrollView>
                                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                            <Text style={{ fontWeight: "bold" }}>{i18n.t('Name')}:</Text>
                                            <Text style={{ fontWeight: "normal" }}>{this.state.student?.first_name}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Nationality')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{i18n.language=="en"? this.state.student?.nationality.country_name: this.state.student?.nationality.country_name_ar}</Text>
                                    </View>
                                    
                                    
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Date of Birth')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{this.state.student?.dob}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Gender')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{ this.state.student?.gender==1?i18n.t("Male"):i18n.t("Female")}</Text>

                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Qualification')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{this.state.student?.qualification? this.state.student?.qualification['name_'+i18n.language]:''}</Text>
                                    </View>

                                    
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Contact')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{this.state.student?.contact_phone}</Text>

                                    </View>
                                    
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Country')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{i18n.language=="en"? this.state.student?.country.country_name: this.state.student?.country.country_name_ar}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Email')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{this.state.student?.student_email}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Job')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{ this.state.student?.job? this.state.student?.job['name_'+i18n.language]:''}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Where did you find us')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{this.state.student?.location? this.state.student?.location['name_'+i18n.language]:''}</Text>
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t("Memorized Juz'")}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{ this.state.student?.memorized}</Text>
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Course')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{ this.state.student?.course['course_name_'+i18n.language]}</Text>
                                    </View>


                                    
                                    <View style={{ marginTop: 20, }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{i18n.t('Documents')}</Text>
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{this.state.student?.country.id==230? i18n.t('Emirates ID'):i18n.t('Passport')}:</Text>
                                       <Text>{}</Text>
                                    </View>
                                    <View style={{padding:20,justifyContent:"center"}}>
                                           
                                            <Image 
                                            style={{height:300,resizeMode:"contain"}}
                                            source={{uri:this.state.student?.country.id==230? "https://moqc.ae/"+this.state.student?.emirates_id:"https://moqc.ae/"+this.state.student?.passport}} />
                                        </View>
                                    

                                                    </ScrollView>
                                                </View>
                                                </SafeAreaView>
                                            </Modal>
                            </View>
                        </Content>}


                    {/* <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ padding: 5 }}>
                            Showing 1-{this.state.students.length}
                        </Text>
                        <View style={{ flexDirection: "row", borderWidth: 1, borderRadius: 8, height: 30 }}>
                            <TouchableOpacity>
                                <Text style={{ padding: 5 }}>Previous</Text>
                            </TouchableOpacity>
                            <Text style={{ width: 20, textAlign: "center", backgroundColor: "#CFDED5", padding: 5 }}>
                                1
                            </Text>
                            <TouchableOpacity style={{ padding: 5 }}>
                                <Text>Next</Text>
                            </TouchableOpacity>
                        </View>

                    </View> */}

                </ImageBackground>
                {/* <Footer location={"dashboard"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(Teacher1)

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
        margin: 12,
        borderWidth: 1,
        width: '90%',
        borderRadius: 10,
        flexDirection: 'row',
        borderColor: '#000'
    },
});