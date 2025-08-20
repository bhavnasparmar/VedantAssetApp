import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React, { useContext, useState } from 'react';
import {
  fontFamily,
  fontSize,
  marginHorizontal,
  responsiveWidth,
  spaceVertical,
} from '../styles/variables';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from '../context/appearanceContext';
import CusText from './custom-text';
import Wrapper from './wrapper';

type pickerProp = {
  label?: string;
  innerLable?: string;
  labelStyle?: TextStyle;
  labelType?: string;
  value: Date | undefined;
  setValue: (_val: any) => void;
  bordered?: boolean;
  borderColor?: string;
  customStyle?: ViewStyle;
  iconColor?: string;
  bgColor?: string;
  width?: string | number;
  data?: any;
  i?: number;
  setdata?: (_val: any) => void;
  maximum?: Date;
  minimum?: Date;
  formatFunction?: (date: Date) => void;
  mode?: string;
  error?: string | null;
  errorStyle?: TextStyle;
  required?: boolean;
  editable?: boolean;
  editFlag?: string;
  placeholderColor?: string;
  placeholderStyle?: any;
  placeholder?: string;
  maxTime?: Date;
};

const DateTimePicker = ({
  label,
  innerLable,
  labelStyle,
  value,
  setValue,
  bordered,
  borderColor,
  customStyle,
  iconColor,
  bgColor,
  width,
  data,
  i,
  errorStyle,
  setdata,
  maximum,
  minimum,
  formatFunction,
  mode,
  error,
  required,
  editable,
  editFlag,
  placeholderColor,
  placeholderStyle,
  placeholder,
  maxTime,
}: pickerProp) => {
  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const lanid = '';
  const onChangeStart = (selectedDate: any) => {
    if (data && i != null && setdata) {
      const dateChange = data.map((item: Date, index: number) =>
        index === i ? { ...item, date: selectedDate } : item,
      );
      setdata(dateChange);
    } else {
      const currentDate = selectedDate || startDate;
      setStartDate(currentDate);
      setValue(currentDate);
      if (formatFunction) {
        formatFunction(selectedDate);
      }
    }
    setShow(false);
  };

  const { colors }: any = useContext(AppearanceContext);
  const [IsFocus, setIsFocus] = useState(false);
  return (
    <>
      <View>
        {label ? (
          <>
            {required ? (
              <Wrapper
                row
                customStyles={{ paddingTop: marginHorizontal.extraSmall }}
                color="red">
                <CusText
                  customStyles={{
                    paddingLeft: marginHorizontal.extraSmall,
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
              <Wrapper
                row
              // customStyles={{paddingTop: marginHorizontal.extraSmall}}
              >
                <CusText
                  customStyles={{
                    paddingLeft: marginHorizontal.extraSmall,
                    // paddingTop: marginHorizontal.extraSmall,
                    ...labelStyle,
                  }}
                  text={label}
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
          style={[
            styles.inputContainer,
            {
              marginTop: innerLable
                ? spaceVertical.small
                : spaceVertical.XXS,
              borderWidth: IsFocus || error ? 1 : 1,
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
              backgroundColor: bgColor ? bgColor : colors.inputBg,
              // shadowColor: '#000000',
              // shadowOffset: {
              //   width: 0,
              //   height: 1.06,
              // },
              // shadowOpacity: 0.13,
              // shadowRadius: 2.0,
              // elevation: 4,
              ...customStyle,
            },
          ]}>
          {innerLable && (value || IsFocus) ? (
            <>
              {required ? (
                <View
                  style={[
                    (value || IsFocus)
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
                    customStyles={{ paddingTop: marginHorizontal.extraSmall }}
                    color="red">
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
                    (value || IsFocus)
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
          <TouchableOpacity
            onPress={() => {
              if (editFlag != 'Edit') {
                setShow(true);
              }
            }}
            style={styles.fieldView}>
            {/* <View > */}
            <Text
              style={[
                styles.placeholderStyle,
                {
                  marginTop: 4,
                  color: value ? colors.inputValue :
                    (placeholderColor
                      ? placeholderColor
                      : colors.placeholderColor),
                },
                placeholderStyle ? placeholderStyle : {},
              ]}>
              {value
                ? mode === 'time'
                  ? format(value, 'HH:mm')
                  : lanid == ''
                    ?
                    format(value, 'dd-MM-yyyy')
                    : format(value, 'dd/MM/yyyy')
                : placeholder
                  ? placeholder
                  :
                  'Select date'}
            </Text>
            <View
              style={
                (styles.icon,
                  [
                    {
                      marginTop: responsiveWidth(label ? 0 : 0),
                    },
                  ])
              }>
              <IonIcon
                name={mode === 'time' ? 'time-outline' : 'calendar-outline'}
                size={20}
                color={iconColor ? iconColor : colors.black}
              />
            </View>
            {/* </View> */}
          </TouchableOpacity>
          {show && (
            <DateTimePickerModal
              onFocus={() => setIsFocus(true)}
              isVisible={show}
              mode={mode ? mode : 'date'}
              onConfirm={date => {
                onChangeStart(date);
              }}
              onCancel={() => setShow(false)}
              maximumDate={maximum ? maximum : undefined}
              minimumDate={minimum ? minimum : undefined}
              editable={editable ? editable : true}
              maxTime={maxTime ? maxTime : undefined}
            />
          )}
        </View>
        {error ? (
          <CusText text={error} error customStyles={errorStyle} />
        ) : null}
      </View>
    </>
  );
};

export default DateTimePicker;

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: marginHorizontal.extraSmall,
    marginTop: spaceVertical.extraSmall,
    width: '100%',
  },

  fieldView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 3,
  },

  placeholderStyle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
  },

  icon: {
    alignSelf: 'center',
    fontSize: fontSize.medium,
  },
});
