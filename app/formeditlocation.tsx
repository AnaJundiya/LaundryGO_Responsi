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
  background: "#FDFAF6",
  brickRed: "#E76F51",
  orange: "#F4A261",
  darkText: "#264653",
  lightText: "#FFFFFF",
  placeholder: "#A9A9A9",
  borderColor: "#E0E0E0",
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

  // Extract nomor dari "tel:628xxxx"
  const extractPhone = (phone) => {
    if (!phone) return "";
    return phone.replace("tel:", "");
  };

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
      const coords = `${loc.coords.latitude},${loc.coords.longitude}`;
      setLocation(coords);

      const accuracy = loc.coords.accuracy;
      setAccuration(accuracy ? `${accuracy.toFixed(2)} m` : "N/A");
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

    const locationRef = ref(database, `points/${idString}`);
    update(locationRef, {
      name,
      coordinates: location,
      accuration,
      phone: phoneLink,
      hargaPerKg,
      fasilitas,
      jamOperasional,
    })
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

          {/* Nama */}
          <Text style={styles.inputTitle}>Nama Laundry</Text>
          <TextInput
            style={styles.input}
            placeholder="Laundry Melati"
            placeholderTextColor={COLORS.placeholder}
            value={name}
            onChangeText={setName}
          />

          {/* Telepon */}
          <Text style={styles.inputTitle}>Telepon (628xxxxxxx)</Text>
          <TextInput
            style={styles.input}
            placeholder="628123456789"
            placeholderTextColor={COLORS.placeholder}
            value={phone}
            keyboardType="numeric"
            onChangeText={setPhone}
          />

          {/* Harga */}
          <Text style={styles.inputTitle}>Harga per KG</Text>
          <TextInput
            style={styles.input}
            placeholder="5000"
            placeholderTextColor={COLORS.placeholder}
            value={hargaPerKg}
            keyboardType="numeric"
            onChangeText={setHargaPerKg}
          />

          {/* Fasilitas */}
          <Text style={styles.inputTitle}>Fasilitas</Text>
          <TextInput
            style={styles.input}
            placeholder="Setrika, Antar Jemput"
            placeholderTextColor={COLORS.placeholder}
            value={fasilitas}
            onChangeText={setFasilitas}
          />

          {/* Jam Operasional */}
          <Text style={styles.inputTitle}>Jam Operasional</Text>
          <TextInput
            style={styles.input}
            placeholder="08.00 - 21.00"
            placeholderTextColor={COLORS.placeholder}
            value={jamOperasional}
            onChangeText={setJamOperasional}
          />

          {/* Koordinat */}
          <Text style={styles.inputTitle}>Koordinat</Text>
          <TextInput
            style={styles.input}
            placeholder="-7.7, 110.36"
            placeholderTextColor={COLORS.placeholder}
            value={location}
            onChangeText={setLocation}
          />

          {/* Akurasi */}
          <Text style={styles.inputTitle}>Akurasi</Text>
          <TextInput
            style={styles.input}
            placeholder="Auto filled"
            placeholderTextColor={COLORS.placeholder}
            value={accuration}
            editable={false}
          />

          {/* Button Get Location */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={getCoordinates}
          >
            <Text style={styles.buttonText}>Get Current Location</Text>
          </Pressable>

          {/* Save */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              { opacity: pressed ? 0.8 : 1 },
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkText,
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#FFFFFF",
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 12,
    fontSize: 16,
    color: COLORS.darkText,
    marginBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.orange,
  },
  secondaryButton: {
    backgroundColor: COLORS.brickRed,
  },
  buttonText: {
    color: COLORS.lightText,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;
