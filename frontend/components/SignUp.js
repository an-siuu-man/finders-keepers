// SignUp.js
import React, {useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PageButton from './Button';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import  { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { useState } from 'react';
import  axios  from 'axios';
import { Alert } from 'react-native';
// import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SignUp() {

  const [isNewUser, setIsNewUser] = useState(false);
  useEffect(() => {
    const getUid = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUid(parsedUser.uid); // ✅ Retrieve and store UID
          console.log("User UID:", parsedUser.uid);
        }
      } catch (error) {
        console.error("Error retrieving UID:", error);
      }
    };

    getUid();
  }, []);

  const navigate = useNavigation();
  // 🔹 Send OTP to backend
  const sendOtp = async (phNo) => {
    try {
      console.log(phNo);
        const response = await axios.post("https://c5e1-164-58-12-125.ngrok-free.app/send-otp", { phoneNumber: phNo });
        setIsNewUser(response.data.isNewUser);
        console.log(response.data.isNewUser);
        navigate.navigate('Verify', { phoneNumber: phNo, isNewUser: response.data.isNewUser });
        Alert.alert("OTP Sent", "Check your SMS.");
    } catch (error) {
        Alert.alert("Error", "Could not send OTP.");
        console.log(error);
    }
  };

  const [phoneNumber, setPhoneNumber] = useState('');

  // const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium
  });





  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome,</Text>
          <Text style={styles.subtitle}>
            Please enter your phone number to get started.
          </Text>
          <View style={styles.form}>
            <Text style={styles.inputHeader}>Phone Number</Text>
            <TextInput style={styles.formInput}
             placeholder="1234567890" 
             value={phoneNumber}
             keyboardType='numeric'
             maxLength={10}
             onChangeText={(text) => setPhoneNumber(text)} />
            <PageButton title={'Get OTP'} bgColor='#0f455C' onPress={() => {
              if (phoneNumber.length === 10) {
                // navigation.navigate('Verify', { phoneNumber });
                sendOtp(phoneNumber);
              } else {
                alert('Please enter a valid phone number');
              }
              }} />
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
    fontFamily: 'Inter_400Regular',
  }
});
