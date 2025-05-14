/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, TextStyle, Switch} from 'react-native';
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  marginHorizontal,
  responsiveWidth,
} from '../styles/variables';
import CusText from './custom-text';
import {AppearanceContext} from '../context/appearanceContext';
import Wrapper from './wrapper';

type InputPropTypes = {
  label?: string;
  labelStyle?: TextStyle;
  value: boolean;
  onToggle?: (_val: any) => void;
};

const SwitchToggle = React.forwardRef(
  ({label, labelStyle, value, onToggle, ...rest}: InputPropTypes) => {
    const {colors}: any = React.useContext(AppearanceContext);
    return (
      <View style={styles.inputRow}>
        <Wrapper row>
          <CusText
            customStyles={{
              paddingLeft: marginHorizontal.extraSmall,
              marginRight: marginHorizontal.extraSmall,
              ...labelStyle,
            }}
            text={label}
            size="S"
            color={colors.fieldValue}
            // semibold
            medium
          />
        </Wrapper>
        <Switch
          trackColor={{true: colors.secondary, false: colors.gray}}
          thumbColor={value ? colors.primary : colors.lightGray}
          // ios_backgroundColor="#3e3e3e"
          onValueChange={onToggle}
          value={value}
        />
      </View>
    );
  },
);

export default SwitchToggle;

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: marginHorizontal.extraSmall,
    paddingBottom: 3,
    borderRadius: borderRadius.small,
  },

  prefix: {
    fontFamily: fontFamily.regular,
    height: '100%',
    textAlignVertical: 'center',
    paddingRight: responsiveWidth(3),
    textAlign: 'right',
  },
  prefixImg: {
    height: '100%',
    paddingRight: responsiveWidth(3),
  },

  suffix: {
    fontFamily: fontFamily.regular,
    textAlign: 'left',
    height: '100%',
    textAlignVertical: 'center',
  },

  input: {
    paddingVertical: 3,
    color: colors.black,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.middleSmall,
    minHeight: responsiveWidth(9),
  },
});
