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
    FlatList,
    ActivityIndicator,
    Linking
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DocumentPicker from "react-native-document-picker";
import ActionButton from 'react-native-action-button';
import Axios from 'axios'
import HeaderTop from "./Header";
import { open } from '../store';
import { Backdrop } from 'react-native-backdrop';
import i18n from '../i18n';
import axios from 'axios';


class ExamReport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isChecked: false,
            students: [],
            createModal: false,
            result: [],
        }
    }

    componentDidMount() {
        this.getResult()
    }

    getResult = async () => {
        open.next(true)
        var exam_id = this.props.route.params.exam_id
        const response = await axios.get(`https://moqc.ae/api/results_view/${exam_id}`);
        if (response.status === 200) {
            console.log(response.data,exam_id)
            this.setState({ result: response.data })
            open.next(false)
        }
    }

    async updateResult() {
        var exam_id = this.props.route.params.exam_id
        var body = new FormData()
        body.append("id", exam_id)
        body.append("students", JSON.stringify(this.state.result))
        const response = await axios.post(`https://moqc.ae/api/results_update/${exam_id}`, body);
    }

    renderItem = ({ item }) => (
        <View
            style={{ borderWidth: 1, borderColor: '#D5D5D5', paddingHorizontal: 12, margin: 10,paddingVertical:6,borderRadius:12 }}>
            <View >
                <Text style={styles.label}>{i18n.t("Name")}</Text>
                <Text style={styles.label}>{item.first_name + ' ' + item.last_name}</Text>
            </View>
            <View>
                <View style={styles.exam_item}>
                <View >
                <Text style={styles.label}>{i18n.t("Result")}</Text>
                <Text style={styles.label}>{item.result||'-'}</Text>
            </View>

            <View >
                <Text style={styles.label} >{i18n.t("Exam Report")}</Text>
                {item.report?<Icon onPress={() =>  Linking.openURL("https://moqc.ae/assets/uploads/"+item.report)} active size={20} name='file-download' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} />:<Text style={styles.label}>{'-'}</Text>}
            </View>

                </View>
                <View >
                <Text style={styles.label} >{i18n.t("Notes")}</Text>
                <Text style={styles.label}>{item.note||'-'}</Text>
            </View>
           

            </View>
            {/* <Backdrop
                visible={open}
            >
                <View>
                    <ActivityIndicator />
                </View>
            </Backdrop> */}
            {/* <View style={{ flex: 1 }}>
                <TextInput style={{ padding: 10, height: 40, borderWidth: 1, borderRadius: 10 }}
                    value={item.result}
                    onChangeText={(e) => {
                        item.result = e
                        this.setState({ result: this.state.result })
                    }}>
                </TextInput>
            </View> */}
        </View>

    );

    render() {
        return (
            <ScrollView>
                <View style={{ flex: 10 }}>
                    <HeaderTop pagename={i18n.t("Report")} navigation={this.props.navigation} back={true} />

                    <ImageBackground
                        source={require('../assets/bg_img.png')}
                        style={{
                            flex: 10,
                        }}>

                        <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginVertical: 5, fontSize: 16 }}>{i18n.t('Exam')}: {this.props.route.params?.exam?.[`name_${i18n.language}`]}</Text>
                            <Text style={{ marginVertical: 5, fontSize: 16 }}>{i18n.t('Date')} : {this.props.route.params.date}</Text>
                        </View>

                        
                        <FlatList
                            data={this.state.result}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id}
                        />

                        {/* <Pressable style={{ margin: 10, backgroundColor: '#579976', padding: 10, justifyContent: 'center', alignItems: 'center', width: '20%', borderWidth: 1, borderRadius: 10 }}
                            onPress={() => this.updateResult()}>
                            <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 15 }} >{i18n.t('Save')}</Text>
                        </Pressable> */}

                    </ImageBackground>
                </View>
            </ScrollView>
        );
    }
}
export default ExamReport


const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    label:{
        textAlign:"left"
    },
    exam_item:{
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center"
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