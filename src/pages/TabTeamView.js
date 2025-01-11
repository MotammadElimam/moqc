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
import i18n from '../i18n';
import TeamView from './TeamView';
import TeamPassword from './TeamPassword';
import TeamPermissions from './TeamPermissions';


const Tab = createMaterialTopTabNavigator();

function TabTeamView(props) {
    const temp = props.team_id
    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: 15, color: '#fff' },
            tabBarStyle: { backgroundColor: '#579976' },
        }}>
            <Tab.Screen name={i18n.t("Profile")} component={TeamView} initialParams={{ team_id: temp }} />
            <Tab.Screen name={i18n.t("Password")} component={TeamPassword} initialParams={{ team_id: temp }} />
            <Tab.Screen name={i18n.t("Permissions")} component={TeamPermissions} initialParams={{ team_id: temp }} />
        </Tab.Navigator>
    );
}
export default TabTeamView