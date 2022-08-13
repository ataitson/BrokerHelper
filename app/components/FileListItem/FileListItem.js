import React, {useState} from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PDFIcon from '../../assets/pdf_icon.png';
import Delete from '../../assets/delete.png';
import CustomImageButton from '../CustomImageButton';
import { DataStore, Storage } from 'aws-amplify';
import {Files} from '../../../src/models';

function FileListItem ({onPress, fileType, file_url, file_owner, onDeletePressed }) {
    const [fileURL, setFileURL] = useState();
    
    return (
        <TouchableOpacity  style={styles.container} onPress={onPress} >
            <View style={styles.infoContainer}>
                <Image source={PDFIcon} style={styles.icon} />
                <Text style={styles.fileType}>{fileType}</Text>                
            </View>
            <CustomImageButton source={Delete} onPress={onDeletePressed} small></CustomImageButton>
        </TouchableOpacity>
    );    
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
    infoContainer: {    
        backgroundColor: '#EEEFFF',
        flexDirection: 'row',
        width: '80%',
        height: 55,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 10,
        marginBottom: 5,

        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#051C60'
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    fileType:{
        marginLeft: 10,
        height: 20,
        fontSize: 16,
        color: 'blue'
    },
})

export default FileListItem;