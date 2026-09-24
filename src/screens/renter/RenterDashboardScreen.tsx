import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Search, Bell, Car, Calendar, ShieldCheck, MessageSquare } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { COLORS } from '../../constants/theme';

export const RenterDashboardScreen = ({ navigation }: any) => {
  const { profile } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <View style={styles.userRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{profile?.full_name?.charAt(0)}</Text></View>
            <View>
              <Text style={styles.welcome}>Welcome!</Text>
              <Text style={styles.name}>{profile?.full_name || 'Renter'}</Text>
            </View>
          </View>
          <Bell size={24} color={COLORS.white} />
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.mutedTeal} />
          <Text style={styles.searchText}>Search vehicles or locations in Cebu...</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>UPCOMING BOOKING</Text>
            <StatusBadge status="Approved" />
          </View>
          <View style={styles.bookingRow}>
            <View style={styles.carPlaceholder}><Car color={COLORS.background} size={32}/></View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.carTitle}>Toyota Vios 2023</Text>
              <Text style={styles.carSub}>May 25 - May 28, 2024</Text>
              <Text style={styles.carSub}>Cebu City, PH</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitleDark}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <ActionBtn icon={<Car size={24} color={COLORS.accent} />} label="Browse" onPress={() => navigation.navigate('Browse')} />
          <ActionBtn icon={<Calendar size={24} color={COLORS.accent} />} label="My Bookings" />
          <ActionBtn icon={<ShieldCheck size={24} color={COLORS.accent} />} label="Verify Profile" />
          <ActionBtn icon={<MessageSquare size={24} color={COLORS.accent} />} label="Help Desk" />
        </View>
      </ScrollView>
    </View>
  );
};

const ActionBtn = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    {icon}
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingTop: 50 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: COLORS.background, fontWeight: 'bold', fontSize: 18 },
  welcome: { color: COLORS.textSecondary, fontSize: 12 },
  name: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  searchBar: { flexDirection: 'row', backgroundColor: COLORS.cardBg, padding: 16, borderRadius: 24, alignItems: 'center', marginBottom: 24 },
  searchText: { color: COLORS.mutedTeal, marginLeft: 12, fontSize: 14 },
  card: { backgroundColor: COLORS.cardBg, padding: 16, borderRadius: 16, marginBottom: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  sectionTitleDark: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginBottom: 16 },
  bookingRow: { flexDirection: 'row', alignItems: 'center' },
  carPlaceholder: { width: 80, height: 50, backgroundColor: COLORS.white, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  carTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  carSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { width: '22%', backgroundColor: COLORS.cardBg, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  actionLabel: { color: COLORS.white, fontSize: 10, marginTop: 8, textAlign: 'center' },
});