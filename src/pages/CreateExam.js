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
    FlatList,ScrollView
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form ,CheckBox} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import Axios from 'axios'
import DateTimePicker from 'react-native-date-picker';
import HeaderTop from "./Header";
import i18n from '../i18n';
import { AsyncStorage } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';


class CreateExam extends React.Component {

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
            ids:[],
            attachment: '',
            updateModal: false,
            updateExamItem: [],
            updatename_en: '',
            updatename_ar: '',
            updatedate: '',
            course_id:'',
            updatecourseId:"",
            updatecoursename: '',
            updatecourseId: '',
            cname:"",
            date: new Date(),
            openDate: false,
            allCourses: [],
            language: '',
            formattedDate: new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2),
            show_spinner: true,
            uids:[]
        }
        this.getLanguage()
    }

    componentDidMount() {
        this.getExams()
        this.getAllCourses()

    }
    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    async getAllCourses() {
        var token=await AsyncStorage.getItem('@moqc:token')
        var res=await axios.get("https://moqc.ae/api/students",{headers:{token:token}})
        if(res.status==200)
        {
            this.setState({students:res.data})
        }
        const response = await axios.get(`https://moqc.ae/api/courses`);
        if (response.status === 200) {
            await this.setState({ allCourses: response.data })
        }


       
    }
    getExams = async () => {
        this.setState({ show_spinner: true })
        const response = await axios.get(`https://moqc.ae/api/exam_list`);
        this.setState({ show_spinner: false })
        if (response.status === 200) {
            this.setState({ exams: response.data })
        }
    }

    async createExam() {
        this.setState({ show_spinner: true })
        var body = new FormData()
        var ids=''
        for(let i=0;i<this.state.ids.length;i++)
        {
            ids=(i+1==this.state.ids.length)?ids+this.state.ids[i]:ids+this.state.ids[i]+','
        }
        body.append('id', this.state.courseId.split(' ')[0])
        body.append("name_en", this.state.name_en)
        body.append("name_ar", this.state.name_ar)
        body.append("date", this.state.formattedDate)
        body.append('ids',ids)
       axios.post(`https://moqc.ae/api/exam_create/${this.state.courseId.split(' ')[0]}`, body)
       .then(response=>{
        console.log(response.data)
        this.setState({ createModal: false, name_en: '', name_ar: '', date: new Date() })
        this.getExams()
       })
       .catch(e=>console.log(e.response))
        this.setState({ show_spinner: false })
        
    }

    async deleteExam(id) {
        const response = await axios.delete(`https://moqc.ae/api/exam_delete/${id}`);
        if (response.status === 200) {
            this.getExams()
        }
    }
    async updateExams() {
        this.setState({ show_spinner: true })
        var ids=''
        for(let i=0;i<this.state.uids.length;i++)
        {
            ids=(i+1==this.state.uids.length)?ids+this.state.uids[i]:ids+this.state.uids[i]+','
        }
        var body = new FormData()
        body.append("name_en", this.state.updatename_en)
        body.append("name_ar", this.state.updatename_ar)
        body.append("date", this.state.formattedDate)
        body.append("course_id",this.state.updatecourseId)
        body.append('ids',ids)
        console.log(this.state.updateExamItem,ids)
        const response = await axios.post(`https://moqc.ae/api/exam_update/${this.state.updateExamItem.id}`, body);
        this.setState({ show_spinner: false })
        if (response.status === 200) {
            this.setState({ updateModal: false })
            this.getExams()
        }
    }

    async updateExam(exam) {
        console.log(exam.ids.split(','))
        await this.setState({
            updateModal: true, updateExamItem: exam, updatename_en: exam.name_en,
            updatename_ar: exam.name_ar, updatedate: exam.date, uids: exam.ids.split(','),
           updatecourseId:exam.course_id
        })
    }

    formatDate(date) {
        var d = new Date(date);
        d = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
        this.setState({ formattedDate: d })
    }

    onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        this.formatDate(selectedDate)
        this.setState({ date: currentDate, openDate: false })
    };


    renderItem = ({ item }) => (
        <View onPress={() => this.props.navigation.navigate("CourseStudents")}
            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
                <Text>{this.state.language == 'en' ? item.name_en : item.name_ar}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text>{item.date}</Text>
            </View>
            
            <View style={{ width: '20%', flexDirection: 'row' }}>
            <Icon onPress={() => {this.props.navigation.push("ExamResult",{exam:item})}} active size={20} name='visibility' type="MaterialIcons" style={{  fontSize: 20, marginHorizontal: 5 }} />
                {/* <Icon onPress={() => this.historyDownload(item.link)} active size={20} name='file-download' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} /> */}
                <Icon onPress={() => this.updateExam(item)} active size={20} name='edit' type="MaterialIcons" style={{ color: "#579976", fontSize: 20, marginHorizontal: 5 }} />
                <Icon onPress={() => this.deleteExam(item.id)} active size={20} name='trash-can-outline' type="MaterialCommunityIcons" style={{ color: "red", fontSize: 20 }} />
            </View>
        </View>
    );

    render() {
        return (
            <View style={{ flex: 10 }}>
                <HeaderTop pagename={i18n.t("Exam")} navigation={this.props.navigation} back={true} />
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    <View style={{ margin: 10 }}>
                        <TouchableOpacity onPress={() => this.setState({ createModal: true })}>
                            <Icon active size={20} name='add-circle' type="MaterialIcons" style={{ color: "#579976", fontSize: 40 }} />
                        </TouchableOpacity>
                    </View>
                    {/* <ActionButton
                        buttonColor="#579976"
                        onPress={() => this.setState({ createModal: true })}
                    >
                    </ActionButton> */}
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
                      
                        <View style={{ width: '20%', flexDirection: 'row' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Action')}</Text>
                        </View>
                    </View>
                    {this.state.show_spinner ?<View style={{flex:1}}><ActivityIndicator size='large' /></View> :
                        <FlatList
                            data={this.state.exams}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id}
                        />
                    }


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
                                <Text style={styles.heading}>{i18n.t('Create Exam')}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Pressable >
                                        <Button disabled={!this.state.name_en || !this.state.name_ar || !this.state.date} onPress={() => this.createExam()}
                                            style={{ backgroundColor: '#579976', width: '100%', padding: 20, color: '#579976',borderRadius:15 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#fff' }}>{i18n.t('Submit')}</Text>
                                        </Button>
                                    </Pressable>

                                    <Pressable >
                                        <Button  onPress={() => this.setState({createModal:false})}
                                            style={{ backgroundColor: '#eee', width: '100%', padding: 20, color: '#579976',borderRadius:15 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#999' }}>{i18n.t('cancel')}</Text>
                                        </Button>
                                    </Pressable>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('English Name')}</Text>
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.name_en}
                                        onChangeText={(e) => this.setState({ name_en: e })}></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Arabic Name')}</Text>
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.name_ar}
                                        onChangeText={(e) => this.setState({ name_ar: e })}></TextInput>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Pressable onPress={() => this.setState({ openDate: true })}>
                                        <Text>{i18n.t('Select Date')}</Text>
                                    </Pressable>

                                   
                                    <Pressable onPress={() => this.setState({ openDate: true })}>
                                        <Text style={{ padding: 10, justifyContent: 'center', alignItems: 'center', height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        >{this.state.date.toLocaleDateString()}</Text>
                                    </Pressable>
                                    {this.state.openDate && (
                                        <View>
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={this.state.date}
                                            mode="date"
                                            
                                            modal
                                            is24Hour={true}
                                            display="default"
                                            onChange={this.onChange}
                                        />
                                       <Button  onPress={() => this.setState({openDate:false})}
                                            style={{ backgroundColor: '#579976', width: '100%', justifyContent:"center", color: '#579976',borderRadius:15 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#fff' }}>{i18n.t('Submit')}</Text>
                                        </Button>
                                        </View>
                                    )}
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text>{i18n.t('Course')}</Text>
                                   <Picker 
                                   placeholder={i18n.t("Select One")}
                                   style={{ padding: 10,borderColor:"#000", height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                   selectedValue={this.state.course_id}
                                   onValueChange={(course_id, itemIndex) => {
                                       
                                       this.setState({ course_id })
                                   }}
                                   >
                                    {this.state.allCourses.map(item=><Picker.Item key={item.id} label={item[`course_name_${i18n.language}`]} value={item.id}  />)}
                                   </Picker>
                                </View>

                                <ScrollView>
                                    {this.state.students.filter((item)=>item.first_name.toLowerCase().indexOf(this.state.cname.toLowerCase()) >-1 )
                                    .map((item,i)=><View key={i} style={{flexDirection:"row",paddingHorizontal:10,marginBottom:5}}>
                                    <CheckBox checked={this.state.ids.includes(item.id)} onPress={()=>{
                                        if(this.state.ids.includes(item.id))
                                        {
                                            this.state.ids.splice(this.state.ids.indexOf(item.id),1)
                                        }
                                        else 
                                        {
                                            this.state.ids.push(item.id)
                                        }
                                        this.setState({ids:this.state.ids})
                                    }} ></CheckBox> 
                                    <Text style={{marginHorizontal:20}}>{item.first_name}</Text>
                                </View>)}
                                    
                                    </ScrollView>

                                

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
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
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
                                    <TextInput style={{ padding: 10, height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                        value={this.state.updatename_ar}
                                        onChangeText={(e) => {
                                            var exam = this.state.updateExamItem
                                            exam.name_ar = e
                                            this.setState({ updateExamItem: exam, updatename_ar: e })
                                        }}></TextInput>
                                </View>

                                <View style={{ marginVertical: 10 }}>
                                    <Pressable onPress={() => this.setState({ openDate: true })}>
                                        <Text>{i18n.t('Select Date')}</Text>
                                    </Pressable>

                                    {this.state.openDate && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={new Date(this.state.updatedate)}
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
                                   <Picker 
                                   placeholder={i18n.t("Select One")}
                                   style={{ padding: 10,borderColor:"#000", height: 40, width: '100%', borderWidth: 1, borderRadius: 10 }}
                                   selectedValue={this.state.updatecourseId}
                                   onValueChange={(updatecourseId, itemIndex) => {
                                       
                                       this.setState({ updatecourseId })
                                   }}
                                   >
                                    {this.state.allCourses.map(item=><Picker.Item key={item.id} label={item[`course_name_${i18n.language}`]} value={item.id}  />)}
                                   </Picker>
                                </View>

                                <ScrollView>
                                    {this.state.students.filter((item)=>item.first_name.toLowerCase().indexOf(this.state.cname.toLowerCase()) >-1 )
                                    .map((item,i)=><View key={i} style={{flexDirection:"row",paddingHorizontal:10,marginBottom:5}}>
                                    <CheckBox checked={this.state.uids.includes(item.id)} onPress={()=>{
                                        if(this.state.uids.includes(item.id))
                                        {
                                            this.state.uids.splice(this.state.ids.indexOf(item.id),1)
                                        }
                                        else 
                                        {
                                            this.state.uids.push(item.id)
                                        }
                                        this.setState({uids:this.state.uids})
                                    }} ></CheckBox> 
                                    <Text style={{marginHorizontal:20}}>{item.first_name}</Text>
                                </View>)}
                                    
                                    </ScrollView>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Pressable style={{ position: 'absolute', right: 0, bottom: 10 }}>
                                        <Button onPress={() => this.updateExams()} style={{ backgroundColor: '#579976', width: '100%', padding: 20, color: '#579976' }}><Text style={{ fontWeight: 'bold', color: '#fff' }}>{i18n.t('Submit')}</Text></Button>
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
export default CreateExam


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