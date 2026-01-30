import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, Dimensions, Alert, Animated } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useCallback, useRef, useState } from 'react';
import { Item } from '@/assets/types';
import pageInit from '@/assets/init';
import { ThemedText } from '@/components/ThemedText';
import ModalWrapper from '@/components/ModalWrapper';

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

  // Set modal variables when user clicks add item button
  const openModal = (item: Item) => {
    setItemToEdit(item);
    setNewName(item.name);
    setNewPrice(item.price.toFixed(2));
    setModalGST(item.gst);
    setModalPST7(item.pst7);
    setModalPST10(item.pst10);
    setModalVisible(true);
    fadeIn();
  };

  // Clear modal variables when modal is closed
  const closeModal = () => {
    setNewName('');
    setNewPrice('');
    setModalGST(false);
    setModalPST7(false);
    setModalPST10(false);
    setModalVisible(false);
    fadeOut();
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

  const ItemDisplay = useCallback((item: Item) => (
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
  ), [])


  return (
    <View style={[styles.main, { backgroundColor: themeColors.background }]}>
      {/* Title */}
      <ThemedText type='title' style={styles.title}>Manage items</ThemedText>

      <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-evenly' }}>
        {/* Add item button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.primary }]}
          onPress={() => {
            const newItem = new Item(`New item`);
            openModal(newItem);
          }}
        >
          <ThemedText style={{ textAlign: 'center' }}>Add item</ThemedText>
        </TouchableOpacity>

        {/* Reset button */}
        <TouchableOpacity
          style={[styles.button, {backgroundColor: themeColors.primary}]}
          onPress={() => {updateItems([])}}
        >
          <ThemedText style={{ textAlign: 'center' }}>Reset items</ThemedText>
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
        <ThemedText style={{ marginTop: 25, fontSize: 20 }}>No items added</ThemedText>
      ) : (
        <FlatList
          data={state.items}
          style={styles.list}
          renderItem={({ item }) => ItemDisplay(item)}
          keyExtractor={(item) => state.items.indexOf(item).toString()}
        />
      )}

      <Animated.View style={[styles.modalBackground, { height: windowHeight * 1.5, opacity: modalOpacity.current }]} pointerEvents={'none'} />

      {/* Modal for adding an item */}
      <ModalWrapper
        isVisible={modalVisible}
        closeModal={() => {closeModal()}}
      >
        {/* Edit item name */}
        <ThemedText style={styles.modalLabel}>Item name</ThemedText>
        <TextInput
          style={[styles.modalInput, {color: themeColors.text}]}
          placeholder="Enter the item's name"
          placeholderTextColor={themeColors.placeholderText}
          onChangeText={setNewName}
          selectTextOnFocus={true}
          value={newName}
        />

        {/* Edit item's price */}
        <ThemedText style={styles.modalLabel}>Price</ThemedText>
        <TextInput
          style={[styles.modalInput, {color: themeColors.text}]}
          placeholder="Enter the item's price"
          placeholderTextColor={themeColors.placeholderText}
          onChangeText={setNewPrice}
          selectTextOnFocus={true}
          value={newPrice}
          inputMode='numeric'
        />

        {/* Checkboxes for item's GST/PST */}
        {itemToEdit &&
        <View style={styles.modalCheckboxView}>
          <View style={styles.checkboxContainer}>
            <ThemedText type='bold' style={{ fontSize: 16 }}>GST</ThemedText>
            <ThemedText style={{ fontSize: 16 }}>{`(5%)`}</ThemedText>
            <Checkbox
              style={styles.modalCheckbox}
              value={modalGST}
              onValueChange={setModalGST}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <ThemedText type='bold' style={{ fontSize: 16 }}>PST</ThemedText>
            <ThemedText style={{ fontSize: 16 }}>{`(7%)`}</ThemedText>
            <Checkbox
              style={styles.modalCheckbox}
              value={modalPST7}
              onValueChange={setModalPST7}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <ThemedText type='bold' style={{ fontSize: 16 }}>PST</ThemedText>
            <ThemedText style={{ fontSize: 16 }}>{`(10%)`}</ThemedText>
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
            <ThemedText style={{ textAlign: 'center' }}>Confirm</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: themeColors.primary}]}
            onPress={() => closeModal()}
          >
            <ThemedText style={{ textAlign: 'center' }}>Cancel</ThemedText>
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
    marginVertical: 10
  },
  button: {
    borderRadius: 10,
    width: 110,
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
  modalBackground: {
    position: 'absolute',
    top: -50,
    left: 0,
    width: '120%',
    height: '140%',
    backgroundColor: '#0a0a0a',
    zIndex: 3,
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
