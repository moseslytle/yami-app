import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";

// Create custom themes that use brand colors directly
const customThemes = {
  ...defaultConfig.themes,
  light: {
    ...defaultConfig.themes.light,
    // Add brand color theme values
    brand: '#E11D48',
    brandHover: '#DC2626', 
    brandPress: '#B91C1C',
    brandFocus: '#F97316',
    brandLight: '#F43F5E',
    brandDark: '#BE123C',
    brandSubtle: '#FEF2F2',
  },
  dark: {
    ...defaultConfig.themes.dark,
    // Custom dark theme with dark gray-black colors (not pure black)
    background: '#111111',        // Dark gray-black - subtle gray tint
    backgroundHover: '#1A1A1A',   // Slightly lighter gray-black
    backgroundPress: '#222222',   // Medium gray-black
    backgroundFocus: '#2A2A2A',   // Lighter gray for focus
    backgroundStrong: '#333333',  // Strong gray for emphasis
    backgroundTransparent: 'rgba(17, 17, 17, 0.85)',
    
    color: '#F5F5F5',            // Off-white - gentle on eyes
    colorHover: '#EEEEEE',       // Slightly darker off-white
    colorPress: '#E5E5E5',       // Press state off-white
    colorFocus: '#DDDDDD',       // Focus state
    colorTransparent: 'rgba(245, 245, 245, 0.7)',
    
    borderColor: '#333333',       // Medium gray border
    borderColorHover: '#444444',  // Lighter border on hover
    borderColorFocus: '#555555',  // Focus border
    borderColorPress: '#666666',  // Press border
    
    // Brand colors remain the same for consistency
    brand: '#E11D48',
    brandHover: '#DC2626',
    brandPress: '#B91C1C', 
    brandFocus: '#F97316',
    brandLight: '#F43F5E',
    brandDark: '#BE123C',
    brandSubtle: 'rgba(225, 29, 72, 0.1)', // Subtle brand overlay for dark theme
  },
};

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes: customThemes,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}