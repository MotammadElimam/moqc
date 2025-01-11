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
import { AsyncStorage } from 'react-native';
import i18n from '../i18n';
import { Container } from 'native-base';
import Select from './components/select';
import axios from 'axios';

class StudentAttendance extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            attendanceList: [],
            notes:[],
            show:null,
            openDate: false,
            date: new Date(),
            attendance_update: 'none',
            formattedDate: new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2)
        };

    }

    componentDidMount() {
        console.log("att")
        this.getAttendance()
        this.checkAccess()
    }

    checkAccess = async () => {
        let access = await AsyncStorage.getItem("@moqc:page_access");
        access = JSON.parse(access);
        await this.setState({
            attendance_update: access.students_attendance_update[0],
        })
    }

    getAttendance = async () => {
        let token = await AsyncStorage.getItem("@moqc:token");
        var course_id = this.props.route.params.course_id
        const response = await axios.get(`https://moqc.ae/api/student_attendances/${course_id}`);
        if (response.status === 200) {

            await this.setState({ attendanceList: response.data })
        }

        const res = await axios.get("https://moqc.ae/api/notes");
        if (res.status === 200) {
            this.setState({ notes: res.data })
        }
    }



    renderItem = ({ item }) => (
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* <Text>{item.first_name + ' ' + item.last_name}</Text> */}
            <View style={{ flex: 2 / 4 }}>
                <CheckBox
                    style={{}}
                    onClick={() => console.log('')}
                    isChecked={item.is_attend == 1}
                    leftText={item.date}
                />
            </View>
            <View style={{ flex: 1 / 4, marginHorizontal: 10 }}>
            {/* <Select
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
      close={()=>this.setState({show: null})} /> */}
                <Text style={{}}
                    value={item.note + " " + item.is_attend}
                ></Text>
            </View>
        </View>
    );

    render() {
        return (
            <Container style={{ flex: 10 }}>
                <ScrollView>

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

                        <View
                            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Date')}</Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Attendance')}</Text>
                            </View>

                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Note')}</Text>
                            </View>
                        </View>
                        <FlatList
                            data={this.state.attendanceList}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id}
                        />


                    </ImageBackground>

                </ScrollView>
            </Container>
        )
    }
}
export default StudentAttendance

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