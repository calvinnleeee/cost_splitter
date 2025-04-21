import { Image, StyleSheet, View, Text, Button, FlatList, useColorScheme } from 'react-native';
import pageInit from '@/assets/init';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useContext, useEffect, useState } from 'react';
import StateContext from '@/context/StateContext';
import ThemeContext from '@/context/ThemeContext';

import { Person, Item, State } from '@/assets/types';
import { ColorTheme, Colors } from '@/assets/themes';

export default function HomeScreen() {
  const {state, themeColors} = pageInit(); // Get the state and theme colors from the init function

  return (
    <ThemedView
      style={[styles.main, {backgroundColor: themeColors.background}]}
    >
    
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 2,
  },
  text: {
    fontSize: 20,
  }
});
