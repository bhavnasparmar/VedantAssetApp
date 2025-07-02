import React, { useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";

const Performance = () => {
    const { colors }: any = useContext(AppearanceContext);
    
    // Sample performance data
    const performanceData = [
        {
            period: '1 Day',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage'
        },
        {
            period: '1 Week',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage'
        },
        {
            period: '1 Month',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage'
        },
        {
            period: '3 Month',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage'
        },
        {
            period: '6 Month',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage'
        },
        {
            period: '1 Year',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage'
        },
        {
            period: '2 Year',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage'
        },
        {
            period: '3 Year',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage'
        }
    ];

  

    // NAV header section
    const renderNavHeader = () => (
        <Wrapper>
            <Wrapper row align="center">
              
                    <CusText
                        text="NAV"
                        size="N"
                        color={colors.black}
                        bold
                    />
                    <CusText
                    text="28"
                    size="XXXL"
                    color={colors.black}
                    bold
                />
                 </Wrapper>
             <CusText
                        text="22 May 2023"
                        size="S"
                        color={colors.black}
                    />
               
        </Wrapper>
    );

    // Performance table
    const renderPerformanceTable = () => (
        <Wrapper customStyles={additionalStyles.performanceTableContainer}>
            {performanceData.map((item, index) => (
                <View 
                    key={index} 
                    style={[
                        additionalStyles.performanceRow,
                        index === performanceData.length - 1 && { borderBottomWidth: 0 }
                    ]}
                >
                    <Wrapper width={responsiveWidth(20)} customStyles={additionalStyles.tabButton1} >
                        <CusText
                            text={item.period}
                            size="S"
                            color={colors.black}
                        />
                    </Wrapper>
                    <Wrapper width={responsiveWidth(65)}>
                        <CusText
                            text={item.title}
                            size="S"
                            color={colors.black}
                            numberOfLines={2}
                        />
                    </Wrapper>
                </View>
            ))}
        </Wrapper>
    );

  

    return (

        <ScrollView style={additionalStyles.container} showsVerticalScrollIndicator={false}>
           
            {/* NAV header */}
            {renderNavHeader()}
            
            <Spacer y="S" />
            
            {/* Performance table */}
            {renderPerformanceTable()}
            
           
            <Spacer y="L" />
        </ScrollView>
    );
};

// Add these styles to your funpickerdetailstyles.ts file
// or define them inline if you prefer
const additionalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: responsiveWidth(4),
        backgroundColor: colors.Hard_white,
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

export default Performance;