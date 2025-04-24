import { Image, StyleSheet, View, Text, Button, FlatList, useColorScheme, TouchableOpacity, Modal, Dimensions, TextInput, Alert, Share } from 'react-native';
import pageInit from '@/assets/init';
import { useEffect, useState } from 'react';
import { Item, Person } from '@/assets/types';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const windowHeight = Dimensions.get('window').height;
  const {state, themeColors, updateItems, updatePeople} = pageInit();

  const [tipPct, setTipPct] = useState(0);
  const [tipAmt, setTipAmt] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPct, setModalPct] = useState('');
  const [modalAmt, setModalAmt] = useState('');

  let total = 0;

  let subtotal = state.items.reduce((acc, item) => acc + item.price, 0);
  let tax = state.items.reduce((acc, item) => acc + item.getTax(), 0);
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
    state.people.forEach((person: Person) => {
      let owed = state.items.reduce((acc, item) => item.payers.includes(person) ? acc + (item.getPrice() / item.payers.length) * (1 + tipPct / 100): acc, 0);
      msg += `${person.name}: $${owed.toFixed(2)}\n`;
      msg += `-- ${state.items.filter((item: Item) => item.payers.includes(person)).map((item: Item) => item.name).join(", ")}\n\n`;
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


  return (
    <View
      style={[styles.main, {backgroundColor: themeColors.background}]}
    >
      <Text style={[styles.title, {color: themeColors.text}]}>Split with Friends :)</Text>
    
      {/* Display messages if items and people aren't filled out yet, otherwise show the totals */}
      {state.items.length === 0 ? (
        <Text style={[styles.text, {color: themeColors.text, marginVertical: 20}]}>You need to add some items to the bill!</Text>
      ) : (
        <>
          {/* Subtotals, taxes, and total */}
          <View>
            {/* Display set tip, reset, and save buttons */}
            <View style={[styles.subtotal, {marginBottom: 5}]}>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: themeColors.primary}]}
                onPress={() => {
                  setModalPct(tipPct.toFixed(2));
                  setModalAmt(tipAmt.toFixed(2));
                  setModalVisible(true);
                }}
              >
                <Text style={{color: themeColors.text, alignSelf: 'center'}}>Set tip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, {backgroundColor: themeColors.primary}]}
                onPress={() => {onShare()}}
              >
                <Text style={{color: themeColors.text, alignSelf: 'center'}}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, {backgroundColor: themeColors.primary}]}
                onPress={() => {
                  Alert.alert(
                    'Are you sure?',
                    'This will reset all items and people.',
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
                <Text style={{color: themeColors.text, alignSelf: 'center'}}>Reset all</Text>
              </TouchableOpacity>
            </View>

            {/* Display subtotal and tax amounts */}
            <View style={styles.subtotal}>
              <Text style={[styles.sub, {color: themeColors.text}]}>
                {`Subtotal\n$`}{subtotal.toFixed(2)}
              </Text>
              <Text style={[styles.sub, {color: themeColors.text}]}>
                {`Tax\n$`}{tax.toFixed(2)}
              </Text>
              <Text style={[styles.sub, {color: themeColors.text}]}>
                {`Tip\n$`}{tipAmt.toFixed(2)}
              </Text>
              <Text style={[styles.sub, {color: themeColors.text}]}>
                {`Total\n$`}{total.toFixed(2)}
              </Text>
            </View>
          </View>
          <FlatList
            data={state.people}
            style={styles.list}
            renderItem={({ item }) => {
              const person = item;
              let owed = 
                state.items.reduce((acc, item) => item.payers.includes(person) ? acc + 
                  (item.getPrice() / item.payers.length) * (1 + tipPct / 100): acc, 0
                );
              return (
                <View style={[styles.listItem, {borderBottomColor: themeColors.primary}]}>
                  <View style={{flexDirection: 'row', marginBottom: 5}}>
                    <Text style={[styles.text, {flex: 3, color: themeColors.text}]}>{item.name}</Text>
                    <Text style={[styles.text, {flex: 1, color: themeColors.text}]}>${owed.toFixed(2)}</Text>
                  </View>
                  <View style={{marginVertical: 5}}>
                    <Text style={styles.subtext}>
                      {state.items.filter((item: Item) => item.payers.includes(person)).map((item: Item) => item.name).join(", ")}
                      </Text>
                  </View>
                </View>
              )
            }}
            ListEmptyComponent={() =>
              <Text style={[styles.text, {color: themeColors.text, alignSelf: 'center'}]}>You need some friends! :(</Text>
            }
            keyExtractor={(item) => state.people.indexOf(item).toString()}
          />

        </>
      )}

      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(false)}}
      >
        <TouchableOpacity
          style={{width: '100%', height: windowHeight}}
          onPressOut={() => {setModalVisible(false);}}
        >
          <TouchableOpacity
            style={[styles.modal, { borderColor: themeColors.text, backgroundColor: themeColors.background}]}
            activeOpacity={1}
          >
            {/* Edit item name */}
            <Text style={[styles.modalLabel, {color: themeColors.text}]}>Tip Percentage</Text>
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
              maxLength={6} // 6 = '100.00'
            />

            {/* Edit item's price */}
            <Text style={[styles.text, {color: themeColors.text}]}>Tip Amount ($)</Text>
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
                style={[styles.button, {backgroundColor: themeColors.primary}]}
                onPress={() => {
                  setTipPct(parseFloat(modalPct));
                  setTipAmt(parseFloat(modalAmt));
                  setModalVisible(false);
                }}
              >
                <Text style={{color: themeColors.text, alignSelf: 'center'}}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: themeColors.primary}]}
                onPress={() => {setModalVisible(false);}}
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
  text: {
    fontSize: 18,
  },
  subtext: {
    fontSize: 14,
    color: 'gray',
  },
  title: {
    fontSize: 24,
    marginVertical: 10
  },
  button: {
    borderRadius: 10,
    width: 80,
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
    flex: 1,
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
  modal: {
    width: '80%',
    height: '40%',
    alignSelf: 'center',
    marginTop: '40%',
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
  modalButtons: {
    alignSelf: 'center',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
});
