export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceMuted: string;
  surfaceAlt: string;
  border: string;
  borderLight: string;
  divider: string;

  text: string;
  textFaint: string;
  textFainter: string;
  textFaintest: string;

  green: string;
  greenBg: string;
  greenDark: string;

  amber: string;
  amberBg: string;

  red: string;
  redBg: string;

  coordMuted: string;
  coordBg: string;
  coordBorder: string;
  coordInactive: string;

  driverMuted: string;
  driverBg: string;
  driverBorder: string;
  driverInactive: string;
}

export const lightColors: ThemeColors = {
  bg: '#F4F1EC',
  surface: '#FFFFFF',
  surfaceMuted: '#FAF9F6',
  surfaceAlt: '#F5F3EE',
  border: '#ECE9E3',
  borderLight: '#F0EEE9',
  divider: '#F2F0EB',

  text: '#1C1C1E',
  textFaint: 'rgba(28,28,30,0.5)',
  textFainter: 'rgba(28,28,30,0.45)',
  textFaintest: 'rgba(28,28,30,0.4)',

  green: '#2E7D32',
  greenBg: '#EAF4EA',
  greenDark: '#3F6B32',

  amber: '#B4780C',
  amberBg: '#FDF3E3',

  red: '#C0392B',
  redBg: '#FBE9E7',

  coordMuted: '#8C8A85',
  coordBg: '#FAF9F6',
  coordBorder: '#ECE9E3',
  coordInactive: '#7B8794',

  driverMuted: '#8C8A85',
  driverBg: '#FAF9F6',
  driverBorder: '#ECE9E3',
  driverInactive: '#7B8794',
};

export const darkColors: ThemeColors = {
  bg: '#121212',
  surface: '#1C1C1E',
  surfaceMuted: '#232325',
  surfaceAlt: '#28282A',
  border: '#333335',
  borderLight: '#2A2A2C',
  divider: '#2A2A2C',

  text: '#F2F2F0',
  textFaint: 'rgba(242,242,240,0.62)',
  textFainter: 'rgba(242,242,240,0.5)',
  textFaintest: 'rgba(242,242,240,0.42)',

  green: '#4CAF50',
  greenBg: 'rgba(76,175,80,0.16)',
  greenDark: '#66BB6A',

  amber: '#E0A030',
  amberBg: 'rgba(224,160,48,0.16)',

  red: '#E57373',
  redBg: 'rgba(229,115,115,0.16)',

  coordMuted: '#A3A19C',
  coordBg: '#1C1C1E',
  coordBorder: '#2E2E30',
  coordInactive: '#8A8A8D',

  driverMuted: '#A3A19C',
  driverBg: '#1C1C1E',
  driverBorder: '#2E2E30',
  driverInactive: '#8A8A8D',
};

// Default export kept for any not-yet-migrated call sites; prefer useTheme() for reactive theming.
export const colors = lightColors;

export const stockMeta: Record<string, { label: string; bgKey: keyof ThemeColors; colorKey: keyof ThemeColors }> = {
  season: { label: 'In Season', bgKey: 'greenBg', colorKey: 'green' },
  limited: { label: 'Limited Stock', bgKey: 'amberBg', colorKey: 'amber' },
  low: { label: 'Low Stock', bgKey: 'redBg', colorKey: 'red' },
};

export const qcStatusMeta: Record<string, { label: string; bgKey: keyof ThemeColors; colorKey: keyof ThemeColors }> = {
  pending: { label: 'Pending', bgKey: 'coordBg', colorKey: 'coordMuted' },
  passed: { label: 'Passed', bgKey: 'greenBg', colorKey: 'green' },
  rejected: { label: 'Rejected', bgKey: 'redBg', colorKey: 'red' },
};

export const deliveryStatusMeta: Record<string, { label: string; bgKey: keyof ThemeColors; colorKey: keyof ThemeColors }> = {
  pending: { label: 'Pending', bgKey: 'driverBg', colorKey: 'driverMuted' },
  assigned: { label: 'Assigned', bgKey: 'amberBg', colorKey: 'amber' },
  picked_up: { label: 'Picked Up', bgKey: 'amberBg', colorKey: 'amber' },
  in_transit: { label: 'In Transit', bgKey: 'amberBg', colorKey: 'amber' },
  delivered: { label: 'Delivered', bgKey: 'greenBg', colorKey: 'green' },
  failed: { label: 'Failed', bgKey: 'redBg', colorKey: 'red' },
};

export const radii = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Extra bottom padding so scrollable content clears the floating tab bar.
export const TAB_BAR_CLEARANCE = 110;

export const fontFamily = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semiBold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extraBold: 'Manrope_800ExtraBold',
};
