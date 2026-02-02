import { StyleSheet, View, FlatList, Dimensions, Alert, Animated } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import { useCallback, useRef, useState } from 'react';

import { Person, Item } from '@/assets/types';
import pageInit from '@/assets/init';
import DropdownSelect from 'react-native-input-select';
import { DropdownSelectHandle } from 'react-native-input-select/lib/typescript/src/types/index.types';
import { ThemedText } from '@/components/ThemedText';
import ModalWrapper from '@/components/ModalWrapper';

export default function PeopleScreen() {
  const {state, themeColors, updatePeople, updateItems} = pageInit();
  const windowHeight = Dimensions.get('window').height;

  const [modalVisible, setModalVisible] = useState(false);
  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);
  const [name, setName] = useState<string>('');
  const [itemIdx, setItemIdx] = useState<number[]>([]);
  const dropdownRef = useRef<DropdownSelectHandle | null>(null);

  const modalOpacity = useRef(new Animated.Value(0));
  const fadeIn = () => {
    Animated.timing(modalOpacity.current, {
      toValue: 0.65,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(modalOpacity.current, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Open the modal after setting the person to edit
  const openModal = (person: Person) => {
    setPersonToEdit(person);
    setName(person.name);
    const idxs = state.items.filter((item: Item) => item.payers.includes(person));
    setItemIdx(idxs.map((item: Item) => state.items.indexOf(item)));
    setModalVisible(true);
    fadeIn();
  };

  // Close the modal and reset display values
  const closeModal = () => {
    setName('');
    setItemIdx([]);
    setModalVisible(false);
    fadeOut();
  };

  // Update the person currently being edited and add them to the list of people if they aren't in there yet
  const updatePerson = () => {
    if (personToEdit) {
      personToEdit.name = name;
      state.items.forEach((item: Item, idx: number) => {
        if (itemIdx.includes(idx)) {
          if (!item.payers.includes(personToEdit)) {
            item.payers.push(personToEdit);
          }
        } else {
          item.payers = item.payers.filter((p: Person) => p !== personToEdit);
        }
      });
      if (!state.people.includes(personToEdit)) {
        updatePeople([...state.people, personToEdit]);
      } else {
        updatePeople([...state.people])
      }
    }
    closeModal();
  };

  // Remove the person from the list of people and any items they are currently paying for
  const removePerson = (person: Person) => {
    updatePeople(state.people.filter((p) => p !== person));
    const newItems = [...state.items];
    newItems.forEach((item: Item) => {
      item.payers = item.payers.filter((p: Person) => p !== person);
    });
    updateItems(newItems);
  };

  // FlatList component to render each person in the list
  const PersonDisplay = useCallback(({ person }: { person: Person }) => {
    return (
      <View style={[styles.listItem, { borderColor: themeColors.primary }]}>
        <TouchableOpacity
          style={{ flex: 7, flexDirection: 'column' }}
          onPress={() => {openModal(person)}}
        >
          <ThemedText style={styles.name}>{person.name}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.delete}
          onPress={() => {removePerson(person)}}
        >
          <ThemedText style={{ color: 'red', paddingTop: 15, textAlign: 'center' }}>X</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }, []);

  return (
    <View style={[styles.main, {  backgroundColor: themeColors.background}]}>

      {/* Title */}
      <ThemedText type='title' style={styles.title}>Add/Remove Friends</ThemedText>

      <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-evenly' }}>
      {/* Add friend button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.primary }]}
          onPress={() => {
            const friend = new Person('Friend');
            setPersonToEdit(friend);
            openModal(friend);
          }}
        >
          <ThemedText style={{ alignSelf: 'center' }}>Add friend</ThemedText>
        </TouchableOpacity>

        {/* Reset button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.primary }]}
          onPress={() => {updatePeople([])}}
        >
          <ThemedText style={{ alignSelf: 'center' }}>Reset</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Display message or list depending on list length */}
      {state.people.length == 0 ? (
        <ThemedText style={{ marginTop: 25, fontSize: 20 }}>No friends yet :'(</ThemedText>
      ) : (
        <FlatList
          data={state.people}
          style={styles.list}
          renderItem={({ item }) => (
            <PersonDisplay person={item} />
          )}
          keyExtractor={(item) => state.people.indexOf(item).toString()}
        />
      )}

      <Animated.View style={[styles.modalBackground, { height: windowHeight * 1.5, opacity: modalOpacity.current }]} pointerEvents={'none'} />

      {/* Modal for adding a friend */}
      <ModalWrapper
        isVisible={modalVisible}
        closeModal={() => closeModal()}
      >
        {/* Edit person name */}
        <ThemedText style={styles.modalLabel}>Friend's name</ThemedText>
        <TextInput
          style={[styles.modalInput, {color: themeColors.text}]}
          placeholder="Enter your friend's name"
          placeholderTextColor={'gray'}
          onChangeText={setName}
          selectTextOnFocus={true}
          defaultValue={name.trim().length != 0 ? name : ''}
        />

        {/* Dropdown for all items */}
        <ThemedText style={styles.modalLabel}>Select item(s)</ThemedText>
        <DropdownSelect
          // label="Items"
          placeholder="Select item(s)"
          isMultiple={true}
          isSearchable={false}
          options={state.items.map((item: Item, idx: number) => ({label: item.name, value: idx}))}
          selectedValue={itemIdx}
          onValueChange={(i: any) => {
            setItemIdx(i);
          }}
          modalControls={{
            modalOptionsContainerStyle: {
              height: '50%',
            },
            modalProps: {
              onRequestClose: () => {dropdownRef.current?.close()},
            }
          }}
          ref={(ref) => {dropdownRef.current = ref}}
        />

        {/* Accept and cancel/exit buttons */}
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeColors.primary }]}
            onPress={() => {
              if (name.trim().length == 0) {
                Alert.alert('Name must contain at least one non-whitespace character.');
                return;
              }
              updatePerson();
            }}
          >
            <ThemedText style={{ alignSelf: 'center' }}>Confirm</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeColors.primary }]}
            onPress={() => closeModal()}
          >
            <ThemedText style={{ alignSelf: 'center' }}>Cancel</ThemedText>
          </TouchableOpacity>

        </View>
      </ModalWrapper>
      
    </View>
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
  title: {
    marginVertical: 10,
  },
  button: {
    borderRadius: 10,
    width: 110,
    padding: 10,
    justifyContent: 'center',
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
  name: {
    fontSize: 18,
    height: 50,
    width: '70%',
    textAlignVertical: 'center',
  },
  delete: {
    flex: 1,
    width: 50,
    height: 50,
  },
  modalBackground: {
    position: 'absolute',
    top: '-25%',
    left: 0,
    width: '120%',
    height: '150%',
    backgroundColor: '#0a0a0a',
    zIndex: 3,
  },
  modalButtons: {
    alignSelf: 'center',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  modalLabel: {
    fontSize: 18,
    marginBottom: 5,
  },
  modalInput: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    fontSize: 16,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
  }
});
