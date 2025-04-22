import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Platform, Touchable, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

import ThemeContext from '@/context/ThemeContext';
import { ColorTheme, Colors } from '@/assets/themes';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {

  const colorScheme = useColorScheme();
  const { theme, toggleTheme } = useContext(ThemeContext);
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
        headerRight: () => 
          <TouchableOpacity
            onPressIn={() => {
              if (theme === ColorTheme.dark) {
                toggleTheme(ColorTheme.light);
              } else {
                toggleTheme(ColorTheme.dark);
              }
            }}
            style={{ width: 30, height: 30, padding: 0, marginRight: 20 }}
          >
          {theme === ColorTheme.dark ? (
            <IconSymbol size={28} name="sun.max.circle.fill" color={'white'} style={{zIndex: 2}}/>
          ) : (
            <IconSymbol size={28} name="moon.fill" color={'black'} style={{zIndex: 2}} />
          )}
          </TouchableOpacity>
        ,
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
