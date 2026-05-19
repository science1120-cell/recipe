/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#F3BE53';
const tintColorDark = '#F3BE53';

export const Colors = {
  light: {
    text: '#1D1B20',
    background: '#F6F3EE',
    tint: tintColorLight,
    icon: '#6F8FAF',
    muted: '#6B6B6B',
    card: '#EDE8E1',
    inputFill: '#E5E1DA',
    tabPill: '#E5E1DA',
    tabIconDefault: '#6F8FAF',
    tabIconSelected: '#1D1B20',
    accent: '#F3BE53',
  },
  dark: {
    text: '#F4EFE6',
    background: '#141210',
    tint: tintColorDark,
    icon: '#8FA8C4',
    muted: '#A89B8C',
    card: '#252119',
    inputFill: '#302A22',
    tabPill: '#2A241C',
    tabIconDefault: '#8FA8C4',
    tabIconSelected: '#F4EFE6',
    accent: '#F3BE53',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'AlbertSans_400Regular',
    serif: 'IMFellDWPicaSC_400Regular',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Albert Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "'IM FELL DW Pica SC', Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
