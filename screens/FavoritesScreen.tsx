import React from 'react';
import { View, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { Screen, HeaderBar, Empty } from '../components/ui';
import { ProductCard } from '../components/ProductCard';
import { spacing } from '../lib/theme';
import { t } from '../lib/i18n';
import { useStore } from '../lib/store';

const { width } = Dimensions.get('window');
const cardW = (width - spacing.lg * 3) / 2;

export default function FavoritesScreen() {
  const nav: any = useNavigation();
  const favorites = useStore(s => s.favorites);
  const products = useStore(s => s.products.filter(p => favorites.includes(p.id)));
  return (
    <Screen>
      <HeaderBar title={t('favorites')} onBack={() => nav.goBack()} />
      {products.length === 0
        ? <Empty icon="heart-outline" title="Aucun favori" subtitle="Parcourez le catalogue et ajoutez vos coups de cœur." />
        : <FlashList
            data={products} keyExtractor={p => p.id} numColumns={2} estimatedItemSize={260}
            contentContainerStyle={{ padding: spacing.lg }}
            renderItem={({ item, index }) => (
              <View style={{ flex: 1, paddingRight: index % 2 === 0 ? 6 : 0, paddingLeft: index % 2 === 1 ? 6 : 0, marginBottom: spacing.lg }}>
                <ProductCard product={item} width={cardW} onPress={() => nav.navigate('Product', { id: item.id })} />
              </View>
            )}
          />}
    </Screen>
  );
}
