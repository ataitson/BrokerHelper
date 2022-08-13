import React, {useState} from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Car from '../../assets/car.png';
import Home from '../../assets/home.png';
import Delete from '../../assets/delete.png';
import CustomImageButton from '../CustomImageButton';
import { DataStore, Storage } from 'aws-amplify';

function TouchableListItem ({onPress, policyType, policyName, policyValue, onDeletePressed, note = false }) {
    return (
        <TouchableOpacity  style={styles.container} onPress={onPress} >
            <View style={[styles.infoContainer, {borderColor: note ? 'darkred' : '#051C60'}]}>
                {
                    note === false && <Image source={policyType === 'Car' ? Car : Home} style={styles.icon} />
                }                
                <Text style={[styles.policyName, {color: note ? 'red' : 'blue'}]}>{policyName}</Text>                
                {
                    note === false && <Text style={styles.value}>${policyValue}/yr</Text>   
                }                
            </View>
            
        </TouchableOpacity>
    );    
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        flexDirection: 'row',
        width: '100%',
    },
    infoContainer: {    
        flexDirection: 'row',
        width: '100%',
        
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 10,
        marginBottom: 5,

        borderRadius: 5,
        borderWidth: 0.5,
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    policyName:{
        marginLeft: 20,
        height: 20,
        fontSize: 16,
        color: 'blue'
    },
    value:{
        width: '35%',
        textAlign: 'right',
        marginLeft: 20,
        height: 20,
        fontSize: 16,
        color: 'blue'
    },
})

export default TouchableListItem;