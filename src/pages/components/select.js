import { Spinner } from "native-base";
import React, { useEffect, useState } from "react";
import { Button, Image, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";



const Select=(props)=>{
    const [text,setText]=useState('')
    const [selected,setSelected]=useState(props.selected&&props.list.find((item)=>item[props?.field]==props?.selected)?props.list.find((item)=>item[props?.field]==props?.selected)[props?.render]:'')
    const [list,setList]=useState(props.list??[])
    const filter=()=>{}

    useEffect(()=>{
      
        
    },[])


   

    return <View>
        <TouchableOpacity onPress={props.open}>
        <View style={{flexDirection:"row",justifyContent:"space-between",padding:10,marginVertical:10,borderWidth:1,borderColor:"#ccc",borderRadius:10}}>
            <Text style={{fontSize:16,overflow:"hidden",fontWeight:"600",color:"#000"}}>{selected}  </Text>
            <Image source={require('../../assets/down.png')}   style={{height:20,width:20}} />
        </View>
        </TouchableOpacity>

       
        <Modal visible={props.show}><SafeAreaView style={{flex:1}}>
        <View style={{flexDirection:"row",backgroundColor:"#f6f1fa",padding:10}}>
            <Text style={{flex:3,fontSize:20,marginTop:5,}}>{props.title??"Select"} </Text>
      
      <Pressable onPress={props.close}>
        <Image source={require('../../assets/cancel.png')} style={{width:30,height:30}} />
      </Pressable>
       
        </View>
        <View style={{borderRadius:10,padding:10,margin:10,borderWidth:1,borderColor:"#eee",justifyContent:"space-between",flexDirection:"row",alignItems:"center"}}>
            {/* {text.length?<View style={{width:0}}></View>:<Pressable onPress={()=>setText('')}> <Image source={require("../../assets/close.png")}  style={{width:20,height:20,marginTop:8}} /></Pressable>} */}
            <TextInput value={text} style={{flex:1}}  onChangeText={(val)=>{setText(val)
            console.log(val)}} /> 
            <Image source={require("../../assets/search.png")} style={{height:25,width:25}} />
        </View>

        <ScrollView>

            {props.list.filter((item)=>item[props.render].toLowerCase().indexOf(text.toString().toLowerCase()) > -1 ).map((item,index)=>{
              return  <Pressable key={index}
                 onPress={()=>{
                    props.onSelect(item[props.field])
                    setSelected(item[props.render])
                 }}>
                    <View style={{flex:1,borderColor:"#eeeeee",borderBottomWidth:1,paddingBottom:5,paddingHorizontal:15}}  >
                       
                        <Text style={{fontSize:18}}>{item[props.render]}</Text>
                    </View>
                </Pressable>}
            )}

        </ScrollView></SafeAreaView>
    </Modal>
    </View>
}

export default Select;