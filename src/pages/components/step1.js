
import { Spinner } from "native-base";
import React, {Component, useState} from "react";
import { withTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";


const Step1=(props)=>{

const [gender,setGender]=useState('')

const update=(val)=>{
setGender(val);
props.update({gender:val,active_step:1})

}
const {t, i18n} = props;
    return (
    <View style={{flex:1}}>
        
           <View style={{
                        flex:1,
                        justifyContent:"center",
                        alignContent:"center",
                        alignItems:"center"
                    }}>
                        <Text style={{fontSize:18,marginTop:15,marginBottom:15,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"}}>
                           {t("Which one are you?")}
                        </Text>
                        <Text style={{fontSize:12,fontFamily:"GESSTwoMedium-Medium",fontWeight:"100"}}>
                           {t("Select your Gender")}
                        </Text>
                    </View>
                   {props.data.countries.length >0 ?<View style={{flex:10,flexDirection:"row",justifyContent:"space-around"}}>
                        <TouchableOpacity onPress={() =>{update(1)}}>
                            <Image
                                onPress={() => update(1)}
                                source={require('../../assets/male.png')}
                                style={{
                                height: 250,
                                width:150,
                               
                                resizeMode:"contain"
                            }}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => update(2)}>
                            <Image
                                onPress={() => update(2)}
                                source={require('../../assets/female.png')}
                                style={{
                                height: 250,
                                width:150,
                               
                                resizeMode:"contain"
                            }}/>

                        </TouchableOpacity>
                            
                    </View>:<Spinner/>}
                    <View style={{flex:6,flexDirection:"row",justifyContent:"space-around"}}>
                            <Image
                                source={require('../../assets/blue_line.png')}
                                style={{
                                height: props.data.gender == 1 ? 10 :0,
                                width:100,
                                marginLeft:10,
                                resizeMode:"contain"
                            }}/>
                            
                            <Image
                                source={require('../../assets/red_line.png')}
                                style={{
                                height: props.data.gender == 2 ? 10 : 0,
                                width:100,
                               
                                marginLeft: 10,
                                resizeMode:"contain"
                            }}/>


                    </View>
    </View>);
}

export default  withTranslation()(Step1);