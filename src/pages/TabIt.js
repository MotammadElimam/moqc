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
import ItStudent from './ItStudent';
import ItApprovedStudents from './ItApprovedStudents';
import ItEmail from './ItEmail';
import i18n from '../i18n';


const Tab = createMaterialTopTabNavigator();

function TabIt(props) {
    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: 15, color: '#fff' },
            tabBarStyle: { backgroundColor: '#579976' },
        }}>
            {/* <Tab.Screen name="Approved Students" component={ItApprovedStudents} /> */}
            <Tab.Screen name={i18n.t("All Students")} component={ItStudent} />
            <Tab.Screen name={i18n.t("Email")} component={ItEmail} />
        </Tab.Navigator>
    );
}
export default TabIt