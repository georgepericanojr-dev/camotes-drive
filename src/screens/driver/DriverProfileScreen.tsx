import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { User, FileText, FolderCheck, Sliders, Bell, HelpCircle, LogOut, ChevronRight, UploadCloud } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { uploadDocument } from '../../lib/api';
import { LogoutModal } from '../../components/LogoutModal';
import { COLORS } from '../../constants/theme';

export const DriverProfileScreen = () => {
  const { profile, signOut } = useAuth();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUploadID = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Permission to access gallery is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0 && profile) {
        setUploading(true);
        await uploadDocument(profile.id, 'Driver License / ID', result.assets[0].uri);
        Alert.alert('Success', 'Document uploaded successfully and is pending verification.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Profile</Text>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile?.full_name?.charAt(0) || 'D'}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{profile?.full_name || 'Taro Sakamoto'}</Text>
            <Text style={styles.userSub}>DRIVER • Verified</Text>
          </View>
        </View>

        {/* Account Verification Section */}
        <TouchableOpacity style={styles.verifyCard} onPress={handleUploadID} disabled={uploading}>
          <View style={styles.verifyRow}>
            <UploadCloud size={24} color={COLORS.accent} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.verifyTitle}>Upload Driver License / ID</Text>
              <Text style={styles.verifySub}>Submit documents for admin verification</Text>
            </View>
            {uploading && <ActivityIndicator color={COLORS.accent} />}
          </View>
        </TouchableOpacity>

        {/* Menu Options */}
        <MenuItem icon={<User size={20} color={COLORS.accent} />} title="Personal Information" onPress={() => {}} />
        <MenuItem icon={<FileText size={20} color={COLORS.accent} />} title="Driver Information" onPress={() => {}} />
        <MenuItem icon={<FolderCheck size={20} color={COLORS.accent} />} title="Documents" badge="Verified" onPress={() => {}} />
        <MenuItem icon={<Sliders size={20} color={COLORS.accent} />} title="Vehicle Preferences" onPress={() => {}} />
        <MenuItem icon={<Bell size={20} color={COLORS.accent} />} title="Notification Settings" onPress={() => {}} />
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

const MenuItem = ({ icon, title, badge, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuLeft}>
      {icon}
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    <View style={styles.menuRight}>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <ChevronRight size={18} color={COLORS.mutedTeal} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 20, paddingTop: 60 },
  scroll: { paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.white, marginBottom: 20 },
  userCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.cardBg, 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 16,
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
  verifyCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  verifyRow: { flexDirection: 'row', alignItems: 'center' },
  verifyTitle: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  verifySub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
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
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { backgroundColor: 'rgba(123, 189, 232, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: COLORS.accent, fontSize: 11, fontWeight: '700' },
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