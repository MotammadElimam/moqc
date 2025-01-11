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
    FlatList
} from 'react-native';
import { withTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input } from 'native-base';
import GetLocation from 'react-native-get-location'
import axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import DropShadow from "react-native-drop-shadow";
import Footer from "./Footer";
import HeaderTop from "./Header";
import Axios from 'axios';
import i18n from '../i18n';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';


const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class DashboardStudent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            students: "none",
            students_approved: "none",
            students_registered_new: "none",
            students_registered: "none",
            team: "none",
            contact: "none",
            courses: [],
            language: "",
            class_id:null,
            visitor:false
        };

    }

    componentDidMount() {
        this.getCourses()
        this.getLanguage()
        
    }

    async getLanguage() {
        let language = await AsyncStorage.getItem("@moqc:language")
        await this.setState({ language: language })
    }

    getCourses = async () => {
        let class_id = await AsyncStorage.getItem("class_id")
this.setState({class_id})
if(class_id)
{
   
        const response = await axios.get(`https://moqc.ae/api/courses/${class_id}`);
        if (response.status === 200) {
            console.log("cours",class_id,response.data.length)
            await this.setState({ courses: response.data.filter(item=>item.id==class_id) })
        }
    }
    else{
        this.setState({visitor:true})
    }
    }

    renderItem = ({ item }) => (
        <View
            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 2, margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 3 }}>
                <Text>{this.state.language == 'en'? item.course_name_en : item.course_name_ar}</Text>
            </View>
          
            <View style={{ flex: 1 }}>
                <Icon onPress={() => this.props.navigation.navigate("StudentLesson", { course_id: item.id })} active size={20} name='remove-red-eye' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} />
            </View>
        </View>
    );

    render() {
        return (
            <Container style={{ flex: 1 }}>
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                        flex: 10,
                    }}>
                    <Content>
                        {this.state.visitor?<Pressable onPress={()=>this.props.navigation.navigate("Signup")}>
                            <Text style={{textAlign:"center", padding:15,backgroundColor:"#31314f",color:"white",margin:25,borderRadius:15}}>{i18n.t(("Apply to memorize system"))}</Text>
                            </Pressable>: <View
                            style={{ borderBottomWidth: 1, borderBottomColor: '#D5D5D5', padding: 10, backgroundColor: '#D5D5D5', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex:3 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('Course')}</Text>
                            </View>
                            

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{i18n.t('View')}</Text>
                            </View>
                        </View>}
                        {  this.state.visitor?<Text style={{}}></Text>:
                        <FlatList
                            data={this.state.courses}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id}
                        />}
                    </Content>
                </ImageBackground>
                {/* <Footer location={"dashboard"} navigation={this.props.navigation}/> */}
            </Container>
        )
    }
}

export default withTranslation()(DashboardStudent)

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    sectionWrapper: {
        padding: 20
    },
    heading: {
        fontSize: 20,
        margin: 10,
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