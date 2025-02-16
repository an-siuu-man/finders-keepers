import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import MapComponent from "./MapComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import PageButton from "./Button";
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold,
  Inter_400Regular, Inter_500Medium,
  DMSans_400Regular, DMSans_500Medium
} from '@expo-google-fonts/poppins';

export default function ReportFormSh() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    DMSans_400Regular,
    DMSans_500Medium,
  });
  
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const openImagePicker = async (fromCamera = false) => {
    const permissionResult = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to grant access to use this feature.");
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 1 });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      generateDescription(result.assets[0].base64);
    }
  };

  const generateDescription = async (base64Image) => {
    setLoading(true);
    try {
      const response = await fetch("https://c5e1-164-58-12-125.ngrok-free.app/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });

      const textResponse = await response.text();
      console.log("Raw Server Response:", textResponse);

      try {
        const data = JSON.parse(textResponse);
        console.log("Parsed JSON Response:", data);

        if (data.title && data.description) {
          setTitle(data.title);
          setDescription(data.description);
        } else {
          Alert.alert("Error", "Failed to generate item description.");
        }
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
        Alert.alert("Error", "Server returned invalid data.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to fetch description from server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraScrollHeight={5}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Report a Lost Item</Text>
        <Text style={styles.subtitle}>Please fill in all the details</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => openImagePicker(true)}>
            <Text style={styles.buttonText}>{imageUri ? 'Retake Picture' : 'Take Picture'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => openImagePicker()}>
            <Text style={styles.buttonText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text>Generating description...</Text>
          </View>
        )}

        <Text style={styles.formHeader}>Title and Description</Text>
        <View style={styles.form}>
          <Text style={styles.inputHeader}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.formInput}
            placeholder="Item title"
          />

          <Text style={styles.inputHeader}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.formInputMulti}
            placeholder="Item description"
          />
        </View>
        <View style={{ width:'100%', height:400, marginVertical: 20, borderRadius: 10 }}>
          <MapComponent />
        </View>
        <View style={{ marginBottom: 20, width: '100%' }}>
          <PageButton title="Submit" bgColor="#0F455C" />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    height: '130%',
  },
  scrollContainer: {
    width: '100%',
    // flexGrow: 1,
    height: 'fit-content',
    alignItems: 'flex-start',
    paddingHorizontal: 20,

  },
  title: {
    color: '#0F455C',
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    color: '#0F455C',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  buttonStyle: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#d9d9d9',
    borderStyle: 'dashed',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    color: "#c3c3c3",
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginTop: 10,
  },
  formHeader: {
    color: '#0F455C',
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 20,
  },
  form: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    marginTop: 10,
  },
  formInput: {
    height: 45,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  formInputMulti: {
    height: 90,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
