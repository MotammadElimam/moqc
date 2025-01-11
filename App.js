
import * as React from 'react';
import {  ImageBackground, SafeAreaView,KeyboardAvoidingView,ScrollView, TouchableWithoutFeedback, Keyboard, I18nManager   } from 'react-native';
//LogBox.ignoreAllLogs();//Ignore all log notifications
import Navigation from './src/navigation/Navigation'
import { NativeBaseProvider } from 'native-base';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';



function App() {
React.useEffect(()=>{
 
 if( !I18nManager?.isRTL)
 {
  I18nManager?.forceRTL(true);
 }
 
},[])

    return (
  

      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex:1}}>
     
   
              
         <SafeAreaView style={{flex:1}}>
       
         

               
                    <Navigation >
                    
                        </Navigation>
                      
                
                </SafeAreaView>
     
       </KeyboardAvoidingView>
            
    
          
            );
}

export default App;
