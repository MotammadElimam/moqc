

import { Picker, Spinner } from "native-base";
import React, {Component, useEffect, useState} from "react";
import { Image, Text, TouchableOpacity, View ,TextInput,StyleSheet, Pressable, Modal, Button} from "react-native";
import Select from "./select";
import DateTimePicker from 'react-native-date-picker';
import moment from 'moment';
import { withTranslation } from "react-i18next";
import i18n from "../../i18n";

const Step4=(props)=>{

const [gender,setGender]=useState('')
const [showCountries,setShowCountries]=useState(false)
const [showCourse,setShowCourse]=useState(false)
const [showResidance,setShowResidance]=useState(false)
const [showQualification,setShowQualification]=useState(false)
const [countries,setCountries]=useState([])
const [showDob,setShowDob]=useState(false)
const [showJob,setShowJob]=useState(false)
const [showLocation,setShowLocation]=useState(false)
const [dob,setDob]=useState(Date())
const [qualifications,setQuailifications]=useState([])
const [jobs,setJobs]=useState([])
const [error,setError]=useState(false)
const [showDays,setShowDays]=useState(false)
const [showMonth,setShowMonth]=useState(false)
const [showYear,setShowYears]=useState(false)
const [days,setDays]=useState([])
const [months,setMonths]=useState([])
const [years,setYears]=useState([])
useEffect(()=>{
  var list=[]
for(let i=1;i<=31;i++)
{
list.push({name:i.toString(),value:i})
}
setDays(list)
var list1=[]
for(let i=1;i<=12;i++)
{
list1.push({name:i.toString(),value:i})
}
setMonths(list1)
 var list2=[]
 for(let i=1900;i<=2022;i++)
{
list2.push({name:i.toString(),value:i})
}
setYears(list2)
},[])
const {t, i18n} = props;

    return ( <View style={{flex:1}}>
<Text style={{textAlign:"center",marginVertical:15,fontSize:25,fontWeight:"600"}}>{t('Personal Information')}</Text>
<Text style={styles.label}>{t('Where did you find us?')}</Text>
      <Select
      list={props.data.locations}
      title={t('Where did you find us?')}
      show={showLocation}
      field="id"
      selected={props.data.location_id}
      open={()=>setShowLocation(true)}
      onSelect={(item)=>{
        setShowLocation(false)
        props.update({location_id:item})
        console.log(item)}}
      render={i18n.language=='ar'?'name_ar': 'name_en'}
      close={()=>setShowLocation(false)} />
      {!props.data.location_id? <Text style={styles.error}>{t("this field is required")}</Text>:null}

      <Text style={styles.label}>{t("Memorized Juz'")}</Text>
      <TextInput value={props.data.memorized.toString()} keyboardType="number-pad"
      onChangeText={(val)=>props.update({memorized:val})} style={styles.input} />
{/* {!props.data.memorized? <Text style={styles.error}>{t("Memorized Juz is required")}</Text>:null} */}
<Text style={styles.label}>{t('Course')}</Text>
      <Select
      list={props.data.courses}
      title={t('Course')}
      show={showCourse}
      field="id"
      selected={props.data.course_id}
      open={()=>setShowCourse(true)}
      onSelect={(item)=>{
        setShowCourse(false)
        props.update({course_id:item})
        console.log(item)}}
      render={i18n.language=='ar'?'course_name_ar': 'course_name_en'}
      close={()=>setShowCourse(false)} />
      {!props.data.course_id? <Text style={styles.error}>{t("this field is required")}</Text>:null}
     {error? <View style={{padding:18,borderRadius:15,backgroundColor:"#eb445a"}}>
        <Text style={{color:"#fff",fontSize:18,fontWeight:"600"}}>{t('Please fill all records')}</Text>
      </View>:<View></View>}

<View style={{flex:1,flexDirection:"row",justifyContent:"center",alignContent:"center",marginTop:5,marginBottom:5}}>
                            <Pressable onPress={() => {
                            //  console.log(props.data.first_name,props.data.nationality,props.data.dob,props.data.qualification_id,props.data.contact_number,props.data.country,props.data.email,props.data.job_id,props.data.location_id,props.data.course_id)
                              if(props.data.location_id&&props.data.course_id)
                              {
                                
                                setError(false)
                                props.update({active_step:4})

                              }
                              else {
                                setError(true)
                              }

                              
                            }} style={{width:180,height:50,borderRadius:10,justifyContent:"center",alignContent:"center",backgroundColor:"#31314f"}}>
                                <Text style={{textAlign:"center",color:"#fff",fontWeight:"500"}}>
                                    {t('Next')} 
                                </Text>
                              
                            </Pressable>

                        </View>
    </View>);
}

export default  withTranslation()(Step4);

const styles=StyleSheet.create({
  label:{marginHorizontal:10,fontSize:16,fontWeight:'500',textAlign:i18n.language==="en"?"left": "right",fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"},
  error:{marginHorizontal:10,fontSize:14,color:"#e41e3f",marginBottom:10,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"},
  input:{borderWidth:1,paddingHorizontal:15,marginBottom:10,borderColor:"#ccc",borderRadius:12,paddingVertical:10,marginTop:5,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"}
})