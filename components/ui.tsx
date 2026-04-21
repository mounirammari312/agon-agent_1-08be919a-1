import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, TextInputProps, ViewStyle, StyleProp } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radii, shadow, spacing, typography } from '../lib/theme';

export function Screen({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flex: 1, backgroundColor: colors.bg }, style]}>{children}</View>;
}

export function Card({ children, style, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const C: any = onPress ? TouchableOpacity : View;
  return (
    <C activeOpacity={0.85} onPress={onPress} style={[{
      backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg, ...shadow.card,
    }, style]}>
      {children}
    </C>
  );
}

interface BtnProps {
  title: string; onPress?: () => void;
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean; disabled?: boolean;
  style?: StyleProp<ViewStyle>; size?: 'sm' | 'md' | 'lg';
}
export function Button({ title, onPress, variant='primary', icon, loading, disabled, style, size='md' }: BtnProps) {
  const h = size === 'sm' ? 38 : size === 'lg' ? 54 : 46;
  const bg = variant === 'primary' ? colors.primary
    : variant === 'gold' ? colors.gold
    : variant === 'danger' ? colors.danger
    : 'transparent';
  const fg = variant === 'outline' ? colors.primary
    : variant === 'ghost' ? colors.primary
    : variant === 'gold' ? colors.primaryDark
    : '#fff';
  const border = variant === 'outline' ? { borderWidth: 1.5, borderColor: colors.primary } : {};
  return (
    <TouchableOpacity disabled={disabled || loading} activeOpacity={0.85} onPress={onPress}
      style={[{
        height: h, backgroundColor: bg, borderRadius: radii.md,
        paddingHorizontal: spacing.lg, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: disabled ? 0.5 : 1,
      }, border, style]}>
      {loading
        ? <ActivityIndicator color={fg} />
        : <>
            {icon && <Ionicons name={icon} size={18} color={fg} />}
            <Text style={{ color: fg, fontWeight: '700', fontSize: size === 'sm' ? 13 : 15 }}>{title}</Text>
          </>}
    </TouchableOpacity>
  );
}

export function Input(props: TextInputProps & { leftIcon?: keyof typeof Ionicons.glyphMap; error?: string }) {
  const { leftIcon, error, style, ...rest } = props;
  return (
    <View style={{ marginBottom: spacing.md }}>
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: error ? colors.danger : colors.border,
        backgroundColor: colors.surface, borderRadius: radii.md, paddingHorizontal: 12, height: 48,
      }}>
        {leftIcon && <Ionicons name={leftIcon} size={18} color={colors.textMuted} style={{ marginRight: 8 }} />}
        <TextInput
          placeholderTextColor={colors.textLight}
          style={[{ flex: 1, fontSize: 15, color: colors.text, paddingVertical: 0 }, style]}
          {...rest}
        />
      </View>
      {error ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4, marginLeft: 4 }}>{error}</Text> : null}
    </View>
  );
}

export function Pill({ label, active, onPress, icon }: { label: string; active?: boolean; onPress?: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{
      paddingHorizontal: 14, height: 36, flexDirection: 'row', alignItems: 'center', gap: 6,
      borderRadius: radii.pill,
      backgroundColor: active ? colors.primary : colors.surface,
      borderWidth: 1, borderColor: active ? colors.primary : colors.border,
    }}>
      {icon && <Ionicons name={icon} size={14} color={active ? '#fff' : colors.textMuted} />}
      <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600', fontSize: 13 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Section({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
        <Text style={[typography.h3, { flex: 1 }]}>{title}</Text>
        {action && <TouchableOpacity onPress={onAction}><Text style={{ color: colors.gold, fontWeight: '700' }}>{action}</Text></TouchableOpacity>}
      </View>
      {children}
    </View>
  );
}

export function Badge({ label, color = colors.gold, icon }: { label: string; color?: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.pill,
      backgroundColor: color + '22', borderWidth: 1, borderColor: color + '55',
    }}>
      {icon && <Ionicons name={icon} size={11} color={color} />}
      <Text style={{ color, fontSize: 11, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

export function Empty({ icon = 'file-tray-outline', title, subtitle }: { icon?: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: spacing.xxxl }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Ionicons name={icon} size={32} color={colors.primary} />
      </View>
      <Text style={[typography.h3, { textAlign: 'center' }]}>{title}</Text>
      {subtitle && <Text style={[typography.muted, { textAlign: 'center', marginTop: 6 }]}>{subtitle}</Text>}
    </View>
  );
}

export function HeaderBar({ title, onBack, right }: { title: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <View style={{
      height: 54, flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.lg, backgroundColor: colors.surface,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    }}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={{ marginRight: 8, padding: 4 }}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}
      <Text style={[typography.h3, { flex: 1 }]} numberOfLines={1}>{title}</Text>
      {right}
    </View>
  );
}
