import { Spinner, Button, Icon } from "native-base";
import React, { Component } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { withTranslation } from "react-i18next";

class Step1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rtl: false,
            gender: 0,
            isValid: false,
        };
    }

    componentDidMount() {
        const { gender } = this.props.data;
        this.setState({ gender, isValid: gender !== 0 });
    }

    componentDidUpdate(prevProps) {
        const { gender } = this.props.data;
        if (prevProps.data.gender !== gender) {
            this.setState({ gender, isValid: gender !== 0 });
        }
    }

    handleGenderChange = (gender) => {
        this.setState({ gender, isValid: true });
        this.props.updateParentState({ gender });
    };

    validate = () => {
        const { gender } = this.state;
        const isValid = gender !== 0;
        this.setState({ isValid });
        return isValid;
    };

    handleNext = () => {
        if (this.validate()) {
            this.props.updateParentState({ active_step: this.props.data.active_step + 1 });
        }
    };

    render() {
        const { t, i18n } = this.props;
        const { gender, isValid } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            marginTop: 15,
                            marginBottom: 15,
                            fontFamily: "GESSTwoMedium-Medium",
                            fontWeight: "100",
                        }}
                    >
                        {t("Which one are you?")}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: "GESSTwoMedium-Medium",
                            fontWeight: "100",
                        }}
                    >
                        {t("Select your Gender")}
                    </Text>
                </View>

                <View style={{ flex: 10, flexDirection: "row", justifyContent: "space-around" }}>

                    <TouchableOpacity onPress={() => this.handleGenderChange(1)}>
                    {this.state.rtl ?
                    <Image
                                                source={require('../assets/male.png')}
                                                style={{
                                                    height: 250,
                                                    width: 150,
                                                    resizeMode: "contain",
                                                }}
                                            />

                                            :
                                            <Image
                                                                        source={require('../assets/aMale.png')}
                                                                        style={{
                                                                            height: 250,
                                                                            width: 150,
                                                                            resizeMode: "contain",
                                                                        }}
                                                                    />

                    }

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleGenderChange(2)}>
                     {this.state.rtl ?
                        <Image
                            source={require('../assets/female.png')}
                            style={{
                                height: 250,
                                width: 150,
                                resizeMode: "contain",
                            }}
                        />:
                         <Image
                                                    source={require('../assets/aFemale.png')}
                                                    style={{
                                                        height: 250,
                                                        width: 150,
                                                        resizeMode: "contain",
                                                    }}
                                                />
                                                }

                    </TouchableOpacity>
                </View>

                <View style={{ flex: 6, flexDirection: "row", justifyContent: "space-around" }}>
                    <Image
                        source={require('../assets/blue_line.png')}
                        style={{
                            height: gender === 1 ? 10 : 0,
                            width: 100,
                            marginLeft: 10,
                            resizeMode: "contain",
                        }}
                    />

                    <Image
                        source={require('../assets/red_line.png')}
                        style={{
                            height: gender === 2 ? 10 : 0,
                            width: 100,
                            marginLeft: 10,
                            resizeMode: "contain",
                        }}
                    />
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
//                            flex: 1,
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

export default withTranslation()(Step1);
