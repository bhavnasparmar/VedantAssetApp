import React from 'react';
import {StyleSheet} from 'react-native';
import {
  borderRadius,
  colors,
  fontSize,
  marginHorizontal,
  responsiveHeight,
  responsiveWidth,
} from '../styles/variables';
import CusText from './custom-text';
import Wrapper from './wrapper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Spacer from './spacer';
import { AppearanceContext } from '../context/appearanceContext';

type checkboxProps = {
  label: string;
  value: boolean;
  onChange?: (_val: any) => void;
};

const CheckBox = ({value, label, onChange}: checkboxProps) => {
    const {colors}: any = React.useContext(AppearanceContext);
  
  return (
    <>
      <Spacer y="XS" />
      <Wrapper row align='center'>
        <IonIcon
          name={value ? "checkbox": 'square-outline'}
          color={value ? colors.primary : colors.primary}
          size={fontSize.semiNormal}
          onPress={onChange}
        />
        <CusText
          text={label}
          customStyles={styles.checkboxText}
          onPress={onChange}
        />
      </Wrapper>
    </>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  checkboxText: {
    // columnGap:responsiveWidth(1)
    // marginTop: 3,
    // marginHorizontal: marginHorizontal.XXS,
  },

  checkBox: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
    borderRadius: borderRadius.large,
  },
});
