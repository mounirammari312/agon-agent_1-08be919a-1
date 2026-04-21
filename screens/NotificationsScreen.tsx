import React from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Screen, HeaderBar, Empty, Button } from '../components/ui';
import { colors, radii, shadow, spacing, typography } from '../lib/theme';
import { t } from '../lib/i18n';
import { useStore, markAllNotifsRead } from '../lib/store';

export default function NotificationsScreen() {
  const nav: any = useNavigation();
  const notifs = useStore(s => s.notifications);

  return (
    <Screen>
      <HeaderBar title={t('notifications')} onBack={() => nav.goBack()} />
      {notifs.length === 0 ? <Empty icon="notifications-outline" title={t('noNotifications')} /> : (
        <>
          <View style={{ paddingHorizontal: spacing.lg, paddingTop: 10 }}>
            <Button title="Tout marquer lu" variant="ghost" icon="checkmark-done" onPress={markAllNotifsRead} />
          </View>
          <FlashList
            data={notifs} keyExtractor={n => n.id} estimatedItemSize={80}
            contentContainerStyle={{ padding: spacing.lg }}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', padding: 12, backgroundColor: colors.surface, borderRadius: radii.lg, marginBottom: 10, gap: 12, ...shadow.card }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: item.read_at ? colors.surfaceAlt : colors.gold + '22', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={item.kind === 'order' ? 'receipt' : 'notifications'} size={18} color={item.read_at ? colors.textMuted : colors.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: colors.text }}>{item.title}</Text>
                  <Text style={typography.muted}>{item.body}</Text>
                </View>
              </View>
            )}
          />
        </>
      )}
    </Screen>
  );
}
