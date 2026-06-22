import React from 'react';
import { StoreSettings } from '@/lib/types';
import { THEME_PRESETS } from '@/lib/themePresets';

interface ThemeStyleRegistryProps {
  settings: StoreSettings;
}

export default function ThemeStyleRegistry({ settings }: ThemeStyleRegistryProps) {
  // Get active preset configuration or fallback to classic_white
  const activePresetId = settings.theme_preset || 'classic_white';
  const defaultPreset = THEME_PRESETS.find(p => p.id === activePresetId) || THEME_PRESETS[0];

  // Merge database values with default preset values
  const themeConfig = settings.theme_config || defaultPreset.config;

  const colors = themeConfig.colors || defaultPreset.config.colors;
  const fonts = themeConfig.fonts || defaultPreset.config.fonts;
  const typography = themeConfig.typography || defaultPreset.config.typography;
  const buttons = themeConfig.buttons || defaultPreset.config.buttons;
  const cards = themeConfig.cards || defaultPreset.config.cards;

  const headingFont = fonts.heading || defaultPreset.config.fonts.heading;
  const bodyFont = fonts.body || defaultPreset.config.fonts.body;

  // Build the Google Fonts url
  const fontImportUrl = headingFont === bodyFont
    ? `https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`
    : `https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=${encodeURIComponent(bodyFont)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`;

  const css = `
    @import url('${fontImportUrl}');

    :root, html, body {
      /* Base Theme System CSS Variables */
      --color-primary: ${colors.primary} !important;
      --color-secondary: ${colors.secondary} !important;
      --color-accent: ${colors.accent} !important;
      --color-background: ${colors.background} !important;
      --color-surface: ${colors.surface} !important;
      --color-text-primary: ${colors.textPrimary} !important;
      --color-text-secondary: ${colors.textSecondary} !important;
      --color-text-heading: ${colors.textHeading || colors.textPrimary || colors.primary} !important;
      --color-text-accent: ${colors.textAccent || colors.accent} !important;
      --color-price: ${colors.price || colors.accent || '#e94560'} !important;
      --color-border: ${colors.border} !important;

      --font-heading: "${headingFont}", sans-serif !important;
      --font-body: "${bodyFont}", sans-serif !important;
      --font-size-base: ${typography.fontSizeBase || 16}px !important;

      --border-radius-btn: ${buttons.borderRadius ?? 12}px !important;
      --border-radius-card: ${cards.borderRadius ?? 16}px !important;

      --btn-primary-bg: ${buttons.primaryBg || colors.primary} !important;
      --btn-primary-text: ${buttons.primaryText || '#ffffff'} !important;
      --btn-primary-hover: ${buttons.primaryHover || colors.secondary} !important;

      /* Map system variables to active theme variables for compatibility */
      --primary: ${colors.primary} !important;
      --primary-hover: ${buttons.primaryHover} !important;
      --secondary: ${colors.secondary} !important;
      --accent: ${colors.accent} !important;
      --surface: ${colors.surface} !important;
      --text: ${colors.textPrimary} !important;
      --text-muted: ${colors.textSecondary} !important;
      --border: ${colors.border} !important;
      --radius-btn: ${buttons.borderRadius ?? 12}px !important;
      --radius-card: ${cards.borderRadius ?? 16}px !important;
      --radius-modal: ${cards.borderRadius ?? 16}px !important;
    }

    /* Apply base font size & body text styles */
    html {
      font-size: ${typography.fontSizeBase || 16}px !important;
    }

    body {
      font-family: var(--font-body) !important;
      background-color: var(--color-background) !important;
      color: var(--color-text-primary) !important;
    }

    /* Class-based page backgrounds & text overrides */
    html, body, 
    .bg-gray-50, .dark .bg-gray-50, 
    .bg-gray-50\\/50, .dark .bg-gray-50\\/50, 
    [class*="bg-gray-50"] {
      background-color: var(--color-background) !important;
      color: var(--color-text-primary) !important;
    }

    /* Surface, white backgrounds & card overrides */
    .bg-white, .dark .bg-white, 
    .bg-surface, .bg-surface-2, .bg-surface-3, 
    [class*="bg-surface"] {
      background-color: var(--color-surface) !important;
      color: var(--color-text-primary) !important;
    }

    /* Remap hardcoded dark-theme hex colors to active theme variables */
    /* These classes appear across all components as dark mode fallbacks */
    [class*="bg-[#16162a]"],
    .dark [class*="bg-[#16162a]"] {
      background-color: var(--color-surface) !important;
    }
    [class*="bg-[#0f0f1b]"],
    .dark [class*="bg-[#0f0f1b]"] {
      background-color: var(--color-background) !important;
    }
    /* bg-white/80 opacity variants → use surface with opacity */
    [class^="bg-white/"]:not([class*="hover:"]), [class*=" bg-white/"]:not([class*="hover:"]) {
      background-color: color-mix(in srgb, var(--color-surface) 80%, transparent) !important;
    }
    /* Navbar sticky bar: bg-white/80 dark:bg-[#0f0f1b]/85 */
    [class^="bg-[#0f0f1b]/"]:not([class*="hover:"]), [class*=" bg-[#0f0f1b]/"]:not([class*="hover:"]) {
      background-color: color-mix(in srgb, var(--color-background) 85%, transparent) !important;
    }
    [class^="bg-[#16162a]/"]:not([class*="hover:"]), [class*=" bg-[#16162a]/"]:not([class*="hover:"]) {
      background-color: color-mix(in srgb, var(--color-surface) 80%, transparent) !important;
    }
    [class*="from-[#16162a]"] {
      --tw-gradient-from: var(--color-surface) !important;
    }
    [class*="from-[#0f0f1b]"] {
      --tw-gradient-from: var(--color-background) !important;
    }
    /* dark:text-white → follow theme text primary */
    .dark .text-white, [class*="dark:text-white"] {
      color: var(--color-text-primary) !important;
    }

    /* Typography Overrides */
    body, p, span, a, input, select, textarea, button, td, th, li, div, .font-body {
      font-family: var(--font-body) !important;
    }
    h1, h2, h3, h4, h5, h6, .font-heading, [class*="font-heading"] {
      font-family: var(--font-heading) !important;
      color: var(--color-text-heading) !important;
    }

    /* Elements corner-radius overrides */
    button:not(.rounded-full):not(.swatch-btn), .btn, input, select, textarea, [role="button"]:not(.rounded-full):not(.swatch-btn), 
    .rounded-xl, .rounded-lg, .rounded-2xl, .rounded-3xl, .rounded-md {
      border-radius: var(--border-radius-btn) !important;
    }

    /* Grid cards corner-radius overrides */
    .card, [class*="rounded-2xl"], [class*="rounded-3xl"], [class*="rounded-xl"] {
      border-radius: var(--border-radius-card) !important;
    }

    /* Hardcoded color codes replacements to support saved preset styles */
    
    /* Backgrounds hardcoded to secondary navy */
    .bg-\\[\\#1a1a2e\\], .dark .bg-\\[\\#1a1a2e\\], 
    [class*="bg-[#1a1a2e]"]:not([class*="bg-[#1a1a2e]/"]):not([class*="hover:"]),
    .bg-secondary, .dark .bg-secondary {
      background-color: var(--btn-primary-bg) !important;
      color: var(--btn-primary-text) !important;
    }
    
    /* Transparent / opacity classes mapped to theme colors using color-mix */
    .bg-\\[\\#1a1a2e\\]\\/5, [class^="bg-[#1a1a2e]/5"], [class*=" bg-[#1a1a2e]/5"] {
      background-color: color-mix(in srgb, var(--btn-primary-bg) 5%, transparent) !important;
    }
    .bg-\\[\\#1a1a2e\\]\\/10, [class^="bg-[#1a1a2e]/10"], [class*=" bg-[#1a1a2e]/10"] {
      background-color: color-mix(in srgb, var(--btn-primary-bg) 10%, transparent) !important;
    }
    .bg-\\[\\#e94560\\]\\/10, [class^="bg-[#e94560]/10"], [class*=" bg-[#e94560]/10"] {
      background-color: color-mix(in srgb, var(--color-accent) 10%, transparent) !important;
    }
    .bg-\\[\\#e94560\\]\\/20, [class^="bg-[#e94560]/20"], [class*=" bg-[#e94560]/20"] {
      background-color: color-mix(in srgb, var(--color-accent) 20%, transparent) !important;
    }
    
    /* Backgrounds hardcoded to hovers */
    .hover\\:bg-\\[\\#e94560\\]:hover, [class*="hover:bg-[#e94560]"]:hover,
    .hover\\:bg-\\[\\#c73652\\]:hover, [class*="hover:bg-[#c73652]"]:hover,
    .hover\\:bg-primary-hover:hover {
      background-color: var(--btn-primary-hover) !important;
    }

    /* Backgrounds hardcoded to accent red */
    .bg-\\[\\#e94560\\], .dark .bg-\\[\\#e94560\\], 
    [class*="bg-[#e94560]"]:not([class*="bg-[#e94560]/"]):not([class*="hover:"]),
    .bg-accent, .dark .bg-accent {
      background-color: var(--color-accent) !important;
      color: #ffffff !important;
    }
    
    /* Text color hardcoded overrides */
    .text-\\[\\#e94560\\], [class*="text-[#e94560]"],
    .text-accent, .dark .text-accent {
      color: var(--color-text-accent) !important;
    }
    .text-\\[\\#1a1a2e\\], [class*="text-[#1a1a2e]"],
    .text-secondary, .dark .text-secondary {
      color: var(--color-text-primary) !important;
    }

    /* Price color override */
    .product-price {
      color: var(--color-price) !important;
    }

    /* Borders hardcoded overrides */
    .border-\\[\\#e94560\\], [class*="border-[#e94560]"] {
      border-color: var(--color-accent) !important;
    }
    .border-\\[\\#1a1a2e\\], [class*="border-[#1a1a2e]"] {
      border-color: var(--btn-primary-bg) !important;
    }

    /* Standard Tailwind color scales overrides - Excluded inside dark containers and heading elements to protect readability */
    .text-gray-900:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .dark .text-gray-900:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *), 
    .text-gray-955:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .text-gray-950:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .dark .text-gray-955:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .text-gray-800:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .dark .text-gray-800:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *) {
      color: var(--color-text-primary) !important;
    }
    
    .text-gray-700:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .dark .text-gray-700:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *), 
    .text-gray-600:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .dark .text-gray-600:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *), 
    .text-gray-500:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .dark .text-gray-500:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *), 
    .text-gray-400:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .dark .text-gray-400:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(.font-heading):not([class*="font-heading"]):not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *) {
      color: var(--color-text-secondary) !important;
    }
    
    .border-gray-200:not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .dark .border-gray-200:not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *), 
    .border-gray-100:not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *),
    .dark .border-gray-100:not([class*="bg-[#1a1a2e]"] *):not(.bg-secondary *):not([class*="bg-[#e94560]"] *):not(.bg-accent *):not([class*="dark:bg-"] *):not([class*="bg-gray-9"] *):not([class*="bg-black"] *) {
      border-color: var(--color-border) !important;
    }
  `;

  return (
    <style
      id="theme-style-registry"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
