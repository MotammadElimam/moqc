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
import Team1 from './Team1';
import TeamAttendance from './TeamAttendance';
import StudentProfile from './StudentProfile';
import ResetPassword from './ResetPassword';
import i18n from '../i18n';
const Tab = createMaterialTopTabNavigator();

function TabStProfile(props) {
    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: 15,color:'#fff' },
            tabBarStyle: { backgroundColor: '#579976' },
        }}>
            <Tab.Screen name={i18n.t("Update Details")} component={StudentProfile} />
            <Tab.Screen name={i18n.t("Reset Password")} component={ResetPassword}/>
        </Tab.Navigator>
    );
}
export default TabStProfile