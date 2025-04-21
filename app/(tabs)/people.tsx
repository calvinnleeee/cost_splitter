import { StyleSheet, View, Text, FlatList } from 'react-native';
import { TextInput, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

import { useContext, useEffect, useState } from 'react';
import { stateContext } from '@/context/StateContext';

import { Person, Item, State } from '@/assets/types';

export default function TabTwoScreen() {
  const colors = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
  const state = useContext(stateContext);
  const [people, setPeople] = useState(state.people);
  const [items, setItems] = useState(state.items);

  useEffect(() => {
    state.people = people;
  }, [people]);

  useEffect(() => {
    state.items = items;
  }, [items]);

  const theme = StyleSheet.create({
    text: {
      color: colors.text,
    },
    bg: {
      backgroundColor: colors.background,
    },
    border: {
      borderColor: colors.tint,
    },
    button: {
      backgroundColor: colors.icon,
    }
  });

  return (
    <KeyboardAvoidingView
      behavior = {Platform.OS === 'ios'? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 80}
      style = {{flex : 1}}
    >
    <ThemedView
      style={styles.main}
    >
      {/* Title */}
      <ThemedText style={[styles.text, {marginBottom: 20}]}>Add/Remove Friends lol</ThemedText>

      {/* Add friend button */}
      <TouchableOpacity
        style={[styles.button, theme.button]}
        onPress={() => {
          setPeople([...people, new Person(`Person ${people.length}`)]);
        }}
      >
        <Text style={[theme.text, {alignSelf: 'center'}]}>Add friend</Text>
      </TouchableOpacity>

      {/* Reset button */}
      <TouchableOpacity
        style={[styles.button, theme.button]}
        onPress={() => {
          setPeople([]);
        }}
      >
        <Text style={[theme.text, {alignSelf: 'center'}]}>Reset friends :(</Text>
      </TouchableOpacity>

      {/* Display message or list depending on list length */}
      {people.length == 0 ? (
        <ThemedText style={[styles.text, {marginTop: 20}]}>No friends yet :'(</ThemedText>
      ) : (
        <FlatList
          data={people}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.listItem, theme.border]}>
              {/* Replace textinput to text, make clickable for modal */}
              <TextInput
                style={[styles.input, theme.text]}
                placeholder="Enter the person's name"
                onChangeText={(text) => item.name = text}
                selectTextOnFocus={true}
                defaultValue={item.name}
              />

              <TouchableOpacity
                style={styles.delete}
                onPress={() => {
                  setPeople(people.filter((p) => p !== item));
                }}
              >
                <Text style={{color: 'red', paddingTop: 15, textAlign: 'center'}}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => people.indexOf(item).toString()}
        />
      )}
      
    </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 20,
  },
  button: {
    borderRadius: 10,
    width: 100,
    padding: 10,
  },
  list: {
    marginVertical: 20,
    paddingHorizontal: 20,
    width: '80%',
    height: 500,
    borderRadius: 5,
  },
  listItem: {
    flexDirection: 'row',
    height: 60,
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  input: {
    fontSize: 18,
    height: 50,
    width: '70%',
  },
  delete: {
    width: 50,
    height: 50,
    marginLeft: 10,
  }
});
