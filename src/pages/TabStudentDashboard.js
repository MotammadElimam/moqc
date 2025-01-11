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
import i18n from '../i18n';


const Tab = createMaterialTopTabNavigator();

function TabStudentDashboard(props) {
    const temp = props.course_id
    return (
        <Tab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: 15, color: '#fff' },
            tabBarStyle: { backgroundColor: '#579976' },
        }}>
            <Tab.Screen name={i18n.t("E-Lessons")} component={StudentLesson} initialParams={{ course_id: temp }} />
            <Tab.Screen name={i18n.t("Attendance")} component={StudentAttendance} initialParams={{ course_id: temp }} />
            <Tab.Screen name={i18n.t("Exam")} component={StudentExam} initialParams={{ course_id: temp }} />
        </Tab.Navigator>
    );
}
export default TabStudentDashboard