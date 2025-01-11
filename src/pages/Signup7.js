import React, { Component } from "react";
import { withTranslation } from 'react-i18next';

import { StyleSheet, ImageBackground, Image, I18nManager, View, TouchableOpacity, Dimensions, Alert } from 'react-native'
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Body,
  Left,
  Right,
  Item,
  Input,
  Form,
  Footer,
  FooterTab,
  Picker
} from "native-base";
import { AsyncStorage, BackHandler } from 'react-native';
import DropShadow from "react-native-drop-shadow";
import FooterBottom from "./Footer";
import { auto } from "async";
import ImagePicker from "react-native-customized-image-picker";
import API from "../api/";
import { TextInput } from "react-native-gesture-handler";
var FormData = require('form-data');
let width = Dimensions.get('window').width
let height = Dimensions.get('window').height
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';
import Social from "./components/social";
import axios from "axios";
import RNRestart from 'react-native-restart';
import { ActivityIndicator } from 'react-native-paper';
class Signup7 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rtl: false,
      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      audioPath: AudioUtils.DocumentDirectoryPath + '/sound.aac',
      uploadedAudioPath: null,
      hasPermission: undefined,
      base64_voice: null,
      show_spinner: false
    };
  }



  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
    });
    this.props.updateParentState({ audioPath });
  }


  componentDidMount = async () => {
    // Get data from parent state if available, otherwise use defaults
    const { audioPath: parentAudioPath, base64_voice: parentBase64Voice } = this.props;

    this.setState({
      audioPath: parentAudioPath || AudioUtils.DocumentDirectoryPath + '/sound.aac',
      base64_voice: parentBase64Voice || null,
    });

    let gender = await AsyncStorage.getItem("@moqc:gender");
    this.setState({ gender });

    if (gender == 2) {
      this.setState({
        user_img: require("../assets/select_picture_f.png"),
      });
    }

    if (I18nManager.isRTL === true) {
      this.setState({ rtl: true });
    } else {
      this.setState({ rtl: false });
    }

    AudioRecorder.requestAuthorization().then((isAuthorised) => {
      this.setState({ hasPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({ currentTime: Math.floor(data.currentTime) });
      };

      AudioRecorder.onFinished = (data) => {
        console.log(data);
        this.setState({
          base64_voice: data.base64,
        });
        this.props.updateParentState({ base64_voice: data.base64 });

        if (Platform.OS === 'ios') {
          this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
        }
        this.uploadAudio(data);
      };
    });
  };





  _renderButton(title, onPress, active) {
    var style = (active) ? styles.activeButtonText : styles.buttonText;

    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={style}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  _renderPauseButton(onPress, active) {
    var style = (active) ? styles.activeButtonText : styles.buttonText;
    var title = this.state.paused ? "RESUME" : "PAUSE";
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={style}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  async _pause() {
    if (!this.state.recording) {
      console.warn('Can\'t pause, not recording!');
      return;
    }

    try {
      const filePath = await AudioRecorder.pauseRecording();
      this.setState({ paused: true });
    } catch (error) {
      console.error(error);
    }
  }

  async _resume() {
    if (!this.state.paused) {
      console.warn('Can\'t resume, not paused!');
      return;
    }

    try {
      await AudioRecorder.resumeRecording();
      this.setState({ paused: false });
    } catch (error) {
      console.error(error);
    }
  }

  _stop = async () => {
    if (!this.state.recording) {
      console.warn("Can't stop, not recording!");
      return;
    }

    this.setState({ stoppedRecording: true, recording: false, paused: false });

    try {
      const filePath = await AudioRecorder.stopRecording();
      var sound = new Sound(filePath, '', (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }

        const duration = sound.getDuration();
        if (duration < 1) {
          alert('The audio file is less than 1 seconds long.');
          return;
        } else {
          console.log(`Audio duration: ${duration} seconds.`);
          //                this.uploadAudio(filePath); // Call the upload function
        }

        if (Platform.OS === 'android') {
          this._finishRecording(true, filePath);
        }
      });

      return filePath;
    } catch (error) {
      console.error(error);
    }
  };

  uploadAudio = async (data) => {
    const dataURL = data.audioFileURL;
    const dataFileSize = data.audioFileSize;
    const audioFileName = data.audioFileName || 'sound.aac';
    const audioFileType = data.audioFileType || 'audio/aac';


    console.log('this is my file name from component did mount', dataURL);
    console.log('this is my file size from component did mount', dataFileSize);
    console.log('this is my file Name from component did mount', audioFileName);
    console.log('this is my file type from component did mount', audioFileType);

    this.setState({ show_spinner: true });

    const formData = new FormData();
    const audioFile = {
      uri: dataURL,
      type: audioFileType || 'audio/aac',
      name: audioFileName || 'sound.aac',
    };

    formData.append('file', audioFile);

    try {
      console.log('Uploading audio file:', audioFile);
      const apiResponse = await axios.post('https://moqc.ae/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 20000,
      });

      if (apiResponse.status === 200) {
        const responseData = apiResponse.data;
        console.log('Audio upload successful:', responseData.file);
        this.setState({ uploadedAudioPath: responseData.file })
      } else {
        Alert.alert('Error', 'Audio upload failed.', [{ text: 'OK' }], { cancelable: false });
        console.log('Audio upload failed. Status:', apiResponse.status);
      }
    } catch (error) {
      Alert.alert('Error', 'Error uploading audio: ' + error.message, [{ text: 'OK' }], { cancelable: false });
      console.log('Error uploading audio:', error.response ? error.response.data : error);
    } finally {
      this.setState({ show_spinner: false });
    }
  };


  _play = async () => {
    if (this.state.recording) {
      await this._stop();
    }

    setTimeout(() => {
      var sound = new Sound(this.state.audioPath, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        }
      });

      setTimeout(() => {
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }, 100);
    }, 100);
  }


  resetAll = async () => {
    this.setState({
      recording: false,
      base64_voice: null,
      currentTime: 0.0
    })
    // Reset both values in the parent state
    this.props.updateParentState({
      audioPath: null,
      base64_voice: null
    });
  }
  _record = async () => {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({ recording: true, paused: false });

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  _finishRecording(didSucceed, filePath, fileSize) {
    this.setState({ finished: didSucceed });
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
  }



  save_info = async (info) => {
    this.setState({ show_spinner: true });

    //    try {
    await AsyncStorage.setItem("@moqc:token", info.result.token);
    await AsyncStorage.setItem("@moqc:username", info.result.user.username);
    await AsyncStorage.setItem("@moqc:user_id", info.result.user.id);
    await AsyncStorage.setItem("@moqc:first_name", info.result.user.first_name);
    //        await AsyncStorage.setItem("@moqc:last_name", info.result.user.last_name);
    await AsyncStorage.setItem("@moqc:email", info.result.user.email);
    //        await AsyncStorage.setItem("@moqc:page_access", JSON.stringify(info.result.user.page_access));
    await AsyncStorage.setItem("@moqc:photo", info.result.user.photo);
    await AsyncStorage.setItem("role", info.result.role);
    await AsyncStorage.setItem("is_student", JSON.stringify(info.result.is_student));

    //        axios.defaults.headers.common['token'] = info.result.token;
    RNRestart.Restart()
    console.log('Step 1')
    if (info.result.is_student == 1) {
      console.log('Step 2')
      await AsyncStorage.setItem("class_id", info.result.user.student_class);
      //            this.props.navigation.navigate("HomeStudent", { class_id: info.result.user.student_class });
    } else {
      console.log('Step 3')
      //            this.props.navigation.navigate("Home");
    }
  }

  checkLastLogin = async () => {
    let token = await AsyncStorage.getItem("@moqc:token");
    let is_student = await AsyncStorage.getItem("is_student")
    console.log("is_student", is_student)
    if (token) {
      axios.defaults.headers.common['token'] = token
      if (is_student == 0) {
        this.props.navigation.navigate("Home")
      }
      else {
        let class_id = await AsyncStorage.getItem("class_id")
        this.props.navigation.navigate("HomeStudent", { class_id: class_id })
      }
    }
  }
  SignupUser = async () => {
    this.setState({ show_spinner: true });
    if (!this.state.audioPath) {
      this.setState({ show_spinner: false });
      Alert.alert(
        'Error',
        'Please record an audio clip before submitting.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
      return;
    }

    try {
      const formData = new FormData();
      const PropsData = this.props.data;
      formData.append('gender', PropsData.gender);
      formData.append('user', PropsData.user);
      formData.append("name", PropsData.full_name);
      formData.append("first_name", PropsData.full_name);
      formData.append("email", PropsData.email);
      formData.append("password", PropsData.password);
      formData.append("contact", PropsData.contact_phone);
      formData.append("dob", PropsData.dob);
      formData.append("nationality", PropsData.nationality);
      formData.append("country", PropsData.country_of_residence);
      formData.append("emirates_state", PropsData.emirates_state);
      formData.append("functional_connection", PropsData.connection);
      formData.append("parts_you_memorize", PropsData.partsMemorize);
      formData.append("course_id", PropsData.class_join);
      formData.append("educational_qualification", PropsData.educational_qualification);
      formData.append("joined", PropsData.joined);
      formData.append("source", PropsData.source);
      formData.append('selected_img', PropsData.selected_img);
      formData.append('voice_clip', this.state.uploadedAudioPath);
      formData.append('passport', PropsData.passport);
      formData.append('passport_expiry', PropsData.passport_expiry);
      formData.append('emirates_id', PropsData.id_front);
      formData.append('id_back', PropsData.id_back);
      formData.append('id_expiry', PropsData.id_expiry);



      formData._parts.forEach(([key, value]) => console.log(`${key}:`, value));
      const response = await fetch('https://moqc.ae/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const resp = await response.json();
      this.setState({ show_spinner: false });

      if (resp && resp.result) {
        if (resp.status === false) {
          let message = resp.result.messages.replace(/<\/?p>/g, '');
          Alert.alert(
            "Error",
            message,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        } else {
          console.log('Success case and the Response output', resp);
          const successMessage = resp.message || "Success!";
          Alert.alert(
            "Success",
            successMessage,
            [
              {
                text: "OK",
                onPress: () => {
                  this.checkLastLogin();
                  this.props.updateParentState({ active_step: 0 });
                  this.props.resetState();

                }
              }
            ],
            { cancelable: false }
          );
        }
      } else {
        Alert.alert(
          'Error',
          'Invalid response structure from server.',
          [{ text: 'OK' }],
          { cancelable: false }
        );
      }

    } catch (error) {
      console.log('Error:', error.message);
      this.setState({ show_spinner: false });
      Alert.alert(
        'Network Error',
        error.message,
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  };

  render() {
    const { t, i18n } = this.props;
    console.log(this.state.gender);
    const spinner = this.state.show_spinner;

    return (
      <View style={{ marginTop: 30, flex: 1, marginBottom: 20 }}>
        {spinner ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <View style={{ flex: 1, flexDirection: "column" }}>
            {/* Voice Clip Section */}
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                alignSelf: "center",
                padding: 20,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {i18n.t("Recording the recitation of Surah Al-Balad")}
              </Text>
              {this.state.selected_img == null ? (
                <Image
                  style={{
                    height: 150,
                    width: 150,
                    marginTop: 20,
                  }}
                  source={require('../assets/voice_clip.png')}
                />
              ) : (
                <Image
                  source={{ uri: this.state.selected_img }}
                  style={{
                    height: 150,
                    width: 150,
                    resizeMode: "contain",
                    borderRadius: 10,
                    marginTop: 20,
                  }}
                />
              )}
            </View>

            {/* Recording Status */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              {this.state.recording ? (
                <Text>
                  {i18n.t("Recording Started")}: {this.state.currentTime}s
                </Text>
              ) : null}
            </View>

            {/* Display Time and Actions after 1 seconds */}
            {this.state.currentTime > 2 && !this.state.recording ? (
              <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                flexDirection: "column",
                padding: 20,
                textAlign: "center",

                flex: 1,
              }}>
                <Text
                  style={{
                    padding: 20,
                    textAlign: "center",
                    fontSize: 16,
                    color: '#333',
                    flex: 1,
                                    }}
                >
                  {this.state.currentTime}s {i18n.t("recorded and ready to upload.")}


                </Text>


                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center', // Horizontally center buttons
                    alignItems: 'center', // Vertically center buttons
                    marginTop: 20,
                  }}
                >
                  {/* Play button with centered alignment */}
                  <TouchableOpacity
                    onPress={() => this._play()}
                    style={{
                      marginHorizontal: 15, // Spacing between the buttons
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: '#4CAF50', // Green color for play button
                        borderRadius: 50, // Circular button
                        padding: 15, // Adding more padding for a better touch target
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        style={{
                          height: 40,
                          width: 40,
                          resizeMode: 'contain',
                        }}
                        source={require('../assets/mic.png')}
                      />
                    </View>
                    <Text style={{ marginTop: 5, fontSize: 12, color: '#4CAF50' }}>Play</Text>
                  </TouchableOpacity>

                  {/* Reset button with centered alignment */}
                  <TouchableOpacity
                    onPress={() => this.resetAll()}
                    style={{
                      marginHorizontal: 15, // Spacing between the buttons
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: '#FF5722', // Orange color for reset button
                        borderRadius: 50, // Circular button
                        padding: 15, // Adding more padding for better touch target
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        style={{
                          height: 40,
                          width: 40,
                          resizeMode: 'contain',
                        }}
                        source={require('../assets/trash-doc-icon.png')}
                      />
                    </View>
                    <Text style={{ marginTop: 5, fontSize: 12, color: '#FF5722' }}>Reset</Text>
                  </TouchableOpacity>
                </View>

              </View>


            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 20, // Add padding around the container for spacing
                }}
              >
                {/* Conditional recording or stop button */}
                {this.state.recording ? (
                  <TouchableOpacity
                    onPress={() => this._stop()}
                    style={{
                      marginHorizontal: 15, // Spacing between buttons
                      backgroundColor: '#F44336', // Red background for stop button
                      borderRadius: 50, // Circular button
                      padding: 15, // Padding for touch target size
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      style={{
                        height: 40,
                        width: 40,
                        resizeMode: 'contain',
                      }}
                      source={require('../assets/play.png')}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => this._record()}
                    style={{
                      marginHorizontal: 15, // Spacing between buttons
                      backgroundColor: '#4CAF50', // Green background for record button
                      borderRadius: 50, // Circular button
                      padding: 15, // Padding for touch target size
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      style={{
                        height: 40,
                        width: 40,
                        resizeMode: 'contain',
                      }}
                      source={require('../assets/mic.png')}
                    />
                  </TouchableOpacity>
                )}

                {/* Trash icon button */}
                <TouchableOpacity
                  onPress={(e) => this.resetImage(e)}
                  style={{
                    marginHorizontal: 15, // Spacing between buttons
                    backgroundColor: '#FF5722', // Trash icon background color (orange)
                    borderRadius: 50, // Circular button
                    padding: 15, // Padding for touch target size
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      resizeMode: 'contain',
                    }}
                    source={require('../assets/trash-doc-icon.png')}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Submit Button */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                marginTop: 30,
              }}
            >

              <Button
                onPress={() => this.SignupUser(this.props)}
                style={{
                  width: 250,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignContent: "center",
                  backgroundColor: "#31314f",
                }}
              >
                <Text>{i18n.t("Send")}</Text>
                <Icon type="AntDesign" name="caretright" style={{ fontSize: 10, transform: [{ rotate: '180deg' }] }} />

              </Button>
            </View>
          </View>
        )}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b608a",
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: "#fff"
  },
  button: {
    padding: 20
  },
  disabledButtonText: {
    color: '#eee'
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  activeButtonText: {
    fontSize: 20,
    color: "#B81F00"
  }

});
export default withTranslation()(Signup7);