import React, {useState} from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { Auth } from 'aws-amplify';
import {useRoute} from '@react-navigation/native';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

function ForgotPasswordScreen(props) {
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const {
        control, 
        handleSubmit, 
        watch,
    } = useForm({defaultValues: {username: route?.params?.recoverUsername}});

    const username = watch('username');

    const onSendPressed = async (data) => {
        if(loading) {return;}
        setLoading(true);

        try{   
            await Auth.forgotPassword(data.username);
            navigation.navigate('NewPassword', {username});
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
                <Text style={styles.title}>Reset your password</Text>
                
                <Text style={styles.label}>Username</Text>
                <CustomInput 
                    name="username" 
                    placeholder={'Enter your username'} 
                    rules={{required: 'Username is required' }}
                 control={control} />
                <CustomButton text={loading ? 'Sending...' : 'Send'} onPress={handleSubmit(onSendPressed)}/>
                <CustomButton text={'Back to Sign In'} onPress={onSignInPressed} type='tertiary'/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    label:{
        marginTop: 25,
        alignSelf:'flex-start'
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
        margin: 10
    }
});

export default ForgotPasswordScreen;