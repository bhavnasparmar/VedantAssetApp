import React, { useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import styles from '../funpickerdetailstyles';

const Performance = () => {
    const { colors }: any = useContext(AppearanceContext);
    const [activeTimeframe, setActiveTimeframe] = useState('1Y');
    
    // Sample data for performance periods
    const timeframes = [
        { id: '1D', label: '1 Day' },
        { id: '1W', label: '1 Week' },
        { id: '1M', label: '1 Month' },
        { id: '3M', label: '3 Month' },
        { id: '6M', label: '6 Month' },
        { id: '1Y', label: '1 Year' },
        { id: '3Y', label: '3Y' },
        { id: '5Y', label: '5Y' },
        { id: '10Y', label: '10Y' }
    ];

    // Sample performance data
    const performanceData = [
        {
            id: '1D',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage',
            date: '22 May 2023',
            nav: '28'
        },
        {
            id: '1W',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage',
            date: '15 May 2023',
            nav: '27.85'
        },
        {
            id: '1M',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage',
            date: '22 Apr 2023',
            nav: '27.50'
        },
        {
            id: '3M',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage',
            date: '22 Feb 2023',
            nav: '26.80'
        },
        {
            id: '6M',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage',
            date: '22 Nov 2022',
            nav: '25.40'
        },
        {
            id: '1Y',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage',
            date: '22 May 2022',
            nav: '23.10'
        },
        {
            id: '3Y',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage',
            date: '22 May 2020',
            nav: '19.30'
        },
        {
            id: '5Y',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage',
            date: '22 May 2018',
            nav: '16.50'
        },
        {
            id: '10Y',
            title: 'ICICI Prudential Balanced Advantage Fund - Hybrid Balanced Advantage',
            date: '22 May 2013',
            nav: '10.20'
        }
    ];

    // Filter to show only the selected timeframe
    const selectedPerformance = performanceData.find(item => item.id === activeTimeframe);

    // Time period selector buttons
    const renderTimeframeButtons = () => (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeframeContainerperformance}
        >
            {timeframes.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={[
                        styles.timeframeButtonperformance,
                        activeTimeframe === item.id && styles.activeTimeframeButtonperformance
                    ]}
                    onPress={() => setActiveTimeframe(item.id)}
                >
                    <CusText
                        text={item.label}
                        size="S"
                        color={activeTimeframe === item.id ? colors.Hard_White : colors.black}
                    />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    // Summary section showing NAV and date
    const renderSummary = () => (
        <Wrapper customStyles={styles.summaryContainerperformance}>
            <Wrapper row justify="apart" align="center">
                <CusText
                    text="NAV"
                    size="M"
                    color={colors.gray}
                />
                <Wrapper row align="center">
                    <CusText
                        text={selectedPerformance?.nav}
                        size="XL"
                        color={colors.black}
                        bold
                    />
                </Wrapper>
            </Wrapper>
            <CusText
                text={selectedPerformance?.date}
                size="S"
                color={colors.gray}
            />
        </Wrapper>
    );

    // Performance details
    const renderPerformanceDetails = () => (
        <Wrapper customStyles={styles.detailsContainerperformance}>
            <CusText
                text={selectedPerformance?.title}
                size="S"
                color={colors.black}
                customStyles={{ lineHeight: 22 }}
            />
        </Wrapper>
    );

    // Holdings summary section
    const renderHoldingsSummary = () => {
        // Sample holdings data
        const holdings = [
            { name: 'Domestic Equities', percentage: 65 },
            { name: 'Cash & Cash Equivalents', percentage: 12 },
            { name: 'Corporate Debt', percentage: 8 },
            { name: 'Government Securities', percentage: 6 },
            { name: 'Treasury Bills', percentage: 4 },
            { name: 'REITs & InvITs', percentage: 2 },
            { name: 'Certificate of Deposit', percentage: 1 },
            { name: 'PTC & Securitized Debt', percentage: 1 },
            { name: 'Commercial Paper', percentage: 1 }
        ];

        return (
            <Wrapper customStyles={styles.holdingsContainerperformance}>
                <Wrapper row  customStyles={styles.tabContainerperformance}>
                    <TouchableOpacity style={[styles.tabButton, styles.activeTabButtonperformance]}>
                        <CusText
                            text="Summary"
                            size="S"
                            color={colors.Hard_White}
                            bold
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabButtonperformance}>
                        <CusText
                            text="Domestic Equities"
                            size="S"
                            color={colors.black}
                        />
                    </TouchableOpacity>
                </Wrapper>
                
                <Spacer y="N" />
                
                {holdings.map((holding, index) => (
                    <Wrapper key={index} customStyles={styles.holdingItem}>
                        <CusText
                            text={holding.name}
                            size="S"
                            color={colors.black}
                        />
                    </Wrapper>
                ))}
            </Wrapper>
        );
    };

    return (
        <ScrollView style={styles.containerperformance} showsVerticalScrollIndicator={false}>
            {/* Time period selector */}
            {renderTimeframeButtons()}
            
          
        </ScrollView>
    );
};

export default Performance;