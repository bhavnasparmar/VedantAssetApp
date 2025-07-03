import { FlatList, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import styles from "../funpickerdetailstyles";
import { borderRadius, colors, responsiveWidth } from "../../../../styles/variables";
import Wrapper from "../../../../ui/wrapper";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import { useState } from "react";



const Holding = () => {
     const [activeTab, setActiveTab] = useState('Summary');
        // Sample holdings data
    const holdingsData = [
        { name: 'Domestic Equities', percentage: 65 },
        { name: 'Cash & Cash Equivalents', percentage: 12 },
        { name: 'Corporate Debt', percentage: 8 },
        { name: 'Government Securities', percentage: 6 },
        { name: 'Treasury Bills', percentage: 4 },
        { name: 'REITs & InvITs', percentage: 2 },
        { name: 'Certificate of Deposit', percentage: 1 },
        { name: 'PTC & Securitized Debt', percentage: 1 },
        { name: 'Commercial Paper', percentage: 1 },
        { name: 'Rights', percentage: 0 }
    ];
    const renderHoldings = () => (
        <Wrapper customStyles={additionalStyles.holdingsContainer}>
            <Wrapper row customStyles={styles.tabContainer}>
                <TouchableOpacity 
                    style={[
                        styles.tabButton, 
                        activeTab === 'Summary' && styles.activeTabButton
                    ]}
                    onPress={() => setActiveTab('Summary')}
                >
                    <CusText
                        text="Summary"
                        size="S"
                        color={activeTab === 'Summary' ? colors.Hard_White : colors.black}
                        bold={activeTab === 'Summary'}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[
                        styles.tabButton, 
                        activeTab === 'Domestic Equities' && styles.activeTabButton
                    ]}
                    onPress={() => setActiveTab('Domestic Equities')}
                >
                    <CusText
                        text="Domestic Equities"
                        size="S"
                        color={activeTab === 'Domestic Equities' ? colors.Hard_White : colors.black}
                        bold={activeTab === 'Domestic Equities'}
                    />
                </TouchableOpacity>
            </Wrapper>
            
            <Spacer y="N" />
            
            {activeTab === 'Summary' && (
                <FlatList
                    data={holdingsData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Wrapper row justify="apart" customStyles={additionalStyles.holdingItem}>
                            <CusText
                                text={item.name}
                                size="S"
                                color={colors.black}
                            />
                            <CusText
                                text={`${item.percentage}%`}
                                size="S"
                                color={colors.black}
                                bold
                            />
                        </Wrapper>
                    )}
                    scrollEnabled={false}
                />
            )}
            
            {activeTab === 'Domestic Equities' && (
                <Wrapper customStyles={additionalStyles.comingSoonContainer}>
                    <CusText
                        text="Detailed equity holdings will be available soon"
                        size="S"
                        color={colors.gray}
                    />
                </Wrapper>
            )}
        </Wrapper>
    );
    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {renderHoldings()}   
        </ScrollView>
    )
    
};
const additionalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: responsiveWidth(4),
        backgroundColor: colors.Hard_white,
        width:responsiveWidth(100)
    },
      tabButton1: {
      //  flex: 1,
        padding: responsiveWidth(2),
        alignItems: 'center',
        borderRadius: borderRadius.small,
       // width:responsiveWidth(25),
        backgroundColor:colors.cardborder,
        marginRight:responsiveWidth(2)
    },
    navHeaderContainer: {
        padding: responsiveWidth(4),
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
    },
    performanceTableContainer: {
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
        padding: responsiveWidth(2),
    },
    performanceRow: {
        flexDirection: 'row',
        paddingVertical: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(2),
        borderBottomWidth: 1,
        borderBottomColor: colors.cardborder,
    },
    holdingsContainer: {
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
        padding: responsiveWidth(4),
    },
    tabContainer: {
        backgroundColor: colors.cardborder,
        borderRadius: borderRadius.small,
        padding: responsiveWidth(1),
    },
    tabButton: {
        flex: 1,
        paddingVertical: responsiveWidth(2),
        alignItems: 'center',
        borderRadius: borderRadius.small,
    },
    activeTabButton: {
        backgroundColor: colors.orange,
    },
    holdingItem: {
        paddingVertical: responsiveWidth(2),
        borderBottomWidth: 1,
        borderBottomColor: colors.cardborder,
    },
    comingSoonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: responsiveWidth(10),
    }
});
export default Holding;