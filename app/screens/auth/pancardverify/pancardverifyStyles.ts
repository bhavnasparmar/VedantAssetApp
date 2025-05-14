import { StyleSheet } from 'react-native';
import { borderRadius, responsiveWidth } from '../../../styles/variables';
const styles = StyleSheet.create({
  subHeader: {
    overflow: "hidden",
    borderBottomLeftRadius: borderRadius.large,
    borderBottomRightRadius: borderRadius.large,
    width: responsiveWidth(100),
    display: "flex",
    justifyContent: "flex-end",
    marginTop: -15,
    paddingTop: 15,
    position: "relative",
    zIndex: 0,
  },
  HeaderRow: {
    marginVertical: responsiveWidth(3),
    marginHorizontal: responsiveWidth(2),
    
  },
  
});
export { styles };
