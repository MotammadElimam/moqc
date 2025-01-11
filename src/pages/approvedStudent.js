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
    Alert,
    Modal,
    Pressable,Linking, TouchableHighlight
} from 'react-native';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import { Container, Header, Left, Body, Right, Button, Title, Content, Item, Input, Picker, Form, Spinner, Textarea, CheckBox } from 'native-base';
import GetLocation from 'react-native-get-location'
import axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import API from "../api";
var FormData = require('form-data');
import { WebView } from 'react-native-webview';
import i18n from '../i18n';
import Video from 'react-native-video';


const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class approvedStudent extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selected: "4",
            students: "none",
            students_approved: "none",
            students_registered_new: "none",
            students_registered: "none",
            team: "none",
            contact: "none",
            students: null,
            profile_pic: "https://moqc.ae/assets/admin/users/default.jpg",
            gender: null,
            country: null,
            student_data: [],
            modal: false,
            url_data: "",
            show: true,
            showId:false,
            showReject:false,
            rejected_reason:"",
            change_rejection:[],
            reasoins:["name","nationality","Date of birth","Gender","Qualification","Contact number","Country","email","Memorized Juz'","course"]
        };


    }
    acceptStudent = async () => {
        let user = await AsyncStorage.getItem("@moqc:current_user");
        await API.approveStudents(user)
            .then(resp => {
               
                Alert.alert(
                    "Success",
                    "Student Approved",
                    [
                        {
                            text: "OK", onPress: () => {
                                this.props.navigation.goBack();
                            }

                        }
                    ],
                    { cancelable: false }
                );

            })
    }

    async reject(){

        var res=await axios.post("https://moqc.ae/api/rejectStudentForCustomerService/"+this.state.students.id,{message:this.state.rejected_reason,rejected_fields:this.state.change_rejection})

        Alert.alert(
            "Success",
            "Student Rejected",
            [
                {
                    text: "OK", onPress: () => {
                        this.props.navigation.goBack();
                    }

                }
            ],
            { cancelable: false }
        );
        
    }
    
    componentDidMount() {
        console.log(this.props.route)
        this.load_data();
        this.getStudents();


    }
    getStudents = async () => {
        let user = await AsyncStorage.getItem("@moqc:current_user");
        let show = await AsyncStorage.getItem("showButton");
        this.setState({ showBut: show })
        await API.getStudents(user)
            .then(resp => {
                

                var student_data = [];
              /*  resp.student_data.map((m) => {
                    student_data.push(m)
                    if (m.name == "profilepicture") {
                        this.setState({
                            profile_pic: m.value
                        })
                    }

                })
                */
             this.setState({
                    students: resp,
                   
                })
                

            })

    }
    updateIframe = (val) => {
        this.setState({
            url_data: val,
            modal: true
        })

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

    render() {
        console.log("https://moqc.ae/"+this.state.students?.voice_clip)
        return (
            <Container style={{ flex: 10 }}>
                <HeaderTop pagename={"Dashboard"} navigation={this.props.navigation} back={true} />
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10
                    }}>
                    {/* <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 26 }}>Students Detail</Text>
                    </View> */}
                    <Content>
                        <View
                            style={{
                                shadowColor: "#31314f",
                                shadowOffset: {
                                    width: -10,
                                    height: 5
                                },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                borderRadius: 40,
                                margin: 20

                            }}>
                            <View
                                style={{
                                    elevation: 1,

                                    borderColor: "#D5D5D5",
                                    borderRadius: 10,
                                    backgroundColor: "white",
                                    padding: 1,
                                    borderBottomColor: "black",

                                }}
                            >
                                {/* <View style={{ textAlign: 'center', justifyContent: "center", alignItems: "center", alignContent: "center" }}>

                                    <Image
                                        source={{ uri: this.state.profile_pic }}
                                        style={{
                                            height: 100,
                                            width: 100,
                                            borderRadius: 100,
                                            borderWidth: 1, marginVertical: 10,
                                        }} />
                                </View> */}

                               {this.state.students? <View style={{ justifyContent: 'space-between', margin: 20 }}>
                               
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                            <Text style={{ fontWeight: "bold" }}>{i18n.t('Name')}:</Text>
                                            <Text style={{ fontWeight: "normal" }}>{this.state.students?.first_name}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Nationality')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{i18n.language=="en"? this.state.students?.nationality.country_name: this.state.students?.nationality.country_name_ar}</Text>
                                    </View>
                                    
                                    
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Date of Birth')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{this.state.students?.dob}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Gender')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{ this.state.students?.gender==1?i18n.t("Male"):i18n.t("Female")}</Text>

                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Qualification')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{ this.state.students?.qualification['name_'+i18n.language]}</Text>
                                    </View>

                                    
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Contact')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{this.state.students?.contact_phone}</Text>

                                    </View>
                                    
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Country')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{i18n.language=="en"? this.state.students?.country.country_name: this.state.students?.country.country_name_ar}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Email')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{this.state.students?.email}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Job')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{ this.state.students?.job['name_'+i18n.language]}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Where did you find us')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{ this.state.students?.location['name_'+i18n.language]}</Text>
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t("Memorized Juz'")}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{ this.state.students?.memorized}</Text>
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Course')}:</Text>
                                        <Text style={{ fontWeight: "normal" }}>{ this.state.students?.course['course_name_'+i18n.language]}</Text>
                                    </View>


                                    
                                    <View style={{ marginTop: 20, }}>
                                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{i18n.t('Documents')}</Text>
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{this.state.students?.country.id==230? i18n.t('Emirates ID'):i18n.t('Passport')}:</Text>
                                       <TouchableOpacity onPress={async()=>{
                                        this.setState({showId:true})
                                       }}>
                                     <Image source={require("../assets/eye.png")} style={{width:25,height:25}} />
                                       </TouchableOpacity>
                                    </View>
                                    <Modal visible={this.state.showId} >
                                    <SafeAreaView style={{flex:1}}>
                                        <View style={{flexDirection:"row",justifyContent:"space-between",padding:10}}>
                                         <Text style={{ fontWeight: "bold" }}>{this.state.students?.country.id==230? i18n.t('Emirates ID'):i18n.t('Passport')}</Text> 
                                        <TouchableHighlight onPress={()=>this.setState({showId:false})} style={{backgroundColor:"#fff",padding:2}}>
                                        <Text>{i18n.t('Close')}</Text></TouchableHighlight>
                                       
                                        </View>

                                        <View style={{padding:20,justifyContent:"center"}}>
                                           
                                            <Image 
                                            style={{height:300,resizeMode:"contain"}}
                                            source={{uri:this.state.students?.country.id==230? "https://moqc.ae/"+this.state.students?.emirates_id:"https://moqc.ae/"+this.state.students?.passport}} />
                                        </View></SafeAreaView>
                                    </Modal>

                                    <Modal visible={this.state.showReject} ><SafeAreaView style={{flex:1}}>
                                        <View style={{flexDirection:"row",justifyContent:"space-between",padding:10}}>
                                         <Text style={{ fontWeight: "bold" }}>{this.state.students?.country.id==230? i18n.t('Reject student'):i18n.t('Passport')}</Text> 
                                        <TouchableHighlight onPress={()=>this.setState({showReject:false})} style={{backgroundColor:"#fff",padding:2}}>
                                        <Text>{i18n.t('Close')}</Text></TouchableHighlight>
                                       
                                        </View>

                                        <View style={{padding:20}}>
                                            <Text>{i18n.t("Student message")} </Text>
                                            <Textarea onChangeText={(value)=>this.setState({rejected_reason:value})} style={{borderWidth:1,borderRadius:5,marginTop:5,marginBottom:15}}  ></Textarea>
                                            <ScrollView >
                                                {this.state.reasoins.map((item,index)=>{
                                                return    <View key={index} style={{flexDirection:"row",marginBottom:10}}>
                                                        <CheckBox checked={this.state.change_rejection.includes(item)} onPress={()=>{
                                                            console.log(item)
                                                            if(this.state.change_rejection.includes(item))
                                                            {
                                                                this.state.change_rejection.splice(this.state.change_rejection.indexOf(item),1)
                                                                this.setState({change_rejection:this.state.change_rejection})
                                                            }
                                                            else{
                                                                this.state.change_rejection.push(item)
                                                            }
                                                            this.setState({change_rejection:this.state.change_rejection})
                                                            }} ></CheckBox>
                                                        <Text style={{marginHorizontal:20}}>{item}</Text>
                                                    </View>
                                                })}
                                            </ScrollView>
                                            {this.state.rejected_reason&&this.state.change_rejection.length!=0?<TouchableHighlight onPress={()=>this.reject()}>
                                                <View style={{borderRadius:15,backgroundColor:"#eb445a",width:"100%",padding:15}}>
                                                    <Text style={{textAlign:"center",color:"#fff"}}>{i18n.t('Reject')} </Text>
                                                </View>
                                            </TouchableHighlight>
                                            :<View></View>}
                                            
                                           
                                        </View></SafeAreaView>
                                    </Modal>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{this.state.students?.country.id==230? i18n.t('Emirates Expiry'):i18n.t('Passport Expiry')}:</Text>
                                        
                                       <Text style={{ fontWeight: "normal" }}>{ this.state.students?.country.id==230?this.state.students?.expiry_date:this.state.students?.passport_expiry}</Text>
                                    </View>
                                    <View style={{ justifyContent: "center", marginVertical: 5 }}>
                                        <Text style={{ fontWeight: "bold" }}>{i18n.t('Audio')}:</Text>
                                       {this.state.students? <Video  paused  style={{backgroundColor:"#eee",flex:1,height:90}} resizeMode={"cover"}
    volume={1.0}
    rate={1.0}  controls={true} source={{uri: 'https://moqc.ae/'+this.state.students?.voice_clip}}   // Can be a URL or a local file.
       ref={(ref) => {
         this.player = ref
       }}                                      // Store reference
       /> :<View></View>}
                                    </View>
                                    <View style={{ marginVertical: 2 }}>
                                        {/* this.state.student_data.map((m, i) => {
                                            if (m.name !== "profilepicture") {
                                                return (
                                                    <TouchableOpacity style={{ marginVertical: 2, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#D5D5D5' }}
                                                        onPress={() => { this.updateIframe(m.value) }} key={i}>
                                                        <Text>{m.title}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        }) */}
                                    </View>

                                    {this.state.showBut != "false" ?
                                        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                            <TouchableOpacity style={{ backgroundColor: "green", borderRadius: 10, padding: 10 }} onPress={() => { this.acceptStudent() }}>
                                                <Text style={{ color: '#fff' }}>
                                                    {i18n.t('Approve')}
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ backgroundColor: "red", borderRadius: 10, padding: 10 }} onPress={() => { this.setState({showReject:true})}}>
                                                <Text style={{ color: '#fff' }}>
                                                    {i18n.t('Reject')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        : null}



                                </View>:<View style={{flex:1,justifyContent:"center"}}><Spinner/></View>}
                            </View>
                        </View>
                    </Content>
                </ImageBackground>
                {/* <Footer location={"dashboard"} navigation={this.props.navigation} /> */}
                <Modal
                    visible={this.state.modal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        this.setState({ modal: false });
                    }}
                ><SafeAreaView style={{flex:1}}>
                    <View style={{ backgroundColor: '#D5D5D5', padding: 10, height: '100%', borderRadius: 10 }}>

                        <WebView
                            source={{
                                uri: this.state.url_data
                            }}

                        />
                        <Pressable onPress={() => this.setState({ modal: false })} style={{ padding: 10, backgroundColor: "red" }}>
                            <Text style={{ color: '#fff', justifyContent: "center", textAlign: 'center', }}>{i18n.t('Close')}</Text>

                        </Pressable>



                    </View></SafeAreaView>
                </Modal>

            </Container>
        )
    }
}

export default approvedStudent

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