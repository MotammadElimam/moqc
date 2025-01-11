import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    I18nManager,
    SafeAreaView,
    ImageBackground,
    Image,
    Dimensions,
    FlatList,
    Item,
} from 'react-native';
import API from "../api/";

import CheckBox from 'react-native-check-box'




class CreateCourse extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isChecked:false,
            students: [],

        };

    }

    componentDidMount() {
        this.getStudents()
    }


    getStudents = async () => {
        var students = [];
        await API.teacherStudents()
            .then(resp => {
                this.setState({ show_spinner: false })
                resp.map((m) => {
                    students.push(m);
                })
            })
        this.setState({
            students
        })
        console.log(this.state.students)
    }


    renderItem = ({ item }) => (
        <View style={{ margin: 10 }}>
            <CheckBox
                style={{ flex: 1, padding: 5 }}
                onClick={() => {
                    this.setState({
                        isChecked: !this.state.isChecked
                    })
                }}
                isChecked={this.state.isChecked}
                leftText={item.first_name}
            />
        </View>
    );

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.students}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                />

            </View>
        )
    }
}
export default CreateCourse