import { useTheme } from '@/context/theme-context';
import { Keyboard, Modal, StyleSheet, TouchableOpacity } from 'react-native';

export default function ModalWrapper({
  isVisible,
  closeModal,
  children
}: {
  isVisible: boolean,
  closeModal: () => void,
  children: React.ReactNode
}) {
  const { themeColors } = useTheme();

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
    flexWrap: 'nowrap',
    // alignItems: 'center',
  },
  modal: {
    width: '100%',
    height: '85%',
    alignSelf: 'center',
    marginTop: '50%',
    padding: 15,
    paddingVertical: 25,
    borderRadius: 10,
    borderWidth: 2,
    gap: 5,
  },
})