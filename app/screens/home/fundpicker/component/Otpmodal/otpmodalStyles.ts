import { StyleSheet } from "react-native";
import { borderRadius, colors, fontFamily, fontSize, responsiveWidth } from "../../../../../styles/variables";

const styles = StyleSheet.create({

    alertView: {
        backgroundColor: colors.Hard_White,
        // height: responsiveHeight(25),
        width: responsiveWidth(85),
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: borderRadius.medium,
        padding:responsiveWidth(3)
    },
    saprator: {
        paddingHorizontal: responsiveWidth(2),
        backgroundColor: colors.headerlist,
        height: responsiveWidth(0.35),
       // marginVertical: responsiveWidth(2)
    },
     input: {
        fontFamily: fontFamily.semiBold,
        textAlign: "center",
        color: colors.black,
        fontSize : fontSize.semiLarge,
    },

});
export { styles };