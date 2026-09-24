import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Users, Calendar, Car, TrendingUp } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

export const AdminDashboardScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Admin Dashboard</Text>
        <Text style={styles.subHeader}>Welcome back! Here is your business health at a glance.</Text>

        <View style={styles.statsRow}>
          <StatCard title="Total Users" value="125" trend="+12% this week" icon={<Users color={COLORS.accent} />} />
          <StatCard title="Bookings" value="58" trend="+8% active booking rate" icon={<Calendar color={COLORS.accent} />} />
          <StatCard title="Vehicles" value="24" trend="98% utilization" icon={<Car color={COLORS.accent} />} />
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>REVENUE OVERVIEW</Text>
            <Text style={styles.chartValue}>₱48,650.00</Text>
          </View>
          {/* Mock Chart Area */}
          <View style={styles.chartArea}>
            <TrendingUp size={64} color={COLORS.accent} style={{ opacity: 0.5 }} />
            <Text style={styles.chartMockText}>Live Chart Integration Placeholder</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <ActionButton title="Manage Users" onPress={() => navigation.navigate('Users')} />
          <ActionButton title="Manage Vehicles" onPress={() => navigation.navigate('Vehicles')} />
          <ActionButton title="Manage Bookings" onPress={() => navigation.navigate('Bookings')} />
        </View>
      </ScrollView>
    </View>
  );
};

const StatCard = ({ title, value, trend, icon }: any) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <Text style={styles.statTitle}>{title}</Text>
      {icon}
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTrend}>{trend}</Text>
  </View>
);

const ActionButton = ({ title, onPress }: any) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <Text style={styles.actionBtnText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 32 },
  header: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  subHeader: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 24, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 200, backgroundColor: COLORS.cardBg, padding: 20, borderRadius: 12 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statTitle: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  statValue: { color: COLORS.white, fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
  statTrend: { color: COLORS.softTeal, fontSize: 12 },
  chartCard: { backgroundColor: COLORS.cardBg, padding: 24, borderRadius: 12, marginBottom: 32 },
  chartHeader: { marginBottom: 24 },
  chartTitle: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  chartValue: { color: COLORS.white, fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  chartArea: { height: 200, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.softTeal, justifyContent: 'center', alignItems: 'center' },
  chartMockText: { color: COLORS.mutedTeal, marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginBottom: 16 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { backgroundColor: COLORS.cardBg, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: COLORS.accent },
  actionBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
});