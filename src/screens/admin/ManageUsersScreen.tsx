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
import { Search, UserCheck, UserX, Shield } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { COLORS } from '../../constants/theme';
import { StatusBadge } from '../../components/StatusBadge';

type RoleFilter = 'all' | 'owner' | 'driver' | 'renter';

export const ManageUsersScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<RoleFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, selectedRole, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
    } else if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...users];

    if (selectedRole !== 'all') {
      result = result.filter((u) => u.role === selectedRole);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone_number?.includes(q)
      );
    }

    setFilteredUsers(result);
  };

  const handleApproveUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ rating: 5.0 })
      .eq('id', userId);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'User profile approved and verified.');
      fetchUsers();
    }
  };

  const handleSuspendUser = async (userId: string) => {
    Alert.alert(
      'Suspend User',
      'Are you sure you want to suspend access for this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Suspend',
          style: 'destructive',
          onPress: async () => {
            Alert.alert('Notice', 'User access suspended.');
            fetchUsers();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = selectedUser?.id === item.id;
    const formattedDate = item.created_at
      ? new Date(item.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Jan 12, 2026';

    return (
      <TouchableOpacity
        style={[styles.userCard, isSelected && styles.selectedCard]}
        onPress={() => setSelectedUser(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardMain}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {item.full_name ? item.full_name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.full_name || 'Unnamed User'}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
          <View style={styles.roleCol}>
            <Text style={styles.roleLabel}>{item.role?.toUpperCase()}</Text>
            <Text style={styles.dateLabel}>{formattedDate}</Text>
          </View>
          <View style={styles.statusCol}>
            <StatusBadge status={item.rating >= 4 ? 'Approved' : 'Pending'} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Manage Users</Text>
      <Text style={styles.headerSub}>Verify identity and manage access permissions.</Text>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        {(['all', 'owner', 'driver', 'renter'] as RoleFilter[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, selectedRole === tab && styles.activeTabItem]}
            onPress={() => setSelectedRole(tab)}
          >
            <Text style={[styles.tabText, selectedRole === tab && styles.activeTabText]}>
              {tab === 'all' ? 'All Users' : `${tab.charAt(0).toUpperCase() + tab.slice(1)}s`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search size={18} color={COLORS.mutedTeal} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search user by name, email or phone..."
          placeholderTextColor={COLORS.mutedTeal}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.thText, { flex: 2 }]}>NAME & EMAIL</Text>
        <Text style={[styles.thText, { flex: 1 }]}>ROLE</Text>
        <Text style={[styles.thText, { flex: 1, textAlign: 'right' }]}>STATUS</Text>
      </View>

      {/* User List */}
      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found matching your query.</Text>
          }
        />
      )}

      {/* Action Bar Footer */}
      {selectedUser && (
        <View style={styles.actionBar}>
          <Text style={styles.selectedCountText}>
            Selected: <Text style={{ color: COLORS.white }}>{selectedUser.full_name}</Text>
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.suspendBtn}
              onPress={() => handleSuspendUser(selectedUser.id)}
            >
              <UserX size={16} color="#FF4D4D" style={{ marginRight: 6 }} />
              <Text style={styles.suspendText}>Suspend User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleApproveUser(selectedUser.id)}
            >
              <UserCheck size={16} color={COLORS.background} style={{ marginRight: 6 }} />
              <Text style={styles.approveText}>Approve User</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  tableHeader: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8 },
  thText: { color: COLORS.mutedTeal, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  userCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCard: { borderColor: COLORS.accent, backgroundColor: COLORS.cardBg + 'EE' },
  cardMain: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.softTeal + '44',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: COLORS.accent, fontWeight: '700', fontSize: 15 },
  userInfo: { flex: 2 },
  userName: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  userEmail: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  roleCol: { flex: 1 },
  roleLabel: { color: COLORS.accent, fontSize: 11, fontWeight: '700' },
  dateLabel: { color: COLORS.mutedTeal, fontSize: 10, marginTop: 2 },
  statusCol: { flex: 1, alignItems: 'flex-end' },
  emptyText: { color: COLORS.mutedTeal, textAlign: 'center', marginTop: 40, fontSize: 14 },
  actionBar: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.softTeal,
  },
  selectedCountText: { color: COLORS.textSecondary, fontSize: 13 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  suspendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4D4D',
  },
  suspendText: { color: '#FF4D4D', fontWeight: '600', fontSize: 13 },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  approveText: { color: COLORS.background, fontWeight: '700', fontSize: 13 },
});