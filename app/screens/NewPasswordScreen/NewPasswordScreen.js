import React, {useState} from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { Auth } from 'aws-amplify';
import {useRoute} from '@react-navigation/native';

function NewPasswordScreen(props) {
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const {
        control, 
        handleSubmit, 
        watch,
    } = useForm({defaultValues: {username: route?.params?.username}});

    const username = watch('username');
    const pwd = watch('password');

    const onSubmitPressed = async (data) => {
        if(loading) {return;}
        setLoading(true);

        

        try{   
            await Auth.forgotPasswordSubmit (data.username, data.code, data.password);
            Alert.alert('Yay!', 'New password created successfully');

            navigation.navigate('SignIn');
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

                <CustomInput 
                    name="username" 
                    placeholder={'Enter your username'} 
                    rules={{required: 'Username is required' }}
                 control={control} />
                <CustomInput name="code" placeholder={'Enter your code'} rules={{
                        required: 'Code is required'}} control={control} />
                <CustomInput name="password" placeholder={'Enter new password'} rules={{
                        required: 'Password is required', 
                        minLength: {
                            value: 8, 
                            message: 'Password should be minimum 8 characters long'}}} control={control} secure />
                <CustomInput name='repeatPassword' placeholder={'Repeat Password'} rules={{
                        required: 'Repeat password is required', 
                        validate: value => value === pwd || 'Passwords do not match',
                        }}  
                            control={control} 
                        secure />
                            
                <CustomButton text={loading ? 'Submitting...' : 'Submit'} onPress={handleSubmit(onSubmitPressed)}/>
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

export default NewPasswordScreen;