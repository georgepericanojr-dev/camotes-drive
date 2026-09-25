import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoadingOverlay } from './src/components/LoadingOverlay';

// Auth Screens
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen'; 

// Role Navigators
import { RenterNavigator } from './src/navigation/RenterNavigator';
import { OwnerNavigator } from './src/navigation/OwnerNavigator';
import { DriverNavigator } from './src/navigation/DriverNavigator';
import { AdminNavigator } from './src/navigation/AdminNavigator';
import { AddVehicleScreen } from './src/screens/owner/AddVehicleScreen'; // Import AddVehicleScreen for driver role
import { EditVehicleScreen } from './src/screens/owner/EditVehicleScreen';
// Import Admin if applicable for web view

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return <LoadingOverlay visible={true} message="Loading your account..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!session ? (
        // Unauthenticated -> Show Login / Register
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} /> 
        </>
      ) : (
        // Authenticated -> Route directly based on role selected during sign-up
        <>
          {profile?.role === 'owner' && (
            <Stack.Screen name="OwnerRoot" component={OwnerNavigator} />
          )}
          {profile?.role === 'owner' && (
           <Stack.Screen name="AddVehicle" component={AddVehicleScreen} />
          )}
          {profile?.role === 'owner' && (
           <Stack.Screen name="EditVehicle" component={EditVehicleScreen} />
          )}
          {profile?.role === 'driver' && (
            <Stack.Screen name="DriverRoot" component={DriverNavigator} />
          )}
          {profile?.role === 'admin' && (
            <Stack.Screen name="AdminRoot" component={AdminNavigator} />
          )}
          {(profile?.role === 'renter' || !profile?.role) && (
            <Stack.Screen name="RenterRoot" component={RenterNavigator} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}