// Home.js
import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Poppins_400Regular, Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { Newsreader_400Regular, } from '@expo-google-fonts/newsreader';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import PageButton from './Button'; // Your custom button component
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [uid, setUid] = useState(null);
  const navigation = useNavigation();
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



  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    DMSans_400Regular,
    DMSans_500Medium,
    Newsreader_400Regular,
});

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={['#0F455C', '#0D0D0D', '#171717']}
      locations={[0, 0.83, 1]}
    >
      <SafeAreaView style={styles.home}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Finders Keepers
          </Text>
          <Text style={styles.subtitle}>
            “Things we lose have a way of coming back to us in the end.”
          </Text>
        </View>
        <View style={styles.footer}>
          <PageButton
            title="Get Started"
            onPress={() => navigation.navigate(uid ? 'ReportFormSh' : 'SignUp')}
          />
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  home: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  subtitle: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});
