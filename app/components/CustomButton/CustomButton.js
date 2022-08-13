import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const CustomButton = ({onPress, text, type = 'primary', round }) => {
    return (
        <TouchableOpacity onPress={onPress} style={ [styles.container, styles[`container_${type}`], round ? styles.container_round : styles.container_regular] }>
            <Text style={[styles.text, styles[`text_${type}`]]}> { text } </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {       
        alignItems: 'center',
        justifyContent: 'center',        
        borderColor: '#E8E8E8',
        marginVertical: 5        
    },
    container_primary: {
        backgroundColor: 'blue',
    },
    container_secondary: {
        borderColor: '#3B71F3',
        borderWidth: 2
    },
    container_tertiary: {

    },
    container_regular:{
        height: 50,
        width: '100%',
        borderRadius: 5,
        padding: 15,
    },
    container_round:{
        marginTop: 25,
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'darkblue',
    },
    text: {
        color: 'white',
        fontWeight: 'bold'
    },
    text_primary:{

    },
    text_secondary:{
        color: '#3B71F3'
    },
    text_tertiary:{
        color: 'gray'
    }
})

export default CustomButton;