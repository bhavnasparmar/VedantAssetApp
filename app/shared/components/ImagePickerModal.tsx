// ImagePickerModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, Linking } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import IonIcon from 'react-native-vector-icons/Ionicons';
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
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take pictures',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          console.log('Camera permission denied');
          return false;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to take pictures. Please enable it in app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permissions differently
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        let granted;
        
        if (Platform.Version >= 33) {
          // Android 13+ requires READ_MEDIA_IMAGES
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
        } else {
          // Android 12 and below require READ_EXTERNAL_STORAGE
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
        }
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          console.log('Storage permission denied');
          return false;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Permission Required',
            'Storage permission is required to access photos. Please enable it in app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permissions differently
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    
    if (hasPermission) {
      launchCamera(
        { mediaType: isVideo ? 'video' : 'photo', saveToPhotos: true },
        (response) => {
          if (!response.didCancel && !response.errorCode) {
            onPickImage(response);
            onClose();
          } else if (response.errorCode) {
            Alert.alert('Error', response.errorMessage || 'Something went wrong with the camera');
          }
        }
      );
    }
  };

  const openGallery = async () => {
    const hasPermission = await requestStoragePermission();
    
    if (hasPermission) {
      launchImageLibrary(
        { mediaType: isVideo ? 'video' : 'photo' },
        (response) => {
          if (!response.didCancel && !response.errorCode) {
            onPickImage(response);
            onClose();
          } else if (response.errorCode) {
            Alert.alert('Error', response.errorMessage || 'Something went wrong with the gallery');
          }
        }
      );
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
        </Wrapper>
        <TouchableOpacity style={[styles.button]} onPress={onClose}>
          <IonIcon name='close-outline' color={colors.primary} size={40} ></IonIcon>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
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
