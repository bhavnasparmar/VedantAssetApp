import { StyleSheet } from "react-native";
import { colors, fontFamily, fontSize, responsiveHeight, responsiveWidth } from "../../../styles/variables";


const styles = StyleSheet.create({

  contains: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cardDesign: {
   marginTop: responsiveHeight(-15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: fontSize.medium,
    fontFamily: fontFamily.regular,
    color: colors.gray
    //marginTop: spaceVertical.extraSmall
  },
});

export { styles }