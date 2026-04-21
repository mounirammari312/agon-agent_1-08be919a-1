import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen, Button, Card, HeaderBar, Badge } from '../components/ui';
import { colors, radii, shadow, spacing, typography } from '../lib/theme';
import { t } from '../lib/i18n';
import { formatPrice } from '../lib/currency';
import { useStore, addToCart, toggleFavorite, openConversation } from '../lib/store';

const { width } = Dimensions.get('window');

export default function ProductScreen() {
  const nav: any = useNavigation();
  const route: any = useRoute();
  const id: string = route.params?.id;
  const product = useStore(s => s.products.find(p => p.id === id));
  const suppliers = useStore(s => s.suppliers);
  const favorites = useStore(s => s.favorites);
  const [qty, setQty] = useState(product?.min_order_qty ?? 1);
  const [imgIdx, setImgIdx] = useState(0);

  if (!product) return <Screen><HeaderBar title="" onBack={() => nav.goBack()} /></Screen>;
  const supplier = suppliers.find(s => s.id === product.supplier_id);
  const isFav = favorites.includes(product.id);

  const onAddCart = () => {
    addToCart(product.id, qty);
    Alert.alert(t('addToCart'), `${product.title} × ${qty}`);
  };
  const onBuyNow = () => { addToCart(product.id, qty); nav.navigate('Cart'); };
  const onChat = async () => {
    const cid = await openConversation(product.supplier_id);
    nav.navigate('Chat', { conversation_id: cid, supplier_id: product.supplier_id });
  };
  const onQuote = () => nav.navigate('QuoteForm', { product_id: product.id, supplier_id: product.supplier_id });

  return (
    <Screen>
      <HeaderBar title={t('products')} onBack={() => nav.goBack()}
        right={
          <TouchableOpacity onPress={() => toggleFavorite(product.id)}>
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={22} color={isFav ? colors.danger : colors.text} />
          </TouchableOpacity>
        } />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onScroll={e => setImgIdx(Math.round(e.nativeEvent.contentOffset.x / width))} scrollEventThrottle={16}>
          {product.images.map((src, i) => (
            <Image key={i} source={{ uri: src }} style={{ width, height: width * 0.8, backgroundColor: colors.surfaceAlt }} contentFit="cover" />
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: -20, marginBottom: 10 }}>
          {product.images.map((_, i) => (
            <View key={i} style={{ width: i === imgIdx ? 16 : 6, height: 6, borderRadius: 3, backgroundColor: i === imgIdx ? colors.gold : 'rgba(255,255,255,0.7)' }} />
          ))}
        </View>

        <View style={{ padding: spacing.lg }}>
          <Text style={typography.h2}>{product.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.primary }}>{formatPrice(product.base_price)}</Text>
            {product.stock_qty > 0 && <Badge label={`${t('stock')}: ${product.stock_qty}`} color={colors.success} icon="checkmark-circle" />}
          </View>
          <Text style={[typography.muted, { marginTop: 4 }]}>{t('minOrder')}: {product.min_order_qty} · SKU: {product.sku}</Text>

          {supplier && (
            <TouchableOpacity onPress={() => nav.navigate('Supplier', { id: supplier.id })}
              style={{ marginTop: spacing.lg, backgroundColor: colors.surface, padding: 12, borderRadius: radii.md, flexDirection: 'row', alignItems: 'center', gap: 12, ...shadow.card }}>
              <Image source={{ uri: supplier.logo_url }} style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: colors.surfaceAlt }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontWeight: '700', color: colors.text }}>{supplier.company_name}</Text>
                  {supplier.verified && <Ionicons name="shield-checkmark" size={14} color={colors.gold} />}
                </View>
                <Text style={typography.muted}>★ {supplier.rating.toFixed(1)} · {supplier.city}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}

          <Text style={[typography.label, { marginTop: spacing.xl }]}>{t('description')}</Text>
          <Text style={[typography.body, { marginTop: 6, lineHeight: 22 }]}>{product.description}</Text>

          <Text style={[typography.label, { marginTop: spacing.xl }]}>{t('quantity')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <TouchableOpacity onPress={() => setQty(Math.max(product.min_order_qty, qty - 1))}
              style={{ width: 44, height: 44, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}>
              <Ionicons name="remove" size={20} color={colors.primary} />
            </TouchableOpacity>
            <View style={{ minWidth: 56, height: 44, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>{qty}</Text>
            </View>
            <TouchableOpacity onPress={() => setQty(qty + 1)}
              style={{ width: 44, height: 44, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface }}>
              <Ionicons name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>{formatPrice(product.base_price * qty)}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.xl }}>
            <Button title={t('contactSupplier')} variant="outline" icon="chatbubbles" onPress={onChat} style={{ flex: 1 }} />
            <Button title={t('requestQuote')} variant="gold" icon="document-text" onPress={onQuote} style={{ flex: 1 }} />
          </View>
        </View>
      </ScrollView>

      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 10,
        padding: spacing.lg, paddingBottom: 24, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
      }}>
        <Button title={t('addToCart')} variant="outline" icon="cart" onPress={onAddCart} style={{ flex: 1 }} />
        <Button title={t('buyNow')} icon="flash" onPress={onBuyNow} style={{ flex: 1 }} />
      </View>
    </Screen>
  );
}
