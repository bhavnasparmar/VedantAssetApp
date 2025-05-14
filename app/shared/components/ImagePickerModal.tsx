// ImagePickerModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary, } from 'react-native-image-picker';
import IonIcon from 'react-native-vector-icons/Ionicons';
//import DocumentPicker from 'react-native-document-picker';
import Wrapper from '../../ui/wrapper';
import { borderRadius, colors, fontSize, responsiveWidth } from '../../styles/variables';
import { AppearanceContext } from '../../context/appearanceContext';

interface ImagePickerModalProps {
  isVideo: boolean;
  visible: boolean;
  onClose: () => void;
  onPickImage: (response: any) => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({ visible, onClose, onPickImage, isVideo }) => {
  const { colors }: any = React.useContext(AppearanceContext);
  const openCamera = () => {
    launchCamera(
      { mediaType: isVideo ? 'video' : 'photo', saveToPhotos: true },
      (response) => {
        onPickImage(response);
        onClose();
      }
    );
  };

  const openGallery = async () => {

    if (Platform.OS === 'ios') {
      launchImageLibrary(
        { mediaType: 'photo' },
        (response) => {
          onPickImage(response);
          onClose();
        }
      );
    } else {
      // const result = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.allFiles],
      //   allowMultiSelection: false,
      //   copyTo: 'cachesDirectory',// This will allow selection of all types of files
      // });
      onPickImage(null);
      onClose();
    }


  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose} onBackButtonPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={[styles.title, { color: colors.black }]}>Select an option</Text>
        <Wrapper row justify="apart" width={responsiveWidth(80)}>
          <TouchableOpacity style={[styles.button]} onPress={openCamera}>
            <IonIcon name='camera-outline' color={colors.primary} size={40} ></IonIcon>
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button]} onPress={openGallery}>
            <IonIcon name='images-outline' color={colors.primary} size={40} ></IonIcon>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button]} onPress={onClose}>
            <IonIcon name='close-outline' color={colors.primary} size={40} ></IonIcon>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </Wrapper>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    display: "flex",
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    // marginVertical: 10,
    borderRadius: borderRadius.ring,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.primary,
    fontSize: fontSize.small,
  },
});

export default ImagePickerModal;
