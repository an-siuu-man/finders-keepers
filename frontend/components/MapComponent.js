import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MapComponent = () => {
    const [marker, setMarker] = useState(null);

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
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
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
    map: { width: '100%', height: '100%' },
});

export default MapComponent;