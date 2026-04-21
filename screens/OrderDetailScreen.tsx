import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen, HeaderBar, Card, Badge } from '../components/ui';
import { colors, spacing, typography } from '../lib/theme';
import { t } from '../lib/i18n';
import { formatPrice } from '../lib/currency';
import { useStore } from '../lib/store';

const statusColor: Record<string, string> = {
  pending: colors.warn, confirmed: colors.primary, shipped: colors.gold, delivered: colors.success, cancelled: colors.danger,
};

export default function OrderDetailScreen() {
  const nav: any = useNavigation();
  const route: any = useRoute();
  const order = useStore(s => s.orders.find(o => o.id === route.params?.id));
  const products = useStore(s => s.products);
  if (!order) return <Screen><HeaderBar title="" onBack={() => nav.goBack()} /></Screen>;

  return (
    <Screen>
      <HeaderBar title={`${t('orderNumber')} ${order.id.slice(-6).toUpperCase()}`} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: 12 }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[typography.h3, { flex: 1 }]}>{t('orderStatus')}</Text>
            <Badge label={t(order.status as any)} color={statusColor[order.status]} />
          </View>
          <Text style={[typography.muted, { marginTop: 6 }]}>{new Date(order.created_at).toLocaleString()}</Text>
        </Card>
        <Card>
          <Text style={typography.label}>{t('shippingAddress')}</Text>
          <Text style={[typography.body, { marginTop: 4 }]}>{order.shipping_address}</Text>
        </Card>
        <Card>
          <Text style={typography.label}>{t('products')}</Text>
          {order.items.map((it, i) => {
            const p = products.find(pp => pp.id === it.product_id);
            return (
              <View key={i} style={{ flexDirection: 'row', paddingVertical: 8, borderBottomWidth: i < order.items.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
                <Text style={{ flex: 1, color: colors.text }}>{p?.title} × {it.quantity}</Text>
                <Text style={{ fontWeight: '700' }}>{formatPrice(it.line_total)}</Text>
              </View>
            );
          })}
        </Card>
        <Card>
          <Row label={t('subtotal')} value={formatPrice(order.subtotal)} />
          <Row label={t('shipping')} value={formatPrice(order.shipping)} />
          <Row label={t('total')} value={formatPrice(order.total)} bold />
        </Card>
      </ScrollView>
    </Screen>
  );
}
function Row({ label, value, bold }: { label:string; value:string; bold?:boolean }) {
  return (
    <View style={{ flexDirection:'row', justifyContent:'space-between', paddingVertical: 4 }}>
      <Text style={{ color: bold ? colors.text : colors.textMuted, fontWeight: bold ? '800':'500' }}>{label}</Text>
      <Text style={{ color: bold ? colors.primary : colors.text, fontWeight: bold ? '800' : '600' }}>{value}</Text>
    </View>
  );
}
