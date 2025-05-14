/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  spaceVertical,
} from '../styles/variables';
import {AppearanceContext} from '../context/appearanceContext'; 

type textProps = TextProps & {
  customStyles?: TextStyle;
  header?: boolean;
  error?: boolean;
  text: any;
  label?: boolean;
  position?: 'center' | 'right' | 'left' | 'justify';
  bold?: boolean;
  underline?: boolean;
  strikethrough?:boolean;
  semibold?: boolean;
  medium?: boolean;
  extraBold?: boolean;
  title?: boolean;
  color?: string;
  size?: 'XXXS' | 'XXS' | 'NS' | 'XS' | 'XMS' | 'S' | 'MS' | 'SS' | 'N' | 'SN' | 'M' | 'SL' | 'L' | 'XL' | 'XXL' | 'XXXL';
  onPress?: any;
  lineHeight?: number;
  shadow?: boolean;
  numOfLines?: number;
  viewStyle?: ViewStyle;
};

const CusText = ({
  onTextLayout,
  ellipsizeMode,
  customStyles,
  header,
  error,
  text,
  label,
  position,
  semibold,
  size,
  numOfLines,
  viewStyle,
  color,
  bold,
  medium,
  extraBold,
  title,
  underline,
  strikethrough,
  onPress,
  lineHeight,
  shadow,
}: textProps) => {
  const {colors}: any = React.useContext(AppearanceContext);
  return (
    <View
      style={{
        alignSelf:
          position === 'center'
            ? 'center'
            : position === 'right'
            ? 'flex-end'
            : position === 'left'
            ? 'flex-start'
            : undefined,
        ...viewStyle,
      }}>
      <Text
      onTextLayout={onTextLayout}
        ellipsizeMode={ellipsizeMode}
        numberOfLines={numOfLines ? numOfLines : undefined}
        style={[
          error && styles.errorText,
          {
            shadowColor: shadow ? colors.black : undefined,
            textShadowOffset: shadow ? {width: 2, height: 4} : undefined,
            shadowOpacity: shadow ? 0.9 : undefined,
            textShadowRadius: shadow ? borderRadius.medium : undefined,
            elevation: shadow ? 10 : undefined,
            fontSize:
              size === 'NS'
                ? fontSize.nanoSmall
                : size === 'XXXS'
                ? fontSize.XXXS
                : size === 'XXS'
                ? fontSize.XXS
                : size === 'XS'
                ? fontSize.extraSmall
                : size === 'XMS'
                ? fontSize.XMS
                : size === 'S'
                ? fontSize.small
                : size === 'MS'
                ? fontSize.middleSmall
                : size === 'SS'
                ? fontSize.semiSmall
                : size === 'N'
                ? fontSize.normal
                : size === 'SN'
                ? fontSize.semiNormal
                : size === 'M'
                ? fontSize.medium
                : size === 'SL'
                ? fontSize.semiLarge
                : size === 'L'
                ? fontSize.large
                : size === 'XL' || header
                ? fontSize.extraLarge
                : size === 'XXL'
                ? fontSize.XXL
                : size === 'XXXL'
                ? fontSize.XXXL
                : fontSize.small,

                textAlign:
                position === 'center'
                  ? 'center'
                  : position === 'right'
                  ? 'right'
                  : position === 'left'
                  ? 'left'
                  : position === 'justify'
                  ? 'justify'
                  : undefined,
  

            fontFamily:
              header || bold
                ? fontFamily.bold
                : semibold || label
                ? fontFamily.semiBold
                : medium || label
                ? fontFamily.medium
                : extraBold || label
                ? fontFamily.extraBold
                : title || label
                ? fontFamily.title
                : fontFamily.regular,

            textDecorationLine: underline ? 'underline' : strikethrough? 'line-through':'none',

            color: error
              ? colors?.red
              : label
              ? colors?.label
              : color
              ? color
              : colors?.black,

            lineHeight: lineHeight ? lineHeight : undefined,
            ...customStyles,
          },
        ]}
        onPress={onPress}>
        {text}
      </Text>
    </View>
  );
};

export default CusText;

const styles = StyleSheet.create({
  errorText: {
    fontSize: fontSize.small,
    color: colors.red,
    marginTop: spaceVertical.XXS,
  },
});
