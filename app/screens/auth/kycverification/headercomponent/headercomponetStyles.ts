import {StyleSheet} from 'react-native';
import { borderRadius, responsiveWidth } from '../../../../styles/variables';
const styles = StyleSheet.create({
    header: {
        overflow: "hidden",
        borderBottomLeftRadius:borderRadius.large,
        borderBottomRightRadius:borderRadius.large,
        width: responsiveWidth(100),
        display: "flex",
        justifyContent: "flex-end",
        position: "relative",
        zIndex: 1,
    },
    HeaderRow:{
     marginVertical:responsiveWidth(5),
     marginHorizontal:responsiveWidth(2)
    }
});
export {styles};
