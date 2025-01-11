import React, {useLayoutEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    TextInput,
    I18nManager,
    SafeAreaView,
    ImageBackground
} from 'react-native';
import {withTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart';
import { AsyncStorage } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';

const data = [
    {
        label: 'العربية',
        value: 'ar'
    }, {
        label: 'English',
        value: 'en'

    }
];

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null
        };
    }

    componentDidMount() {
        this.load_data();
        // this.registerForPushNotificationsAsync(); this._notificationSubscription =
        // Notifications.addListener(this._handleNotification);
    }

    load_data = async() => {
        let lang = await AsyncStorage.getItem("@moqc:language");
        console.log("this is happenging", lang);
        if (lang == null || lang == "null") {

            // i18n     .changeLanguage(i18n.language === 'ar'     ? 'en'     : 'ar')
            // .then(() => {         I18nManager.forceRTL(i18n.language === 'ar');
            // RNRestart.Restart();     });
            return;
        }
    }

    render() {
        const {t, i18n} = this.props;
        return (
            <SafeAreaView style={{
                flex: 1
            }}>

                <ImageBackground
                    source={require('../assets/bg_img.png')}
                    style={{
                    width: '100%',
                    height: '100%'
                }}>
                    <View style={styles.wrapper}>
                        <View style={styles.sectionWrapper}>
                            <Text style={styles.heading}>{t('Hello world')}</Text>
                            <Text style={styles.regularText}>
                                {t('Some text goes here, some more text goes here')}
                            </Text>
                        </View>
                        <View style={styles.sectionWrapper}>
                            <Text style={styles.heading}>{t('Row test')}</Text>
                            <View style={styles.row}>
                                <Text>{t('column 1')}</Text>
                                <Text>{t('column 2')}</Text>
                                <Text>{t('column 3')}</Text>
                            </View>
                        </View>
                        <View style={styles.sectionWrapper}>
                            <RadioButtonRN
                                data={data}
                                selectedBtn={(e) => this.setState({selected: e.value})}
                                box={false}
                                animationTypes={['pulse']}/>
                        </View>
                        <View style={styles.sectionWrapper}>
                            <Button
                                title={t('Go to Inner screen ->')}
                                onPress={() => navigation.navigate('Inner')}/>
                        </View>
                        <View style={styles.sectionWrapper}>
                            <Button
                                title="Drawer"
                                onPress={() => {
                                this
                                    .props
                                    .navigation
                                    .openDrawer()
                            }}/>
                        </View>
                        <View style={styles.sectionWrapper}>
                            <Button
                                title={t('Change language')}
                                onPress={() => {
                                i18n
                                    .changeLanguage(i18n.language === 'ar'
                                    ? 'en'
                                    : 'ar')
                                    .then(() => {
                                        I18nManager.forceRTL(i18n.language === 'ar');
                                        RNRestart.Restart();
                                    });
                            }}/>
                        </View>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        )
    }
}

export default (Home)

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    sectionWrapper: {
        padding: 20
    },
    heading: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'left'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    regularText: {
        textAlign: 'left'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textInput: {
        textAlign: I18nManager.isRTL
            ? 'right'
            : 'left'
    }
});