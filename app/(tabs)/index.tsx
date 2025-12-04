import { Image } from 'expo-image';
import { StyleSheet, View, ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Logo LaundryGo */}
      <Image
        source={require("E:/PGPBL_ANDROID/reactnative/assets/images/logo1.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Judul */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          Selamat Datang di LaundryGo!
        </ThemedText>
      </ThemedView>

      {/* Informasi Aplikasi */}
      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoText}>
          LaundryGo adalah aplikasi mobile berbasis lokasi yang menampilkan daftar toko laundry terdekat lengkap dengan informasi harga layanan, fasilitas, dan ulasan. Aplikasi ini dilengkapi fitur visualisasi peta persebaran laundry, filter pencarian (harga & jarak), serta halaman list toko laundry.
        </ThemedText>
      </ThemedView>

      {/* Fitur LaundryGo */}
      <ThemedView style={styles.featuresContainer}>
        <ThemedText style={styles.featuresTitle}>Fitur Utama LaundryGo</ThemedText>

        <View style={[styles.featureBox, { backgroundColor: '#aacc3f' }]}>
          <ThemedText style={styles.featureText}>📍 Peta persebaran laundry terdekat</ThemedText>
        </View>

        <View style={[styles.featureBox, { backgroundColor: '#2596be' }]}>
          <ThemedText style={styles.featureText}>💰 Filter harga layanan</ThemedText>
        </View>

        <View style={[styles.featureBox, { backgroundColor: '#aacc3f' }]}>
          <ThemedText style={styles.featureText}>📏 Filter jarak toko laundry</ThemedText>
        </View>

        <View style={[styles.featureBox, { backgroundColor: '#2596be' }]}>
          <ThemedText style={styles.featureText}>🧺 Halaman list toko laundry</ThemedText>
        </View>

        {/* Nama pembuat */}
        <ThemedText style={styles.creatorText}>
          Dibuat oleh: Ana Jundiya Muthia Hamzah
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // background putih bersih
    paddingHorizontal: 20,
  },
  logo: {
    width: 200, // logo diperbesar
    height: 200,
    alignSelf: 'center',
    marginTop: 50, // jarak top diperbesar
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2596be',
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'justify',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#aacc3f',
    marginBottom: 12,
  },
  featureBox: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  featureText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  creatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
