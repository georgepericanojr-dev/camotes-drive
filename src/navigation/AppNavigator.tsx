import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { AuthNavigator } from './AuthNavigator';
import { RenterNavigator } from './RenterNavigator';
import { OwnerNavigator } from './OwnerNavigator';
import { DriverNavigator } from './DriverNavigator';
import { AdminNavigator } from './AdminNavigator';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { session, profile, loading } = useAuth();

  // Show full screen loading while checking session against Supabase
  if (loading) {
    return <LoadingOverlay visible={true} message="Authenticating..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!session ? (
        // Unauthenticated User -> Login/Signup
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // Authenticated User -> Role Based Routing
        <>
          {profile?.role === 'renter' && (
            <Stack.Screen name="RenterRoot" component={RenterNavigator} />
          )}
          
          {profile?.role === 'owner' && (
            <Stack.Screen name="OwnerRoot" component={OwnerNavigator} />
          )}
          
          {profile?.role === 'driver' && (
            <Stack.Screen name="DriverRoot" component={DriverNavigator} />
          )}
          
          {profile?.role === 'admin' && (
            <Stack.Screen name="AdminRoot" component={AdminNavigator} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};