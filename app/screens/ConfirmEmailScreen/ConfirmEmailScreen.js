import React, {useState} from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { Auth } from 'aws-amplify';
import {useRoute} from '@react-navigation/native';

function ConfirmEmailScreen(props) {
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const {
        control, 
        handleSubmit, 
        watch,
    } = useForm({defaultValues: {username: route?.params?.username}});
    
    const username = watch('username');

    const onConfirmPressed = async (data) => {
        if(loading) {return;}
        setLoading(true);

        try{   
            const response = await Auth.confirmSignUp(data.username, data.code);
            navigation.navigate('Home');    
        }
        catch(e){
            Alert.alert('Oops', e.message);
        }
        setLoading(false);        
    }

    const onResendPressed = async () => {
        if(loading) {return;}
        setLoading(true);

        try{   
            const response = await Auth.resendSignUp(username)
            Alert.alert('New code!', 'A new code was sent to your email.');
        }
        catch(e){
            Alert.alert('Oops', e.message);
        }
        setLoading(false);      
    }
    const onSignInPressed = () => {
        navigation.navigate('SignIn');
    }

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.root}>            
                <Text style={styles.title}>Confirm your E-mail</Text>
                <Text style={styles.notice}>An email containing a confirmation code was sent to the email address you provided. </Text>
                <CustomInput name="username" placeholder={'Username'} rules={{
                        required: 'Username is required', 
                        minLength: {
                            value: 8, 
                            message: 'Username should be minimum 5 characters long'}}} control={control} />

                <Text style={styles.label}>Confirmation Code</Text>
                <CustomInput name="code" placeholder={'Enter your code'} rules={{
                        required: 'Code is required',}} control={control} />
                <CustomButton text={loading ? 'Confirming...' : 'Confirm'} onPress={handleSubmit(onConfirmPressed)}/>
                <CustomButton text={'Resend Code'} onPress={onResendPressed} type='secondary'/>
                <CustomButton text={'Back to Sign In'} onPress={onSignInPressed} type='tertiary'/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    label:{
        marginTop: 25,
        color: '#051C60',
        alignSelf:'flex-start'
    },
    link: {
        color: '#FDB075'
    },
    notice:{
        textAlign: 'center',
        color: '#051C60',
        marginBottom: 15
    },
    scrollView: {
        height: '20%',
        width: '100%',
        margin: 20,
        alignSelf: 'center',
        padding: 20,
    },    
    root: {
        flex: 1,
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
        margin: 5
    }
});

export default ConfirmEmailScreen;