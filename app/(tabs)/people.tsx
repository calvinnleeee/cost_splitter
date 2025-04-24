import { StyleSheet, View, Text, FlatList, Modal, Dimensions, Alert } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Person, Item } from '@/assets/types';
import pageInit from '@/assets/init';
import DropdownSelect from 'react-native-input-select';
import { DropdownSelectHandle } from 'react-native-input-select/lib/typescript/src/types/index.types';

export default function PeopleScreen() {
  const {state, themeColors, updatePeople, updateItems} = pageInit();
  const windowHeight = Dimensions.get('window').height;

  const [modalVisible, setModalVisible] = useState(false);
  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);
  const [name, setName] = useState<string>('');
  const [itemIdx, setItemIdx] = useState<number[]>([]);
  const dropdownRef = useRef<DropdownSelectHandle | null>(null);

  // Open the modal after setting the person to edit
  const openModal = (person: Person) => {
    setPersonToEdit(person);
    setName(person.name);
    const idxs = state.items.filter((item: Item) => item.payers.includes(person));
    setItemIdx(idxs.map((item: Item) => state.items.indexOf(item)));
    setModalVisible(true);
  };

  // Close the modal and reset display values
  const closeModal = () => {
    setName('');
    setItemIdx([]);
    setModalVisible(false);
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

  const theme = StyleSheet.create({
    text: {
      color: themeColors.text,
    },
    bg: {
      backgroundColor: themeColors.background,
    },
    border: {
      borderColor: themeColors.primary,
    },
    button: {
      backgroundColor: themeColors.primary,
    }
  });


  return (
    <View style={[styles.main, theme.bg]}>

      {/* Title */}
      <Text style={[styles.title, theme.text, {marginBottom: 20}]}>Add/Remove Friends</Text>

      <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-evenly'}}>
      {/* Add friend button */}
        <TouchableOpacity
          style={[styles.button, theme.button]}
          onPress={() => {
            const friend = new Person('Friend');
            setPersonToEdit(friend);
            openModal(friend);
          }}
        >
          <Text style={[theme.text, {alignSelf: 'center'}]}>Add friend</Text>
        </TouchableOpacity>

        {/* Reset button */}
        <TouchableOpacity
          style={[styles.button, theme.button]}
          onPress={() => {updatePeople([])}}
        >
          <Text style={[theme.text, {alignSelf: 'center'}]}>Reset friends :(</Text>
        </TouchableOpacity>
      </View>

      {/* Display message or list depending on list length */}
      {state.people.length == 0 ? (
        <Text style={[styles.text, theme.text, {marginTop: 20}]}>No friends yet :'(</Text>
      ) : (
        <FlatList
          data={state.people}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.listItem, theme.border]}>
              <TouchableOpacity
                style={{flex: 7, flexDirection: 'column'}}
                onPress={() => {openModal(item)}}
              >
                <Text style={[styles.name, theme.text]}>{item.name}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.delete}
                onPress={() => {removePerson(item)}}
              >
                <Text style={{color: 'red', paddingTop: 15, textAlign: 'center'}}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => state.people.indexOf(item).toString()}
        />
      )}

      {/* Modal for adding a friend */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => closeModal()}
      >
        <TouchableOpacity
          style={{width: '100%', height: windowHeight}}
          onPressOut={() => closeModal()}
        >
          <TouchableOpacity
            style={[styles.modal, { borderColor: themeColors.text, backgroundColor: themeColors.background}]}
            activeOpacity={1}
          >
            {/* Edit person name */}
            <Text style={[styles.modalLabel, theme.text]}>Friend's name</Text>
            <TextInput
              style={[styles.modalInput, {color: themeColors.text}]}
              placeholder="Enter your friend's name"
              placeholderTextColor={'gray'}
              onChangeText={setName}
              selectTextOnFocus={true}
              defaultValue={name.trim().length != 0 ? name : ''}
            />

            {/* Dropdown for all items */}
            <Text style={[styles.modalLabel, theme.text]}>Select item(s)</Text>
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
                  height: '40%',
                },
                modalProps: {
                  onRequestClose: () => {dropdownRef.current?.close()},
                }
              }}
              ref={(ref) => {dropdownRef.current = ref}}
            />

            {/* Accept and cancel/exit buttons */}
            <View style={styles.modalButtons}>
              {/* Save friend once OAuth is done */}
              {/* <TouchableOpacity
                style={[styles.button, theme.button]}
                onPress={() => {
                  
                }}
              >
                <Text style={[theme.text, {alignSelf: 'center'}]}>Save friend</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={[styles.button, theme.button]}
                onPress={() => {
                  if (name.trim().length == 0) {
                    Alert.alert('Name must contain at least one non-whitespace character.');
                    return;
                  }
                  updatePerson();
                }}
              >
                <Text style={[theme.text, {alignSelf: 'center'}]}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, theme.button]}
                onPress={() => closeModal()}
              >
                <Text style={[theme.text, {alignSelf: 'center'}]}>Cancel</Text>
              </TouchableOpacity>

            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      
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
    fontSize: 24,
    marginVertical: 10
  },
  text: {
    fontSize: 20,
  },
  button: {
    borderRadius: 10,
    width: 100,
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
  modal: {
    width: '80%',
    height: '70%',
    alignSelf: 'center',
    marginTop: '15%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    gap: 5,
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
