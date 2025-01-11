import React, { useLayoutEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    I18nManager,
    Image,
    SafeAreaView,
    ImageBackground,
    Platform, WebView
} from 'react-native';
import { Avatar, RadioButton } from 'react-native-paper';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
//import { AsyncStorage } from 'react-native';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import DropShadow from "react-native-drop-shadow";
import {
    Container,
    Header,
    Content,
    Button,
    Left,
    Body,
    Title,
    Right,
    Icon,
    Spinner
} from 'native-base';
import Toast from 'react-native-simple-toast';
import i18n from '../i18n';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Social from './components/social';

const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, 
    // {
    //     label: 'English',
    //     value: 'en'

    // }
];

class Landing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: 'ar', checked: 'first',loading:true
        };
    }

    componentDidMount() {
        this.load_data(this.props);
        this.setLanguage(this.props)
    }
    


    setLanguage = async (props) => {
        const { t, i18n } = props;

        console.log("langgg", this.state.selected)
        if (this.state.selected == null) {
            Toast.showWithGravity('Please select a language to proceed', Toast.SHORT, Toast.CENTER);
        } else {
            await AsyncStorage.setItem('@moqc:language', this.state.selected);
            i18n
                .changeLanguage(this.state.selected)
                .then(() => {
                   if( !I18nManager?.isRTL)
                   {
                    I18nManager?.forceRTL(true);
                   }
                    
                    //   RNRestart.Restart();
                    this.props.navigation.navigate("Home")
                });


        }
    }

    load_data = async () => {
        let lang = await AsyncStorage.getItem("@moqc:language");
        lang="ar"
        this.setState({loading:false})
        if (lang !== null || lang != "null") {
            if (lang == 'ar' & I18nManager.isRTL === true) {
                this.props.navigation.navigate("Home")
                // RNRestart.Restart();
            } else if (lang == 'ar' & I18nManager.isRTL === false) {
                i18n
                    .changeLanguage('ar')
                    .then(() => {
                        I18nManager.forceRTL(true);
                        RNRestart.Restart();
                    });
            } else if (lang == 'en' & I18nManager.isRTL === false) {
                this.props.navigation.navigate("Home")
                // RNRestart.Restart();
            } else if (lang == 'en' & I18nManager.isRTL === true) {
                i18n
                    .changeLanguage('en')
                    .then(() => {
                        I18nManager.forceRTL(false);
                        RNRestart.Restart();
                    });
            }
        }
        // if (lang == null || lang == "null") {
        //     i18n
        //         .changeLanguage(lang)
        //         .then(() => {
        //             I18nManager.forceRTL(i18n.language === 'ar');
        //             RNRestart.Restart();
        //             this
        //                 .props
        //                 .navigation
        //                 .navigate("Login")

        //         });

        //     return;
        // }
    }



    render() {
        return (

            <Container style={{ flex: 10, }}>
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,

                    }}>
                    <View style={{ flex: 1, }}>

                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{
                                height: 80,
                                width: 80,
                                marginBottom: 25
                            }}
                            source={require('../assets/round.png')} />
                    </View>
                    <View style={{ marginTop: 20, flex: 0.5, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>

                    </View>
                    <View style={{ flex: 0.5, justifyContent: 'center', padding: 20, alignContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ fontSize: 22, color: "#e1605f", fontWeight: "600", height: 100 }}>WELCOME</Text>
                        <View style={{ flex: 0.1 }}>
                        </View>
                        <Text style={{ fontSize: 24, color: "#e1605f", fontWeight: "600", height: 100 }}>مرحبا بكم</Text>

                    </View>



                    {this.state.loading?<Spinner></Spinner>:<View style={{
                        flex: 8
                    }}>
                        <View style={{
                            flex: 0.5
                        }}></View>
                        <View
                            style={{
                                flex: 1.5,
                                justifyContent: "center",
                                alignContent: "center",
                                textAlign: "center",

                            }}>
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontSize: 18
                                }}>
                                اختر اللغة
                            </Text>
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontSize: 18
                                }}>
                                Choose the language
                            </Text>

                        </View>


                        <View
                            style={{
                                padding: 10,
                                shadowColor: "#cfcee0",
                                shadowOffset: {
                                    width: 0,
                                    height: 0
                                },
                                shadowOpacity: 1,
                                shadowRadius: 5
                            }}>

                            <RadioButtonRN
                                style={{
                                    borderColor: "#cfcee0",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    backgroundColor: 'white',
                                    padding: 30
                                }}
                                activeColor="#e1605f"
                                deactiveColor="#facccc"
                                data={data}
                                selectedBtn={(e) => this.setState({ selected: e.value })}
                                box={false} />
                        </View>
                        <View style={{
                            flex: 0.5
                        }}></View>

                        <View
                            style={{
                                flex: 3,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                flexDirection: 'row'
                            }}>

                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", alignSelf: "center", alignContent: "center", flexDirection: "row" }}>
                                {/* <Button
                                    style={{
                                        minWidth: 100,
                                        maxHeight: 60,
                                        maxWidth: 150,
                                        backgroundColor: '#e1605f',
                                        color: '#fff',
                                        borderWidth: 1,
                                        borderColor: "#e85c5d",
                                        borderRadius: 30,
                                        flex: 1,
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center",
                                        flexDirection: 'row',
                                        // opacity: 0.4

                                    }}
                                    light
                                    onPress={() => {this.setLanguage(this.props) ; 
                                    this.props.navigation.navigate("Signup")}}>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: '#fff'
                                        }}>
                                        REGISTER <Icon name="caretright" type="AntDesign" style={{ fontSize: 12, color: "white" }} />
                                    </Text>
                                </Button> */}

                                <Button
                                    style={{
                                        margin: 10,
                                        height: 60,
                                       
                                        backgroundColor: '#31314f',
                                        color: '#fff',
                                        borderWidth: 1,
                                        borderColor: "#d0c8b6",
                                        borderRadius: 10,
                                        flex: 1,
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center",
                                    }}
                                    light
                                    onPress={() => { this.setLanguage(this.props) }}>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: '#fff',

                                        }}>
                                        {/* {i18n.t('Get Started')} */}
                                        المتابعة <Icon name="caretright" type="AntDesign" style={{ fontSize: 12, color: "#fff" }} />
                                    </Text>
                                </Button>
                              
                            </View>


                        </View>

                    </View>}
                    
                   
                     <Social style={{margin:20}} />

                   <View style={{height:80}}></View>
                   
                </ImageBackground>
            </Container>



            // <View style={{ flex: 1 }}>
            //     <ImageBackground
            //         source={require('../assets/bg_img.png')}
            //         style={{
            //             width: '100%',
            //             height: '100%',
            //             // direction: 'rtl',
            //             flex: 1,
            //             resizeMode: "stretch",

            //         }}>
            //         <View
            //             style={{
            //                 justifyContent: "space-around", flexDirection: "row", flex: 1,
            //                 justifyItems: "center", alignItems: "center"
            //             }}>
            //             <View>
            //                 <TouchableOpacity onPress={() => this.props.navigation.navigate("Media")}>
            //                     <View style={styles.avatar}>
            //                         <Image source={require('../assets/logo.png')} style={{ width: 80, height: 80 }} />
            //                     </View>
            //                 </TouchableOpacity>

            //                 <Text style={{ textAlign: "center" }}>Socail media</Text>
            //             </View>
            //             <View>
            //                 <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
            //                     <View style={styles.avatar}>
            //                         <Image source={require('../assets/round.png')} style={{ width: 75, height: 75 }} />
            //                     </View>
            //                 </TouchableOpacity>
            //                 <Text style={{ textAlign: "center" }}>Dashboard</Text>
            //             </View>
            //             <View>
            //                 <TouchableOpacity onPress={() => this.props.navigation.navigate("Radio")}>
            //                     <View style={styles.avatar}>
            //                         <Image source={require('../assets/radio.png')} style={{ width: 75, height: 75, resizeMode: "contain" }} />
            //                     </View>
            //                 </TouchableOpacity>
            //                 <Text style={{ textAlign: "center" }}>Radio</Text>
            //             </View>

            //         </View>
            //     </ImageBackground>
            // </View>
        )
    }

}

export default withTranslation()(Landing)

const styles = StyleSheet.create({

    wrapper: {
        flex: 1
    },
    sectionWrapper: {
        padding: 20
    },
    heading: {
        fontSize: 18,
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
    avatar: {

        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 80,
        borderColor: "#c2c2c2",
        borderWidth: 1,
        height: 80,
        width: 80

    }
});