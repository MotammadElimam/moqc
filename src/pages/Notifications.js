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
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, ListItem, CheckBox, SwipeRow, Spinner } from 'native-base';
import GetLocation from 'react-native-get-location'
import axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import Swipeout from 'react-native-swipeout';

var swipeoutBtns = [
    {
        text: 'Button'
    }
]


const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class Notifications extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            lat: 25.3268748,
            lng: 55.3852859,
            todayData: [],
            city: "Dubai",
            play: true,
            notifications:[],
            selected_items:[],
            loading:true
        };
      //  this.checkCall();
      //  this.getCityName();
      this.getNotifications()

    }
    checkCall = async () => {
        await this.getGeo();
        await this.getAdhanTime();
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

                console.log(location);
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    }

   async getNotifications(){
       // this.setState({loading:true})
        let token = await AsyncStorage.getItem("@moqc:token")
         axios.get(`https://moqc.ae/api/notifications`,
            {
                headers: { "token": token }
            }).then(res=>{
                console.log(res.data)
                this.setState({loading:false,notifications:res.data})
            }).catch(err=>{
                console.log('notification',err)
            });
    }

    async delete(id){
        // this.setState({loading:true})
         let token = await AsyncStorage.getItem("@moqc:token")
          axios.delete(`https://moqc.ae/api/notification_delete/${id}`,
             {
                 headers: { "token": token }
             }).then(res=>{
                 console.log(res.data)
                this.getNotifications()
             }).catch(err=>{
                 console.log('notification',err)
             });
     }
    getCityName = async () => {
        axios.get('http://ip-api.com/json')
            .then(response => {
                this.setState({
                    city: response.data.city,
                })
            })
            .catch(error => {
                console.log(error);
            });
    }
    getAdhanTime = () => {
        const apiCallDate = new Date();
        var apiMonth = apiCallDate.getMonth() + 1; // Month [mm] (1 - 12)
        var apiYear = apiCallDate.getFullYear();
        var apiDate = apiCallDate.getDate();
        if (apiMonth < 10) {
            formatMonth = "0" + apiMonth;
        } else {
            formatMonth = apiMonth;
        }
        if (apiDate < 10) {
            formatDate = "0" + apiDate;
        } else {
            formatDate = apiDate;
        }
        var ourDate = formatDate + "-" + formatMonth + "-" + apiYear;

        var getUrl = 'https://api.aladhan.com/v1/calendar?latitude=' + this.state.lat + '&longitude=' + this.state.lng + '&method=8&month=' + apiMonth + '&year=' + apiYear;
        console.log(getUrl);
        axios.get(getUrl)
            .then(response => {
                // console.log('getting data from axios', response.data.data);
                var apiData = response.data.data;
                for (var i = 0; i < response.data.data.length; i++) {

                    if (apiData[i].date.gregorian.date == ourDate) {
                        this.setState({
                            todayData: apiData[i],

                        })
                    }
                }

            })
            .catch(error => {
                console.log(error);
            });

    }
    componentDidMount() {
        this.load_data();
        // this.registerForPushNotificationsAsync(); this._notificationSubscription =
        // Notifications.addListener(this._handleNotification);
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
        console.log("this is happenging", lang);
        if (lang == null || lang == "null") {

            // i18n     .changeLanguage(i18n.language === 'ar'     ? 'en'     : 'ar')
            // .then(() => {         I18nManager.forceRTL(i18n.language === 'ar');
            // RNRestart.Restart();     });
            return;
        }
    }

    render() {
        const { t, i18n } = this.props;
        return (
            <Container style={{ flex: 10 }}>
                <HeaderTop pagename={"Notifications"} navigation={this.props.navigation} back={false} />
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                        margin: 20
                    }}>
                  
                    {/* <View style={{justifyContent:"center",alignItems:"center",marginTop:20,flexDirection:"row"}}>
                            <Text style={{fontWeight:"bold",fontSize:14}}>Search</Text>
                            <View style={{
                                borderWidth:1,
                                borderColor:"grey",
                                flexDirection:"row",
                                justifyContent: 'center',
                                alignItems:"center",
                                borderRadius:5,
                                width:width-100,
                                height:35,
                                marginLeft:5,
                                marginRight:5
                                }}>
                                <Input placeholder=''/>
                                <Icon active name='search' type="MaterialIcons" style={{fontSize:16,backgroundColor:"#EBE2CA",color:"#BEA051",padding:6,textAlign:"center",justifyContent:"center",borderRadius:30}}/>
                            </View>
                        </View> */}

                    <View
                        style={{
                            paddingHorizontal: 10,
                            justifyContent: "center", alignItems: "center"
                        }}
                    >
                        <ScrollView horizontal={false}>
                            {this.notifications?.length&&!this.state.loading?this.state.notifications.map((item,index)=><ListItem ref={index} style={{borderColor: "white" ,}}>
                                <CheckBox checked={false} color="#BEA051" style={{ borderRadius: 3 }} />
                                <Body>
                                    <SwipeRow onLeftAction={()=>{
                                       this.delete(item.id)
                                    }}
                                        rightOpenValue={-75}
                                        right={
                                            <Button danger onPress={() => alert("Trash")}>
                                                <Icon active name="trash" />
                                            </Button>
                                        }
                                        body={
                                            <View style={{ paddingLeft: 20 }}>
                                                <Text>{item.notification_text} </Text>
                                            </View>
                                        }
                                    />
                                </Body>
                            </ListItem>):<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                                <Icon active name="notifications" type="MaterialIcons" style={{fontSize:180}} />
                                <Text>{i18n.t("No notifications yet")} </Text>
                                </View>}
                         
                        </ScrollView>
                    </View>
                    <View>
                        {/* <Swipeout right={swipeoutBtns}>
                            <View style={{height:30,justfyContent:"center",alignItem:"center"}}>
                                <Text style={{text}}>Swipe me left</Text>
                            </View>
                            
                        </Swipeout> */}
                    </View>
                </ImageBackground>
                {/* <Footer location={"notifications"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(Notifications)

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