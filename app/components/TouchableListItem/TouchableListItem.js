import React, {useState} from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Car from '../../assets/car.png';
import Home from '../../assets/home.png';
import Delete from '../../assets/delete.png';
import CustomImageButton from '../CustomImageButton';
import { DataStore, Storage } from 'aws-amplify';

function TouchableListItem ({onPress, policyType, policyName, policyValue, onDeletePressed, note = false, renewal = false, renewalDate }) {
    return (
        <TouchableOpacity  style={[renewal ? styles.containerRenewal : styles.container ]} onPress={onPress} >
            <View style={[renewal ? styles.infoContainerRenewal : styles.infoContainer, {borderColor: note ? 'darkred' : '#051C60'}]}>
                {
                    note === false && renewal === false && <Image source={policyType === 'Car' ? Car : Home} style={styles.icon} />
                }                
                <Text style={[renewal ? styles.renewal : styles.policyName, {color: note ? 'red' : 'blue'}]}>{policyName}</Text>                
                {
                    renewal === true && 
                    <Text style={styles.renewalDate}>{renewalDate}</Text>                
                }
                {
                    note === false && renewal === false && <Text style={styles.value}>${policyValue}/yr</Text>   
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
    containerRenewal: {
        height: 80,
        width: 90,
        flexDirection: 'row',
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
    infoContainerRenewal: {    
        justifyContent: 'space-between',
        width: '100%',
        padding: 5,
        
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
    renewalDate:{
        fontSize: 14,
        color: '#666',
    },
    renewal:{
        fontSize: 14,
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