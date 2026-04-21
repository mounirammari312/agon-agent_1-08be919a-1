// Supabase client — ready for live backend.
// Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in env to enable.
import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(url && anon);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anon, {
      auth: {
        storage: AsyncStorage as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Image compression + upload helper for Supabase Storage
import * as ImageManipulator from 'expo-image-manipulator';

export async function compressImage(uri: string, maxWidth = 1280, quality = 0.7) {
  const r = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth } }],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
  );
  return r.uri;
}

export async function uploadProductImage(localUri: string, path: string): Promise<string | null> {
  if (!supabase) return null;
  const compressed = await compressImage(localUri);
  const resp = await fetch(compressed);
  const blob = await resp.blob();
  const { error } = await supabase.storage.from('product-images').upload(path, blob, {
    cacheControl: '3600',
    upsert: true,
    contentType: 'image/jpeg',
  });
  if (error) { console.warn('upload error', error); return null; }
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}
