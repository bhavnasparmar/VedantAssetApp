import React from 'react';
import Toast, {
  BaseToast,
  ErrorToast,
  ToastType,
} from 'react-native-toast-message';
import {
  colors,
  fontFamily,
  fontSize,
  responsiveHeight,
} from '../styles/variables';
import { Text, View } from 'react-native';
export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      text1NumberOfLines={20}
      text2NumberOfLines={20}
      style={{
        borderLeftColor: colors.secondary,
        backgroundColor: '#eee',
        height: 'auto',
        minHeight: 60,
        maxHeight: responsiveHeight(60),
      }}
      text1Style={{
        fontSize: fontSize.normal,
        fontFamily: fontFamily.regular,
        color: colors.black,
      }}
      text2Style={{
        fontSize: fontSize.small,
        fontFamily: fontFamily.regular,
        color: colors.darkGray,
      }}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      text1NumberOfLines={20}
      text2NumberOfLines={20}
      style={{
        borderLeftColor: colors.goldenYellow,
        backgroundColor: '#eee',
        height: 'auto',
        minHeight: 60,
        maxHeight: responsiveHeight(60),
      }}
      text1Style={{
        fontSize: fontSize.normal,
        fontFamily: fontFamily.regular,
        color: colors.black,
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      text1NumberOfLines={20}
      text2NumberOfLines={20}
      style={{
        borderLeftColor: 'red',
        backgroundColor: '#eee',
        height: 'auto',
        minHeight: 60,
        Height: responsiveHeight(60),
      }}
      text1Style={{
        fontSize: fontSize.normal,
        fontFamily: fontFamily.bold,
        color: colors.black,
      }}
      text2Style={{
        fontSize: fontSize.small,
        fontFamily: fontFamily.regular,
        color: colors.gray,
      }}
    />
  ),

  largeToast: (props: any) => (
    <View style={{ height: 100, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{props.text1}</Text>
    </View>
  ),
};

export const toastTypes: any = {
  success: 'success',
  error: 'error',
  info: 'info',
  largeToast: 'largeToast',
};

export const showToast = (type: ToastType, error: any, text2: string = '') => {
  const text1 =
    error?.msg ||
    error?.message ||
    error?.title ||
    error ||
    'something went wrong';
  return Toast.show({
    type: toastTypes?.[type] || toastTypes.info,
    position: 'bottom',
    text1: text1,
    text2: text2,
  });
};

export const ToastComponent = () => {
  return <Toast config={toastConfig} />;
};
