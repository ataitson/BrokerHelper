import React, {useState} from 'react';
import { Image, ImageBackground, StyleSheet, Text, useWindowDimensions, View, ScrollView,TextInput, Alert } from 'react-native';
import Logo from '../../assets/broker2.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { Auth } from 'aws-amplify';

function WelcomeScreen(props) {
    const navigation = useNavigation();
    const {height} = useWindowDimensions();
    const [loading, setLoading] = useState(false);

    const {
        control, 
        handleSubmit, 
        watch,
        formState: {errors},
    } = useForm();

    const recoverUsername = watch('username');

    const onSignInPressed = async (data) => {
        if(loading) {return;}
        const {username} = data;
        setLoading(true);

        try{
            const response = await Auth.signIn(data.username, data.password);
        }
        catch (e){
            e.message.includes("confirmed") ? navigation.navigate('ConfirmEmail', {username}) : Alert.alert('Oops', e.message);
        }
        
        setLoading(false);
    }

    const onForgotPasswordPressed = () => {
        navigation.navigate('ForgotPassword', {recoverUsername});
    }

    const onCreateAccountPressed = () => {
        navigation.navigate('SignUp');
    }

    return (

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.root}>            
                <Image source={Logo} style={[styles.logo, {height: height * 0.3}]} resizeMode='contain'></Image>

                <CustomButton text={'Don\'t have an account?'} onPress={onCreateAccountPressed} type='tertiary'/>
                <CustomInput name="username" placeholder="Username" rules={{
                        required: 'Username is required', 
                        minLength: {
                            value: 3, 
                            message: 'Username should be minimum 3 characters long'}}}  control={control} />
                <CustomInput 
                    name="password" 
                    placeholder="Password"
                    rules={{
                        required: 'Password is required', 
                        minLength: {
                            value: 3, 
                            message: 'Password should be minimum 3 characters long'}}} 
                    control={control} 
                secure />
                                
                <CustomButton text={loading ? 'Signing In' : 'Sign In'} onPress={loading ? null : handleSubmit(onSignInPressed)}/>
                <CustomButton text={'Forgot password?'} onPress={onForgotPasswordPressed} type='tertiary'/>                          
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    scrollView: {
        height: '20%',
        width: '100%',
        margin: 20,
        alignSelf: 'center',
        padding: 20,
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        paddingBottom: 50
    },
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    loginButton: {
        width: '100%',
        height: 70,
        backgroundColor: '#fc5c65'
    },
    logo:{
        position: 'absolute',
        top: 75,
        width: '70%',
        height: '70%',    
        maxHeight: 200
    },
    logoContainer: {
        position: 'absolute',
        top: 100,
        alignItems: 'center'
    },
    registerButton: {
        width: '100%',
        height: 70,
        backgroundColor: '#4ecdc4'
    },    
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 20
    },
    tag: {
        color: '#fff'
    }
});

export default WelcomeScreen;