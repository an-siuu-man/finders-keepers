import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    StatusBar,
    ScrollView
} from "react-native";
import CardList from "./CardList"; // Import the CardList component

const API_BASE_URL = "https://b7b0-164-58-12-125.ngrok-free.app"; // Replace with your actual backend URL

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);

    // 🔍 Search Function (Calls API `/search-lost-item`)
    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredItems([]);
            setNoResults(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/search-lost-item`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ search_query: query }),
            });
            const data = await response.json();
            setFilteredItems(data.items || []);
            setNoResults(data.items.length === 0);
        } catch (error) {
            console.error("Error searching:", error);
            setFilteredItems([]);
            setNoResults(true);
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                {/* 🔹 Header */}
                <Text style={styles.heading}>Describe the item you've lost</Text>

                {/* 🔹 Search Bar */}
                <TextInput
                    style={styles.searchInput}
                    placeholder="e.g., Black wallet near library..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />

                {/* 🔹 Results Display */}
                <ScrollView style={styles.resultContainer}>
                    {loading ? (
                        <Text style={styles.loadingText}>Searching...</Text>
                    ) : noResults ? (
                        <Text style={styles.noResultsText}>No matching items found.</Text>
                    ) : (
                        <CardList data={filteredItems} />
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

// Styles
const styles = {
    safeArea: { flex: 1, backgroundColor: "#002b36", paddingTop: StatusBar.currentHeight || 20 },
    container: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
    heading: { fontSize: 20, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 15 },
    searchInput: {
        height: 45,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    resultContainer: { marginTop: 10 },
    loadingText: { textAlign: "center", color: "#ccc", fontSize: 16, marginTop: 10 },
    noResultsText: { textAlign: "center", color: "#ccc", fontSize: 16, marginTop: 10 },
};

export default SearchScreen;
