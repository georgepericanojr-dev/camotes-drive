import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Linking,
  Modal,
  ScrollView
} from 'react-native';
import { ShieldCheck, CheckCircle, XCircle, FileText, Car, Info, X } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { COLORS } from '../../constants/theme';

export const AdminDashboardScreen = () => {
  const [tab, setTab] = useState<'vehicles' | 'documents'>('vehicles');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for inspecting a selected vehicle's full details
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch vehicles with owner profile information
      const { data: vehData, error: vehError } = await supabase
        .from('vehicles')
        .select(`*, profiles:owner_id (full_name, email, phone_number)`)
        .order('created_at', { ascending: false });

      if (vehError) throw vehError;

      // Fetch documents with owner profile information
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select(`*, profiles:user_id (full_name, email, role)`)
        .order('created_at', { ascending: false });

      if (docError) throw docError;

      setVehicles(vehData || []);
      setDocuments(docData || []);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fix: Properly update vehicle status to 'verified' and make it available
  const handleApproveVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status: 'verified', is_available: true })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Success', 'Vehicle approved and published successfully!');
      setModalVisible(false);
      fetchData();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleApproveDoc = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ status: 'verified' })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Success', 'Document verified successfully!');
      fetchData();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Admin Audit Panel</Text>

      {/* Switch Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'vehicles' && styles.activeTab]} 
          onPress={() => setTab('vehicles')}
        >
          <Car size={16} color={tab === 'vehicles' ? COLORS.background : COLORS.white} />
          <Text style={[styles.tabText, tab === 'vehicles' && styles.activeTabText]}>Pending Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'documents' && styles.activeTab]} 
          onPress={() => setTab('documents')}
        >
          <FileText size={16} color={tab === 'documents' ? COLORS.background : COLORS.white} />
          <Text style={[styles.tabText, tab === 'documents' && styles.activeTabText]}>User IDs & Docs</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : tab === 'vehicles' ? (
        <FlatList
          data={vehicles.filter(v => v.status === 'pending')}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => {
                setSelectedVehicle(item);
                setModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name} ({item.plate_number})</Text>
                <Text style={styles.cardSub}>Rate: ₱{item.daily_rate}/day</Text>
                <Text style={styles.cardSub}>Owner: {item.profiles?.full_name || 'Unknown'}</Text>
                <Text style={[styles.statusBadge, { color: '#F39C12' }]}>Status: {item.status}</Text>
              </View>
              <TouchableOpacity style={styles.approveBtn} onPress={() => handleApproveVehicle(item.id)}>
                <CheckCircle size={18} color="#FFF" />
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No pending vehicles to review.</Text>}
        />
      ) : (
        <FlatList
          data={documents.filter(d => d.status === 'pending')}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>User: {item.profiles?.full_name || 'Unknown'}</Text>
                {item.document_url ? (
                  <TouchableOpacity onPress={() => Linking.openURL(item.document_url)}>
                    <Text style={styles.linkText}>View Uploaded File ↗</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={[styles.cardSub, { color: '#FF4D4D' }]}>No file attached</Text>
                )}
              </View>
              <TouchableOpacity style={styles.approveBtn} onPress={() => handleApproveDoc(item.id)}>
                <CheckCircle size={18} color="#FFF" />
                <Text style={styles.btnText}>Verify</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No pending documents to review.</Text>}
        />
      )}

      {/* Vehicle Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vehicle Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {selectedVehicle && (
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.detailLabel}>Vehicle Name</Text>
                <Text style={styles.detailValue}>{selectedVehicle.name}</Text>

                <Text style={styles.detailLabel}>Plate Number</Text>
                <Text style={styles.detailValue}>{selectedVehicle.plate_number}</Text>

                <Text style={styles.detailLabel}>Type & Transmission</Text>
                <Text style={styles.detailValue}>{selectedVehicle.type} • {selectedVehicle.transmission}</Text>

                <Text style={styles.detailLabel}>Fuel Type</Text>
                <Text style={styles.detailValue}>{selectedVehicle.fuel_type}</Text>

                <Text style={styles.detailLabel}>Daily Rate</Text>
                <Text style={styles.detailValue}>₱{selectedVehicle.daily_rate} / day</Text>

                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{selectedVehicle.location || 'Poro, Camotes Islands'}</Text>

                <Text style={styles.detailLabel}>Owner Information</Text>
                <Text style={styles.detailValue}>{selectedVehicle.profiles?.full_name || 'N/A'}</Text>
                <Text style={styles.detailValue}>{selectedVehicle.profiles?.email || 'N/A'}</Text>
                <Text style={styles.detailValue}>{selectedVehicle.profiles?.phone_number || 'N/A'}</Text>

                <TouchableOpacity 
                  style={styles.modalApproveBtn} 
                  onPress={() => handleApproveVehicle(selectedVehicle.id)}
                >
                  <CheckCircle size={20} color={COLORS.background} />
                  <Text style={styles.modalApproveText}>Approve This Vehicle</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.white, marginBottom: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 10, gap: 6 },
  activeTab: { backgroundColor: COLORS.accent },
  tabText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  activeTabText: { color: COLORS.background, fontWeight: '700' },
  card: { backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardSub: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 2 },
  statusBadge: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  linkText: { color: COLORS.accent, fontSize: 13, marginTop: 6, textDecorationLine: 'underline' },
  approveBtn: { backgroundColor: '#27AE60', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  empty: { color: COLORS.mutedTeal, textAlign: 'center', marginTop: 40, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.white },
  detailLabel: { color: COLORS.mutedTeal, fontSize: 12, fontWeight: '600', marginTop: 12 },
  detailValue: { color: COLORS.white, fontSize: 15, fontWeight: '500', marginTop: 2 },
  modalApproveBtn: { backgroundColor: COLORS.accent, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, marginTop: 24, gap: 8 },
  modalApproveText: { color: COLORS.background, fontSize: 16, fontWeight: '700' }
});