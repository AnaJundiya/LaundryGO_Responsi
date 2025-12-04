import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, KeyboardAvoidingView, Platform, Image
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../constants/firebase";
import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      console.log("Mencoba daftar:", email);

      if (!auth) throw new Error("Firebase Auth belum diinisialisasi.");
      if (!db) throw new Error("Firebase Firestore belum diinisialisasi.");

      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email.trim(),
        createdAt: new Date(),
      });

      Alert.alert("Sukses", "Akun berhasil dibuat!");
      router.replace("/");

    } catch (error: any) {
      console.log("Firebase Error Code:", error.code);
      console.log("Firebase Error Message:", error.message);

      let errorMessage = "Terjadi kesalahan saat mendaftar.";
      switch (error.code) {
        case "auth/configuration-not-found":
          errorMessage = "Metode Email/Password Auth belum diaktifkan di Firebase console!";
          break;
        case "auth/email-already-in-use":
          errorMessage = "Email ini sudah terdaftar.";
          break;
        case "auth/invalid-email":
          errorMessage = "Format email tidak valid.";
          break;
        case "auth/weak-password":
          errorMessage = "Password terlalu lemah.";
          break;
        default:
          if (error.message) errorMessage = error.message;
      }

      Alert.alert("Gagal Daftar", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require("E:/PGPBL_ANDROID/reactnative/assets/images/logo1.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Daftar Akun Baru</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password (min. 6 karakter)"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Mendaftarkan..." : "Buat Akun"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.link}>Sudah punya akun? Masuk di sini</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#2596be", // Warna biru
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    backgroundColor: "#aacc3f", // Warna hijau
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#c7e48f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  link: {
    textAlign: "center",
    marginTop: 24,
    color: "#2596be", // Warna link biru
    fontSize: 16,
    fontWeight: "600",
  },
});
