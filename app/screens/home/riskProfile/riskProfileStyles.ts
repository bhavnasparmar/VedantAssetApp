import {  StyleSheet } from "react-native";
import {
    borderRadius,
    colors,
    responsiveWidth,
} from "../../../styles/variables";
export const styles = StyleSheet.create({
    gender: {
        width: responsiveWidth(25),
        borderRadius: borderRadius.medium,
        padding: 2,
        marginHorizontal: responsiveWidth(2)
    },
    option: {
        borderRadius: borderRadius.medium,
        backgroundColor: colors.cardBg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: responsiveWidth(3),
        paddingBottom: responsiveWidth(3)
    },
    slider: {
      width: '100%',
      height: 40,
      position: "relative",
      zIndex: 1,
    },
    markersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 10,
        marginTop: -24,
        position: "relative",
        zIndex: 0,
      },
      markerContainer: {
        alignItems: 'center',
      },
      marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.black,
        marginBottom: 5,
      },
      activeMarker: {
        backgroundColor: colors.purpleShades,
      },
      markerLabel: {
        color: colors.darkGray,
        fontSize: 12,
      },
    radioList: {
        borderWidth: 1,
        padding: responsiveWidth(3),
        borderRadius: borderRadius.medium,
        borderColor: colors.inputBorder,
        marginBottom: responsiveWidth(3)
    },
    radioListActive: {
        borderColor: colors.primary
    },
    scoreContainer: {
        alignItems: 'center',
      },
      scoreText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.black,
      },
      label: {
        fontSize: 16,
        color: colors.black,
      },
});