
import { StyleSheet } from 'react-native';
import { borderRadius, responsiveWidth } from '../../../styles/variables';
const styles = StyleSheet.create({
    circleImage: {
        overflow: "hidden",
        borderBottomLeftRadius: 1000,
        borderBottomRightRadius: 1000,
        width: responsiveWidth(200),
        height: responsiveWidth(200),
        marginLeft: responsiveWidth(-50),
        marginTop: responsiveWidth(-130),
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: responsiveWidth(10)
    },
    loginimage: {
        resizeMode: 'contain',
        width: responsiveWidth(76),
        marginHorizontal: responsiveWidth(12),
        marginBottom: responsiveWidth(-25)
    },
    subtitle: {
        width: responsiveWidth(90)
    }
});
export { styles };
