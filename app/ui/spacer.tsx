import {View} from 'react-native';
import React from 'react';
import {marginHorizontal, spaceVertical} from '../styles/variables';

type spacerProps = {
  y?: 'XXS' | 'XS' | 'S' | 'SemiS' | 'N' | 'L' | 'XL' | 'XXL';
  x?: 'XXS' | 'XS' | 'S' | 'SemiS' | 'N' | 'L' | 'XL' | 'XXL' | 'XXXL';
};

const Spacer = ({y, x}: spacerProps) => {
  return (
    <View
      style={{
        height:
          y === 'XXS'
            ? spaceVertical.XXS
            : y === 'XS'
            ? spaceVertical.extraSmall
            : y === 'S'
            ? spaceVertical.small
            : y === 'SemiS'
            ? spaceVertical.semiSmall
            : y === 'N'
            ? spaceVertical.normal
            : y === 'L'
            ? spaceVertical.large
            : y === 'XL'
            ? spaceVertical.extraLarge
            : y === 'XXL'
            ? spaceVertical.XXlarge
            : 0,
        width:
          x === 'XXS'
            ? marginHorizontal.XXS
            : x === 'XS'
            ? marginHorizontal.extraSmall
            : x === 'S'
            ? marginHorizontal.small
            : x === 'SemiS'
            ? marginHorizontal.semiSmall
            : x === 'N'
            ? marginHorizontal.normal
            : x === 'L'
            ? marginHorizontal.large
            : x === 'XL'
            ? marginHorizontal.XLARGE
            : x === 'XXL'
            ? marginHorizontal.XXL
            : x === 'XXXL'
            ? marginHorizontal.XXXL
            : 0,
      }}
    />
  );
};

export default Spacer;
