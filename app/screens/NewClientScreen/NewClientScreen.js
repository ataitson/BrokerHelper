import React, {useState} from 'react';
import { Alert, Image, Modal, StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { Auth, DataStore } from 'aws-amplify';
import {Client} from '../../../src/models';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import BackButton from '../../assets/backButton.png';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

function NewClientScreen(props) {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState();

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

    const onSignInPressed = () => {
        navigation.navigate('SignIn');
    }
    const onRenewalPressed = () => {
        setCalendarVisible(!calendarVisible);        
    }

    const onBackPressed = () => {
        navigation.navigate('Home');
    }

    return (
        <>
            <Pressable style={{flex: 0.15, alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 15}} onPress={onBackPressed}>
                <Image style={styles.backButton} source={BackButton}></Image>
            </Pressable>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.root}>            
                <Text style={styles.title}> Adding a new client </Text>

                <CustomInput name='name' placeholder={'Name'} rules={{
                        required: 'Name is required'}} control={control} />
                            
                <CustomInput name='driverLicence' placeholder={'Driver\'s Licence'} rules={{
                        required: 'Driver\'s Licence is required', 
                        minLength: {
                            value: 4, 
                            message: 'Name should be minimum 4 characters long'}}} control={control} />
                <CustomInput name='currentPolicy' placeholder={'Current Policy\'s renewal date'} newValue={selectedDate === undefined ? new Date().toDateString() : selectedDate} onPress={onRenewalPressed} rules={{
                        minLength: {
                            value: 10, 
                            message: 'Name should be minimum 4 characters long'}}} control={control} />
                <View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={calendarVisible}
                        onRequestClose={() => {
                            setCalendarVisible(!calendarVisible);
                        }}>
                            <Calendar
                                onDayPress={day => {
                                    setSelectedDate(day.dateString);
                                    setCalendarVisible(!calendarVisible);        
                                }}
                                
                                // Collection of dates that have to be marked. Default = {}
                                markedDates={{
                                    '2012-05-16': {selected: true, marked: true, selectedColor: 'blue'},
                                    '2012-05-17': {marked: true},
                                    '2012-05-18': {marked: true, dotColor: 'red', activeOpacity: 0},
                                    '2022-07-19': {disabled: true, disableTouchEvent: true}
                                }}
                            />
                    </Modal>
                </View>

                <CustomInput name='address' placeholder={'Address'} rules={{
                    required: 'Address is required'}}  control={control} />
                <CustomInput name='city' placeholder={'City'} rules={{
                    required: 'City is required'}}  control={control} />
                <CustomInput name='unit' placeholder={'Unit'} control={control} />
                <CustomInput name='postal' placeholder={'Postal Code'} rules={{
                    required: 'Postal Code is required'}}  control={control} />
                <CustomInput name='email' placeholder={'Email'} control={control} />
                <CustomInput name='phone' placeholder={'Primary phone number'} rules={{
                    required: 'Phone number is required'}} control={control} />
                <CustomInput name='priorInsurance' placeholder={'Prior insurance company'} control={control} />

                <CustomInput name='minorTickets' placeholder={'Minor/Tickets on last 3 years'} control={control} numeric/>
                <CustomInput name='majorSuspensions' placeholder={'Major/Suspensions on last 3 years'} control={control} numeric/>
                <CustomInput name='criminalViolations' placeholder={'Criminal violations last 10 years'} control={control} numeric/>                

                <CustomButton text={loading ? 'Saving...' : 'Save'} onPress={loading ? null : handleSubmit(onSavePressed)}/>
                <CustomButton text={'Have an account? Sign in?'} onPress={onSignInPressed} type='tertiary'/>                        
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
    link: {
        color: '#FDB075'
    },
    scrollView: {
        height: '20%',
        width: '100%',
        margin: 20,
        alignSelf: 'center',
        padding: 20,
    },    
    root: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20
    },
    text:{
        color: 'gray',
        marginVertical: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10
    }
});

export default NewClientScreen;