

import React, {Component, useEffect, useRef, useState} from "react";
import { Alert, Button, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isInProgress,
    types,
  } from 'react-native-document-picker'
  import DateTimePicker from 'react-native-date-picker';
  import moment from 'moment';

import axios from "axios";
import { withTranslation } from "react-i18next";
import i18n from "../../i18n";
import Sound from 'react-native-sound';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
var FormData = require('form-data');
const Step5 =(props)=>{
    const [showPass,setPass]=useState(false)
    const [showId,setId]=useState(false)
    const [error,setError]=useState(false)
    const {t, i18n} = props;
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioPath = AudioUtils.DocumentDirectoryPath + '/moqcRecord.aac';
    const recorder = useRef(null);
    const player = useRef(null);
    const intervalRef = useRef(null);
    let interval;
    const startRecording = async () => {
      try {
        await AudioRecorder.prepareRecordingAtPath(audioPath, {
          SampleRate: 22050,
          Channels: 1,
          AudioQuality: 'Low',
          AudioEncoding: 'aac',
        });
        await AudioRecorder.startRecording();
        setIsRecording(true);
        setTimer(0);
        intervalRef.current = setInterval(() => {
          setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
        return () => clearInterval(interval);
      } catch (error) {
        clearInterval(interval);
        console.error('Failed to start recording', error);
      }
    };
  
    const stopRecording = async () => {
      try {
        const filePath = await AudioRecorder.stopRecording();
        setIsRecording(false);
        clearInterval(intervalRef.current); 
        props.update({voice_clip:{
          name: 'moqcRecord.aac',
          type: 'audio/aac',
          uri:audioPath,
        }})
        setTimer(()=>{
          console.log('Recording stopped', audioPath);
        },5000)
       
       
      } catch (error) {
        clearInterval(intervalRef.current); 
        console.error('Failed to stop recording', error);
      }
    };
  
    const playRecording = () => {
      console.log(audioPath)
      const sound = new Sound(audioPath, '', (error) => {
        if (error) {
          console.error('Failed to load sound', error);
          return;
        }
        setIsPlaying(true);
        sound.play(() => {
          sound.release();
          setIsPlaying(false);
        });
      });
    };

    return <View style={{flex:1,padding:20,alignItems:"center"}}>
         <Text style={{textAlign:"center",marginVertical:15,fontSize:25,fontWeight:"600"}}>{t('Voice Recodring')}</Text>
         <Pressable onPress={()=>{
            // DocumentPicker.pickSingle({ type: [types.audio],}).then(data=>{
             
            //     props.update({voice_clip:{
            //         name: data.name,
            //         type: data.type,
            //         uri: Platform.OS === 'ios' ? 
            //              data.uri.replace('file://', '')
            //              : data.uri,
            //       }})
            // })
           }}>
         <Image source={require('../../assets/voice_clip.png')} style={{height:180,aspectRatio:1,marginVertical:15}}  />
         </Pressable>
         
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>تسجيل مقطع صوتي (تلاوتكم القرآنية عدا سورة الفاتحة)</Text>
    
      {isRecording ? (
        <View>
            <Text>{`Recording: ${timer} seconds`}</Text>
        <Button
      
        color="#e41e3f"
         title={i18n.t("Stop Recording")} onPress={stopRecording} />
        </View>
      ) : (
        <Button 
        backgroundColor=""
        title={i18n.t("Start Recording")} onPress={startRecording} />
      )}
      <Button
      style={{margintop:10}}
        title={isPlaying ? i18n.t('Playing...') : i18n.t('Play Recording')}
        onPress={playRecording}
        disabled={isRecording}
      />
    </View>
         
         {!props.data.voice_clip? <Text style={styles.error}>{t("Voice Recording is required")}</Text>:null}

         {error? <View style={{padding:18,borderRadius:15,backgroundColor:"#eb445a",marginBottom:5}}>
        <Text style={{color:"#fff",fontSize:18,fontWeight:"600"}}>{t('Please fill all records')}</Text>
      </View>:<View></View>}
      

       
                   

    <Pressable onPress={() => {
                            //  console.log(props.data.first_name,props.data.nationality,props.data.dob,props.data.qualification_id,props.data.contact_number,props.data.country,props.data.email,props.data.job_id,props.data.location_id,props.data.course_id)
                              if(props.data.voice_clip)
                              {
                                
                                setError(false)
                                props.update({active_step:5})

                              }
                              else {
                                setError(true)
                              }

                              
                            }} style={{width:180,height:50,justifyContent:"center",alignItems:"center",backgroundColor:"#31314f",borderRadius:10,flexDirection:"row"}}>
                              
                                <Text style={{color:"#fff",fontWeight:"500"}}>
                                    {t('Next')} 
                                </Text>
                              
                            </Pressable>


    </View>
}


const styles=StyleSheet.create({
    txt:{marginTop:10,fontSize:15,fontWeight:'600',marginHorizontal:10,textAlign:i18n.language==="en"?"left": "right",fontFamily:"GESSTwoMedium-Medium"},
    img:{height:40,width:40,marginHorizontal:5},
    img1:{height:30,width:30,marginHorizontal:5},
    error:{marginHorizontal:10,fontSize:14,color:"#e41e3f",marginBottom:10,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"},
    container:{flexDirection:"row",justifyContent:"space-between",padding:5,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"},
    main:{borderWidth:1,borderRadius:10,marginBottom:10,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"}
})

export default withTranslation()(Step5)