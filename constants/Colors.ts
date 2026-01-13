/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#335b66ff';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#18181b',
    background: '#e2e8f0',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#e2e8f0',
    background: '#3f3f46',
    tint: tintColorDark,
    icon: '#e2e8f0',
    tabIconDefault: '#e2e8f0',
    tabIconSelected: tintColorDark,
  },
};
