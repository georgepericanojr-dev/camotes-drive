import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MapPin, TrendingUp, MessageSquare, User } from 'lucide-react-native';
import { DriverDashboardScreen } from '../screens/driver/DriverDashboardScreen';
import { DriverTripsScreen } from '../screens/driver/DriverTripsScreen';
import { COLORS } from '../constants/theme';
import { View } from 'react-native';
import { DriverProfileScreen } from '../screens/driver/DriverProfileScreen';

const Tab = createBottomTabNavigator();
const PlaceholderScreen = () => <View style={{ flex: 1, backgroundColor: COLORS.background }} />;

export const DriverNavigator = () => {
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
        component={DriverDashboardScreen} 
        options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Trips" 
        component={DriverTripsScreen} 
        options={{ tabBarIcon: ({ color }) => <MapPin color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Earnings" 
        component={PlaceholderScreen} 
        options={{ tabBarIcon: ({ color }) => <TrendingUp color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={PlaceholderScreen} 
        options={{ tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={DriverProfileScreen} 
        options={{ tabBarIcon: ({ color }) => <User color={color} size={24} /> }} 
      />
    </Tab.Navigator>
  );
};