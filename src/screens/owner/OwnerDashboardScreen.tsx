import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, Car, Calendar, TrendingUp, MessageSquare } from 'lucide-react-native';
import { StatusBadge } from '../../components/StatusBadge';
import { COLORS } from '../../constants/theme';

export const OwnerDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.name}>Lupin the III</Text>
          </View>
          <Bell size={24} color={COLORS.white} />
        </View>

        <Text style={styles.sectionTitle}>Business Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Earnings</Text>
            <Text style={styles.statValue}>₱24,650</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Bookings</Text>
            <Text style={styles.statValueSub}>12</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active Vehicles</Text>
            <Text style={styles.statValueSub}>2</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Average Rating</Text>
            <Text style={styles.statValueSub}>4.8 ⭐</Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <TouchableOpacity><Text style={styles.link}>View All</Text></TouchableOpacity>
        </View>

        <View style={styles.bookingCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.carIcon}><Car size={24} color={COLORS.background} /></View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.carName}>Mitsubishi Xpander 2022</Text>
              <Text style={styles.carDetails}>May 20 - May 22 • 2 Days</Text>
            </View>
          </View>
          <StatusBadge status="Pending" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  welcome: { color: COLORS.textSecondary, fontSize: 14 },
  name: { color: COLORS.white, fontSize: 22, fontWeight: '700' },
  sectionTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginBottom: 16 },
  link: { color: COLORS.textSecondary, fontSize: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: COLORS.cardBg, padding: 16, borderRadius: 12, marginBottom: 12 },
  statLabel: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 8 },
  statValue: { color: COLORS.accent, fontSize: 24, fontWeight: 'bold' },
  statValueSub: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  bookingCard: { backgroundColor: COLORS.cardBg, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  carIcon: { width: 50, height: 36, backgroundColor: COLORS.white, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  carName: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  carDetails: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
});