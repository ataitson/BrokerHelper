import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ClientListItem = ({onPress, name, phone, even }) => {
    return (
        <TouchableOpacity onPress={onPress} style={ [styles.container, even ? styles.even : styles.odd] }>
            <View style={styles.client}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.phone}>{phone}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {    
        width: '100%',
        height: 50,

        alignItems: 'flex-start',

        borderRadius: 5,
        
        paddingLeft: 10,
        padding: 5,
        marginBottom: 5
    },
    even: {
        backgroundColor: '#ccc',
    },
    odd: {
        backgroundColor: '#eee',
    },
    image: {
        width: 70,
        height: 70,
    },
    name:{
        fontSize: 16
    },
    phone:{
        fontSize: 12
    },
})

export default ClientListItem;