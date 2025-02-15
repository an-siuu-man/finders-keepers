import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';

export default function PageButton({ title, onPress, bgColor="transparent", textColor="#fff" }) {

    let [fontsLoaded] = useFonts({
        DMSans_400Regular,
        DMSans_500Medium,
    });

    return (
        <TouchableOpacity style={[styles.button, {backgroundColor: bgColor} ]} onPress={onPress}>
            <Text style={[styles.buttonText, {color: textColor}]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10, 
    },
    buttonText: {
        fontFamily: 'DMSans_500Medium',
        fontSize: 20,
        textAlign: 'center',
    },
});