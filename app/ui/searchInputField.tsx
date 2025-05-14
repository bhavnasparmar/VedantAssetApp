/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  TextInputProps,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Keyboard,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  isIpad,
  marginHorizontal,
  responsiveWidth,
  searchInputHeight,
  searchLineHeight,
  spaceVertical,
} from '../styles/variables';
import CusText from './custom-text';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from '../context/appearanceContext';
import Wrapper from './wrapper';

const shadows = {};

type InputPropTypes = TextInputProps & {
  label?: string;
  error?: string | null;
  bordered?: boolean;
  shadow?: boolean;
  prefix?: string;
  suffix?: string;
  width?: number | string;
  height?: number | string;
  radius?: number;
  type?: 'number' | 'text';
  suffixStyle?: any;
  labelStyle?: TextStyle;
  value: number | string;
  fieldViewStyle?: ViewStyle;
  errorStyle?: TextStyle;
  superscript?: string;
  laterText?: string;
  labelType?: string;
  onChangeText?: (_val: any) => void;
  clearSearchText?: () => void;
  suffixPress?: any;
  inputArea?: string | number;
  suffixArea?: string | number;
  preffixArea?: string | number;
  suffixIcon?: string | null;
  preffixImage?: any;
  preffixIcon?: string;
  preffixStyle?: TextStyle;
  suffixSize?: number;
  suffixColor?: string;
  suffixBgColor?: string;
  preffixSize?: number;
  preffixColor?: string;
  borderColor?: string;
  fieldColor?: string;
  placeholderColor?: string;
  password?: boolean;
  preffixPress?: any;
  onSubmitEditing?: (_val: any) => void;
  textColor?: string;
  required?: boolean;
  setfoucstrue?: (_val: any) => void;
};

const falsyValues = ['null', null, undefined, 'undefined', ''];
const isValidFloat = (v: string) => v.split('.')[1];
const possibleFloat = (v: string) => v.includes('.');

const SearchInputField = React.forwardRef(
  (
    {
      label,
      error,
      style,
      type = 'text',
      prefix,
      suffix,
      suffixStyle,
      labelStyle,
      value,
      textColor,
      fieldViewStyle,
      errorStyle,
      suffixPress,
      bordered,
      inputArea,
      suffixArea,
      preffixArea,
      suffixIcon,
      preffixIcon,
      preffixImage,
      width,
      height,
      suffixSize,
      preffixStyle,
      suffixColor,
      suffixBgColor,
      preffixColor,
      preffixSize,
      radius,
      borderColor,
      fieldColor,
      placeholderColor,
      password,
      preffixPress,
      onSubmitEditing,
      shadow,
      required,
      clearSearchText,
      setfoucstrue,
      ...rest
    }: InputPropTypes,
    ref: any,
  ) => {
    const [secureText, setsecureText] = useState(password ? true : false);
    const [IsFocus, setIsFocus] = useState(false);
    const [internalValue, setInternalValue] = useState<string>('');

    let calcVal = React.useMemo(() => {
      if (falsyValues.includes(value)) {
        return '';
      }
      switch (type) {
        case 'number':
          return value?.toString();

        default:
          return value;
      }
    }, [value, type]);

    const parser = (val: string) => {
      if (possibleFloat(val)) {
        return parseFloat(val);
      }
      return parseInt(val);
    };

    const emitChanges = (v: string) => {
      if (possibleFloat(v) && !isValidFloat(v)) {
        setInternalValue(v);
        return;
      }
      setInternalValue('');
      if (!rest.onChangeText) {
        return;
      }
      if (v && type === 'number') {
        rest.onChangeText(parser(v));
      } else {
        let val = v || undefined;
        rest.onChangeText(val);
      }
    };

    const { colors }: any = React.useContext(AppearanceContext);
    return (
      <View>
        {/* Field */}
        <View
          style={{
            marginTop: spaceVertical.extraSmall,
            width: width ? width : '100%',
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
                  : colors.black,
            backgroundColor: fieldColor ? fieldColor : colors.inputBg,
            // shadowColor: '#000000',
            // shadowOffset: {
            //   width: 0,
            //   height: 1.06,
            // },
            // shadowOpacity: 0.13,
            // shadowRadius: 2.0,
            // elevation: 4,
            ...fieldViewStyle,
          }}>
          {label ? (
            <>
              {required ? (
                <Wrapper
                  row
                  customStyles={{ paddingTop: marginHorizontal.extraSmall }}>
                  <CusText
                    customStyles={{
                      // paddingHorizontal: marginHorizontal.extraSmall,
                      paddingLeft: marginHorizontal.extraSmall,
                      // marginBottom: spaceVertical.extraSmall,
                      ...labelStyle,
                    }}
                    text={label}
                    size="S"
                    color={colors.inputLabel}
                    // semibold
                    medium
                  />
                  <CusText text={'*'} color={colors.red} size="S" semibold />
                </Wrapper>
              ) : (
                <CusText
                  customStyles={{
                    // paddingHorizontal: marginHorizontal.extraSmall,
                    paddingLeft: marginHorizontal.extraSmall,
                    paddingTop: marginHorizontal.extraSmall,
                    // marginBottom: spaceVertical.extraSmall,
                    ...labelStyle,
                  }}
                  text={label}
                  size="S"
                  color={colors.inputLabel}
                  // semibold
                  medium
                />
              )}
            </>
          ) : null}

          <View
            style={[
              styles.inputRow,
              {
                width: width ? width : '100%',
                maxWidth: '100%',
                /*  borderWidth: IsFocus  ? 1 : 0,
                borderColor: ''
                  ? IsFocus
                    ? colors.primary
                    :''
                  : IsFocus
                    ? colors.primary
                    :colors.black, */
                backgroundColor: fieldColor ? fieldColor : colors.inputBg,
                // ...fieldViewStyle,
              },
            ]}>
            <Wrapper row align="center">
              {/* Preffix */}
              {prefix && (
                <Text
                  style={[
                    styles.prefix,
                    preffixStyle,
                    {
                      fontSize: preffixSize ? preffixSize : fontSize.extraSmall,
                      color: preffixColor ? preffixColor : colors.black,
                      width: preffixArea ? preffixArea : '20%',
                    },
                  ]}
                  onPress={preffixPress}>
                  {prefix}
                </Text>
              )}
              {preffixIcon && (
                <View
                  style={[
                    styles.prefix,
                    preffixStyle,
                    {
                      width: preffixArea ? preffixArea : '15%',
                      height: preffixArea ? preffixArea : '15%',
                    },
                  ]}>
                  <IonIcon
                    name={preffixIcon}
                    size={preffixSize ? preffixSize : fontSize.large}
                    color={preffixColor ? preffixColor : colors.black}
                    // style={[
                    //   styles.prefix,
                    //   preffixStyle,
                    //   // {
                    //   //   width: preffixArea ? preffixArea : '15%',
                    //   // },
                    // ]}
                    onPress={preffixPress}
                  />
                </View>
              )}
              {preffixImage && (
                <Image
                  source={preffixImage}
                  tintColor={preffixColor ? preffixColor : colors.primary}
                  style={[
                    styles.prefixImg,
                    preffixStyle,
                    {
                      width: preffixArea ? preffixArea : '10%',
                      resizeMode: 'contain',
                    },
                  ]}
                />
              )}

              {/* Input */}
              <TextInput
                // cursorColor={colors.black}
                onFocus={() => { setIsFocus(true), setfoucstrue(true) }}
                style={[
                  styles.input,
                  style,
                  {
                    color: textColor ? textColor : colors.inputValue,
                    width: inputArea
                      ? inputArea
                      : password || suffixIcon
                        ? isIpad() ? '94%' : '80%'
                        : '100%',
                    height: height ? height : undefined,
                  },
                ]}
                onBlur={() => { setIsFocus(false), setfoucstrue(false) }}
                ref={ref}
                selectionColor={colors.inputCursor}
                keyboardType={type === 'number' ? 'number-pad' : 'default'}
                blurOnSubmit={false}
                secureTextEntry={secureText ? true : false}
                placeholderTextColor={
                  placeholderColor ? placeholderColor : colors.placeholderColor
                }
                {...rest}
                value={internalValue || calcVal}
                onChangeText={emitChanges}
                onSubmitEditing={
                  onSubmitEditing ? onSubmitEditing : () => Keyboard.dismiss()
                }
              />

            </Wrapper>

            {/* Suffix */}
            {suffix && (
              <Text
                style={[
                  styles.suffix,
                  suffixStyle,
                  {
                    fontSize: suffixSize ? suffixSize : fontSize.extraSmall,
                    color: suffixColor ? suffixColor : colors.black,
                    width: suffixArea ? suffixArea : '15%',
                  },
                ]}
                onPress={suffixPress}>
                {suffix}
              </Text>
            )}
            {suffixIcon && (
              <TouchableOpacity
                onPress={clearSearchText}
                style={[
                  styles.suffix,
                  suffixStyle,
                  {
                    width: suffixArea ? suffixArea : '15%',
                    height: suffixArea ? suffixArea : '15%',
                    backgroundColor: suffixBgColor ? suffixBgColor : undefined,
                  },
                ]}>
                <IonIcon
                  name={suffixIcon}
                  size={suffixSize ? suffixSize : fontSize.large}
                  color={suffixColor ? suffixColor : colors.black}
                  // style={[
                  //   styles.suffix,
                  //   suffixStyle,
                  //   {
                  //     width: suffixArea ? suffixArea : '15%',
                  //     backgroundColor: suffixBgColor ? suffixBgColor : undefined,
                  //   },
                  // ]}
                  onPress={suffixPress}
                />
              </TouchableOpacity>
            )}

            {password && (
              <IonIcon
                name={secureText ? 'eye-off-outline' : 'eye-outline'}
                size={suffixSize ? suffixSize : fontSize.large}
                color={suffixColor ? suffixColor : colors.black}
                style={[
                  styles.suffix,
                  suffixStyle,
                  {
                    width: suffixArea ? suffixArea : '15%',
                  },
                ]}
                onPress={() => setsecureText(!secureText)}
              />
            )}
          </View>
        </View>

        {/* Error */}
        {error ? (
          <CusText text={error} error customStyles={errorStyle} />
        ) : null}
      </View>
    );
  },
);

export default SearchInputField;

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: marginHorizontal.extraSmall,
    padding: 4,
    height: '100%',
    // paddingBottom: 3,
    // paddingVertical: 3,
    borderRadius: borderRadius.medium,
    elevation: 20,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  prefix: {
    fontFamily: fontFamily.regular,
    // height: '80%',
    textAlignVertical: 'center',
    // paddingRight: responsiveWidth(3),
    textAlign: 'center',
    borderRadius: borderRadius.normal,
    backgroundColor: '#1D2535',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefixImg: {
    // fontFamily: fontFamily.regular,
    height: '100%',
    //textAlignVertical: 'center',
    paddingRight: responsiveWidth(3),
    // textAlign: 'right',
  },

  suffix: {
    fontFamily: fontFamily.regular,
    // height: '80%',
    textAlignVertical: 'center',
    // paddingRight: responsiveWidth(3),
    textAlign: 'center',
    borderRadius: borderRadius.normal,
    backgroundColor: '#1D2535',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    // paddingVertical: 3,
    color: colors.black,
    fontFamily: fontFamily.regular,
    fontSize: isIpad() ? fontSize.small : fontSize.middleSmall,
    minHeight: searchInputHeight,
    lineHeight: searchLineHeight,
    paddingHorizontal: responsiveWidth(3),
  },
});
