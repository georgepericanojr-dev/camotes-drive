import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export type BookingStatus = 'Pending' | 'Approved' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Rejected' | 'Draft';

interface StatusBadgeProps {
  status: BookingStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return { bg: COLORS.accent + '33', text: COLORS.accent }; // #7BBDE8 with opacity
      case 'Ongoing':
        return { bg: COLORS.softTeal + '33', text: COLORS.softTeal }; // #6EA2B3 with opacity
      case 'Pending':
      case 'Draft':
        return { bg: COLORS.mutedTeal + '44', text: COLORS.textSecondary };
      case 'Cancelled':
      case 'Rejected':
        return { bg: 'rgba(255, 77, 77, 0.2)', text: '#FF4D4D' }; // Danger red
      default:
        return { bg: COLORS.cardBg, text: COLORS.white };
    }
  };

  const style = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});