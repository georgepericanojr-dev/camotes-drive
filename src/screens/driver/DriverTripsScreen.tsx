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
import { Car, MapPin } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { updateBookingStatusByDriver } from '../../lib/api';
import { CustomButton } from '../../components/CustomButton';
import { StatusBadge, BookingStatus } from '../../components/StatusBadge';
import { COLORS } from '../../constants/theme';

type TabState = 'upcoming' | 'ongoing' | 'completed';

export const DriverTripsScreen = () => {
  const { profile } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabState>('upcoming');

  useEffect(() => {
    if (profile?.id) {
      fetchTrips();
    }
  }, [profile]);

  useEffect(() => {
    applyFilters();
  }, [trips, activeTab]);

  const fetchTrips = async () => {
    setLoading(true);
    // Fetch trips assigned to this driver OR trips approved by owner waiting for a driver
    const { data, error } = await supabase
      .from('bookings')
      .select('*, vehicle:vehicles(name, plate_number), renter:profiles!bookings_renter_id_fkey(full_name, phone_number)')
      .or(`driver_id.eq.${profile?.id},and(status.eq.owner_approved,driver_id.is.null)`)
      .order('start_date', { ascending: true });

    if (error) {
      Alert.alert('Error fetching trips', error.message);
    } else if (data) {
      setTrips(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [];
    if (activeTab === 'upcoming') {
      result = trips.filter(t => t.status === 'driver_assigned' || (t.status === 'owner_approved' && !t.driver_id));
    } else if (activeTab === 'ongoing') {
      result = trips.filter(t => t.status === 'active' && t.driver_id === profile?.id);
    } else if (activeTab === 'completed') {
      result = trips.filter(t => t.status === 'completed' && t.driver_id === profile?.id);
    }
    setFilteredTrips(result);
  };

  const handleClaimTrip = async (bookingId: string) => {
    if (!profile?.id) return;
    try {
      setLoading(true);
      await updateBookingStatusByDriver(bookingId, profile.id, 'accept');
      Alert.alert('Trip Claimed', 'You have successfully been assigned to this booking.');
      fetchTrips();
    } catch (err: any) {
      Alert.alert('Error', err.message);
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string, hasDriver: boolean): BookingStatus => {
    if (status === 'completed') return 'Completed';
    if (status === 'active') return 'Ongoing';
    if (status === 'owner_approved' && !hasDriver) return 'Pending';
    return 'Approved'; // Translates to Upcoming UI badge
  };

  const renderItem = ({ item }: { item: any }) => {
    const isAvailableToClaim = item.status === 'owner_approved' && !item.driver_id;
    const startDate = new Date(item.start_date);
    const dateFormatted = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeFormatted = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.carIconBox}>
            <Car size={24} color={COLORS.accent} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.carName}>{item.vehicle?.name}</Text>
            <Text style={styles.renterName}>Renter: {item.renter?.full_name}</Text>
          </View>
          <View style={styles.badgeContainer}>
            <StatusBadge status={getStatusDisplay(item.status, !!item.driver_id)} />
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.dateTimeText}>{dateFormatted} • {timeFormatted}</Text>
          <Text style={styles.priceText}>₱{(item.total_price * 0.2).toFixed(0)}/trip</Text>
        </View>

        <View style={styles.locationRow}>
          <MapPin size={14} color={COLORS.mutedTeal} />
          <Text style={styles.locationText}>Camotes Islands</Text>
        </View>

        {isAvailableToClaim && (
          <CustomButton 
            title="Accept Trip" 
            onPress={() => handleClaimTrip(item.id)} 
            style={styles.claimButton}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Trips</Text>
      
      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        {(['upcoming', 'ongoing', 'completed'] as TabState[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trips List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredTrips}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No {activeTab} trips found.</Text>
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
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 20,
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
    color: COLORS.mutedTeal,
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
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  carIconBox: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  carName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  renterName: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  badgeContainer: {
    marginLeft: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 56, // Aligns with text past the icon
  },
  dateTimeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '500',
  },
  priceText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 56,
  },
  locationText: {
    color: COLORS.mutedTeal,
    fontSize: 12,
    marginLeft: 4,
  },
  claimButton: {
    marginTop: 16,
    height: 44,
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