import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';

const CustomImageButton = ({onPress, source, tint = false, border = false, small = false }) => {
    return (
        <TouchableOpacity onPress={onPress} style={ [small ? styles.small : styles.container, border? styles.borderButton : styles.noBorderButton] }>
            <Image source={source} style={ [small ? styles.smallImage : styles.image, tint ? styles.tintImage : styles.noTintImage] }></Image>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {    
        padding: 5,  
        width: 80,
        height: 80,
        margin: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    noBorderButton: {
        borderWidth: 0, 
    },
    borderButton: {
        borderWidth: 2, 
        borderColor: '#051C60',
        borderRadius: 10,
    },
    image: {
        width: 70,
        height: 70,
    },
    noTintImage:{

    },
    tintImage:{
        tintColor: '#051C60'
    },
    small: {
        width: 50,
        height: 50,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    smallImage: {
        width: 35,
        height: 35,
        tintColor: 'red'
    },
})

export default CustomImageButton;