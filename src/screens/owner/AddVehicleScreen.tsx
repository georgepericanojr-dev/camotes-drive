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
  ActivityIndicator,
  Image
} from 'react-native';
import { ArrowLeft, Plus, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

export const AddVehicleScreen = ({ navigation }: any) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [type, setType] = useState('Sedan');
  const [transmission, setTransmission] = useState('Automatic');
  const [fuelType, setFuelType] = useState('Gasoline');
  const [dailyRate, setDailyRate] = useState('');
  const [location, setLocation] = useState('Poro, Camotes Islands');
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Image URIs state
  const [images, setImages] = useState<string[]>([]);

  // Function to pick images from device gallery
  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

 const handleSave = async () => {
    if (!name || !plateNumber || !dailyRate) {
      Alert.alert('Error', 'Please fill out the vehicle name, plate number, and daily rate.');
      return;
    }

    try {
      setLoading(true);
      let uploadedImageUrl = null;

      // If an image was selected, upload it to Supabase Storage first
      if (images.length > 0) {
        const fileUri = images[0]; // Take the first image
        const fileName = `vehicle_${Date.now()}.jpg`;
        
        const response = await fetch(fileUri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('documents') // or your designated vehicle bucket
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const { data: publicURLData } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        uploadedImageUrl = publicURLData.publicUrl;
      }

      // Insert vehicle record with the image URL
      const { error } = await supabase.from('vehicles').insert([
        {
          owner_id: profile?.id,
          name,
          plate_number: plateNumber,
          type,
          transmission,
          fuel_type: fuelType,
          daily_rate: parseFloat(dailyRate),
          location,
          is_available: isAvailable,
          image_url: uploadedImageUrl, // Saves the uploaded image link!
          status: 'pending'
        }
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Vehicle added with photo and pending admin approval!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add/Edit Vehicle</Text>
        <View style={styles.draftBadge}>
          <Text style={styles.draftText}>Draft</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Photos Section */}
        <Text style={styles.label}>Vehicle Photos</Text>
        <View style={styles.photoRow}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imagePreviewContainer}>
              <Image source={{ uri }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageIcon} onPress={() => removeImage(index)}>
                <X size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ))}

          {images.length < 3 && (
            <TouchableOpacity style={styles.photoBox} onPress={pickImage} activeOpacity={0.8}>
              <Plus size={24} color={COLORS.mutedTeal} />
            </TouchableOpacity>
          )}
        </View>

        {/* Form Fields */}
        <Text style={styles.label}>Vehicle Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Toyota Vios 2023" 
          placeholderTextColor={COLORS.mutedTeal}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Plate Number</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. ABC 1234" 
          placeholderTextColor={COLORS.mutedTeal}
          value={plateNumber}
          onChangeText={setPlateNumber}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Vehicle Type</Text>
        <TextInput style={styles.input} value={type} onChangeText={setType} placeholderTextColor={COLORS.mutedTeal} />

        <Text style={styles.label}>Transmission</Text>
        <TextInput style={styles.input} value={transmission} onChangeText={setTransmission} placeholderTextColor={COLORS.mutedTeal} />

        <Text style={styles.label}>Fuel Type</Text>
        <TextInput style={styles.input} value={fuelType} onChangeText={setFuelType} placeholderTextColor={COLORS.mutedTeal} />

        <Text style={styles.label}>Daily Rate (₱)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="1500" 
          placeholderTextColor={COLORS.mutedTeal}
          value={dailyRate}
          onChangeText={setDailyRate}
          keyboardType="numeric" // <-- Keep only keyboardType, remove keyboardCategory
        />

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholderTextColor={COLORS.mutedTeal} />

        {/* Toggle Switch */}
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

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.saveBtnText}>Save Vehicle</Text>
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
    backgroundColor: COLORS.background,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  draftBadge: { backgroundColor: '#1A365D', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  draftText: { color: COLORS.accent, fontSize: 12, fontWeight: '600' },
  scroll: { padding: 20, paddingBottom: 60 },
  label: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 8, marginLeft: 4 },
  photoRow: { flexDirection: 'row', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  photoBox: {
    width: 80, height: 80,
    backgroundColor: '#0A2B4C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A365D',
    borderStyle: 'dashed'
  },
  imagePreviewContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 2,
  },
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