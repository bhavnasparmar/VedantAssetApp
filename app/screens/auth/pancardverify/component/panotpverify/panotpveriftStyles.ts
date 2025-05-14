import {StyleSheet} from 'react-native';
import { borderRadius, responsiveWidth } from '../../../../../styles/variables';
const styles = StyleSheet.create({
    modalView: {},
    modal: {
        borderRadius: borderRadius.large,
        shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1.06,
    },
    shadowOpacity: 0.13,
    shadowRadius: 12.0,
    elevation: 10,
    },
    subtitle:{
        width:responsiveWidth(80)
    }
});
export {styles};
