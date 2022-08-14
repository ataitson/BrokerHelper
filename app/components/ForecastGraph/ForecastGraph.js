import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    BarChart
  } from "react-native-chart-kit";

const ForecastGraph = ({onPress, graphWidth, graphHeight }) => {
    const navigation = useNavigation();

    const data = {
        labels: ["2022", "2021", "2020"],
        datasets: [
          {
            data: [80000, 60000, 55000]
          }
        ]
    };

    const chartConfig = {
        backgroundColor: '#FFF000',
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(5, 28, 98, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
    };

    const onBackPressed = () => {
        if(navigation.canGoBack){
            navigation.goBack();
        }
    }

    return (
        <TouchableOpacity style={styles.root}>
            <BarChart
                style={styles.graphStyle}
                data={data}
                width={160}
                height={242}
                yAxisLabel="$"
                chartConfig={chartConfig}
                verticalLabelRotation={-90}
                withHorizontalLabels={false}
                xLabelsOffset= {15}
                yLabelsOffset={5}
                showValuesOnTopOfBars={true}
                segments={5}
                withInnerLines={false}
            />
        </TouchableOpacity>   
    );
}

const styles = StyleSheet.create({
    graphStyle:{
        position: 'relative',
        alignSelf: 'center',        
        rotation: 90, 
        top: -78,
        right: 60
    },
    root:{
        alignItems: 'flex-start',
    },
  });

export default ForecastGraph;