import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Screen, Card, Pill, Section } from '../components/ui';
import { ProductCard } from '../components/ProductCard';
import { colors, radii, shadow, spacing, typography } from '../lib/theme';
import { t, getLang, subscribeLang } from '../lib/i18n';
import { useStore } from '../lib/store';

const { width } = Dimensions.get('window');
const cardW = (width - spacing.lg * 3) / 2;

export default function HomeScreen() {
  const nav: any = useNavigation();
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => subscribeLang(force), []);

  const categories = useStore(s => s.categories);
  const suppliers = useStore(s => s.suppliers);
  const products = useStore(s => s.products);
  const notifs = useStore(s => s.notifications);
  const unread = notifs.filter(n => !n.read_at).length;

  const featured = products.slice(0, 6);
  const topSuppliers = [...suppliers].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <Screen>
      {/* Header */}
      <View style={{ backgroundColor: colors.primary, paddingTop: 52, paddingBottom: 70, paddingHorizontal: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>BUSINFO</Text>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>{t('tagline')}</Text>
          </View>
          <TouchableOpacity onPress={() => nav.navigate('Notifications')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="notifications" size={20} color="#fff" />
            {unread > 0 && <View style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.gold }} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, marginTop: -50 }} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <TouchableOpacity onPress={() => nav.navigate('Catalog')} activeOpacity={0.9} style={{
          marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: radii.lg, padding: 14,
          flexDirection: 'row', alignItems: 'center', gap: 10, ...shadow.floating,
        }}>
          <Ionicons name="search" size={20} color={colors.primary} />
          <Text style={{ color: colors.textMuted, flex: 1 }}>{t('searchPlaceholder')}</Text>
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="options" size={16} color={colors.primaryDark} />
          </View>
        </TouchableOpacity>

        {/* Quick actions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.xl, paddingHorizontal: spacing.lg }}>
          {[
            { icon: 'grid' as const, label: t('categories'), go: 'Categories' },
            { icon: 'storefront' as const, label: t('suppliers'), go: 'Suppliers' },
            { icon: 'document-text' as const, label: t('myQuotes'), go: 'Quotes' },
            { icon: 'heart' as const, label: t('favorites'), go: 'Favorites' },
          ].map(q => (
            <TouchableOpacity key={q.label} onPress={() => nav.navigate(q.go)} style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.card }}>
                <Ionicons name={q.icon} size={24} color={colors.primary} />
              </View>
              <Text style={{ fontSize: 11, color: colors.text, marginTop: 6, fontWeight: '600', textAlign: 'center' }}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
        <Section title={t('categories')} action={t('viewAll')} onAction={() => nav.navigate('Categories')}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 10 }}>
            {categories.map(c => {
              const name = getLang() === 'ar' ? c.name_ar : getLang() === 'en' ? c.name_en : c.name_fr;
              return (
                <TouchableOpacity key={c.id} onPress={() => nav.navigate('Catalog', { category_id: c.id })} style={{
                  backgroundColor: colors.surface, borderRadius: radii.md, padding: 12, width: 96, alignItems: 'center', ...shadow.card,
                }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + '12', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                    <Ionicons name={(c.icon ?? 'grid') as any} size={22} color={colors.primary} />
                  </View>
                  <Text numberOfLines={1} style={{ fontSize: 11, fontWeight: '600', color: colors.text }}>{name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Section>

        {/* Featured products */}
        <Section title={t('featured')} action={t('viewAll')} onAction={() => nav.navigate('Catalog')}>
          <FlatList
            data={featured}
            keyExtractor={i => i.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: spacing.lg, marginBottom: spacing.lg }}
            contentContainerStyle={{ paddingHorizontal: spacing.lg }}
            renderItem={({ item }) => (
              <ProductCard product={item} width={cardW} onPress={() => nav.navigate('Product', { id: item.id })} />
            )}
          />
        </Section>

        {/* Top suppliers */}
        <Section title={t('topSuppliers')} action={t('viewAll')} onAction={() => nav.navigate('Suppliers')}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 12 }}>
            {topSuppliers.map(s => (
              <TouchableOpacity key={s.id} onPress={() => nav.navigate('Supplier', { id: s.id })}
                style={{ width: 210, backgroundColor: colors.surface, borderRadius: radii.lg, overflow: 'hidden', ...shadow.card }}>
                <Image source={{ uri: s.banner_url }} style={{ width: '100%', height: 70 }} contentFit="cover" />
                <View style={{ padding: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text numberOfLines={1} style={{ fontWeight: '700', color: colors.text, flex: 1 }}>{s.company_name}</Text>
                    {s.verified && <Ionicons name="shield-checkmark" size={14} color={colors.gold} />}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Ionicons name="star" size={12} color={colors.gold} />
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>{s.rating.toFixed(1)} · {s.total_orders} {t('orders').toLowerCase()}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}
