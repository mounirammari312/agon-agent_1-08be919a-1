import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { Screen, HeaderBar, Empty } from '../components/ui';
import { colors, radii, shadow, spacing, typography } from '../lib/theme';
import { t } from '../lib/i18n';
import { useStore } from '../lib/store';
import { formatDistance } from 'date-fns';

export default function MessagesScreen() {
  const nav: any = useNavigation();
  const convos = useStore(s => s.conversations);
  const suppliers = useStore(s => s.suppliers);

  return (
    <Screen>
      <HeaderBar title={t('messages')} />
      {convos.length === 0
        ? <Empty icon="chatbubbles-outline" title={t('noMessages')} subtitle={t('contactSupplier')} />
        : <FlashList
            data={convos}
            keyExtractor={c => c.id}
            estimatedItemSize={80}
            contentContainerStyle={{ padding: spacing.lg }}
            renderItem={({ item: c }) => {
              const s = suppliers.find(x => x.id === c.supplier_id);
              return (
                <TouchableOpacity onPress={() => nav.navigate('Chat', { conversation_id: c.id, supplier_id: c.supplier_id })}
                  style={{ flexDirection: 'row', backgroundColor: colors.surface, padding: 12, borderRadius: radii.lg, marginBottom: 10, alignItems: 'center', gap: 12, ...shadow.card }}>
                  <Image source={{ uri: s?.logo_url }} style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.surfaceAlt }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: colors.text }} numberOfLines={1}>{s?.company_name}</Text>
                    <Text style={typography.muted} numberOfLines={1}>{c.last_message ?? '—'}</Text>
                  </View>
                  {c.last_message_at && (
                    <Text style={{ fontSize: 11, color: colors.textLight }}>
                      {formatDistance(new Date(c.last_message_at), new Date(), { addSuffix: false })}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />}
    </Screen>
  );
}
