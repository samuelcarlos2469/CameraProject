// theme.ts
export const theme = {
  colors: {
    primary: '#FF9500',
    secondary: '#0077B5',
    background: '#F3F4F6',
    text: '#1F2937',
    lightText: '#FFFFFF',
    overlayDark: 'rgba(0,0,0,0.85)',
    overlayLight: 'rgba(255,255,255,0.9)',
    error: '#FF3B30',
    success: '#34C759',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 999,
  },
  fontSizes: {
    body: 16,
    title: 20,
    subtitle: 18,
  },
  lineHeights: {
    body: 24,
    title: 28,
  },
  shadows: {
    sm: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    md: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
  },
} as const;