import { Image, Linking, Pressable, View} from 'react-native'

import React from 'react';

 const Social=(props)=>{


const open=(link)=>
{
    console.log(link)
    Linking.openURL(link);
}
    return   <View style={{  display: "flex", flexDirection: "row", paddingHorizontal:10, justifyContent: "space-between", alignItems: "center", }}>
  
   <Pressable  onPress={()=>open("https://twitter.com/MOQCae")}>
    <Image
        source={require('../../assets/x.png')}
        style={{
           
            height: 35,
            width: 35,
            
        }} /></Pressable>
        <Pressable onPress={()=>open("https://www.threads.net/@moqc.ae")}>
    <Image
        source={require('../../assets/threads.png')}
        style={{
            height: 35,
            width: 35,
           
        }} /></Pressable>
         <Pressable onPress={()=>open("https://www.instagram.com/moqc.ae/")}>
    <Image
        source={require('../../assets/socialicons/insta.png')}
        style={{
            height: 35,
            width: 35,
           
        }} /></Pressable>
         <Pressable onPress={()=>open("https://twitter.com/MOQCae")}>
    <Image
        source={require('../../assets/socialicons/telegram.png')}
        style={{
            height: 35,
            width: 35,
           
        }} /></Pressable>
         <Pressable onPress={()=>open("https://www.youtube.com/channel/UCjqeKGuXsBxvS9_mSIjrNbg")}>
    <Image
        source={require('../../assets/socialicons/youtube.png')}
        style={{
            height: 35,
            width: 35,
            
        }} /></Pressable>
         <Pressable onPress={()=>open("https://www.linkedin.com/company/moqcae/")}>
    <Image
        source={require('../../assets/socialicons/linkedin.png')}
        style={{
            height: 35,
            width: 35,
           
        }} /></Pressable>

</View>
}

export default Social;