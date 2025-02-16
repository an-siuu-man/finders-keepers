import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapComponent = () => {
    const [marker, setMarker] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    
    const handleMapPress = (e) => {
        const coordinate = e.nativeEvent.coordinate;
        setMarker(coordinate);
        console.log('Marker positioned at:', coordinate);
    };

    const handleMarkerDragEnd = (e) => {
        const coordinate = e.nativeEvent.coordinate;
        setMarker(coordinate);
        console.log('Marker repositioned at:', coordinate);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                onPress={handleMapPress}
                showsUserLocation={true}
                showsMyLocationButton={true}
                zoomEnabled={true}
                scrollEnabled={true}
            >
                {marker && (
                    <Marker
                        coordinate={marker}
                        draggable
                        onDragEnd={handleMarkerDragEnd}
                        title="Lost Object"
                        description="This is where the object was reported."
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%', borderRadius: 8,    borderWidth: 1,
        borderColor: '#d9d9d9', marginVertical: 10, },
});

export default MapComponent;