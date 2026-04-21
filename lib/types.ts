export type Currency = 'DZD'|'EUR'|'USD';

export interface Category {
  id: string; parent_id?: string | null;
  name_ar: string; name_fr: string; name_en: string;
  slug: string; icon?: string; sort_order?: number;
}
export interface Badge { id:string; code:string; name_fr:string; name_en:string; name_ar:string; icon?:string; }
export interface Supplier {
  id:string; owner_id:string; company_name:string; slug:string;
  description?:string; logo_url?:string; banner_url?:string;
  verified:boolean; rating:number; total_orders:number; city?:string; badges?:string[];
}
export interface Product {
  id:string; supplier_id:string; category_id:string;
  title:string; description:string; sku?:string;
  base_price:number; currency:Currency; min_order_qty:number; stock_qty:number;
  images:string[]; tags?:string[]; active:boolean; views:number;
}
export interface CartItem { id:string; product_id:string; quantity:number; }
export type OrderStatus = 'pending'|'confirmed'|'shipped'|'delivered'|'cancelled';
export interface Order {
  id:string; buyer_id:string; supplier_id:string; status:OrderStatus;
  subtotal:number; shipping:number; total:number; currency:Currency;
  items:{ product_id:string; quantity:number; unit_price:number; line_total:number; }[];
  shipping_address?:string; created_at:string;
}
export type QuoteStatus = 'open'|'responded'|'accepted'|'rejected'|'expired';
export interface Quote {
  id:string; buyer_id:string; supplier_id:string; product_id?:string;
  quantity:number; target_price?:number; message?:string;
  status:QuoteStatus; response_price?:number; response_note?:string; created_at:string;
}
export interface Message { id:string; conversation_id:string; sender_id:string; body:string; created_at:string; }
export interface Conversation { id:string; buyer_id:string; supplier_id:string; last_message?:string; last_message_at?:string; }
export interface Notification { id:string; user_id:string; title:string; body?:string; kind?:string; read_at?:string|null; created_at:string; }
export interface Profile { id:string; full_name:string; phone?:string; role:'buyer'|'supplier'|'admin'; avatar_url?:string; language:'ar'|'fr'|'en'; currency:Currency; city?:string; }
