import React, { useState, useContext } from 'react';
import {  TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import { useNavigation } from '@react-navigation/native';
import styles from '../funpickerdetailstyles';

const RelatedScheme = () => {
    const { colors }: any = useContext(AppearanceContext);
    const navigation = useNavigation();
    const [activeTimeframe, setActiveTimeframe] = useState('1Y');
    
    // Sample data for related schemes
    const relatedSchemes = [
        {
            id: 1,
            name: 'ICICI Pru Balanced Advantage Fund (M-IDCW Payout)-Direct Plan',
            nav: '28.06',
            returns: {
                '1D': '0.5%',
                '1W': '1.2%',
                '1M': '3.5%',
                '3M': '7.8%',
                '6M': '12.4%',
                '1Y': '22.09%',
                '3Y': '45.3%',
                '5Y': '67.2%'
            }
        },
        {
            id: 2,
            name: 'ICICI Pru Balanced Advantage Fund (M-IDCW)-Direct Plan',
            nav: '18.19',
            returns: {
                '1D': '0.4%',
                '1W': '1.1%',
                '1M': '3.2%',
                '3M': '7.5%',
                '6M': '11.8%',
                '1Y': '21.09%',
                '3Y': '43.1%',
                '5Y': '64.5%'
            }
        },
        {
            id: 3,
            name: 'ICICI Pru Balanced Advantage Fund (IDCW-Payout)-Direct Plan',
            nav: '72.67',
            returns: {
                '1D': '0.3%',
                '1W': '0.9%',
                '1M': '2.8%',
                '3M': '6.2%',
                '6M': '9.5%',
                '1Y': '14.09%',
                '3Y': '35.6%',
                '5Y': '52.3%'
            }
        },
        {
            id: 4,
            name: 'ICICI Pru Balanced Advantage Fund (IDCW-Payout)',
            nav: '17.92',
            returns: {
                '1D': '0.6%',
                '1W': '1.4%',
                '1M': '4.1%',
                '3M': '8.3%',
                '6M': '13.2%',
                '1Y': '20.5%',
                '3Y': '42.7%',
                '5Y': '61.9%'
            }
        }
    ];

    const timeframes = [
        { id: '1D', label: '1D' },
        { id: '1W', label: '1W' },
        { id: '1M', label: '1M' },
        { id: '3M', label: '3M' },
        { id: '6M', label: '6M' },
        { id: '1Y', label: '1Y' },
        { id: '3Y', label: '3Y' },
        { id: '5Y', label: '5Y' }
    ];

    const handleSchemePress = (scheme:any) => {
        // Navigate to scheme details or perform any action
        console.log('Scheme pressed:', scheme);
    };

    const renderTimeframeButton = ({ item }:any) => (
        <TouchableOpacity
            style={[
                styles.timeframeButton,
                activeTimeframe === item.id && styles.activeTimeframeButton
            ]}
            onPress={() => setActiveTimeframe(item.id)}
        >
            <CusText
                text={item.label}
                size="S"
                color={activeTimeframe === item.id ? colors.Hard_White : colors.black}
            />
        </TouchableOpacity>
    );

    const renderSchemeItem = ({ item }:any) => {
        const returnValue = item.returns[activeTimeframe];
        const isPositive = !returnValue.includes('-');
        
        return (
            <>
            <TouchableOpacity
                style={styles.schemeItem}
                onPress={() => handleSchemePress(item)}
            >
                <Wrapper width={responsiveWidth(55)}>
                    <CusText
                        text="ICICI"
                        size="S"
                        color={colors.primary}
                        bold
                    />
                    <CusText
                        text={item.name}
                        size="S"
                        color={colors.black}
                        numberOfLines={2}
                    />
                </Wrapper>
                
                <Wrapper width={responsiveWidth(15)} align="center">
                    <CusText
                        text={item.nav}
                        size="S"
                        color={colors.black}
                        bold
                    />
                </Wrapper>
                
                <Wrapper width={responsiveWidth(20)} align="center">
                    <CusText
                        text={returnValue}
                        size="S"
                        color={isPositive ? '#4ADE80' : '#EF4444'}
                        bold
                    />
                </Wrapper>
            </TouchableOpacity>
            <Wrapper customStyles={styles.saprator}/>
            </>
        );
    };

    return (
        <Wrapper>
            {/* Timeframe selector */}
            <Wrapper customStyles={{ padding: responsiveWidth(4) }}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.timeframeContainer}
            >
                {timeframes.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.timeframeButton,
                            activeTimeframe === item.id && styles.activeTimeframeButton
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
            </Wrapper>
            <Spacer y="S" />
            
            {/* Table header */}
            <Wrapper row customStyles={styles.tableHeader}>
                <Wrapper width={responsiveWidth(55)} customStyles={{ paddingHorizontal: responsiveWidth(4) }}>
                    <CusText
                        text="Scheme Name"
                        size="S"
                        color={colors.black}
                        bold
                    />
                </Wrapper>
                
                <Wrapper width={responsiveWidth(20)} align="center">
                    <CusText
                        text="NAV"
                        size="S"
                        color={colors.black}
                        bold
                    />
                </Wrapper>
                
                <Wrapper width={responsiveWidth(20)} align="center">
                    <CusText
                        text="Return %"
                        size="S"
                        color={colors.black}
                        bold
                    />
                </Wrapper>
            </Wrapper>
            
            {/* Table content */}
            <FlatList
                data={relatedSchemes}
                renderItem={renderSchemeItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.tableContent}
            />
        </Wrapper>
    );
};

export default RelatedScheme;