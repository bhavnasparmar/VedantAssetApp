import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  marginHorizontal,
  responsiveHeight,
  responsiveWidth,
  spaceVertical,
} from '../styles/variables';
import CusText from './custom-text';
import Wrapper from './wrapper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {AppearanceContext} from '../context/appearanceContext';
import {DropdownProps} from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';

// type item = {
//   label: string,
//   value: string,
// }
type dropdownProps = DropdownProps & {
  multiSelection?: boolean;
  labelField: string;
  valueField: string;
  data: any[];
  value?: string;
  width?: string | number;
  placeholder?: string;
  label?: string;
  labelStyle?: TextStyle;
  borderColor?: string;
  fieldColor?: string;
  fieldViewStyle?: ViewStyle;
  prefix?: string;
  preffixStyle?: TextStyle;
  preffixSize?: number;
  preffixColor?: string;
  preffixArea?: string | number;
  preffixPress?: any;
  preffixIcon?: string;
  suffix?: string;
  suffixStyle?: TextStyle;
  suffixSize?: number;
  suffixColor?: string;
  suffixArea?: string | number;
  suffixPress?: any;
  suffixIcon?: string | null;
  error?: string | null;
  disable?: boolean;
};
const DropDown = ({
  data,
  multiSelection,
  labelField,
  valueField,
  onChange,
  width,
  value,
  placeholder,
  label,
  labelStyle,
  borderColor,
  fieldColor,
  fieldViewStyle,
  prefix,
  preffixStyle,
  preffixSize,
  preffixColor,
  preffixArea,
  preffixPress,
  preffixIcon,
  suffix,
  suffixStyle,
  suffixSize,
  suffixColor,
  suffixArea,
  suffixPress,
  suffixIcon,
  error,
  errorStyle,
  disable,
}: dropdownProps) => {
  const {colors}: any = React.useContext(AppearanceContext);
  const renderDropdownItem = (item: any) => {
    return (
      <>
        <Wrapper
          row
          customStyles={styles.DDRow}
          color={colors.BACKGROUND_COLOR}>
          {/* <Wrapper customStyles={styles.DDLeft} color={colors.BACKGROUND_COLOR}></Wrapper> */}
          <Wrapper
            align="center"
            row
            customStyles={styles.DD}
            color={colors.BACKGROUND_COLOR}>
            <CusText text={item[labelField]} size="S" color={colors.black} />
          </Wrapper>
          {/* <Wrapper customStyles={styles.DDRight}></Wrapper> */}
        </Wrapper>
      </>
    );
  };

  const renderDataItem = (item: any) => {
    return (
      <View style={styles.item} key={item?.id}>
        <Text style={styles.selectedTextStyle}>{item[labelField]}</Text>
       
      </View>
    );
  };
  const selectedValuesList = () => {
    let val = '';

    return val;
  };

  return (
    <>
      {multiSelection ? (
        <View>
          {label ? (
            <View
              style={{
                marginTop: spaceVertical.small,
              }}>
              <CusText
                customStyles={{
                  marginBottom: spaceVertical.extraSmall,
                  ...labelStyle,
                }}
                text={label}
                size="XS"
                medium
              />
            </View>
          ) : null}
          <Wrapper>
            <MultiSelect
              search
              disable={disable}
              data={data}
              labelField={labelField}
              valueField={valueField}
              placeholder={placeholder}
              placeholderStyle={[styles.selected, {color: colors.placeholder}]}
              value={value}
              onChange={onChange}
              activeColor={colors.secondary}
              style={[
                {
                 // height: responsiveHeight(2),
                  width: width ? width : '100%',
                  borderColor: borderColor ? borderColor : colors.inputBorder,
                  borderWidth: 1,
                  backgroundColor: fieldColor ? fieldColor : colors.inputBg,
                  borderRadius: 12,
                  paddingHorizontal: responsiveWidth(2),
                  paddingVertical : responsiveWidth(1)
                },
              ]}
              selectedTextStyle={[styles.selected, {color: colors.black}]}
              // renderItem={(item: any) => renderDropdownItem(item)}
              renderItem={renderDataItem}
              renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity key={valueField} onPress={() => unSelect && unSelect(item)}>
                  <View style={[styles.selectedStyle, {borderColor: colors.lightGray}]}>
                    <CusText
                      size="XS"
                    customStyles={styles.textSelectedStyle}
                     // style={styles.textSelectedStyle}
                      text={item[labelField]}
                    />
                    <IonIcon color={colors.red} name="close" size={17} style={styles.remove} />
                  </View>
                </TouchableOpacity>
              )}
              iconColor={colors.black}
              containerStyle={{
                backgroundColor: colors.BACKGROUND_COLOR,
                borderRadius: borderRadius.normal,
                padding: responsiveWidth(2),
                width: '100%',
              }}
            />
          </Wrapper>
        </View>
      ) : (
        <View>
          {/* Field */}
          <View>
            {label ? (
              <View
                style={{
                  marginTop: spaceVertical.small,
                }}>
                <CusText
                  customStyles={{
                    marginBottom: spaceVertical.extraSmall,
                    ...labelStyle,
                  }}
                  text={label}
                  size="XS"
                  medium
                />
              </View>
            ) : null}

            <View
              style={[
                styles.inputRow,
                {
                  // borderWidth: bordered ? 1 : 0,
                  // borderRadius: radius ? radius : 0,
                  width: width ? width : '100%',
                  borderColor: borderColor ? borderColor : colors.inputBorder,
                  backgroundColor: fieldColor ? fieldColor : colors.inputBg,
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

              {/* Input */}

              <Dropdown
                search
                disable={disable}
                data={data}
                labelField={labelField}
                valueField={valueField}
                placeholder={placeholder}
                placeholderStyle={[
                  styles.selected,
                  {color: colors.placeholder},
                ]}
                value={value}
                onChange={onChange}
                activeColor={colors.secondary}
                style={{width: '100%'}}
                selectedTextStyle={[styles.selected, {color: colors.black}]}
                renderItem={(item: any) => renderDropdownItem(item)}
                iconColor={colors.black}
                containerStyle={{
                  backgroundColor: colors.BACKGROUND_COLOR,
                  borderRadius: borderRadius.normal,
                  padding: responsiveWidth(2),
                }}
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
                    },
                  ]}
                  onPress={suffixPress}
                />
              )}
            </View>
          </View>

          {/* Error */}
          {error ? (
            <CusText
              text={error}
              error
              // position="center"
              customStyles={errorStyle}
            />
          ) : null}
        </View>
      )}
    </>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  selected: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.small,
  },
  DD: {
    width: '84%',
    paddingVertical: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(1),
    // borderWidth: 0,
    // marginTop: -2,
    // marginBottom: -3,
    // borderWidth: 2,
    // borderColor: colors.primary,
    // borderStyle: "dotted",
  },
  DDRow: {
    // paddingHorizontal: responsiveWidth(2),
    position: 'relative',
    // backgroundColor: colors.BACKGROUND_COLOR,
  },
  DDLeft: {
    width: '10%',
    position: 'relative',
    right: -4,
    // backgroundColor: colors.BACKGROUND_COLOR,
    zIndex: 9,
    borderTopLeftRadius: borderRadius.normal,
    borderBottomLeftRadius: borderRadius.normal,
  },
  DDRight: {
    width: '10%',
    position: 'relative',
    left: -4,
    // backgroundColor: colors.BACKGROUND_COLOR,
    zIndex: 9,
    borderTopRightRadius: borderRadius.normal,
    borderBottomRightRadius: borderRadius.normal,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: marginHorizontal.extraSmall,
    paddingHorizontal: marginHorizontal.extraSmall,
    paddingVertical: responsiveWidth(1),
    // borderBottomWidth: 1,
    borderRadius: borderRadius.normal,
    borderWidth: 1,
  },
  prefix: {
    fontFamily: fontFamily.regular,
    height: '100%',
    textAlignVertical: 'center',
    paddingRight: responsiveWidth(3),
    textAlign: 'right',
  },

  suffix: {
    fontFamily: fontFamily.regular,
    textAlign: 'left',
    height: '100%',
    textAlignVertical: 'center',
    paddingLeft: responsiveWidth(3),
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    // backgroundColor: colors.lightGray,
    shadowColor: '#000',
    marginTop: 8,
    marginRight : responsiveWidth(1),
    paddingHorizontal: 2,
    paddingVertical: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 2,
  },
  remove: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.ring,
    padding: 2,
    marginLeft: 2,
  },
  textSelectedStyle: {
    marginRight: 1,  
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedTextStyle: {
    fontSize: 14,
  },
});
