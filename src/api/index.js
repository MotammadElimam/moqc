import { AsyncStorage } from 'react-native';
import { Alert } from "react-native";

import axios from 'axios';
var FormData = require('form-data');

let api_call = async (path, method, body={}, headers) => {
  let apiRoot = "https://moqc.ae/api/";
  // let apiRoot = "http://siktop.com/api/";

  console.log(`${apiRoot}${path}`)
  var config = {
    method: method,
    url: `${apiRoot}${path}`,
    headers: headers,
    data: body
  }
  console.log(config)
  var response = await axios(config)
  .then( (response)=> {
    return (response.data);
  })
  .catch( (error)=> {
    console.log(error);
  });
  return response;
}; 

exports.getCourses=async(user)=>{
  const res=await api_call("courses", "get" );
  return res
}

exports.signup = async user => {
  console.log(user)
  let resp = await api_call("signup", "post", user );
  console.log(resp)
  return resp;
};
exports.signup = async user => {
  console.log(user)
  
  let resp = await api_call("user/register", "post", user );
  console.log(resp)
  return resp;
};


exports.login = async user => {
  console.log(user)
  
  let resp = await api_call("user/login", "POST", user );
  console.log(resp)
  return resp;
};

exports.country = async () => {  
  let resp = await api_call("countries", "get", );
  return resp;
};
exports.getForm = async () => {  
  let resp = await api_call("student/registeration_form", "get", );
  return resp;
};
exports.news = async () => {  
  let resp = await api_call("news", "get", );
  return resp;
};
exports.students = async () => {
  // console.log(post)
  let token = await AsyncStorage.getItem("@moqc:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("customer_service/students", "get", null, headers );
  return resp;
};

exports.getStudents = async (user) => {
  // console.log(post)
  let token = await AsyncStorage.getItem("@moqc:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("customer_service/student/"+user, "get", null, headers );
  return resp;
};
exports.profile = async (user) => {
  // console.log(post)
  let token = await AsyncStorage.getItem("@moqc:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("profile", "post", {}, headers );
  return resp;
};
exports.getTeacherStudents = async (user) => {
  // console.log(post)
  let token = await AsyncStorage.getItem("@moqc:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("teachers/student/"+user, "get", null, headers );
  return resp;
};
exports.approveStudents = async (user) => {
  console.log(" INSIDE APPROFVE")
  let token = await AsyncStorage.getItem("@moqc:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("customer_service/accept_student/"+user, "get", null, headers );
  return resp;
};
exports.approveTeacherStudents = async (user,data) => {
  console.log(" INSIDE APPROFVE")
  let token = await AsyncStorage.getItem("@moqc:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("accept_student/"+user, "post", data, headers );
  return resp;
};
exports.teacherStudents = async () => {
  // console.log(post)
  let token = await AsyncStorage.getItem("@moqc:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("teachers/students", "get", null, headers );
  return resp;
};
exports.rejectStudent = async (user) => {
  // console.log(post)
  let token = await AsyncStorage.getItem("@moqc:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("teachers/reject_student/"+user, "post", {}, headers );
  return resp;
};
exports.getSt = async (user) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
    "mimeType": "multipart/form-data",
    "contentType": false,
  }
  let resp = await api_call("addpost", "post", post, headers );
  return resp;
};

exports.getCourses = async (user) => {
  // console.log(post)
  let token = await AsyncStorage.getItem("@moqc:token");
  let headers = await{
    "token": token,
  }
  let resp = await api_call("customer_service/student/"+user, "get", null, headers );
  return resp;
};

exports.getExamResults = async (id) => {
  // console.log(post)
  let token = await AsyncStorage.getItem("@moqc:token");
  let headers = await{
    "token": token,
  }
  let resp = await api_call("exam_results/"+id, "get", null, headers );
  return resp
 
};

exports.getClasses = async (user) => {
  // console.log(post)
  let token = await AsyncStorage.getItem("@moqc:token");
  let headers = await{
    "token": token,
  }
  let resp = await api_call("moqc.ae/api/classes", "get", null, headers );
  return resp;
};



exports.feeds = async () => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  if(token == null || token == "null"){
    return;
  } 
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getposts", "post", {}, headers );
  console.log(resp)
  return resp;
};

exports.like = async (like_data) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  console.log(like_data)
  let resp = await api_call("likepost", "post", like_data, headers );
  console.log(resp)
  return resp;
};

exports.comments = async (post_id) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("allcomments", "post", {post_id: post_id}, headers );
  console.log(resp)
  return resp;
};

exports.create_comment = async (comment_data) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  console.log(comment_data)
  let resp = await api_call("commentpost", "post", comment_data, headers );
  console.log(resp)
  return resp;
};

exports.create_story = async story => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("addstory", "post", story, headers );
  return resp;
};

exports.stories = async () => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  if(token == null || token == "null"){
    return;
  }
  let headers = await{
    "token": token,
  }
  console.log("stories")
  let resp = await api_call("getstory", "post", {}, headers );
  return resp;
};


exports.update_profile = async (user) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("updateprofile", "post", user, headers );
  return resp;
};

exports.search = async (user) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("findfriend", "post", user, headers );
  return resp;
};

exports.delete_post = async (post_id) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("deletepost", "post", {post_id: post_id}, headers );
  return resp;
};

exports.friend_profile = async (friend_id) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  console.log("stories")
  let resp = await api_call("getUserprofile", "post", {user_id: friend_id}, headers );
  return resp;
};

exports.my_friends = async () => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getmyfriends", "post", {}, headers );
  return resp;
};

exports.add_friend = async (friend_id) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  console.log("stories")
  let resp = await api_call("addfriend", "post", {friend_id: friend_id}, headers );
  return resp;
};

exports.remove_friend = async (friend_id) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  console.log("stories")
  let resp = await api_call("removefriend", "post", {friend_id: friend_id}, headers );
  return resp;
};
exports.approve_friend = async (friend_id) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  console.log("stories")
  let resp = await api_call("approvefriend", "post", {id: friend_id}, headers );
  return resp;
};

exports.get_stickers = async () => {
  let resp = await api_call("getstickers", "get", {});
  return resp;
};
exports.get_story_status = async () => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getstorystatus", "post", {}, headers );
  return resp;
};
exports.get_country = async () => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getcountry", "post", {}, headers );
  return resp;
};

exports.get_state = async (id) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getstate", "post", {id:id}, headers );
  return resp;
};

exports.get_city = async (id) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getcity", "post", {id:id}, headers );
  return resp;
};
exports.update_story = async (data) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("updatestory", "post", data, headers );
  return resp;
};
exports.pushtoken = async (push_token) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  if(token == null || token == "null"){
    return;
  }
  let headers = await{
    "token": token,
  }
  let resp = await api_call("pushtoken", "post", {push_token: push_token}, headers );
  return resp;
};
exports.notification = async () => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getnotification", "post", {}, headers );
  return resp;
};
exports.allchat = async () => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("allchat", "post", {}, headers );
  return resp;
};
exports.mychat = async (user_id) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getallchatofuser", "post", {to: user_id}, headers );
  return resp;
};
exports.sendchat = async (chat,to) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("sendchat", "post", {message: chat,to: to}, headers );
  return resp;
};
exports.get_message_status = async () => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getmessagestatus", "post", {}, headers );
  return resp;
};
exports.updatemessagestatus = async (data) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("updatemessagestatus", "post", {value: data}, headers );
  return resp;
};
exports.updatepassword = async (data) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("updatepassword", "post", data, headers );
  return resp;
};
exports.deletechat = async (data) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("deletechat", "post", {id:data}, headers );
  return resp;
};
exports.getstat = async (data) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getstats", "post", {}, headers );
  return resp;
};
exports.add_view = async (data) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("addview", "post", {viewer:data}, headers );
  return resp;
};
exports.get_view = async (data) => {
  let token = await AsyncStorage.getItem("@Siktop:token");
  console.log("this is happenging", token);
  let headers = await{
    "token": token,
  }
  let resp = await api_call("getview", "post", {}, headers );
  return resp;
};
