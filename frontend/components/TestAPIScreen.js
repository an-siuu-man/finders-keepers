import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity, Alert, StatusBar } from "react-native";
import * as ImagePicker from "expo-image-picker";

const API_BASE_URL = "https://4d9c-164-58-12-125.ngrok-free.app"; // Change this if using a mobile emulator

const ApiTestScreen = () => {
    const [apiResponse, setApiResponse] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // API Inputs
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");

    const [foundItem, setFoundItem] = useState({
        found_by: "",
        heading: "",
        description: "",
        latitude: "",
        longitude: "",
        finding_description: "",
        image: null,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [claimData, setClaimData] = useState({ found_item_id: "", claimed_by: "" });
    const [deleteItemId, setDeleteItemId] = useState("");

    // 🔹 Function to Handle API Requests
    const callApi = async (endpoint, method, body = {}) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            setApiResponse(data);
        } catch (error) {
            Alert.alert("API Error", error.message);
        }
    };

    // 🔹 Pick Image for Found Item
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
        });

        if (!result.canceled) {
            setFoundItem({ ...foundItem, image: result.assets[0].base64 });
            setImagePreview(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 20 }}>
            <ScrollView style={{ padding: 20 }} contentContainerStyle={{ paddingBottom: "10%", paddingTop: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>📌 API Testing Console</Text>

                {/* 🔹 1. Send OTP */}
                <Text style={styles.sectionTitle}>🔹 Send OTP</Text>
                <Text>Description: This sends an OTP to the user's phone number for authentication.</Text>
                <TextInput placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} style={styles.input} />
                <Button title="Send OTP" onPress={() => callApi("/send-otp", "POST", { phoneNumber })} />

                {/* 🔹 2. Verify OTP */}
                <Text style={styles.sectionTitle}>🔹 Verify OTP</Text>
                <Text>Description: Verifies the OTP and stores the user in Firebase if new.</Text>
                <TextInput placeholder="OTP" value={otp} onChangeText={setOtp} style={styles.input} />
                <TextInput placeholder="Name (for new users)" value={name} onChangeText={setName} style={styles.input} />
                <Button title="Verify OTP" onPress={() => callApi("/verify-otp", "POST", { phoneNumber, code: otp, name })} />

                {/* 🔹 3. Add Found Item */}
                <Text style={styles.sectionTitle}>🔹 Add Found Item</Text>
                <Text>Description: Registers a found item in the database with location & image.</Text>
                <TextInput placeholder="Your Firebase UID" value={foundItem.found_by} onChangeText={(text) => setFoundItem({ ...foundItem, found_by: text })} style={styles.input} />
                <TextInput placeholder="Heading" value={foundItem.heading} onChangeText={(text) => setFoundItem({ ...foundItem, heading: text })} style={styles.input} />
                <TextInput placeholder="Description" value={foundItem.description} onChangeText={(text) => setFoundItem({ ...foundItem, description: text })} style={styles.input} />
                <TextInput placeholder="Latitude" value={foundItem.latitude} onChangeText={(text) => setFoundItem({ ...foundItem, latitude: text })} style={styles.input} />
                <TextInput placeholder="Longitude" value={foundItem.longitude} onChangeText={(text) => setFoundItem({ ...foundItem, longitude: text })} style={styles.input} />
                <TextInput placeholder="Finding Description" value={foundItem.finding_description} onChangeText={(text) => setFoundItem({ ...foundItem, finding_description: text })} style={styles.input} />
                <TouchableOpacity onPress={pickImage} style={styles.button}>
                    <Text style={styles.buttonText}>📷 Pick an Image</Text>
                </TouchableOpacity>
                {imagePreview && <Image source={{ uri: imagePreview }} style={styles.image} />}
                <Button title="Add Found Item" onPress={() => callApi("/add-found-item", "POST", foundItem)} />

                {/* 🔹 4. Search Lost Items */}
                <Text style={styles.sectionTitle}>🔹 Search Lost Items</Text>
                <Text>Description: Finds unclaimed items similar to the given description.</Text>
                <TextInput placeholder="Describe the item..." value={searchQuery} onChangeText={setSearchQuery} style={styles.input} />
                <Button title="Search" onPress={() => callApi("/search-lost-item", "POST", { search_query: searchQuery })} />

                {/* 🔹 5. Claim an Item */}
                <Text style={styles.sectionTitle}>🔹 Claim an Item</Text>
                <Text>Description: Marks an item as claimed by a user.</Text>
                <TextInput placeholder="Found Item ID" value={claimData.found_item_id} onChangeText={(text) => setClaimData({ ...claimData, found_item_id: text })} style={styles.input} />
                <TextInput placeholder="Your Firebase UID" value={claimData.claimed_by} onChangeText={(text) => setClaimData({ ...claimData, claimed_by: text })} style={styles.input} />
                <Button title="Claim Item" onPress={() => callApi("/claim-item", "POST", claimData)} />

                {/* 🔹 6. Delete Found Item */}
                <Text style={styles.sectionTitle}>🔹 Delete Found Item</Text>
                <Text>Description: Deletes a found item from the database.</Text>
                <TextInput placeholder="Item ID" value={deleteItemId} onChangeText={setDeleteItemId} style={styles.input} />
                <Button title="Delete Item" onPress={() => callApi(`/delete-found-item/${deleteItemId}`, "DELETE")} />

                {/* 🔹 7. Generate Item Description */}
                <Text style={styles.sectionTitle}>🔹 Generate Description from Image</Text>
                <Text>Description: Uses AI to generate a title & description from an image.</Text>
                <TouchableOpacity onPress={pickImage} style={styles.button}>
                    <Text style={styles.buttonText}>📷 Pick an Image</Text>
                </TouchableOpacity>
                {imagePreview && <Image source={{ uri: imagePreview }} style={styles.image} />}
                <Button title="Generate Description" onPress={() => callApi("/generate-description", "POST", { base64Image: foundItem.image })} />

                {/* 🔹 API Response Display */}
                {apiResponse && (
                    <View style={styles.responseContainer}>
                        <Text style={{ fontWeight: "bold" }}>📋 API Response:</Text>
                        <Text>{JSON.stringify(apiResponse, null, 2)}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

// 🔹 Basic Styles
const styles = {
    input: { height: 40, borderColor: "#ddd", borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
    button: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, alignItems: "center", marginBottom: 10 },
    buttonText: { color: "#fff", fontWeight: "bold" },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
    responseContainer: { marginTop: 20, padding: 10, backgroundColor: "#f1f1f1", borderRadius: 5 },
    image: { width: 100, height: 100, marginTop: 10 },
};

export default ApiTestScreen;
