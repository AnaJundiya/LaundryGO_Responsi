import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import * as Location from "expo-location";
import { ref, push } from "firebase/database";
import { db } from "../constants/firebase";

const COLORS = {
  background: "#f0f9f5",   // soft green background (#aacc3f tone light)
  primary: "#2596be",       // blue tone
  secondary: "#aacc3f",     // green tone
  darkText: "#264653",      // dark text
  lightText: "#FFFFFF",
  placeholder: "#6c757d",   // slightly darker gray
  borderColor: "#c0d6a3",   // light green border
};

const App = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [accuration, setAccuration] = useState("");
  const [phone, setPhone] = useState("");
  const [hargaPerKg, setHargaPerKg] = useState("");
  const [fasilitas, setFasilitas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [jamOperasional, setJamOperasional] = useState("");

  const getCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Permission to access location was denied.");
      return;
    }
    try {
      let locationData = await Location.getCurrentPositionAsync({});
      const coords = `${locationData.coords.latitude},${locationData.coords.longitude}`;
      setLocation(coords);
      setAccuration(locationData.coords.accuracy ? `${locationData.coords.accuracy.toFixed(2)} m` : "N/A");
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
      console.error(error);
    }
  };

  const handleSave = () => {
    if (!name || !location || !phone) {
      Alert.alert("Incomplete Form", "Please fill in all required fields.");
      return;
    }

    if (!phone.startsWith("628")) {
      Alert.alert("Invalid Phone Number", "Nomor telepon harus dimulai dengan 628.");
      return;
    }

    const locationsRef = ref(db, "points/");
    push(locationsRef, {
      name,
      coordinates: location,
      accuration,
      phone,
      hargaPerKg,
      fasilitas,
      deskripsi,
      jamOperasional,
    })
      .then(() => {
        Alert.alert("Success", "Data saved successfully!");
        setName(""); setLocation(""); setAccuration(""); setPhone("");
        setHargaPerKg(""); setFasilitas(""); setDeskripsi(""); setJamOperasional("");
      })
      .catch((e) => {
        console.error("Error adding document: ", e);
        Alert.alert("Error", "Failed to save data.");
      });
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Form Input Location",
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.darkText,
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />

        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text style={styles.inputTitle}>Nama Laundry</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Laundry Melati"
            placeholderTextColor={COLORS.placeholder}
          />

          <Text style={styles.inputTitle}>Nomor Telepon</Text>
          <TextInput
            style={styles.input}
            placeholder="628123456789"
            keyboardType="numeric"
            value={phone}
            onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
            placeholderTextColor={COLORS.placeholder}
          />

          <Text style={styles.inputTitle}>Harga per Kg</Text>
          <TextInput
            style={styles.input}
            value={hargaPerKg}
            onChangeText={setHargaPerKg}
            placeholder="7000"
            keyboardType="numeric"
            placeholderTextColor={COLORS.placeholder}
          />

          <Text style={styles.inputTitle}>Fasilitas</Text>
          <TextInput
            style={styles.input}
            value={fasilitas}
            onChangeText={setFasilitas}
            placeholder="Setrika, Antar Jemput"
            placeholderTextColor={COLORS.placeholder}
          />

          <Text style={styles.inputTitle}>Jam Operasional</Text>
          <TextInput
            style={styles.input}
            value={jamOperasional}
            onChangeText={setJamOperasional}
            placeholder="08.00 - 21.00"
            placeholderTextColor={COLORS.placeholder}
          />

          <Text style={styles.inputTitle}>Koordinat</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="-6.175, 106.827"
            placeholderTextColor={COLORS.placeholder}
          />

          <Text style={styles.inputTitle}>Akurasi Lokasi</Text>
          <TextInput
            style={styles.input}
            value={accuration}
            editable={false}
            placeholder="Automatically filled"
            placeholderTextColor={COLORS.placeholder}
          />

          <Pressable style={[styles.button, { backgroundColor: COLORS.primary }]} onPress={getCoordinates}>
            <Text style={styles.buttonText}>Get Current Location</Text>
          </Pressable>

          <Pressable style={[styles.button, { backgroundColor: COLORS.secondary }]} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Location</Text>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { paddingHorizontal: 20, paddingTop: 10 },

  inputTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkText,
    marginBottom: 8,
    marginLeft: 2,
  },

  input: {
    backgroundColor: "#FFF",
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    color: COLORS.darkText,
  },

  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: COLORS.lightText,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;
