import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { ref, update } from "firebase/database";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../constants/firebase";

const COLORS = {
  background: "#f0f9f5",      // soft green background (#aacc3f tone light)
  primary: "#2596be",          // blue tone
  secondary: "#aacc3f",        // green tone
  darkText: "#264653",         // dark text
  lightText: "#FFFFFF",
  placeholder: "#6c757d",      // slightly darker gray
  borderColor: "#c0d6a3",      // light green border
};

const App = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    id,
    name: initialName,
    coordinates: initialCoordinates,
    accuration: initialAccuration,
    phone: initialPhone,
    hargaPerKg: initialHargaPerKg,
    fasilitas: initialFasilitas,
    jamOperasional: initialJamOperasional,
  } = params;

  const extractPhone = (phone) => (phone ? phone.replace("tel:", "") : "");

  const [name, setName] = useState(initialName || "");
  const [location, setLocation] = useState(initialCoordinates || "");
  const [accuration, setAccuration] = useState(initialAccuration || "");
  const [phone, setPhone] = useState(extractPhone(initialPhone));
  const [hargaPerKg, setHargaPerKg] = useState(initialHargaPerKg || "");
  const [fasilitas, setFasilitas] = useState(initialFasilitas || "");
  const [jamOperasional, setJamOperasional] = useState(initialJamOperasional || "");

  // GET GPS
  const getCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Lokasi tidak diizinkan.");
      return;
    }
    try {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(`${loc.coords.latitude},${loc.coords.longitude}`);
      setAccuration(loc.coords.accuracy ? `${loc.coords.accuracy.toFixed(2)} m` : "N/A");
    } catch (error) {
      Alert.alert("Error", "Tidak bisa mengambil lokasi.");
      console.error(error);
    }
  };

  // SAVE
  const handleSave = () => {
    const idString = Array.isArray(id) ? id[0] : id;
    if (!idString || !name || !location) {
      Alert.alert("Incomplete Form", "Mohon lengkapi semua field.");
      return;
    }
    const phoneLink = `tel:${phone}`;
    const locationRef = ref(db, `points/${idString}`);
    update(locationRef, { name, coordinates: location, accuration, phone: phoneLink, hargaPerKg, fasilitas, jamOperasional })
      .then(() => {
        Alert.alert("Success", "Data berhasil diperbarui!");
        router.back();
      })
      .catch((e) => {
        console.error("Error:", e);
        Alert.alert("Error", "Gagal menyimpan data.");
      });
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Form Edit Location" }} />
        <ScrollView contentContainerStyle={styles.formContainer}>

          <Text style={styles.inputTitle}>Nama Laundry</Text>
          <TextInput
            style={styles.input}
            placeholder="Laundry Melati"
            placeholderTextColor={COLORS.placeholder}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputTitle}>Telepon (628xxxxxxx)</Text>
          <TextInput
            style={styles.input}
            placeholder="628123456789"
            placeholderTextColor={COLORS.placeholder}
            value={phone}
            keyboardType="numeric"
            onChangeText={setPhone}
          />

          <Text style={styles.inputTitle}>Harga per KG</Text>
          <TextInput
            style={styles.input}
            placeholder="5000"
            placeholderTextColor={COLORS.placeholder}
            value={hargaPerKg}
            keyboardType="numeric"
            onChangeText={setHargaPerKg}
          />

          <Text style={styles.inputTitle}>Fasilitas</Text>
          <TextInput
            style={styles.input}
            placeholder="Setrika, Antar Jemput"
            placeholderTextColor={COLORS.placeholder}
            value={fasilitas}
            onChangeText={setFasilitas}
          />

          <Text style={styles.inputTitle}>Jam Operasional</Text>
          <TextInput
            style={styles.input}
            placeholder="08.00 - 21.00"
            placeholderTextColor={COLORS.placeholder}
            value={jamOperasional}
            onChangeText={setJamOperasional}
          />

          <Text style={styles.inputTitle}>Koordinat</Text>
          <TextInput
            style={styles.input}
            placeholder="-7.7, 110.36"
            placeholderTextColor={COLORS.placeholder}
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.inputTitle}>Akurasi</Text>
          <TextInput
            style={styles.input}
            placeholder="Auto filled"
            placeholderTextColor={COLORS.placeholder}
            value={accuration}
            editable={false}
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: COLORS.primary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={getCoordinates}
          >
            <Text style={styles.buttonText}>Get Current Location</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: COLORS.secondary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Update Location</Text>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  formContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  inputTitle: { fontSize: 16, fontWeight: "600", color: COLORS.darkText, marginBottom: 8, marginLeft: 2 },
  input: { backgroundColor: "#fff", height: 50, paddingHorizontal: 15, borderWidth: 1, borderColor: COLORS.borderColor, borderRadius: 12, fontSize: 16, color: COLORS.darkText, marginBottom: 20 },
  button: { height: 50, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 10 },
  buttonText: { color: COLORS.lightText, fontSize: 16, fontWeight: "bold" },
});

export default App;
