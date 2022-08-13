import React, {useState, useEffect} from 'react';
import { Alert, Image, Modal, StyleSheet, Text, View, ScrollView, Pressable, Touchable } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SegmentedControls } from 'react-native-radio-buttons'

import { useForm } from 'react-hook-form';
import { Auth, DataStore } from 'aws-amplify';
import {Client, PolicyCar, PolicyHome} from '../../../src/models';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import BackButton from '../../components/BackButton';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

function NewProcessScreenTwo(props) {
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const [selectedOption, setSelectedOption] = useState();
    const [loadedProcess, setLoadedProcess] = useState();

    const options = [
        "2WD",
        "4WD"
      ];

    const {
        control, 
        handleSubmit, 
        watch,
    } = useForm();

    const pwd = watch('password')

    const currentClient = route?.params?.parameters.currentClient;
    const processType = route?.params?.parameters.processType;
    const processId = route?.params?.parameters.id;
    
    const onScreenLoad = async () => {
        if(processId != undefined)
        {
            try{
                const process = await DataStore.query(processType === 'Car' ? PolicyCar : PolicyHome, processId);
                if(process)
                {
                    setLoadedProcess(process);
                    if(processType === 'Car'){
                        setSelectedOption(process.wheel_drive);
                    }
                }
            }
            catch(e){

            }
        }
    }
    useEffect(() => {
        // write your code here, it's like componentWillMount
        onScreenLoad();
    }, []);

    const onSaveCarPressed = async (data) => {
        if(loading) {return;}

        const currentBroker = await Auth.currentAuthenticatedUser({bypassCache: true});
        const {name, vehicleMake, vehicleModelTrim, vehicleYear, wheelDrive } = data;        

        setLoading(true);

        try {
            await DataStore.save(
            new PolicyCar({
                broker_id: currentBroker.attributes.email,
                client_id: currentClient.email,
                registered_owner: name,
                vehicle_make: vehicleMake,
                vehicle_model: vehicleModelTrim,
                vehicle_year: vehicleYear,
                wheel_drive: wheelDrive,
            })
            );
            Alert.alert('Success!', 'New policy was added successfully.');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Oops', e.message);
        }

        setLoading(false);
    }

    const onSaveHomePressed = async (data) => {
        if(loading) {return;}

        const currentBroker = await Auth.currentAuthenticatedUser({bypassCache: true});

        const {streetNumber, streetName, unitNumber, postalCode } = data;        
        setLoading(true);

        try {
            await DataStore.save(
            new PolicyHome({
                broker_id: currentBroker.attributes.email,
                client_id: currentClient.email,
                street_number: streetNumber,
                street_name: streetName,
                unit_number: unitNumber,
                postal_code: postalCode,
            })
            );
            Alert.alert('Success!', 'New policy was added successfully.');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Oops', e.message);
        }

        setLoading(false);
    }

    const onSaveTravelPressed = async (data) => {
        if(loading) {return;}

        const currentBroker = await Auth.currentAuthenticatedUser({bypassCache: true});

        const {name, vehicleMake, vehicleModelTrim, vehicleYear, wheelDrive } = data;        
//, address, city, unit, postal, email, phone, priorInsurance, minorTickets, majorSuspensions, criminalViolations
        setLoading(true);

        try {
            await DataStore.save(
            new PolicyCar({
                broker_id: currentBroker.attributes.email,
                client_id: currentClient.email,
                registered_owner: name,
                vehicle_make: vehicleMake,
                vehicle_model: vehicleModelTrim,
                vehicle_year: vehicleYear,
                wheel_drive: wheelDrive
            })
            );
            Alert.alert('Success!', 'New policy was added successfully.');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Oops', e.message);
        }

          setLoading(false);
    }

    function renderOption(option, selected, onSelect, index){
        const style = selected ? { fontWeight: 'bold'} : {};
     
        return (
          <Touchable onPress={onSelect} key={index}>
            <Text style={style}>{option}</Text>
          </Touchable>
        );
    }
     
    function renderContainer(optionNodes){
        return <View>{optionNodes}</View>;
    }

    const SetSelectedOption = (selection) => {
        setSelectedOption(selection);
    }

    return (
        <>
            <View style={styles.header}>
                <BackButton />
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.root}>            
                <Text style={styles.title}> New {processType} Insurance </Text>

                { processType === 'Car' && <>
                
                    <CustomInput name='name' placeholder={'Registered owner of the vehicle'} rules={{
                            required: 'Name is required'}} newValue={loadedProcess ? loadedProcess.registered_owner : ""} control={control} />

                    <Text style={{
                        alignSelf: 'flex-start', 
                        marginTop: 15, 
                        marginLeft: 10, 
                        fontSize: 16, 
                        fontWeight: 'bold', 
                        color: '#051C60'}}>
                        Vehicle
                    </Text>
                    <CustomInput name='vehicleVIN' placeholder={'Vehicle VIN'} newValue={loadedProcess ? loadedProcess.vehicle_VIN : ""} rules={{
                            required: 'VIN is required'}} control={control} />
                    <CustomInput name='vehicleYear' placeholder={'Vehicle Year'} newValue={loadedProcess ? loadedProcess.vehicle_year : ""} numeric rules={{
                            required: 'Year is required'}} control={control} />
                    <CustomInput name='vehicleMake' placeholder={'Vehicle Make'} newValue={loadedProcess ? loadedProcess.vehicle_make : ""} rules={{
                            required: 'Make is required'}} control={control} />
                    <CustomInput name='vehicleModelTrim' placeholder={'Vehicle Model/Trim'} newValue={loadedProcess ? loadedProcess.vehicle_model : ""} rules={{
                            required: 'Model/Trim is required'}} control={control} />
                    <CustomInput name='policyValue' placeholder={'Policy Premium'} newValue={loadedProcess ? '' + loadedProcess.policy_value : ""} rules={{
                            required: 'Policy Value is required'}} control={control} />

                    <SegmentedControls
                        name='wheelDrive'
                        options={ options }
                        selectedOption={ selectedOption }

                        onSelection={ (text) => setSelectedOption(text)  }/>
                </>}
                {
                    processType === 'Home' && <>
                    <CustomInput name='name' placeholder={'Owner of the property'} rules={{
                            required: 'Name is required'}} control={control} />

                    <Text style={{
                        alignSelf: 'flex-start', 
                        marginTop: 15, 
                        marginLeft: 10, 
                        fontSize: 16, 
                        fontWeight: 'bold', 
                        color: '#051C60'}}>
                        Vehicle
                    </Text>
                    <CustomInput name='streetNumber' placeholder={'Street #'} rules={{
                            required: 'Street # is required'}} control={control} />
                    <CustomInput name='streetName' placeholder={'Street name'} numeric rules={{
                            required: 'Street name is required'}} control={control} />
                    <CustomInput name='unitNumber' placeholder={'Unit #'} control={control} />
                    <CustomInput name='postalCode' placeholder={'Postal code'} rules={{
                            required: 'Postal code is required'}} control={control} />
                    
                    </>
                }
                
                <CustomButton text={loading ? 'Saving...' : 'Save'} onPress={loading ? null : handleSubmit(processType === 'Car' ? onSaveCarPressed : processType === 'Home' ? onSaveHomePressed : onSaveTravelPressed)}/>
            </ScrollView>
        </>
        

    );
}

const styles = StyleSheet.create({
    header:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
    },
    text:{
        color: 'gray',
        marginVertical: 10
    },
    title: {
        width: '100%',
        flexWrap: 'nowrap',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10
    }
});

export default NewProcessScreenTwo;