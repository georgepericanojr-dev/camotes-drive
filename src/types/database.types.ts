export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone_number: string | null
          role: 'renter' | 'owner' | 'driver' | 'admin'
          avatar_url: string | null
          rating: number
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone_number?: string | null
          role?: 'renter' | 'owner' | 'driver' | 'admin'
          avatar_url?: string | null
          rating?: number
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone_number?: string | null
          role?: 'renter' | 'owner' | 'driver' | 'admin'
          avatar_url?: string | null
          rating?: number
          created_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          owner_id: string
          name: string
          plate_number: string
          type: string
          transmission: string
          fuel_type: string
          daily_rate: number
          status: 'pending' | 'verified' | 'rejected'
          is_available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          plate_number: string
          type: string
          transmission: string
          fuel_type: string
          daily_rate: number
          status?: 'pending' | 'verified' | 'rejected'
          is_available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          plate_number?: string
          type?: string
          transmission?: string
          fuel_type?: string
          daily_rate?: number
          status?: 'pending' | 'verified' | 'rejected'
          is_available?: boolean
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          document_url: string
          status: 'pending' | 'verified' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          document_url: string
          status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          document_url?: string
          status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          renter_id: string
          vehicle_id: string
          driver_id: string | null
          start_date: string
          end_date: string
          total_price: number
          status: 'pending' | 'owner_approved' | 'driver_assigned' | 'active' | 'completed' | 'cancelled' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          renter_id: string
          vehicle_id: string
          driver_id?: string | null
          start_date: string
          end_date: string
          total_price: number
          status?: 'pending' | 'owner_approved' | 'driver_assigned' | 'active' | 'completed' | 'cancelled' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          renter_id?: string
          vehicle_id?: string
          driver_id?: string | null
          start_date?: string
          end_date?: string
          total_price?: number
          status?: 'pending' | 'owner_approved' | 'driver_assigned' | 'active' | 'completed' | 'cancelled' | 'rejected'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'renter' | 'owner' | 'driver' | 'admin'
      booking_status: 'pending' | 'owner_approved' | 'driver_assigned' | 'active' | 'completed' | 'cancelled' | 'rejected'
      doc_status: 'pending' | 'verified' | 'rejected'
    }
  }
}