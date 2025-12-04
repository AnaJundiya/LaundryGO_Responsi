import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { onValue, ref, remove } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { database } from "../../constants/firebase";

// --- Color Palette ---
const COLORS = {
  background: "#F5F9F5",
  green: "#aacc3f",
  blue: "#2596be",
  darkText: "#264653",
  lightText: "#fff",
  subtleText: "#6c757d",
  cardBackground: "#fff",
  borderColor: "#E0E0E0",
};

export default function LokasiScreen() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const handlePressMaps = (coordinates) => {
    if (!coordinates) return;
    const [lat, lng] = coordinates.split(",").map((v) => v.trim());
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const handleCall = (phone) => {
    if (!phone) return;
    const url = `tel:${phone}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    const pointsRef = ref(database, "points/");
    const unsubscribe = onValue(pointsRef, (snapshot) => {
      const data = snapshot.val();
      const pointsArray = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];

      const groupedPoints = pointsArray.reduce((acc, point) => {
        const key = point.name || "Laundry Lainnya";
        if (!acc[key]) acc[key] = [];
        acc[key].push(point);
        return acc;
      }, {});

      const newSections = Object.keys(groupedPoints).map(title => {
        const sortedData = groupedPoints[title].sort((a, b) => b.id.localeCompare(a.id));
        return { title, data: sortedData };
      });

      newSections.sort((a, b) => {
        const newestA = a.data[0]?.id || "";
        const newestB = b.data[0]?.id || "";
        return newestB.localeCompare(newestA);
      });

      setSections(newSections);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleDelete = (id) => {
    const pointRef = ref(database, `points/${id}`);

    if (Platform.OS === "web") {
      if (confirm("Yakin ingin menghapus lokasi ini?")) {
        remove(pointRef);
      }
    } else {
      Alert.alert(
        "Hapus Lokasi",
        "Apakah Anda yakin ingin menghapus lokasi ini?",
        [
          { text: "Batal", style: "cancel" },
          { text: "Hapus", style: "destructive", onPress: () => remove(pointRef) },
        ]
      );
    }
  };

  const handleEdit = (item) => {
    router.push({
      pathname: "/formeditlocation",
      params: {
        id: item.id,
        name: item.name,
        coordinates: item.coordinates,
        phone: item.phone || "",
        fasilitas: item.fasilitas || "",
        jamOperasional: item.jamOperasional || "",
        hargaPerKg: item.hargaPerKg || "",
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetail}>📞 {item.phone || "-"}</Text>
              <Text style={styles.itemDetail}>🏷 Harga/Kg: {item.hargaPerKg || "-"}</Text>
              <Text style={styles.itemDetail}>🕒 Jam: {item.jamOperasional || "-"}</Text>
              <Text style={styles.itemDetail}>⭐ Fasilitas: {item.fasilitas || "-"}</Text>
              <Text style={styles.itemDetail}>📍 {item.coordinates}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: COLORS.green }]}
                  onPress={() => handleCall(item.phone)}
                >
                  <Ionicons name="call" size={20} color={COLORS.lightText} />
                  <Text style={styles.buttonText}>Telepon</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: COLORS.blue }]}
                  onPress={() => handlePressMaps(item.coordinates)}
                >
                  <Ionicons name="map" size={20} color={COLORS.lightText} />
                  <Text style={styles.buttonText}>Maps</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                <Ionicons name="pencil" size={24} color={COLORS.darkText} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <FontAwesome5 name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.header, { backgroundColor: COLORS.green }]}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
        )}

        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 16 }} // Jarak atas lebih lega
      />

      {/* HAPUS TEKS "Belum punya akun? Daftar" */}
      {/* <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Belum punya akun? Daftar</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centeredContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },

  header: { padding: 12, marginHorizontal: 16, borderRadius: 8, marginTop: 18 },
  headerText: { color: COLORS.lightText, fontWeight: "bold", fontSize: 18 },

  itemContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  itemName: { fontSize: 18, fontWeight: "bold", color: COLORS.darkText },
  itemDetail: { fontSize: 14, color: COLORS.subtleText, marginTop: 4 },

  buttonRow: { flexDirection: "row", marginTop: 12 },
  actionButton: { flexDirection: "row", padding: 10, borderRadius: 8, alignItems: "center", marginRight: 10 },
  buttonText: { color: COLORS.lightText, marginLeft: 6, fontWeight: "600" },

  itemActions: { justifyContent: "center", alignItems: "center", marginLeft: 10 },
  editButton: { padding: 8 },
  deleteButton: { padding: 8 },

  link: { textAlign: "center", marginTop: 16, color: "#007bff", fontWeight: "600", paddingBottom: 10 },
});
