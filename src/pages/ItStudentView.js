// import React from 'react';

// import {
//     StyleSheet,
//     View,
//     Text,
//     TextInput,
//     I18nManager,
//     SafeAreaView,
//     ImageBackground,
//     Image,
//     Pressable,
//     FlatList,
//     Modal,
//     Dimensions,
// } from 'react-native';
// import API from "../api/";


// import CheckBox from 'react-native-check-box'
// import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import CourseStudents from './CourseStudents';
// import HeaderTop from './Header'
// import { AsyncStorage } from 'react-native';
// import i18n from '../i18n';
// import axios from 'axios';

// class ItStudentView extends React.Component {

//     constructor(props) {
//         super(props);

//         this.state = {
//             isChecked: false,
//             studentDetail: [],
//             createModal: false,
//             classes: [],
//             student_level: '',
//             student_class: '',
//             emails:[]

//         };
//     }

//     componentDidMount() {
//         this.getStudentDetails()
//         this.getClasses()
//     }

//     getClasses = async () => {
//         let token = await AsyncStorage.getItem("@moqc:token")
//         const response = await axios.get(`https://moqc.ae/api/classes`,
//             {
//                 headers: { "token": token }
//             });
//         if (response.status === 200) {
//             this.setState({ classes: response.data })
//         }
//         axios.get(`https://moqc.ae/api/getEmails`,
//         {
//             headers: { "token": token }
//         }).then(res=>this.setState({emails:res.data}))
//     }

//     getStudentDetails = async () => {
//         var st_id = this.props.route.params.st_id
//         let token = await AsyncStorage.getItem("@moqc:token")
//         const response = await axios.get(`https://moqc.ae/api/students/${st_id}`,
//             {
//                 headers: { "token": token }
//             });
//         if (response.status === 200) {
//             console.log(response.data)
//             this.setState({
//                 studentDetail: response.data, student_level: response.data.student_level,
//                 student_class: response.data.student_class
//             })
//         }
//     }

//     update = async () => {
//         var st_id = this.props.route.params.st_id
//         let token = await AsyncStorage.getItem("@moqc:token")
//         let body = new FormData()
//         body.append("microsoft_email", this.state.studentDetail.microsoft_email)
//         body.append("student_email", this.state.studentDetail.student_email)
//         body.append("password", this.state.studentDetail.password)
//         body.append("student_level", this.state.studentDetail.student_level)
//         body.append("student_class", this.state.studentDetail.student_class)
//         const response = await axios.post(`https://moqc.ae/api/student_update/${st_id}`,
//             body,
//             {
//                 headers: { "token": token }
//             });
//         if (response.status === 200) {
//             this.props.navigation.goBack()
//             this.getStudentDetails()
//         }
//     }

//     render() {

//         var item = this.state.studentDetail
//         return (
//             <View style={{ flex: 10 }}>
//                 {/* <TouchableOpacity onPress={() => this.setState({ createModal: true })} style={{ flexDirection: 'row', marginVertical: 10 }}>
//                     <Icon active size={20} name='add' type="MaterialIcons" style={{ fontSize: 20 }} />
//                     <Text style={{ fontSize: 15 }}>Create New Course</Text>
//                 </TouchableOpacity> */}
//                 <ImageBackground
//                     source={require('../assets/bg_img.png')}
//                     style={{
//                         flex: 10,
//                     }}>
//                     <HeaderTop pagename={"Student Details"} navigation={this.props.navigation} back={true} />

//                     <View style={{ margin: 10 }}>
//                         <View style={{ backgroundColor: '#ffff', borderRadius: 10, borderWidth: 1, borderColor: '#D5D5D5', padding: 10 }}>
//                             <View style={{ backgroundColor: '#F7F8FA', borderRadius: 10,gap:10, padding: 10 }}>
//                                 <View style={{ marginVertical: 5, flexDirection:"row",gap:15 }}>
//                                     <Text style={styles.label}>{i18n.t('Student ID')}:  </Text>
//                                     <Text style={{  }}>{item.student_id}</Text>
//                                 </View>
//                                 <View style={{ marginVertical: 5, }}>
//                                     <Text style={styles.label}>{i18n.t('Student Email')} : </Text>
//                                     <TextInput style={{ padding: 10, height: 50, borderWidth: 1, borderRadius: 10 }}
//                                         onChangeText={(e) => {
//                                             var clas = this.state.studentDetail
//                                             clas.student_email = e
//                                             this.setState({ studentDetail: clas })
//                                         }}>{item.student_email}</TextInput>
//                                 </View>
//                                 <View style={{ marginVertical: 5,   }}>
//                                     <Text style={styles.label}>{i18n.t('Microsoft Email')} : </Text>
//                                     <View  style={{ borderRadius: 10, borderWidth: 1, width: '100%' }}>
//                                     <Picker
//                                             placeholder={i18n.t("Select One")}
//                                             selectedValue={this.state.studentDetail.microsoft_email}
//                                             onValueChange={(microsoft_email, itemIndex) => {
                                                
//                                                 this.setState({ studentDetail:{...this.state.studentDetail,microsoft_email} })
//                                             }}
//                                         >
//                                             {this.state.emails.map(item => {
//                                                 return <Picker.Item label={item.email} value={item.id} />
//                                             })}

//                                         </Picker>
//                                         </View>
//                                 </View>
//                                 <View style={{ marginVertical: 5,  }}>
//                                     <Text style={styles.label}>{i18n.t('Student Password')} : </Text>
//                                     <TextInput style={{ padding: 10, height: 50,  borderWidth: 1, borderRadius: 10 }}
//                                         onChangeText={(e) => {
//                                             var clas = this.state.studentDetail
//                                             clas.password = e
//                                             this.setState({ studentDetail: clas })
//                                         }}></TextInput>
//                                 </View>
//                                 <View style={{ marginVertical: 5, }}>
//                                     <Text style={styles.label}>{i18n.t('Course')} : </Text>
//                                     <View style={{ borderRadius: 10,  borderWidth: 1, width: '100%' }}>
//                                         <Picker
//                                             placeholder={i18n.t("Select One")}
//                                             placeholderStyle={{ color: "#2874F0" }}
                                            
//                                             selectedValue={this.state.student_class}
//                                             onValueChange={(itemValue, itemIndex) => {
//                                                 var clas = this.state.studentDetail
//                                                 clas.student_class = itemValue
//                                                 this.setState({ studentDetail: clas, student_class: itemValue })
//                                             }}
//                                         >
//                                             {this.state.classes.map(item => {
//                                                 return <Picker.Item label={item.class_name} value={item.id} />
//                                             })}

//                                         </Picker>
//                                     </View>
//                                     {/* <TextInput style={{ padding: 10, height: 40, width: '70%', borderWidth: 1, borderRadius: 10 }}>{item.student_class}</TextInput> */}
//                                 </View>
//                                 <View style={{ marginVertical: 5,  }}>
//                                     <Text style={styles.label}>{i18n.t('Student Level')} : </Text>
//                                     <View style={{ borderRadius: 10, borderWidth: 1, width: '100%' }}>
//                                         <Picker
//                                             placeholder={i18n.t("Select One")}
                                           
//                                             selectedValue={this.state.student_level}
//                                             onValueChange={(itemValue, itemIndex) => {
//                                                 var clas = this.state.studentDetail
//                                                 clas.student_level = itemValue
//                                                 this.setState({ student_level: itemValue, studentDetail: clas, })
//                                             }}
//                                         >
//                                             <Picker.Item label={i18n.t("Beginner")} value="1" />
//                                             <Picker.Item label={i18n.t("Medium")} value="2" />
//                                             <Picker.Item label={i18n.t("Excellent")} value="3" />
//                                         </Picker>
//                                     </View>
//                                 </View>

//                                 <Pressable onPress={() => this.update()} style={{ bottom: 0, alignSelf: 'flex-end' }}><Text style={{ fontWeight: 'bold', fontSize: 16, color: 'green' }}>{i18n.t('Update')}</Text></Pressable>
//                                  <View>
//                                                  <TouchableOpacity
//                                                  style={{ padding: 10,marginTop:5, color: '#ffff',textAlign:"center", backgroundColor: '#222643', fontWeight: 'bold', borderRadius: 10 }}
//                                                >
//                                                     <Text style={{color:"#fff",textAlign:"center"}} >{i18n.t('Create Microsoft Email')}</Text>
//                                                     </TouchableOpacity>
//                                                 </View>
//                             </View>
//                         </View>
//                     </View>

//                 </ImageBackground>
//             </View>
//         )
//     }
// }
// export default ItStudentView

// const styles = StyleSheet.create({
//     wrapper: {
//         flex: 1
//     },
//     label:{
//         fontWeight:"500",
//         textAlign:"left"
//     },
//     sectionWrapper: {
//         padding: 20
//     },
//     heading: {
//         borderWidth: 1,
//         fontSize: 20,
//         margin: 15,
//         borderRadius: 10,
//         borderColor: "#2b8634",
//         textAlign: "center"
//     },
//     image: {
//         width: '100%',
//         height: '100%'
//     },
//     regularText: {
//         textAlign: 'left'
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between'
//     },
//     textInput: {
//         textAlign: I18nManager.isRTL
//             ? 'right'
//             : 'left'
//     },
//     centeredView: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         marginTop: 22,
//         backgroundColor: 'rgba(0,0,0,0.7)'
//     },
//     modalView: {
//         marginHorizontal: 10,
//         width: 350,
//         height: "55%",
//         backgroundColor: "white",
//         borderRadius: 20,
//         padding: 20,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     button: {
//         borderRadius: 20,
//         padding: 10,
//         elevation: 2
//     },
//     buttonOpen: {
//         backgroundColor: "#F194FF",
//     },
//     buttonClose: {
//         backgroundColor: "#2196F3",
//     },
//     textStyle: {
//         color: "white",
//         fontWeight: "bold",
//         textAlign: "center"
//     },
//     modalText: {
//         marginBottom: 15,
//         textAlign: "center"
//     }
// });

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
    Alert,
    ActivityIndicator,
} from 'react-native';
import API from "../api/";
import CheckBox from 'react-native-check-box';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CourseStudents from './CourseStudents';
import HeaderTop from './Header';
import { AsyncStorage } from 'react-native';
import i18n from '../i18n';
import axios from 'axios';

class ItStudentView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            studentDetail: [],
            createModal: false,
            classes: [],
            student_level: '',
            student_class: '',
            emails: [],
            microsoftEmail: '',
            microsoftPassword: '',
            emailInsertId: null,
            showEmailCredentials: false,
            isCreatingEmail: false,
            isAssigningEmail: false,
        };
    }

    componentDidMount() {
        this.getStudentDetails();
        this.getClasses();
    }

    getClasses = async () => {
        try {
            let token = await AsyncStorage.getItem("@moqc:token");
            const response = await axios.get(
                'https://moqc.ae/api/classes',
                {
                    headers: { "token": token }
                }
            );
            if (response.status === 200) {
                this.setState({ classes: response.data });
            }

            const emailsResponse = await axios.get(
                'https://moqc.ae/api/getEmails',
                {
                    headers: { "token": token }
                }
            );
            this.setState({ emails: emailsResponse.data });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    getStudentDetails = async () => {
        try {
            const st_id = this.props.route.params.st_id;
            let token = await AsyncStorage.getItem("@moqc:token");
            const response = await axios.get(
                `https://moqc.ae/api/students/${st_id}`,
                {
                    headers: { "token": token }
                }
            );
            if (response.status === 200) {
                this.setState({
                    studentDetail: response.data,
                    student_level: response.data.student_level,
                    student_class: response.data.student_class
                });
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    }

    update = async () => {
        try {
            const st_id = this.props.route.params.st_id;
            let token = await AsyncStorage.getItem("@moqc:token");
            let body = new FormData();
            body.append("microsoft_email", this.state.studentDetail.microsoft_email);
            body.append("student_email", this.state.studentDetail.student_email);
            body.append("password", this.state.studentDetail.password);
            body.append("student_level", this.state.studentDetail.student_level);
            body.append("student_class", this.state.studentDetail.student_class);

            const response = await axios.post(
                `https://moqc.ae/api/student_update/${st_id}`,
                body,
                {
                    headers: { "token": token }
                }
            );
            if (response.status === 200) {
                this.props.navigation.goBack();
                this.getStudentDetails();
            }
        } catch (error) {
            console.error('Error updating student:', error);
            Alert.alert('Error', 'Failed to update student details');
        }
    }

    generateMicrosoftEmail = async () => {
        this.setState({ isCreatingEmail: true });
        try {
            let token = await AsyncStorage.getItem("@moqc:token");
            const response = await axios.get(
                'https://moqc.ae/api/generateMicrosoftUser',
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            
            if (response.status === 200 && response?.error) {
                this.setState({
                    microsoftEmail: response.data.email,
                    microsoftPassword: response.data.password,
                    emailInsertId: response.data.insert_id,
                    showEmailCredentials: true
                });
            }
            else  {
                Alert.alert(i18n.t('ُError'), i18n.t('Failed to generate Microsoft email'));
            }
        } catch (error) {
            console.error('Error generating Microsoft email:', error);
            Alert.alert(i18n.t('ُError'), i18n.t('Failed to generate Microsoft email'));
        } finally {
            this.setState({ isCreatingEmail: false });
        }
    }

    assignEmailToStudent = async () => {
        this.setState({ isAssigningEmail: true });
        try {
            let token = await AsyncStorage.getItem("@moqc:token");
            const response = await axios.post(
                'https://moqc.ae/api/assignEmail',
                {
                    email_id: this.state.emailInsertId,
                    student_id: this.props.route.params.st_id
                },
                {
                    headers: {
                        "token": token
                    }
                }
            );
            
            if (response.status === 200) {
                Alert.alert(i18n.t('email assigned successfully'), response.data.message, [
                    {
                        text: 'OK',
                        onPress: () => {
                            this.props.navigation.goBack();
                        }
                    }
                ]);
            }
        } catch (error) {
            console.error('Error assigning email:', error);
            Alert.alert(i18n.t('Error'), i18n.t('Failed to assign email'));
        } finally {
            this.setState({ isAssigningEmail: false });
        }
    }

    render() {
        const { studentDetail, isCreatingEmail, isAssigningEmail } = this.state;

        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={styles.backgroundImage}
                >
                    <HeaderTop 
                        pagename="Student Details" 
                        navigation={this.props.navigation} 
                        back={true} 
                    />

                    <View style={styles.contentContainer}>
                        <View style={styles.card}>
                            <View style={styles.formContainer}>
                                {/* <View style={styles.fieldRow}>
                                    <Text style={styles.label}>{i18n.t('Student ID')}: </Text>
                                    <Text>{studentDetail.student_id}</Text>
                                </View> */}

                                <View style={styles.fieldRow}>
                                    <Text style={styles.label}>{i18n.t('Name')}: </Text>
                                    <Text>{studentDetail.first_name}</Text>
                                </View>
                                <View style={styles.fieldRow}>
                                    <Text style={styles.label}>{i18n.t('Teacher Note')}: </Text>
                                    <Text>{studentDetail.teacher_message}</Text>
                                </View>

                                {/* <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>{i18n.t('Student Email')}: </Text>
                                    <TextInput
                                        style={styles.input}
                                        value={studentDetail.student_email}
                                        onChangeText={(e) => {
                                            this.setState({
                                                studentDetail: {
                                                    ...studentDetail,
                                                    student_email: e
                                                }
                                            });
                                        }}
                                    />
                                </View> */}

                                {/* <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>{i18n.t('Microsoft Email')}: </Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={studentDetail.microsoft_email}
                                            onValueChange={(microsoft_email) => {
                                                this.setState({
                                                    studentDetail: {
                                                        ...studentDetail,
                                                        microsoft_email
                                                    }
                                                });
                                            }}
                                        >
                                            {this.state.emails.map(item => (
                                                <Picker.Item 
                                                    key={item.id}
                                                    label={item.email} 
                                                    value={item.id} 
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                </View> */}

                                {/* <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>{i18n.t('Student Password')}: </Text>
                                    <TextInput
                                        style={styles.input}
                                        value={studentDetail.password}
                                        onChangeText={(e) => {
                                            this.setState({
                                                studentDetail: {
                                                    ...studentDetail,
                                                    password: e
                                                }
                                            });
                                        }}
                                        secureTextEntry
                                    />
                                </View> */}

                                {/* <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>{i18n.t('Course')}: </Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={this.state.student_class}
                                            onValueChange={(itemValue) => {
                                                this.setState({
                                                    studentDetail: {
                                                        ...studentDetail,
                                                        student_class: itemValue
                                                    },
                                                    student_class: itemValue
                                                });
                                            }}
                                        >
                                            {this.state.classes.map(item => (
                                                <Picker.Item 
                                                    key={item.id}
                                                    label={item.class_name} 
                                                    value={item.id} 
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                </View> */}

                                {/* <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>{i18n.t('Student Level')}: </Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={this.state.student_level}
                                            onValueChange={(itemValue) => {
                                                this.setState({
                                                    studentDetail: {
                                                        ...studentDetail,
                                                        student_level: itemValue
                                                    },
                                                    student_level: itemValue
                                                });
                                            }}
                                        >
                                            <Picker.Item label={i18n.t("Beginner")} value="1" />
                                            <Picker.Item label={i18n.t("Medium")} value="2" />
                                            <Picker.Item label={i18n.t("Excellent")} value="3" />
                                        </Picker>
                                    </View>
                                </View> */}

                                {/* <TouchableOpacity 
                                    style={styles.updateButton}
                                    onPress={this.update}
                                >
                                    <Text style={styles.updateButtonText}>
                                        {i18n.t('Update')}
                                    </Text>
                                </TouchableOpacity> */}

                                {!this.state.showEmailCredentials ? (
                                    <TouchableOpacity
                                        style={[styles.microsoftButton, isCreatingEmail && styles.disabledButton]}
                                        onPress={this.generateMicrosoftEmail}
                                        disabled={isCreatingEmail}
                                    >
                                        {isCreatingEmail ? (
                                            <ActivityIndicator color="#ffffff" />
                                        ) : (
                                            <Text style={styles.buttonText}>
                                                {i18n.t('Create Microsoft Email')}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.credentialsContainer}>
                                        <View style={styles.credentialItem}>
                                            <Text style={styles.credentialLabel}>{i18n.t('Email')} </Text>
                                            <Text style={styles.credentialValue}>
                                                {this.state.microsoftEmail}
                                            </Text>
                                        </View>
                                        <View style={styles.credentialItem}>
                                            <Text style={styles.credentialLabel}>{i18n.t('password')}</Text>
                                            <Text style={styles.credentialValue}>
                                                {this.state.microsoftPassword}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.microsoftButton, isAssigningEmail && styles.disabledButton]}
                                            onPress={this.assignEmailToStudent}
                                            disabled={isAssigningEmail}
                                        >
                                            {isAssigningEmail ? (
                                                <ActivityIndicator color="#ffffff" />
                                            ) : (
                                                <Text style={styles.buttonText}>
                                                    {i18n.t('Assign Email ID')}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 10,
//     },
//     backgroundImage: {
//         flex: 10,
//     },
//     contentContainer: {
//         margin: 10,
//     },
//     card: {
//         backgroundColor: '#ffffff',
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#D5D5D5',
//         padding: 10,
//     },
//     formContainer: {
//         backgroundColor: '#F7F8FA',
//         borderRadius: 10,
//         padding: 15,
//         gap: 10,
//     },
//     fieldRow: {
//         flexDirection: 'row',
//         gap: 15,
//         marginVertical: 5,
//     },
//     fieldGroup: {
//         marginVertical: 5,
//     },
//     label: {
//         fontWeight: '500',
//         marginBottom: 5,
//     },
//     input: {
//         padding: 10,
//         height: 50,
//         borderWidth: 1,
//         borderRadius: 10,
//         backgroundColor: '#ffffff',
//     },
//     pickerContainer: {
//         borderRadius: 10,
//         borderWidth: 1,
//         backgroundColor: '#ffffff',
//     },
//     updateButton: {
//         alignSelf: 'flex-end',
//         padding: 10,
//         marginTop: 10,
//     },
//     updateButtonText: {
//         fontWeight: 'bold',
//         fontSize: 16,
//         color: 'green',
//     },
//     microsoftButton: {
//         padding: 12,
//         marginTop: 10,
//         backgroundColor: '#222643',
//         borderRadius: 10,
//         minHeight: 48,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     assignButton: {
//         padding: 12,
//         marginTop: 10

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 10,
    },
    contentContainer: {
        margin: 10,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        padding: 10,
    },
    formContainer: {
        backgroundColor: '#F7F8FA',
        borderRadius: 10,
        padding: 15,
        gap: 10,
    },
    fieldRow: {
        flexDirection: 'row',
        gap: 15,
        marginVertical: 5,
    },
    fieldGroup: {
        marginVertical: 5,
    },
    label: {
        fontWeight: '500',
        marginBottom: 5,
    },
    input: {
        padding: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#ffffff',
    },
    pickerContainer: {
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#ffffff',
    },
    updateButton: {
        alignSelf: 'flex-end',
        padding: 10,
        marginTop: 10,
    },
    updateButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'green',
    },
    microsoftButton: {
        padding: 12,
        marginTop: 10,
        backgroundColor: '#222643',
        borderRadius: 10,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    assignButton: {
        padding: 12,
        marginTop: 10},
    container: {
        flex: 10,
    },
    backgroundImage: {
        flex: 10,
    },
    contentContainer: {
        margin: 10,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D5D5D5',
        padding: 10,
    },
    formContainer: {
        backgroundColor: '#F7F8FA',
        borderRadius: 10,
        padding: 15,
        gap: 10,
    },
    fieldRow: {
        flexDirection: 'row',
        gap: 15,
        marginVertical: 5,
    },
    fieldGroup: {
        marginVertical: 5,
    },
    label: {
        fontWeight: '500',
        marginBottom: 5,
    },
    input: {
        padding: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#ffffff',
    },
    pickerContainer: {
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#ffffff',
    },
    updateButton: {
        alignSelf: 'flex-end',
        padding: 10,
        marginTop: 10,
    },
    updateButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'green',
    },
    microsoftButton: {
        padding: 12,
        marginTop: 10,
        backgroundColor: '#222643',
        borderRadius: 10,
    },
    assignButton: {
        padding: 12,
        marginTop: 10,
        backgroundColor: '#2b8634',
        borderRadius: 10,
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    credentialsContainer: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    credentialItem: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
    },
    credentialLabel: {
        fontWeight: '500',
        width: 80,
    },
    credentialValue: {
        flex: 1,
        color: '#222643',
    },
});

export default ItStudentView