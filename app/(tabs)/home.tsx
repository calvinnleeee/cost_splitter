import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, Dimensions, TextInput, Alert, Share } from 'react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Item, Person } from '@/assets/types';
import { ThemedText } from '@/components/ThemedText';
import StateContext from '@/context/StateContext';
import getTheme from '@/assets/theme';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const { themeColors } = getTheme();
  const { items, people, updateItems, updatePeople } = useContext(StateContext);
  const windowHeight = Dimensions.get('window').height;

  const [tipPct, setTipPct] = useState(0);
  const [tipAmt, setTipAmt] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPct, setModalPct] = useState('');
  const [modalAmt, setModalAmt] = useState('');

  let total = 0;

  let subtotal = items.reduce((acc, item) => acc + item.price, 0);
  let tax = items.reduce((acc, item) => acc + item.getTax(), 0);
  total = subtotal + tax + tipAmt;

  // Calculate the tip amount based on the subtotal and tax
  useEffect(() => {
    setTipAmt((subtotal + tax) * (tipPct / 100));
  }, []);

  // Function to reset everything
  const resetAll = () => {
    updateItems([]);
    updatePeople([]);
    setTipPct(0);
  }

  // Function to share
  const onShare = async () => {
    let msg = 
      `Subtotal: $${subtotal.toFixed(2)}\n` +
      `Tax: $${tax.toFixed(2)}\n` +
      `Tip: $${tipAmt.toFixed(2)}\n` +
      `Total: $${total.toFixed(2)}\n` +
      `######################################\n`;
    people.forEach((person: Person) => {
      let owed = items.reduce((acc, item) => item.payers.includes(person) ? acc + (item.getPrice() / item.payers.length) * (1 + tipPct / 100): acc, 0);
      msg += `${person.name}: $${owed.toFixed(2)}\n`;
      msg += `-- ${items.filter((item: Item) => item.payers.includes(person)).map((item: Item) => item.name).join(", ")}\n\n`;
    });

    console.log(msg);

    try {
      const result = await Share.share({
        message: msg,
      });
      if (result.action === Share.sharedAction) {
        Alert.alert(`Successfully shared!`)
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Component displaying each person, what items they are paying for, and how much they owe
  const ListItem = useCallback(({ person }: {person: Person}) => {
    let owed = 
      items.reduce((acc, item) => item.payers.includes(person) ? acc + 
        (item.getPrice() / item.payers.length) * (1 + tipPct / 100): acc, 0
      );
    return (
      <View style={[styles.listItem, { borderBottomColor: themeColors.primary }]}>
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
          <ThemedText type='bold' style={[styles.text, { flex: 3 }]}>{person.name}</ThemedText>
          <ThemedText type='bold' style={[styles.text, { flex: 1 }]}>${owed.toFixed(2)}</ThemedText>
        </View>
        <View style={{ marginBottom: 5 }}>
          <ThemedText style={styles.subtext}>
            {items.filter((item: Item) => item.payers.includes(person)).map((item: Item) => item.name).join(', ')}
          </ThemedText>
        </View>
      </View>
    )
  }, [items, people, tipPct]);


  return (
    <View style={[styles.main, { backgroundColor: themeColors.background }]}>
      {/* Display messages if items and people aren't filled out yet, otherwise show the totals */}
      {items.length === 0 ? (
        <ThemedText style={[styles.text, { marginVertical: 40 }]}>
          You need to add some items to the bill!
        </ThemedText>
      ) : (
        <>
          {/* Subtotals, taxes, and total */}
          <View style={{width: '100%'}}>
            {/* Display set tip, reset, and save buttons */}
            <View style={styles.topContainer}>
              <TouchableOpacity
                style={[styles.button1, { backgroundColor: themeColors.primary }]}
                onPress={() => {
                  setModalPct(tipPct.toFixed(2));
                  setModalAmt(tipAmt.toFixed(2));
                  setModalVisible(true);
                }}
              >
                <ThemedText style={styles.buttonText}>Set tip</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button1, {backgroundColor: themeColors.primary}]}
                onPress={() => {onShare()}}
              >
                <ThemedText style={styles.buttonText}>Share</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button1, {backgroundColor: themeColors.primary}]}
                onPress={() => {
                  Alert.alert(
                    'Are you sure?',
                    'This will clear all items and people.',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          resetAll();
                        },
                      },
                    ],
                  );
                }}
              >
                <ThemedText style={styles.buttonText}>Reset</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Display subtotal and tax amounts */}
            <View style={styles.subtotal}>
              <View style={styles.sub}>
                <ThemedText style={styles.subText}>Subtotal</ThemedText>
                <ThemedText type='bold' style={styles.subText}>${subtotal.toFixed(2)}</ThemedText>
              </View>
              <View style={styles.sub}>
                <ThemedText style={styles.subText}>Tax</ThemedText>
                <ThemedText type='bold' style={styles.subText}>${tax.toFixed(2)}</ThemedText>
              </View>
              <View style={styles.sub}>
                <ThemedText style={styles.subText}>Tip</ThemedText>
                <ThemedText type='bold' style={styles.subText}>${tipAmt.toFixed(2)}</ThemedText>
              </View>
              <View style={styles.sub}>
                <ThemedText style={styles.subText}>Total</ThemedText>
                <ThemedText type='bold' style={styles.subText}>${total.toFixed(2)}</ThemedText>
              </View>
            </View>
          </View>
          <FlatList
            data={people}
            style={styles.list}
            renderItem={({ item }) => <ListItem person={item} />}
            ListEmptyComponent={() =>
              <Text style={[styles.text, {color: themeColors.text, alignSelf: 'center'}]}>You need some friends! :(</Text>
            }
            keyExtractor={(item) => people.indexOf(item).toString()}
          />

        </>
      )}

      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(false)}}
      >
        <View style={styles.modalBackground} />
        <TouchableOpacity
          style={{width: '100%', height: windowHeight}}
          onPressOut={() => {setModalVisible(false);}}
        >
          <TouchableOpacity
            style={[styles.modal, { borderColor: themeColors.text, backgroundColor: themeColors.background}]}
            activeOpacity={1}
          >
            {/* Edit item name */}
            <ThemedText style={styles.modalLabel}>Tip Percentage</ThemedText>
            <TextInput
              style={[styles.modalInput, {color: themeColors.text}]}
              placeholder="Percentage (%)"
              placeholderTextColor={'gray'}
              onChangeText={(pct) => {
                setModalPct(pct);
                parseFloat(pct) ? setModalAmt(((subtotal + tax) * (parseFloat(pct) / 100)).toFixed(2)) : setModalAmt('');
              }}
              selectTextOnFocus={true}
              defaultValue={modalPct.toString()}
              inputMode='numeric'
            />

            {/* Edit item's price */}
            <ThemedText style={styles.modalLabel}>Tip Amount ($)</ThemedText>
            <TextInput
              style={[styles.modalInput, {color: themeColors.text}]}
              placeholder="Amount ($)"
              placeholderTextColor={'gray'}
              onChangeText={(amt) => {
                setModalAmt(amt);
                parseFloat(amt) ? setModalPct(((parseFloat(amt) / (subtotal + tax)) * 100).toFixed(2)) : setModalPct('');
              }}
              selectTextOnFocus={true}
              defaultValue={modalAmt.toString()}
              inputMode='numeric'
            />

            {/* Accept and cancel/exit buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button2, { backgroundColor: themeColors.primary }]}
                onPress={() => {
                  setTipPct(parseFloat(modalPct));
                  setTipAmt(parseFloat(modalAmt));
                  setModalVisible(false);
                }}
              >
                <ThemedText style={{ alignSelf: 'center' }}>Confirm</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button2, { backgroundColor: themeColors.primary }]}
                onPress={() => {setModalVisible(false);}}
              >
                <ThemedText style={{ alignSelf: 'center' }}>Cancel</ThemedText>
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
  text: {
    fontSize: 16,
  },
  subtext: {
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    marginVertical: 10
  },
  button1: {
    borderRadius: 10,
    width: '28%',
    padding: 10,
    justifyContent: 'center',
  },
  button2: {
    borderRadius: 10,
    width: '35%',
    padding: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
  },
  topContainer: {
    marginVertical: '3%',
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
  },
  subtotal: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    width: '85%',
  },
  sub: {
    flexDirection: 'column',
    flex: 1,
    fontSize: 15,
  },
  subText: {
    textAlign: 'center',
  },
  list: {
    marginVertical: 20,
    paddingHorizontal: 20,
    width: '85%',
    flex: 1,
    borderRadius: 5,
  },
  listItem: {
    flexDirection: 'column',
    marginVertical: 10,
    borderBottomWidth: 1,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '120%',
    height: '120%',
    opacity: 0.65,
    backgroundColor: '#0a0a0a'
  },
  modal: {
    width: '80%',
    // height: '40%',
    alignSelf: 'center',
    marginTop: '40%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 5,
  },
  modalLabel: {
    fontSize: 16,
  },
  modalInput: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    fontSize: 16,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  modalButtons: {
    marginVertical: 10,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
});
