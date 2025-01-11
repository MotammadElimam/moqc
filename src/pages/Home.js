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
    ActivityIndicator,
    Pressable,
    Linking
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content } from 'native-base';
import GetLocation from 'react-native-get-location'
import axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import HeaderTop from "./Header";
import moment from 'moment';
import API from "../api/";
import i18n from '../i18n';
import CountDown from 'react-native-countdown-component';
import Sound from 'react-native-sound';
import SideMenu from './components/sideMenu';
import WebView from 'react-native-webview';


class Home extends React.Component {
    ref=React.createRef()
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            lat: 25.276987,
            lng: 55.296249,
            todayData: [],
            city: "Dubai",
            play: true,
            fajr: null,
            dhuhr: null,
            asr: null,
            maghrib: null,
            isha: null,
            news: [],
            students: "none",
            students_approved: "none",
            students_registered_new: "none",
            students_registered: "none",
            team: "none",
            contact: "none",
            showCount: false,
            quranList: [],
            show_spinner: true,
            countDownSec: 0,
            newsPoss:0,
            home:null,
            activeMessage:"",
            message:"",
            activeSlide:0,
            token:"",
            availability:false
            // arabicDate: new Intl.DateTimeFormat('fr-FR-u-ca-islamicc', { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric' }).format(Date.now())
        };
    this.loadData()
    }

    updateActiveSlide=()=>{
        const next=this.state.activeSlide<this.state.home?.slides.length-1?this.state.activeSlide+1:0
        this.setState({activeSlide:next})
    }

    componentDidMount() {
        this.checkCall();
       axios.get(`https://moqc.ae/api/courses`).then(res=>{
        var availability=res.data.some(i=>i.availability==1)
        this.setState({availability})
       })
        this.interval = setInterval(
            () => this.setState((prevState) => ({ countDownSec: prevState.countDownSec - 1 })),
            1000
        );
    }

    
 async getUser(){
let token=await AsyncStorage.getItem("@moqc:token");
console.log("token",token)
this.setState({token})
 }

    componentDidUpdate() {
        if (this.state.countDownSec === 1) {
            clearInterval(this.interval);
        }
    }
    

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    checkLastLogin = async () => {
        let token = await AsyncStorage.getItem("@moqc:token");
        
        let is_student = await AsyncStorage.getItem("is_student")
        if (token) {
            if (is_student == 0) {
                this.props.navigation.navigate("Home")
            }
            else {
                let class_id = await AsyncStorage.getItem("class_id")
                this.props.navigation.navigate("HomeStudent", { class_id: class_id })
            }
        }
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
    checkCall = async () => {

         this.getGeo();
         this.getAdhanTime();
        
 

    }
    loadData(){
        console.log("dataloaded")
        this.getCityName();
        this.getAllNews();
        this.getUser()
        axios.get("https://moqc.ae/api/home").then((res) => {
         //  console.log(res.data)
            this.setState({home:res.data})
            setInterval(()=>{
                this.updateActiveSlide()
            },5000)
        })
        // this.checkAccess();
        this.checkLastLogin();
        this.getPodcast()
        Geolocation.getCurrentPosition(info => {
            this.setState({lat:info.coords.latitude,lng:info.coords.longitude})
            console.log('cords',info.coords)
            setTimeout(()=>{
                this.getAdhanTime()
            },200)
        })
    }
    getGeo = async () => {
        await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {
                AsyncStorage.setItem('@moqc:lat', JSON.stringify(location.latitude));
                AsyncStorage.setItem('@moqc:lng', JSON.stringify(location.longitude));
                this.setState({
                    lat: location.latitude,
                    lng: location.latitude,
                })
               // this.loadData()

            })
            .catch(error => {
                const { code, message } = error;
             //   this.loadData()
             //   console.warn(code, message);
            })
    }
    getCityName = async () => {
        axios.get('http://ip-api.com/json')
            .then(response => {
             //   console.log(response)
                AsyncStorage.setItem('@moqc:location', JSON.stringify(response.data.city));
                this.setState({
                    city: response.data.city,
                })
            })
            .catch(error => {
              //  console.log(error);
            });
    }

    checkTime = (start, end, isIsha = 0) => {

        var startTime = start + ':00';
        var endTime = end + ':00';
        if (isIsha == 1) {
            currentDate = new Date()
            currentDate.setDate(currentDate.getDate() + 1);
            compDate = new Date();

        } else {
            currentDate = new Date()
            compDate = new Date();
        }
        startDate = new Date(compDate.getTime());
        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);
        startDate.setSeconds(startTime.split(":")[2]);

        endDate = new Date(currentDate.getTime());
        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        endDate.setSeconds(endTime.split(":")[2]);
        return valid = startDate < compDate && endDate > compDate
    }
    getAllNews = () => {
        this.setState({ show_spinner: true })
        axios.get("https://moqc.ae/api/news").then(res=>{
            this.setState({
                news: res.data,
                show_spinner: false
            })
        }).catch(e=>{
          //  console.log(e)
            
        }).finally(()=>{
            this.setState({ show_spinner: false })
        })
       
    }
    getAdhanTime = () => {
        console.log(this.state.lat)
        const apiCallDate = new Date();
        var apiMonth = moment().format('MM') // Month [mm] (1 - 12)
        var apiYear = moment().format("yyyy");
        var apiDate =moment().format("DD")
        // if (apiMonth < 10) {
        //     formatMonth = "0" + apiMonth;
        // } else {
        //     formatMonth = apiMonth;
        // }
        // if (apiDate < 10) {
        //     formatDate = "0" + apiDate;
        // } else {
        //     formatDate = apiDate;
        // }
     //   var ourDate = formatDate + "-" + formatMonth + "-" + apiYear;
       // console.log(ourDate)
       const today=moment()
       console.log(today.format('M'))
    //    axios.get(`https://api-crm.iacad.gov.ae/API/prayertime/getprayerfromlink?month=${today.format('M')}&year=${today.format('YYYY')}&cityid=1`).then(res=>{
    //    console.log(res.data[0]);

    //         const apiData = res.data[0]
    //             var fajr = apiData.fajr
    //             var dhuhr = apiData.dhuhr
    //             var asr = apiData.asr
    //             var maghrib = apiData.maghrib
    //             var isha = apiData.isha
    //             // fajr = fajr.split(" ")[0]
    //             // dhuhr = dhuhr.split(" ")[0]
    //             // asr = asr.split(" ")[0]
    //             // maghrib = maghrib.split(" ")[0]
    //             // isha = isha.split(" ")[0]
    //             var comp = dhuhr
    //             var nextPrayer = null;
                
    //             var showAsr = moment().toDate()< moment(asr).toDate()&& moment().toDate()> moment(dhuhr).toDate()
    //             var showMaghrib = moment().toDate()> moment(asr).toDate()&&moment().toDate()< moment(maghrib).toDate()
    //             var showIsha = moment().toDate()<moment(isha).toDate()&&moment().toDate()>moment(maghrib).toDate()
    //             var showDhur = moment().toDate()< moment(dhuhr).toDate()&&moment().toDate()> moment(fajr).toDate()
    //             var showFajr = moment().toDate()> moment(isha).toDate() ||moment().toDate()< moment(fajr).toDate()
    //             if (showFajr) {
    //                 var comp = fajr
    //                 nextPrayer = "Fajr"

    //             }
    //             if (showDhur) {
    //                 var comp = dhuhr
    //                 nextPrayer = "Dhuhr"
    //             }
    //             if (showAsr) {
    //                 var comp = asr
    //                 nextPrayer = "Asr"

    //             }
    //             if (showMaghrib) {
    //                 var comp = maghrib
    //                 nextPrayer = "Maghrib"

    //             }
    //             if (showIsha) {
    //                 var comp = isha
    //                 nextPrayer = "Isha"

    //             }
    //             var stime = new Date();
    //             var startTime = moment();
    //             var endTime = moment(apiData.nextPrayTime);
    //             var duration = moment.duration(endTime.diff(startTime));
    //             var hours = parseInt(duration.asHours());
    //             var minutes = parseInt(duration.asMinutes()) - hours * 60;
    //             var result = endTime.diff(startTime, 'minutes');
    //             console.log('def',result,startTime.format("MM DD hh:ss"),endTime.format("MM DD hh:ss"),apiData.nextPrayTime)
    //             var resultInSec = result * 60;
    //             resultInSec = Math.abs(resultInSec)
    //           //  console.log("result",result)
    //           console.log('fajr',fajr)
    //             this.setState({
    //                 todayData: [],
    //                 fajr,
    //                 dhuhr,
    //                 asr,
    //                 maghrib,
    //                 isha,
    //                 countDownSec: resultInSec,
    //                 nextPrayer,



    //             })
            
        
    //    })
      
        var getUrl = `https://api.aladhan.com/v1/timings/${moment().format("DD-MM-YYYY")}?latitude=${this.state.lat}&longitude=${this.state.lng}&method=16`;
        console.log("geturl",getUrl)
        axios.get(getUrl)
            .then(response => {
                
               // console.log("praytime",response.data);
                var apiData = response.data.data;
                console.log('fajr',apiData.timings.Fajr)
                console.log(moment().minute(apiData.timings.Fajr.split(":")[1]).hour(apiData.timings.Fajr.split(":")[0]).toISOString())
                    //         const apiData = res.data[0]
                var fajr = moment().minute(apiData.timings.Fajr.split(":")[1]).hour(apiData.timings.Fajr.split(":")[0]).toISOString()
                var dhuhr = moment().minute(apiData.timings.Dhuhr.split(":")[1]).hour(apiData.timings.Dhuhr.split(":")[0]).toISOString()
                var asr = moment().minute(apiData.timings.Asr.split(":")[1]).hour(apiData.timings.Asr.split(":")[0]).toISOString()
                var maghrib = moment().minute(apiData.timings.Maghrib.split(":")[1]).hour(apiData.timings.Maghrib.split(":")[0]).toISOString()
                var isha = moment().minute(apiData.timings.Isha.split(":")[1]).hour(apiData.timings.Isha.split(":")[0]).toISOString()
                // fajr = fajr.split(" ")[0]
                // dhuhr = dhuhr.split(" ")[0]
                // asr = asr.split(" ")[0]
                // maghrib = maghrib.split(" ")[0]
                // isha = isha.split(" ")[0]
                var comp = dhuhr
                var nextPrayer = null;
                let nextpraytime=undefined
                console.log('comp',comp)
                var showAsr = moment().toDate()< moment(asr).toDate()&& moment().toDate()> moment(dhuhr).toDate()
                var showMaghrib = moment().toDate()> moment(asr).toDate()&&moment().toDate()< moment(maghrib).toDate()
                var showIsha = moment().toDate()<moment(isha).toDate()&&moment().toDate()>moment(maghrib).toDate()
                var showDhur = moment().toDate()< moment(dhuhr).toDate()&&moment().toDate()> moment(fajr).toDate()
                var showFajr = moment().toDate()> moment(isha).toDate() ||moment().toDate()< moment(fajr).toDate()
                if (showFajr) {
                    var comp = fajr
                    nextPrayer = "Fajr"
                    

                }
                if (showDhur) {
                    var comp = dhuhr
                    nextPrayer = "Dhuhr"
                }
                if (showAsr) {
                    var comp = asr
                    nextPrayer = "Asr"

                }
                if (showMaghrib) {
                    var comp = maghrib
                    nextPrayer = "Maghrib"

                }
                if (showIsha) {
                    var comp = isha
                    nextPrayer = "Isha"

                }
                console.log('comp',comp)
                var stime = new Date();
                var startTime = moment();
                var endTime = moment(comp);
               
                var duration = moment.duration(endTime.diff(startTime));
                var hours = parseInt(duration.asHours());
                var minutes = parseInt(duration.asMinutes()) - hours * 60;
                var result = endTime.diff(startTime, 'minutes');
                console.log('def',result,startTime.format("MM DD hh:ss"),endTime.format("MM DD hh:ss"),apiData.nextPrayTime)
                var resultInSec = result * 60;
                resultInSec = Math.abs(resultInSec)
              //  console.log("result",result)
              console.log('fajr',fajr)
                this.setState({
                    todayData: [],
                    fajr,
                    dhuhr,
                    asr,
                    maghrib,
                    isha,
                    countDownSec: resultInSec,
                    nextPrayer,

                })
                console.log('nextPrayer',nextPrayer)
                // for (var i = 0; i < response.data.data.length; i++) {

                //     if (apiData[i].date.gregorian.date == ourDate) {
                //         var fajr = apiData[i].timings.Fajr
                //         var dhuhr = apiData[i].timings.Dhuhr
                //         var asr = apiData[i].timings.Asr
                //         var maghrib = apiData[i].timings.Maghrib
                //         var isha = apiData[i].timings.Isha
                //         fajr = fajr.split(" ")[0]
                //         dhuhr = dhuhr.split(" ")[0]
                //         asr = asr.split(" ")[0]
                //         maghrib = maghrib.split(" ")[0]
                //         isha = isha.split(" ")[0]
                //         var comp = dhuhr
                //         var nextPrayer = null;
                //         var showDhur = this.checkTime(fajr, dhuhr)
                //         var showAsr = this.checkTime(dhuhr, asr)
                //         var showMaghrib = this.checkTime(asr, maghrib)
                //         var showIsha = this.checkTime(maghrib, isha)
                //         var showFajr = this.checkTime(isha, fajr, 1)
                //         if (showFajr) {
                //             var comp = fajr
                //             nextPrayer = "Fajr"

                //         }
                //         if (showDhur) {
                //             var comp = dhuhr
                //             nextPrayer = "Dhuhr"
                //         }
                //         if (showAsr) {
                //             var comp = asr
                //             nextPrayer = "Asr"

                //         }
                //         if (showMaghrib) {
                //             var comp = maghrib
                //             nextPrayer = "Maghrib"

                //         }
                //         if (showIsha) {
                //             var comp = isha
                //             nextPrayer = "Isha"

                //         }
                //         var stime = new Date();
                //         var startTime = moment(stime, "HH:mm:ss a");
                //         var endTime = moment(comp, "HH:mm");
                //         var duration = moment.duration(endTime.diff(startTime));
                //         var hours = parseInt(duration.asHours());
                //         var minutes = parseInt(duration.asMinutes()) - hours * 60;
                //         var result = endTime.diff(startTime, 'minutes');
                //         var resultInSec = result * 60;
                //         resultInSec = Math.abs(resultInSec)
                //       //  console.log("result",result)
                //         this.setState({
                //             todayData: apiData[i],
                //             fajr,
                //             dhuhr,
                //             asr,
                //             maghrib,
                //             isha,
                //             countDownSec: resultInSec,
                //             nextPrayer,



                //         })
                //     }
                // }

            })
            .catch(error => {
                console.log('time error',error.response?.data,error);
            });


    }
    scrollView
    scrollListToStart(contentWidth, contentHeight) {
        if (i18n.isRTL) {
            this.scrollView.scrollTo({x: contentWidth});
        }
    }
    componentDidMount() {
        this.load_data();
        // this.registerForPushNotificationsAsync(); this._notificationSubscription =
        // Notifications.addListener(this._handleNotification);
    }

    renderMessage=(activeMessage)=>{
      //  console.log('message',activeMessage,this.state.message)
       
        switch(activeMessage){
            case "vision":
                this.setState({message:this.state.home?.missionvisionmessage?.[`vision_message_${i18n.language=="en"?"english":"arabic"}`],activeMessage},)
                return 
            case "mission":
                this.setState({message:this.state.home?.missionvisionmessage?.[`mission_message_${i18n.language=="en"?"english":"arabic"}`],activeMessage})
                return 
            case "quran":
                this.setState({message:this.state.home?.quran_education_msg?.[`quran_education_message_${i18n.language=="en"?"english":"arabic"}`],activeMessage})
                return 
            case "strategy":
                this.setState({message:this.state.home?.strategic_objective_msg?.['strategic_objective_message_arabic'],activeMessage})
                return 
            default:
                
                return 
        }
       
    }
    getDay = () => {
        var d = new Date();
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var n = weekday[d.getDay()];
        return n;
    }
    getTime = () => {

    }
    getMonth = () => {
        var d = new Date();
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        var n = month[d.getMonth()];
        return n;
    }
    load_data = async () => {
        let lang = await AsyncStorage.getItem("@moqc:language");
        if (lang == null || lang == "null") {
            i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')
                .then(() => {
                    I18nManager.forceRTL(i18n.language === 'ar');
                    RNRestart.Restart();
                });
            return;
        }
    }

    getPodcast = async () => {
        const response = await axios.get(`https://radio.moqc.ae/api/artists`);
        if (response.status === 200) {
            var list = response.data
            for (let i = 0; i < list.length; i++) {
                list[i].image = "https://radio.moqc.ae/storage" + JSON.parse(list[i].avatar).path
            }
            await this.setState({ quranList: list })
        }
    }

    async playAudio(link) {

        var sound = new Sound(`https://moqc.ae/${link}`, null, (error) => {
            if (error) {
             //   console.log('failed to load the sound', error);
                return;
            }
            // when loaded successfully
         //   console.log(sound);
        });
        sound.setVolume(1);

        setTimeout(() => {
            sound.play((success) => {
                if (success) {
                 //   console.log('successfully finished playing');
                    sound.release();
                } else {
                   // console.log('playback failed due to audio decoding errors');
                }
            });
        }, 1000);



    }

    // stopAudio(item) {
    //     if (sound) {
    //         sound.stop(() => {
    //             console.log("Stopped ")
    //         })
    //     }
    // }

    renderItem = ({ item }) => (
        <View style={{ margin: 10, marginVertical: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 40, marginHorizontal: 5, borderWidth: 1, borderColor: '#D8CFBE', height: 80, padding: 10, flexDirection: 'row' }}>
            <Image style={{ height: 70, width: 70, marginHorizontal: 5, borderRadius: 50, borderColor: '#D8CFBE', borderWidth: 3 }} source={{ uri: item.image }} />
            <Text style={{ color: '#31314F', width: 150, fontWeight: '100' }}>{item.firstname} {item.lastname}</Text>
            <Icon onPress={() => this.props.navigation.navigate("Radio")} active size={30} name='play-circle-fill' type="MaterialIcons" style={{ color: "#D8CFBE", fontSize: 35 }} />
            {/* <Icon onPress={() => this.stopAudio(item.audio)} active size={30} name='stop-circle' type="MaterialCommunityIcons" style={{ color: "#D8CFBE", fontSize: 35 }} /> */}
        </View>
    );

    render() {
        const { t, i18n } = this.props;
        
        // const d=new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {day: 'numeric', month: 'long',weekday: 'long',year : 'numeric'}).format(Date.now())
        // console.log("ddddd",d)
        return (
            <Container style={{ flex: 1 ,fontFamily:"GESSTwoMedium-Medium", }}>
               
                <HeaderTop pagename={i18n.t("Home")} navigation={this.props.navigation} back={false} />
                <ImageBackground
                    // source={require('../assets/bg_img.png')}
                    style={{
                        flex: 1,
                    }}>
                    <ScrollView style={{flex:1}}>
                       
                   
                  
                            <Image 
                           
                            source={{uri:`https://moqc.ae${this.state.home?.slides?.[this.state.activeSlide]?.path}`}} 
                            
                            style={{width:Dimensions.get("window").width,height:Dimensions.get("window").width*5/16}}  />
                            <View style={{minHeight:35,backgroundColor:"#fff0" }}>
                                
                                <WebView originWhitelist={['*']}
                                style={{fontFamily:"GESSTwoMedium-Medium",}}
                                source={{html:`<header>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <link href="https://db.onlinewebfonts.com/c/02f502e5eefeb353e5f83fc5045348dc?family=GE+SS+Two+Light" rel="stylesheet"> 
                                <style>
                                body{
                                    font-family: "GE SS Two Light";
                                    direction:ltr;
                                    text-aligh:right;
                                }
                                marquee{
                                    font-size:13px;
                                    background:#fff0;
                                    fontFamily:'GE SS Two Medium';
                                    font-weight:'bold';text-align:right;
                                }
                                @media only screen and (min-device-width: 468px) {
                                    /* Styles for iPad Portrait Mode */
                                    marquee{
                                        font-size:15px;
                                    }
                                }
                                
                               
                                
                                </style>
                                </header/><marquee direction="right" scrollamount="5"
                                
                                >${this.state?.home?.slider_message?.[0]?.[`message_${i18n.language=='en'?'english':'arabic'}`]}
                       </marquee>`}}
                                  />
                                 
                            </View>
                            <View style={{padding:10}}>
                            <Image source={{uri:"https://moqc.ae/assets/images/divider.png"}} style={{width:"100%",height:1}} />
                            </View>
                            <ImageBackground
                            source={ require('../assets/header.png')}
                            style={{
                                height: 300,
                                position: 'relative',
                                marginBottom:16
                                
                            }}>
                            <View style={{ marginTop: 15,width:"100%", flexDirection: "row", justifyContent: "center",alignItems:"center" }}>
                               

                                <View style={{ padding: 15,fontFamily:"GESSTwoMedium-Medium" , textAlign: 'center', backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: "#E85C5D" }}>
                                    <Text style={{textAlign:"center",fontFamily:"GESSTwoMedium-Medium" }}>
                                        {i18n.t(this.getDay().toLocaleUpperCase())}
                                    </Text>
                                    <Text style={{ fontWeight: "100", textAlign: "center",fontFamily:"GESSTwoMedium-Medium"  }}>{new Date().getDate()}</Text>
                                    <Text style={{ color: '#E85C5D', textAlign: "center",fontFamily:"GESSTwoMedium-Medium"  }}>
                                        {i18n.t(this.getMonth().toLocaleUpperCase())}
                                    </Text>
                                    <Text style={{ textAlign: "center" ,fontFamily:"GESSTwoMedium-Medium" }}>{new Intl.DateTimeFormat(i18n.language+'-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long' }).format(Date.now())}</Text>
                                    <Text style={{ fontWeight: '100', textAlign: "center",fontFamily:"GESSTwoMedium-Medium"  }}>{new Intl.DateTimeFormat(i18n.language+'-TN-u-ca-islamic', { year: 'numeric' }).format(Date.now())}</Text>

                                </View>
                                <View style={{  alignItems: 'baseline',paddingHorizontal:20 }}>
                                <Text style={{  fontWeight: "100", fontSize: 12,fontFamily:"GESSTwoMedium-Medium"  }}>
                                    <Image style={{ height: 20, width: 20 }} source={require("../assets/compass_b.png")} />{i18n.t(this.state.city.toLocaleUpperCase())} - {new Date().getFullYear()}
                                </Text>
                                <View style={{alignItems:"flex-start"}}>
                                    <Text style={{ marginVertical: 10, fontSize: 12, fontWeight: "400",fontFamily:"GESSTwoMedium-Medium" }}>
                                        {i18n.t('Remaining Time for')}  {i18n.t(this.state.nextPrayer)}
                                    </Text>
                                  
                                    {this.state.countDownSec ?
                                        <CountDown
                                            until={this.state.countDownSec}
                                            onFinish={() => console.log('finsh')}
                                            onPress={() => console.log('hello')}
                                            size={16}
                                           timeLabelStyle={{color:"#000",fontSize:15,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100" }}
                                            timeLabels={ {d: i18n.t("Day"), h: i18n.t("Hour"), m:i18n.t("Minute"), s: i18n.t("Second")} }
                                            digitStyle={{ backgroundColor: '#a18c63',fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"  }}
                                            digitTxtStyle={{ color: '#fff' }}

                                        />
                                        : <Text></Text>}
                                </View>
                                </View>

                                



                            </View>
                          
                           {Boolean(this.state.fajr)&& <View style={{ zIndex: 10, justifyContent: "center",alignSelf:"center", alignItems: "center", flexDirection: "row", margin: 10}}>
                               
                                    <View  style={{ marginVertical: 10, backgroundColor: "white", padding: 3, borderRadius: 20, marginRight: 3, marginLeft: 3 }}>
                                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#F1F0EB", borderRadius: 20, paddingHorizontal: 5 ,paddingVertical:10}}>
                                            <Text style={styles.prayTime}>
                                                {i18n.t('FAJR')}
                                            </Text>
                                            <Image
                                                source={require('../assets/fajr.png')}
                                                style={{
                                                    height: 50,
                                                    width: 50,
                                                    marginRight: 0,
                                                    marginLeft: 0
                                                }} />
                                            <Text style={styles.prayTime}>
                                                {this.state.fajr?moment(this.state.fajr).format("HH:mm"):""}
                                            </Text>
                                            <Text style={styles.prayTime}>
                                            {i18n.t('AM')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ marginVertical: 10, backgroundColor: "white", padding: 3, borderRadius: 20, marginRight: 3, marginLeft: 3 }}>
                                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#F1E2B9", borderRadius: 20, paddingHorizontal: 5 ,paddingVertical:10}}>
                                            <Text style={styles.prayTime}>
                                                {i18n.t('DHUHR')}
                                            </Text>
                                            <Image
                                                source={require('../assets/asar.png')}
                                                style={{
                                                    height: 50,
                                                    width: 50,
                                                    marginRight: 0,
                                                    marginLeft: 0
                                                }} />
                                            <Text style={styles.prayTime}>
                                                {moment(this.state.dhuhr).format("HH:mm")}
                                            </Text>
                                            <Text style={styles.prayTime}>
                                                {i18n.t('PM')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ marginVertical: 10, backgroundColor: "white", padding: 3, borderRadius: 20, marginRight: 3, marginLeft: 3 }}>
                                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#C4C6DF", borderRadius: 20, paddingHorizontal: 5 ,paddingVertical:10}}>
                                            <Text style={styles.prayTime}>
                                                {i18n.t('ASR')}
                                            </Text>
                                            <Image
                                                source={require('../assets/duhr.png')}
                                                style={{
                                                    height: 50,
                                                    width: 50,
                                                    marginRight: 0,
                                                    marginLeft: 0
                                                }} />
                                            <Text style={styles.prayTime}>
                                                {moment(this.state.asr).format("HH:mm")}
                                            </Text>
                                            <Text style={styles.prayTime}>
                                                {i18n.t('PM')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ marginVertical: 10, backgroundColor: "white", padding: 3, borderRadius: 20, marginRight: 3, marginLeft: 3 }}>
                                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#C8DACE", borderRadius: 20, paddingHorizontal: 5 ,paddingVertical:10}}>
                                            <Text style={styles.prayTime}>
                                                {i18n.t("MAGHRIB")}
                                            </Text>
                                            <Image
                                                source={require('../assets/magrib.png')}
                                                style={{
                                                    height: 50,
                                                    width: 50,
                                                    marginRight: 0,
                                                    marginLeft: 0
                                                }} />
                                            <Text style={styles.prayTime}>
                                                {moment(this.state.maghrib).format("HH:mm")}
                                            </Text>
                                            <Text style={styles.prayTime}>
                                                {i18n.t('PM')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ marginVertical: 10, backgroundColor: "white", padding: 3, borderRadius: 20, marginRight: 3, marginLeft: 3 }}>
                                        <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#FACBC1", borderRadius: 20, paddingHorizontal: 5 ,paddingVertical:10}}>
                                            <Text style={styles.prayTime}>
                                                {i18n.t('ISHA')}
                                            </Text>
                                            <Image
                                                source={require('../assets/esha.png')}
                                                style={{
                                                    height: 50,
                                                    width: 50,
                                                    marginRight: 0,
                                                    marginLeft: 0
                                                }} />
                                            <Text style={{ fontWeight: "400", fontSize: 14 }}>
                                               {moment(this.state.isha).format("HH:mm")}
                                            </Text>
                                            <Text style={styles.prayTime}>
                                                {i18n.t('PM')}
                                            </Text>
                                        </View>
                                    </View>

                              
                            </View>}
                        </ImageBackground>

                        {/* <View style={{
                            justifyContent:"center",
                            alignItems:"center",
                            marginTop:10
                        }}>
                            <Image
                                source={require('../assets/center_news.png')}
                                style={{
                                height:30,
                                width:width-130,
                                marginRight: 15,
                                marginLeft: 15
                            }}/>
                        </View> */}


                        <View style={{ zIndex: 11, margin: 5,gap:10, position: "relative" }}>
                            {Boolean(!this.state.token&&this.state.availability)&&<Pressable  onPress={() => this.props.navigation.push("Signup")} style={{backgroundColor:"#31314F" ,paddingVertical:10,borderRadius:12,marginBottom:12}} >
                            <Text style={{fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"}}>
                                <Text
                                   
                                    style={{
                                        color: '#fff',
                                        textAlign:"center",
                                        fontWeight: "bold",fontFamily:"GESSTwoMedium-Medium"
                                    }}>
                                    {i18n.t('Apply For Moqc Courses')}</Text>
                            </Text>
                            </Pressable>}
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Text style={styles.heading}>{i18n.t('MOQC Center News')}</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("AllNews")}
                                    style={{ alignItems: 'center', padding: 5, width: 120, justfyContent: 'center', backgroundColor: "#31314F", borderRadius: 10, borderWidth: 1, textAlign: 'center', borderColor: '#31314f' }}>
                                    <Text style={{ color: '#ffff', fontWeight: '400',fontFamily:"GESSTwoMedium-Medium"  }}>{i18n.t('Read More')}</Text>
                                </TouchableOpacity>
                            </View>
                          {this.state.newsPoss?  <Button style={{width:40,height:40,borderRadius:40,position:"absolute",top:"50%",zIndex:10,backgroundColor:"#b2b1b6"}} onPress={()=>{
                                       // console.log(this.scrollView)
                                       this.scrollView.scrollTo({x:this.state.newsPoss-200})
                                    }}>
                                         <Icon style={{ fontSize: 14,color:"#000" }} type="AntDesign" name={i18n.language==='en'?"left":"right"} />
                                    </Button>:<Text></Text>}
                                     <Button style={{width:40,height:40,borderRadius:40,position:"absolute",top:"50%",end:0,zIndex:10,backgroundColor:"#b2b1b6"}} onPress={()=>{
                                       // console.log(this.scrollView)
                                       this.scrollView.scrollTo({x:this.state.newsPoss+200})
                                    }}>
                                         <Icon style={{ fontSize: 14,color:"#000" }} type="AntDesign" name={i18n.language=='en'?"right":"left"} />
                                    </Button>
                            {this.state.show_spinner ? <ActivityIndicator size="large" /> :
                                <ScrollView onScroll={(event)=>{
                                   this.setState({newsPoss: event.nativeEvent.contentOffset.x})
                               //    console.log(event.nativeEvent.contentOffset.x)
                                }} showsHorizontalScrollIndicator={true} ref={ref=>this.scrollView=ref}  horizontal={true}>
                                  
                                    {this.state?.news?.map((n,index) => {
                                            return <TouchableOpacity key={index} elevation={5} onPress={() => this.props.navigation.navigate("NewsDetails", { id: n.id })}
                                                style={{
                                                    elevation: 10,
                                                    borderWidth: 1,
                                                    
                                                    borderColor: '#C4C6DF',
                                                    borderRadius: 30,
                                                    backgroundColor: "white",
                                                    padding: 10,
                                                    margin: 10,
                                                    marginVertical: 10,
                                                    justifyContent: "center", alignItems: "center"
                                                }}
                                            >

                                                <View style={{ width: 190, height: 130, }}>
                                                    <Image
                                                        source={{ uri: 'https://moqc.ae' + n.image_path }}
                                                        style={{
                                                            height: 100,
                                                            width: 190,
                                                            borderRadius:10,
                                                            resizeMode: "cover",
                                                        }} />
                                                </View>
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    <Text numberOfLines={1} style={{ width: 160, overflow:"hidden",fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"  }}>
                                                        {i18n.language=='en'? n.title_english:n.title_arabic}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                        )
                                    }



                                </ScrollView>
                            }


                            {/* <View style={{flex:1,justifyContent:"center",alignItems:"center",marginTop:15}}>                             
                                        <Button 
                                            style={{
                                                elevation: 1,
                                                
                                                borderColor: "#fff",
                                                borderRadius: 10,
                                                backgroundColor: "white",
                                                padding: 5,
                                                borderBottomColor:"black",
                                                height:35
                                            }}
                                            >
                                            <Text style={{fontWeight:"400"}}>
                                                Read more
                                            </Text>
                                        </Button>

                              </View> */}


                        </View>
                        {this.state.home&&<View style={{flex:5}}>
                            {/* <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-between"}}>
                              
                                <Pressable onPress={()=>{
                               this.renderMessage("vision")
                            }}>
                                    <Image source={{uri:`https://moqc.ae/${this.state.home?.missionvision?.['vision_slide_'+i18n.language]}`}} style={{height:120,width:80,opacity:this.state.activeMessage==="vision"?1:0.5}}  />
                                </Pressable>
                                <Pressable onPress={()=>{this.renderMessage("mission")}}>
                                    <Image source={{uri:`https://moqc.ae/${this.state.home?.missionvision?.['mission_slide_'+i18n.language]}`}} style={{height:120,width:80,opacity:this.state.activeMessage==="mission"?1:0.5}}  />
                                </Pressable>
                                <Pressable onPress={()=>{this.renderMessage("strategy")}}>
                                    <Image source={{uri:`https://moqc.ae/${this.state.home?.strategic_objective_img?.['strategic_objective_slide_'+i18n.language]}`}} style={{height:120,width:80,opacity:this.state.activeMessage==="strategy"?1:0.5}} />
                                </Pressable>
                                <Pressable onPress={()=>{this.renderMessage("quran")}}>
                                    <Image source={{uri:`https://moqc.ae/${this.state.home?.quran_education_img?.['quran_education_slide_'+i18n.language]}`}} style={{height:120,width:80,opacity:this.state.activeMessage==="quran"?1:0.7}}  />
                                </Pressable>

                            </View> */}
                           
                            <View style={{textAlign:"right",direction:"rtl",margin:0,paddingBottom:150}}> 
                           
                            <WebView
                           containerStyle={{textAlign:"right",margin:10,marginTop:-30,direction:"rtl",fontSize:16,borderWidth:0,borderRadius:12,padding:5,borderColor:"#eeeeee",height:400,maxWidth:"100%"}}
        originWhitelist={['*']}
        source={{uri:"https://moqc.ae/website/vision"}}
        // source={{ html:`<html>
        // <header>
        // <link href="https://db.onlinewebfonts.com/c/02f502e5eefeb353e5f83fc5045348dc?family=GE+SS+Two+Light" rel="stylesheet"> 
        // <style>
        // body{
        //     font-family: "GE SS Two Light";
        // }
        // </style>
        // </header/>
        // <body>
        // <div style="text-align:right;diection:rtl !important;font-size:22">
        // <style>ul{direction:rtl; font-size:22;} p,li,strong{font-size:32px !important;font-weight:400;} </style>
        //  ${this.state.message} </div>
        //  </body>
        //  </html>
        //  ` }}
      />

     
                            </View>
                            </View>}


                        {/* <View style={{ margin: 20, flexDirection: "row", justifyContent: "space-evenly", marginTop: 10, position: 'relative' }}>
                            {
                                this.state.team == 'write' ?
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Team")}>
                                        <Image
                                            source={require('../assets/team.png')}
                                            style={{
                                                height: 130,
                                                width: 130,
                                                resizeMode: "contain"
                                            }} />
                                    </TouchableOpacity>
                                    : null
                            }

                            {
                                this.state.students == 'write' || this.state.students_approved == 'write' || this.state.students_registered == 'write' || this.state.students_registered_new == 'write' ?
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Dashboard")}>
                                        <Image
                                            source={require('../assets/student.png')}
                                            style={{
                                                height: 130,
                                                width: 130,
                                                resizeMode: "contain"
                                            }} />
                                    </TouchableOpacity>
                                    : null
                            }

                            {
                                this.state.contact == 'write' ?
                                    <TouchableOpacity>
                                        <Image
                                            source={require('../assets/contactus.png')}
                                            style={{
                                                height: 130,
                                                width: 130,
                                                resizeMode: "contain"
                                            }} />
                                    </TouchableOpacity>
                                    : null
                            }
                        </View> */}

                        {/* <View style={{ margin: 10 }}>
                            <Text style={styles.heading}>{i18n.t('Recent Podcasts')}</Text>
                            {this.state.show_spinner ? <ActivityIndicator size="large" /> :
                                <FlatList
                                    horizontal
                                    data={this.state.quranList}
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.id}
                                />
                            }
                        </View> */}
                         
                       
                       
                        
                    </ScrollView>
                  
                </ImageBackground>
                {/* <Footer location={"home"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(Home)

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    sectionWrapper: {
        padding: 20
    },
    prayTime:{  fontSize: 14,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100" },
    heading: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'left',
        color: "#31314f",fontFamily:"GESSTwoMedium-Medium" ,fontWeight:"100"
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