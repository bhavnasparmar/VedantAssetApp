import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import { getPerformanceSchemeDataApi } from '../../../../api/homeapi';
import { showToast, toastTypes } from '../../../../services/toastService';

interface PerformanceProps {
    schemeData?: any;
    schemeDetails?: any;
    isVisible?: boolean;
}

const Performance: React.FC<PerformanceProps> = ({ schemeData, schemeDetails, isVisible = false }) => {
    const { colors }: any = useContext(AppearanceContext);
    const [isLoading, setIsLoading] = useState(false);
    const [performanceData, setPerformanceData] = useState<any>(null);

    // Return periods to display
    const returnPeriods = [
        { key: 'Return1d_AVG', label: '1 Day', period: '1D' },
        { key: 'Return1w_AVG', label: '1 Week', period: '1W' },
        { key: 'Return1mth_AVG', label: '1 Month', period: '1M' },
        { key: 'Return3mth_AVG', label: '3 Months', period: '3M' }
    ];

    // Sample performance data (fallback)
    // const samplePerformanceData = {
    //     Return1d_AVG: 0.20,
    //     Return1w_AVG: 1.98,
    //     Return1mth_AVG: 2.98,
    //     Return3mth_AVG: 11.88
    // };

    // API call to fetch performance data
    const fetchPerformanceData = async () => {
        if (!schemeData) {
            console.log('No scheme data available for performance');
            // setPerformanceData(samplePerformanceData);
            return;
        }

        const payload = {
            schemeId: schemeDetails?.id,
            categoryId: schemeDetails?.categoryid,
            subCategoryId: schemeDetails?.subcategory_id
        };

        console.log('Performance data payload:', payload);

        try {
            setIsLoading(true);
            const response = await getPerformanceSchemeDataApi(payload);

            if (!response) {
                console.log('No response from performance API');
                // setPerformanceData(samplePerformanceData);
                return;
            }

            const [result, error]: any = Array.isArray(response) ? response : [response, null];

            if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
                // console.log('Performance Data Result:', result);
                const performanceList = result.data[0]; // Get first object from array
                setPerformanceData(performanceList);
                // console.log('Performance Data:', performanceList);
            } else {
                console.error('Error fetching performance data:', error);
                // Use sample data as fallback
                // setPerformanceData(samplePerformanceData);
                if (error) {
                    showToast(toastTypes.error, (error as any)?.msg || 'Failed to fetch performance data');
                }
            }
        } catch (err) {
            console.error('Performance API error:', err);
            // Use sample data as fallback
            // setPerformanceData(samplePerformanceData);
            showToast(toastTypes.error, 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('Performance useEffect - schemeData:', schemeData, 'isVisible:', isVisible);

        if (isVisible && schemeData && typeof schemeData === 'object') {
            fetchPerformanceData();
        } else if (isVisible) {
            console.log('Using sample performance data - no valid scheme data');
            // setPerformanceData(samplePerformanceData);
        }
    }, [schemeData, isVisible]);



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
    const renderPerformanceTable = () => {
        if (!performanceData) {
            return (
                <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
                    <CusText text="No performance data available" size="S" color={colors.gray} />
                </Wrapper>
            );
        }

        return (
            <Wrapper customStyles={additionalStyles.performanceTableContainer}>
                {/* Fund Return Header */}
                <Wrapper customStyles={{ marginBottom: responsiveWidth(4) }}>
                    <CusText
                        text="Fund Return"
                        size="L"
                        color={colors.black}
                        bold
                    />
                </Wrapper>

                {/* Return Periods */}
                {returnPeriods.map((period, index) => {
                    const returnValue = performanceData[period.key];
                    const formattedReturn = returnValue ? `${returnValue.toFixed(2)}%` : 'N/A';
                    const isPositive = returnValue ? returnValue >= 0 : true;

                    return (
                        <View
                            key={period.key}
                            style={[
                                additionalStyles.performanceRow,
                                index === returnPeriods.length - 1 && { borderBottomWidth: 0 }
                            ]}
                        >
                            <Wrapper width={responsiveWidth(25)} customStyles={additionalStyles.tabButton1}>
                                <CusText
                                    text={period.period}
                                    size="M"
                                    color={colors.primary1}
                                    bold
                                />
                            </Wrapper>

                            <Wrapper width={responsiveWidth(35)} align="center">
                                <CusText
                                    text={period.label}
                                    size="S"
                                    color={colors.black}
                                />
                            </Wrapper>

                            <Wrapper width={responsiveWidth(25)} align="center">
                                <CusText
                                    text={formattedReturn}
                                    size="M"
                                    color={isPositive ? '#4ADE80' : '#EF4444'}
                                    bold
                                />
                            </Wrapper>
                        </View>
                    );
                })}
            </Wrapper>
        );
    };



    // Show loading state
    if (isLoading) {
        return (
            <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(20) }}>
                <ActivityIndicator size="large" color={colors.primary1} />
                <CusText text="Loading performance data..." size="S" color={colors.gray} customStyles={{ marginTop: responsiveWidth(2) }} />
            </Wrapper>
        );
    }

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
        width: responsiveWidth(100)
    },
    tabButton1: {
        //  flex: 1,
        padding: responsiveWidth(2),
        alignItems: 'center',
        borderRadius: borderRadius.small,
        // width:responsiveWidth(25),
        backgroundColor: colors.cardborder,
        marginRight: responsiveWidth(2)
    },
    navHeaderContainer: {
        padding: responsiveWidth(4),
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
    },
    performanceTableContainer: {
        backgroundColor: colors.Hard_White,
        borderRadius: borderRadius.medium,
        padding: responsiveWidth(4),
        marginVertical: responsiveWidth(2),
    },
    performanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(2),
        borderBottomWidth: 1,
        borderBottomColor: colors.fieldborder,
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