import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, CreditCard, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { LogoutModal } from '../../components/LogoutModal';
import { COLORS } from '../../constants/theme';

export const OwnerProfileScreen = () => {
  const { profile, signOut } = useAuth();
  const [logoutVisible, setLogoutVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Profile</Text>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile?.full_name?.charAt(0) || 'O'}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{profile?.full_name || 'Lupin the III'}</Text>
            <Text style={styles.userSub}>Vehicle Owner • Verified</Text>
          </View>
        </View>

        {/* Menu Options */}
        <MenuItem icon={<User size={20} color={COLORS.accent} />} title="Personal Information" onPress={() => {}} />
        <MenuItem icon={<CreditCard size={20} color={COLORS.accent} />} title="Bank & Payout Information" onPress={() => {}} />
        <MenuItem icon={<Bell size={20} color={COLORS.accent} />} title="Notification Settings" onPress={() => {}} />
        <MenuItem icon={<Shield size={20} color={COLORS.accent} />} title="Security" onPress={() => {}} />
        <MenuItem icon={<HelpCircle size={20} color={COLORS.accent} />} title="Help Center" onPress={() => {}} />

        <TouchableOpacity style={styles.logoutBtn} onPress={() => setLogoutVisible(true)}>
          <LogOut size={20} color="#FF4D4D" style={{ marginRight: 12 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <LogoutModal 
        visible={logoutVisible}
        onConfirm={() => {
          setLogoutVisible(false);
          signOut();
        }}
        onCancel={() => setLogoutVisible(false)}
      />
    </View>
  );
};

const MenuItem = ({ icon, title, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuLeft}>
      {icon}
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    <ChevronRight size={18} color={COLORS.mutedTeal} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingTop: 60 },
  scroll: { paddingBottom: 100 }, // <-- Added missing scroll definition
  title: { fontSize: 28, fontWeight: '800', color: COLORS.white, marginBottom: 20 },
  userCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.cardBg, 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1A365D'
  },
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: COLORS.accent, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  avatarText: { color: COLORS.background, fontWeight: 'bold', fontSize: 22 },
  userName: { color: COLORS.white, fontSize: 18, fontWeight: '700', marginBottom: 4 },
  userSub: { color: COLORS.accent, fontSize: 13, fontWeight: '600' },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: COLORS.cardBg, 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuTitle: { color: COLORS.white, fontSize: 15, fontWeight: '500' },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: COLORS.cardBg, 
    padding: 16, 
    borderRadius: 12, 
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.3)'
  },
  logoutText: { color: '#FF4D4D', fontSize: 16, fontWeight: '700' }
});