import { useCallback, useContext, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { Item, Person } from '@/assets/types';
import ModalWrapper from '@/components/modal-wrapper';
import { ThemedText } from '@/components/themed-text';
import StateContext from '@/context/state-context';
import { useTheme } from '@/context/theme-context';
import DropdownSelect from 'react-native-input-select';
import { DropdownSelectHandle } from 'react-native-input-select/lib/typescript/src/types/index.types';

export default function PeopleScreen() {
  const { themeColors } = useTheme();
  const { items, people, updatePeople, updateItems } = useContext(StateContext);
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
    const idxs = items.filter((item: Item) => item.payers.includes(person));
    setItemIdx(idxs.map((item: Item) => items.indexOf(item)));
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
      items.forEach((item: Item, idx: number) => {
        if (itemIdx.includes(idx)) {
          if (!item.payers.includes(personToEdit)) {
            item.payers.push(personToEdit);
          }
        } else {
          item.payers = item.payers.filter((p: Person) => p !== personToEdit);
        }
      });
      updateItems([...items]);
      if (!people.includes(personToEdit)) {
        updatePeople([...people, personToEdit]);
      }
    }
    closeModal();
  };

  // Remove the person from the list of people and any items they are currently paying for
  const removePerson = useCallback((person: Person) => {
    updatePeople(people.filter((p) => !Object.is(p, person)));
    const newItems = [...items];
    newItems.forEach((item: Item) => {
      item.payers = item.payers.filter((p: Person) => !Object.is(p, person));
    });
    updateItems(newItems);
  }, [people]);

  // FlatList component to render each person in the list
  const PersonDisplay = useCallback(({ person }: { person: Person }) => {
    return (
      <View style={[styles.listItem, { borderColor: themeColors.primary }]}>
        <TouchableOpacity
          style={{ flex: 7, flexDirection: 'column' }}
          onPress={() => openModal(person)}
        >
          <ThemedText style={styles.name}>{person.name}</ThemedText>
          <View style={{ flexDirection: 'row' }}>
            <ThemedText numberOfLines={1} style={{ fontSize: 12 }}>
              {items.filter(i => i.payers.includes(person)).map(i => i.name).join(', ')}
            </ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.delete}
          onPress={() => removePerson(person)}
        >
          <ThemedText type='bold' style={{ color: 'red', paddingTop: 15, textAlign: 'center' }}>X</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }, [people, items]);

  return (
    <View style={[styles.main, {  backgroundColor: themeColors.background}]}>

      {/* Title */}
      <ThemedText type='title' style={styles.title}>Add/Remove Friends</ThemedText>

      <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-evenly' }}>
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
      {people.length == 0 ? (
        <ThemedText style={{ marginTop: 25, fontSize: 20 }}>No friends yet :'(</ThemedText>
      ) : (
        <FlatList
          data={people}
          style={styles.list}
          renderItem={({ item }) => <PersonDisplay person={item} />}
          keyExtractor={(item) => people.indexOf(item).toString()}
        />
      )}

      <Animated.View style={[styles.modalBackground, { height: windowHeight * 1.5, opacity: modalOpacity.current }]} pointerEvents={'none'} />

      {/* Modal for adding a friend */}
      <ModalWrapper
        isVisible={modalVisible}
        closeModal={() => closeModal()}
      >
        {/* Edit person name */}
        <ThemedText type='bold' style={styles.modalLabel}>Friend's name</ThemedText>
        <TextInput
          style={[styles.modalInput, {color: themeColors.text}]}
          placeholder="Enter your friend's name"
          placeholderTextColor={'gray'}
          onChangeText={setName}
          selectTextOnFocus={true}
          defaultValue={name.trim().length != 0 ? name : ''}
        />

        {/* Dropdown for all items */}
        <ThemedText type='bold' style={styles.modalLabel}>Select item(s)</ThemedText>
        <DropdownSelect
          // label="Items"
          placeholder="Select item(s)"
          isMultiple={true}
          isSearchable={false}
          options={items.map((item: Item, idx: number) => ({label: item.name, value: idx}))}
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
          multipleSelectedItemStyle={{ fontSize: 14 }}
          dropdownIconStyle={{ top: '50%', right: '5%' }}
          dropdownStyle={{ height: 75 }}
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
    width: '35%',
    paddingVertical: 15,
    padding: 10,
    justifyContent: 'center',

  },
  list: {
    marginVertical: 20,
    paddingHorizontal: 20,
    width: '85%',
    flex: 1,
    borderRadius: 5,
  },
  listItem: {
    flexDirection: 'row',
    height: 65,
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 18,
    height: 50,
    flex: 7,
    // textAlignVertical: 'center',
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
    position: 'absolute',
    bottom: '30%',
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  modalLabel: {
    marginLeft: '5%',
    fontSize: 18,
    marginBottom: 5,
  },
  modalInput: {
    width: '85%',
    height: 40,
    alignSelf: 'center',
    fontSize: 16,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
  }
});
