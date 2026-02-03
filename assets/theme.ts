import { useTheme } from '@/context/ThemeContext';
import { Colors, ColorTheme } from '@/assets/themes';
import { useColorScheme } from 'react-native';

const getTheme = () => {
  // Get theme variables
  const colorScheme = useColorScheme();
  const { theme } = useTheme();
  const themeColors = theme === ColorTheme.system ? Colors[colorScheme ?? 'light'] : Colors[theme];

  return { themeColors };
}

export default getTheme;