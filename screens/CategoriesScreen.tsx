import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { Screen, HeaderBar } from '../components/ui';
import { colors, radii, shadow, spacing } from '../lib/theme';
import { t, getLang } from '../lib/i18n';
import { useStore } from '../lib/store';

const { width } = Dimensions.get('window');
const cardW = (width - spacing.lg * 3) / 2;

export default function CategoriesScreen() {
  const nav: any = useNavigation();
  const categories = useStore(s => s.categories);
  const products = useStore(s => s.products);

  return (
    <Screen>
      <HeaderBar title={t('categories')} onBack={() => nav.goBack()} />
      <FlashList
        data={categories}
        numColumns={2}
        estimatedItemSize={140}
        keyExtractor={c => c.id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item: c, index }) => {
          const name = getLang() === 'ar' ? c.name_ar : getLang() === 'en' ? c.name_en : c.name_fr;
          const count = products.filter(p => p.category_id === c.id).length;
          return (
            <View style={{ flex: 1, paddingRight: index % 2 === 0 ? 6 : 0, paddingLeft: index % 2 === 1 ? 6 : 0, marginBottom: spacing.lg }}>
              <TouchableOpacity onPress={() => nav.navigate('Catalog', { category_id: c.id })}
                style={{ backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg, alignItems: 'center', ...shadow.card, width: cardW }}>
                <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: colors.primary + '12', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={(c.icon ?? 'grid') as any} size={28} color={colors.primary} />
                </View>
                <Text style={{ fontWeight: '700', color: colors.text, marginTop: 8, textAlign: 'center' }}>{name}</Text>
                <Text style={{ fontSize: 12, color: colors.gold, fontWeight: '700', marginTop: 2 }}>{count} {t('products').toLowerCase()}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </Screen>
  );
}
