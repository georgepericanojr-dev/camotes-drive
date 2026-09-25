import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Mail, Lock, User as UserIcon, Phone } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { COLORS } from '../../constants/theme';

type UserRole = 'renter' | 'owner' | 'driver';

export const RegisterScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('renter');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    setErrorMsg('');
    
    // Form Validation
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !phone.trim()) {
      setErrorMsg('Error: All fields are required.');
      return;
    }
    
    if (password.length < 6) {
      setErrorMsg('Error: Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Error: Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (authError) throw authError;

      // 2. Insert additional user details into the public profiles table
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: authData.user.id,
            full_name: fullName.trim(),
            email: email.trim(),
            phone_number: phone.trim(),
            role: role,
          }
        ]);
        
        if (profileError) throw profileError;
      }
      
      // Note: On success, the AuthContext listener will detect the session and route automatically.
    } catch (err: any) {
      setErrorMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Camotes Drive today</Text>
        </View>

        {!!errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Role Selection Tabs */}
        <Text style={styles.label}>I want to register as a:</Text>
        <View style={styles.roleContainer}>
          {(['renter', 'owner', 'driver'] as UserRole[]).map((r) => (
            <TouchableOpacity 
              key={r} 
              style={[styles.roleBtn, role === r && styles.roleBtnActive]}
              onPress={() => setRole(r)}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                {r.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <CustomInput
          label="Full Name"
          placeholder="e.g. Juan Dela Cruz"
          value={fullName}
          onChangeText={setFullName}
          icon={<UserIcon size={20} color={COLORS.mutedTeal} />}
          autoCapitalize="words"
        />

        <CustomInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          icon={<Mail size={20} color={COLORS.mutedTeal} />}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomInput
          label="Phone Number"
          placeholder="e.g. +639123456789"
          value={phone}
          onChangeText={setPhone}
          icon={<Phone size={20} color={COLORS.mutedTeal} />}
          keyboardType="phone-pad"
        />

        <CustomInput
          label="Password"
          placeholder="Create a secure password"
          value={password}
          onChangeText={setPassword}
          icon={<Lock size={20} color={COLORS.mutedTeal} />}
          isPassword
        />

        <CustomInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          icon={<Lock size={20} color={COLORS.mutedTeal} />}
          isPassword
        />

        <CustomButton 
          title="SIGN UP" 
          onPress={handleRegister} 
          style={{ marginTop: 24 }}
        />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginLink}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <LoadingOverlay visible={loading} message="Creating your account..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  scroll: { 
    padding: 24, 
    justifyContent: 'center', 
    flexGrow: 1 
  },
  header: { 
    marginBottom: 32,
    marginTop: 20
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: COLORS.white, 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: COLORS.textSecondary 
  },
  errorBox: { 
    backgroundColor: 'rgba(255, 77, 77, 0.1)', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#FF4D4D' 
  },
  errorText: { 
    color: '#FF4D4D', 
    textAlign: 'center', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  label: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  roleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 24,
    gap: 8 
  },
  roleBtn: { 
    flex: 1, 
    paddingVertical: 12, 
    borderWidth: 1, 
    borderColor: COLORS.cardBg, 
    backgroundColor: COLORS.cardBg,
    borderRadius: 10, 
    alignItems: 'center' 
  },
  roleBtnActive: { 
    backgroundColor: COLORS.accent, 
    borderColor: COLORS.accent 
  },
  roleText: { 
    color: COLORS.textSecondary, 
    fontSize: 13, 
    fontWeight: '700' 
  },
  roleTextActive: { 
    color: COLORS.background 
  },
  loginLink: { 
    marginTop: 24, 
    alignItems: 'center',
    marginBottom: 20
  },
  linkText: { 
    color: COLORS.textSecondary, 
    fontSize: 14 
  },
  linkBold: { 
    color: COLORS.white, 
    fontWeight: '700' 
  },
});