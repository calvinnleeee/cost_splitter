import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Item } from '@/assets/types';
import pageInit from '@/assets/init';

export default function ItemsScreen() {
  const { state, themeColors, updateItems, updatePeople } = pageInit();
  const windowHeight = Dimensions.get('window').height;

  const [modalVisible, setModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [modalGST, setModalGST] = useState<boolean>(false);
  const [modalPST7, setModalPST7] = useState<boolean>(false);
  const [modalPST10, setModalPST10] = useState<boolean>(false);

  // Set modal variables when user clicks add item button
  const openModal = (item: Item) => {
    setItemToEdit(item);
    setNewName(item.name);
    setNewPrice(item.price.toFixed(2));
    setModalGST(item.gst);
    setModalPST7(item.pst7);
    setModalPST10(item.pst10);
    setModalVisible(true);
  };

  // Clear modal variables when modal is closed
  const closeModal = () => {
    setNewName('');
    setNewPrice('');
    setModalGST(false);
    setModalPST7(false);
    setModalPST10(false);
    setModalVisible(false);
  };

  // Add the item to the list or update the existing item
  const updateItem = () => {
    if (itemToEdit) {
      itemToEdit.name = newName;
      itemToEdit.price = parseFloat(newPrice);
      itemToEdit.gst = modalGST;
      itemToEdit.pst7 = modalPST7;
      itemToEdit.pst10 = modalPST10;
      if (!state.items.includes(itemToEdit)) {
        updateItems([...state.items, itemToEdit]);
      } else {
        updateItems([...state.items]);
      }
      closeModal();
    }
  };

  // Remove the item from the list
  const removeItem = (item: Item) => {
    updateItems(state.items.filter((i) => i !== item));
  }


  return (
    <View
      style={[styles.main, {backgroundColor: themeColors.background}]}
    >
      {/* Title */}
      <Text style={[styles.title, {color: themeColors.text}]}>Manage items</Text>

      {/* Add item button */}
      <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-evenly'}}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: themeColors.primary}]}
          onPress={() => {
            const newItem = new Item(`New item`);
            setItemToEdit(newItem);
            setModalVisible(true);
          }}
        >
          <Text style={{color: themeColors.text, alignSelf: 'center'}}>Add item</Text>
        </TouchableOpacity>

        {/* Reset button */}
        <TouchableOpacity
          style={[styles.button, {backgroundColor: themeColors.primary}]}
          onPress={() => {updateItems([])}}
        >
          <Text style={{color: themeColors.text, alignSelf: 'center'}}>Reset items</Text>
        </TouchableOpacity>
      </View>

      {/* Display subtotal and tax amounts */}
      {state.items.length > 0 && <View style={styles.subtotal}>
        <Text style={[styles.sub, {color: themeColors.text}]}>
          {`Subtotal\n$`}{state.items.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
        </Text>
        <Text style={[styles.sub, {color: themeColors.text}]}>
          {`GST\n$`}{(state.items.reduce((acc, item) => acc + (item.gst ? item.price * 0.05 : 0), 0)).toFixed(2)}
        </Text>
        <Text style={[styles.sub, {color: themeColors.text}]}>
          {`PST\n$`}{(state.items.reduce((acc, item) => acc + (item.pst7 ? item.price * 0.07 : 0) + (item.pst10 ? item.price * 0.10 : 0), 0)).toFixed(2)}
        </Text>
      </View>}

      {/* Display message or list depending on list length */}
      {state.items.length == 0 ? (
        <Text style={[styles.text, {color: themeColors.text, marginTop: 20}]}>No items added</Text>
      ) : (
        <FlatList
          data={state.items}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.listItem, {borderColor: themeColors.primary}]}>
              {/* Item name and price */}
              <TouchableOpacity
                style={{flex: 7, flexDirection: 'column'}}
                onPress={() => {openModal(item)}}
              >
                <Text style={[styles.input, {color: themeColors.text}]}>{item.name}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.subinput}>{`$${item.price.toFixed(2)}`}</Text>
                  {item.gst && <Text style={styles.subinput}>{` + ${(item.getGST()).toFixed(2)} (GST)`}</Text>}
                  {(item.pst7 || item.pst10) && <Text style={styles.subinput}>{` + ${(item.getPST()).toFixed(2)} (PST)`}</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.delete}
                onPress={() => {
                  removeItem(item);
                }}
              >
                <Text style={{color: 'red', paddingTop: 15, textAlign: 'center'}}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => state.items.indexOf(item).toString()}
        />
      )}
      
      {/* Modal for adding an item */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {closeModal()}}
      >
        <TouchableOpacity
          style={{width: '100%', height: windowHeight}}
          onPressOut={() => closeModal()}
        >
          <TouchableOpacity
            style={[styles.modal, { borderColor: themeColors.text, backgroundColor: themeColors.background}]}
            activeOpacity={1}
          >
            {/* Edit item name */}
            <Text style={[styles.modalLabel, {color: themeColors.text}]}>Item name</Text>
            <TextInput
              style={[styles.modalInput, {color: themeColors.text}]}
              placeholder="Enter the item's name"
              placeholderTextColor={'gray'}
              onChangeText={setNewName}
              selectTextOnFocus={true}
              value={newName}
            />

            {/* Edit item's price */}
            <Text style={[styles.modalLabel, {color: themeColors.text}]}>Price</Text>
            <TextInput
              style={[styles.modalInput, {color: themeColors.text}]}
              placeholder="Enter the item's price"
              placeholderTextColor={'gray'}
              onChangeText={setNewPrice}
              selectTextOnFocus={true}
              value={newPrice}
              inputMode='numeric'
            />

            {/* Checkboxes for item's GST/PST */}
            {itemToEdit &&
            <View style={styles.modalCheckboxView}>
              <View style={styles.checkboxContainer}>
                <Text style={{color: themeColors.text, fontSize: 16}}>{`GST\n(5%)`}</Text>
                <Checkbox
                  style={styles.modalCheckbox}
                  value={modalGST}
                  onValueChange={setModalGST}
                />
              </View>
              <View style={styles.checkboxContainer}>
                <Text style={{color: themeColors.text, fontSize: 16}}>{`PST\n(7%)`}</Text>
                <Checkbox
                  style={styles.modalCheckbox}
                  value={modalPST7}
                  onValueChange={setModalPST7}
                />
              </View>
              <View style={styles.checkboxContainer}>
                <Text style={{color: themeColors.text, fontSize: 16}}>{`PST\n(10%)`}</Text>
                <Checkbox
                  style={styles.modalCheckbox}
                  value={modalPST10}
                  onValueChange={setModalPST10}
                />
              </View>
            </View>}

            {/* Accept and cancel/exit buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: themeColors.primary}]}
                onPress={() => {
                  // Check the inputs, then update the item
                  if (newName.trim().length == 0) {
                    Alert.alert('Name must contain at least one non-whitespace character.');
                    return;
                  }
                  if (isNaN(parseFloat(newPrice)) || parseFloat(newPrice) < 0) {
                    Alert.alert('Price must be a positive number.');
                    return;
                  }
                  updateItem();
                }}
              >
                <Text style={{color: themeColors.text, alignSelf: 'center'}}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: themeColors.primary}]}
                onPress={() => closeModal()}
              >
                <Text style={{color: themeColors.text, alignSelf: 'center'}}>Cancel</Text>
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
    fontSize: 20,
    marginVertical: 5,
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
  modalCheckboxView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 25,
  },
  checkboxContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  modalCheckbox: {
    marginTop: 10,
    width: 25,
    height: 25,
  },
  modalButtons: {
    alignSelf: 'center',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 20,
  },
});
