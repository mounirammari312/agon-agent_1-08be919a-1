import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen, Pill, Empty } from '../components/ui';
import { ProductCard } from '../components/ProductCard';
import { colors, radii, spacing, typography } from '../lib/theme';
import { t, getLang, subscribeLang } from '../lib/i18n';
import { useStore } from '../lib/store';

const { width } = Dimensions.get('window');
const cardW = (width - spacing.lg * 3) / 2;

export default function CatalogScreen() {
  const nav: any = useNavigation();
  const route: any = useRoute();
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => subscribeLang(force), []);

  const products = useStore(s => s.products);
  const categories = useStore(s => s.categories);
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState<string | null>(route.params?.category_id ?? null);
  const [sort, setSort] = React.useState<'new'|'low'|'high'>('new');

  const filtered = React.useMemo(() => {
    let list = products;
    if (cat) list = list.filter(p => p.category_id === cat);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    if (sort === 'low') list = [...list].sort((a, b) => a.base_price - b.base_price);
    if (sort === 'high') list = [...list].sort((a, b) => b.base_price - a.base_price);
    return list;
  }, [products, cat, q, sort]);

  return (
    <Screen>
      <View style={{ padding: spacing.lg, paddingTop: 54, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={typography.h2}>{t('catalog')}</Text>
        <View style={{
          flexDirection: 'row', alignItems: 'center', marginTop: 12,
          borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.bg, paddingHorizontal: 12, height: 44,
        }}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput value={q} onChangeText={setQ} placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.textLight}
            style={{ flex: 1, marginLeft: 8, fontSize: 14, color: colors.text, paddingVertical: 0 }} />
          {q.length > 0 && (
            <TouchableOpacity onPress={() => setQ('')}>
              <Ionicons name="close-circle" size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 10, flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
          <Pill label={t('allCategories')} active={!cat} onPress={() => setCat(null)} />
        </View>
      </View>
      <View style={{ height: 44 }}>
        <FlashListHorizontal items={categories.map(c => ({
          id: c.id,
          label: getLang() === 'ar' ? c.name_ar : getLang() === 'en' ? c.name_en : c.name_fr,
          icon: c.icon,
        }))} active={cat} onSelect={setCat} />
      </View>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: spacing.lg, paddingVertical: 6 }}>
        <Pill label={t('newest')} icon="time" active={sort === 'new'} onPress={() => setSort('new')} />
        <Pill label={t('priceLowHigh')} icon="arrow-up" active={sort === 'low'} onPress={() => setSort('low')} />
        <Pill label={t('priceHighLow')} icon="arrow-down" active={sort === 'high'} onPress={() => setSort('high')} />
      </View>

      {filtered.length === 0 ? (
        <Empty icon="search" title="Aucun résultat" subtitle="Essayez un autre mot-clé ou catégorie." />
      ) : (
        <FlashList
          data={filtered}
          keyExtractor={i => i.id}
          numColumns={2}
          estimatedItemSize={260}
          contentContainerStyle={{ padding: spacing.lg }}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1, paddingRight: index % 2 === 0 ? 6 : 0, paddingLeft: index % 2 === 1 ? 6 : 0, marginBottom: spacing.lg }}>
              <ProductCard product={item} width={cardW} onPress={() => nav.navigate('Product', { id: item.id })} />
            </View>
          )}
        />
      )}
    </Screen>
  );
}

function FlashListHorizontal({ items, active, onSelect }: { items: { id:string; label:string; icon?:string }[]; active: string | null; onSelect: (id: string | null) => void }) {
  return (
    <FlashList
      horizontal
      data={items}
      keyExtractor={(i) => i.id}
      estimatedItemSize={120}
      contentContainerStyle={{ paddingHorizontal: spacing.lg }}
      renderItem={({ item }) => (
        <View style={{ marginRight: 8 }}>
          <Pill label={item.label} icon={item.icon as any} active={active === item.id} onPress={() => onSelect(active === item.id ? null : item.id)} />
        </View>
      )}
    />
  );
}
