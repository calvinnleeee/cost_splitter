import { useCallback, useContext, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

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

  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [friendsToAdd, setFriendsToAdd] = useState<string[]>([]);
  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);
  const [name, setName] = useState<string>('');
  const [itemIdx, setItemIdx] = useState<number[]>([]);
  const dropdownRef = useRef<DropdownSelectHandle | null>(null);

  // Animated value and functions for fading in/out the background when the modal is opened or closed
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

  // Open/close modal for editing a person
  const openEdit = (person: Person) => {
    setPersonToEdit(person);
    setName(person.name);
    const idxs = items.filter((item: Item) => item.payers.includes(person));
    setItemIdx(idxs.map((item: Item) => items.indexOf(item)));
    // setModalVisible(true);
    setEditVisible(true);
    fadeIn();
  };

  const closeEdit = () => {
    setName('');
    setItemIdx([]);
    setEditVisible(false);
    fadeOut();
  };

  // Open/close modal for adding people
  const openAdd = () => {
    setAddVisible(true);
    setFriendsToAdd([...people.map((p: Person) => p.name)]);
    fadeIn();
  };

  const closeAdd = () => {
    setAddVisible(false);
    fadeOut();
  }

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
    closeEdit();
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
          onPress={() => openEdit(person)}
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
      {/* Add friends button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.primary }]}
          onPress={() => openAdd()}
        >
          <ThemedText style={{ alignSelf: 'center' }}>Add friends</ThemedText>
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

      {/* Modal for adding friends */}
      <ModalWrapper
        isVisible={addVisible}
        closeModal={() => closeAdd()}
      >
        {/* Number to add */}
        <ThemedText type='bold' style={styles.modalLabel}>Number of friends</ThemedText>
        <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'center', justifyContent: 'space-evenly', marginVertical: 10 }}>
          <TouchableOpacity
            style={{ padding: 15, backgroundColor: themeColors.primary, borderRadius: 5}}
            onPress={() => setFriendsToAdd(friendsToAdd.slice(0, -1))}
          >
            <ThemedText type='bold' style={{ fontSize: 22, textAlign: 'center' }}>{'<'}</ThemedText>
          </TouchableOpacity>
          <TextInput
            style={{ width: 40, fontSize: 20, alignSelf: 'center', textAlign: 'center', color: themeColors.text }}
            keyboardType='decimal-pad'
            selectTextOnFocus
            value={friendsToAdd.length.toString()}
            onChangeText={(value) => {
              if (value.trim().length == 0) {
                setFriendsToAdd([]);
                return;
              }
              const numFriends = parseInt(value);
              if (!isNaN(numFriends) && numFriends >= 0) {
                setFriendsToAdd(Array(numFriends).fill('Friend'));
              } else {
                setFriendsToAdd([]);
              }
            }}
          />
          <TouchableOpacity
            style={{ padding: 15, backgroundColor: themeColors.primary, borderRadius: 5}}
            onPress={() => setFriendsToAdd([...friendsToAdd, 'Friend'])}
          >
            <ThemedText type='bold' style={{ fontSize: 22, textAlign: 'center' }}>{'>'}</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={{ maxHeight: '45%', marginTop: 5, borderWidth: 1, borderColor: themeColors.primary, borderRadius: 3, paddingVertical: 5, flex: 1 }}>
          <FlatList
            data={friendsToAdd}
            style={{ width: '85%', alignSelf: 'center' }}
            contentContainerStyle={{ gap: 10, alignContent: 'flex-start', width: '100%' }}
            renderItem={({ item, index }) =>
              <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                <TextInput key={`friend_${index}`}
                  style={{ borderBottomWidth: 1, borderRadius: 1, padding: 10, fontSize: 16, flex: 1 }}
                  selectTextOnFocus
                  value={item}
                  onChangeText={(value) => {
                    const newFriends = [...friendsToAdd];
                    newFriends[index] = value;
                    setFriendsToAdd(newFriends);
                  }}
                />
                <Pressable onPress={() => {
                  const newFriends = [...friendsToAdd];
                  newFriends.splice(index, 1);
                  setFriendsToAdd(newFriends);
                }}>
                  <ThemedText type='bold' style={{ fontSize: 16, color: 'red', padding: 10 }}>
                    X
                  </ThemedText>
                </Pressable>
              </View>
            }
          />
        </View>

        {/* Accept and cancel/exit buttons */}
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeColors.primary }]}
            onPress={() => {
              // Add all friends to the list of people and close modal
              const newPeople = friendsToAdd.map((name: string) => new Person(name));
              updatePeople(newPeople);
              setFriendsToAdd([]);
              closeAdd();

            }}
          >
            <ThemedText style={{ alignSelf: 'center' }}>Confirm</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeColors.primary }]}
            onPress={() => closeAdd()}
          >
            <ThemedText style={{ alignSelf: 'center' }}>Cancel</ThemedText>
          </TouchableOpacity>

        </View>
      </ModalWrapper>

      {/* Modal for editing a friend */}
      <ModalWrapper
        isVisible={editVisible}
        closeModal={() => closeEdit()}
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
            onPress={() => closeEdit()}
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
    bottom: '25%',
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
