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
    Dimensions,
    FlatList,
    Item,
    Pressable,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import API from "../api/";
import Axios from 'axios'
import DateTimePicker from 'react-native-date-picker';
import CheckBox from 'react-native-check-box'
import { open } from '../store';
import { Backdrop } from 'react-native-backdrop';
import Toast from 'react-native-simple-toast';
import { AsyncStorage } from 'react-native';
import i18n from '../i18n';
import axios from 'axios';


class TeamAttendance extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            attendanceList: [],
            openDate: false,
            date: new Date(),
            formattedDate: new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2),
            show_spinner: false,
            attendance_update: 'none'
        };

    }

    componentDidMount() {
        this.getAttendance()
        this.checkAccess()
    }

    checkAccess = async () => {
        let access = await AsyncStorage.getItem("@moqc:page_access");
        access = JSON.parse(access);
        await this.setState({
            attendance_update: access.attendance_update[0],
        })
    }

    getAttendance = async () => {
        const response = await axios.get(`https://moqc.ae/api/attendances?date=${this.state.formattedDate}`);
        if (response.status === 200) {

            await this.setState({ attendanceList: response.data })
        }
    }


    saveAttendance = async () => {
        this.setState({ show_spinner: true })
        let token = await AsyncStorage.getItem("@moqc:token")
        open.next(true)
        var body = new FormData()
        body.append("users", JSON.stringify(this.state.attendanceList))
        body.append("date", this.state.formattedDate)
        const response = await axios.post(`https://moqc.ae/api/attendances_update`, body,
            { headers: { "token": token } });
        this.setState({ show_spinner: false })

        if (response.status === 200) {
            Toast.showWithGravity('Attendance Saved Successfully', Toast.SHORT, Toast.TOP);
            this.getAttendance()
        }
    }


    formatDate(date) {
        var d = new Date(date);
        d = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
        this.setState({ formattedDate: d })
    }

    onChange = (event, selectedDate) => {
        this.setState({ openDate: false })
        const currentDate = selectedDate || date;
        this.formatDate(selectedDate)
        this.setState({ date: currentDate })
        this.getAttendance()
    };

    renderItem = ({ item }) => (

        <View style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* <Text>{item.first_name + ' ' + item.last_name}</Text> */}
            <View style={{ flex: 2 / 4 }}>
                <CheckBox
                    style={{}}
                    onClick={async () => {
                        item.is_attend = !item.is_attend
                        await this.setState({
                            attdanceList: this.state.attendanceList
                        })
                    }}
                    isChecked={item.is_attend = item.is_attend == 1}
                    leftText={item.first_name + ' ' + item.last_name}
                />
            </View>
            <View style={{ flex: 1 / 4, marginHorizontal: 10 }}>
                <TextInput style={{ padding: 10, height: 40, borderWidth: 1, borderRadius: 10 }}
                    value={item.note}
                    onChangeText={(e) => {
                        item.note = e
                        this.setState({ attdanceList: this.state.attendanceList })
                    }}></TextInput>
            </View>
        </View>
    );

    render() {
        return (
            <ScrollView>
                <View style={{ flex: 10 }}>
                    {/* <Backdrop
                        visible={open}
                    >
                        <View>
                            <ActivityIndicator />
                        </View>
                    </Backdrop> */}
                    <ImageBackground
                        source={require('../assets/bg_img.png')}
                        style={{
                            flex: 10,
                        }}>



                        <View style={{ margin: 10 }}>
                            <Pressable onPress={() => this.setState({ openDate: true })}>
                                <Text>{i18n.t('Select Date')}</Text>
                            </Pressable>

                            {this.state.openDate && (

                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={this.state.date}
                                    mode='date'
                                    is24Hour={true}
                                    display="default"
                                    onChange={this.onChange}
                                />
                            )}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Pressable style={{ padding: 10, justifyContent: 'center', alignItems: 'center', height: 40, width: '80%', borderWidth: 1, borderRadius: 10 }}
                                    onPress={() => this.setState({ openDate: true })}>
                                    <Text>{this.state.date.toLocaleDateString()}</Text>
                                </Pressable>
                                {/* <Pressable style={{ marginHorizontal: 5, backgroundColor: '#579976', padding: 10, justifyContent: 'center', alignItems: 'center', height: 40, width: '20%', borderWidth: 1, borderRadius: 10 }}
                                    onPress={() => this.getAttendance()}>
                                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 15 }}>Go</Text>
                                </Pressable> */}
                            </View>
                        </View>

                        {this.state.show_spinner ? <ActivityIndicator size="large" /> :
                            <View>
                                <View
                                    style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Name')}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Attendance')}</Text>
                                    </View>

                                    <View style={{ width: '20%', flexDirection: 'row' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Note')}</Text>
                                    </View>
                                </View>
                                <FlatList
                                    data={this.state.attendanceList}
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.id}
                                />
                            </View>
                        }

                        {this.state.attendance_update == "write" && this.state.attendanceList ?
                            <View style={{ margin: 10 }}>
                                <Pressable onPress={() => this.setState({ openDate: true })}>
                                    <Text>{i18n.t('Select Date')}</Text>
                                </Pressable>

                                {this.state.openDate && (

                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={this.state.date}
                                        mode='date'
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChange}
                                    />
                                )}


                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Pressable style={{ padding: 10, justifyContent: 'center', alignItems: 'center', height: 40, width: '80%', borderWidth: 1, borderRadius: 10 }}>
                                        <Text>{this.state.date.toLocaleDateString()}</Text>
                                    </Pressable>
                                    <Pressable style={{ marginHorizontal: 5, backgroundColor: '#579976', padding: 10, justifyContent: 'center', alignItems: 'center', height: 40, width: '20%', borderWidth: 1, borderRadius: 10 }}
                                        onPress={() => this.saveAttendance()}>
                                        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 15 }} >{i18n.t('Save')}</Text>
                                    </Pressable>
                                </View>

                            </View> : null}
                    </ImageBackground>
                </View>
            </ScrollView>
        )
    }
}
export default TeamAttendance

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
    }
});