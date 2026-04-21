import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Screen, HeaderBar, Badge } from '../components/ui';
import { colors, radii, shadow, spacing, typography } from '../lib/theme';
import { t } from '../lib/i18n';
import { useStore } from '../lib/store';

export default function SuppliersScreen() {
  const nav: any = useNavigation();
  const suppliers = useStore(s => s.suppliers);
  return (
    <Screen>
      <HeaderBar title={t('suppliers')} onBack={() => nav.goBack()} />
      <FlashList
        data={suppliers}
        keyExtractor={(s) => s.id}
        estimatedItemSize={140}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item: s }) => (
          <TouchableOpacity onPress={() => nav.navigate('Supplier', { id: s.id })}
            style={{ backgroundColor: colors.surface, borderRadius: radii.lg, overflow: 'hidden', marginBottom: 12, ...shadow.card }}>
            <Image source={{ uri: s.banner_url }} style={{ width: '100%', height: 90 }} contentFit="cover" />
            <View style={{ padding: 12, flexDirection: 'row', gap: 12 }}>
              <Image source={{ uri: s.logo_url }} style={{ width: 56, height: 56, borderRadius: 14, marginTop: -30, borderWidth: 3, borderColor: '#fff', backgroundColor: colors.surfaceAlt }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontWeight: '800', color: colors.text, flex: 1 }}>{s.company_name}</Text>
                  {s.verified && <Badge label="GOLD" icon="shield-checkmark" />}
                </View>
                <Text style={typography.muted} numberOfLines={1}>{s.description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Ionicons name="star" size={12} color={colors.gold} />
                    <Text style={{ fontSize: 12, fontWeight: '600' }}>{s.rating.toFixed(1)}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>{s.total_orders} {t('orders').toLowerCase()}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>· {s.city}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
