import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

export default function ReportFormSh() {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Open Camera or Select Image from Gallery
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

  // 🔹 Call Backend to Generate AI-Powered Description
  const generateDescription = async (base64Image) => {
    setLoading(true);
    try {
      const response = await fetch("https://9153-164-58-12-125.ngrok-free.app/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });
  
      // ✅ Check if response is valid JSON
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
        Alert.alert("Error", "Server returned invalid data. Check console for details.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to fetch description from server.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report a Lost Item</Text>

      {/* Open Camera Button */}
      <TouchableOpacity style={styles.button} onPress={() => openImagePicker(true)}>
        <Text style={styles.buttonText}>📸 Take a Picture</Text>
      </TouchableOpacity>

      {/* Select Image from Gallery */}
      <TouchableOpacity style={styles.button} onPress={() => openImagePicker(false)}>
        <Text style={styles.buttonText}>📂 Select from Gallery</Text>
      </TouchableOpacity>

      {/* Display Captured Image */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {/* Loading Indicator */}
      {loading && (
        <View style={{ marginTop: 10, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Generating description...</Text>
        </View>
      )}

      {/* AI-Populated Fields */}
      <Text style={styles.label}>Title:</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Item title" />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        placeholder="Item description"
      />

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>✅ Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  button: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, marginVertical: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  image: { width: 200, height: 200, borderRadius: 10, marginTop: 10 },
  label: { alignSelf: "flex-start", marginTop: 10, fontSize: 16, fontWeight: "bold" },
  input: { borderWidth: 1, padding: 8, borderRadius: 8, width: "100%", marginVertical: 8, backgroundColor: "#fff" },
  submitButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, marginVertical: 12 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

