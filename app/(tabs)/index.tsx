import { Image, StyleSheet, View, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useContext } from 'react';
import { StateContext } from '@/context/context';

export default function HomeScreen() {
  const state = useContext(StateContext);
  console.log(state);

  return (
    <View
      style={styles.main}
    >
      <ThemedText style={styles.text}>Testing index</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },
  text: {

    fontSize: 20,
  }
});
