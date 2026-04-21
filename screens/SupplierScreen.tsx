import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen, HeaderBar, Button, Badge } from '../components/ui';
import { ProductCard } from '../components/ProductCard';
import { colors, radii, shadow, spacing, typography } from '../lib/theme';
import { t, getLang } from '../lib/i18n';
import { useStore, openConversation } from '../lib/store';

const { width } = Dimensions.get('window');
const cardW = (width - spacing.lg * 3) / 2;

export default function SupplierScreen() {
  const nav: any = useNavigation();
  const route: any = useRoute();
  const supplier = useStore(s => s.suppliers.find(x => x.id === route.params?.id));
  const allProducts = useStore(s => s.products);
  const badges = useStore(s => s.badges);
  if (!supplier) return <Screen><HeaderBar title="" onBack={() => nav.goBack()} /></Screen>;

  const products = allProducts.filter(p => p.supplier_id === supplier.id);
  const supplierBadges = badges.filter(b => supplier.badges?.includes(b.code));

  const onChat = async () => {
    const cid = await openConversation(supplier.id);
    nav.navigate('Chat', { conversation_id: cid, supplier_id: supplier.id });
  };

  return (
    <Screen>
      <HeaderBar title={t('supplierProfile')} onBack={() => nav.goBack()} />
      <ScrollView>
        <Image source={{ uri: supplier.banner_url }} style={{ width: '100%', height: 160 }} contentFit="cover" />
        <View style={{ paddingHorizontal: spacing.lg, marginTop: -40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Image source={{ uri: supplier.logo_url }} style={{ width: 80, height: 80, borderRadius: 20, borderWidth: 4, borderColor: '#fff', backgroundColor: colors.surfaceAlt }} />
            <View style={{ flex: 1, marginLeft: 12, marginBottom: 6 }}>
              <Text style={{ color:'#fff', fontWeight:'800', fontSize: 20, textShadowColor:'rgba(0,0,0,0.4)', textShadowRadius: 4 }}>{supplier.company_name}</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                {supplier.verified && <Badge label="Verified" icon="shield-checkmark" />}
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg, marginTop: 14, ...shadow.card }}>
            <View style={{ flexDirection: 'row' }}>
              <Stat label={t('reviews')} value={supplier.rating.toFixed(1)} icon="star" />
              <Stat label={t('orders')} value={String(supplier.total_orders)} icon="receipt" />
              <Stat label={t('products')} value={String(products.length)} icon="cube" />
            </View>
            <Text style={[typography.body, { marginTop: 12 }]}>{supplier.description}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {supplierBadges.map(b => {
                const name = getLang() === 'ar' ? b.name_ar : getLang() === 'en' ? b.name_en : b.name_fr;
                return <Badge key={b.id} label={name} icon={(b.icon ?? 'ribbon') as any} />;
              })}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
              <Button title={t('contactSupplier')} icon="chatbubbles" onPress={onChat} style={{ flex: 1 }} />
              <Button title={t('requestQuote')} variant="gold" icon="document-text"
                onPress={() => nav.navigate('QuoteForm', { supplier_id: supplier.id })} style={{ flex: 1 }} />
            </View>
          </View>

          <Text style={[typography.h3, { marginTop: spacing.xl }]}>{t('products')}</Text>
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap: spacing.lg, marginTop: 10, paddingBottom: 30 }}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} width={cardW} onPress={() => nav.navigate('Product', { id: p.id })} />
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
function Stat({ label, value, icon }: { label:string; value:string; icon: any }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Ionicons name={icon} size={18} color={colors.gold} />
      <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 4 }}>{value}</Text>
      <Text style={{ fontSize: 11, color: colors.textMuted }}>{label}</Text>
    </View>
  );
}
