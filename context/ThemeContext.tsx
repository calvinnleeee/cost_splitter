import React, { createContext, useState, useEffect, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorTheme } from '@/assets/themes';

interface ThemeContextType {
  theme: ColorTheme;
  toggleTheme: (newTheme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({theme: ColorTheme.system, toggleTheme: () => {}});

export const ThemeProvider = ({children}: PropsWithChildren) => {
  const [theme, setTheme] = useState<ColorTheme>(ColorTheme.system);

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

  const toggleTheme = (newTheme: ColorTheme) => {
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;