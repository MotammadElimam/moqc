import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Attendance from './Attendance';
import Course from './Course';
import Teacher1 from './Teacher1';
import Classes from './Classes';
import CreateCourse from './CreateCourse';
import i18n from '../i18n';

const Tab = createMaterialTopTabNavigator();

function MyTabs(props) {
    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: 12, color: '#fff' },
            tabBarStyle: { backgroundColor: '#579976' }
        }}>
            <Tab.Screen name={i18n.t("Students")}  component={<Teacher1 navigation={props.navigation} />} />
            {props.classes != "none" ?
                <Tab.Screen name={i18n.t("courses")} component={Classes} /> : null}
            {/* <Tab.Screen name="Course" component={Course} /> */}
            {/* <Tab.Screen name="Create Course" component={CreateCourse} /> */}
        </Tab.Navigator>
    );
}
export default MyTabs