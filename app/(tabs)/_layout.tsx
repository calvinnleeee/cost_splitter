import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

import ThemeContext from '@/context/ThemeContext';
import { ColorTheme, Colors } from '@/assets/themes';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {

  const colorScheme = useColorScheme();
  const { theme } = useContext(ThemeContext);
  const themeColors = theme === ColorTheme.system ? Colors[colorScheme ?? 'light'] : Colors[theme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.secondary,
        headerShown: true,
        headerStyle: { backgroundColor: themeColors.primary },
        headerTintColor: themeColors.text,
        headerTitle: 'Not Splitwise',
        headerTitleAlign: 'center',
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: { backgroundColor: themeColors.primary },
        }),
        tabBarHideOnKeyboard: true,
      }}>
        <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bag.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: "People",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          tabBarItemStyle: { display: 'none' }
        }}
      />
    </Tabs>
  );
}
