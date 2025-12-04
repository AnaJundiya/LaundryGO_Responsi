import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Pressable,
  Linking,
  Platform,
  // Alert di-import namun dihindari penggunaannya
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { getDatabase, ref, onValue } from 'firebase/database';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
// Mengganti import database jika menggunakan firebase-firestore
// Asumsi 'database as db' berasal dari file konfigurasi Firebase Anda
import { database as db } from '../../constants/firebase';

export default function MapScreen() {
  // 1. Tambahkan useRef untuk mendapatkan referensi MapView
  const mapRef = useRef(null); 
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data (Logika ini sudah benar)
  useEffect(() => {
    // Pastikan path database 'points/' sudah benar
    const pointsRef = ref(db, 'points/');

    const unsubscribe = onValue(pointsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.keys(data)
          .map((key) => {
            const p = data[key];
            // Pastikan data coordinates ada dan formatnya benar
            if (!p.coordinates || typeof p.coordinates !== 'string') return null;
            const [lat, lng] = p.coordinates.split(',').map(Number);
            // Validasi apakah parsing menghasilkan angka yang valid
            if (isNaN(lat) || isNaN(lng)) return null;

            return {
              id: key,
              name: p.name,
              phone: p.phone,
              latitude: lat,
              longitude: lng,
            };
          })
          .filter(Boolean);

        setMarkers(parsed);
      } else {
        setMarkers([]); // Jika tidak ada data, set markers kosong
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. LOGIKA UTAMA PERBAIKAN: Menyesuaikan tampilan peta (fitToCoordinates / animateToRegion)
  useEffect(() => {
    // Hanya jalankan jika map sudah ter-render dan loading selesai
    if (!mapRef.current || loading) return; 

    if (markers.length === 1) {
      // Kasus A: Jika hanya ada satu marker, gunakan animateToRegion untuk centering dan zoom
      mapRef.current.animateToRegion({
        latitude: markers[0].latitude,
        longitude: markers[0].longitude,
        latitudeDelta: 0.01, // Tingkat zoom yang wajar (1km area)
        longitudeDelta: 0.01, // Tingkat zoom yang wajar (1km area)
      }, 1000); // Animasi 1 detik

    } else if (markers.length > 1) {
      // Kasus B: Jika ada banyak marker, gunakan fitToCoordinates
      const coordinates = markers.map(marker => ({
        latitude: marker.latitude,
        longitude: marker.longitude,
      }));

      // Panggil fitToCoordinates untuk menyesuaikan peta ke semua titik
      mapRef.current.fitToCoordinates(coordinates, {
        // Beri sedikit padding di sekitar markers
        edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
    // Jika markers.length === 0, peta akan tetap pada initialRegion.
  }, [markers, loading]); // Efek akan dijalankan setiap kali markers atau loading berubah

  // 🔗 Open WhatsApp langsung ke aplikasi
  const openWhatsapp = async (phone) => {
    if (!phone) {
      // Menggunakan console.error untuk menghindari penggunaan Alert/Confirm
      console.error("Error: Nomor WhatsApp tidak tersedia.");
      return;
    }

    let normalized = phone.replace(/[^0-9]/g, "");
    // Logika normalisasi untuk Indonesia (0xx -> 62xx)
    if (normalized.startsWith("0")) normalized = "62" + normalized.substring(1);
    if (!normalized.startsWith("62")) normalized = "62" + normalized;

    const appUrl = `whatsapp://send?phone=${normalized}`;
    const webUrl = `https://wa.me/${normalized}`;

    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (e) {
      console.error("Error: Tidak dapat membuka WhatsApp.", e);
    }
  };

  // 📍 Open Google Maps/Apple Maps langsung ke aplikasi Maps
  const openGoogleMaps = async (lat, lng) => {
    // URL untuk navigasi di Google Maps (Android)
    const googleMapsUrl = `google.navigation:q=${lat},${lng}`;
    // URL untuk navigasi di Apple Maps (iOS)
    const appleMapsUrl = `maps://app?daddr=${lat},${lng}`;

    try {
      const url = Platform.OS === "ios" ? appleMapsUrl : googleMapsUrl;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback ke browser jika deep link tidak didukung
        await Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        );
      }
    } catch (e) {
      console.error("Error: Tidak dapat membuka Maps.", e);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0275d8" />
        <Text style={{ marginTop: 10, color: '#555' }}>Loading map data...</Text>
      </View>
    );
  }

  // Region ini hanya digunakan jika markers kosong (markers.length === 0)
  const initialRegion = {
    latitude: -7.7956,
    longitude: 110.3695, // Default ke Yogyakarta sebagai fallback
    latitudeDelta: 0.02,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // 3. Set referensi map
        style={styles.map}
        initialRegion={initialRegion} 
      >
        {markers.map((m) => (
          <Marker 
            key={m.id} 
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            // Tambahkan title agar muncul tooltip default saat marker disentuh
            title={m.name}
            pinColor="#0275d8" // Warna pin biru
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.name}>{m.name}</Text>

                <View style={styles.buttonRow}>

                  {/* WA BUTTON - PENGARAHAN KE WHATSAPP */}
                  <Pressable style={styles.waButton} onPress={() => openWhatsapp(m.phone)}>
                    <FontAwesome name="whatsapp" size={18} color="#fff" />
                    <Text style={styles.btnText}>WhatsApp</Text>
                  </Pressable>

                  {/* MAPS BUTTON - PENGARAHAN KE MAPS */}
                  <Pressable
                    style={styles.mapsButton}
                    onPress={() => openGoogleMaps(m.latitude, m.longitude)}
                  >
                    <FontAwesome name="map-marker" size={18} color="#fff" />
                    <Text style={styles.btnText}>Maps</Text>
                  </Pressable>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Floating Button */}
      <Pressable style={styles.fab} onPress={() => router.push('/forminputlocation')}>
        <FontAwesome name="plus" size={26} color="white" />
      </Pressable>

    </View>
  );
}

// -------------------- STYLES --------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },

  callout: {
    width: 220,
    padding: 12,
    alignItems: "center",
  },

  name: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 10,
    textAlign: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
  },

  waButton: {
    flex: 1,
    marginRight: 6,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapsButton: {
    flex: 1,
    marginLeft: 6,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },

  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    bottom: 20,
    left: 20,
    backgroundColor: '#0275d8',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});