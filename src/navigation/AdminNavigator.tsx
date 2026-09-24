import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { LayoutDashboard, Users, Car, CalendarDays } from 'lucide-react-native';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { ManageUsersScreen } from '../screens/admin/ManageUsersScreen';
import { ManageVehiclesScreen } from '../screens/admin/ManageVehiclesScreen';
import { ManageBookingsScreen } from '../screens/admin/ManageBookingsScreen';
import { COLORS } from '../constants/theme';

const Drawer = createDrawerNavigator();

export const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.white,
        drawerStyle: {
          backgroundColor: COLORS.background, // #001D39
          width: 280,
        },
        drawerActiveBackgroundColor: COLORS.cardBg, // #0A4174
        drawerActiveTintColor: COLORS.accent, // #7BBDE8
        drawerInactiveTintColor: COLORS.mutedTeal, // #4E8EA2
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={AdminDashboardScreen}
        options={{ drawerIcon: ({ color }) => <LayoutDashboard color={color} size={20} /> }} 
      />
      <Drawer.Screen 
        name="Users" 
        component={ManageUsersScreen}
        options={{ drawerIcon: ({ color }) => <Users color={color} size={20} /> }} 
      />
      <Drawer.Screen 
        name="Vehicles" 
        component={ManageVehiclesScreen}
        options={{ drawerIcon: ({ color }) => <Car color={color} size={20} /> }} 
      />
      <Drawer.Screen 
        name="Bookings" 
        component={ManageBookingsScreen}
        options={{ drawerIcon: ({ color }) => <CalendarDays color={color} size={20} /> }} 
      />
    </Drawer.Navigator>
  );
};