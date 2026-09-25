import { supabase } from './supabase';

// 1. Renter Uploads Document (Admin checks later)
export const uploadDocument = async (userId: string, title: string, fileUri: string) => {
  const fileName = `${userId}_${Date.now()}.jpg`;
  
  // Note: For React Native, you'll need to fetch the file blob first using fetch(fileUri)
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, blob);
    
  if (uploadError) throw uploadError;

  const documentUrl = supabase.storage.from('documents').getPublicUrl(fileName).data.publicUrl;

  const { error: dbError } = await supabase.from('documents').insert([
    { user_id: userId, title, document_url: documentUrl, status: 'pending' }
  ]);
  
  if (dbError) throw dbError;
};

// 2. Owner Accepts or Declines Renter Booking
export const updateBookingStatusByOwner = async (bookingId: string, action: 'accept' | 'decline') => {
  const status = action === 'accept' ? 'owner_approved' : 'rejected';
  
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select();
    
  if (error) throw error;
  return data;
};

// 3. Driver Accepts Trip Assignment
export const updateBookingStatusByDriver = async (bookingId: string, driverId: string, action: 'accept' | 'decline') => {
  const status = action === 'accept' ? 'driver_assigned' : 'pending'; // Reverts to pending if declined
  
  const payload = action === 'accept' ? { status, driver_id: driverId } : { status, driver_id: null };

  const { data, error } = await supabase
    .from('bookings')
    .update(payload)
    .eq('id', bookingId)
    .select();
    
  if (error) throw error;
  return data;
};
// Add this inside src/lib/api.ts

export const createBooking = async (
  renterId: string, 
  vehicleId: string, 
  startDate: string, 
  endDate: string, 
  totalPrice: number, 
  driverId?: string | null
) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        renter_id: renterId,
        vehicle_id: vehicleId,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        driver_id: driverId || null,
        status: 'pending', // Starts as pending for the owner to approve
      }
    ])
    .select();
    
  if (error) throw error;
  return data;
};
// 4. Admin Approves Document
// 1. Fetch all pending or user documents for Admin review
export const adminFetchAllDocuments = async () => {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      profiles:user_id (full_name, email, role)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// 2. Admin Approves a User Document (ID / License)
export const adminApproveDocument = async (documentId: string) => {
  const { error } = await supabase
    .from('documents')
    .update({ status: 'verified' })
    .eq('id', documentId);
    
  if (error) throw error;
};

// 3. Admin Rejects a User Document
export const adminRejectDocument = async (documentId: string) => {
  const { error } = await supabase
    .from('documents')
    .update({ status: 'rejected' })
    .eq('id', documentId);
    
  if (error) throw error;
};
// 1. Fetch all vehicles for Admin auditing (including pending ones)
export const adminFetchAllVehicles = async () => {
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      profiles:owner_id (full_name, email, phone_number)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// 2. Admin Approves a New Vehicle
export const adminApproveVehicle = async (vehicleId: string) => {
  const { error } = await supabase
    .from('vehicles')
    .update({ status: 'verified', is_available: true })
    .eq('id', vehicleId);

  if (error) throw error;
};

// 3. Admin Rejects a Vehicle
export const adminRejectVehicle = async (vehicleId: string) => {
  const { error } = await supabase
    .from('vehicles')
    .update({ status: 'rejected', is_available: false })
    .eq('id', vehicleId);

  if (error) throw error;
};