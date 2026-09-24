import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Search, Plus, Car, CheckCircle2, XCircle } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { COLORS } from '../../constants/theme';
import { StatusBadge } from '../../components/StatusBadge';

type VehicleTab = 'all' | 'pending' | 'reported';

export const ManageVehiclesScreen = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<VehicleTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, activeTab, searchQuery]);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*, owner:profiles(full_name)')
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

    if (activeTab === 'pending') {
      result = result.filter((v) => v.status === 'pending');
    } else if (activeTab === 'reported') {
      result = result.filter((v) => v.status === 'rejected');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.name?.toLowerCase().includes(q) ||
          v.plate_number?.toLowerCase().includes(q) ||
          v.owner?.full_name?.toLowerCase().includes(q)
      );
    }

    setFilteredVehicles(result);
  };

  const handleUpdateVehicleStatus = async (vehicleId: string, status: 'verified' | 'rejected') => {
    const { error } = await supabase
      .from('vehicles')
      .update({ status })
      .eq('id', vehicleId);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', `Vehicle ${status === 'verified' ? 'Approved' : 'Rejected'}.`);
      fetchVehicles();
    }
  };

  const handleAddVehiclePrompt = () => {
    Alert.alert(
      'Add New Fleet Vehicle',
      'Enter details for the new platform vehicle via the owner submission form.',
      [{ text: 'OK' }]
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const statusMap: Record<string, 'Approved' | 'Pending' | 'Rejected'> = {
      verified: 'Approved',
      pending: 'Pending',
      rejected: 'Rejected',
    };

    return (
      <View style={styles.vehicleCard}>
        <View style={styles.carThumb}>
          <Car size={28} color={COLORS.accent} />
        </View>

        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>{item.name}</Text>
          <Text style={styles.vehicleSub}>
            Plate: {item.plate_number} • Owner: {item.owner?.full_name || 'N/A'}
          </Text>
          <Text style={styles.priceLabel}>₱{item.daily_rate} / day</Text>
        </View>

        <View style={styles.actionCol}>
          <StatusBadge status={statusMap[item.status] || 'Pending'} />
          
          {item.status === 'pending' && (
            <View style={styles.rowButtons}>
              <TouchableOpacity
                style={styles.iconActionBtn}
                onPress={() => handleUpdateVehicleStatus(item.id, 'verified')}
              >
                <CheckCircle2 size={20} color={COLORS.accent} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconActionBtn}
                onPress={() => handleUpdateVehicleStatus(item.id, 'rejected')}
              >
                <XCircle size={20} color="#FF4D4D" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Manage Vehicles</Text>
      <Text style={styles.headerSub}>Overview of active rental fleet and registrations.</Text>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        {(['all', 'pending', 'reported'] as VehicleTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'all' ? 'All Vehicles' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search & Add Header */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color={COLORS.mutedTeal} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vehicle model or license plate..."
            placeholderTextColor={COLORS.mutedTeal}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddVehiclePrompt}>
          <Plus size={18} color={COLORS.background} />
          <Text style={styles.addBtnText}>Add Vehicle</Text>
        </TouchableOpacity>
      </View>

      {/* Vehicle List */}
      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredVehicles}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No vehicles match your search criteria.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 24 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.white },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4, marginBottom: 20 },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.cardBg, borderRadius: 10, padding: 4, marginBottom: 16 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTabItem: { backgroundColor: COLORS.accent },
  tabText: { color: COLORS.mutedTeal, fontSize: 13, fontWeight: '600' },
  activeTabText: { color: COLORS.background, fontWeight: '700' },
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: { flex: 1, color: COLORS.white, marginLeft: 10, fontSize: 14 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 6,
  },
  addBtnText: { color: COLORS.background, fontWeight: '700', fontSize: 13 },
  vehicleCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  carThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  vehicleInfo: { flex: 1 },
  vehicleName: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  vehicleSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  priceLabel: { color: COLORS.accent, fontSize: 13, fontWeight: '700', marginTop: 4 },
  actionCol: { alignItems: 'flex-end', gap: 8 },
  rowButtons: { flexDirection: 'row', gap: 8 },
  iconActionBtn: { padding: 4 },
  emptyText: { color: COLORS.mutedTeal, textAlign: 'center', marginTop: 40, fontSize: 14 },
});