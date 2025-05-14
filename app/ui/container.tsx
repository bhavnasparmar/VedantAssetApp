/* eslint-disable react-native/no-inline-styles */
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {AppearanceContext} from '../context/appearanceContext';

type ContainerProps = {
  contentStyles?: ViewStyle;
  containerStyles?: ViewStyle;
  children?: React.ReactNode;
  Xcenter?: boolean;
  Ycenter?: boolean;
  bgcolor?: string;
  contentWidth?: number | string;
  contentHeight?: number | string;
  itemPosition?: 'center' | 'right';
  noscroll?: boolean;
  noflex?: boolean;
  nosafeAreaView?: boolean;
};

const Container = ({
  containerStyles,
  contentStyles,
  children,
  Xcenter,
  Ycenter,
  bgcolor,
  contentWidth,
  contentHeight,
  itemPosition,
  noscroll,
  nosafeAreaView,
  noflex,
}: ContainerProps) => {
  const {colors}: any = React.useContext(AppearanceContext);
  return (
    <>
      {noscroll ? (
        <SafeAreaView
          style={[
            styles.container,
            {
              justifyContent: Ycenter ? 'center' : undefined,
              backgroundColor: bgcolor ? bgcolor : colors.background,
              flex: noflex ? undefined : 1,
              ...containerStyles,
            },
          ]}>
          <View
            style={[
              styles.content,
              {
                alignSelf: Xcenter ? 'center' : 'flex-start',
                alignItems:
                  itemPosition === 'center'
                    ? 'center'
                    : itemPosition === 'right'
                    ? 'flex-end'
                    : undefined,
                width: contentWidth ? contentWidth : '90%',
                ...contentStyles,
              },
            ]}>
            {children!}
          </View>
        </SafeAreaView>
      ) : nosafeAreaView && noscroll ? (
        <View
          style={[
            styles.container,
            {
              justifyContent: Ycenter ? 'center' : undefined,
              backgroundColor: bgcolor ? bgcolor : colors.background,
              flex: noflex ? undefined : 1,
              ...containerStyles,
            },
          ]}>
          <View
            style={[
              styles.content,
              {
                alignSelf: Xcenter ? 'center' : 'flex-start',
                alignItems:
                  itemPosition === 'center'
                    ? 'center'
                    : itemPosition === 'right'
                    ? 'flex-end'
                    : undefined,
                width: contentWidth ? contentWidth : '90%',
                ...contentStyles,
              },
            ]}>
            {children!}
          </View>
        </View>
      ) : nosafeAreaView && !noscroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={[
            styles.container,
            {
              justifyContent: Ycenter ? 'center' : undefined,
              backgroundColor: bgcolor ? bgcolor : colors.background,
              flex: noflex ? undefined : 1,
              ...containerStyles,
            },
          ]}>
          <View
            style={[
              styles.content,
              {
                alignSelf: Xcenter ? 'center' : 'flex-start',
                alignItems:
                  itemPosition === 'center'
                    ? 'center'
                    : itemPosition === 'right'
                    ? 'flex-end'
                    : undefined,
                width: contentWidth ? contentWidth : '90%',
                ...contentStyles,
              },
            ]}>
            {/* <ScrollView > */}
            {children!}
            {/* </ScrollView> */}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={[
            styles.container,
            {
              backgroundColor: bgcolor ? bgcolor : colors.background,
              flex: noflex ? undefined : 1,
              ...containerStyles,
            },
          ]}>
          <View
            style={[
              styles.content,
              {
                alignSelf: Xcenter ? 'center' : 'flex-start',
                alignItems:
                  itemPosition === 'center'
                    ? 'center'
                    : itemPosition === 'right'
                    ? 'flex-end'
                    : undefined,
                width: contentWidth ? contentWidth : '90%',
                height: contentHeight ? contentHeight : undefined,
                ...contentStyles,
              },
            ]}>
            <SafeAreaView>{children!}</SafeAreaView>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    // alignSelf:"center",
  },
});
