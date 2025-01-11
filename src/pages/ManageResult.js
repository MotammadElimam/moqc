import React, { useEffect } from "react"
import { Modal, Pressable,Platform, SafeAreaView, StyleSheet, Text, TextInput, View, Image } from "react-native"
import i18n from "../i18n"
import { useState } from "react"
import { Icon,Button } from "native-base"
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isInProgress,
    types,
  } from 'react-native-document-picker'
import FileUpload from '../assets/file-upload.png'
import axios from "axios"




const ManageResult=({isOpen,onClose,item})=>{
    const [result,setResult]=useState({...item})
console.log(item.exam_id)
    const [isSubmmited,setIsSubmmited]=useState(false)
    const validate=()=>{
        return Boolean(result.result&&result.report)
    }

    useEffect(()=>{
        setResult({...item})
    },[isOpen])

    const onSubmit=async()=>{
        setIsSubmmited(true)
        axios.post("https://moqc.ae/api/result_update",{...result,student_id:item.id,exam_id:item.exam_id},{
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(res=>{
          //  console.log(res.data)
           onClose()
        }).catch(e=>{
            console.log(e)
            console.log(e.response?.data)
        })
    }

    return <Modal visible={isOpen} onRequestClose={onClose}>
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <Text style={styles.label}>{i18n.t("Student")}</Text>
            <Text  style={styles.label}>{item?.first_name} {item?.last_name}</Text>
            <Text  style={styles.label}>{i18n.t("Result")}</Text>
            <TextInput style={{...styles.input,...(isSubmmited&&!result.result&&{borderColor:"red"})}}
            value={result.result}
            onChangeText={value=>setResult({...result,result:value})}
              />
            {isSubmmited&&!result.report&&<Text style={{color:"red"}}>{i18n.t("This field is required")}</Text>}

            <Text  style={styles.label}>{i18n.t("Note")}</Text>
            <TextInput
             value={result.note}
             onChangeText={value=>setResult({...result,note:value})}
             style={styles.input}   />

            <Text  style={styles.label}>{i18n.t("Report")}</Text>
            <Pressable onPress={async()=>{
              
                 try {
                    const result = await DocumentPicker.pick({
                      type: [DocumentPicker.types.allFiles],
                    });
                   const file={...result[0],...(Platform.OS==="ios"?{uril:result[0].uri.replace('file://', '')}:{uri:result[0].uri})}
                   const data=new FormData()
                   data.append('file',file)

                   axios.post("https://moqc.ae/api/upload",data,{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    }
                   }).then(res=>{
                    setResult({...result,report:res.data?.file})
                  //  console.log(res.data)
                   }).catch(e=>{
                    console.log(e.response?.data)
                   })
                   
                    // You now have the selected file information
                  } catch (err) {
                    if (DocumentPicker.isCancel(err)) {
                      // User canceled the picker
                    } else {
                      throw err;
                    }
                  }
            }}>
            <View style={{...styles.input,flexDirection:"row",justifyContent:"space-between"}}   >
            <Image source={FileUpload} style={{width:30,height:30,tintColor:"#579976"}}   />
            {<Image source={ result.report? require('../assets/checkmark.png'):require('../assets/error.png')} style={styles.img}   />}
            </View>
            </Pressable>
            {isSubmmited&&!result.report&&<Text style={{color:"red"}}>{i18n.t("Please upload the report")}</Text>}

            <Button onPress={onSubmit}
            style={{backgroundColor:"#579976",width:"100%",borderRadius:12,justifyContent:"center"}}>
                <Text style={{color:"#fff"}}>{i18n.t("Save")}</Text>
            </Button>

            <Button 
            onPress={onClose}
            style={{borderColor:"#579976",borderWidth:1,backgroundColor:"#fff",marginVertical:10,width:"100%",borderRadius:12,justifyContent:"center"}}>
                <Text style={{color:"#000"}}>{i18n.t("Cancel")}</Text>
            </Button>

        </View>
        </SafeAreaView>
    </Modal>

}

const styles=StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:20,
        paddingVertical:12,
        backgroundColor:"#fff",
        textAlign:"left",
        gap:10
    },
    label:{
        textAlign:"left"
    },
    img:{
        width:30,
        height:30,
    },
    input:{
        borderWidth:1,
        borderColor:"#eee",
        borderRadius:10,
        paddingHorizontal:9,paddingVertical:10,
        marginVertical:5
    }

})
export default ManageResult