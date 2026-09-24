
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

interface CustomInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  isPassword?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  icon,
  error,
  isPassword,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(isPassword);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        error && styles.inputWrapperError
      ]}>
        {icon && <View style={styles.leftIcon}>{icon}</View>}
        
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.mutedTeal}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={() => setHidePassword(!hidePassword)}
          >
            {hidePassword ? (
              <EyeOff size={20} color={COLORS.mutedTeal} />
            ) : (
              <Eye size={20} color={COLORS.mutedTeal} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg, // #0A4174
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBg,
  },
  inputWrapperFocused: {
    borderColor: COLORS.accent, // #7BBDE8
  },
  inputWrapperError: {
    borderColor: '#FF4D4D', // Danger color
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
    padding: 4,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 15,
    height: '100%',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});