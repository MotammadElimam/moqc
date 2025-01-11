import React from "react";
import { Image, Text, View } from "react-native";
import i18n from "../../i18n";



const Success=(props)=>{


    return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>

        <Image  source={require("../../assets/checkmark.png")} 
         style={{marginTop:20,width:250,height:250,marginBottom:20}} />

         <Text style={{textAlign:"center",fontSize:20,fontWeight:"500"}}>
             {i18n.t("ٍRegistration Success")}
         </Text>
         <View style={{height:200}}></View>

    </View>
}


export default Success;