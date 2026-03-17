import React, { createContext, useState, useEffect, PropsWithChildren, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorTheme } from '@/assets/themes';
import { useColorScheme } from 'react-native';
import { Colors } from '@/assets/themes';

interface ThemeContextType {
  theme: ColorTheme;
  themeColors: typeof Colors['light' | 'dark'];
  toggleTheme: (newTheme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: ColorTheme.system,
  themeColors: Colors.light,
  toggleTheme: () => {}
});

export const ThemeProvider = ({children}: PropsWithChildren) => {
  const [theme, setTheme] = useState<ColorTheme>(ColorTheme.system);
  const [themeColors, setThemeColors] = useState(Colors.light);
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function getTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem('theme') as ColorTheme;
        if (savedTheme !== null) {
          setTheme(savedTheme);
        }
      } catch (_) {
        setTheme(ColorTheme.system);
      }
    }
    getTheme();
  }, []);

  useEffect(() => {
    const colors = theme === ColorTheme.system ? Colors[colorScheme ?? 'light'] : Colors[theme];
    setThemeColors(colors);
  }, [theme])

  const toggleTheme = (newTheme: ColorTheme) => {
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);