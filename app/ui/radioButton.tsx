import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { AppearanceContext } from '../context/appearanceContext';

import CusText from './custom-text';
import Wrapper from './wrapper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { responsiveWidth } from '../styles/variables';

type RadioButtonProps = {
  options: Array<{ label: string; value: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  direction?: 'row' | 'column';
  labelStyle?: any;
  containerStyle?: any;
};

const RadioButton = ({
  options,
  selectedValue,
  onSelect,
  direction = 'row',
  labelStyle,
  containerStyle
}: RadioButtonProps) => {
  const { colors }: any = React.useContext(AppearanceContext);

  return (
    <Wrapper
      row={direction === 'row'}
      // customStyles={[
      //   direction === 'row' ? styles.rowContainer : styles.columnContainer,
      //   containerStyle
      // ]}
      customStyles={
        direction === 'row' ?
          {
            ...styles.rowContainer,
            ...containerStyle
          } :
          {
            ...styles.columnContainer,
            ...containerStyle
          }
      }
    >
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.7}
          onPress={() => onSelect(option.value)}
          style={[
            styles.radioItem,
            direction === 'row' && { marginRight: responsiveWidth(5) }
          ]}
        >
          <Wrapper row align="center">
            <IonIcon
              name={selectedValue === option.value ? "radio-button-on-outline" : "radio-button-off-outline"}
              size={20}
              color={selectedValue === option.value ? colors.primary : colors.gray}
              style={{ marginRight: 5 }}
            />
            <CusText
              text={option.label}
              size='SN'
              position="center"
              color={selectedValue === option.value ? colors.primary : colors.black}
              customStyles={labelStyle}
            />
          </Wrapper>
        </TouchableOpacity>
      ))}
    </Wrapper>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveWidth(2),
  },
  columnContainer: {
    flexDirection: 'column',
    paddingVertical: responsiveWidth(2),
  },
  radioItem: {
    marginBottom: responsiveWidth(1),
  },
});