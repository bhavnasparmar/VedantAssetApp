import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  fontSize,
  responsiveHeight,
  responsiveWidth,
} from '../styles/variables';
import CusText from './custom-text';
import Wrapper from './wrapper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Spacer from './spacer';
import { AppearanceContext } from '../context/appearanceContext';

type checkboxProps = {
  label?: string;
  isChecked: boolean;
  onPress: () => void;
  size?: number;
  checkedColor?: string;
  uncheckedColor?: string;
  labelStyle?: any;
  checkboxStyle?: any;
  disabled?: boolean;
  iconName?: string;
  uncheckedIconName?: string;
};

const CheckBox = ({
  isChecked,
  label,
  onPress,
  size = fontSize.semiNormal,
  checkedColor,
  uncheckedColor,
  labelStyle,
  checkboxStyle,
  disabled = false,
  iconName = "checkbox",
  uncheckedIconName = "square-outline"
}: checkboxProps) => {
  const { colors: themeColors }: any = React.useContext(AppearanceContext);

  const getCheckboxColor = () => {
    if (disabled) return themeColors.gray;
    if (isChecked) return checkedColor || themeColors.primary;
    return uncheckedColor || themeColors.gray;
  };

  const getIconName = () => {
    return isChecked ? iconName : uncheckedIconName;
  };

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.7}
      onPress={disabled ? undefined : onPress}
      style={[styles.container, checkboxStyle]}
    >
      <Wrapper row align='center'>
        <IonIcon
          name={getIconName()}
          color={getCheckboxColor()}
          size={size}
        />
        {label && (
          <>
            <Spacer x="XS" />
            <CusText
              text={label}
              customStyles={[
                styles.checkboxText,
                { 
                  color: disabled ? themeColors.gray : themeColors.black,
                  opacity: disabled ? 0.6 : 1
                },
                labelStyle
              ]}
            />
          </>
        )}
      </Wrapper>
    </TouchableOpacity>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    flex: 1,
    flexWrap: 'wrap',
  },
});