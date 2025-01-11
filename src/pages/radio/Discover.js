import { Text, TextInput, View } from "react-native";
import React, {Component} from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider } from "react-native-paper";


export default class Discover extends Component{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (<View style={{flex:1,padding:10}}>
            <View style={{flexDirection:"row",borderWidth:1,paddingHorizontal:10,
            borderRadius:15,
            borderColor:"#497c67",height:40,justifyContent:"space-between"}}>
                <TextInput style={{flex:10}} placeholder="search"  />
                <MaterialCommunityIcons name="magnify"  size={25} style={{marginTop:5}}  />
            </View>
          
           <Text style={{marginVertical:10,fontSize:25}}>Explore</Text>
          
            
        </View>)
    }
}