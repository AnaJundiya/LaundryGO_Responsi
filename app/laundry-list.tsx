import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, ActivityIndicator, Alert, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ref, onValue } from "firebase/database";
import { database } from "@/constants/firebase";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

export default function LaundryList() {
  const { filter } = useLocalSearchParams();
  const [laundries, setLaundries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  // Ambil lokasi user jika filter nearest
  useEffect(() => {
    if (filter !== "nearest") return;

    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Izin lokasi ditolak. Filter jarak tidak akan berfungsi.");
        setLoading(false);
        return;
      }
      try {
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch (err) {
        setLocationError("Gagal mengambil lokasi.");
        setLoading(false);
      }
    })();
  }, [filter]);

  // Ambil data laundry dari Firebase
  useEffect(() => {
    const dbRef = ref(database, "laundries/");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (!snapshot.exists()) {
        setLaundries([]);
        setLoading(false);
        return;
      }

      const data = snapshot.val() || {};
      const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));

      // Hanya jalankan filter jika lokasi sudah tersedia untuk "nearest"
      if (filter === "nearest" && !userLocation) {
        setLoading(true);
        return;
      }

      const filtered = applyFilter(list, filter || "all", userLocation);
      setLaundries(filtered);
      setLoading(false);
    }, (error) => {
      Alert.alert("Error", "Gagal memuat data laundry.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter, userLocation]);

  // Fungsi filter laundry
  const applyFilter = (list, type, location) => {
    const cheapestLaundry = ["Diamond Laundry","Jogja Laundry Express","Ayra Laundry","Marta Laundry","Joy Laundry Sardjito"];
    const nearestLaundry = ["Joy Laundry Sardjito","9 Laundry Jogja","Marta Laundry"];
    const bestFacilitiesLaundry = ["Exo Laundry","Jogja Laundry Express","Joy Laundry Sardjito","Laundry Langganan","Malika Laundry"];

    let result = [...list];

    switch(type){
      case "nearest":
        result = result.filter(item => nearestLaundry.includes(item.name));
        return sortByDistance(result, location);
      case "cheapest":
        result = result.filter(item => cheapestLaundry.includes(item.name));
        return result.sort((a,b) => parsePrice(a.hargaPerKg) - parsePrice(b.hargaPerKg));
      case "best_facilities":
        result = result.filter(item => bestFacilitiesLaundry.includes(item.name));
        return result.sort((a,b) => getFacilitiesCount(b.fasilitas) - getFacilitiesCount(a.fasilitas));
      default:
        return result;
    }
  };

  const parsePrice = (value) => value ? parseFloat(String(value).replace(/[^0-9]/g, "")) || Infinity : Infinity;
  const getFacilitiesCount = (fasilitas) => Array.isArray(fasilitas) ? fasilitas.length : (typeof fasilitas === "string" ? fasilitas.split(",").filter(Boolean).length : 0);

  // Hitung jarak
  const deg2rad = (deg) => deg * (Math.PI / 180);
  const getDistanceFromUser = (lat2, lon2) => {
    if (!userLocation) return Infinity;
    const { latitude: lat1, longitude: lon1 } = userLocation;
    const R = 6371; // km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(deg2rad(lat1))*Math.cos(deg2rad(lat2))*Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const sortByDistance = (list, location) => {
    if(!location) return list;
    return list.map(item => {
      if(!item.coordinates) return {...item, distance: Infinity};
      const [latStr, lonStr] = String(item.coordinates).split(",").map(s=>s.trim());
      const lat = parseFloat(latStr); 
      const lon = parseFloat(lonStr);
      if(isNaN(lat)||isNaN(lon)) return {...item, distance: Infinity};
      return {...item, distance: getDistanceFromUser(lat, lon)};
    }).sort((a,b) => a.distance - b.distance);
  };

  const openMaps = (coords) => {
    if(!coords) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${coords}`;
    Linking.openURL(url).catch(()=>Alert.alert("Error","Tidak dapat membuka Google Maps"));
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name || "Tanpa Nama"}</Text>
      <Text>Phone: {item.phone || "-"}</Text>
      <Text>Time: {item.jamOperasional || "-"}</Text>
      <Text style={styles.price}>Price: Rp {parsePrice(item.hargaPerKg).toLocaleString("id-ID") || "Tidak ada"}</Text>
      <Text style={styles.facilities}>Facilities ({getFacilitiesCount(item.fasilitas)}): {item.fasilitas || "Tidak ada"}</Text>
      {item.distance!==undefined && item.distance<Infinity && filter==="nearest" && <Text style={styles.distance}>Distance: {item.distance.toFixed(2)} km</Text>}
      <TouchableOpacity style={styles.mapButton} onPress={()=>openMaps(item.coordinates)}>
        <Text style={styles.mapButtonText}>Buka di Google Maps</Text>
      </TouchableOpacity>
    </View>
  );

  if(loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#2a9d8f"/>
      <Text style={{marginTop:12}}>{filter==="nearest"? "Mengambil lokasi Anda..." : "Memuat daftar laundry..."}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
  <Text style={styles.title}>
    Hasil Filter: {filter ? filter.charAt(0).toUpperCase() + filter.slice(1).replace("_"," ") : "Semua"}
  </Text>

  {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}

  {laundries.length === 0 ? (
    <View style={styles.center}>
      <Text>Joy Laundry</Text>
      <Text>Exo Launry</Text>
      <Text>laundry Langganan</Text>
    </View>
  ) : (
    <FlatList
      data={laundries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.name}>{item.name || "Tanpa Nama"}</Text>
          <Text style={styles.detail}>Phone: {item.phone || "-"}</Text>
          <Text style={styles.detail}>Time: {item.jamOperasional || "-"}</Text>
          <Text style={styles.detail}>Price: Rp {parsePrice(item.hargaPerKg).toLocaleString("id-ID") || "Tidak ada"}</Text>
          <Text style={styles.detail}>Facilities: {item.fasilitas || "Tidak ada"}</Text>
          {item.distance !== undefined && item.distance < Infinity && filter === "nearest" && (
            <Text style={styles.detail}>Distance: {item.distance.toFixed(2)} km</Text>
          )}
          <TouchableOpacity style={styles.mapButton} onPress={() => openMaps(item.coordinates)}>
            <Text style={styles.mapButtonText}>Buka di Google Maps</Text>
          </TouchableOpacity>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  )}
</View>

  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#f5f5f5", padding:16 },
  center: { flex:1, justifyContent:"center", alignItems:"center" },
  title: { fontSize:24, fontWeight:"bold", textAlign:"center", marginVertical:16, color:"#264653" },
  errorText: { color:"red", textAlign:"center", marginBottom:10 },
  card: { backgroundColor:"#fff", padding:18, borderRadius:14, marginBottom:16, elevation:5, shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4 },
  name: { fontSize:20, fontWeight:"bold", color:"#264653", marginBottom:6 },
  price: { fontSize:16, fontWeight:"bold", color:"#e76f51", marginVertical:4 },
  facilities: { fontStyle:"italic", color:"#555", marginVertical:4 },
  distance: { fontWeight:"bold", color:"#2a9d8f", marginTop:6 },
  mapButton: { marginTop:12, backgroundColor:"#2a9d8f", padding:12, borderRadius:10, alignItems:"center" },
  mapButtonText: { color:"#fff", fontWeight:"bold", fontSize:16 },
});
