import { Image, StyleSheet, View, Text, Button, FlatList } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useContext, useEffect, useState } from 'react';
import { stateContext } from '@/context/context';

import { Person, Item, State } from '@/assets/types';

export default function HomeScreen() {
  const state = useContext(stateContext);
  const [people, setPeople] = useState(state.people);
  const [items, setItems] = useState(state.items);
  

  return (
    <ThemedView
      style={styles.main}
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
