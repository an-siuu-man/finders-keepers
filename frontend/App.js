import React, { useState, useEffect } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "./components/AuthScreen";
// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Home from './components/Home';
import SignUp from './components/SignUp'; // Your sign-up page component
import Verify from './components/Verify'; // Your verification page component
const Stack = createStackNavigator();
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
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide header if you don't need it
          // This option creates a slide-in horizontal transition
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Verify" component={Verify} />
      </Stack.Navigator>
    </NavigationContainer>
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
