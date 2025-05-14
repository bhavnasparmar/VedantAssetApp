import { StyleSheet } from "react-native";
import { borderRadius, colors, fontFamily, fontSize, responsiveHeight, responsiveWidth, spaceVertical } from "../../../styles/variables";


const styles = StyleSheet.create({

    alertView: {
        backgroundColor: colors.Hard_White,
        // height: responsiveHeight(25),
        width: responsiveWidth(85),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: borderRadius.medium,
    },

    Alerttitle: {
        fontFamily: fontFamily.semiBold,
        fontSize: fontSize.medium,
        marginTop: spaceVertical.small,
        color: colors.black,
        textAlign : "center",
        paddingHorizontal : responsiveWidth(2),
        paddingBottom:spaceVertical.small
    },

    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '90%',
        paddingBottom: spaceVertical.semiSmall
    },

    Alertbutton: {
        height: responsiveHeight(6),
        width: responsiveWidth(32),
        borderRadius: borderRadius.medium,
        backgroundColor:colors.primary,
        justifyContent: 'center'
    },

    btnText: {
        alignSelf: 'center',
        color: colors.white,
        fontFamily: fontFamily.semiBold
    },
    Alertsubtitle: {
        fontFamily: fontFamily.semiBold,
        fontSize: fontSize.medium,
        color: colors.black,
        textAlign : "center",
        paddingHorizontal : responsiveWidth(2)     
    },

})

export { styles }