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
import { Search, CalendarDays, CheckCircle, XCircle } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { COLORS } from '../../constants/theme';
import { StatusBadge, BookingStatus } from '../../components/StatusBadge';

type BookingTab = 'all' | 'pending' | 'ongoing' | 'completed';

export const ManageBookingsScreen = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, activeTab, searchQuery]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, vehicle:vehicles(name, plate_number), renter:profiles!bookings_renter_id_fkey(full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
    } else if (data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...bookings];

    if (activeTab === 'pending') {
      result = result.filter((b) => b.status === 'pending');
    } else if (activeTab === 'ongoing') {
      result = result.filter((b) => b.status === 'active' || b.status === 'owner_approved');
    } else if (activeTab === 'completed') {
      result = result.filter((b) => b.status === 'completed');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.id?.toLowerCase().includes(q) ||
          b.vehicle?.name?.toLowerCase().includes(q) ||
          b.renter?.full_name?.toLowerCase().includes(q)
      );
    }

    setFilteredBookings(result);
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: 'completed' | 'cancelled'
  ) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', `Booking updated to ${status}.`);
      fetchBookings();
    }
  };

  const formatBadgeStatus = (statusStr: string): BookingStatus => {
    switch (statusStr) {
      case 'active':
      case 'owner_approved':
      case 'driver_assigned':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      case 'rejected':
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const startDateFormatted = item.start_date
      ? new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'Jan 20';
    const endDateFormatted = item.end_date
      ? new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'Jan 22';

    return (
      <View style={styles.bookingCard}>
        <View style={styles.iconBox}>
          <CalendarDays size={24} color={COLORS.accent} />
        </View>

        <View style={styles.bookingDetails}>
          <Text style={styles.carTitle}>{item.vehicle?.name || 'Vehicle Booking'}</Text>
          <Text style={styles.subText}>
            {startDateFormatted} – {endDateFormatted} • Renter: {item.renter?.full_name || 'N/A'}
          </Text>
          <Text style={styles.priceText}>Total: ₱{item.total_price}</Text>
        </View>

        <View style={styles.statusCol}>
          <StatusBadge status={formatBadgeStatus(item.status)} />

          {(item.status === 'active' || item.status === 'owner_approved') && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleUpdateBookingStatus(item.id, 'completed')}
              >
                <CheckCircle size={18} color={COLORS.accent} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleUpdateBookingStatus(item.id, 'cancelled')}
              >
                <XCircle size={18} color="#FF4D4D" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Manage Bookings</Text>
      <Text style={styles.headerSub}>Track user rentals, schedules, and transaction progress.</Text>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        {(['all', 'pending', 'ongoing', 'completed'] as BookingTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Search size={18} color={COLORS.mutedTeal} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search booking by ID, renter name or vehicle..."
          placeholderTextColor={COLORS.mutedTeal}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Bookings List */}
      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No bookings found for the selected view.</Text>
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  searchInput: { flex: 1, color: COLORS.white, marginLeft: 10, fontSize: 14 },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bookingDetails: { flex: 1 },
  carTitle: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  subText: { color: COLORS.textSecondary, fontSize: 12, marginTop: 3 },
  priceText: { color: COLORS.accent, fontSize: 13, fontWeight: '700', marginTop: 4 },
  statusCol: { alignItems: 'flex-end', gap: 8 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  actionBtn: { padding: 2 },
  emptyText: { color: COLORS.mutedTeal, textAlign: 'center', marginTop: 40, fontSize: 14 },
});