import { StyleSheet } from "react-native";
import { borderRadius, colors, responsiveHeight, responsiveWidth } from "../../../styles/variables";


const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.Hard_White,
        width: responsiveWidth(95),
        borderRadius: responsiveWidth(2),
        marginTop: responsiveWidth(3),
        alignSelf: 'center',
    },
    innercard: {
        backgroundColor: colors.Hard_White,
        width: responsiveWidth(90),
        borderRadius: responsiveWidth(2),
        marginTop: responsiveWidth(3),
        alignSelf: 'center',
        padding: responsiveWidth(2),
        paddingVertical: responsiveHeight(2)
    },
    searchcard: {
        backgroundColor: colors.darkGrayShades,
        width: responsiveWidth(95),
        borderRadius: responsiveWidth(4),
        alignSelf: 'center',
        borderBottomWidth: 0.5,
        borderColor: colors.gray,
        paddingHorizontal: responsiveWidth(2),
        paddingBottom: responsiveWidth(3)
    },
    filterbutton: {
        width: responsiveWidth(13),
        height: responsiveWidth(13),
        padding: 10,
        borderRadius: borderRadius.medium,
        marginTop: responsiveWidth(5)
    },
    image: {
        height: responsiveHeight(12),
        width: responsiveWidth(12),
        marginTop:responsiveHeight(-2)
    },
    button: {
        // backgroundColor: colors.primary,
        borderRadius: borderRadius.medium,
        padding: 5,
        paddingHorizontal: responsiveWidth(5),
        paddingVertical: responsiveWidth(2),
        marginRight: responsiveWidth(3)
    },
    sectralfield: {
        borderColor: colors.Hard_White,
        borderWidth: 0.5,
        borderRadius: borderRadius.normal,
        padding: 3,
        marginRight: responsiveWidth(2)
    },
    personIcon: {
        marginRight: responsiveWidth(1)
    },
    saprator: {
        width: responsiveWidth(50),
        alignSelf: 'center',
        backgroundColor: colors.Hard_White,
        borderWidth: 0.5
    },
    radioCircle: {
        height: 15,
        width: 15,
        borderRadius: borderRadius.ring,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(1)
    },
})
export { styles };