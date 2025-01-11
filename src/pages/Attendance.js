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
import i18n from '../i18n';
import Select from './components/select';
import axios from 'axios';


class Attendance extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            attendanceList: [],
            show:null,
            notes:[],
            openDate: false,
            date: new Date(),
            students_attendance_update: 'none',
            formattedDate: new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2)
        };

    }

    componentDidMount() {

        this.checkAccess()
        this.getStudents()
        this.getAttendance()

    }

    checkAccess = async () => {
        const res = await axioss.get("https://moqc.ae/api/notes");
        if (res.status === 200) {
            console.log(res.data)
            this.setState({ notes: res.data })
        }
        let access = await AsyncStorage.getItem("@moqc:page_access");
        access = JSON.parse(access);
        await this.setState({
            attendance_update: access.students_attendance_update[0],
        })

        
    }

    getAttendance = async () => {
        open.next(true)
        var course_id = this.props.route.params.course_id
        const response = await axios.get(`https://moqc.ae/api/student_attendance/${course_id}?date=${this.state.formattedDate}`);
        if (response.status === 200) {
            open.next(false)
            await this.setState({ attendanceList: response.data })
        }
    }


    saveAttendance = async () => {
        open.next(true)
        var course_id = this.props.route.params.course_id
        var body = new FormData()
        body.append("id", course_id)
        body.append("students", JSON.stringify(this.state.attendanceList))
        body.append("date", this.state.formattedDate)
        const response = await axios.post(`https://moqc.ae/api/student_attendance_create/${course_id}`, body);

        if (response.status === 200) {
            open.next(false)
            this.getAttendance()
        }
    }
    getStudents = async () => {
        var course_id = this.props.route.params.course_id
        const response = await axios.get(`https://moqc.ae/api/course_students/${course_id}`);
        if (response.status === 200) {
            this.setState({ students: response.data })
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
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5',alignItems:"center", padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* <Text>{item.first_name + ' ' + item.last_name}</Text> */}
            <View style={{ flex: 2 / 4 }}>
                <CheckBox
                    style={{}}
                    onClick={() => {
                        item.is_attend = !item.is_attend
                        this.setState({
                            attdanceList: this.state.attendanceList
                        })
                    }}
                    isChecked={item.is_attend == 0?false:true}
                    leftText={item.first_name + ' ' + item.last_name}
                />
            </View>
            <View style={{ flex: 2/ 4, marginHorizontal: 10 }}>
            <Select
      list={this.state.notes}
      title='Note'
      show={this.state.show==item.id}
      field="id"
      selected={item.note}
      open={()=>this.setState({show:item.id})}
      onSelect={(value)=>{
       this.setState({show:null})
        item.note=value
       }}
      render='name_en'
      close={()=>this.setState({show: null})} />
                {/* <TextInput style={{ padding: 10, height: 40, borderWidth: 1, borderRadius: 10 }}
                    value={item.note}
                    onChangeText={(e) => {
                        item.note = e
                        this.setState({ attdanceList: this.state.attendanceList })
                    }}></TextInput> */}
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
                                <Pressable style={{ padding: 10, justifyContent: 'center', alignItems: 'center', height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }} onPress={() => this.setState({ openDate: true })}>
                                    <Text>{this.state.date.toLocaleDateString()}</Text>
                                </Pressable>
                                {/* <Pressable style={{ marginHorizontal: 5, backgroundColor: '#579976', padding: 10, justifyContent: 'center', alignItems: 'center', height: 40, width: '20%', borderWidth: 1, borderRadius: 10 }} onPress={() => this.getAttendance()}>
                                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 15 }}>{i18n.t('Go')}</Text>
                                </Pressable> */}
                            </View>
                        </View>

                        <View
                            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Name')}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Attendance')}</Text>
                            </View>

                            <View style={{flex:2, flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Note')}</Text>
                            </View>
                        </View>
                        <FlatList
                            data={this.state.attendanceList}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id}
                        />

                        {this.state.students_attendance_update == "write" && this.state.attendanceList ?
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
                            </View>
                            : null}
                    </ImageBackground>
                </View>
            </ScrollView>
        )
    }
}
export default Attendance

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