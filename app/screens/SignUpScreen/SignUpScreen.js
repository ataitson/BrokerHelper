import React, {useState} from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { Auth } from 'aws-amplify';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

function SignUpScreen(props) {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const {
        control, 
        handleSubmit, 
        watch,
    } = useForm();

    const pwd = watch('password')

    const onRegisterPressed = async (data) => {
        if(loading) {return;}

        const {username, password, email, name} = data;        

        setLoading(true);

        try{
            await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                    name
                }

            });   //.signIn(data.username, data.password);

            navigation.navigate('ConfirmEmail', {username});
        }
        catch (e) {
            Alert.alert('Oops', e.message);
        }

        setLoading(false);
    }

    const onSignInPressed = () => {
        navigation.navigate('SignIn');
    }
    const onTermsOfUsePressed = () => {
        console.warn("Terms of Use");
    }
    const onPrivacyPolicyPressed = () => {
        console.warn("Privacy Policy");
    }

    return (

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.root}>            
                <Text style={styles.title}>Create an account</Text>

                <CustomInput name='name' placeholder={'Name'} rules={{
                        required: 'Name is required', 
                        minLength: {
                            value: 4, 
                            message: 'Name should be minimum 4 characters long'}}}  control={control} />

                <CustomInput name='username' placeholder={'Username'} rules={{
                        required: 'Username is required', 
                        minLength: {
                            value: 3, 
                            message: 'Username should be minimum 3 characters long'}}}  control={control} />
                <CustomInput name='email' placeholder={'Email'} rules={{required: 'Email is required', pattern: {value: EMAIL_REGEX, message: 'Email is invalid'} }}  control={control} />
                <CustomInput name='password' placeholder={'Password'} rules={{
                        required: 'Password is required', 
                        minLength: {
                            value: 8, 
                            message: 'Password should be minimum 8 characters long'}}}  control={control} secure />
                <CustomInput name='repeatPassword' placeholder={'Repeat Password'} rules={{
                        required: 'Repeat password is required', 
                        validate: value => value === pwd || 'Passwords do not match',
                        }}  
                            control={control} 
                        secure />
                <Text style={styles.text}>
                    By registering, you confirm that you accept our{' '}
                    <Text style={styles.link} onPress={onTermsOfUsePressed}>Terms of Use</Text> and{' '}
                    <Text style={styles.link} onPress={onPrivacyPolicyPressed}>Privacy Policy</Text>
                </Text>                  
                <CustomButton text={loading ? 'Processing...' : 'Register'} onPress={loading ? null : handleSubmit(onRegisterPressed)}/>
                <CustomButton text={'Have an account? Sign in?'} onPress={onSignInPressed} type='tertiary'/>        

                
        </ScrollView>

    );
}

const styles = StyleSheet.create({
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

export default SignUpScreen;