import React from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { Screen, HeaderBar, Empty, Badge, Card } from '../components/ui';
import { colors, spacing, typography } from '../lib/theme';
import { t } from '../lib/i18n';
import { formatPrice } from '../lib/currency';
import { useStore } from '../lib/store';

const statusColor: Record<string,string> = {
  open: colors.warn, responded: colors.primary, accepted: colors.success, rejected: colors.danger, expired: colors.textMuted,
};

export default function QuotesScreen() {
  const nav: any = useNavigation();
  const quotes = useStore(s => s.quotes);
  const suppliers = useStore(s => s.suppliers);
  const products = useStore(s => s.products);

  return (
    <Screen>
      <HeaderBar title={t('myQuotes')} onBack={() => nav.goBack()} />
      {quotes.length === 0
        ? <Empty icon="document-text-outline" title="Aucun devis" subtitle={t('requestQuote')} />
        : <FlashList
            data={quotes} keyExtractor={q => q.id} estimatedItemSize={140}
            contentContainerStyle={{ padding: spacing.lg, gap: 12 }}
            renderItem={({ item: q }) => {
              const s = suppliers.find(x => x.id === q.supplier_id);
              const p = products.find(x => x.id === q.product_id);
              return (
                <Card style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[typography.h3, { flex: 1 }]}>{s?.company_name}</Text>
                    <Badge label={q.status} color={statusColor[q.status]} />
                  </View>
                  {p && <Text style={typography.muted}>{p.title}</Text>}
                  <View style={{ flexDirection: 'row', marginTop: 8, gap: 20 }}>
                    <View><Text style={typography.label}>{t('quantity')}</Text><Text style={{ fontWeight: '700' }}>{q.quantity}</Text></View>
                    {q.target_price && <View><Text style={typography.label}>{t('targetPrice')}</Text><Text style={{ fontWeight: '700' }}>{formatPrice(q.target_price)}</Text></View>}
                  </View>
                  {q.message && <Text style={[typography.body, { marginTop: 8, color: colors.textMuted }]}>« {q.message} »</Text>}
                </Card>
              );
            }}
          />}
    </Screen>
  );
}
