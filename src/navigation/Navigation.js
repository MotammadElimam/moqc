import 'react-native-gesture-handler';
import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, TouchableOpacity, Image, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-reanimated';

import '../i18n';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Signup1 from '../pages/Signup1';
import Signup2 from '../pages/Signup2';
import Signup3 from '../pages/Signup3';
import Signup4 from '../pages/Signup4';
import Signup5 from '../pages/Signup5';
import Signup6 from '../pages/Signup6';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Notifications from '../pages/Notifications';
import Team1 from '../pages/Team';
import Support from '../pages/Support';
import StudentsSupport from '../pages/StudentsSupport';
import Teacher from '../pages/Teacher';
import StudentsTeacher from '../pages/StudentsTeacher';
import Profile from '../pages/Profile';
// import Signup from '../pages/Inner';
// import Signup from '../pages/Inner';
// import Signup from '../pages/Inner';
import Compass from '../pages/Compass';

// Import Custom Sidebar
import SideBar from './SideBar';
import Media from '../pages/Media';
import Radio from '../pages/radio/Radio';
import Course from '../pages/Course';
import CourseStudents from '../pages/CourseStudents'
import CreateExam from '../pages/CreateExam';
import ExamReport from '../pages/ExamReport';
import Team from '../pages/Team';
import DashboardStudent from '../pages/DashboardStudent';
import StudentLesson from '../pages/StudentLesson';
import TeacherClasses from '../pages/TeacherClasses';
import CourseActions from '../pages/CourseActions';
import TabBar from './TabBar';
import { AsyncStorage } from 'react-native';
import IT from '../pages/IT';
import ItStudentView from '../pages/ItStudentView'
import DashboardStudent1 from '../pages/DashboardStudent1';
import EQuran from '../pages/EQuran';
import MediaCards from '../pages/MediaCards';
import newsDetails from '../pages/newsDetails';
import AllNews from '../pages/AllNews';
import Profile1 from '../pages/Profile1';

import TeamView1 from '../pages/TeamView1';
import CSList from '../pages/CSList';
import TeacherList from '../pages/TeacherList';
import ITList from '../pages/ITList';
import ItStudent from '../pages/ItStudent';
import ItEmail from '../pages/ItEmail'
import CSApprovedStudents from '../pages/CSApprovedStudents';
import ItApprovedStudents from '../pages/ItApprovedStudents';
import ItApprovedStudent from '../pages/ItApprovedStudent';
import i18n from '../i18n';
import ApprovedStudent from '../pages/approvedStudent';
import Classes from '../pages/Classes';
import register from '../pages/register';
import SideMenu from '../pages/components/sideMenu';
import Web from '../pages/web';
import ExamResult from '../pages/ExamResult';
import Qibla from '../pages/Qibla';

const Stack = createStackNavigator();
//const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();



const NavigationDrawerStructure = (props) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{ width: 25, height: 25, marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};

function landing({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="Landing"
        component={Landing}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function LoginStack({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ position: 'absolute', zIndex: 10, right: 20, bottom: 90 }}>
        <TouchableOpacity onPress={() => navigation.navigate("Media")}>
          <Image source={require('../assets/logo.png')} style={{ width: 44, height: 44 }} ></Image>
        </TouchableOpacity>
      </View> */}
      <Stack.Navigator
        initialRouteName="Login"

        screenOptions={{
          headerStyle: {
            backgroundColor: '#497c67', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}>

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Login', //Set Header Title
            headerShown: false
          }}
        />

<Stack.Screen
          name="Qibla"
          component={Qibla}
          options={{
            title: 'Qibla', //Set Header Title
            headerShown: false
          }}
        />

<Stack.Screen
          name="Register"
          component={register}
          options={{
            title: 'Register', //Set Header Title
            headerShown: false
          }}
        />

        <Stack.Screen
          name="Media"
          component={Media}
          options={{
            title: 'Media', //Set Header Title
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            title: 'Sign Up', //Set Header Title
            headerShown: false

          }}
        />
        <Stack.Screen
          name="Signup1"
          component={Signup1}
          options={{
            title: 'Sign Up', //Set Header Title
            headerShown: false

          }}
        />
        <Stack.Screen
          name="Signup2"
          component={Signup2}
          options={{
            title: 'Sign Up', //Set Header Title
            headerShown: false

          }}
        />
        <Stack.Screen
          name="Signup3"
          component={Signup3}
          options={{
            title: 'Sign Up', //Set Header Title
            headerShown: false

          }}
        />
        <Stack.Screen
          name="Signup4"
          component={Signup4}
          options={{
            title: 'Sign Up', //Set Header Title
            headerShown: false

          }}
        />
        <Stack.Screen
          name="Signup5"
          component={Signup5}
          options={{
            title: 'Sign Up', //Set Header Title
            headerShown: false

          }}
        />
        <Stack.Screen
          name="Signup6"
          component={Signup6}
          options={{
            title: 'Sign Up', //Set Header Title
            headerShown: false

          }}
        />
        <Stack.Screen
          name="Compass"
          component={Compass}
          options={{
            title: 'Compass', //Set Header Title
            headerShown: false

          }}
        />
      </Stack.Navigator>
    </View>
  );
}
function HomeStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Home"

      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            title: 'Sign Up', //Set Header Title
            headerShown: false

          }}
        />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home', //Set Header Title
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
}

function DashboardStack({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ position: 'absolute', zIndex: 10, right: 20, bottom: 90 }}>
      <TouchableOpacity onPress={() => navigation.navigate("Media")}>
        <Image source={require('../assets/logo.png')} style={{ width: 44, height: 44 }} ></Image>
      </TouchableOpacity>
    </View> */}
   
      <Stack.Navigator
        initialRouteName="Dashboard"

        screenOptions={{
          headerStyle: {
            backgroundColor: '#31314f', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}>

        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            title: 'Dashboard', //Set Header Title
            headerShown: false
          }}
        />

      </Stack.Navigator>
    </View>
  );
}


function StudentDashboardStack({ navigation }, props) {

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ position: 'absolute', zIndex: 10, right: 20, bottom: 90 }}>
      <TouchableOpacity onPress={() => navigation.navigate("Media")}>
        <Image source={require('../assets/logo.png')} style={{ width: 44, height: 44 }} ></Image>
      </TouchableOpacity>
    </View> */}
      <Stack.Navigator
        initialRouteName="DashboardStudent1"

        screenOptions={{
          headerStyle: {
            backgroundColor: '#31314f', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}>
          

        <Stack.Screen
          name="DashboardStudent"
          component={DashboardStudent1}
          options={{
            title: 'DashboardStudent', //Set Header Title
            headerShown: false
          }}
        />
         <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            title: 'Sign Up', //Set Header Title
            headerShown: false

          }}
        />
        {/* <Stack.Screen
          name="E-Quran"
          component={EQuran}
          options={{
            title: 'DashboardStudent', //Set Header Title
            headerShown: false
          }}
        /> */}

      </Stack.Navigator>
    </View>
  );
}


function NotificationsStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Notifications"

      screenOptions={{
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          title: 'Notifications', //Set Header Title
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
}
function TeamStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Team"

      screenOptions={{
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="Team"
        component={Team}
        options={{
          title: 'Team', //Set Header Title
          headerShown: false
        }}
      />
      <Stack.Screen
        name="TeamView1"
        component={TeamView1}
        options={{
          title: 'TeamView', //Set Header Title
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
}

function RadioStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Radio"

      screenOptions={{
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="Radio"
        component={Radio}
        options={{
          title: 'Radio', //Set Header Title
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
}

function MediaStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Media"

      screenOptions={{
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="Media"
        component={Media}
        options={{
          title: 'Media', //Set Header Title
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
}

function SupportStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="CSList"

      screenOptions={{
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="CSList"
        component={CSList}
        options={{
          title: 'C.S', //Set Header Title
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Support"
        component={Support}
        options={{
          title: 'C.S', //Set Header Title
          headerShown: false
        }}
      />
      <Stack.Screen
        name="CSApprovedStudents"
        component={CSApprovedStudents}
        options={{
          title: 'C.S', //Set Header Title
          headerShown: false
        }}
      />


    </Stack.Navigator>
  );
}
function TeacherStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="TeacherList"

      screenOptions={{
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="TeacherList"
        component={TeacherList}
        options={{
          title: 'C.S', //Set Header Title
          headerShown: false
        }}
      />
       <Stack.Screen
        name="CSApprovedStudents"
        component={CSApprovedStudents}
        options={{
          title: 'C.S', //Set Header Title
          headerShown: false
        }}
      />
            <Stack.Screen
        name="ManageCourse"
        component={Classes}
        options={{
          title: '', //Set Header Title
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Teacher"
        component={Teacher}
        options={{
          title: 'C.S', //Set Header Title
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
}

function ITStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="ITList"

      screenOptions={{
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="ITList"
        component={ITList}
        options={{
          title: 'IT', //Set Header Title
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ItStudent"
        component={ItStudent}
        options={{
          title: 'C.S', //Set Header Title
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ItApprovedStudents"
        component={ItApprovedStudent}
        options={{
          title: 'C.S', //Set Header Title
          headerShown: false
        }}
      />
      <Stack.Screen
        name="CreateEmail"
        component={ItEmail}
        options={{
          title: 'C.S', //Set Header Title
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
}

function ProfileStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Profile"

      screenOptions={{
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="Profile"
        component={Profile1}
        options={{
          title: 'Profile', //Set Header Title
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
}
function StudentsSupportStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="StudentsSupport"

      screenOptions={{
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="StudentsSupport"
        component={StudentsSupport}
        options={{
          title: 'C.S', //Set Header Title
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
}
function StudentsTeacherStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="StudentsTeacher"

      screenOptions={{
        headerStyle: {
          backgroundColor: '#31314f', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="StudentsTeacher"
        component={<StudentsTeacher navigation={navigation} />}
        options={{
          title: 'Teacher', //Set Header Title
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
}

function HomeTabs(props) {
  const [token, setToken] = React.useState()

  const checkUserSignedIn = async () => {

    let token = await AsyncStorage.getItem("@moqc:token")
    await setToken(token)
  }

  React.useEffect(() => {
    checkUserSignedIn();

  }, [token])

  return (<View style={{flex:1}}>
    <SideMenu/>
    <Tab.Navigator initialRouteName='Home'
    keyboardHidesTabBar={true}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
        style: {
          backgroundColor: '#fff',
          height: 55
        }
      }}
    >
      <Tab.Screen name="Dashboard" component={token ? DashboardStack : LoginStack}
        options={{
          tabBarColor: '#579976',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ justifyContent: "center", alignItems: 'center',minWidth:90 }}>
              {focused ? <Image source={require('../assets/dash_a.png')}
                style={{marginTop:-20, height: 50, width:50, resizeMode: 'contain' }} /> :
                <Image source={require('../assets/dash_f.png')}
                  style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
              <Text style={{ fontSize: 10,fontFamily:"GESSTwoMedium-Medium" }}>{i18n.t('Dashboard')}</Text>
            </View>
            // <MaterialCommunityIcons name="view-dashboard" color="#579976" size={40} />
          )
        }} />
{/* 
      <Tab.Screen name="Media" component={MediaStack}
        options={{
          tabBarColor: '#579976',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ justifyContent: "center", alignItems: 'center' }}>
              {focused ? <Image source={require('../assets/sm_a.png')}
                style={{ marginTop:-20, height: 50, width:50, resizeMode: 'contain' }} /> :
                <Image source={require('../assets/sm_f.png')}
                  style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
              <Text style={{ fontSize: 10 }}>{i18n.t('Social Media')}</Text>
            </View>
            // <MaterialCommunityIcons name="view-dashboard" color="#579976" size={40} />
          )
        }} /> */}
      <Tab.Screen name="Home" component={HomeStack}
        options={{
          tabBarColor: '#579976',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ justifyContent: "center", alignItems: 'center',minWidth:90 }}>
              {focused ? <Image source={require('../assets/home_a.png')}
                style={{marginTop:-20, height: 50, width:50, resizeMode: 'contain' }} />
                : <Image source={require('../assets/home_f.png')}
                  style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
              <Text style={{ fontSize: 10 ,fontFamily:"GESSTwoMedium-Medium"}}>{i18n.t('Home')}</Text>
            </View>
            // <MaterialCommunityIcons name="view-dashboard" color="#579976" size={40} />
          )
        }}
      />
      <Tab.Screen name="Profile" component={token ? ProfileStack : LoginStack}
        options={{
          tabBarColor: '#579976',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ justifyContent: "center", alignItems: 'center',minWidth:90 }}>
              {focused ? <Image source={require('../assets/user.png')}
                style={{ marginTop:-20, height: 50, width:50, resizeMode: 'contain' }} /> : <Image source={require('../assets/user.png')}
                  style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
              <Text style={{ fontSize: 10,fontFamily:"GESSTwoMedium-Medium" }}>{i18n.t('Profile')}</Text>
            </View>
            // <MaterialCommunityIcons name="view-dashboard" color="#579976" size={40} />
          )
        }} />

      {/* <Tab.Screen name="Radio" component={RadioStack}
        options={{
          tabBarColor: '#579976',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ justifyContent: "center", alignItems: 'center' }}>
              {focused ? <Image source={require('../assets/radio_a.png')}
                style={{marginTop:-20, height: 50, width:50, resizeMode: 'contain' }} /> :
                <Image source={require('../assets/radio_f.png')}
                  style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
              <Text style={{ fontSize: 10 }}>{i18n.t('Radio')}</Text>
            </View>
            // <MaterialCommunityIcons name="view-dashboard" color="#579976" size={40} />
          )
        }} /> */}
    </Tab.Navigator>

    </View>
  );
}

function HomeStudentTabs(props) {
  const [token, setToken] = React.useState()

  const checkUserSignedIn = async () => {
    let token = await AsyncStorage.getItem("@moqc:token")
    setToken(token)
  }
  React.useEffect(() => {
    checkUserSignedIn();
  }, [token])

  return (
<View style={{flex:1}}>
  <SideMenu/>
    <Tab.Navigator initialRouteName='Home'
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
        style: {

          backgroundColor: '#fff',
          height: 55
        }
      }}
    >

      <Tab.Screen name="Dashboard" component={token ? StudentDashboardStack : LoginStack}
        options={{
          tabBarColor: '#579976',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ justifyContent: "center", alignItems: 'center' }}>
              {focused ? <Image source={require('../assets/dash_a.png')}
                style={{marginTop:-20, height: 50, width:50, resizeMode: 'contain' }} /> :
                <Image source={require('../assets/dash_f.png')}
                  style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
              <Text style={{ fontSize: 10 }}>{i18n.t('Dashboard')}</Text>
            </View>
            // <MaterialCommunityIcons name="view-dashboard" color="#579976" size={40} />
          )
        }} />
      {/* <Tab.Screen name="Social Media" component={MediaStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ justifyContent: "center", alignItems: 'center' }}>
              {focused ? <Image source={require('../assets/sm_a.png')}
                style={{marginTop:-20, height: 50, width:50, resizeMode: 'contain' }} /> :
                <Image source={require('../assets/sm_f.png')}
                  style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
              <Text style={{ fontSize: 10 }}>{i18n.t('Social Media')}</Text>
            </View>
            // <MaterialCommunityIcons name="view-dashboard" color="#579976" size={40} />
          )
        }} /> */}
      <Tab.Screen name="HomeStudent" component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ justifyContent: "center", alignItems: 'center' }}>
              {focused ? <Image source={require('../assets/home_a.png')}
                style={{marginTop:-20, height: 50, width:50, resizeMode: 'contain' }} />
                : <Image source={require('../assets/home_f.png')}
                  style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
              <Text style={{ fontSize: 10 }}>{i18n.t('Home')}</Text>
            </View>
            // <MaterialCommunityIcons name="view-dashboard" color="#579976" size={40} />
          ),
        }}
      />
      {/* <Tab.Screen name="Profile" component={token ? ProfileStack : LoginStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ justifyContent: "center", alignItems: 'center', top: 10 }}>
              {focused ? <Image source={require('../assets/profile_a.png')}
                style={{ height: 85, width: 85, resizeMode: 'contain' }} /> : <Image source={require('../assets/profile_f.png')}
                  style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
              <Text style={{ fontSize: 10 }}>Profile</Text>
            </View>
          ),
        }} /> */}
      {/* <Tab.Screen name="Compass" component={RadioStack}
        options={{
          tabBarLabel: 'Compass',
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ justifyContent: "center", alignItems: 'center' }}>
              {focused ? <Image source={require('../assets/radio_a.png')}
                style={{marginTop:-20, height: 50, width:50, resizeMode: 'contain' }} /> :
                <Image source={require('../assets/radio_f.png')}
                  style={{ height: 30, width: 30, resizeMode: 'contain' }} />}
              <Text style={{ fontSize: 10 }}>{i18n.t('Radio')}</Text>
            </View>
            // <MaterialCommunityIcons name="view-dashboard" color="#579976" size={40} />
          ),
        }} /> */}
    </Tab.Navigator>
    </View>
  );
}


function Navigation(props) {
  return (
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen
          name="Landing"
          component={landing}
          options={{
            title: 'Home', //Set Header Title
            headerShown: false,
            tabBarStyle: 'none'
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginStack}
          options={{
            title: 'Home', //Set Header Title
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Qibla"
          component={Qibla}
          options={{
            title: 'Qibla', //Set Header Title
            headerShown: false
          }}
        />
        <Stack.Screen name="Home" options={{
          title: 'Home', //Set Header Title
          headerShown: false
        }} component={HomeTabs} />

        <Stack.Screen name="HomeStudent" options={{
          title: 'Home', //Set Header Title
          headerShown: false
        }} component={HomeStudentTabs} />

        <Stack.Screen
          name="Radio"
          options={{ gestureEnabled: true, drawerLabel: 'Radio' }}
          component={RadioStack}

        />
        <Stack.Screen
          name="Media"
          options={{ gestureEnabled: true, drawerLabel: 'Media' }}
          component={MediaStack}

        />

<Stack.Screen
          name="Web"
          options={{headerShown:false, gestureEnabled: true, drawerLabel: 'MOQC' }}
          
          component={Web}

        />

        {/* <Stack.Screen
          name="Team"
          options={{ gestureEnabled: true, drawerLabel: 'Team', headerShown: false }}
          component={TeamStack}
        /> */}
        <Stack.Screen
          name="Support"
          options={{ gestureEnabled: true, drawerLabel: 'Support', headerShown: false }}
          component={SupportStack}
        />
        <Stack.Screen
          name="StudentsSupport"
          options={{ gestureEnabled: true, drawerLabel: 'StudentsSupport', headerShown: false }}
          component={StudentsSupportStack}
        />
        <Stack.Screen
          name="StudentsTeacher"
          options={{ gestureEnabled: true, drawerLabel: 'StudentsTeacher', headerShown: false }}
          component={StudentsTeacherStack}
        />
        <Stack.Screen
          name="Teacher"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={TeacherStack}
        />
        <Stack.Screen
          name="Course"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={Course}
        />
        <Stack.Screen
          name="CourseStudents"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={CourseStudents}
        />
        <Stack.Screen
          name="CreateExam"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={CreateExam}
        />
        <Stack.Screen
          name="ExamResult"
          options={{ gestureEnabled: true, drawerLabel: 'Exam Result', headerShown: false }}
          component={ExamResult}
        />
        <Stack.Screen
          name="ExamReport"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={ExamReport}
        />
        <Stack.Screen
          name="Team"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={TeamStack}
        />
        <Stack.Screen
          name="StudentLesson"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={StudentLesson}
        />
        <Stack.Screen
          name="TeacherClasses"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={TeacherClasses}
        />
        <Stack.Screen
          name="CourseActions"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={CourseActions}
        />
        <Stack.Screen
          name="Notification"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={NotificationsStack}
        />
        <Stack.Screen
          name="Compass"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={Compass}
        />
        <Stack.Screen
          name="IT"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={ITStack}
        />
        <Stack.Screen
          name="ItStudentView"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={ItStudentView}
        />
        <Stack.Screen
          name="E-Quran"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={EQuran}
        />
        <Stack.Screen
          name="MediaCards"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={MediaCards}
        />
        <Stack.Screen
          name="AllNews"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={AllNews}
        />
        <Stack.Screen
          name="NewsDetails"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher', headerShown: false }}
          component={newsDetails}
        />

        

    


      </Stack.Navigator>

      {/* <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: '#497c67',
          itemStyle: { marginVertical: 5 },
        }}
        drawerContent={(props) => <SideBar {...props} />}>
        <Drawer.Screen
          name="Landing"
          options={{ gestureEnabled: false, }}
          component={landing}
        />
        <Drawer.Screen
          name="Login"
          options={{ gestureEnabled: true, drawerLabel: 'Login' }}
          component={LoginStack}
        />

        <Drawer.Screen
          name="Radio"
          options={{ gestureEnabled: true, drawerLabel: 'Radio' }}
          component={RadioStack}
        />
        <Drawer.Screen
          name="Media"
          options={{ gestureEnabled: true, drawerLabel: 'Media' }}
          component={MediaStack}
        />
        <Drawer.Screen
          name="Home"
          options={{ gestureEnabled: true, drawerLabel: 'Home' }}
          component={HomeStack}
        />
        <Drawer.Screen
          name="Dashboard"
          options={{ gestureEnabled: true, drawerLabel: 'Dashboard' }}
          component={DashboardStack}
        />
        <Drawer.Screen
          name="Notifications"
          options={{ gestureEnabled: true, drawerLabel: 'Notifications' }}
          component={NotificationsStack}
        />
        <Drawer.Screen
          name="Team"
          options={{ gestureEnabled: true, drawerLabel: 'Team' }}
          component={TeamStack}
        />
        <Drawer.Screen
          name="Support"
          options={{ gestureEnabled: true, drawerLabel: 'Support' }}
          component={SupportStack}
        />
        <Drawer.Screen
          name="StudentsSupport"
          options={{ gestureEnabled: true, drawerLabel: 'StudentsSupport' }}
          component={StudentsSupportStack}
        />
        <Drawer.Screen
          name="StudentsTeacher"
          options={{ gestureEnabled: true, drawerLabel: 'StudentsTeacher' }}
          component={StudentsTeacherStack}
        />
        <Drawer.Screen
          name="Teacher"
          options={{ gestureEnabled: true, drawerLabel: 'Teacher' }}
          component={TeacherStack}
        />
        <Drawer.Screen
          name="Profile"
          options={{ gestureEnabled: true, drawerLabel: 'Profile' }}
          component={ProfileStack}
        />
        <Drawer.Screen
          name="Signup"
          options={{ gestureEnabled: false, drawerLabel: '' }}
          component={Signup}
        />
      </Drawer.Navigator> */}
    </NavigationContainer>
  );
}

export default Navigation;
