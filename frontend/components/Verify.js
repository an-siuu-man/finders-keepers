// SignUp.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PageButton from './Button';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';  
// import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';



export default function SignUp() {

  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold
  });





  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome,</Text>
          <Text style={styles.subtitle}>
            Hello
          </Text>
          <View style={styles.form}>
            <Text style={styles.inputHeader}>Phone Number</Text>
            <TextInput style={styles.formInput} placeholder="(123) 456-7890" />
            <PageButton title={'Get OTP'} bgColor='#0f455C'/>
          </View>
          {/* Add your sign-up form components here */}
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '90%',
    padding: 20,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    color: '#0F455C',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },

  subtitle: {
    color: '#0F455C',
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },

  form: {
    marginTop: 20,
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderStyle: 'solid',
    borderRadius: 10,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    // shadowColor: '#000',
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    // elevation: 3,
  },
  inputHeader: {
    color: '#0F455C',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 2,
  },

  formInput: {
    height: 40,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#d9d9d9',
    marginBottom: 10,
  }
});
