import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Search } from 'lucide-react-native';
import { CustomInput } from '../../components/CustomInput';
import { COLORS } from '../../constants/theme';

export const BrowseVehiclesScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Fleet</Text>
        <Text style={styles.subtitle}>Find the perfect vehicle for your trip</Text>
      </View>

      <View style={styles.searchContainer}>
        <CustomInput 
          placeholder="Search models, brands, or locations..." 
          icon={<Search size={20} color={COLORS.mutedTeal} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Vehicle listings will appear here.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  scroll: { 
    padding: 24, 
    justifyContent: 'center',
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.mutedTeal,
    fontSize: 15,
  }
});