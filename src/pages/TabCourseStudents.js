import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Attendance from './Attendance';
import Course from './Course';
import Teacher1 from './Teacher1';
import Classes from './Classes';
import CreateCourse from './CreateCourse';
import CourseStudents1 from './CourseStudents1';
import ELessons from './ELessons';
import Exam from './Exam';
import i18n from '../i18n';

const Tab = createMaterialTopTabNavigator();

function TabCourseStudents(props) {
    const temp = props.course_id
    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: 10,color:'#fff' },
            tabBarStyle: { backgroundColor: '#579976' },
        }}>
            <Tab.Screen name={i18n.t("Students")} component={CourseStudents1} initialParams={{course_id:temp}} />
            <Tab.Screen name={i18n.t("E-Lessons")} component={ELessons} initialParams={{course_id:temp}}/>
            <Tab.Screen name={i18n.t("Attendance")} component={Attendance} initialParams={{course_id:temp}}/>
            <Tab.Screen name={i18n.t("Exam")} component={Exam} initialParams={{course_id:temp}}/>
        </Tab.Navigator>
    );
}
export default TabCourseStudents