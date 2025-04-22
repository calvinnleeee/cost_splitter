import { StyleSheet, View, Text, FlatList, Modal, Dimensions } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Person, Item } from '@/assets/types';
import pageInit from '@/assets/init';
import DropdownSelect from 'react-native-input-select';
import { DropdownSelectHandle } from 'react-native-input-select/lib/typescript/src/types/index.types';

export default function TabTwoScreen() {
  const {state, themeColors} = pageInit();
  const windowHeight = Dimensions.get('window').height;

  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);
  const [people, setPeople] = useState(state.people);
  // const [items, setItems] = useState(state.items);

  const [name, setName] = useState<string>('');
  const [itemIdx, setItemIdx] = useState<number[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const dropdownRef = useRef<DropdownSelectHandle | null>(null);

  // Update state objects when the corresponding list changes
  useEffect(() => {
    state.people = people;
  }, [people]);

  // Save the state using async storage when a change is made,
  // so it can persist after app restarts.
  useEffect(() => {
    AsyncStorage.setItem('state', JSON.stringify(state))
  }, [state]);

  const openModal = (person: Person) => {
    setPersonToEdit(person);
    setName(person.name);
    const idxs = state.items.filter((item: Item) => item.payers.includes(person));
    setItemIdx(idxs.map((item: Item) => state.items.indexOf(item)));
    setModalVisible(true);
  };

  const closeModal = () => {
    setName('');
    setItemIdx([]);
    setModalVisible(false);
  };

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
      if (!people.includes(personToEdit)) {
        setPeople([...people, personToEdit]);
      }
    }
    closeModal();
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
          onPress={() => {
            setPeople([]);
          }}
        >
          <Text style={[theme.text, {alignSelf: 'center'}]}>Reset friends :(</Text>
        </TouchableOpacity>
      </View>

      {/* Display message or list depending on list length */}
      {people.length == 0 ? (
        <Text style={[styles.text, theme.text, {marginTop: 20}]}>No friends yet :'(</Text>
      ) : (
        <FlatList
          data={people}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.listItem, theme.border]}>
              <TouchableOpacity
                style={{flex: 7, flexDirection: 'column'}}
                onPress={() => {
                  openModal(item);
                }}
              >
                <Text style={[styles.name, theme.text]}>{item.name}</Text>
                {/* <View style={{flexDirection: 'row'}}>
                  
                </View> */}
              </TouchableOpacity>

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
      
                  {/* Edit item's price */}
                  {/* <Text style={[styles.text, theme.text]}>Price</Text>
                  <TextInput
                    style={[styles.modalInput, {color: themeColors.text}]}
                    placeholder="Enter the item's price"
                    placeholderTextColor={'gray'}
                    onChangeText={setNewPrice}
                    selectTextOnFocus={true}
                    value={newPrice}
                    inputMode='decimal'
                  /> */}
      
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
                          alert('Name must contain at least one non-whitespace character.');
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
