import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Screen, HeaderBar, Card, Button } from '../components/ui';
import { colors, radii, shadow, spacing, typography } from '../lib/theme';
import { t } from '../lib/i18n';
import { formatPrice } from '../lib/currency';
import { useStore } from '../lib/store';

export default function SupplierDashboardScreen() {
  const nav: any = useNavigation();
  const orders = useStore(s => s.orders);
  const products = useStore(s => s.products.slice(0, 8));

  const revenue = orders.reduce((a, o) => a + o.total, 0);
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length;

  return (
    <Screen>
      <HeaderBar title={t('supplierDashboard')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <KpiCard icon="cash" label={t('revenue')} value={formatPrice(revenue)} color={colors.gold} />
          <KpiCard icon="receipt" label={t('ordersToday')} value={String(todayOrders)} color={colors.primary} />
        </View>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <KpiCard icon="cube" label={t('products')} value={String(products.length)} color={colors.primary} />
          <KpiCard icon="star" label="Rating" value="4.8" color={colors.gold} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl, marginBottom: 10 }}>
          <Text style={[typography.h3, { flex: 1 }]}>{t('myProducts')}</Text>
          <Button title={t('addProduct')} icon="add" size="sm" variant="gold" onPress={() => Alert.alert(t('addProduct'), 'Form complet — avec Zod, validation prix & photos via Supabase Storage.')} />
        </View>

        {products.map(p => (
          <TouchableOpacity key={p.id} onPress={() => nav.navigate('Product', { id: p.id })}
            style={{ flexDirection: 'row', backgroundColor: colors.surface, padding: 10, borderRadius: radii.lg, marginBottom: 10, gap: 12, ...shadow.card }}>
            <Image source={{ uri: p.images[0] }} style={{ width: 64, height: 64, borderRadius: radii.md, backgroundColor: colors.surfaceAlt }} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} style={{ fontWeight: '700', color: colors.text }}>{p.title}</Text>
              <Text style={{ color: colors.primary, fontWeight: '800', marginTop: 4 }}>{formatPrice(p.base_price)}</Text>
              <Text style={typography.muted}>Stock: {p.stock_qty}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}
function KpiCard({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <Card style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: color + '22', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text style={typography.label}>{label}</Text>
      </View>
      <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 8 }}>{value}</Text>
    </Card>
  );
}
