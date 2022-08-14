import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API, DataStore, graphqlOperation, Storage } from 'aws-amplify'

import {
    BarChart
  } from "react-native-chart-kit";

const Summary = ({onPress, graphWidth, graphHeight }) => {
    const navigation = useNavigation();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    const onScreenLoad = async () => {
    
    }

    useEffect(() => {
        onScreenLoad();
    }, []);

    return (
        <ScrollView style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.title}>Summary for { months[new Date().getMonth()] + " " + new Date().getDay() + ", " + new Date().getFullYear()  }</Text>
            </View>
            <View style={styles.body}>

            </View>
        </ScrollView>   
    );
}

const styles = StyleSheet.create({
    root:{
        flex: 3,
        backgroundColor: 'lightgray',
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 10,
        height: '50%',
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15
    },
    header: {
        width: '100%',
        alignItems: 'center',
    },
    body: {
        width: '100%',
        height: '100%',
        backgroundColor: 'red'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#051C60'
    },
  });

export default Summary;