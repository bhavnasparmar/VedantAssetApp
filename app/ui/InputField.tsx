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
} from 'react-native';
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  marginHorizontal,
  responsiveWidth,
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
  allowFloat?: boolean;
};

const falsyValues = ['null', null, undefined, 'undefined', ''];
const isValidFloat = (v: string) => v.split('.')[1];
const possibleFloat = (v: string) => v.includes('.');

const InputField = React.forwardRef(
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
      allowFloat = true,
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
      if (allowFloat) {
        if (possibleFloat(v) && !isValidFloat(v)) {
          setInternalValue(v);
          return;
        }
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
            // marginTop: spaceVertical.extraSmall,
            width: width ? width : '100%',
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
                      marginBottom: spaceVertical.XXS / 2,
                      ...labelStyle,
                    }}
                    text={label}
                    size="S"
                    color={colors.inputLabel}
                    // semibold
                    medium
                  />
                  <CusText text={'*'} color={colors.Hard_Black} size="S" semibold />
                </Wrapper>
              ) : (
                <CusText
                  customStyles={{
                    // paddingHorizontal: marginHorizontal.extraSmall,
                    paddingLeft: marginHorizontal.extraSmall,
                    // paddingTop: marginHorizontal.extraSmall,
                    marginBottom: spaceVertical.XXS / 2,
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
                borderWidth: IsFocus || error ? 1 : 1,
                borderRadius: borderRadius.middleSmall,
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
              },
            ]}>
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
              <IonIcon
                name={preffixIcon}
                size={preffixSize ? preffixSize : fontSize.large}
                color={preffixColor ? preffixColor : colors.black}
                style={[
                  styles.prefix,
                  preffixStyle,
                  {
                    width: preffixArea ? preffixArea : '15%',
                  },
                ]}
                onPress={preffixPress}
              />
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
              onFocus={() => setIsFocus(true)}
              style={[
                styles.input,
                style,
                {
                  color: textColor ? textColor : colors.inputValue,
                  width: inputArea
                    ? inputArea
                    : password || suffixIcon
                      ? '70%'
                      : '100%',
                  height: height ? height : undefined,
                },
              ]}
              onBlur={() => setIsFocus(false)}
              ref={ref}
              selectionColor={colors.black}
              keyboardType={type === 'number' ? 'number-pad' : 'default'}
              blurOnSubmit={false}
              secureTextEntry={secureText ? true : false}
              placeholderTextColor={
                placeholderColor ? placeholderColor : colors.inputPlaceholder
              }
              {...rest}
              value={internalValue || calcVal}
              onChangeText={emitChanges}
              onSubmitEditing={
                onSubmitEditing ? onSubmitEditing : () => Keyboard.dismiss()
              }
            />

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
              <IonIcon
                name={suffixIcon}
                size={suffixSize ? suffixSize : fontSize.large}
                color={suffixColor ? suffixColor : colors.black}
                style={[
                  styles.suffix,
                  suffixStyle,
                  {
                    width: suffixArea ? suffixArea : '15%',
                    backgroundColor: suffixBgColor ? suffixBgColor : undefined,
                  },
                ]}
                onPress={suffixPress}
              />
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

export default InputField;

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: marginHorizontal.extraSmall,
   // paddingBottom: 10,
    borderRadius: borderRadius.small,
    paddingVertical : responsiveWidth(2),
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
    minHeight: responsiveWidth(5),
  },
});
