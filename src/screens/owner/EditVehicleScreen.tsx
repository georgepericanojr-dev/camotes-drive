import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { ArrowLeft, Trash2, FileUp } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { COLORS } from '../../constants/theme';

export const EditVehicleScreen = ({ route, navigation }: any) => {
  const { vehicle } = route.params;
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [name, setName] = useState(vehicle.name || '');
  const [plateNumber, setPlateNumber] = useState(vehicle.plate_number || '');
  const [type, setType] = useState(vehicle.type || 'Sedan');
  const [transmission, setTransmission] = useState(vehicle.transmission || 'Automatic');
  const [fuelType, setFuelType] = useState(vehicle.fuel_type || 'Gasoline');
  const [dailyRate, setDailyRate] = useState(vehicle.daily_rate?.toString() || '');
  const [location, setLocation] = useState(vehicle.location || 'Poro, Camotes Islands');
  const [isAvailable, setIsAvailable] = useState(vehicle.is_available ?? true);

  const handleUploadVehicleDoc = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploadingDoc(true);
        const fileUri = result.assets[0].uri;
        const fileName = `vehicle_${vehicle.id}_${Date.now()}.jpg`;

        const response = await fetch(fileUri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        Alert.alert('Success', 'Vehicle document uploaded and submitted for review.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleUpdate = async () => {
    if (!name || !plateNumber || !dailyRate) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('vehicles')
        .update({
          name,
          plate_number: plateNumber,
          type,
          transmission,
          fuel_type: fuelType,
          daily_rate: parseFloat(dailyRate),
          location,
          is_available: isAvailable,
        })
        .eq('id', vehicle.id);

      if (error) throw error;

      Alert.alert('Success', 'Vehicle updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle from your fleet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase
                .from('vehicles')
                .delete()
                .eq('id', vehicle.id);

              if (error) throw error;

              Alert.alert('Deleted', 'Vehicle has been removed.', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (err: any) {
              Alert.alert('Error', err.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Vehicle & Docs</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteIconBtn}>
          <Trash2 size={20} color="#FF4D4D" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Document Upload Button */}
        <TouchableOpacity 
          style={styles.docUploadBtn} 
          onPress={handleUploadVehicleDoc}
          disabled={uploadingDoc}
        >
          <FileUp size={20} color={COLORS.accent} />
          <Text style={styles.docUploadText}>
            {uploadingDoc ? 'Uploading Document...' : 'Upload Vehicle Papers / OR/CR'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Vehicle Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={COLORS.mutedTeal} />

        <Text style={styles.label}>Plate Number</Text>
        <TextInput style={styles.input} value={plateNumber} onChangeText={setPlateNumber} autoCapitalize="characters" placeholderTextColor={COLORS.mutedTeal} />

        <Text style={styles.label}>Vehicle Type</Text>
        <TextInput style={styles.input} value={type} onChangeText={setType} placeholderTextColor={COLORS.mutedTeal} />

        <Text style={styles.label}>Transmission</Text>
        <TextInput style={styles.input} value={transmission} onChangeText={setTransmission} placeholderTextColor={COLORS.mutedTeal} />

        <Text style={styles.label}>Fuel Type</Text>
        <TextInput style={styles.input} value={fuelType} onChangeText={setFuelType} placeholderTextColor={COLORS.mutedTeal} />

        <Text style={styles.label}>Daily Rate (₱)</Text>
        <TextInput style={styles.input} value={dailyRate} onChangeText={setDailyRate} keyboardType="numeric" placeholderTextColor={COLORS.mutedTeal} />

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholderTextColor={COLORS.mutedTeal} />

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Available for Rent</Text>
            <Text style={styles.switchSub}>Show this vehicle on search results</Text>
          </View>
          <Switch 
            value={isAvailable} 
            onValueChange={setIsAvailable} 
            trackColor={{ false: '#2A3B4C', true: COLORS.accent }}
            thumbColor={COLORS.white}
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.saveBtnText}>Update Vehicle</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  deleteIconBtn: { backgroundColor: 'rgba(255, 77, 77, 0.15)', borderRadius: 8, padding: 8 },
  scroll: { padding: 20, paddingBottom: 60 },
  docUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
    height: 50,
    marginBottom: 24,
    gap: 10,
  },
  docUploadText: { color: COLORS.accent, fontSize: 14, fontWeight: '700' },
  label: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: '#0A2B4C',
    color: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
    fontSize: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
    paddingHorizontal: 4,
  },
  switchLabel: { color: COLORS.white, fontSize: 15, fontWeight: '600' },
  switchSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  saveBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: { color: COLORS.background, fontSize: 16, fontWeight: '700' }
});