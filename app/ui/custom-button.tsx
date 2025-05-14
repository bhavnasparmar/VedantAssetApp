/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {
  borderRadius,
  btnHeight,
  btnWidth,
  colors,
  fontFamily,
  fontSize,
  responsiveHeight,
} from '../styles/variables';

type params = {
  title?: string;
  height?: number;
  width?: number | string;
  radius?: number;
  textStyle?: TextStyle;
  textArea?: number | string;
  iconName?: string;
  iconImage?: string;
  iconStyle?: TextStyle;
  buttonStyle?: ViewStyle;
  innerStyle?: ViewStyle;
  type?: 'success' | 'delete' | 'transparent';
  onPress?: any;
  color?: string;
  disabled?: boolean;
  position?: 'start' | 'center' | 'end';
  iconFirst?: boolean;
  iconColor?: string;
  iconBackground?: string;
  iconViewType?: 'circle' | 'square';
  iconSize?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  iconPress?: any;
  customIconViewSize?: number;
  customIconSize?: number;
  lgcolor1?: string;
  lgcolor2?: string;
  textcolor?: string;
  textSize?: 'XXXS' | 'XXS' | 'NS' | 'XS' | 'XMS' | 'S' | 'MS' | 'SS' | 'N' | 'SN' | 'M' | 'SL' | 'L' | 'XL' | 'XXL' | 'XXXL';
  textWeight?: 'bold' | 'semibold';
  customStyle?: any;
  loading?: boolean;
  loadingStyle?: TextStyle;
  shadow?: boolean;
  children?: React.ReactNode;
};
const CusButton = ({
  iconStyle,
  title,
  height,
  width,
  radius,
  textArea,
  textStyle,
  iconName,
  iconImage,
  buttonStyle,
  onPress,
  innerStyle,
  type,
  color,
  disabled,
  position,
  iconFirst,
  iconPress,
  iconBackground,
  iconViewType,
  iconSize,
  customIconViewSize,
  customIconSize,
  iconColor,
  lgcolor1,
  lgcolor2,
  textcolor,
  textSize,
  textWeight,
  customStyle,
  loading,
  loadingStyle,
  shadow,
  children,
}: params) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled || loading}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[
          lgcolor1 ? lgcolor1 : color ? color : colors.secondary,
          lgcolor2 ? lgcolor2 : color ? color : colors.secondary,
        ]}
        style={[
          styles.button,
          buttonStyle,
          {
            shadowColor: shadow ? colors.black : undefined,
            shadowOffset: shadow ? { width: 2, height: 4 } : undefined,
            shadowOpacity: shadow ? 0.9 : undefined,
            shadowRadius: shadow ? borderRadius.large : undefined,
            elevation: shadow ? 10 : undefined,
            backgroundColor:
              type === 'success'
                ? colors.green
                : type === 'delete'
                  ? colors.red
                  : type === 'transparent'
                    ? 'transparent'
                    : color
                      ? color
                      : colors.secondary,
            opacity: disabled ? 0.6 : 1,
            alignSelf:
              position === 'center'
                ? 'center'
                : position === 'start'
                  ? 'flex-end'
                  : position === 'end'
                    ? 'flex-start'
                    : 'auto',
            height: height ? height : btnHeight,
            width: width ? width : btnWidth.normal,
            borderRadius: radius ? radius : borderRadius.medium,
            ...customStyle,
          },
        ]}>

        {loading ? (
          <ActivityIndicator color={colors.Hard_White} style={loadingStyle} />
        ) : (
          <View
            style={{
              flexDirection: iconFirst ? 'row-reverse' : 'row',
              alignItems: 'center',
              ...innerStyle,
            }}>
            {/* Text */}
            {title && (
              <Text
                style={[
                  styles.text,
                  textStyle,
                  {
                    width: textArea ? textArea : '80%',
                    color: textcolor ? textcolor : colors.white,
                    fontSize:
                      textSize === 'NS'
                        ? fontSize.nanoSmall
                        : textSize === 'XXXS'
                          ? fontSize.XXXS
                          : textSize === 'XXS'
                            ? fontSize.XXS
                            : textSize === 'XS'
                              ? fontSize.extraSmall
                              : textSize === 'XMS'
                                ? fontSize.XMS
                                : textSize === 'S'
                                  ? fontSize.small
                                  : textSize === 'MS'
                                    ? fontSize.middleSmall
                                    : textSize === 'SS'
                                      ? fontSize.semiSmall
                                      : textSize === 'N'
                                        ? fontSize.normal
                                        : textSize === 'SN'
                                          ? fontSize.semiNormal
                                          : textSize === 'M'
                                            ? fontSize.medium
                                            : textSize === 'SL'
                                              ? fontSize.semiLarge
                                              : textSize === 'L'
                                                ? fontSize.large
                                                : textSize === 'XL'
                                                  ? fontSize.extraLarge
                                                  : textSize === 'XXL'
                                                    ? fontSize.XXL
                                                    : textSize === 'XXXL'
                                                      ? fontSize.XXXL
                                                      : fontSize.semiLarge,
                    fontFamily:
                      textWeight === 'bold'
                        ? fontFamily.bold
                        : textWeight === 'semibold'
                          ? fontFamily.semiBold
                          : textWeight === 'regular'
                            ? fontFamily.regular
                            : fontFamily.regular,
                  },
                ]}>
                {title}
              </Text>
            )}

            {/* Icon */}
            {iconName || iconImage ? (
              <>
                <Pressable
                  onPress={iconPress}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: iconBackground
                      ? iconBackground
                      : 'transparent',
                    height:
                      iconSize === 'XS'
                        ? responsiveHeight(2.5)
                        : iconSize === 'S'
                          ? responsiveHeight(3.5)
                          : iconSize === 'M'
                            ? responsiveHeight(4)
                            : iconSize === 'L'
                              ? responsiveHeight(4.5)
                              : iconSize === 'XL'
                                ? responsiveHeight(5.5)
                                : customIconViewSize
                                  ? customIconViewSize
                                  : responsiveHeight(3),
                    width:
                      iconSize === 'XS'
                        ? responsiveHeight(2.5)
                        : iconSize === 'S'
                          ? responsiveHeight(3.5)
                          : iconSize === 'M'
                            ? responsiveHeight(4)
                            : iconSize === 'L'
                              ? responsiveHeight(4.5)
                              : iconSize === 'XL'
                                ? responsiveHeight(5.5)
                                : customIconViewSize
                                  ? customIconViewSize
                                  : responsiveHeight(3),
                    borderRadius:
                      iconViewType === 'circle' ? borderRadius.medium : 0,
                  }}>
                  {/* <IonIcon
                    name={iconName}
                    size={
                      iconSize === 'XS'
                        ? fontSize.medium
                        : iconSize === 'S'
                          ? fontSize.large
                          : iconSize === 'M'
                            ? fontSize.extraLarge
                            : iconSize === 'L'
                              ? fontSize.Xlarge
                              : iconSize === 'XL'
                                ? fontSize.XXLarge
                                : iconSize === 'XXL'
                                  ? fontSize.XXXLarge
                                  : customIconSize
                                    ? customIconSize
                                    : fontSize.semiLarge
                    }
                    color={iconColor ? iconColor : colors.white}
                    style={iconStyle}
                  /> */}
                  {iconImage ? (
                    <Image
                      source={iconImage}
                      style={{
                        width: customIconSize || responsiveHeight(3),
                        height: customIconSize || responsiveHeight(3),
                        resizeMode: 'contain',
                        tintColor: iconColor ? iconColor : colors.white,
                        ...iconStyle,
                      }}
                    />
                  ) : (
                    <IonIcon
                      name={iconName}
                      size={
                        iconSize === 'XS'
                          ? fontSize.medium
                          : iconSize === 'S'
                            ? fontSize.large
                            : iconSize === 'M'
                              ? fontSize.extraLarge
                              : iconSize === 'L'
                                ? fontSize.Xlarge
                                : iconSize === 'XL'
                                  ? fontSize.XXLarge
                                  : iconSize === 'XXL'
                                    ? fontSize.XXXLarge
                                    : customIconSize
                                      ? customIconSize
                                      : fontSize.semiLarge
                      }
                      color={iconColor ? iconColor : colors.white}
                      style={iconStyle}
                    />
                  )}
                </Pressable>
              </>
            ) : null}

          </View>
        )}
        {children!}

      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CusButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    textAlign: 'center',
  },
});
