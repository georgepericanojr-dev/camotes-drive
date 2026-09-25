import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Car, Calendar, MessageSquare, User } from 'lucide-react-native';
import { OwnerDashboardScreen } from '../screens/owner/OwnerDashboardScreen';
import { ManageFleetScreen } from '../screens/owner/ManageFleetScreen';
import { COLORS } from '../constants/theme';
import { View } from 'react-native';
import { OwnerBookingsScreen } from '../screens/owner/OwnerBookingsScreen';
import { OwnerProfileScreen } from '../screens/owner/OwnerProfileScreen';

const Tab = createBottomTabNavigator();
const PlaceholderScreen = () => <View style={{ flex: 1, backgroundColor: COLORS.background }} />;

export const OwnerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background, // #001D39
          borderTopWidth: 0,
          height: 90,
          paddingBottom: 30,
        },
        tabBarActiveTintColor: COLORS.accent, // #7BBDE8
        tabBarInactiveTintColor: COLORS.mutedTeal, // #4E8EA2
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={OwnerDashboardScreen} 
        options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Vehicles" 
        component={ManageFleetScreen} 
        options={{ tabBarIcon: ({ color }) => <Car color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Bookings" 
        component={OwnerBookingsScreen} 
        options={{ tabBarIcon: ({ color }) => <Calendar color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={PlaceholderScreen} 
        options={{ tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={OwnerProfileScreen} 
        options={{ tabBarIcon: ({ color }) => <User color={color} size={24} /> }} 
      />
    </Tab.Navigator>
  );
};