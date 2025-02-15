import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PageButton from './Button';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';  
import { useFonts } from 'expo-font';

export default function Verify() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const handleChange = (index, text) => {
    if (text.length > 1) {
      text = text.slice(-1);
      if (index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
        console.log('Here');
      }
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text !== "") {
      // Move focus to next input if a digit was entered
      if (index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === "") {
      // If current input is empty and backspace is pressed, move focus to previous input
      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the OTP you received on the phone number you provided.
        </Text>
        <View style={styles.form}>
          <Text style={styles.inputHeader}>Enter OTP</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.otpInput}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={text => handleChange(index, text)}
                onKeyPress={e => handleKeyPress(e, index)}
                value={digit}
              />
            ))}
          </View>
          <PageButton
            title={'Verify'}
            bgColor='#0f455C'
            onPress={() => {
                if (otp.join('').length < 6) {
                    alert("Please enter a valid OTP");
                    return;
                }
              // Handle OTP verification logic here.
              console.log("OTP entered:", otp.join(''));
            }}
          />
        </View>
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
  },
  inputHeader: {
    color: '#0F455C',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#d9d9d9',
    textAlign: 'center',
    fontSize: 18,
    marginRight: 5,
  }
});