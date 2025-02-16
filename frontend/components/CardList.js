import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    SafeAreaView
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const CardList = ({ data }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [showLocation, setShowLocation] = useState(false);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => setSelectedItem(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.heading}>{item.heading}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.time}>{getTimeAgo(item.found_at)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />

            {selectedItem && (
                <Modal transparent animationType="slide" visible={!!selectedItem}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalHeading}>{selectedItem.heading}</Text>
                            <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
                            <Text style={styles.modalDescription}>{selectedItem.description}</Text>

                            {/* Blurred "Where to Find It" Section */}
                            <View style={styles.hiddenLocationContainer}>
                                {showLocation ? (
                                    <MapView
                                        style={styles.map}
                                        initialRegion={{
                                            latitude: selectedItem.latitude,
                                            longitude: selectedItem.longitude,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                        }}
                                    >
                                        <Marker coordinate={{ latitude: selectedItem.latitude, longitude: selectedItem.longitude }} />
                                    </MapView>
                                ) : (
                                    <View style={styles.blurredOverlay}>
                                        <Text style={styles.blurredText}>Where to find it</Text>
                                        <TouchableOpacity style={styles.claimButton} onPress={() => setShowLocation(true)}>
                                            <Text style={styles.claimButtonText}>Claim Item to See</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity style={styles.closeButton} onPress={() => {
                                setShowLocation(false);
                                setSelectedItem(null);
                            }}>
                                <Text style={styles.closeText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

// Function to format the time ago
const getTimeAgo = (timestamp) => {
    const timeDiff = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    if (timeDiff < 60) return `${timeDiff} min ago`;
    if (timeDiff < 1440) return `${Math.floor(timeDiff / 60)} hours ago`;
    return `${Math.floor(timeDiff / 1440)} days ago`;
};

// Styles
const styles = {
    safeArea: { flex: 1, backgroundColor: "#f8f8f8", padding: 10 },
    card: { flexDirection: "row", backgroundColor: "#fff", padding: 10, marginBottom: 10, borderRadius: 8, elevation: 3 },
    image: { width: 80, height: 80, borderRadius: 8 },
    textContainer: { flex: 1, marginLeft: 10 },
    heading: { fontSize: 16, fontWeight: "bold" },
    description: { fontSize: 14, color: "#666", marginVertical: 4 },
    time: { fontSize: 12, color: "#999", alignSelf: "flex-end" },

    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
    modalContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "90%" },
    modalHeading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    modalImage: { width: "100%", height: 200, borderRadius: 10 },
    modalDescription: { fontSize: 16, marginVertical: 10 },

    hiddenLocationContainer: { marginTop: 20, borderRadius: 10, overflow: "hidden" },
    blurredOverlay: { height: 150, backgroundColor: "rgba(0, 0, 0, 0.4)", justifyContent: "center", alignItems: "center", borderRadius: 10 },
    blurredText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

    map: { width: "100%", height: 150, borderRadius: 10 },

    claimButton: { marginTop: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 8 },
    claimButtonText: { color: "#fff", fontWeight: "bold" },

    closeButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 8, marginTop: 10, alignItems: "center" },
    closeText: { color: "#fff", fontWeight: "bold" },
};

export default CardList;
