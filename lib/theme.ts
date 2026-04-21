// Businfo — Brand Theme
// Primary: Dark Blue #1B3A5C  | Accent: Metallic Gold #D4AF37

export const colors = {
  primary: '#1B3A5C',
  primaryDark: '#0F2540',
  primaryLight: '#2A5686',
  gold: '#D4AF37',
  goldDark: '#B89124',
  goldLight: '#E8C76A',
  bg: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F2F7',
  text: '#0E1A2B',
  textMuted: '#5B6B80',
  textLight: '#8A97AA',
  border: '#E3E7EE',
  danger: '#C0392B',
  success: '#1E8449',
  warn: '#D68910',
  overlay: 'rgba(15, 37, 64, 0.55)',
};

export const radii = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 };

export const shadow = {
  card: {
    shadowColor: '#0A1A2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  floating: {
    shadowColor: '#0A1A2F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, color: colors.text, letterSpacing: -0.4 },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, color: colors.text },
  muted: { fontSize: 13, color: colors.textMuted },
  label: { fontSize: 12, fontWeight: '600' as const, color: colors.textMuted, letterSpacing: 0.4, textTransform: 'uppercase' as const },
};
