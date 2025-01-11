import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Attendance from './Attendance';
import Course from './Course';
import Teacher1 from './Teacher1';
import Classes from './Classes';
import CreateCourse from './CreateCourse';
import CourseStudents1 from './CourseStudents1';
import ELessons from './ELessons';
import Exam from './Exam';
import StudentLesson from './StudentLessons1';
import StudentAttendance from './StudentAttendance';
import StudentExam from './StudentExam';
import DashboardStudent from './DashboardStudent';
import StudentProfile from './StudentProfile';
import StudentProfile1 from './StudentProfile1';
import i18n from '../i18n';

const Tab = createMaterialTopTabNavigator();

const getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : '';

    if (routeName === 'Profile') {
      return false;
    }

    return true;
  };


function TabdashSt(props) {
    return (
        <Tab.Navigator initialRouteName='Courses' screenOptions={{
            tabBarLabelStyle: { fontSize: 15, color: '#fff' },
            tabBarStyle: { backgroundColor: '#579976' },
        }}>
            <Tab.Screen name={i18n.t("Courses")} component={DashboardStudent} />
            <Tab.Screen  name={i18n.t("Profile")} component={StudentProfile1} 
           />
        </Tab.Navigator>
    );
}
export default TabdashSt