import { StyleSheet } from "react-native";
import { borderRadius, colors, responsiveHeight, responsiveWidth } from "../../../styles/variables";


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    modalContainer: {
        borderRadius: borderRadius.large,
        padding: responsiveWidth(5),

        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        marginVertical: responsiveWidth(4),
    },
    description: {
        textAlign: 'center',
        marginBottom: responsiveHeight(3),

    },
    buttonContainer: {
        flexDirection: 'row',
       // justifyContent: 'space-between',
       
    },
    button: {
        backgroundColor: colors.primary,
        padding: responsiveWidth(3),
        borderRadius: borderRadius.normal,
        flex: 1,
        marginHorizontal: responsiveHeight(1),
        alignItems: 'center',
    },
    buttonText: {
        color: colors.Hard_White,
    },
})
export { styles };