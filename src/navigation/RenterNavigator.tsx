import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, Calendar, MessageSquare, User } from 'lucide-react-native';
import { RenterDashboardScreen } from '../screens/renter/RenterDashboardScreen';
import { BrowseVehiclesScreen } from '../screens/renter/BrowseVehiclesScreen';
import { BookingsScreen } from '../screens/renter/BookingsScreen'; // Make sure this is imported
import { COLORS } from '../constants/theme';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

// Temporary placeholder for screens not yet built
const PlaceholderScreen = () => <View style={{ flex: 1, backgroundColor: COLORS.background }} />;

export const RenterNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background, // #001D39
          borderTopWidth: 0,
          elevation: 0,
          height: 90,
          paddingBottom: 30,
        },
        tabBarActiveTintColor: COLORS.accent, // #7BBDE8
        tabBarInactiveTintColor: COLORS.mutedTeal, // #4E8EA2
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={RenterDashboardScreen} 
        options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Browse" 
        component={BrowseVehiclesScreen} 
        options={{ tabBarIcon: ({ color }) => <Search color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen} 
        options={{ tabBarIcon: ({ color }) => <Calendar color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={PlaceholderScreen} 
        options={{ tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={PlaceholderScreen} 
        options={{ tabBarIcon: ({ color }) => <User color={color} size={24} /> }} 
      />
    </Tab.Navigator>
  );
};