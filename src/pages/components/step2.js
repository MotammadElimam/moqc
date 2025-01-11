

import { Picker, Spinner } from "native-base";
import React, {Component, useEffect, useState} from "react";
import { Image, Text, TouchableOpacity, View ,TextInput,StyleSheet, Pressable, Modal, Button} from "react-native";
import Select from "./select";
import DateTimePicker from 'react-native-date-picker';
import moment from 'moment';
import { withTranslation } from "react-i18next";
import i18n from "../../i18n";

const Step2=(props)=>{

const [gender,setGender]=useState('')
const [showCountries,setShowCountries]=useState(false)
const [showCourse,setShowCourse]=useState(false)
const [showResidance,setShowResidance]=useState(false)
const [showQualification,setShowQualification]=useState(false)
const [countries,setCountries]=useState([])
const [showDob,setShowDob]=useState(false)
const [showJob,setShowJob]=useState(false)
const [showLocation,setShowLocation]=useState(false)
const [qualifications,setQuailifications]=useState([])
const [jobs,setJobs]=useState([])
const [error,setError]=useState(false)
const [showDays,setShowDays]=useState(false)
const [showMonth,setShowMonth]=useState(false)
const [showYear,setShowYears]=useState(false)
const [days,setDays]=useState([])
const [months,setMonths]=useState([])
const [years,setYears]=useState([])
const [dob,setDOB]=useState({day:"",month:"",year:""})
const [showError,setShowError]=useState(false)
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
          
          
        <Text style={styles.label}>{t("Your Full name")}*</Text>
      <TextInput style={styles.input} value={props.data.first_name} onChangeText={(val)=>props.update({first_name:val})} />
      {!props.data.first_name?<Text style={styles.error}>{t("Name is required")}</Text>:null}
      <Text style={styles.label}>{t("Nationality")}</Text>
     

      <Select
      list={props.data.countries}
      title={t('Nationality')}
      show={showCountries}
      field="id"
      selected={props.data.nationality}
      open={()=>setShowCountries(true)}
      onSelect={(item)=>{
        setShowCountries(false)
        
        props.update({nationality:item})
        console.log(item)}}
      render={i18n.language=='ar'?'country_name_ar': 'country_name'}
      close={()=>setShowCountries(false)} />
     { !props.data.nationality?<Text style={styles.error}>{t("Nationality is required")}</Text>:null}
      <View >
      
      <Text style={styles.label}>{ t("Date of Birth")}</Text>
      <View style={{ marginVertical:5, justifyContent:"space-between",gap:10,flexDirection:"row"}}>
        <View style={{flex:1,marginEnd:5}}>
          <Text style={styles.label}>{i18n.t('Day')} </Text>
          <Select
      list={days}
      title={t('Day')}
      show={showDays}
      field="value"
      selected={1}
      open={()=>setShowDays(true)}
      onSelect={(item)=>{
        setShowDays(false)
        setDOB({...dob,day:item})
        props.update({day:item,dob:props.data.year+'-'+props.data.month+'-'+item})
        console.log(item)}}
      render={ 'name'}
      close={()=>setShowDays(false)} />
      
        </View>
        <View style={{flex:1,marginEnd:5}}>
          <Text style={styles.label}>{i18n.t('Month')} </Text>
          <Select
      list={months}
      title={t('Month')}
      show={showMonth}
      field="value"
      selected={1}
      open={()=>setShowMonth(true)}
      onSelect={(item)=>{
        setShowMonth(false)
        setDOB({...dob,month:item})
        props.update({month:item,dob:props.data.year+'-'+item+'-'+props.data.day})
        
        console.log(props.data.year+'-'+item+'-'+props.data.day)}}
      render={ 'name'}
      close={()=>setShowMonth(false)} />
        </View>
        <View style={{flex:1,marginEnd:5}}>
          <Text style={styles.label}>{i18n.t('Year')} </Text>
          <Select
      list={years}
      title={t('Year')}
      show={showYear}
      field="value"
      selected={props.data.year}
      open={()=>setShowYears(true)}
      onSelect={(item)=>{
        setShowYears(false)
        setDOB({...dob,year:item})
        props.update({year:item,dob:item+'-'+props.data.month+'-'+props.data.day})
        console.log(item+'-'+props.data.month+'-'+props.data.day)
        console.log(item)}}
      render={ 'name'}
      close={()=>setShowYears(false)} />
        </View>
      </View>
     {!dob.day||!dob.month||!dob.year? <Text style={styles.error}>{t("Date of Birth is required")}</Text>:null}
      </View>
      {/* <Pressable onPress={()=>setShowDob(true)}>
        <View style={{...styles.input,flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={{fontSize:20}}>{props.data.dob} </Text>
        <Image source={require("../../assets/calendar.png")} style={{width:25,height:25}}  />
        </View>
       
        </Pressable>
      {showDob? <DateTimePicker
                                 
                                   value={props.data.dob?new Date(props.data.dob):new Date()}
                                    mode='date'
                                    display="calendar"
                                    onChange={(val,date)=>{
                                      setShowDob( false)
                                      props.update({dob:moment( date).format("YYYY-MM-DD")})
                                     
                                        console.log(date,moment(date).format("YYYY-MM-DD"))}}
                                />:<Text></Text>} */}

      {/* <Text style={styles.label}>{t('Your qualification')}</Text>
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
        
        props.update({nationality:item})
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
       {!props.data.job_id?<Text style={styles.error}>{t("Job is required")}</Text>:null} */}
{/* 
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
      {!props.data.location_id? <Text style={styles.error}>{t("Where you find us is required")}</Text>:null}

      <Text style={styles.label}>{t("Memorized Juz'")}</Text>
      <TextInput value={props.data.memorized.toString()} keyboardType="number-pad"
      onChangeText={(val)=>props.update({memorized:val})} style={styles.input} />
{!props.data.memorized? <Text style={styles.error}>{t("Memorized Juz is required")}</Text>:null}
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
      {!props.data.course_id? <Text style={styles.error}>{t("Course is required")}</Text>:null}
     {error? <View style={{padding:18,borderRadius:15,backgroundColor:"#eb445a"}}>
        <Text style={{color:"#fff",fontSize:18,fontWeight:"600"}}>{t('Please fill all records')}</Text>
      </View>:<View></View>} */}
       {error? <View style={{padding:18,borderRadius:15,backgroundColor:"#eb445a"}}>
        <Text style={{color:"#fff",fontSize:18,fontWeight:"600"}}>{t('Please fill all records')}</Text>
      </View>:<View></View>}

<View style={{flex:1,flexDirection:"row",justifyContent:"center",alignContent:"center",marginTop:5,marginBottom:5}}>
                            <Pressable onPress={() => {
                            //  console.log(props.data.first_name,props.data.nationality,props.data.dob,props.data.qualification_id,props.data.contact_number,props.data.country,props.data.email,props.data.job_id,props.data.location_id,props.data.course_id)
                              if(props.data.first_name&&dob.day&&dob.month&&dob.year)
                              {
                                
                                setError(false)
                                props.update({active_step:2})

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

export default  withTranslation()(Step2);

const styles=StyleSheet.create({
    label:{marginHorizontal:10,fontSize:16,textAlign:i18n.language==="en"?"left": "right",fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"},
    error:{marginHorizontal:10,fontSize:14,color:"#e41e3f",marginBottom:10,fontFamily:"GESSTwoMedium-Medium"},
    input:{borderWidth:1,paddingHorizontal:15,marginBottom:10,borderColor:"#ccc",borderRadius:12,paddingVertical:10,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"}
})