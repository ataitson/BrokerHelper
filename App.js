import { 
  Dimensions,
  StyleSheet, 
  SafeAreaView, 
  Platform, 
  Text, 
  View,
  StatusBar,
  } from 'react-native';
  

import Navigation from './app/navigation';
import { withAuthenticator } from 'aws-amplify-react-native';


import { Amplify } from 'aws-amplify'
import awsconfig from './src/aws-exports'
Amplify.configure(awsconfig)

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
        <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
    paddingTop: Platform.OS === "android" ? 30 : 0
  }
})