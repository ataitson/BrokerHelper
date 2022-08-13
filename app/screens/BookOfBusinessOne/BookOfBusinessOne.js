import React, {useState} from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, Alert, FlatList, Image, Pressable } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { Auth, DataStore } from 'aws-amplify';
import {Client} from '../../../src/models';
import ClientListItem from '../../components/ClientListItem';
import BackButton from '../../components/BackButton';
import {SortDirection} from '@aws-amplify/datastore';

function BookOfBusinessOne(props) {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState();
    const {
        control, 
        handleSubmit, 
    } = useForm();


    const onRegisterPressed = async (data) => {
        if(loading) {return;}

        const {email, name, phone, policynumber} = data;        
        setLoading(true);
        const currentBroker = await Auth.currentAuthenticatedUser({bypassCache: true});

        try{
            if(name != undefined)
            {
                const client = await DataStore.query(Client, c => c.name("contains", name.toLowerCase())
                    .broker_id("eq", currentBroker.attributes.email), {
                        sort: s => s.name(SortDirection.ASCENDING)});

                if(client[0])
                {
                    setClients(client)
                }
            }
            else if(email != undefined)
            {
                const client = await DataStore.query(Client, c => c.email("contains", email.toLowerCase())
                    .broker_id("eq", currentBroker.attributes.email), {
                        sort: s => s.name(SortDirection.ASCENDING)});

                if(client[0])
                {
                    setClients(client)
                }
            }
            else if(phone != undefined)
            {
                const client = await DataStore.query(Client, c => c.phone_number("contains", phone.toLowerCase())
                    .broker_id("eq", currentBroker.attributes.email), {
                        sort: s => s.name(SortDirection.ASCENDING)});

                if(client[0])
                {
                    setClients(client)
                }
            }
            else if(policynumber != undefined)
            {
                // const client = await DataStore.query(Client, c => c.phone_number("contains", phone.toLowerCase())
                //     .broker_id("eq", currentBroker.attributes.email));

                // if(client[0])
                // {
                //     setClients(client)
                // }
            }
            else
            {
                const client = await DataStore.query(Client, c => c.broker_id("eq", currentBroker.attributes.email), {
                    sort: s => s.name(SortDirection.ASCENDING)});

                if(client[0])
                {
                    setClients(client)
                }
            }
        }
        catch (e) {
            Alert.alert('Oops', e.message);
        }

        setLoading(false);
    }

    const onBackPressed = () => {
        navigation.navigate('Home');
    }

    function onLoadClientPressed (currentClient) {        
        navigation.navigate('BookOfBusinessTwo', {currentClient});
    }

    return (
        <>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.root}>    
                <View style={styles.header}>
                    <BackButton />
                    <View style={styles.headerDetails}>
                        <Text style={styles.title}> Find a Client/Policy </Text>
                    </View>       
                </View>        
                
                <View style={styles.form}>
                    <CustomInput name='name' placeholder={'Name'} control={control} />
                    <CustomInput name='phone' placeholder={'Phone number'} control={control} />
                    <CustomInput name='email' placeholder={'Email'} control={control} />
                    <CustomInput name='policynumber' placeholder={'Policy #'} control={control} />
                </View>
                {
                    clients != undefined && 
                    <ScrollView style={styles.results}>
                        {
                            clients.map((c, i) => (
                            <ClientListItem key={i} 
                                name={c.name} 
                                value={c.name} 
                                phone={c.phone_number} 
                                even={ i%2 == 0 ? true : false } 
                                onPress={() => onLoadClientPressed(c)} 
                            />
                        ))}
                    </ScrollView>
                }
                
                <View style={styles.go_button}>
                    <CustomButton text={loading ? 'Searching...' : 'Go!'} onPress={loading ? null : handleSubmit(onRegisterPressed)} round/>                
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    backButton: {
        tintColor: '#051C60',
        resizeMode: 'contain',
        width: 50,
        height: 50
    },
    form: {
        width: '100%',
    },
    go_button:{
        alignItems: 'center',
        width: '100%',
    },
    header:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    headerDetails:{
        width: '100%',
        justifyContent: 'flex-start'
    },
    link: {
        color: '#FDB075'
    },
    results: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 5,
        padding: 5,
        flexGrow: 1,
        marginBottom: 10,
        height: 250,
        width: '100%',
        
    },
    scrollView: {
        height: '20%',
        width: '100%',
        alignSelf: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },    
    root: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20
    },
    text:{
        color: 'gray',
        marginVertical: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10
    }
});

export default BookOfBusinessOne;