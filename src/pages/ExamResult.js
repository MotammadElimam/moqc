
import React, { useEffect, useState } from "react"
import { FlatList, Linking, StyleSheet, Text, View,AsyncStorage} from 'react-native'
import Header from "./Header"
import i18n from '../i18n';
import axios from "axios";

import ManageResult from "./ManageResult";
import { Button, Icon } from "native-base";


const ExamResult=(props)=>{
    const exam=props.route.params?.exam
    const [selectdResult,setSelectedResult]=useState({})
    const [results,setResults]=useState([])
    useEffect(()=>{
        getResults()
    },[])

    const [isOpen,setOpen]=useState(false)


    const getResults=async()=>{
        var token=await AsyncStorage.getItem('@moqc:token')
         axios.get("https://moqc.ae/api/exam_results/"+exam?.id,{headers:{token:token}}).then(res=>{
            setResults(res.data)
            console.log(res.data)
         }).catch(e=>{
            console.log(e.response?.data)
         })
    }

    return <View style={{flex:1}}>
        <Header pagename={i18n.t("Exam Result")} navigation={props.navigation} back={true} />
        <View style={style.container}>
            <View style={style.examContainer}>
                <View>
                    <Text style={style.title}>{i18n.t("Exam")}</Text>
                    <Text>{exam?.[`name_${i18n.language}`]}</Text>
                </View>
                <View>
                    <Text style={style.title}>{i18n.t("Date")}</Text>
                    <Text>{exam?.[`date`]}</Text>
                </View>
            </View>

            <Text style={style.title} >{i18n.t("Students List")}</Text>

            <FlatList data={results} renderItem={({item})=><View  style={{ borderWidth: 1, borderColor: '#D5D5D5', paddingHorizontal: 12, margin: 10,paddingVertical:6,borderRadius:12 }}>
          
            <View >
                <Text style={style.label}>{i18n.t("Name")}</Text>
                <Text style={style.label}>{item.first_name + ' ' + item.last_name}</Text>
            </View>
            <View>
                <View style={style.exam_item}>
                <View >
                <Text style={style.label}>{i18n.t("Result")}</Text>
                <Text style={style.label}>{item.result||'-'}</Text>
            </View>

    
            <Text style={style.label} >{i18n.t("Exam Report")}</Text>


            <View >
               
                {item.report?<Icon onPress={() => Linking.openURL("https://moqc.ae/assets/uploads/"+item.report)} active size={20} name='file-download' type="MaterialIcons" style={{ color: "#31314f", fontSize: 20 }} />:<Text style={style.label}>{'-'}</Text>}
            </View>

                </View>
                <View >
                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
<View>
<Text style={style.label} >{i18n.t("Notes")}</Text>
<Text style={style.label}>{item.note||'-'}</Text>
</View>
<View>
<Text style={style.label} >{i18n.t("Action")}</Text>
<Button 
onPress={()=>{
    setSelectedResult({...item,exam_id:exam.id,student_id:item.id})
    setOpen(true)
}}
style={{backgroundColor:"#fff0",borderRadius:10,borderWidth:1,borderColor:"#999",paddingHorizontal:10,marginTop:5}}>
    <Text>{i18n.t("Update")}</Text>
</Button>
</View>
    </View>
                
               
            </View>
           

            </View>
            </View>} />

        </View>

        <ManageResult isOpen={isOpen} item={selectdResult} onClose={()=>{
            getResults()
            setOpen(false)}} />
    </View>
}

const style=StyleSheet.create({
    container:{
        paddingHorizontal:12,
        paddingVertical:10,
        backgroundColor:"#fff",
        flex:1,
        gap:12
    },
    exam_item:{
        flexDirection:"row",
        justifyContent:"space-between",
    },
    label:{
        textAlign:"left"
    },
    title:{
        fontSize:16,
        fontWeight:"500",
        marginBottom:5,
        textAlign:"left"
    },
    examContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        borderBottomWidth:1,
        borderColor:"#aaa"
    }
})
export default ExamResult