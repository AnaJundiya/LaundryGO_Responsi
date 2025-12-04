import React from "react";
import { StyleSheet, TextInput, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

const TextInputExample = () => {
  const [nama, setNama] = React.useState("");
  const [nim, setNim] = React.useState("");
  const [kelas, setKelas] = React.useState("");

  // Field Nomor Telepon
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const [coordinates, setCoordinates] = React.useState("");

  // Validasi: hanya angka
  const handlePhoneInput = (text) => {
    const numeric = text.replace(/[^0-9]/g, "");
    setPhoneNumber(numeric);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Form Input" }} />

        <Text style={styles.title}>🧾 Formulir Data Mahasiswa</Text>

        {/* Input Nama */}
        <Text style={styles.inputTitle}>Nama</Text>
        <TextInput
          style={styles.input}
          placeholder="Isikan Nama"
          placeholderTextColor="#b5b5b5"
          value={nama}
          onChangeText={setNama}
        />

        {/* Input NIM */}
        <Text style={styles.inputTitle}>NIM</Text>
        <TextInput
          style={styles.input}
          placeholder="Nomor Induk Mahasiswa"
          placeholderTextColor="#b5b5b5"
          keyboardType="numeric"
          value={nim}
          onChangeText={setNim}
        />

        {/* Input Kelas */}
        <Text style={styles.inputTitle}>Kelas</Text>
        <TextInput
          style={styles.input}
          placeholder="Isikan Kelas"
          placeholderTextColor="#b5b5b5"
          value={kelas}
          onChangeText={setKelas}
        />

        {/* Input Nomor Telepon */}
        <Text style={styles.inputTitle}>Nomor Telepon</Text>
        <TextInput
          style={styles.input}
          placeholder="628123456789"
          placeholderTextColor="#b5b5b5"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={handlePhoneInput}
        />

        {/* Input Koordinat */}
        <Text style={styles.inputTitle}>Koordinat</Text>
        <TextInput
          style={styles.input}
          placeholder="-7.7,110.36"
          placeholderTextColor="#b5b5b5"
          value={coordinates}
          onChangeText={setCoordinates}
        />

        {/* Tombol Simpan */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF4E6",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B63E1E",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  inputTitle: {
    marginTop: 12,
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
  },
  input: {
    height: 45,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: "#F4A261",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    color: "#333",
    fontSize: 16,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 28,
    alignItems: "center",
    shadowColor: "#B63E1E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default TextInputExample;
