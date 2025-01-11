import React, { Component } from "react";
import { withTranslation } from 'react-i18next';
import i18next from 'i18next';
import { StyleSheet, ImageBackground, Image, I18nManager, View, TouchableOpacity, Alert } from 'react-native'
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    Text,
    Body,
    Left,
    Right,
    Item,
    Input,
    Form,
    Footer,
    FooterTab,
} from "native-base";
import { AsyncStorage } from 'react-native';
import DropShadow from "react-native-drop-shadow";
import FooterBottom from "./Footer";
import { auto } from "async";
import Social from "./components/social";
class Signup2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rtl: false,
            gender: 0,
            user: this.props.data.user || 0,
            user_img: require("../assets/user_m.png"),
            student_img:require("../assets/student_m.png"),
            line1: require('../assets/yellow_line.png'),
            line2: require('../assets/blue_line.png'),
            isValid: this.props.data.user !== 0,
        };
    }

    handleUserChange = (user) => {
        this.setState({
            user: user,
            isValid: user !== 0,  // Validate when user is selected
        });
        this.props.updateParentState({ user: user });
    };

    validate = () => {
        const { user } = this.state;
        const isValid = user !== 0;
        this.setState({ isValid });
        return isValid;
    };

    handleNext = () => {
        if (this.validate()) {
            this.props.updateParentState({ active_step: this.props.data.active_step + 1 });
        }
    };
    componentDidMount = async () => {
        const { gender } = this.props.data; // Get gender from parent component's data
        console.log("gender pass to step 2", gender)
        this.setState({ gender });
        if (I18nManager.isRTL === true) {
            this.setState({ rtl: true })
        } else {
            this.setState({ rtl: false })
        }
        if (gender == 2) {
            if (this.state.rtl) {
                // Set images for RTL
                this.setState({
                    user_img: require("../assets/user_f.png"),
                    student_img: require("../assets/student_f.png"),
                    line1: require('../assets/red_line.png'),
                });
            } else {
                this.setState({
                    user_img: require("../assets/aUserF.png"),
                    student_img: require("../assets/aStudent.png"),
                    line1: require('../assets/red_line.png'),

                   
                });
            }
        }
        else {
            if (this.state.rtl) {
                this.setState({
                    user_img: require("../assets/user_m.png"),
                    student_img: require("../assets/student_m.png"),
                    line1: require('../assets/yellow_line.png'),
                });
            } else {
                this.setState({
                    user_img: require("../assets/aUserM.png"),
                    student_img: require("../assets/aStudent2.png"),
                    line1: require('../assets/yellow_line.png'),

                   
                });
            }
        }
        let user = await AsyncStorage.getItem("@moqc:user");
        if (user !== null) {

            this.setState({ user: user })
        }
      
    }
    componentDidUpdate(prevProps) {
        const { user } = this.props.data;
        if (prevProps.data.user !== user) {
            this.setState({ user, isValid: user !== 0 });
        }
    }

    render() {
        const { t, i18n } = this.props;
        console.log(this.state.gender)
        return (
            <View style={{ marginTop: 30, flex: 1, marginBottom: 20 }}>

                <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center", paddingHorizontal: 50, marginTop: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 10, }}>
                        {i18n.t("If you are willing to become a MOQC Student kindly select Student")}
                    </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                        {i18n.t("In Case you are a Visitor kindly select MOQC User to proceed with registration")}
                    </Text>

                </View>
                <View style={{ flex: 10, flexDirection: "row", justifyContent: "center", }}>
                    <TouchableOpacity onPress={() => this.handleUserChange(1)}>
                        <Image
                            source={this.state.user_img}
                            style={{
                                height: 220,
                                width: 150,
                                marginRight: 10,
                                resizeMode: "contain"
                            }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleUserChange(2)}>
                        <Image
                            source={this.state.student_img}
                            style={{
                                height: 220,
                                marginRight: 10,
                                width: 150,
                                resizeMode: "contain"
                            }} />

                    </TouchableOpacity>

                </View>
                <View style={{ flex: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", alignSelf: "center", }}>
                    <Image
                        source={this.state.line1}
                        style={{
                            height: this.state.user == 1 ? 10 : 0,
                            width: 150,
                            marginRight: 10,

                            resizeMode: "contain"
                        }} />

                    <Image
                        source={this.state.line2}
                        style={{
                            height: this.state.user == 2 ? 10 : 0,
                            width: 150,
                            marginRight: 10,

                            resizeMode: "contain"
                        }} />


                </View>


                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center",
                        marginTop: 5,
                        marginBottom: 5,
                    }}>
                    <Button
                        onPress={this.handleNext}
                        style={{
                            width: 100,
                            borderRadius: 30,
                            justifyContent: "center",
                            alignContent: "center",
                            backgroundColor: "#31314f",
                        }}
                    >
                        <Text style={{ color: "#fff", marginRight: 10 }}>{t("Next")}</Text>
<Icon type="AntDesign" name="caretright" style={{ fontSize: 10,transform: [{ rotate: '180deg' }] }} />
                    </Button>
                </View>
            </View>
        );
    }
}

export default withTranslation()(Signup2);