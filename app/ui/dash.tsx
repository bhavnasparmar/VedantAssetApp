import {View, ViewStyle} from 'react-native';
import React from 'react';
import Wrapper from './wrapper';
import { AppearanceContext } from '../context/appearanceContext';

type dashProps = {
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
  gap?: number | string;
  dash?: number | string;
};

const Dash = ({
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
  gap,
  dash,
}: dashProps) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const items = Array.from({ length: 150 }, (_, index) => index + 1);
  return (
    <View
      style={{
        gap: gap ? gap : 2,
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
        // backgroundColor: color ? color : 'transparent',
        borderColor: borderColor ? borderColor : undefined,
        ...customStyles,
      }}>
        {items.map((item,index) => (
            row ? 
            <Wrapper key={index}  width={dash ? dash : 5} height={1} customStyles={{backgroundColor: color ? color : 'transparent'}} />
            :
            <Wrapper key={index}  width={1} height={dash ? dash : 5} customStyles={{backgroundColor: color ? color : 'transparent'}} />
        ))}
    </View>
  );
};

export default Dash;
