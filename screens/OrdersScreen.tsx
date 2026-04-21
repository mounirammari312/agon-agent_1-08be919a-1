import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Screen, HeaderBar, Empty, Badge } from '../components/ui';
import { colors, radii, shadow, spacing, typography } from '../lib/theme';
import { t } from '../lib/i18n';
import { formatPrice } from '../lib/currency';
import { useStore } from '../lib/store';

const statusColor: Record<string, string> = {
  pending: colors.warn, confirmed: colors.primary, shipped: colors.gold, delivered: colors.success, cancelled: colors.danger,
};

export default function OrdersScreen() {
  const nav: any = useNavigation();
  const orders = useStore(s => s.orders);
  const suppliers = useStore(s => s.suppliers);

  return (
    <Screen>
      <HeaderBar title={t('myOrders')} />
      {orders.length === 0 ? <Empty icon="receipt-outline" title="Aucune commande" /> : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          {orders.map(o => {
            const s = suppliers.find(x => x.id === o.supplier_id);
            return (
              <TouchableOpacity key={o.id} onPress={() => nav.navigate('OrderDetail', { id: o.id })}
                style={{ backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radii.lg, marginBottom: 12, ...shadow.card }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={{ fontWeight: '800', color: colors.text, flex: 1 }}>{t('orderNumber')} {o.id.slice(-6).toUpperCase()}</Text>
                  <Badge label={t(o.status as any)} color={statusColor[o.status]} />
                </View>
                <Text style={typography.muted}>{s?.company_name}</Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Text style={{ flex: 1, color: colors.textMuted, fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString()}</Text>
                  <Text style={{ fontWeight: '800', color: colors.primary }}>{formatPrice(o.total)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </Screen>
  );
}
