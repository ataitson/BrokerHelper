import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import colors from '../config/colors';

function ViewImageScreen(props) {
    return (
        <View styles={styles.container}> 
            <Image resizeMode='contain' style={styles.image} source={require("../assets/favicon.png")}></Image>
            <View style={styles.closeIcon}></View>
            <View style={styles.deleteIcon}></View>

            
        </View>        
    );
}

const styles = StyleSheet.create({
    closeIcon: {
        width: 50,
        height: 50,
        backgroundColor: colors.primary,
        position: 'absolute',
        top: 40,
        left: 30
    },
    container:{
        backgroundColor: colors.black,
        flex: 1
    },
    deleteIcon: {
        width: 50,
        height: 50,
        backgroundColor: colors.secondary,
        position: 'absolute',
        top: 40,
        right: 30
    },
    image: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.black,
    }
})

export default ViewImageScreen;