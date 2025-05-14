import { StyleSheet } from 'react-native';
import { borderRadius, colors, fontSize, responsiveWidth, spaceVertical } from '../../../styles/variables';
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
  box: {
    borderWidth: 0.5,
    borderRadius: borderRadius.ring,
    padding: 4,
    width: responsiveWidth(20)
  },
  checkbox: {
    borderColor: colors.gray,
    borderWidth: 0.5,
    borderRadius: borderRadius.small,
    padding: 4,
    width: responsiveWidth(25),
     marginHorizontal:responsiveWidth(2)
  },
  HeaderRow: {
    marginVertical: responsiveWidth(3),
    marginHorizontal: responsiveWidth(2)
  },
  subHeaderRow: {
   marginLeft:responsiveWidth(22)
  },
  uploadFrame: {
    width: responsiveWidth(90),
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: borderRadius.normal,
    marginTop: responsiveWidth(5),
  
    
  },
  subtitle: {
    width: responsiveWidth(90)
  },
  button: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    backgroundColor: colors.quaternary,
    padding: 10,
    borderRadius: borderRadius.ring,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveWidth(3),
  },
  row: {
    marginTop: spaceVertical.extraSmall,
  }
});
export { styles };
