import React, {useState} from 'react';
import { Alert, Image, Modal, StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { Auth, DataStore } from 'aws-amplify';
import {Client} from '../../../src/models';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import CustomImageButton from '../../components/CustomImageButton';

import BackButton from '../../components/BackButton';
import Car from '../../assets/car.png';
import Home from '../../assets/home.png';
import Travel from '../../assets/travel.png';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

function NewProcessScreenOne(props) {
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState();

    const currentClient = route?.params?.currentClient;

    const {
        control, 
        handleSubmit, 
        watch,
    } = useForm();

    const pwd = watch('password')

    const onSavePressed = async (data) => {
        if(loading) {return;}

        const currentBroker = await Auth.currentAuthenticatedUser({bypassCache: true});

        const {name, driverLicence, currentPolicy, address, city, unit, postal, email, phone, priorInsurance, minorTickets, majorSuspensions, criminalViolations } = data;        

        setLoading(true);

        try {
            await DataStore.save(
              new Client({
                broker_id: currentBroker.attributes.email,
                name: name,
                driver_licence: driverLicence,
                current_policy_date: selectedDate,
                address: address,
                city: city,
                unit: unit,
                postal_code: postal,
                email: email,
                phone_number: phone,
                prior_insurance: priorInsurance,
                minor_tickets: minorTickets,
                major_suspensions: majorSuspensions,
                criminal_violations: criminalViolations
              })
            );
            Alert.alert('Success!', 'New client was created successfully.');

          } catch (e) {
            Alert.alert('Oops', e.message);
          }

          setLoading(false);
    }

    const onProcessPressed = (data) => {
        const parameters = {
            currentClient: currentClient,
            processType: data
        }

        navigation.navigate('NewProcessScreenTwo', {parameters});
    }
    const onRenewalPressed = () => {
        setCalendarVisible(!calendarVisible);        
    }

    const onBackPressed = () => {
        navigation.navigate('Home');
    }

    return (
        <>
            <View style={styles.header}>
                <BackButton />
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.root}>            
                <Text style={styles.title}> Create new process </Text>
                <View style={styles.navigation}>
                    <CustomImageButton border tint value='Car' source={Car} onPress={handleSubmit(() => onProcessPressed('Car'))}></CustomImageButton>
                    <CustomImageButton border tint value='Home' source={Home} onPress={handleSubmit(() => onProcessPressed('Home'))}></CustomImageButton>
                    {/* <CustomImageButton border tint value='Travel' source={Travel} onPress={handleSubmit(() => onProcessPressed('Travel'))}></CustomImageButton> */}
                </View>                                       
            </ScrollView>
        </>
        

    );
}

const styles = StyleSheet.create({
    backButton: {
        tintColor: '#051C60',
        resizeMode: 'contain',
        width: 50,
        height: 50
    },
    header:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    navigation: {
        width: '100%',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    scrollView: {
        height: '20%',
        width: '100%',
        margin: 20,
        alignSelf: 'center',
    },    
    title: {
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10
    }
});

export default NewProcessScreenOne;