import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Screen, HeaderBar, Card, Pill, Button } from '../components/ui';
import { colors, radii, spacing, typography, shadow } from '../lib/theme';
import { t, setLang, getLang, subscribeLang } from '../lib/i18n';
import { setCurrency, getCurrency, subscribeCurrency } from '../lib/currency';
import { useStore, signOut } from '../lib/store';

export default function ProfileScreen() {
  const nav: any = useNavigation();
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => subscribeLang(force), []);
  React.useEffect(() => subscribeCurrency(force), []);

  const session = useStore(s => s.session);
  const profile = useStore(s => s.profile);

  const onLogout = () => {
    Alert.alert(t('logout'), '?', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('logout'), style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <Screen>
      <HeaderBar title={t('profile')} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
          <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...shadow.floating }}>
            <Ionicons name="person" size={42} color={colors.gold} />
          </View>
          <Text style={[typography.h2, { marginTop: 10 }]}>{profile?.full_name ?? (session.email ?? 'Invité')}</Text>
          <Text style={typography.muted}>{session.email ?? 'demo@businfo.dz'}</Text>
          {profile?.role && (
            <View style={{ marginTop: 6, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, backgroundColor: colors.gold }}>
              <Text style={{ color: colors.primaryDark, fontWeight: '800', fontSize: 11 }}>{t(profile.role as any)}</Text>
            </View>
          )}
        </View>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[typography.label, { marginBottom: 10 }]}>{t('language')}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pill label="Français" active={getLang() === 'fr'} onPress={() => setLang('fr')} />
            <Pill label="English" active={getLang() === 'en'} onPress={() => setLang('en')} />
            <Pill label="العربية" active={getLang() === 'ar'} onPress={() => setLang('ar')} />
          </View>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[typography.label, { marginBottom: 10 }]}>{t('currency')}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pill label="DZD" active={getCurrency() === 'DZD'} onPress={() => setCurrency('DZD')} />
            <Pill label="EUR" active={getCurrency() === 'EUR'} onPress={() => setCurrency('EUR')} />
            <Pill label="USD" active={getCurrency() === 'USD'} onPress={() => setCurrency('USD')} />
          </View>
        </Card>

        <LinkRow icon="storefront" label={t('supplierDashboard')} onPress={() => nav.navigate('SupplierDashboard')} />
        <LinkRow icon="heart" label={t('favorites')} onPress={() => nav.navigate('Favorites')} />
        <LinkRow icon="document-text" label={t('myQuotes')} onPress={() => nav.navigate('Quotes')} />
        <LinkRow icon="notifications" label={t('notifications')} onPress={() => nav.navigate('Notifications')} />
        <LinkRow icon="location" label={t('addresses')} onPress={() => Alert.alert(t('addresses'), 'Gestion des adresses — en démo.')} />
        <LinkRow icon="settings" label={t('settings')} onPress={() => Alert.alert(t('settings'), 'Paramètres — en démo.')} />

        <Button title={t('logout')} variant="danger" icon="log-out" onPress={onLogout} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

function LinkRow({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{
      flexDirection: 'row', alignItems: 'center', padding: 14,
      backgroundColor: colors.surface, borderRadius: radii.md, marginBottom: 8, gap: 12, ...shadow.card,
    }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary + '12', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={{ flex: 1, fontWeight: '600', color: colors.text }}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}
