import {View, ViewStyle} from 'react-native';
import React from 'react';

type wrapperProps = {
  position?: 'center' | 'end' | 'start';
  itemPosition?: 'center' | 'right' | 'apart' | 'spAround' | 'spEven' | 'left';
  children?: React.ReactNode;
  row?: boolean;
  flex?: boolean;
  customStyles?: ViewStyle;
  height?: number | string;
  width?: number | string;
  color?: string;
  align?: 'center' | 'end' | 'start';
  justify?: 'center' | 'right' | 'apart' | 'spAround' | 'spEven' | 'left';
  borderColor?: string;
};

const Wrapper = ({
  position,
  children,
  row,
  flex,
  width,
  height,
  color,
  align,
  justify,
  borderColor,
  customStyles,
}: wrapperProps) => {
  return (
    <View
      style={{
        flex: flex ? 1 : undefined,
        flexDirection: row ? 'row' : 'column',
        alignSelf:
          position === 'center'
            ? 'center'
            : position === 'end'
            ? 'flex-end'
            : position === 'start'
            ? 'flex-start'
            : undefined,
        alignItems:
          align === 'center'
            ? 'center'
            : align === 'end'
            ? 'flex-end'
            : align === 'start'
            ? 'flex-start'
            : undefined,
        justifyContent:
          justify === 'apart'
            ? 'space-between'
            : justify === 'spAround'
            ? 'space-around'
            : justify === 'center'
            ? 'center'
            : justify === 'right'
            ? 'flex-end'
            : justify === 'spEven'
            ? 'space-evenly'
            : justify === 'left'
            ? 'flex-start'
            : undefined,
        width: width ? width : undefined,
        height: height ? height : undefined,
        backgroundColor: color ? color : 'transparent',
        borderColor: borderColor ? borderColor : undefined,
        ...customStyles,
      }}>
      {children!}
    </View>
  );
};

export default Wrapper;
