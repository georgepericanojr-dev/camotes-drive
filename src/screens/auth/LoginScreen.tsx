import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Mail, Lock, ShieldCheck } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { COLORS } from '../../constants/theme';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Error: Email and password cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message.includes('Invalid login') ? 'Error: Incorrect email or password.' : err.message);
    } finally {
      setLoading(false);
    }                                                                                                                                                                 
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <ShieldCheck size={48} color={COLORS.accent} />
          </View>
          <Text style={styles.brandTitle}>CAMOTES DRIVE</Text>
        </View>

        {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

        <CustomInput
          label="Email Address"
          placeholder="sample@sample.com"
          value={email}
          onChangeText={setEmail}
          icon={<Mail size={20} color={COLORS.mutedTeal} />}
          autoCapitalize="none"
        />
        <CustomInput
          label="Password"
          placeholder="••••••••••••"
          value={password}
          onChangeText={setPassword}
          icon={<Lock size={20} color={COLORS.mutedTeal} />}
          isPassword
        />

        <CustomButton title="LOGIN" onPress={handleLogin} style={{ marginTop: 12 }} />
        
        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
        </TouchableOpacity>
      </ScrollView>
      <LoadingOverlay visible={loading} message="Authenticating..." />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 24, justifyContent: 'center', flexGrow: 1 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  brandTitle: { fontSize: 20, fontWeight: '800', color: COLORS.white, letterSpacing: 1 },
  errorText: { color: '#FF4D4D', textAlign: 'center', marginBottom: 16, backgroundColor: 'rgba(255, 77, 77, 0.1)', padding: 10, borderRadius: 8 },
  forgotBtn: { marginTop: 24, marginBottom: 12, alignItems: 'center' },
  linkText: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center' },
  linkBold: { color: COLORS.white, fontWeight: '700' },
});