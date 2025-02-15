import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignUp from "./SignUp";

const AuthScreen = ({ setUser }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");
    const [step, setStep] = useState("phone");
    const [isNewUser, setIsNewUser] = useState(false);

    // 🔹 Send OTP to backend
    const sendOtp = async (phNo) => {
        try {
            const response = await axios.post("https://2150-164-58-12-125.ngrok-free.app/send-otp", { phoneNumber: phNo });
            setIsNewUser(response.data.isNewUser);
            setStep("otp");
            Alert.alert("OTP Sent", "Check your SMS.");
        } catch (error) {
            Alert.alert("Error", "Could not send OTP.");
        }
    };

    // 🔹 Verify OTP & Login/Register User
    const verifyOtp = async () => {
        try {
            const response = await axios.post("https://2150-164-58-12-125.ngrok-free.app/verify-otp", {
                phoneNumber,
                code: otp,
                name: isNewUser ? name : undefined,
            });

            await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
            setUser(response.data.user);
            Alert.alert("Success", "You are logged in!");
        } catch (error) {
            Alert.alert("Error", "Invalid OTP.");
        }
    };

    return (
        <View style={styles.container}>
            {step === "phone" ? (
                // <>
                //     <Text style={styles.label}>Enter Phone Number:</Text>
                //     <TextInput
                //         style={styles.input}
                //         placeholder="Phone Number"
                //         onChangeText={setPhoneNumber}
                //         keyboardType="phone-pad"
                //     />
                //     <Button title="Send OTP" onPress={sendOtp} />
                // </>
                <SignUp/>
            ) : (
                <>
                    {isNewUser && (
                        <>
                            <Text style={styles.label}>Enter Your Name:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                onChangeText={setName}
                            />
                        </>
                    )}
                    <Text style={styles.label}>Enter OTP:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="OTP"
                        onChangeText={setOtp}
                        keyboardType="numeric"
                    />
                    <Button title="Verify OTP" onPress={verifyOtp} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 5,
    },
});

export default AuthScreen;
