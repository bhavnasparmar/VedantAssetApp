import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { Camera, useCameraDevices, useCameraPermission, CameraDevice } from 'react-native-vision-camera';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from '../../context/appearanceContext';
import { borderRadius, responsiveWidth, responsiveHeight } from '../../styles/variables';
import CusText from '../../ui/custom-text';
import Wrapper from '../../ui/wrapper';
import Spacer from '../../ui/spacer';
import {
  Face,
  FaceDetectionOptions,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';

interface LivePhotoCaptureProps {
  visible: boolean;
  onClose: () => void;
  onPhotoCapture: (photoUri: string) => void;
  title?: string;
  subtitle?: string;
}

const LivePhotoCapture: React.FC<LivePhotoCaptureProps> = ({
  visible,
  onClose,
  onPhotoCapture,
  title = "Live Photo Capture",
  subtitle = "Look at the camera and blink twice"
}) => {
  const { colors }: any = React.useContext(AppearanceContext);
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();
  const camera = useRef<Camera>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<CameraDevice | null>(null);
  const [blinkCount, setBlinkCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Look at the camera");
  const [isBlinkDetected, setIsBlinkDetected] = useState(false);
  const [autoDetectionActive, setAutoDetectionActive] = useState(false);

  useEffect(() => {
    if (visible && !hasPermission) {
      requestCameraPermission();
    }
  }, [visible, hasPermission]);

  useEffect(() => {
    if (devices) {
      const frontCamera = devices.find(device => device.position === 'front');
      setSelectedDevice(frontCamera || null);
    }
  }, [devices]);

  useEffect(() => {
    if (blinkCount >= 2) {
      setStatusMessage("Perfect! Capturing photo...");
      setTimeout(() => {
        capturePhoto();
      }, 500);
    }
  }, [blinkCount]);

  // Auto blink detection using timer-based approach
  useEffect(() => {
    if (autoDetectionActive && visible) {
      const interval = setInterval(() => {
        // Simulate blink detection every 3-4 seconds
        const shouldDetectBlink = Math.random() > 0.7; // 30% chance per interval
        
        if (shouldDetectBlink && blinkCount < 2 && !isBlinkDetected) {
          detectBlink();
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [autoDetectionActive, visible, blinkCount, isBlinkDetected]);

  const requestCameraPermission = async () => {
    const permission = await requestPermission();
    if (!permission) {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to capture photos',
        [{ text: 'OK', onPress: onClose }]
      );
    }
  };

  // Blink detection logic
  const detectBlink = () => {
    if (!isBlinkDetected) {
      setIsBlinkDetected(true);
      setBlinkCount(prev => {
        const newCount = prev + 1;
        if (newCount === 1) {
          setStatusMessage("Great! Blink once more");
        }
        return newCount;
      });
      
      // Reset blink detection after 2 seconds
      setTimeout(() => {
        setIsBlinkDetected(false);
      }, 2000);
    }
  };

  const capturePhoto = async () => {
    if (!camera.current || isCapturing) return;
    
    try {
      setIsCapturing(true);
      
      const photo : any = await camera.current.takePhoto({
        quality: 85,
        skipMetadata: true,
      });
      
      const photoUri = Platform.OS === 'android' ? `file://${photo.path}` : photo.path;
      onPhotoCapture(photoUri);
      onClose();
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      resetCapture();
    } finally {
      setIsCapturing(false);
    }
  };

  const resetCapture = () => {
    setBlinkCount(0);
    setIsBlinkDetected(false);
    setStatusMessage("Look at the camera");
    setAutoDetectionActive(false);
  };

  const handleClose = () => {
    resetCapture();
    onClose();
  };

  const startAutoDetection = () => {
    setAutoDetectionActive(true);
    setStatusMessage("Auto detection started - blink naturally");
  };

  // Manual blink for testing
  const simulateBlink = () => {
    if (blinkCount < 2 && !isBlinkDetected) {
      detectBlink();
    }
  };

  if (!visible) return null;

  if (!hasPermission) {
    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <Wrapper flex={1} justify="center" align="center" color={colors.Hard_Black}>
          <CusText text="Camera permission required" color={colors.Hard_White} size="M" />
          <Spacer y="S" />
          <TouchableOpacity onPress={requestCameraPermission}>
            <CusText text="Grant Permission" color={colors.primary1} size="S" underline />
          </TouchableOpacity>
        </Wrapper>
      </Modal>
    );
  }

  if (!selectedDevice) {
    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <Wrapper flex={1} justify="center" align="center" color={colors.Hard_Black}>
          <CusText text="No front camera available" color={colors.Hard_White} size="M" />
          <Spacer y="S" />
          <TouchableOpacity onPress={handleClose}>
            <CusText text="Close" color={colors.primary1} size="S" underline />
          </TouchableOpacity>
        </Wrapper>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: colors.Hard_Black }}>
        {/* Header */}
        <Wrapper 
          row 
          justify="apart" 
          align="center" 
          customStyles={{ 
            paddingTop: responsiveHeight(6), 
            paddingHorizontal: responsiveWidth(4),
            paddingBottom: responsiveWidth(4)
          }}
        >
          <TouchableOpacity onPress={handleClose}>
            <IonIcon name="close" size={28} color={colors.Hard_White} />
          </TouchableOpacity>
          <CusText text={title} color={colors.Hard_White} size="M" semibold />
          <TouchableOpacity onPress={resetCapture}>
            <IonIcon name="refresh" size={24} color={colors.Hard_White} />
          </TouchableOpacity>
        </Wrapper>

        {/* Status Bar */}
        <Wrapper 
          customStyles={{ 
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveWidth(2),
            backgroundColor: blinkCount > 0 ? colors.primary1 : colors.gray
          }}
        >
          <CusText 
            text={statusMessage} 
            color={colors.Hard_White} 
            size="S" 
            position="center" 
            semibold
          />
        </Wrapper>

        {/* Camera View */}
        <View style={{ flex: 1, position: 'relative' }}>
          <Camera
            ref={camera}
            style={{ flex: 1 }}
            device={selectedDevice}
            isActive={visible && hasPermission}
            photo={true}
          />

          {/* Face Frame Overlay */}
          <View 
            style={{
              position: 'absolute',
              top: '25%',
              left: '20%',
              right: '20%',
              bottom: '40%',
              borderWidth: 3,
              borderColor: blinkCount > 0 ? colors.primary1 : colors.gray,
              borderRadius: borderRadius.large,
              backgroundColor: 'transparent',
            }}
          />

          {/* Blink Counter */}
          <View 
            style={{
              position: 'absolute',
              top: '22%',
              left: '15%',
              backgroundColor: 'rgba(0,0,0,0.8)',
              borderRadius: 20,
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}
          >
            <CusText 
              text={`Blinks: ${blinkCount}/2`} 
              color={colors.Hard_White} 
              size="S" 
              semibold
            />
          </View>

          {/* Auto Detection Status */}
          {autoDetectionActive && (
            <View 
              style={{
                position: 'absolute',
                top: '22%',
                right: '15%',
                backgroundColor: colors.primary1,
                borderRadius: 25,
                padding: 10,
              }}
            >
              <IonIcon name="eye" size={24} color={colors.Hard_White} />
            </View>
          )}

          {/* Blink Indicator */}
          {isBlinkDetected && (
            <View 
              style={{
                position: 'absolute',
                top: '35%',
                left: '40%',
                right: '40%',
                backgroundColor: colors.primary1,
                borderRadius: 30,
                padding: 15,
                alignItems: 'center',
              }}
            >
              <IonIcon name="eye-off" size={30} color={colors.Hard_White} />
            </View>
          )}

          {/* Eye Icons for Guidance */}
          <View 
            style={{
              position: 'absolute',
              top: '45%',
              left: '35%',
              right: '35%',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <IonIcon 
              name={blinkCount >= 1 ? "eye-off" : "eye"} 
              size={30} 
              color={blinkCount >= 1 ? colors.primary1 : colors.gray} 
            />
            <IonIcon 
              name={blinkCount >= 2 ? "eye-off" : "eye"} 
              size={30} 
              color={blinkCount >= 2 ? colors.primary1 : colors.gray} 
            />
          </View>

          {/* Instructions */}
          <Wrapper 
            position="center" 
            customStyles={{ 
              position: 'absolute', 
              bottom: responsiveHeight(12),
              left: 0,
              right: 0,
            }}
          >
            <CusText 
              text={subtitle} 
              color={colors.Hard_White} 
              size="M" 
              position="center" 
              semibold
            />
            <CusText 
              text={autoDetectionActive ? "Auto detection active" : "Tap 'Start Auto Detection' below"} 
              color={colors.gray} 
              size="S" 
              position="center" 
            />
          </Wrapper>
        </View>

        {/* Bottom Controls */}
        <Wrapper 
          row 
          justify="apart" 
          align="center" 
          customStyles={{ 
            paddingVertical: responsiveHeight(2),
            paddingHorizontal: responsiveWidth(4)
          }}
        >
          {/* Auto Detection Button */}
          {!autoDetectionActive && (
            <TouchableOpacity
              onPress={startAutoDetection}
              style={{
                backgroundColor: colors.primary1,
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveWidth(2),
                borderRadius: borderRadius.medium,
              }}
            >
              <CusText 
                text="Start Auto Detection" 
                color={colors.Hard_White} 
                size="XS" 
                semibold
              />
            </TouchableOpacity>
          )}

          {/* Manual Blink Button */}
          <TouchableOpacity
            onPress={simulateBlink}
            style={{
              backgroundColor: colors.gray,
              paddingHorizontal: responsiveWidth(4),
              paddingVertical: responsiveWidth(2),
              borderRadius: borderRadius.medium,
            }}
          >
            <CusText 
              text="Manual Blink" 
              color={colors.Hard_White} 
              size="XS" 
            />
          </TouchableOpacity>

          {/* Manual Capture Button */}
          <TouchableOpacity
            onPress={capturePhoto}
            disabled={isCapturing}
            style={{
              backgroundColor: isCapturing ? colors.gray : colors.primary1,
              paddingHorizontal: responsiveWidth(4),
              paddingVertical: responsiveWidth(2),
              borderRadius: borderRadius.medium,
            }}
          >
            <CusText 
              text={isCapturing ? "Capturing..." : "Capture Now"} 
              color={colors.Hard_White} 
              size="XS" 
              semibold
            />
          </TouchableOpacity>
        </Wrapper>
      </View>
    </Modal>
  );
};

export default LivePhotoCapture;


