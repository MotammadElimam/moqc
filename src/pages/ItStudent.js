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
    Pressable,
    FlatList,
    Modal,
    Dimensions,
} from 'react-native';
import API from "../api/";


import CheckBox from 'react-native-check-box'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CourseStudents from './CourseStudents';
import { AsyncStorage } from 'react-native';
import i18n from '../i18n';
import { ActivityIndicator } from 'react-native-paper';
import HeaderTop from './Header'
import axios from 'axios';


class ItStudent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            courses: [],
            show_spinner: true,
            searchText: '',
            per_page: 10,
            page: 1,
            pages: 1,
            from: 1,
            to: 10

        };
    }

    componentDidMount() {
        this.getStudents()
    }

    getStudents = async () => {
        this.setState({ show_spinner: true })
        let token = await AsyncStorage.getItem("@moqc:token")
        const response = await axios.get(`https://moqc.ae/api/students`,
            {
                headers: { "token": token }
            });
            console.l
        if (response.status === 200) {
            this.setState({ show_spinner: false })
            this.setState({
                students: response.data,
                pages: response.data.total_results,
                from: response.data.from,
                to: response.data.to,
            })
        }
    }


    renderItem = ({ item }) => (

        <View style={{marginHorizontal:10,borderRadius:10,borderColor:"#999",borderWidth:1,paddingHorizontal:10,paddingVertical:5,marginBottom:10}}>
           
                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <View>
                    <Text style={{ fontWeight: 'bold' }}>{i18n.t('Name')}</Text> 
                    <Text>   {item.first_name }</Text>
                    </View>

                    <View>
                    <Text style={{ fontWeight: 'bold' }}>{i18n.t('Email')}</Text> 
                    <Text>    {item.student_email}</Text>
                    </View>
                  
                    
                    
                </View>
                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <View>
                    <Text style={{ fontWeight: 'bold',textAlign:"left" }}>{i18n.t('Phone')}</Text> 
                     <Text>   {item.contact_phone}</Text>
                    </View>
                    <View>
                    <Text style={{ fontWeight: 'bold',textAlign:"left" }}>{i18n.t('Course')}</Text> 
                     <Text>   {item.course[`course_name_${i18n.language}`]}</Text>
                    </View>
                    
                </View>
               
               
           
            <View>
                 <TouchableOpacity
                 style={{ padding: 10,marginTop:5, color: '#ffff',textAlign:"center", backgroundColor: '#222643', fontWeight: 'bold', borderRadius: 10 }}
                  onPress={() => this.props.navigation.navigate("ItStudentView", { st_id: item.id })}
               >
                    <Text style={{color:"#fff",textAlign:"center"}} >{i18n.t('View')}</Text>
                    </TouchableOpacity>
                </View>
        </View>

    );

    render() {
        return (
            <View style={{ flex: 10 }}>
                {/* <TouchableOpacity onPress={() => this.setState({ createModal: true })} style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <Icon active size={20} name='add' type="MaterialIcons" style={{ fontSize: 20 }} />
                    <Text style={{ fontSize: 15 }}>Create New Course</Text>
                </TouchableOpacity> */}
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    <HeaderTop pagename={i18n.t("Students")} navigation={this.props.navigation} back={true} />

                    <View style={styles.input}>
                        <Icon active size={20} name='search' type="MaterialIcons" style={{ left: 0, fontSize: 20, padding: 6, borderRadius: 30 }} />
                        <TextInput
                            onChangeText={(text) => { this.setState({ searchText: text }); this.getStudents() }}
                            placeholder='Search'
                        />
                    </View>

                    {this.state.show_spinner ? <ActivityIndicator color='green' size="large" /> :
                        <FlatList
                            data={this.state.students}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id}
                        />}

                    <View style={{ marginVertical: 5, flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ padding: 5 }}>
                            {i18n.t('Showing')} {this.state.from}-{this.state.to}
                        </Text>
                        <View style={{ flexDirection: "row", borderWidth: 1, borderRadius: 8, height: 30 }}>
                            <TouchableOpacity disabled={this.state.page <= 1} onPress={() => { this.setState({ page: this.state.page - 1 }); this.getStudents() }}>
                                <Text style={{ padding: 5 }}>{i18n.t('Previous')}</Text>
                            </TouchableOpacity>
                            <Text style={{ width: 20, textAlign: "center", backgroundColor: "#CFDED5", padding: 5 }}>
                                {this.state.page}
                            </Text>
                            <TouchableOpacity disabled={this.state.page >= this.state.pages} style={{ padding: 5 }} onPress={() => { this.setState({ page: this.state.page + 1 }); this.getStudents() }}>
                                <Text>{i18n.t('Next')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}
export default ItStudent

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    sectionWrapper: {
        padding: 20
    },
    heading: {
        borderWidth: 1,
        fontSize: 20,
        margin: 15,
        borderRadius: 10,
        borderColor: "#2b8634",
        textAlign: "center"
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
    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        width: '90%',
        borderRadius: 10,
        flexDirection: 'row',
        borderColor: '#000'
    },
});