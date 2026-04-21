import React from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen, HeaderBar, Button, Input } from '../components/ui';
import { spacing, typography, colors } from '../lib/theme';
import { t } from '../lib/i18n';
import { quoteSchema } from '../lib/validators';
import { submitQuote, useStore } from '../lib/store';

export default function QuoteFormScreen() {
  const nav: any = useNavigation();
  const route: any = useRoute();
  const product_id: string | undefined = route.params?.product_id;
  const supplier_id: string = route.params.supplier_id;
  const product = useStore(s => s.products.find(p => p.id === product_id));
  const session = useStore(s => s.session);

  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(quoteSchema) as any });
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    await submitQuote({
      buyer_id: session.userId ?? 'me',
      supplier_id,
      product_id,
      quantity: data.quantity,
      target_price: data.target_price,
      message: data.message,
    });
    setLoading(false);
    Alert.alert(t('send'), t('orderPlaced'));
    nav.navigate('Quotes');
  };

  const errMsg = (k: string) => (errors as any)[k] ? t((errors as any)[k].message) : undefined;

  return (
    <Screen>
      <HeaderBar title={t('quoteRequest')} onBack={() => nav.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          {product && (
            <View style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 12, marginBottom: 16 }}>
              <Text style={typography.label}>{t('products')}</Text>
              <Text style={{ fontWeight: '700', marginTop: 4 }}>{product.title}</Text>
            </View>
          )}
          <Controller control={control} name="quantity" defaultValue=""
            render={({ field }) => (
              <Input leftIcon="cube" placeholder={t('quantity')} keyboardType="number-pad"
                value={String(field.value ?? '')} onChangeText={field.onChange} error={errMsg('quantity')} />
            )} />
          <Controller control={control} name="target_price" defaultValue=""
            render={({ field }) => (
              <Input leftIcon="cash" placeholder={`${t('targetPrice')} (DZD)`} keyboardType="decimal-pad"
                value={String(field.value ?? '')} onChangeText={field.onChange} error={errMsg('target_price')} />
            )} />
          <Controller control={control} name="message" defaultValue=""
            render={({ field }) => (
              <Input leftIcon="chatbox" placeholder={t('typeMessage')} multiline numberOfLines={5}
                style={{ height: 110, textAlignVertical: 'top', paddingTop: 10 }}
                value={field.value as any} onChangeText={field.onChange} error={errMsg('message')} />
            )} />
          <Button title={t('send')} icon="paper-plane" onPress={handleSubmit(onSubmit)} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
