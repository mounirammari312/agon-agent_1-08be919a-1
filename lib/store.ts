// Zustand-like reactive store with Supabase integration + offline-safe fallback.
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  Product, Supplier, Category, CartItem, Order, Quote, Notification, Profile, Conversation, Message, Badge,
} from './types';
import { seedProducts, seedSuppliers, seedCategories, seedBadges } from './mock';

type State = {
  ready: boolean;
  session: { userId: string | null; email: string | null };
  profile: Profile | null;
  categories: Category[];
  suppliers: Supplier[];
  products: Product[];
  badges: Badge[];
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  quotes: Quote[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  notifications: Notification[];
};

const initial: State = {
  ready: false,
  session: { userId: null, email: null },
  profile: null,
  categories: seedCategories,
  suppliers: seedSuppliers,
  products: seedProducts,
  badges: seedBadges,
  cart: [],
  favorites: [],
  orders: [],
  quotes: [],
  conversations: [],
  messages: {},
  notifications: [
    { id:'n1', user_id:'me', title:'Bienvenue sur Businfo', body:'Votre compte a été créé avec succès.', kind:'system', read_at:null, created_at:new Date().toISOString() },
  ],
};

let state: State = { ...initial };
const listeners = new Set<() => void>();
function emit() { listeners.forEach(l => l()); }
function set(patch: Partial<State> | ((s: State) => Partial<State>)) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p };
  emit();
  persist();
}

const PERSIST_KEY = 'businfo:v1';
async function persist() {
  try {
    await AsyncStorage.setItem(PERSIST_KEY, JSON.stringify({
      cart: state.cart, favorites: state.favorites,
      orders: state.orders, quotes: state.quotes,
      notifications: state.notifications,
      messages: state.messages, conversations: state.conversations,
      profile: state.profile, session: state.session,
    }));
  } catch {}
}
async function hydrate() {
  try {
    const raw = await AsyncStorage.getItem(PERSIST_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      state = { ...state, ...p };
    }
  } catch {}
  set({ ready: true });
}

// Hook
export function useStore<T>(selector: (s: State) => T): T {
  const [v, setV] = React.useState<T>(() => selector(state));
  React.useEffect(() => {
    const listener = () => setV(selector(state));
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, [selector]);
  return v;
}
export function getState() { return state; }

// ---------- INIT ----------
export async function init() {
  await hydrate();

  if (isSupabaseConfigured && supabase) {
    // Load remote catalog
    try {
      const [cats, sups, prods, bdgs] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('suppliers').select('*').limit(100),
        supabase.from('products').select('*').eq('active', true).limit(500),
        supabase.from('badges').select('*'),
      ]);
      set({
        categories: (cats.data as any) ?? state.categories,
        suppliers:  (sups.data as any) ?? state.suppliers,
        products:   (prods.data as any) ?? state.products,
        badges:     (bdgs.data as any) ?? state.badges,
      });
    } catch (e) { console.warn('Supabase load failed, using seed', e); }

    // Auth listener
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        set({ session: { userId: data.session.user.id, email: data.session.user.email ?? null } });
        loadProfile();
      }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({ session: { userId: session.user.id, email: session.user.email ?? null } });
        loadProfile();
      } else {
        set({ session: { userId: null, email: null }, profile: null });
      }
    });

    // Real-time notifications
    supabase.channel('realtime:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const n = payload.new as Notification;
        if (state.session.userId && n.user_id === state.session.userId) {
          set(s => ({ notifications: [n, ...s.notifications] }));
        }
      })
      .subscribe();
  }
}

async function loadProfile() {
  if (!supabase || !state.session.userId) return;
  const { data } = await supabase.from('profiles').select('*').eq('id', state.session.userId).single();
  if (data) set({ profile: data as any });
}

// ---------- AUTH ----------
export async function signIn(email: string, password: string) {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }
  // demo auth
  set({
    session: { userId: 'demo-' + email, email },
    profile: { id: 'demo', full_name: email.split('@')[0], role: 'buyer', language: 'fr', currency: 'DZD' } as any,
  });
  return { user: { id: 'demo', email } };
}

export async function signUp(email: string, password: string, fullName: string, phone: string, role: 'buyer'|'supplier') {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, phone, role } },
    });
    if (error) throw error;
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, full_name: fullName, phone, role, language: 'fr', currency: 'DZD',
      });
    }
    return data;
  }
  set({
    session: { userId: 'demo-' + email, email },
    profile: { id: 'demo', full_name: fullName, phone, role, language: 'fr', currency: 'DZD' } as any,
  });
  return { user: { id: 'demo', email } };
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
  set({ session: { userId: null, email: null }, profile: null, cart: [], favorites: [] });
}

// ---------- CART ----------
export function addToCart(product_id: string, quantity = 1) {
  set(s => {
    const existing = s.cart.find(c => c.product_id === product_id);
    if (existing) {
      return { cart: s.cart.map(c => c.product_id === product_id ? { ...c, quantity: c.quantity + quantity } : c) };
    }
    return { cart: [...s.cart, { id: 'ci-' + Date.now(), product_id, quantity }] };
  });
}
export function updateCartQty(id: string, quantity: number) {
  set(s => ({ cart: s.cart.map(c => c.id === id ? { ...c, quantity: Math.max(1, quantity) } : c) }));
}
export function removeCart(id: string) { set(s => ({ cart: s.cart.filter(c => c.id !== id) })); }
export function clearCart() { set({ cart: [] }); }

// ---------- FAVORITES ----------
export function toggleFavorite(product_id: string) {
  set(s => ({ favorites: s.favorites.includes(product_id) ? s.favorites.filter(x => x !== product_id) : [...s.favorites, product_id] }));
}

// ---------- ORDERS ----------
export async function placeOrder(shippingAddress: string): Promise<Order | null> {
  if (state.cart.length === 0) return null;
  const items = state.cart.map(c => {
    const p = state.products.find(pp => pp.id === c.product_id)!;
    return {
      product_id: p.id,
      quantity: c.quantity,
      unit_price: p.base_price,
      line_total: p.base_price * c.quantity,
    };
  });
  const subtotal = items.reduce((a, b) => a + b.line_total, 0);
  const shipping = subtotal > 50000 ? 0 : 1500;
  const supplier_id = state.products.find(p => p.id === state.cart[0].product_id)?.supplier_id ?? 's1';
  const order: Order = {
    id: 'o-' + Date.now(),
    buyer_id: state.session.userId ?? 'me',
    supplier_id,
    status: 'pending',
    subtotal, shipping, total: subtotal + shipping,
    currency: 'DZD', items, shipping_address: shippingAddress,
    created_at: new Date().toISOString(),
  };

  if (supabase && state.session.userId) {
    const { data: ord, error } = await supabase.from('orders').insert({
      buyer_id: order.buyer_id, supplier_id: order.supplier_id, status:'pending',
      subtotal, shipping, total: order.total, currency: 'DZD', shipping_address: shippingAddress,
    }).select().single();
    if (!error && ord) {
      order.id = ord.id;
      await supabase.from('order_items').insert(items.map(i => ({ ...i, order_id: ord.id })));
    }
  }

  set(s => ({
    orders: [order, ...s.orders],
    cart: [],
    notifications: [{
      id:'n-'+Date.now(), user_id:'me',
      title:'Commande enregistrée', body:`Commande ${order.id.slice(-6).toUpperCase()} passée avec succès.`,
      kind:'order', read_at:null, created_at:new Date().toISOString(),
    }, ...s.notifications],
  }));
  return order;
}

// ---------- QUOTES ----------
export async function submitQuote(q: Omit<Quote,'id'|'status'|'created_at'>): Promise<Quote> {
  const quote: Quote = { ...q, id:'q-'+Date.now(), status:'open', created_at: new Date().toISOString() };
  if (supabase && state.session.userId) {
    const { data } = await supabase.from('quotes').insert({
      buyer_id: quote.buyer_id, supplier_id: quote.supplier_id, product_id: quote.product_id,
      quantity: quote.quantity, target_price: quote.target_price, message: quote.message, status:'open',
    }).select().single();
    if (data) quote.id = data.id;
  }
  set(s => ({ quotes: [quote, ...s.quotes] }));
  return quote;
}

// ---------- MESSAGES ----------
export async function openConversation(supplier_id: string): Promise<string> {
  const buyer_id = state.session.userId ?? 'me';
  let convo = state.conversations.find(c => c.supplier_id === supplier_id && c.buyer_id === buyer_id);
  if (!convo) {
    convo = { id: 'cv-' + Date.now(), buyer_id, supplier_id };
    if (supabase && state.session.userId) {
      const { data } = await supabase.from('conversations').upsert({ buyer_id, supplier_id }).select().single();
      if (data) convo.id = data.id;
    }
    set(s => ({ conversations: [convo!, ...s.conversations] }));
  }
  return convo.id;
}

export async function sendMessage(conversation_id: string, body: string) {
  const msg: Message = {
    id: 'm-'+Date.now(),
    conversation_id,
    sender_id: state.session.userId ?? 'me',
    body, created_at: new Date().toISOString(),
  };
  if (supabase && state.session.userId) {
    const { data } = await supabase.from('messages').insert({
      conversation_id, sender_id: msg.sender_id, body,
    }).select().single();
    if (data) msg.id = data.id;
  }
  set(s => ({
    messages: { ...s.messages, [conversation_id]: [...(s.messages[conversation_id] ?? []), msg] },
    conversations: s.conversations.map(c => c.id === conversation_id ? { ...c, last_message: body, last_message_at: msg.created_at } : c),
  }));
  // Simulated supplier auto-reply in demo mode
  if (!isSupabaseConfigured) {
    setTimeout(() => {
      const reply: Message = {
        id:'m-'+Date.now(), conversation_id, sender_id:'supplier',
        body:'Merci pour votre message ! Nous revenons vers vous rapidement.',
        created_at: new Date().toISOString(),
      };
      set(s => ({ messages: { ...s.messages, [conversation_id]: [...(s.messages[conversation_id] ?? []), reply] } }));
    }, 1400);
  }
}

export function subscribeRealtimeMessages(conversation_id: string) {
  if (!supabase) return () => {};
  const channel = supabase.channel(`messages:${conversation_id}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation_id}` }, (payload) => {
      const m = payload.new as Message;
      set(s => {
        const list = s.messages[conversation_id] ?? [];
        if (list.some(x => x.id === m.id)) return {};
        return { messages: { ...s.messages, [conversation_id]: [...list, m] } };
      });
    })
    .subscribe();
  return () => { channel.unsubscribe(); };
}

// ---------- NOTIFICATIONS ----------
export function markAllNotifsRead() {
  const now = new Date().toISOString();
  set(s => ({ notifications: s.notifications.map(n => n.read_at ? n : { ...n, read_at: now }) }));
}
