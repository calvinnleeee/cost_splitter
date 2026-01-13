import { useContext } from 'react';
import StateContext from '@/context/StateContext';
import { useTheme } from '@/context/ThemeContext';
import { Colors, ColorTheme } from '@/assets/themes';
import { useColorScheme } from 'react-native';

const pageInit = () => {
  // Get the state from context, storing all the people and items
  const { state, updatePeople, updateItems } = useContext(StateContext);

  // Get theme variables
  const colorScheme = useColorScheme();
  const { theme } = useTheme();
  const themeColors = theme === ColorTheme.system ? Colors[colorScheme ?? 'light'] : Colors[theme];

  return {state, themeColors, updatePeople, updateItems};
}

export default pageInit;