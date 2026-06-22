import { ThemeConfig } from './types';

export interface ThemePreset {
  id: string;
  name: string;
  feel: string;
  config: ThemeConfig;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'classic_white',
    name: 'Classic White',
    feel: 'Luxury minimal like Zara',
    config: {
      colors: {
        primary: '#000000',
        secondary: '#444444',
        accent: '#C8A97E',
        background: '#FFFFFF',
        surface: '#F9F9F9',
        textPrimary: '#111111',
        textSecondary: '#666666',
        border: '#EEEEEE',
        textHeading: '#000000',
        textAccent: '#C8A97E',
        price: '#C8A97E',
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Inter',
      },
      typography: {
        fontSizeBase: 16,
      },
      buttons: {
        borderRadius: 0,
        primaryBg: '#000000',
        primaryText: '#FFFFFF',
        primaryHover: '#333333',
      },
      cards: {
        borderRadius: 0,
      },
    },
  },
  {
    id: 'rose_blush',
    name: 'Rose Blush',
    feel: 'Feminine fashion like Shein',
    config: {
      colors: {
        primary: '#C2185B',
        secondary: '#880E4F',
        accent: '#FF80AB',
        background: '#FFF8F9',
        surface: '#FFFFFF',
        textPrimary: '#2D3748',
        textSecondary: '#718096',
        border: '#FED7E2',
        textHeading: '#880E4F',
        textAccent: '#C2185B',
        price: '#C2185B',
      },
      fonts: {
        heading: 'Cormorant Garamond',
        body: 'Lato',
      },
      typography: {
        fontSizeBase: 16,
      },
      buttons: {
        borderRadius: 16,
        primaryBg: '#C2185B',
        primaryText: '#FFFFFF',
        primaryHover: '#880E4F',
      },
      cards: {
        borderRadius: 20,
      },
    },
  },
  {
    id: 'midnight_dark',
    name: 'Midnight Dark',
    feel: 'Premium dark mode like Farfetch dark',
    config: {
      colors: {
        primary: '#BB86FC',
        secondary: '#03DAC6',
        accent: '#CF6679',
        background: '#121212',
        surface: '#1E1E1E',
        textPrimary: '#FFFFFF',
        textSecondary: '#A0A0A0',
        border: '#2C2C2C',
        textHeading: '#BB86FC',
        textAccent: '#CF6679',
        price: '#CF6679',
      },
      fonts: {
        heading: 'Montserrat',
        body: 'Roboto',
      },
      typography: {
        fontSizeBase: 15,
      },
      buttons: {
        borderRadius: 12,
        primaryBg: '#BB86FC',
        primaryText: '#121212',
        primaryHover: '#985EFF',
      },
      cards: {
        borderRadius: 16,
      },
    },
  },
  {
    id: 'ocean_blue',
    name: 'Ocean Blue',
    feel: 'Clean corporate like ASOS',
    config: {
      colors: {
        primary: '#1565C0',
        secondary: '#0D47A1',
        accent: '#42A5F5',
        background: '#F0F7FF',
        surface: '#FFFFFF',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        border: '#E2E8F0',
        textHeading: '#0D47A1',
        textAccent: '#1565C0',
        price: '#1565C0',
      },
      fonts: {
        heading: 'Raleway',
        body: 'Open Sans',
      },
      typography: {
        fontSizeBase: 16,
      },
      buttons: {
        borderRadius: 8,
        primaryBg: '#1565C0',
        primaryText: '#FFFFFF',
        primaryHover: '#0D47A1',
      },
      cards: {
        borderRadius: 12,
      },
    },
  },
  {
    id: 'forest_green',
    name: 'Forest Green',
    feel: 'Organic natural like Allbirds',
    config: {
      colors: {
        primary: '#2E7D32',
        secondary: '#1B5E20',
        accent: '#81C784',
        background: '#F1F8E9',
        surface: '#FFFFFF',
        textPrimary: '#1C2E1D',
        textSecondary: '#556B56',
        border: '#E8F5E9',
        textHeading: '#1B5E20',
        textAccent: '#2E7D32',
        price: '#2E7D32',
      },
      fonts: {
        heading: 'Josefin Sans',
        body: 'Nunito',
      },
      typography: {
        fontSizeBase: 16,
      },
      buttons: {
        borderRadius: 9999, // Pill
        primaryBg: '#2E7D32',
        primaryText: '#FFFFFF',
        primaryHover: '#1B5E20',
      },
      cards: {
        borderRadius: 24,
      },
    },
  },
  {
    id: 'warm_sand',
    name: 'Warm Sand',
    feel: 'Earthy artisan like Anthropologie',
    config: {
      colors: {
        primary: '#8D6E63',
        secondary: '#5D4037',
        accent: '#D7CCC8',
        background: '#FFF8F5',
        surface: '#FEFEFE',
        textPrimary: '#3E2723',
        textSecondary: '#795548',
        border: '#EFEBE9',
        textHeading: '#3E2723',
        textAccent: '#8D6E63',
        price: '#8D6E63',
      },
      fonts: {
        heading: 'Libre Baskerville',
        body: 'Source Sans Pro',
      },
      typography: {
        fontSizeBase: 16,
      },
      buttons: {
        borderRadius: 6,
        primaryBg: '#8D6E63',
        primaryText: '#FFFFFF',
        primaryHover: '#5D4037',
      },
      cards: {
        borderRadius: 8,
      },
    },
  },
  {
    id: 'bold_red',
    name: 'Bold Red',
    feel: 'Bold energetic like H&M sale',
    config: {
      colors: {
        primary: '#D32F2F',
        secondary: '#B71C1C',
        accent: '#FF5252',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        textPrimary: '#111111',
        textSecondary: '#4A4A4A',
        border: '#E0E0E0',
        textHeading: '#B71C1C',
        textAccent: '#D32F2F',
        price: '#D32F2F',
      },
      fonts: {
        heading: 'Anton',
        body: 'Roboto',
      },
      typography: {
        fontSizeBase: 16,
      },
      buttons: {
        borderRadius: 0,
        primaryBg: '#D32F2F',
        primaryText: '#FFFFFF',
        primaryHover: '#B71C1C',
      },
      cards: {
        borderRadius: 4,
      },
    },
  },
  {
    id: 'lavender_dream',
    name: 'Lavender Dream',
    feel: 'Soft luxury like Glossier',
    config: {
      colors: {
        primary: '#7B1FA2',
        secondary: '#4A148C',
        accent: '#CE93D8',
        background: '#FAF5FF',
        surface: '#FFFFFF',
        textPrimary: '#2D1F35',
        textSecondary: '#6C5874',
        border: '#E8DFEE',
        textHeading: '#4A148C',
        textAccent: '#7B1FA2',
        price: '#7B1FA2',
      },
      fonts: {
        heading: 'Quicksand',
        body: 'Poppins',
      },
      typography: {
        fontSizeBase: 16,
      },
      buttons: {
        borderRadius: 9999, // Pill
        primaryBg: '#7B1FA2',
        primaryText: '#FFFFFF',
        primaryHover: '#4A148C',
      },
      cards: {
        borderRadius: 20,
      },
    },
  },
  {
    id: 'golden_luxury',
    name: 'Golden Luxury',
    feel: 'Premium luxury like Versace',
    config: {
      colors: {
        primary: '#F57F17',
        secondary: '#E65100',
        accent: '#FFD54F',
        background: '#FFFDF0',
        surface: '#FFFFFF',
        textPrimary: '#212121',
        textSecondary: '#616161',
        border: '#FFF9C4',
        textHeading: '#E65100',
        textAccent: '#F57F17',
        price: '#F57F17',
      },
      fonts: {
        heading: 'Cinzel',
        body: 'Didact Gothic',
      },
      typography: {
        fontSizeBase: 16,
      },
      buttons: {
        borderRadius: 0,
        primaryBg: '#F57F17',
        primaryText: '#FFFFFF',
        primaryHover: '#E65100',
      },
      cards: {
        borderRadius: 0,
      },
    },
  },
  {
    id: 'pure_minimal',
    name: 'Pure Minimal',
    feel: 'Ultra clean minimal like COS',
    config: {
      colors: {
        primary: '#212121',
        secondary: '#616161',
        accent: '#BDBDBD',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        textPrimary: '#111111',
        textSecondary: '#757575',
        border: '#E0E0E0',
        textHeading: '#212121',
        textAccent: '#616161',
        price: '#212121',
      },
      fonts: {
        heading: 'DM Sans',
        body: 'DM Sans',
      },
      typography: {
        fontSizeBase: 15,
      },
      buttons: {
        borderRadius: 0,
        primaryBg: '#212121',
        primaryText: '#FFFFFF',
        primaryHover: '#424242',
      },
      cards: {
        borderRadius: 0,
      },
    },
  },
  {
    id: 'candy_pop_kids',
    name: '🍭 Candy Pop (Kids)',
    feel: 'Playful cute toy store styling',
    config: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        background: '#FFFCEB',
        surface: '#FFFFFF',
        textPrimary: '#2D3748',
        textSecondary: '#4A5568',
        border: '#FCE7C4',
        textHeading: '#FF6B6B',
        textAccent: '#FF6B6B',
        price: '#FF6B6B',
      },
      fonts: {
        heading: 'Fredoka',
        body: 'Quicksand',
      },
      typography: {
        fontSizeBase: 16,
      },
      buttons: {
        borderRadius: 9999, // Pill
        primaryBg: '#FF6B6B',
        primaryText: '#FFFFFF',
        primaryHover: '#E65353',
      },
      cards: {
        borderRadius: 24,
      },
    },
  },
  {
    id: 'baby_pastel_kids',
    name: '🍼 Baby Pastel (Kids)',
    feel: 'Soft kids collection styling',
    config: {
      colors: {
        primary: '#B39DDB',
        secondary: '#90CAF9',
        accent: '#F48FB1',
        background: '#F3F8FB',
        surface: '#FFFFFF',
        textPrimary: '#4A3B63',
        textSecondary: '#5A6B83',
        border: '#E1EBF5',
        textHeading: '#B39DDB',
        textAccent: '#B39DDB',
        price: '#B39DDB',
      },
      fonts: {
        heading: 'Baloo 2',
        body: 'Comic Neue',
      },
      typography: {
        fontSizeBase: 16,
      },
      buttons: {
        borderRadius: 9999, // Pill
        primaryBg: '#B39DDB',
        primaryText: '#FFFFFF',
        primaryHover: '#9575CD',
      },
      cards: {
        borderRadius: 28,
      },
    },
  },
];

export const GOOGLE_FONTS = [
  'Inter',
  'Lato',
  'Roboto',
  'Open Sans',
  'Nunito',
  'Poppins',
  'DM Sans',
  'Playfair Display',
  'Cormorant Garamond',
  'Montserrat',
  'Raleway',
  'Josefin Sans',
  'Libre Baskerville',
  'Anton',
  'Quicksand',
  'Cinzel',
  'Didact Gothic',
  'Source Sans Pro',
  'Fredoka',
  'Comic Neue',
  'Baloo 2',
  'Patrick Hand',
  'Sniglet'
];
