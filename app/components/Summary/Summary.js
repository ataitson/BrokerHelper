import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Auth, DataStore, graphqlOperation, Storage } from 'aws-amplify'


import {
    BarChart
  } from "react-native-chart-kit";
import { PolicyCar, PolicyHome } from '../../../src/models';
import TouchableListItem from '../TouchableListItem';

const Summary = ({onPress }) => {
    const route = useRoute();
    const navigation = useNavigation();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [policiesToDisplay, setPoliciesToDisplay] = useState([]);

    const onScreenLoad = async () => {
        try{
            const currentBroker = await Auth.currentAuthenticatedUser({bypassCache: true});

            const today = new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDay();

            const tempPolicies = [];
            const carPoliciesToRenew = await DataStore.query(PolicyCar, c=> c.broker_id("eq", currentBroker.attributes.email.toLowerCase()).renewal_date("le", today)  )  ;
            const homePoliciesToRenew = await DataStore.query(PolicyHome, c=> c.broker_id("eq", currentBroker.attributes.email.toLowerCase()).renewal_date("le", today)  )  ;

            carPoliciesToRenew.map((c, i) => {
                tempPolicies.push({ label: c.vehicle_year + ' ' + c.vehicle_make + ' ' + c.vehicle_model, 
                                    client: c.client_id, 
                                    value: i, 
                                    id: c.id,
                                    renewal_date: c.renewal_date });
            });
            homePoliciesToRenew.map((h, i) => {
                tempPolicies.push({ label: h.street_number + ' ' + h.street_name + ' ' + h.unit_number ? h.unit_number : '', 
                                    client: c.client_id, 
                                    value: i, 
                                    id: h.id,
                                    renewal_date: c.renewal_date });
            });

            setPoliciesToDisplay(tempPolicies);
        }
        catch(e){

        }        
    }

    useEffect(() => {
        onScreenLoad();
    }, []);

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.title}>Summary for { months[new Date().getMonth()] + " " + 
                                                        new Date().getDay() + ", " + 
                                                        new Date().getFullYear()  }</Text>
            </View>
            <ScrollView style={styles.body} contentContainerStyle={ styles.scrollBody }>
                <View style={ styles.summaryColumns }>
                    <View>
                        <Text style={{textAlign: 'center', fontSize: 16}}>Renew</Text>
                    </View>
                    { 
                        policiesToDisplay.length > 0 && 
                        <ScrollView style={styles.scrollView} contentContainerStyle={ styles.scrollRoot }>
                        {
                            policiesToDisplay.map((c, i) => (
                                <TouchableListItem key={i}  
                                    renewal
                                    policyName={c.label}
                                    renewalDate={ new Date(c.renewal_date).getDay() + ' ' + months[new Date(c.renewal_date).getMonth()] }>
                                </TouchableListItem>
                            ))
                        }
                        </ScrollView>
                    }
                </View>
                <View style={ styles.summaryColumns }>

                </View>
                <View style={[styles.summaryColumns, {borderRightWidth: 0}]}>
                    
                </View>
            </ScrollView>
        </View>   
    );
}

const styles = StyleSheet.create({
    root:{
        backgroundColor: 'lightgray',
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 10,
        height: '100%',
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15
    },
    header: {
        width: '100%',
        alignItems: 'center',
    },
    body: {
        flexDirection: 'row',
        width: '100%',
        height: '93.5%',
        borderRadius: 5,
    },
    title: {
        padding: 5,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#051C60'
    },
    summaryColumns: {
        flex: 1, 
        borderColor: 'gray',
        borderRightWidth: 1, 
        marginTop: 5
    },
    scrollView: {
        width: '100%',
    },    
    scrollRoot: {
        alignItems: 'center',
    },
    scrollBody: {
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
  });

export default Summary;