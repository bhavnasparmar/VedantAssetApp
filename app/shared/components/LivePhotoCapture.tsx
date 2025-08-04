import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Alert, Modal, Platform, Image } from 'react-native';
import { Camera, useCameraDevices, useCameraPermission, CameraDevice, useFrameProcessor } from 'react-native-vision-camera';
// import {
//   Face,
//   FaceDetectionOptions,
//   useFaceDetector,
// } from 'react-native-vision-camera-face-detector';
import {
  Face,
  FaceDetectionOptions,
  Contours,
  Landmarks,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector'
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from '../../context/appearanceContext';
import { borderRadius, responsiveWidth, responsiveHeight } from '../../styles/variables';
import CusText from '../../ui/custom-text';
import Wrapper from '../../ui/wrapper';
import Spacer from '../../ui/spacer';
import 'react-native-reanimated';

// import DetectionResult from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import { runOnJS } from 'react-native-reanimated';

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
  const camera: any = useRef<Camera>(null);

  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<CameraDevice | null>(null);
  const [blinkCount, setBlinkCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Look at the camera");
  const [faceDetected, setFaceDetected] = useState(false);
  const [leftEyeOpen, setLeftEyeOpen] = useState(true);
  const [rightEyeOpen, setRightEyeOpen] = useState(true);
  const [lastBlinkTime, setLastBlinkTime] = useState(0);
  const [prevEyesClosed, setPrevEyesClosed] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const faceDetectionOptions: FaceDetectionOptions = {
    performanceMode: 'fast',
    landmarkMode: 'all',
    classificationMode: 'all',
    minFaceSize: 0.1,
    contourMode: 'none',
  };

  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  const handleFaces = Worklets.createRunOnJS((result: any) => {
    if (result?.length === 0) {
      setFaceDetected(false);
      return;
    }
    
    setFaceDetected(true);
    const face = result[0];
    const probLeft = face.leftEyeOpenProbability ?? 1;
    const probRight = face.rightEyeOpenProbability ?? 1;
    const bothOpen = probLeft > 0.5 && probRight > 0.5;
    const bothClosed = probLeft < 0.4 && probRight < 0.4;

    setLeftEyeOpen(probLeft > 0.5);
    setRightEyeOpen(probRight > 0.5);

    if (prevEyesClosed && bothOpen && blinkCount < 2) {
      setBlinkCount(c => {
        const next = c + 1;
        if (next === 1) {
          setStatusMessage("Great! Blink once more");
        } else if (next === 2) {
          setStatusMessage("Perfect! Capturing photo...");
          setTimeout(() => triggerCapture(), 500);
        }
        return next;
      });
    }
    setPrevEyesClosed(bothClosed);
  });

  const frameProcessor = useFrameProcessor((frame: any) => {
    'worklet';
    const res = detectFaces(frame);
    handleFaces(res);
  }, [handleFaces]);

  const triggerCapture = async () => {
    if (!camera.current || isCapturing) return;
    
    try {
      setIsCapturing(true);
      const photo = await camera.current.takePhoto({
        quality: 85,
        skipMetadata: true,
      });
      
      const photoUri = Platform.OS === 'android' ? `file://${photo.path}` : photo.path;
      setCapturedPhoto(photoUri);
      setStatusMessage("Photo captured successfully!");
      
    } catch (err) {
      console.error('Capture error:', err);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoCapture(capturedPhoto);
      handleClose();
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    resetCapture();
  };

  const resetCapture = () => {
    setBlinkCount(0);
    setStatusMessage("Look at the camera");
    setFaceDetected(false);
    setLeftEyeOpen(true);
    setRightEyeOpen(true);
    setPrevEyesClosed(false);
    setCapturedPhoto(null);
  };

  const handleClose = () => {
    resetCapture();
    onClose();
  };

  useEffect(() => {
    if (visible && !hasPermission) {
      requestPermission();
    }
  }, [visible, hasPermission]);

  useEffect(() => {
    if (devices) {
      const frontCamera = devices.find(device => device.position === 'front');
      setSelectedDevice(frontCamera || null);
    }
  }, [devices]);

  if (!visible) return null;

  if (!hasPermission) {
    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <Wrapper flex justify="center" align="center" color={colors.Hard_Black}>
          <CusText text="Camera permission required" color={colors.Hard_White} size="M" />
          <Spacer y="S" />
          <TouchableOpacity onPress={() => requestPermission()}>
            <CusText text="Grant Permission" color={colors.primary1} size="S" underline />
          </TouchableOpacity>
        </Wrapper>
      </Modal>
    );
  }

  if (!selectedDevice) {
    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <Wrapper flex justify="center" align="center" color={colors.Hard_Black}>
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
            backgroundColor: capturedPhoto ? '#4CAF50' : faceDetected ? (blinkCount > 0 ? colors.primary1 : '#4CAF50') : '#F44336'
          }}
        >
          <CusText 
            text={capturedPhoto ? "Photo captured successfully!" : faceDetected ? statusMessage : "Position your face in the frame"} 
            color={colors.Hard_White} 
            size="S" 
            position="center" 
            semibold
          />
        </Wrapper>

        {/* Camera/Photo View */}
        <View style={{ flex: 1, position: 'relative' }}>
          {capturedPhoto ? (
            // Show captured photo
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image 
                source={{ uri: capturedPhoto }} 
                style={{ 
                  width: responsiveWidth(90), 
                  height: responsiveHeight(60), 
                  borderRadius: borderRadius.large 
                }} 
                resizeMode="cover"
              />
            </View>
          ) : (
            // Show camera
            <>
              {selectedDevice && (
                <Camera
                  ref={camera}
                  style={{ flex: 1 }}
                  device={selectedDevice}
                  isActive={visible && hasPermission && !capturedPhoto}
                  frameProcessor={frameProcessor}
                  photo={true}
                />
              )}

              {/* Face Frame Overlay */}
              <View 
                style={{
                  position: 'absolute',
                  top: '20%',
                  left: '15%',
                  right: '15%',
                  bottom: '35%',
                  borderWidth: 4,
                  borderColor: faceDetected ? (blinkCount > 0 ? colors.primary1 : '#4CAF50') : '#F44336',
                  borderRadius: borderRadius.large,
                  backgroundColor: 'transparent',
                }}
              />

              {/* Detection Status */}
              <View 
                style={{
                  position: 'absolute',
                  top: '17%',
                  left: '12%',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  borderRadius: 15,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <CusText 
                  text={faceDetected ? `Face ✓ | Blinks: ${blinkCount}/2` : "No Face"} 
                  color={colors.Hard_White} 
                  size="XS" 
                  semibold
                />
              </View>

              {/* Eye Status */}
              {faceDetected && (
                <View 
                  style={{
                    position: 'absolute',
                    top: '17%',
                    right: '12%',
                    flexDirection: 'row',
                    gap: 8,
                  }}
                >
                  <View style={{
                    backgroundColor: leftEyeOpen ? 'rgba(76,175,80,0.9)' : 'rgba(255,193,7,0.9)',
                    borderRadius: 12,
                    padding: 6,
                  }}>
                    <IonIcon 
                      name={leftEyeOpen ? "eye" : "eye-off"} 
                      size={14} 
                      color={colors.Hard_White} 
                    />
                  </View>
                  <View style={{
                    backgroundColor: rightEyeOpen ? 'rgba(76,175,80,0.9)' : 'rgba(255,193,7,0.9)',
                    borderRadius: 12,
                    padding: 6,
                  }}>
                    <IonIcon 
                      name={rightEyeOpen ? "eye" : "eye-off"} 
                      size={14} 
                      color={colors.Hard_White} 
                    />
                  </View>
                </View>
              )}

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
              </Wrapper>
            </>
          )}
        </View>

        {/* Bottom Controls */}
        <Wrapper 
          row 
          justify={capturedPhoto ? "apart" : "center"} 
          align="center" 
          customStyles={{ 
            paddingVertical: responsiveHeight(2),
            paddingHorizontal: responsiveWidth(4)
          }}
        >
          {capturedPhoto ? (
            <>
              <TouchableOpacity
                onPress={handleRetakePhoto}
                style={{
                  backgroundColor: colors.gray,
                  paddingHorizontal: responsiveWidth(6),
                  paddingVertical: responsiveWidth(3),
                  borderRadius: borderRadius.medium,
                }}
              >
                <CusText 
                  text="Retake" 
                  color={colors.Hard_White} 
                  size="S" 
                  semibold
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmPhoto}
                style={{
                  backgroundColor: colors.primary1,
                  paddingHorizontal: responsiveWidth(6),
                  paddingVertical: responsiveWidth(3),
                  borderRadius: borderRadius.medium,
                }}
              >
                <CusText 
                  text="Use Photo" 
                  color={colors.Hard_White} 
                  size="S" 
                  semibold
                />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={triggerCapture}
              disabled={isCapturing}
              style={{
                backgroundColor: isCapturing ? colors.gray : colors.primary1,
                paddingHorizontal: responsiveWidth(8),
                paddingVertical: responsiveWidth(3),
                borderRadius: borderRadius.medium,
              }}
            >
              <CusText 
                text={isCapturing ? "Capturing..." : "Manual Capture"} 
                color={colors.Hard_White} 
                size="S" 
                semibold
              />
            </TouchableOpacity>
          )}
        </Wrapper>
      </View>
    </Modal>
  );
};

export default LivePhotoCapture;







