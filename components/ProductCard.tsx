import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Product } from '../lib/types';
import { colors, radii, shadow, spacing } from '../lib/theme';
import { formatPrice } from '../lib/currency';
import { useStore, toggleFavorite } from '../lib/store';

export function ProductCard({ product, onPress, width }: { product: Product; onPress: () => void; width?: number }) {
  const favorites = useStore(s => s.favorites);
  const suppliers = useStore(s => s.suppliers);
  const supplier = suppliers.find(s => s.id === product.supplier_id);
  const isFav = favorites.includes(product.id);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={{
      width, backgroundColor: colors.surface, borderRadius: radii.lg, overflow: 'hidden', ...shadow.card,
    }}>
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: product.images[0] }} style={{ width: '100%', height: 150, backgroundColor: colors.surfaceAlt }} contentFit="cover" transition={180} />
        <TouchableOpacity onPress={() => toggleFavorite(product.id)} style={{
          position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16,
          backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center',
        }}>
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={isFav ? colors.danger : colors.text} />
        </TouchableOpacity>
        {supplier?.verified && (
          <View style={{
            position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', gap: 3,
            paddingHorizontal: 7, paddingVertical: 3, borderRadius: radii.pill, backgroundColor: colors.gold,
          }}>
            <Ionicons name="shield-checkmark" size={11} color={colors.primaryDark} />
            <Text style={{ color: colors.primaryDark, fontSize: 10, fontWeight: '800' }}>GOLD</Text>
          </View>
        )}
      </View>
      <View style={{ padding: spacing.md }}>
        <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: colors.text, minHeight: 36 }}>{product.title}</Text>
        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>{supplier?.company_name}</Text>
        <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary, marginTop: 6 }}>{formatPrice(product.base_price)}</Text>
        <Text style={{ fontSize: 11, color: colors.textLight, marginTop: 2 }}>MOQ: {product.min_order_qty}</Text>
      </View>
    </TouchableOpacity>
  );
}
