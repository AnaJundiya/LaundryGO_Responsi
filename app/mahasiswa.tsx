import React from 'react';
import {StyleSheet, Text, View, SectionList, StatusBar} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import  FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const DATA = [
  {
    title: 'Kelas A',
    data: ['Belinda', 'Shafa', 'Bela', 'Jundin', 'Amel'],
  },
  {
    title: 'Kelas B',
    data: ['Novi', 'Rifda', 'Nadia', 'Aisyah', 'Eka'],
  },
  {
    title: 'Asisten',
    data: ['Rini', 'Hayyu', 'Rini', 'Veronica'],
  },
];

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Judul Aplikasi */}
      <Text style={styles.appTitle}>Daftar Kelas dan Asisten</Text>

      {/* Section List */}
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.title}>
                <FontAwesome5 name="user-graduate" size={24} color="#B63E1E" /> 
                {' '}
                {item} 
                </Text>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5EC', // lembut, netral dengan tema oranye
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B63E1E', // merah bata
    textAlign: 'center',
    marginVertical: 16,
    letterSpacing: 0.5,
  },
  headerContainer: {
    backgroundColor: '#FF6B35', // oranye terang
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 6,
    shadowColor: '#FF6B35',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  item: {
    backgroundColor: '#F4A261', // oranye lembut
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 6,
    borderRadius: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#B63E1E', // merah bata
    shadowColor: '#B63E1E',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
});

export default App;
