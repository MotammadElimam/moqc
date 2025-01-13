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
// const Axios = require('axios');

// import CheckBox from 'react-native-check-box'
// import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import CourseStudents from './CourseStudents';
// import { AsyncStorage } from 'react-native';
// import i18n from '../i18n';
// import { ActivityIndicator } from 'react-native-paper';
// import HeaderTop from './Header'
// import axios from 'axios';


// class ItApprovedStudent extends React.Component {

//     constructor(props) {
//         super(props);

//         this.state = {
//             isChecked: false,
//             students: [],
//             createModal: false,
//             courses: [],
//             show_spinner: true,
//             searchText: '',
//             per_page: 10,
//             page: 1,
//             pages: 1,
//             from: 1,
//             to: 10,
//             name:"",

//         };
//     }

//     componentDidMount() {
//         this.getStudents()
//         console.log("this.getStudents()", this.getStudents())
//         console.log("students", this.state.students)
//     }

//     getStudents = async () => {
//         this.setState({ show_spinner: true })
//         let token = await AsyncStorage.getItem("@moqc:token")
//         const response = await axios.get(`https://moqc.ae/api/students?new=1`,
//             {
//                 headers: { "token": token }
//             });
//         if (response.status === 200) {

//             console.log("response", response)
           
//             this.setState({ show_spinner: false })
//             this.setState({
//                 students: response.data,
//                 pages: response.data.total_results,
//                 from: response.data.from,
//                 to: response.data.to,
//             })
//         }

//         axios.get(`https://moqc.ae/api/courses`,
//         {
//             headers: { "token": token }
//         }).then(res=>{
//             this.setState({
//                 courses:res.data
//             })
//         })
//     }


//     renderItem = ({ item }) => (

//         <View style={{marginHorizontal:10,borderRadius:10,borderColor:"#999",borderWidth:1,paddingHorizontal:10,paddingVertical:5,marginBottom:10}}>
           
//                 <View style={{flexDirection:"row",justifyContent:"space-between"}}>
//                     <View>
//                     <Text style={{ fontWeight: 'bold' }}>{i18n.t('Name')}</Text> 
//                     <Text>   {item.first_name}</Text>
//                     </View>

//                     <View>
//                     <Text style={{ fontWeight: 'bold' }}>{i18n.t('Email')}</Text> 
//                     <Text>    {item.student_email}</Text>
//                     </View>
                  
                    
                    
//                 </View>
//                 <View style={{flexDirection:"row",justifyContent:"space-between"}}>
//                     <View>
//                     <Text style={{ fontWeight: 'bold',textAlign:"left" }}>{i18n.t('Phone')}</Text> 
//                      <Text>   {item.contact_phone}</Text>
//                     </View>
//                     <View>
//                     <Text style={{ fontWeight: 'bold',textAlign:"left" }}>{i18n.t('Course')}</Text> 
//                      <Text>   {item.course[`course_name_${i18n.language}`]}</Text>
//                     </View>
                    
//                 </View>
               
               
           
//             <View>
//                  <TouchableOpacity
//                  style={{ padding: 10,marginTop:5, color: '#ffff',textAlign:"center", backgroundColor: '#222643', fontWeight: 'bold', borderRadius: 10 }}
//                   onPress={() => this.props.navigation.navigate("ItStudentView", { st_id: item.id })}
//                >
//                     <Text style={{color:"#fff",textAlign:"center"}} >{i18n.t('View')}</Text>
//                     </TouchableOpacity>
//                 </View>
//         </View>

//     );

   

//     render() {
//         return (
//             <View >
//                 {/* <TouchableOpacity onPress={() => this.setState({ createModal: true })} style={{ flexDirection: 'row', marginVertical: 10 }}>
//                     <Icon active size={20} name='add' type="MaterialIcons" style={{ fontSize: 20 }} />
//                     <Text style={{ fontSize: 15 }}>Create New Course</Text>
//                 </TouchableOpacity> */}
//                 <ImageBackground
//                     source={require('../assets/bg_img.png')}
//                     style={{
                       
//                     }}>
//                     <HeaderTop pagename={i18n.t("Students")} navigation={this.props.navigation} back={true} />

//                     <View style={styles.input}>
//                         <Icon active size={25} name='search' type="MaterialIcons" style={{ left: 0, fontSize: 25, padding: 6, borderRadius: 30 }} />
//                         <TextInput
//                             onChangeText={(text) => { this.setState({ searchText: text });  }}
//                             placeholder='Search'
//                         />
//                     </View>
//                     <View>
//                     {this.state.show_spinner ? <ActivityIndicator color='green' size="large" /> :
//                         <FlatList
//                             data={this.state.students.filter(item=>item.first_name.toLowerCase().indexOf(this.state.searchText) >-1)}
//                             renderItem={this.renderItem}
//                             keyExtractor={item => item.id}
//                         />}
//                         </View>

//                     {/* <View style={{ marginVertical: 5, flexDirection: "row", justifyContent: "space-between" }}>
//                         <Text style={{ padding: 5 }}>
//                             {i18n.t('Showing')} {this.state.from}-{this.state.to}
//                         </Text>
//                         <View style={{ flexDirection: "row", borderWidth: 1, borderRadius: 8, height: 30 }}>
//                             <TouchableOpacity disabled={this.state.page <= 1} onPress={() => { this.setState({ page: this.state.page - 1 }); this.getStudents() }}>
//                                 <Text style={{ padding: 5 }}>{i18n.t('Previous')}</Text>
//                             </TouchableOpacity>
//                             <Text style={{ width: 20, textAlign: "center", backgroundColor: "#CFDED5", padding: 5 }}>
//                                 {this.state.page}
//                             </Text>
//                             <TouchableOpacity disabled={this.state.page >= this.state.pages} style={{ padding: 5 }} onPress={() => { this.setState({ page: this.state.page + 1 }); this.getStudents() }}>
//                                 <Text>{i18n.t('Next')}</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View> */}
//                 </ImageBackground>
//             </View>
//         )
//     }
// }
// export default ItApprovedStudent

// const styles = StyleSheet.create({
//     wrapper: {
//         flex: 1
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
//     input: {
//         height: 40,
//         margin: 10,
//         borderWidth: 1,
//         width: '90%',
//         borderRadius: 10,
//         flexDirection: 'row',
//         borderColor: '#000'
//     },
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
} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Content, Item, Input, Picker, Form } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import i18n from '../i18n';
import HeaderTop from './Header';

class ItApprovedStudent extends React.Component {
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
            to: 10,
            name: "",
        };
    }

    componentDidMount() {
        this.getStudents();
    }

    getStudents = async () => {
        this.setState({ show_spinner: true });
        try {
            let token = await AsyncStorage.getItem("@moqc:token");
            const response = await axios.get(`https://moqc.ae/api/students?new=1`,
                {
                    headers: { "token": token }
                });
            
            if (response.status === 200) {
                this.setState({
                    students: response.data,
                    pages: response.data.total_results,
                    from: response.data.from,
                    to: response.data.to,
                    show_spinner: false
                });
            }

            const coursesResponse = await axios.get(`https://moqc.ae/api/courses`,
                {
                    headers: { "token": token }
                });
            
            this.setState({
                courses: coursesResponse.data
            });
        } catch (error) {
            console.error("Error fetching students:", error);
            this.setState({ show_spinner: false });
        }
    }

    backToTeacher = async (id) => {
        try {
            let token = await AsyncStorage.getItem("@moqc:token");
            const response = await axios.get(`https://moqc.ae/api/student_back_to_teacher/${id}`, {
                headers: { "token": token }
            });
            
            if (response.data.success === true) {
                // Re-fetch students list if successful
                this.getStudents();
            }
        } catch (error) {
            console.error("Error sending student back to teacher:", error);
        }
    }

    renderItem = ({ item }) => (
        <View style={styles.studentCard}>
            <View style={styles.rowBetween}>
                <View>
                    <Text style={styles.labelText}>{i18n.t('Name')}</Text> 
                    <Text style={styles.valueText}>{item.first_name}</Text>
                </View>
                <View>
                    <Text style={styles.labelText}>{i18n.t('Email')}</Text> 
                    <Text style={styles.valueText}>{item.student_email}</Text>
                </View>
            </View>
            
            <View style={styles.rowBetween}>
                <View>
                    <Text style={styles.labelText}>{i18n.t('Phone')}</Text> 
                    <Text style={styles.valueText}>{item.contact_phone}</Text>
                </View>
                <View>
                    <Text style={styles.labelText}>{i18n.t('Course')}</Text> 
                    <Text style={styles.valueText}>{item.course[`course_name_${i18n.language}`]}</Text>
                </View>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => this.props.navigation.navigate("ItStudentView", { st_id: item.id })}
                >
                    <Text style={styles.buttonText}>{i18n.t('Assign Email ID')}</Text>
                </TouchableOpacity>
                <View style={{height:10}}  />
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => this.backToTeacher(item.id)}
                >
                    <Text style={styles.buttonText}>{i18n.t('Back to Teacher')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={styles.backgroundImage}
                >
                    <HeaderTop 
                        pagename={i18n.t("Students")} 
                        navigation={this.props.navigation} 
                        back={true} 
                    />

                    <View style={styles.searchContainer}>
                        <Icon 
                            active 
                            size={25} 
                            name='search' 
                            type="MaterialIcons" 
                            style={styles.searchIcon} 
                        />
                        <TextInput
                            style={styles.searchInput}
                            onChangeText={(text) => this.setState({ searchText: text })}
                            placeholder={i18n.t('Search')}
                        />
                    </View>

                    <View style={styles.listContainer}>
                        {this.state.show_spinner ? (
                            <ActivityIndicator color='green' size="large" />
                        ) : (
                            <FlatList
                                data={this.state.students.filter(item => 
                                    item.first_name.toLowerCase().includes(this.state.searchText.toLowerCase())
                                )}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id.toString()}
                            />
                        )}
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
    },
    searchContainer: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        width: '90%',
        borderRadius: 10,
        flexDirection: 'row',
        borderColor: '#000',
        alignItems: 'center',
    },
    searchIcon: {
        fontSize: 25,
        padding: 6,
        borderRadius: 30,
    },
    searchInput: {
        flex: 1,
        padding: 5,
    },
    listContainer: {
        flex: 1,
        padding: 10,
    },
    studentCard: {
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10,
        borderColor: "#999",
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    labelText: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    valueText: {
        marginLeft: 5,
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: 10,
        marginTop: 5,
    },
    viewButton: {
        padding: 10,
        backgroundColor: '#222643',
        borderRadius: 10,
    },
    backButton: {
        padding: 10,
        backgroundColor: '#28a745',
        borderRadius: 10,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
    },
});

export default ItApprovedStudent;