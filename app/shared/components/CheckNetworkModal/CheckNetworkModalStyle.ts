import { StyleSheet } from "react-native";
import { borderRadius, colors, fontFamily, fontSize, marginHorizontal, responsiveHeight, responsiveWidth, spaceVertical } from "../../../styles/variables";

const styles = StyleSheet.create({
    mainModal: {
        margin: 0,
        flexDirection: 'row',
        alignItems: "center",
        height: responsiveHeight(100)

    },

    modalView: {
        // flex:1,
        width: responsiveWidth(100),
        height: responsiveHeight(100),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: colors.bgColor,
        // borderRadius: borderRadius.boxRadius + 10,
        padding: marginHorizontal.semiSmall,
        overflow: 'hidden',
    },

    container: {
        flex: 1,
        alignItems: 'center',
        //   backgroundColor: colors.bgColor,
    },
    content: {
        width: responsiveWidth(90),
        flexDirection: 'column',
        alignContent: "center",
        justifyContent: "center",
        // alignItems: "center"
        //height:responsiveHeight(23)
    }, 

    loginImg: {
        tintColor: colors.white,
        marginTop: marginHorizontal.semiSmall,
        // width: responsiveWidth(30),
        width: 50,
        height: 50,
        resizeMode: 'contain'
    }, 
    router: {
        // flexDirection: "row",
        alignSelf: "center",
        // justifyContent: "flex-end",
        // alignItems: "center",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: colors.white,
        width: 100,
        height: 40,
        borderRadius: borderRadius.medium,
        // paddingHorizontal: spaceVertical.XXS * 0.9,
        marginTop: spaceVertical.normal
    },
    tower: {
        position: 'absolute',
        left: 10,
        bottom: "100%",
        width: 5,
        height: 50,
        backgroundColor: colors.white,
        borderRadius: borderRadius.medium,
    },
    routerIndicator: {
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "flex-end",
        alignItems: "center",
        width: 100,
        height: 35,
        paddingHorizontal: spaceVertical.XXS * 0.9,
    },
    routerDot: {
        width: 5,
        height: 5,
        backgroundColor: colors.red,
        borderRadius: borderRadius.medium,
        marginHorizontal: spaceVertical.XXS * 0.5
    },
    textInfo: {
        textAlign: 'center',
        marginTop: spaceVertical.normal,
    },
    textTitle: {
        textAlign: "center",
        fontFamily: fontFamily.medium,
        fontSize: fontSize.large,
        color: colors.white,
        marginBottom: spaceVertical.XXS,
    },
    textDescription: {
        textAlign: "center",
        color: colors.white,
    },
});
export { styles };
