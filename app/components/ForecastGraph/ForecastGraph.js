import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const ForecastGraph = ({onPress, text, type = 'primary', round }) => {
    const navigation = useNavigation();

    const onBackPressed = () => {
        if(navigation.canGoBack){
            navigation.goBack();
        }
    }

    return (
        <TouchableOpacity style={styles.root}>
            
        </TouchableOpacity>   
    );
}

const styles = StyleSheet.create({
    
  });

export default ForecastGraph;