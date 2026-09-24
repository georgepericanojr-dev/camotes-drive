import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBadge } from '../../components/StatusBadge';
import { CustomButton } from '../../components/CustomButton';
import { COLORS } from '../../constants/theme';

export const DriverDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>Taro Sakamoto</Text>
          </View>
          <StatusBadge status="Approved" />
        </View>

        <Text style={styles.sectionTitle}>Driver Overview</Text>
        <View style={styles.overviewCard}>
          <Text style={styles.label}>Rating / Comp. Rate</Text>
          <Text style={styles.value}>4.9 ⭐ • 98%</Text>
        </View>

        <Text style={styles.sectionTitle}>Today's Trip</Text>
        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View>
              <Text style={styles.carName}>Toyota Vios 2023</Text>
              <Text style={styles.subText}>With Renter: George Pericano Jr.</Text>
            </View>
            <StatusBadge status="Ongoing" />
          </View>
          
          <View style={styles.timeline}>
            <Text style={styles.timelineText}>• PICK-UP: May 25, 2024 • 10:00 AM</Text>
            <Text style={styles.timelineText}>  Poro Camotes Islands</Text>
          </View>
          
          <View style={styles.sessionBox}>
            <Text style={styles.sessionTitle}>ONGOING SESSION</Text>
            <Text style={styles.sessionTime}>02:15:30</Text>
          </View>

          <View style={styles.actionRow}>
            <CustomButton title="Message Renter" variant="outline" onPress={() => {}} style={styles.halfBtn} />
            <CustomButton title="End Trip" onPress={() => {}} style={styles.halfBtn} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting: { color: COLORS.textSecondary, fontSize: 14 },
  name: { color: COLORS.white, fontSize: 24, fontWeight: '700' },
  sectionTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 16 },
  overviewCard: { backgroundColor: COLORS.cardBg, padding: 16, borderRadius: 12 },
  label: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 4 },
  value: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  tripCard: { backgroundColor: COLORS.cardBg, padding: 16, borderRadius: 16 },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  carName: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  subText: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  timeline: { borderLeftWidth: 1, borderColor: COLORS.softTeal, paddingLeft: 12, marginLeft: 8, marginBottom: 16 },
  timelineText: { color: COLORS.white, fontSize: 13, marginBottom: 4 },
  sessionBox: { backgroundColor: COLORS.background, padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sessionTitle: { color: COLORS.softTeal, fontSize: 12, fontWeight: '700' },
  sessionTime: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 12 },
  halfBtn: { flex: 1, height: 44 },
});