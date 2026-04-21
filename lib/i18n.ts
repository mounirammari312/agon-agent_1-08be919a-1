// Full i18n — Arabic (RTL), French, English
import { I18nManager } from 'react-native';

export type Lang = 'ar' | 'fr' | 'en';

export const translations = {
  fr: {
    appName: 'Businfo',
    tagline: 'Marketplace B2B — Algérie',
    // tabs
    home: 'Accueil', catalog: 'Catalogue', orders: 'Commandes', messages: 'Messages', profile: 'Profil',
    // auth
    login: 'Connexion', signup: "S'inscrire", logout: 'Déconnexion',
    email: 'Email', password: 'Mot de passe', fullName: 'Nom complet', phone: 'Téléphone',
    continueGuest: 'Continuer en invité',
    chooseRole: 'Choisissez votre rôle', buyer: 'Acheteur', supplier: 'Fournisseur',
    // home
    featured: 'Produits vedettes', topSuppliers: 'Fournisseurs de confiance',
    categories: 'Catégories', searchPlaceholder: 'Rechercher produits, fournisseurs…',
    viewAll: 'Voir tout', verifiedSupplier: 'Fournisseur vérifié',
    // product
    addToCart: 'Ajouter au panier', buyNow: 'Acheter',
    minOrder: 'Commande min.', stock: 'Stock', sku: 'SKU',
    requestQuote: 'Demander un devis', contactSupplier: 'Contacter',
    description: 'Description', variations: 'Variantes', priceTiers: 'Tarifs en gros',
    reviews: 'Avis', relatedProducts: 'Produits similaires',
    // cart / checkout
    cart: 'Panier', checkout: 'Commander', subtotal: 'Sous-total', shipping: 'Livraison', total: 'Total',
    emptyCart: 'Votre panier est vide', quantity: 'Quantité', remove: 'Retirer',
    shippingAddress: 'Adresse de livraison', placeOrder: 'Passer la commande',
    orderPlaced: 'Commande passée avec succès',
    // orders
    myOrders: 'Mes commandes', orderNumber: 'Commande N°', orderStatus: 'Statut',
    pending: 'En attente', confirmed: 'Confirmée', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
    // quotes
    myQuotes: 'Mes devis', quoteRequest: 'Demande de devis', targetPrice: 'Prix cible', send: 'Envoyer',
    // chat
    typeMessage: 'Écrire un message…', noMessages: 'Aucun message',
    // profile
    settings: 'Paramètres', language: 'Langue', currency: 'Devise', addresses: 'Adresses', favorites: 'Favoris',
    // misc
    save: 'Enregistrer', cancel: 'Annuler', confirm: 'Confirmer', back: 'Retour', loading: 'Chargement…',
    search: 'Recherche', filter: 'Filtrer', sort: 'Trier',
    priceLowHigh: 'Prix croissant', priceHighLow: 'Prix décroissant', newest: 'Plus récents',
    supplierDashboard: 'Tableau de bord', myProducts: 'Mes produits', addProduct: 'Ajouter un produit',
    revenue: 'Revenu', ordersToday: 'Commandes du jour',
    required: 'Obligatoire', invalidPhone: 'Téléphone algérien invalide', invalidEmail: 'Email invalide',
    minChars: 'Trop court', priceMustBePositive: 'Le prix doit être positif',
    notifications: 'Notifications', noNotifications: 'Aucune notification',
    suppliers: 'Fournisseurs', supplierProfile: 'Profil fournisseur',
    products: 'Produits', allCategories: 'Toutes les catégories',
    title: 'Titre', price: 'Prix', save_changes: 'Sauvegarder',
  },
  en: {
    appName: 'Businfo', tagline: 'B2B Marketplace — Algeria',
    home:'Home', catalog:'Catalog', orders:'Orders', messages:'Messages', profile:'Profile',
    login:'Login', signup:'Sign up', logout:'Log out',
    email:'Email', password:'Password', fullName:'Full name', phone:'Phone',
    continueGuest:'Continue as guest',
    chooseRole:'Choose your role', buyer:'Buyer', supplier:'Supplier',
    featured:'Featured products', topSuppliers:'Trusted suppliers',
    categories:'Categories', searchPlaceholder:'Search products, suppliers…',
    viewAll:'View all', verifiedSupplier:'Verified supplier',
    addToCart:'Add to cart', buyNow:'Buy now',
    minOrder:'Min. order', stock:'Stock', sku:'SKU',
    requestQuote:'Request a quote', contactSupplier:'Contact',
    description:'Description', variations:'Variations', priceTiers:'Bulk pricing',
    reviews:'Reviews', relatedProducts:'Related products',
    cart:'Cart', checkout:'Checkout', subtotal:'Subtotal', shipping:'Shipping', total:'Total',
    emptyCart:'Your cart is empty', quantity:'Quantity', remove:'Remove',
    shippingAddress:'Shipping address', placeOrder:'Place order',
    orderPlaced:'Order placed successfully',
    myOrders:'My orders', orderNumber:'Order #', orderStatus:'Status',
    pending:'Pending', confirmed:'Confirmed', shipped:'Shipped', delivered:'Delivered', cancelled:'Cancelled',
    myQuotes:'My quotes', quoteRequest:'Quote request', targetPrice:'Target price', send:'Send',
    typeMessage:'Type a message…', noMessages:'No messages',
    settings:'Settings', language:'Language', currency:'Currency', addresses:'Addresses', favorites:'Favorites',
    save:'Save', cancel:'Cancel', confirm:'Confirm', back:'Back', loading:'Loading…',
    search:'Search', filter:'Filter', sort:'Sort',
    priceLowHigh:'Price low → high', priceHighLow:'Price high → low', newest:'Newest',
    supplierDashboard:'Dashboard', myProducts:'My products', addProduct:'Add product',
    revenue:'Revenue', ordersToday:"Today's orders",
    required:'Required', invalidPhone:'Invalid Algerian phone', invalidEmail:'Invalid email',
    minChars:'Too short', priceMustBePositive:'Price must be positive',
    notifications:'Notifications', noNotifications:'No notifications',
    suppliers:'Suppliers', supplierProfile:'Supplier profile',
    products:'Products', allCategories:'All categories',
    title:'Title', price:'Price', save_changes:'Save changes',
  },
  ar: {
    appName:'بيزنفو', tagline:'سوق الأعمال — الجزائر',
    home:'الرئيسية', catalog:'الكتالوج', orders:'الطلبات', messages:'الرسائل', profile:'الملف',
    login:'تسجيل الدخول', signup:'إنشاء حساب', logout:'تسجيل الخروج',
    email:'البريد الإلكتروني', password:'كلمة المرور', fullName:'الاسم الكامل', phone:'الهاتف',
    continueGuest:'الدخول كزائر',
    chooseRole:'اختر دورك', buyer:'مشتري', supplier:'مورد',
    featured:'منتجات مميزة', topSuppliers:'موردون موثوقون',
    categories:'الفئات', searchPlaceholder:'ابحث عن منتجات أو موردين…',
    viewAll:'عرض الكل', verifiedSupplier:'مورد موثق',
    addToCart:'أضف إلى السلة', buyNow:'اشترِ الآن',
    minOrder:'الحد الأدنى', stock:'المخزون', sku:'SKU',
    requestQuote:'طلب عرض سعر', contactSupplier:'تواصل',
    description:'الوصف', variations:'الأنواع', priceTiers:'أسعار الجملة',
    reviews:'التقييمات', relatedProducts:'منتجات مشابهة',
    cart:'السلة', checkout:'الدفع', subtotal:'المجموع الفرعي', shipping:'الشحن', total:'المجموع',
    emptyCart:'سلتك فارغة', quantity:'الكمية', remove:'إزالة',
    shippingAddress:'عنوان الشحن', placeOrder:'تأكيد الطلب',
    orderPlaced:'تم إرسال الطلب بنجاح',
    myOrders:'طلباتي', orderNumber:'رقم الطلب', orderStatus:'الحالة',
    pending:'قيد الانتظار', confirmed:'مؤكد', shipped:'تم الشحن', delivered:'تم التوصيل', cancelled:'ملغى',
    myQuotes:'عروضي', quoteRequest:'طلب عرض', targetPrice:'السعر المستهدف', send:'إرسال',
    typeMessage:'اكتب رسالة…', noMessages:'لا توجد رسائل',
    settings:'الإعدادات', language:'اللغة', currency:'العملة', addresses:'العناوين', favorites:'المفضلة',
    save:'حفظ', cancel:'إلغاء', confirm:'تأكيد', back:'رجوع', loading:'جار التحميل…',
    search:'بحث', filter:'تصفية', sort:'ترتيب',
    priceLowHigh:'السعر تصاعدياً', priceHighLow:'السعر تنازلياً', newest:'الأحدث',
    supplierDashboard:'لوحة التحكم', myProducts:'منتجاتي', addProduct:'إضافة منتج',
    revenue:'الإيرادات', ordersToday:'طلبات اليوم',
    required:'مطلوب', invalidPhone:'رقم هاتف غير صالح', invalidEmail:'بريد غير صالح',
    minChars:'قصير جداً', priceMustBePositive:'يجب أن يكون السعر موجباً',
    notifications:'الإشعارات', noNotifications:'لا توجد إشعارات',
    suppliers:'الموردون', supplierProfile:'ملف المورد',
    products:'المنتجات', allCategories:'جميع الفئات',
    title:'العنوان', price:'السعر', save_changes:'حفظ التغييرات',
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;

let currentLang: Lang = 'fr';
const listeners = new Set<(l: Lang) => void>();

export function getLang(): Lang { return currentLang; }
export function setLang(lang: Lang) {
  currentLang = lang;
  const shouldRTL = lang === 'ar';
  try {
    if (I18nManager.isRTL !== shouldRTL) {
      I18nManager.allowRTL(shouldRTL);
      I18nManager.forceRTL(shouldRTL);
    }
  } catch {}
  listeners.forEach((l) => l(lang));
}
export function subscribeLang(cb: (l: Lang) => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }

export function t(key: TranslationKey): string {
  const dict = (translations as any)[currentLang] ?? translations.fr;
  return (dict[key] ?? translations.fr[key] ?? key) as string;
}

export function isRTL(): boolean { return currentLang === 'ar'; }
