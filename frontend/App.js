import React, { useState, useEffect } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "./components/AuthScreen";

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
            setLoading(false);
        };
        checkUser();
    }, []);

    const logout = () => {
        setUser(null);
        AsyncStorage.removeItem("user");
    };

    if (loading) return <ActivityIndicator size="large" style={styles.loading} />;

    return (
        <View style={styles.container}>
            {user ? (
                <>
                    <Text style={styles.welcome}>Welcome, {user.name}!</Text>
                    <Button title="Logout" onPress={logout} />
                </>
            ) : (
                <AuthScreen setUser={setUser} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    welcome: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default App;
