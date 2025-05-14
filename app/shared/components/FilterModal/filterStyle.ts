import { StyleSheet } from "react-native";
import { borderRadius, colors, responsiveHeight, responsiveWidth } from "../../../styles/variables";


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        paddingHorizontal: responsiveWidth(0),
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        padding: 15,
    },
    cancelText: {
        fontSize: 16,
        textAlign: 'center',
        color: 'red',
    },
})
export { styles };