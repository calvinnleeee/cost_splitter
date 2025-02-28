import { Image, StyleSheet, View, Text, Button, FlatList } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useContext, useEffect, useState } from 'react';
import { stateContext } from '@/context/context';

import { Person, Item, State} from '@/assets/types';

export default function HomeScreen() {
  const state = useContext(stateContext);
  const [people, setPeople] = useState(state.people);

  useEffect(() => {
    state.people = people
  }, [people]);

  return (
    <View
      style={styles.main}
    >
      <ThemedText style={styles.text}>Testing index</ThemedText>
      <Button
        title="Add test user"
        onPress={() => {
          setPeople([...people, new Person(`Person ${people.length}`)]);
          // setState(state);
        }}
      />
      <Button
        title="Read length"
        onPress={() => {
          console.log(people.length);
        }}
      />
      <Button
        title="Reset length"
        onPress={() => {
          setPeople([]);
        }}
      />

      <FlatList
        data={people}
        style={{backgroundColor: 'gray'}}
        renderItem={({ item }) => (
          <ThemedText style={styles.text}>{item.name}</ThemedText>
        )}
        keyExtractor={(item) => item.name}
      />
    </View>
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
