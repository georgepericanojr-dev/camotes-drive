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
export const adminApproveDocument = async (documentId: string) => {
  const { error } = await supabase
    .from('documents')
    .update({ status: 'verified' })
    .eq('id', documentId);
    
  if (error) throw error;
};