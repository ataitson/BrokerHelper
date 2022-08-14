import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, useWindowDimensions, View, ScrollView } from 'react-native';
import { Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import CustomImageButton from '../../components/CustomImageButton';
import NewUser from '../../assets/newUser.png';
import AccountBook from '../../assets/accountBook.png';
import SendForm from '../../assets/sendForm.png';
import FinancialControl from '../../assets/financialControl.png';
import NewProcess from '../../assets/newProcess.png';
import Dashboard from '../../assets/dashboard.png';
import ForecastGraph from '../../components/ForecastGraph';
import Summary from '../../components/Summary';

function HomeScreen(props) {
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    
    const signOut = () => {
        Auth.signOut();
    }

    const onNewClientPressed = () => {
        navigation.navigate('NewClientScreen');
    }

    const onBookOfBusinessPressed = () => {
        navigation.navigate('BookOfBusinessOne');
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.hamburger}></View>
                <View name='graphics' style={styles.graphics}>
                    <ForecastGraph graphHeight={windowHeight} />
                </View>
            </View>
            <View style={styles.summary}>
                <Summary />
            </View>
            <View style={styles.navigation}>
                <CustomImageButton source={NewUser} onPress={onNewClientPressed}></CustomImageButton>
                <CustomImageButton source={AccountBook} onPress={onBookOfBusinessPressed}></CustomImageButton>
                <CustomImageButton source={SendForm}></CustomImageButton>
                <CustomImageButton source={FinancialControl}></CustomImageButton>
                <CustomImageButton source={NewProcess}></CustomImageButton>
                <CustomImageButton source={Dashboard}></CustomImageButton>
            </View>
            {/* <Text style={styles.signOut} onPress={signOut}> Sign Out </Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    graphics:{
        width: '100%',
        height: '100%',
    },
    hamburger: {
        width: '33%',
        backgroundColor: 'green'
    },
    header:{
        flex: 1,
        flexDirection: 'row',
        
    },
    navigation: {
        flex: 1.5,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 15,
        flexWrap: 'wrap'
    },
    signOut: {
        width: '100%',
        textAlign: 'center',
        color: 'red',
        marginTop: 'auto',
        marginVertical: 20,
        fontSize: 20,
    },
    summary: {
        flex: 3,
    }
})

export default HomeScreen;