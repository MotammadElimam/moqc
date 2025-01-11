

import { Picker, Spinner } from "native-base";
import React, {Component, useEffect, useState} from "react";
import { Image, Text, TouchableOpacity, View ,TextInput,StyleSheet, Pressable, Modal, Button} from "react-native";
import Select from "./select";
import DateTimePicker from 'react-native-date-picker';
import moment from 'moment';
import { withTranslation } from "react-i18next";
import i18n from "../../i18n";

const Step3=(props)=>{

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
   <Text style={styles.label}>{t('Your qualification')}</Text>
      <Select
      list={props.data.qualifications}
      title={t('Your qualification')}
      show={showQualification}
      field="id"
      selected={props.data.qualification_id}
      open={()=>setShowQualification(true)}
      onSelect={(item)=>{
        setShowQualification(false)
        
        props.update({qualification_id:item})
        console.log(item)}}
      render={i18n.language=='ar'?'name_ar': 'name_en'}
      close={()=>setShowQualification(false)} />
      { !props.data.qualification_id?<Text style={styles.error}>{t("Qualification is required")}</Text>:null}

      <Text style={styles.label}>{t('Contact Number')}</Text>
      <TextInput style={styles.input}  value={props.data.contact_number} onChangeText={(val)=>props.update({contact_number:val})} keyboardType="phone-pad" />
     { !props.data.contact_number?<Text style={styles.error}>{t("Contact number is required")}</Text>:null}

      <Text style={styles.label}>{t('Counrty of Residance')}</Text>
      <Select
      list={props.data.countries}
      title={t('Counrty of Residance')}
      show={showResidance}
      field="id"
      selected={props.data.country}
      open={()=>setShowResidance(true)}
      onSelect={(item)=>{
        setShowResidance(false)
        
        props.update({country:item})
        console.log(item)}}
      render={i18n.language=='ar'?'country_name_ar': 'country_name'}
      close={()=>setShowResidance(false)} />
      {!props.data.country? <Text style={styles.error}>{t("Country of residance is required")}</Text>:null}

      <Text style={styles.label}>{t('Email')}</Text>
      <TextInput value={props.data.email} style={styles.input} onChangeText={(val)=>props.update({email:val})} />
      {!props.data.email?<Text style={styles.error}>{t("Email is required")}</Text>:null}
      <Text style={styles.label}>{t('Your Job')}</Text>
      <Select
      list={props.data.jobs}
      title={t('Your Job')}
      show={showJob}
      field="id"
      selected={props.data.job_id}
      open={()=>setShowJob(true)}
      onSelect={(item)=>{
        setShowJob(false)
        
        props.update({job_id:item})
        console.log(item)}}
      render={i18n.language=='ar'?'name_ar': 'name_en'}
      close={()=>setShowJob(false)} />
       {!props.data.job_id?<Text style={styles.error}>{t("Job is required")}</Text>:null}

       {error? <View style={{padding:18,borderRadius:15,backgroundColor:"#eb445a"}}>
        <Text style={{color:"#fff",fontSize:18,fontWeight:"600"}}>{t('Please fill all records')}</Text>
      </View>:<View></View>}
<View style={{flex:1,flexDirection:"row",justifyContent:"center",alignContent:"center",marginTop:5,marginBottom:5}}>
                            <Pressable onPress={() => {
                            //  console.log(props.data.first_name,props.data.nationality,props.data.dob,props.data.qualification_id,props.data.contact_number,props.data.country,props.data.email,props.data.job_id,props.data.location_id,props.data.course_id)
                              if(props.data.qualification_id&&props.data.contact_number&&props.data.country&&props.data.email&&props.data.job_id)
                              {
                                
                                setError(false)
                                props.update({active_step:3})

                              }
                              else {
                                setError(true)
                              }

                              
                            }} style={{width:180,height:50,borderRadius:10,justifyContent:"center",alignContent:"center",backgroundColor:"#31314f"}}>
                                <Text style={{textAlign:"center",color:"#fff",fontWeight:"500",fontFamily:"GESSTwoMedium-Medium"}}>
                                    {t('Next')} 
                                </Text>
                              
                            </Pressable>

                        </View>
    </View>);
}

export default  withTranslation()(Step3);

const styles=StyleSheet.create({
  label:{marginHorizontal:10,fontSize:16,fontWeight:'500',textAlign:i18n.language==="en"?"left": "right",fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"},
  error:{marginHorizontal:10,fontSize:14,color:"#e41e3f",marginBottom:10,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"},
  input:{borderWidth:1,paddingHorizontal:15,marginBottom:10,borderColor:"#ccc",borderRadius:12,paddingVertical:10,marginTop:5,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"}
})