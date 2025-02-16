import React from 'react';
import { Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {StyleSheet} from 'react-native';




export default function Success() {
  const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
                <Text style={styles.title} >Item reported successfully!</Text>
                <MaterialIcons name="check-circle" size={64} color="green" />
                <TouchableOpacity onPress={() => {
                  navigation.navigate('ReportFormSh');
                  }}>
                  <Text style={styles.buttonText}>Go to Home</Text>
                </TouchableOpacity>
              </SafeAreaView>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    height: '130%',
  },
  title: {
    color: '#0F455C',
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 20,
    textAlign: 'center',
  },
  buttonText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: "#c3c3c3",
  },
});