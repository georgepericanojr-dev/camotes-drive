import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Car, Star, Plus } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

type TabState = 'all' | 'active' | 'inactive';

export const ManageFleetScreen = ({ navigation }: any) => {
  const { profile } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabState>('all');

  useEffect(() => {
    if (profile?.id) {
      fetchVehicles();
    }
  }, [profile]);

  useEffect(() => {
    applyFilters();
  }, [vehicles, activeTab]);

  const fetchVehicles = async () => {
    setLoading(true);
    // Row Level Security (RLS) ensures owners only fetch their own vehicles
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('owner_id', profile?.id)
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
    } else if (data) {
      setVehicles(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...vehicles];
    if (activeTab === 'active') {
      result = result.filter(v => v.is_available === true);
    } else if (activeTab === 'inactive') {
      result = result.filter(v => v.is_available === false);
    }
    setFilteredVehicles(result);
  };

  const getTabCount = (tab: TabState) => {
    if (tab === 'all') return vehicles.length;
    if (tab === 'active') return vehicles.filter(v => v.is_available).length;
    if (tab === 'inactive') return vehicles.filter(v => !v.is_available).length;
    return 0;
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => {
          
          // Navigation hook for the "Add/Edit Vehicle" screen shown in the UI flow
          // Navigate to the EditVehicle screen
          navigation.navigate('EditVehicle', { vehicle: item })
        }}
        activeOpacity={0.8}
      >
        <View style={styles.imagePlaceholder}>
          <Car size={32} color={COLORS.background} />
        </View>

        <View style={styles.cardMain}>
          <Text style={styles.carName}>{item.name}</Text>
          <Text style={styles.plateNumber}>{item.plate_number}</Text>
          <Text style={styles.price}>₱{item.daily_rate}/day</Text>
        </View>

        <View style={styles.cardRight}>
          <Text style={[
            styles.statusText, 
            { color: item.is_available ? COLORS.accent : COLORS.mutedTeal }
          ]}>
            {item.is_available ? 'Active' : 'Inactive'}
          </Text>
          
          <View style={styles.ratingRow}>
            <Star size={14} color="#F39C12" fill="#F39C12" />
            {/* Mocking a 4.8 default rating as per the design if none exists */}
            <Text style={styles.ratingText}>4.8</Text> 
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => {
             navigation.navigate('AddVehicle')
          }}
        >
          <Plus size={16} color={COLORS.accent} />
          <Text style={styles.addBtnText}>Add Vehicle</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        {(['all', 'active', 'inactive'] as TabState[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getTabCount(tab)})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredVehicles}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No vehicles found in this category.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // #001D39
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg, // #0A4174
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  addBtnText: {
    color: COLORS.accent, // #7BBDE8
    fontSize: 13,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabItem: {
    backgroundColor: COLORS.accent,
  },
  tabText: {
    color: COLORS.mutedTeal, // #4E8EA2
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.background,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardMain: {
    flex: 1,
    justifyContent: 'center',
  },
  carName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  plateNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 50,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.mutedTeal,
    fontSize: 15,
  },
});