import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Dimensions, Button } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { useEffect, useState } from 'react';


import { Person, Item, State } from '@/assets/types';
import pageInit from '@/assets/init';
import Checkbox from 'expo-checkbox';

export default function ItemsScreen() {
  const { state, themeColors } = pageInit();
  const windowHeight = Dimensions.get('window').height;

  const [items, setItems] = useState<Item[]>(state.items);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [modalGST, setModalGST] = useState<boolean>(false);
  const [modalPST, setModalPST] = useState<boolean>(false);

  // Update state object when the items list changes
  useEffect(() => {
    state.items = items;
  }, [items]);

  // Set modal variables when user clicks add item button
  const openModal = (item: Item) => {
    setItemToEdit(item);
    setNewName(item.name);
    setNewPrice(item.price.toFixed(2));
    setModalGST(item.gst);
    setModalPST(item.pst);
    setModalVisible(true);
  }

  // Clear modal variables when modal is closed
  const closeModal = () => {
    setNewName('');
    setNewPrice('');
    setModalGST(false);
    setModalPST(false);
    setModalVisible(false);
  }

  // Add the item to the list or update the existing item
  const updateItem = () => {
    if (itemToEdit) {
      itemToEdit.name = newName;
      itemToEdit.price = parseFloat(newPrice);
      itemToEdit.gst = modalGST;
      itemToEdit.pst = modalPST;
      if (!items.includes(itemToEdit)) {
        setItems([...items, itemToEdit]);
      }
      closeModal();
    }
  }

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
    // <KeyboardAvoidingView
    //   behavior = {Platform.OS === 'ios'? "padding" : "height"}
    //   keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 80}
    //   style = {{flex : 1}}
    // >
    <ThemedView
      style={styles.main}
    >
      {/* Title */}
      <ThemedText style={{fontSize: 24, marginVertical: 20}}>Manage items</ThemedText>

      {/* Add item button */}
      <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-evenly'}}>
        <TouchableOpacity
          style={[styles.button, theme.button]}
          onPress={() => {
            const newItem = new Item(`New item`);
            setItemToEdit(newItem);
            setModalVisible(true);
          }}
        >
          <Text style={[theme.text, {alignSelf: 'center'}]}>Add item</Text>
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
      </View>

      {/* Display subtotal and tax amounts */}
      {items.length > 0 && <View style={[styles.subtotal]}>
        <Text style={[styles.sub, theme.text]}>{`Subtotal\n$`}{items.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</Text>
        <Text style={[styles.sub, theme.text]}>{`GST\n$`}{(items.reduce((acc, item) => acc + (item.gst ? item.price * 0.05 : 0), 0)).toFixed(2)}</Text>
        <Text style={[styles.sub, theme.text]}>{`PST\n$`}{(items.reduce((acc, item) => acc + (item.pst ? item.price * 0.10 : 0), 0)).toFixed(2)}</Text>
      </View>}

      {/* Display message or list depending on list length */}
      {items.length == 0 ? (
        <ThemedText style={[styles.text, {marginTop: 20}]}>No items added</ThemedText>
      ) : (
        <FlatList
          data={items}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.listItem, theme.border]}>
              {/* Item label and price */}
              <TouchableOpacity
                style={{flex: 7, flexDirection: 'column'}}
                onPress={() => {
                  openModal(item);
                }}
              >
                <Text style={[styles.input, theme.text]}>{item.name}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.subinput]}>{`$${item.price.toFixed(2)}`}</Text>
                  {item.gst && <Text style={[styles.subinput]}>{` + ${(item.price*0.05).toFixed(2)} (GST)`}</Text>}
                  {item.pst && <Text style={[styles.subinput]}>{` + ${(item.price*0.10).toFixed(2)} (PST)`}</Text>}
                </View>
              </TouchableOpacity>

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
      
      {/* Modal for adding an item */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={{width: '100%', height: windowHeight}}
          onPressOut={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={[styles.modal, { borderColor: themeColors.text, backgroundColor: themeColors.background}]}
            activeOpacity={1}
          >
            {/* Edit item name */}
            <Text style={[styles.modalLabel, theme.text]}>Item name</Text>
            <TextInput
              style={[styles.modalInput, {color: themeColors.text}]}
              placeholder="Enter the item's name"
              placeholderTextColor={'gray'}
              onChangeText={setNewName}
              selectTextOnFocus={true}
              value={newName}
            />

            {/* Edit item's price */}
            <Text style={[styles.text, theme.text]}>Price</Text>
            <TextInput
              style={[styles.modalInput, {color: themeColors.text}]}
              placeholder="Enter the item's price"
              placeholderTextColor={'gray'}
              onChangeText={setNewPrice}
              selectTextOnFocus={true}
              value={newPrice}
              inputMode='decimal'
            />

            {/* Checkboxes for item's GST/PST */}
            <Text style={[styles.text, theme.text]}>GST</Text>
            <Checkbox
              style={styles.modalCheckbox}
              value={modalGST}
              onValueChange={setModalGST}
            />
            <Text style={[styles.text, theme.text]}>PST</Text>
            <Checkbox
              style={styles.modalCheckbox}
              value={modalPST}
              onValueChange={setModalPST}
            />

            {/* Accept and cancel/exit buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, theme.button]}
                onPress={() => {
                  // Check the inputs, then update the item
                  console.log(`New name: ${newName}`);
                  if (newName.trim().length == 0) {
                    alert('Name must contain at least one non-whitespace character.');
                    return;
                  }
                  if (isNaN(parseFloat(newPrice)) || parseFloat(newPrice) < 0) {
                    alert('Price must be a positive number.');
                    return;
                  }
                  updateItem();
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

    </ThemedView>
    // </KeyboardAvoidingView>
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
    justifyContent: 'center',
  },
  subtotal: {
    fontSize: 16,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
  },
  sub: {
    width: '30%',
    textAlign: 'center',
  },
  list: {
    marginVertical: 20,
    paddingHorizontal: 20,
    width: '80%',
    flex: 1,
    borderRadius: 5,
  },
  listItem: {
    flexDirection: 'row',
    height: 60,
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  input: {
    flex: 7,
    fontSize: 18,
    height: 50,
  },
  subinput: {
    fontSize: 12,
    color: 'gray',
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
  },
  modalCheckbox: {
    marginLeft: 15,
    marginBottom: 10,
  },
  modalButtons: {
    alignSelf: 'center',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
});
