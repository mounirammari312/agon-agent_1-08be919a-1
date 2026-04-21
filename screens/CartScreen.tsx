import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Screen, Button, HeaderBar, Empty } from '../components/ui';
import { colors, radii, shadow, spacing, typography } from '../lib/theme';
import { t } from '../lib/i18n';
import { formatPrice } from '../lib/currency';
import { useStore, updateCartQty, removeCart, placeOrder } from '../lib/store';

export default function CartScreen() {
  const nav: any = useNavigation();
  const cart = useStore(s => s.cart);
  const products = useStore(s => s.products);
  const [addr, setAddr] = React.useState('Alger Centre, Algérie');

  const items = cart.map(c => ({ cart: c, product: products.find(p => p.id === c.product_id)! }));
  const subtotal = items.reduce((s, i) => s + (i.product?.base_price ?? 0) * i.cart.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal > 50000 ? 0 : 1500;
  const total = subtotal + shipping;

  const onCheckout = async () => {
    const o = await placeOrder(addr);
    if (o) {
      Alert.alert(t('orderPlaced'), t('orderNumber') + ' ' + o.id.slice(-6).toUpperCase());
      nav.navigate('Orders');
    }
  };

  return (
    <Screen>
      <HeaderBar title={t('cart')} onBack={() => nav.goBack()} />
      {items.length === 0 ? (
        <Empty icon="cart-outline" title={t('emptyCart')} subtitle={t('searchPlaceholder')} />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
            {items.map(({ cart: c, product: p }) => p && (
              <View key={c.id} style={{ flexDirection: 'row', gap: 12, backgroundColor: colors.surface, padding: 12, borderRadius: radii.lg, marginBottom: 10, ...shadow.card }}>
                <Image source={{ uri: p.images[0] }} style={{ width: 80, height: 80, borderRadius: radii.md, backgroundColor: colors.surfaceAlt }} />
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={{ fontWeight: '600', color: colors.text }}>{p.title}</Text>
                  <Text style={{ color: colors.primary, fontWeight: '800', marginTop: 4 }}>{formatPrice(p.base_price)}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
                    <TouchableOpacity onPress={() => updateCartQty(c.id, c.quantity - 1)} style={qtyBtn}><Ionicons name="remove" size={14} color={colors.primary} /></TouchableOpacity>
                    <Text style={{ fontWeight: '700', minWidth: 24, textAlign: 'center' }}>{c.quantity}</Text>
                    <TouchableOpacity onPress={() => updateCartQty(c.id, c.quantity + 1)} style={qtyBtn}><Ionicons name="add" size={14} color={colors.primary} /></TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => removeCart(c.id)}>
                      <Ionicons name="trash" size={18} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={{ padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={typography.muted}>{t('subtotal')}</Text><Text style={{ fontWeight: '600' }}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={typography.muted}>{t('shipping')}</Text><Text style={{ fontWeight: '600' }}>{formatPrice(shipping)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={typography.h3}>{t('total')}</Text><Text style={[typography.h3, { color: colors.primary }]}>{formatPrice(total)}</Text>
            </View>
            <Text style={typography.label}>{t('shippingAddress')}</Text>
            <Text style={{ padding: 10, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, marginTop: 4, color: colors.text }}>{addr}</Text>
            <Button title={t('placeOrder')} icon="checkmark-circle" onPress={onCheckout} style={{ marginTop: 10 }} />
          </View>
        </>
      )}
    </Screen>
  );
}
const qtyBtn = { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.surfaceAlt, alignItems: 'center' as const, justifyContent: 'center' as const };
