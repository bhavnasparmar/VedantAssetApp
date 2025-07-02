import { StyleSheet } from "react-native";
import { borderRadius, colors, fontFamily, fontSize, responsiveWidth } from "../../../styles/variables";

const styles = StyleSheet.create({
    periodButton: {
        paddingVertical: responsiveWidth(1.5),
        paddingHorizontal: responsiveWidth(3),
        borderRadius: borderRadius.small,
        backgroundColor: colors.cardborder
    },
     chartpercentshow: {
        paddingVertical: responsiveWidth(1),
        paddingHorizontal: responsiveWidth(2),
        borderRadius: borderRadius.large,
        backgroundColor: colors.greenshade,
    },
    selectedPeriodButton: {
        backgroundColor: colors.secondary
    },
      tabContainer: {
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.small,
        padding: responsiveWidth(1),
    },
    tabButton: {
      //  flex: 1,
        padding: responsiveWidth(2),
        alignItems: 'center',
        borderRadius: borderRadius.small,
        width:responsiveWidth(25),
        backgroundColor:colors.cardborder,
        marginHorizontal:responsiveWidth(1),
    },
     saprator: {
        paddingHorizontal: responsiveWidth(2),
        backgroundColor: colors.headerlist,
        height: responsiveWidth(0.5),
       // marginVertical: responsiveWidth(2)
    },
    activeTabButton: {
        backgroundColor: colors.secondary,
        width:responsiveWidth(25),
         marginHorizontal:responsiveWidth(1),

    },
    section: {
        marginBottom: responsiveWidth(6),
    },
    infoItem: {
        borderBottomWidth: 1,
        borderBottomColor: colors.Hard_White,
        paddingVertical: responsiveWidth(3),
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendContainer: {
    // flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // marginTop: 30,
    paddingHorizontal: responsiveWidth(2),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 6,
  },
  legendColor: {
    width: responsiveWidth(4),
    height: responsiveWidth(4),
    borderRadius: borderRadius.small,
    marginRight: responsiveWidth(2),
  },
  legendText: {
    fontSize: fontSize.small,
    fontFamily:fontFamily.regular,
    color: colors.black,
  },
   timeframeContainer: {
        flexDirection: 'row',
        paddingVertical: responsiveWidth(1),
        gap: responsiveWidth(2)
    },
    timeframeButton: {
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(1.5),
        borderRadius: borderRadius.small,
        backgroundColor: colors.cardborder
    },
    activeTimeframeButton: {
        backgroundColor: colors.orange
    },
    tableHeader: {
        paddingVertical: responsiveWidth(3),
        borderBottomWidth: 1,
        borderBottomColor: colors.Hard_White,
        backgroundColor:colors.gridHeader,
    },
    tableContent: {
        paddingBottom: responsiveWidth(10)
    },
    schemeItem: {
        flexDirection: 'row',
        paddingVertical: responsiveWidth(3),
        borderBottomWidth: 1,
        borderBottomColor: colors.Hard_White,
        paddingHorizontal: responsiveWidth(4)
    },
     container: {
        flex: 1,
        padding: responsiveWidth(4),
    },
   
    summaryContainer: {
        padding: responsiveWidth(4),
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
    },
    detailsContainer: {
        padding: responsiveWidth(4),
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
    },
    holdingsContainer: {
        padding: responsiveWidth(4),
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
    },
   
   containerperformance: {
        flex: 1,
        padding: responsiveWidth(4),
    },
    timeframeContainerperformance: {
        flexDirection: 'row',
        paddingVertical: responsiveWidth(1),
        gap: responsiveWidth(2)
    },
    timeframeButtonperformance: {
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(1.5),
        borderRadius: borderRadius.small,
        backgroundColor: colors.Hard_White
    },
    activeTimeframeButtonperformance: {
        backgroundColor: colors.secondary
    },
    summaryContainerperformance: {
        padding: responsiveWidth(4),
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
    },
    detailsContainerperformance: {
        padding: responsiveWidth(4),
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
    },
    holdingsContainerperformance: {
        padding: responsiveWidth(4),
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
    },
    tabContainerperformance: {
        backgroundColor: colors.cardborder,
        borderRadius: borderRadius.small,
        padding: responsiveWidth(1),
    },
    tabButtonperformance: {
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(2),
        borderRadius: borderRadius.small,
    },
    activeTabButtonperformance: {
        backgroundColor: colors.orange,
    },
    holdingItem: {
        paddingVertical: responsiveWidth(3),
        borderBottomWidth: 1,
        borderBottomColor: colors.cardborder,
    }

});

export default styles;