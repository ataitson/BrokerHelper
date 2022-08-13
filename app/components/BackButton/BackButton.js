import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButtonImage from '../../assets/backButton.png';

const BackButton = ({onPress, text, type = 'primary', round }) => {
    const navigation = useNavigation();

    const onBackPressed = () => {
        if(navigation.canGoBack){
            navigation.goBack();
        }
    }

    return (
        <TouchableOpacity style={styles.backPressable} onPress={onPress ? onPress : onBackPressed}>
            <Image style={styles.backButton} source={BackButtonImage}></Image>
        </TouchableOpacity>   
    );
}

const styles = StyleSheet.create({
    backButton: {
        tintColor: '#051C60',
        resizeMode: 'contain',
        width: 50,
        height: 50
    },
    backPressable: {
        alignSelf: 'center', 
        paddingLeft: 15
    },
})

export default BackButton;