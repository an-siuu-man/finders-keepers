import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import PageButton from './Button';

export default function Search() {
    const navigation = useNavigation();
    
    
    
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);





    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Inter_400Regular,
        Inter_500Medium,
    });

    const handleSearch = async () => {
        try {
            const response = await fetch(`https://7a49-164-58-12-125.ngrok-free.app/search-lost-item`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ search_query: search }),
                }
            );
            console.log('Response:', response);
            const data = await response.json();
            setSearchResults(data);
            console.log('Search results:', data);
        }  catch (error) {
            console.error('Error searching for lost item:', error);
        }
         
    }


    return (
        <LinearGradient
            style={styles.container}
            colors={['#0F455C', '#0D0D0D', '#171717']}
            locations={[0, 0.83, 1]}
        >
            <SafeAreaView style={styles.home}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    enableOnAndroid={true}
                    extraScrollHeight={5}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>
                            Finders Keepers
                        </Text>
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="Describe your lost item"
                                value={search}
                                onChangeText={setSearch}
                            />
                            <PageButton title="Search" onPress={handleSearch} />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    home: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    content: {
        width: '100%',
        justifyContent: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontFamily: 'Poppins_600SemiBold',
        marginTop: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 45,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        backgroundColor: '#fff',
        fontSize: 16,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});