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
    Modal,
    Pressable,
    Alert,
    FlatList
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker as SelectPicker, Form } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import Axios from 'axios'
import NoDocument from "../assets/no-document.png"
import DateTimePicker from 'react-native-date-picker';
import i18n from '../i18n';
import { AsyncStorage } from 'react-native';
import axios from 'axios';


class Exam extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            exams: [],
            courseId: '',
            name_en: '',
            name_ar: "",
            attachment: '',
            updateModal: false,
            updateExamItem: [],
            updatename_en: '',
            updatename_ar: '',
            updatedate: '',
            date: new Date(),
            openDate: false,
            language:''
        }
        this.getLanguage()
    }

    componentDidMount() {
        this.getExams()
    }

    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    getExams = async () => {
        var course_id = this.props.route.params.course_id
        const response = await axios.get(`https://moqc.ae/api/exam_list/${course_id}`);
        if (response.status === 200) {
            this.setState({ exams: response.data })
        }
    }

    async createExam() {
        var course_id = this.props.route.params.course_id
        var body = new FormData()
        body.append("id", course_id)
        body.append("name_en", this.state.name_en)
        body.append("name_ar", this.state.name_ar)
        body.append("date", this.state.date)
        const response = await axios.post(`https://moqc.ae/api/exam_create/${course_id}`, body);

        if (response.status === 200) {
            this.setState({ createModal: false, name_en: '', name_ar: '', date: new Date() })
            this.getExams()
        }
    }

    async deleteExam(id) {
        const response = await axios.delete(`https://moqc.ae/api/exam_delete/${id}`);
        if (response.status === 200) {
            this.getExams()
        }
    }
    async updateExams() {
        var course_id = this.props.route.params.course_id
        var body = new FormData()
        body.append("course_id", course_id)
        body.append("name_en", this.state.updatename_en)
        body.append("name_ar", this.state.updatename_ar)
        body.append("date", this.state.date)
        const response = await axios.post(`https://moqc.ae/api/exam_update/${this.state.updateExamItem.id}`, body);

        if (response.status === 200) {
            this.setState({ updateModal: false })
            this.getExams()
        }
    }

    async updateExam(exam) {
        this.setState({
            updateModal: true, updateExamItem: exam, updatename_en: exam.name_en,
            updatename_ar: exam.name_ar, updatedate: exam.date
        })
    }

    onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        this.setState({ date: currentDate, openDate: false })
    };


    renderItem = ({ item }) => (
        <View onPress={() => this.props.navigation.navigate("CourseStudents")}
            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
                <Text>{this.state.language=='en'? item.name_en : item.name_ar}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text>{item.date}</Text>
            </View>
            <View style={{ width: '20%', flexDirection: 'row' }}>
                {/* <Icon onPress={() => this.historyDownload(item.link)} active size={20} name='file-download' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} /> */}
                {/* <Icon onPress={() => this.updateExam(item)} active size={20} name='edit' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} /> */}
                <Icon onPress={() => this.props.navigation.navigate("ExamReport", { exam_id: item.id, name:item.name_en, date:item.date, course:null,exam:item })} active size={20} name='remove-red-eye' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} />
            </View>
        </View>
    );

    render() {
       
        return (
            <View style={{ flex: 10 }}>
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    {/* <TouchableOpacity onPress={() => this.setState({ createModal: true })} style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <Icon active size={20} name='add' type="MaterialIcons" style={{ marginHorizontal: 5, backgroundColor: '#579976', borderColor: '#579976', borderWidth: 1, borderRadius: 50, color: "#fff", fontSize: 20 }} />
                        <Text style={{ color: "#579976", fontSize: 15 }}>Exams</Text>
                    </TouchableOpacity> */}
                    {/* <View style={{ position: 'absolute', zIndex: 10, right: 20, bottom: 90 }}>
                        <TouchableOpacity onPress={() => this.setState({ createModal: true })}>
                            <Icon active size={20} name='add-circle' type="MaterialIcons" style={{ color: "#579976", fontSize: 44 }} />
                        </TouchableOpacity>
                    </View> */}
                    <View
                        style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Name')}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Date')}</Text>
                        </View>

                        <View style={{  flexDirection: 'row',width:"20%" }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Action')}</Text>
                        </View>
                    </View>
                    {this.state.exams?.length==0&& <View style={{borderWidth:1,borderColor:"#579976",borderRadius:12,marginVertical:20,marginHorizontal:12,paddingHorizontal:12,paddingVertical:5,alignItems:"center"}}>
                        <Image source={NoDocument} style={{width:90,height:90,tintColor:"#579976"}} />
                        <Text >{i18n.t("No exams found")}</Text>
                    </View>}
                    <FlatList
                        data={this.state.exams}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                    />
                    {/* <ActionButton style={{ position: 'absolute', bottom: 90, right: 10 }}
                        buttonColor="#579976" onPress={() => this.setState({ createModal: true })}>
                    </ActionButton> */}

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.createModal}
                        statusBarTranslucent={true}

                        onRequestClose={() => {
                            this.setState({ createModal: false });
                        }}
                    ><SafeAreaView style={{flex:1}}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.heading}>{i18n.t('Upload Exam')}</Text>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('English Name')}</Text>
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.name_en}
                                        onChangeText={(e) => this.setState({ name_en: e })}></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Arabic Name')}</Text>
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.name_ar}
                                        onChangeText={(e) => this.setState({ name_ar: e })}></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
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
                                    <Pressable onPress={() => this.setState({ openDate: true })}>
                                        <Text style={{ padding: 10, justifyContent: 'center', alignItems: 'center', height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        >{this.state.date.toLocaleDateString()}</Text>
                                    </Pressable>
                                </View>

                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Course')}</Text>
                                    <View style={{ padding: 10, justifyContent: 'center', height: 40, width: '100%', borderWidth: 1, borderRadius: 10, }}>
                                        <SelectPicker
                                            style={{ height: 50, width: 150 }}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ courseId: itemValue })}
                                        >
                                            <SelectPicker.Item label="Java" value="java" />
                                            <SelectPicker.Item label="JavaScript" value="js" />
                                        </SelectPicker>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Pressable style={{ position: 'absolute', right: 0, bottom: -80 }}>
                                        <Button disabled={!this.state.name_en || !this.state.name_ar || !this.state.date} onPress={() => this.createExam()}
                                            style={{ backgroundColor: '#579976', width: '100%', padding: 20, color: '#579976' }}>
                                            <Text style={{ fontWeight: 'bold', color: '#fff' }}>{i18n.t('Submit')}</Text>
                                        </Button>
                                    </Pressable>
                                </View>

                            </View>
                        </View></SafeAreaView>
                    </Modal>



                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.updateModal}
                        statusBarTranslucent={true}

                        onRequestClose={() => {
                            this.setState({ updateModal: false });
                        }}
                    ><SafeAreaView style={{flex:1}}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.heading}>{i18n.t('Update Exams')}</Text>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('English Name')}</Text>
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updatename_en}
                                        onChangeText={(e) => {
                                            var exam = this.state.updateExamItem
                                            exam.name_en = e
                                            this.setState({ updateExamItem: exam, updatename_en: e })
                                        }}
                                    ></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Arabic Name')}</Text>
                                    <TextInput style={{ height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updatename_ar}
                                        onChangeText={(e) => {
                                            var exam = this.state.updateExamItem
                                            exam.name_ar = e
                                            this.setState({ updateExamItem: exam, updatename_ar: e })
                                        }}></TextInput>
                                </View>

                                {/* <View style={{ marginVertical: 10 }}>
                                    <Pressable onPress={() => this.setState({ openDate: true })}>
                                        <Text>Select Date</Text>
                                    </Pressable>

                                    {this.state.openDate && (

                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={this.state.updatedate}
                                            mode='date'
                                            is24Hour={true}
                                            display="default"
                                            onChange={() => {
                                                var exam = this.state.updateExamItem
                                                exam.date = selectedDate
                                                this.setState({ updateExamItem: exam, updatedate: selectedDate })
                                            }}
                                        />
                                    )}
                                    <Pressable onPress={() => this.setState({ openDate: true })}>
                                        <Text style={{ padding: 10, justifyContent: 'center', alignItems: 'center', height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        >{this.state.updatedate?.toLocaleDateString()}</Text>
                                    </Pressable>
                                </View> */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Pressable style={{ position: 'absolute', right: 0, bottom: 10 }}>
                                        <Button onPress={() => this.updateExams()} style={{ backgroundColor: '#579976', width: '100%', padding: 20, color: '#579976' }}><Text style={{ fontWeight: 'bold', color: '#fff' }}>{'Submit'}</Text></Button>
                                    </Pressable>
                                </View>
                            </View>
                        </View></SafeAreaView>
                    </Modal>
                </ImageBackground>
            </View>
        );
    }
}
export default Exam


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
        margin: 10,
        width: '100%',
        height: "100%",
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        padding: 10,
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