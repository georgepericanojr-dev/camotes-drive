import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { updateBookingStatusByOwner } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';
import { Calendar, CheckCircle, XCircle } from 'lucide-react-native';

export const OwnerBookingsScreen = () => {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerBookings = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      // Fetch bookings for vehicles owned by this user
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicles!inner(name, owner_id),
          profiles:renter_id(full_name, phone_number)
        `)
        .eq('vehicles.owner_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, [profile]);

  const handleAction = async (bookingId: string, action: 'accept' | 'decline') => {
    try {
      await updateBookingStatusByOwner(bookingId, action);
      Alert.alert('Success', `Booking has been ${action === 'accept' ? 'accepted' : 'declined'}.`);
      fetchOwnerBookings(); // Refresh the list
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Rental Requests</Text>
      
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No booking requests found for your vehicles.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Calendar size={20} color={COLORS.accent} />
              <Text style={styles.vehicleName}>{item.vehicles?.name}</Text>
              <Text style={[styles.statusBadge, { color: item.status === 'owner_approved' ? '#4ade80' : '#facc15' }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.renterInfo}>Renter: {item.profiles?.full_name}</Text>
            <Text style={styles.dateText}>
              {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
            </Text>
            <Text style={styles.priceText}>Total: ₱{item.total_price}</Text>

            {item.status === 'pending' && (
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.btn, styles.declineBtn]} 
                  onPress={() => handleAction(item.id, 'decline')}
                >
                  <XCircle size={16} color="#ef4444" />
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.btn, styles.acceptBtn]} 
                  onPress={() => handleAction(item.id, 'accept')}
                >
                  <CheckCircle size={16} color="#22c55e" />
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingTop: 60 },
  centered: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 20 },
  list: { paddingBottom: 30 },
  card: { backgroundColor: '#0A4174', borderRadius: 12, padding: 16, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  vehicleName: { color: COLORS.white, fontSize: 16, fontWeight: '700', flex: 1, marginLeft: 8 },
  statusBadge: { fontSize: 11, fontWeight: 'bold' },
  renterInfo: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 4 },
  dateText: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 4 },
  priceText: { color: COLORS.accent, fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, borderTopWidth: 1, borderTopColor: '#4E8EA2', paddingTop: 12 },
  btn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  declineBtn: { backgroundColor: 'rgba(239, 68, 68, 0.15)' },
  declineText: { color: '#ef4444', fontWeight: '600', marginLeft: 6, fontSize: 12 },
  acceptBtn: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  acceptText: { color: '#22c55e', fontWeight: '600', marginLeft: 6, fontSize: 12 },
  emptyText: { color: COLORS.mutedTeal, textAlign: 'center', marginTop: 40, fontSize: 14 }
});