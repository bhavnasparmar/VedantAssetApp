import {StyleSheet} from 'react-native';
import { borderRadius, colors, responsiveWidth } from '../../../../styles/variables';


const styles = StyleSheet.create({
   clear: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.large,
    padding: responsiveWidth(2),
    marginLeft: responsiveWidth(2),
  },

  dropdown: {
      height: 50,
      backgroundColor: 'transparent',
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 14,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    icon: {
      marginRight: 5,
    },
    selectedStyle: {
      borderRadius: 12,
    },

});
export {styles};
