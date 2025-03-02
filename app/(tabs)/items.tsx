import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Checkbox from 'expo-checkbox'

import { useContext, useEffect, useState } from 'react';
import { stateContext } from '@/context/context';

import { Person, Item, State } from '@/assets/types';

export default function ItemsScreen() {
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
      <ThemedText style={[styles.text, {marginBottom: 20}]}>Manage items</ThemedText>

      {/* Add friend button */}
      <TouchableOpacity
        style={[styles.button, theme.button]}
        onPress={() => {
          setItems([...items, new Item(`Item ${items.length}`)])
        }}
      >
        <Text style={[theme.text, {alignSelf: 'center'}]}>Add items</Text>
      </TouchableOpacity>

      {/* Reset button */}
      <TouchableOpacity
        style={[styles.button, theme.button]}
        onPress={() => {
          setItems([]);
        }}
      >
        <Text style={[theme.text, {alignSelf: 'center'}]}>Reset items</Text>
      </TouchableOpacity>

      {/* Display message or list depending on list length */}
      {items.length == 0 ? (
        <ThemedText style={[styles.text, {marginTop: 20}]}>No items added</ThemedText>
      ) : (
        <FlatList
          data={items}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.listItem, theme.border]}>
              {/* Replace textinput to text, make clickable for modal */}
              <TextInput
                style={[styles.input, theme.text]}
                placeholder="Enter the item's name"
                onChangeText={(text) => item.name = text}
                selectTextOnFocus={true}
                defaultValue={item.name}
              />

              <TouchableOpacity
                style={styles.delete}
                onPress={() => {
                  setItems(items.filter((i) => i !== item));
                }}
              >
                <Text style={{color: 'red', paddingTop: 15, textAlign: 'center'}}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => items.indexOf(item).toString()}
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
    width: '70%',
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
  tax: {

  },
  delete: {
    width: 50,
    height: 50,
    marginLeft: 10,
  }
});
