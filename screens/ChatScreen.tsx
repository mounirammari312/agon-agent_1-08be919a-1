import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen, HeaderBar } from '../components/ui';
import { colors, radii, spacing } from '../lib/theme';
import { t } from '../lib/i18n';
import { useStore, sendMessage, subscribeRealtimeMessages } from '../lib/store';

export default function ChatScreen() {
  const nav: any = useNavigation();
  const route: any = useRoute();
  const conversation_id: string = route.params.conversation_id;
  const supplier_id: string = route.params.supplier_id;
  const suppliers = useStore(s => s.suppliers);
  const supplier = suppliers.find(s => s.id === supplier_id);
  const messages = useStore(s => s.messages[conversation_id] ?? []);
  const session = useStore(s => s.session);
  const meId = session.userId ?? 'me';
  const [txt, setTxt] = React.useState('');
  const listRef = React.useRef<FlatList>(null);

  React.useEffect(() => {
    const unsub = subscribeRealtimeMessages(conversation_id);
    return () => unsub();
  }, [conversation_id]);

  React.useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages.length]);

  const onSend = () => {
    if (!txt.trim()) return;
    sendMessage(conversation_id, txt.trim());
    setTxt('');
  };

  return (
    <Screen>
      <HeaderBar title={supplier?.company_name ?? 'Chat'} onBack={() => nav.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={80}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={{ padding: spacing.lg, gap: 8 }}
          renderItem={({ item }) => {
            const mine = item.sender_id === meId;
            return (
              <View style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <View style={{
                  backgroundColor: mine ? colors.primary : colors.surface,
                  paddingHorizontal: 14, paddingVertical: 10,
                  borderRadius: radii.lg,
                  borderBottomRightRadius: mine ? 4 : radii.lg,
                  borderBottomLeftRadius: mine ? radii.lg : 4,
                  borderWidth: mine ? 0 : 1, borderColor: colors.border,
                }}>
                  <Text style={{ color: mine ? '#fff' : colors.text, fontSize: 14 }}>{item.body}</Text>
                </View>
              </View>
            );
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, gap: 8 }}>
          <TextInput value={txt} onChangeText={setTxt} placeholder={t('typeMessage')} placeholderTextColor={colors.textLight}
            style={{ flex: 1, height: 44, paddingHorizontal: 14, borderRadius: 22, backgroundColor: colors.bg, color: colors.text, borderWidth: 1, borderColor: colors.border }} />
          <TouchableOpacity onPress={onSend} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="send" size={18} color={colors.gold} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
