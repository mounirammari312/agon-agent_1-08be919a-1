import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen, Button, Input, Pill } from '../components/ui';
import { colors, spacing, typography } from '../lib/theme';
import { t } from '../lib/i18n';
import { loginSchema, signupSchema } from '../lib/validators';
import { signIn, signUp } from '../lib/store';

export default function AuthScreen({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [role, setRole] = useState<'buyer'|'supplier'>('buyer');
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(mode === 'login' ? loginSchema : signupSchema) as any,
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (mode === 'login') await signIn(data.email, data.password);
      else await signUp(data.email, data.password, data.fullName, data.phone, role);
      onDone();
    } catch (e: any) {
      Alert.alert('Erreur', e.message ?? 'Erreur inconnue');
    } finally { setLoading(false); }
  };

  const errMsg = (k: string) => (errors as any)[k] ? t((errors as any)[k].message) : undefined;

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingTop: 70 }}>
          <View style={{ alignItems: 'center', marginBottom: spacing.xxl }}>
            <View style={{ width: 84, height: 84, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Ionicons name="briefcase" size={42} color={colors.gold} />
            </View>
            <Text style={[typography.h1]}>{t('appName')}</Text>
            <Text style={typography.muted}>{t('tagline')}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: spacing.xl }}>
            <Pill label={t('login')} active={mode === 'login'} onPress={() => setMode('login')} />
            <Pill label={t('signup')} active={mode === 'signup'} onPress={() => setMode('signup')} />
          </View>

          {mode === 'signup' && (
            <>
              <Controller control={control} name="fullName" defaultValue=""
                render={({ field }) => (
                  <Input leftIcon="person" placeholder={t('fullName')} value={field.value as any} onChangeText={field.onChange} error={errMsg('fullName')} />
                )} />
              <Controller control={control} name="phone" defaultValue=""
                render={({ field }) => (
                  <Input leftIcon="call" placeholder="+213 5/6/7 XX XX XX XX" keyboardType="phone-pad" value={field.value as any} onChangeText={field.onChange} error={errMsg('phone')} />
                )} />
              <Text style={[typography.label, { marginTop: 4, marginBottom: 6 }]}>{t('chooseRole')}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: spacing.md }}>
                <Pill label={t('buyer')} icon="cart" active={role === 'buyer'} onPress={() => setRole('buyer')} />
                <Pill label={t('supplier')} icon="storefront" active={role === 'supplier'} onPress={() => setRole('supplier')} />
              </View>
            </>
          )}

          <Controller control={control} name="email" defaultValue=""
            render={({ field }) => (
              <Input leftIcon="mail" placeholder={t('email')} autoCapitalize="none" keyboardType="email-address"
                value={field.value as any} onChangeText={field.onChange} error={errMsg('email')} />
            )} />
          <Controller control={control} name="password" defaultValue=""
            render={({ field }) => (
              <Input leftIcon="lock-closed" placeholder={t('password')} secureTextEntry
                value={field.value as any} onChangeText={field.onChange} error={errMsg('password')} />
            )} />

          <Button title={mode === 'login' ? t('login') : t('signup')} onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: spacing.md }} />
          <Button title={t('continueGuest')} variant="ghost" onPress={onDone} style={{ marginTop: 8 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
