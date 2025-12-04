import { Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ExploreScreen() {
  const categories = [
    { id: 1, title: "Terdekat", icon: "location.circle.fill", filter: "nearest" },
    { id: 2, title: "Termurah", icon: "tag.fill", filter: "cheapest" },
    { id: 3, title: "Fasilitas Terlengkap", icon: "gearshape.fill", filter: "best_facilities" },
  ];

  const openCategory = (filter) => {
    router.push({
      pathname: "/laundry-list",
      params: { filter },
    });
  };

  const colorScheme = useColorScheme() ?? 'light';

  const ListHeader = () => (
    <ThemedView style={styles.headerContainer}>
      <Image
        source={require("E:/PGPBL_ANDROID/reactnative/assets/images/logo1.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ThemedText type="title" style={styles.headerTitle}>
        Layanan LaundryGo
      </ThemedText>
      <ThemedText style={styles.headerSubtitle}>
        Pilih kategori laundry sesuai kebutuhanmu
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.id % 2 === 0 ? '#2596be' : '#aacc3f' }]}
            onPress={() => openCategory(item.filter)}
          >
            <IconSymbol name={item.icon} size={44} color="#fff" />
            <ThemedText style={styles.cardText}>{item.title}</ThemedText>
          </TouchableOpacity>
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.flatListContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f9f5', position: 'relative' },
  headerContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 16 },
  logo: { width: 160, height: 160, marginBottom: 18 },
  headerTitle: { fontFamily: Fonts.rounded, fontSize: 26, fontWeight: 'bold', color: '#2596be', marginBottom: 8, textAlign: 'center' },
  headerSubtitle: { fontSize: 16, color: '#541212', textAlign: 'center' },
  card: { width: '48%', height: 130, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  cardText: { marginTop: 12, fontFamily: Fonts.rounded, fontSize: 16, color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  flatListContent: { paddingHorizontal: 16, paddingBottom: 80 },
});
