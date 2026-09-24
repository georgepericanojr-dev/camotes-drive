import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const BookingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <Text style={styles.subtitle}>You have no active bookings.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 8,
  }
});