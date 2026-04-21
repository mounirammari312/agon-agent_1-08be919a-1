// Seed catalog — used as fallback when Supabase env vars are not set.
import { Category, Product, Supplier, Badge } from './types';

export const seedCategories: Category[] = [
  { id: 'c1', name_fr:'Électronique', name_en:'Electronics', name_ar:'إلكترونيات', slug:'electronics', icon:'phone-portrait' },
  { id: 'c2', name_fr:'Textile & Mode', name_en:'Textile & Fashion', name_ar:'نسيج وموضة', slug:'textile', icon:'shirt' },
  { id: 'c3', name_fr:'Agroalimentaire', name_en:'Food & Beverage', name_ar:'أغذية ومشروبات', slug:'food', icon:'fast-food' },
  { id: 'c4', name_fr:'Bâtiment', name_en:'Construction', name_ar:'مواد بناء', slug:'construction', icon:'construct' },
  { id: 'c5', name_fr:'Mobilier', name_en:'Furniture', name_ar:'أثاث', slug:'furniture', icon:'bed' },
  { id: 'c6', name_fr:'Machines', name_en:'Machinery', name_ar:'آلات', slug:'machinery', icon:'cog' },
  { id: 'c7', name_fr:'Chimie', name_en:'Chemicals', name_ar:'مواد كيمائية', slug:'chemicals', icon:'flask' },
  { id: 'c8', name_fr:'Automobile', name_en:'Automotive', name_ar:'سيارات', slug:'auto', icon:'car-sport' },
];

export const seedBadges: Badge[] = [
  { id:'b1', code:'verified', name_fr:'Vérifié', name_en:'Verified', name_ar:'موثق', icon:'shield-checkmark' },
  { id:'b2', code:'gold', name_fr:'Gold Supplier', name_en:'Gold Supplier', name_ar:'مورد ذهبي', icon:'medal' },
  { id:'b3', code:'fast', name_fr:'Livraison rapide', name_en:'Fast Shipping', name_ar:'شحن سريع', icon:'rocket' },
];

const img = (q: string, s = 800) => `https://images.unsplash.com/photo-${q}?auto=format&fit=crop&w=${s}&q=80`;

export const seedSuppliers: Supplier[] = [
  { id:'s1', owner_id:'u1', company_name:'Atlas Electronics DZ', slug:'atlas-electronics', verified:true, rating:4.8, total_orders:1240, city:'Alger',
    description:'Importateur officiel, 12 ans d’expérience.',
    logo_url: img('1560179707-f14e90ef3623'), banner_url: img('1517336714731-489689fd1ca8'),
    badges:['verified','gold','fast'] },
  { id:'s2', owner_id:'u2', company_name:'Sahara Textile', slug:'sahara-textile', verified:true, rating:4.6, total_orders:812, city:'Oran',
    description:'Fabricant textile premium — coton égyptien.',
    logo_url: img('1558769132-cb1aea458c5e'), banner_url: img('1558769132-cb1aea458c5e'),
    badges:['verified','gold'] },
  { id:'s3', owner_id:'u3', company_name:'Kabylie AgroFoods', slug:'kabylie-agro', verified:true, rating:4.9, total_orders:2050, city:'Tizi Ouzou',
    description:'Huile d’olive, miel, dattes — production locale.',
    logo_url: img('1506368249639-73a05d6f6488'), banner_url: img('1498837167922-ddd27525d352'),
    badges:['verified','fast'] },
  { id:'s4', owner_id:'u4', company_name:'BTP Constantine', slug:'btp-constantine', verified:false, rating:4.3, total_orders:320, city:'Constantine',
    description:'Matériaux de construction.',
    logo_url: img('1504307651254-35680f356dfd'), banner_url: img('1541888946425-d81bb19240f5'),
    badges:['fast'] },
  { id:'s5', owner_id:'u5', company_name:'Meuble Royal', slug:'meuble-royal', verified:true, rating:4.7, total_orders:560, city:'Blida',
    description:'Mobilier haut de gamme, sur mesure.',
    logo_url: img('1555041469-a586c61ea9bc'), banner_url: img('1586023492125-27b2c045efd7'),
    badges:['verified','gold'] },
];

export const seedProducts: Product[] = [
  { id:'p1', supplier_id:'s1', category_id:'c1', title:'Smartphone Pro 256GB', description:'Smartphone professionnel 6.7", double SIM, garantie 2 ans.', base_price:58000, currency:'DZD', min_order_qty:5, stock_qty:320,
    images:[img('1511707171634-5f897ff02aa9'), img('1512941937669-90a1b58e7e9c'), img('1598327105666-5b89351aff97')],
    tags:['mobile','electronics'], sku:'SPH-PRO-256', active:true, views:1450 },
  { id:'p2', supplier_id:'s1', category_id:'c1', title:'Tablette Business 11"', description:'Tablette 11" 128GB avec stylet.', base_price:42000, currency:'DZD', min_order_qty:3, stock_qty:150,
    images:[img('1561154464-82e9adf32764'), img('1527443224154-c4a3942d3acf')],
    tags:['tablet'], sku:'TAB-B11', active:true, views:820 },
  { id:'p3', supplier_id:'s2', category_id:'c2', title:'Chemise coton premium (pack 50)', description:'Pack grossiste 50 pièces, tailles assorties.', base_price:95000, currency:'DZD', min_order_qty:1, stock_qty:60,
    images:[img('1602810318383-e386cc2a3ccf'), img('1521572163474-6864f9cf17ab')],
    tags:['shirt','cotton'], sku:'CHM-CTN-50', active:true, views:540 },
  { id:'p4', supplier_id:'s3', category_id:'c3', title:'Huile d’olive extra vierge 5L', description:'Huile première pression à froid, origine Kabylie.', base_price:4800, currency:'DZD', min_order_qty:10, stock_qty:900,
    images:[img('1474979266404-7eaacbcd87c5'), img('1604908176997-125f25cc6f3d')],
    tags:['oil','organic'], sku:'OIL-EV-5L', active:true, views:3100 },
  { id:'p5', supplier_id:'s3', category_id:'c3', title:'Dattes Deglet Nour 5kg', description:'Dattes sélection premium, calibrées.', base_price:3200, currency:'DZD', min_order_qty:20, stock_qty:1200,
    images:[img('1593904308074-e1a3f1f0a673'), img('1601493700631-2b16ec4b4716')],
    tags:['dates'], sku:'DAT-DN-5K', active:true, views:2200 },
  { id:'p6', supplier_id:'s4', category_id:'c4', title:'Ciment Portland 50kg (palette)', description:'Palette 40 sacs — livraison toute wilaya.', base_price:21000, currency:'DZD', min_order_qty:1, stock_qty:45,
    images:[img('1503387762-592deb58ef4e'), img('1541888946425-d81bb19240f5')],
    tags:['cement'], sku:'CMT-50-P', active:true, views:700 },
  { id:'p7', supplier_id:'s5', category_id:'c5', title:'Bureau exécutif chene massif', description:'Bureau 1.80m, finition vernis, livraison montée.', base_price:78000, currency:'DZD', min_order_qty:1, stock_qty:22,
    images:[img('1555041469-a586c61ea9bc'), img('1549497538-303791108f95')],
    tags:['desk','wood'], sku:'DSK-EX-180', active:true, views:410 },
  { id:'p8', supplier_id:'s5', category_id:'c5', title:'Chaise ergonomique (lot 10)', description:'Sièges de bureau ergonomiques — lot de 10.', base_price:58000, currency:'DZD', min_order_qty:1, stock_qty:18,
    images:[img('1580480055273-228ff5388ef8'), img('1592078615290-033ee584e267')],
    tags:['chair'], sku:'CHR-ERG-10', active:true, views:390 },
  { id:'p9', supplier_id:'s1', category_id:'c1', title:'Casque sans fil pro (x20)', description:'Audio Bluetooth 5.3, pack 20 unités.', base_price:68000, currency:'DZD', min_order_qty:1, stock_qty:80,
    images:[img('1583394838336-acd977736f90'), img('1505740420928-5e560c06d30e')],
    tags:['audio'], sku:'HDP-PRO-20', active:true, views:260 },
  { id:'p10', supplier_id:'s2', category_id:'c2', title:'Jean denim (pack 30)', description:'Denim indigo, coupe droite.', base_price:84000, currency:'DZD', min_order_qty:1, stock_qty:42,
    images:[img('1542272604-787c3835535d'), img('1548883354-94bcfe321cbb')],
    tags:['jeans'], sku:'JN-IN-30', active:true, views:310 },
  { id:'p11', supplier_id:'s3', category_id:'c3', title:'Miel de montagne 1kg', description:'Miel pur cueilli en Kabylie.', base_price:2600, currency:'DZD', min_order_qty:24, stock_qty:500,
    images:[img('1558642452-9d2a7deb7f62'), img('1587049352846-4a222e784d38')],
    tags:['honey'], sku:'HNY-MT-1K', active:true, views:980 },
  { id:'p12', supplier_id:'s4', category_id:'c4', title:'Brique creuse B12 (palette)', description:'Brique 8 trous, 200 pièces.', base_price:18000, currency:'DZD', min_order_qty:1, stock_qty:120,
    images:[img('1541888946425-d81bb19240f5'), img('1503387762-592deb58ef4e')],
    tags:['brick'], sku:'BRK-B12', active:true, views:220 },
];
