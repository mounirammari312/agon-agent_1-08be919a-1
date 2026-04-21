import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors } from './lib/theme';
import { t, subscribeLang } from './lib/i18n';
import { init, useStore } from './lib/store';

import HomeScreen from './screens/HomeScreen';
import CatalogScreen from './screens/CatalogScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import OrdersScreen from './screens/OrdersScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthScreen from './screens/AuthScreen';
import SuppliersScreen from './screens/SuppliersScreen';
import SupplierScreen from './screens/SupplierScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import QuotesScreen from './screens/QuotesScreen';
import QuoteFormScreen from './screens/QuoteFormScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SupplierDashboardScreen from './screens/SupplierDashboardScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.primary, card: colors.surface, border: colors.border, text: colors.text },
};

function TabsNavigator() {
  const cartCount = useStore(s => s.cart.reduce((a, c) => a + c.quantity, 0));
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.primary, borderTopWidth: 0, height: 64, paddingBottom: 10, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, size, focused }) => {
          const map: Record<string, any> = {
            HomeTab: focused ? 'home' : 'home-outline',
            CatalogTab: focused ? 'grid' : 'grid-outline',
            CartTab: focused ? 'cart' : 'cart-outline',
            OrdersTab: focused ? 'receipt' : 'receipt-outline',
            MessagesTab: focused ? 'chatbubbles' : 'chatbubbles-outline',
            ProfileTab: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: t('home') }} />
      <Tabs.Screen name="CatalogTab" component={CatalogScreen} options={{ tabBarLabel: t('catalog') }} />
      <Tabs.Screen name="CartTab" component={CartScreen}
        options={{ tabBarLabel: t('cart'), tabBarBadge: cartCount > 0 ? cartCount : undefined, tabBarBadgeStyle: { backgroundColor: colors.gold, color: colors.primaryDark, fontWeight: '800' } }} />
      <Tabs.Screen name="OrdersTab" component={OrdersScreen} options={{ tabBarLabel: t('orders') }} />
      <Tabs.Screen name="MessagesTab" component={MessagesScreen} options={{ tabBarLabel: t('messages') }} />
      <Tabs.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: t('profile') }} />
    </Tabs.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });
  const [, force] = React.useReducer(x => x + 1, 0);
  const ready = useStore(s => s.ready);
  const session = useStore(s => s.session);
  const [showAuth, setShowAuth] = React.useState(false);
  const [checkedAuth, setCheckedAuth] = React.useState(false);

  React.useEffect(() => { init(); }, []);
  React.useEffect(() => subscribeLang(force), []);
  React.useEffect(() => {
    if (ready && !checkedAuth) { setCheckedAuth(true); if (!session.userId) setShowAuth(true); }
  }, [ready, session.userId, checkedAuth]);

  if (!fontsLoaded || !ready) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor: colors.primary }}>
        <Ionicons name="briefcase" size={64} color={colors.gold} />
        <Text style={{ color: colors.gold, fontWeight: '800', fontSize: 22, marginTop: 12, letterSpacing: 2 }}>BUSINFO</Text>
        <ActivityIndicator color={colors.gold} style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (showAuth) return (
    <SafeAreaProvider><GestureHandlerRootView style={{ flex: 1 }}>
      <AuthScreen onDone={() => setShowAuth(false)} />
      <StatusBar style="light" />
    </GestureHandlerRootView></SafeAreaProvider>
  );

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabsNavigator} />
            <Stack.Screen name="Product" component={ProductScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Suppliers" component={SuppliersScreen} />
            <Stack.Screen name="Supplier" component={SupplierScreen} />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Quotes" component={QuotesScreen} />
            <Stack.Screen name="QuoteForm" component={QuoteFormScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="SupplierDashboard" component={SupplierDashboardScreen} />
            <Stack.Screen name="Catalog" component={CatalogScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
