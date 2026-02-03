import getTheme from "@/assets/theme";
import { Keyboard, Modal, StyleSheet, TouchableOpacity } from "react-native"

export default function ModalWrapper({
  isVisible,
  closeModal,
  children
}: {
  isVisible: boolean,
  closeModal: () => void,
  children: React.ReactNode
}) {
  const { themeColors } = getTheme();

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {closeModal()}}
    >
      <TouchableOpacity
        style={styles.layout}
        onPressOut={() => closeModal()}
      >
        <TouchableOpacity
        style={[styles.modal, { borderColor: themeColors.text, backgroundColor: themeColors.background}]}
        activeOpacity={1}
        onPress={() => Keyboard.dismiss()}
      >
        {children}
      </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // alignItems: 'center',
  },
  modal: {
    width: '90%',
    // height: '70%',
    alignSelf: 'center',
    marginTop: '10%',
    padding: 15,
    paddingVertical: 25,
    borderRadius: 10,
    borderWidth: 2,
    gap: 5,
  },
})