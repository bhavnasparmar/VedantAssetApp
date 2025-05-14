import { StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  borderRadius,
  fontFamily,
  fontSize,
  isIpad,
  lineHeight,
  marginHorizontal,
  responsiveHeight,
  responsiveWidth,
  spaceVertical,
} from '../styles/variables';
import IonIcon from 'react-native-vector-icons/Ionicons';
import CusText from './custom-text';
import Wrapper from './wrapper';
import { DropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import { AppearanceContext } from '../context/appearanceContext';

type dropdownProps = DropdownProps & {
  data: any[];
  value?: string;
  width?: string | number;
  placeholder?: string;
  disable?: boolean;
  placeholdercolor?: string;
  labelText?: string;
  innerLable?: string;
  labelStyle?: TextStyle;
  error?: string | null;
  errorStyle?: TextStyle;
  required?: boolean;
  fieldColor?: string;
};
const DropDown = ({
  data,
  labelField,
  valueField,
  onChange,
  width,
  value,
  placeholder,
  disable,
  placeholdercolor,
  labelText,
  innerLable,
  labelStyle,
  error,
  errorStyle,
  required,
  onClear,
  clearValue,
  fieldColor
}: dropdownProps) => {
  const [IsFocus, setIsFocus] = useState(false);

  const renderDropdownItem = (item: any) => {
    return (
      <>
        <Wrapper row customStyles={styles.DDRow}>
          <Wrapper
            align="center"
            row
            customStyles={styles.DD}
            color={colors.ddItemBg}>
            <CusText
              text={item?.[labelField] || ''}
              size="MS"
              color={colors.HARD_WHITE}
            />
          </Wrapper>
        </Wrapper>
      </>
    );
  };

  const { colors }: any = React.useContext(AppearanceContext);
  return (
    <>
      <View>
        {labelText ? (
          <>
            {required ? (
              <Wrapper
                row
                customStyles={{ paddingTop: marginHorizontal.extraSmall }}>
                <CusText
                  customStyles={{
                    paddingLeft: marginHorizontal.extraSmall,
                    paddingTop: marginHorizontal.extraSmall,
                    ...labelStyle,
                  }}
                  text={labelText}
                  size="S"
                  color={colors.inputLabel}
                  // semibold
                  medium
                />
                <CusText text={'*'} color={colors.red} size="S" semibold />
              </Wrapper>
            ) : (
              <Wrapper
                row
                customStyles={{ paddingTop: marginHorizontal.extraSmall }}>
              <CusText
                customStyles={{
                  paddingLeft: marginHorizontal.extraSmall,
                  paddingTop: marginHorizontal.extraSmall,
                  ...labelStyle,
                }}
                text={labelText}
                size="S"
                color={colors.inputLabel}
                // semibold
                medium
              />
              </Wrapper>
            )}
          </>
        ) : null}
        <View
          style={{
            paddingVertical: responsiveHeight(0.5),
            marginTop: innerLable ? spaceVertical.small : spaceVertical.XXS,
            borderWidth: IsFocus || error ? 1 : 1,
            borderRadius: borderRadius.medium,
            borderColor: ''
              ? IsFocus
                ? error
                  ? colors.red
                  : colors.primary
                : error
                  ? colors.red
                  : ''
              : IsFocus
                ? error
                  ? colors.red
                  : colors.primary
                : error
                  ? colors.red
                  : colors.inputBorder,
            backgroundColor: fieldColor?fieldColor: colors.inputBg,
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 1.06,
            },
            shadowOpacity: 0.13,
            shadowRadius: 2.0,
            elevation: 4,
          }}>
          {innerLable && (value || IsFocus) ? (
            <>
              {required ? (
                <View
                  style={[
                    value || IsFocus
                      ? {
                        position: 'absolute',
                        left: 10,
                        top: -18,
                        padding: 0,
                        paddingRight: 5,
                        display: 'flex',
                        backgroundColor: colors.background,
                      }
                      : {},
                  ]}>
                  <Wrapper
                    row
                    customStyles={{ marginTop: marginHorizontal.extraSmall }}>
                    <CusText
                      customStyles={{
                        paddingLeft: marginHorizontal.extraSmall,
                        ...labelStyle,
                      }}
                      text={innerLable}
                      size="S"
                      color={colors.inputLabel}
                      // semibold
                      medium
                    />
                    <CusText text={'*'} color={colors.red} size="S" semibold />
                  </Wrapper>
                </View>
              ) : (
                <View
                  style={[
                    value || IsFocus
                      ? {
                        position: 'absolute',
                        left: 10,
                        top: -18,
                        padding: 0,
                        paddingRight: 5,
                        display: 'flex',
                        backgroundColor: colors.background,
                      }
                      : {},
                  ]}>
                  <CusText
                    customStyles={{
                      paddingLeft: marginHorizontal.extraSmall,
                      paddingTop: marginHorizontal.extraSmall,
                      ...labelStyle,
                    }}
                    text={innerLable}
                    size="S"
                    color={colors.inputLabel}
                    // semibold
                    medium
                  />
                </View>
              )}
            </>
          ) : null}
          <Dropdown
            data={data}
            labelField={labelField}
            valueField={valueField}
            placeholder={placeholder}
            placeholderStyle={[
              styles.selected,
              {
                color: placeholdercolor
                  ? placeholdercolor
                  : colors.placeholderColor,
              },
            ]}
            value={value}
            disable={disable}
            onChange={onChange}
            activeColor={colors.grayShades4}
            search
            searchPlaceholder={data?.length ? 'Search' : 'No Records'}
            inputSearchStyle={{

              color: colors.black,
              margin: 0,
              marginRight: responsiveWidth(5),
              padding: 0,
              minHeight: responsiveHeight(3),
              height: isIpad() ? responsiveWidth(5) : responsiveWidth(8),
              fontFamily: fontFamily.regular,
              fontSize: fontSize.middleSmall,
              borderWidth: 0,
              backgroundColor: colors.inputBg,
              borderRadius: borderRadius.normal,
              paddingLeft: responsiveWidth(1),
              marginBottom: 0,
              lineHeight: lineHeight.normal,
            }}
            style={{
              width: width ? width : responsiveWidth(90),
              maxWidth: '100%',
              backgroundColor: colors.inputBg,
              borderRadius: borderRadius.small,
              paddingHorizontal: responsiveWidth(2),
              paddingVertical: responsiveWidth(2),
              height: isIpad() ? responsiveWidth(7) : responsiveWidth(10),
            }}
            
            renderRightIcon={() => (
              <>
                {!value ?
                  <View style={{ marginTop: responsiveWidth(0) }}>
                    <IonIcon name={'caret-down-outline'} color={colors.inputValue} />
                  </View> :
                  <TouchableOpacity onPress={() => { onClear() }}>
                    <View style={{ marginTop: responsiveWidth(0) }}>
                      <IonIcon name={'close-outline'} size={18} color={colors.inputValue} />
                    </View>
                  </TouchableOpacity>}
              </>
            )}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            selectedTextStyle={[styles.selected, { color: colors.inputValue }]}
            renderItem={(item: any) => renderDropdownItem(item)}
            iconColor={colors.black}
            containerStyle={{

              backgroundColor: 'transparent',
              top: isIpad() ? responsiveWidth(-7) : responsiveWidth(-9),
              borderWidth: 0,

              shadowColor: 'rgba(0,0,0,0)',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0,
              shadowRadius: 0,
              elevation: 0,
 }}
          />
        </View>
        {error ? (
          <CusText text={error} error customStyles={errorStyle} />
        ) : null}
      </View>
    </>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  selected: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.middleSmall,
  },
  DD: {
    width: '100%',
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
  },
  DDRow: {
    position: 'relative',
    marginTop: -1,
  },
});
