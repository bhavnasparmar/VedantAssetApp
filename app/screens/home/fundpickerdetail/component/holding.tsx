import { FlatList, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, View } from "react-native";
import styles from "../funpickerdetailstyles";
import { borderRadius, colors, responsiveWidth } from "../../../../styles/variables";
import Wrapper from "../../../../ui/wrapper";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import { useState, useEffect, useContext } from "react";
import { getMutualHoldingDataApi } from "../../../../api/homeapi";
import { showToast, toastTypes } from "../../../../services/toastService";
import { AppearanceContext } from "../../../../context/appearanceContext";
import Pagination from "../../../../ui/Pagination";

interface HoldingProps {
    schemeData?: any;
    schemeDetails?: any;
    isVisible?: boolean;
}

const Holding: React.FC<HoldingProps> = ({ schemeData, schemeDetails, isVisible = false }) => {
    const { colors }: any = useContext(AppearanceContext);
    const [activeTab, setActiveTab] = useState('Summary');
    const [isLoading, setIsLoading] = useState(false);
    const [holdingsData, setHoldingsData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState<any>(0);
    const limit = 10;
    // Sample holdings data (fallback)
    // const sampleHoldingsData = [
    //     { companyName: 'Coforge Ltd', sector: 'Technology', percentage: 10.01 },
    //     { companyName: 'Shaily Engineering Plastics Ltd', sector: 'Basic Materials', percentage: 9.71 },
    //     { companyName: 'Polycab India Ltd', sector: 'Industrials', percentage: 9.35 },
    //     { companyName: 'Persistent Systems Ltd', sector: 'Technology', percentage: 8.21 },
    //     { companyName: 'Kalyan Jewellers India Ltd', sector: 'Consumer Cyclical', percentage: 7.28 }
    // ];

    // API call to fetch holding data
    const fetchHoldingData = async (page: number = 1) => {
        if (!schemeData) {
            console.log('No scheme data available for holdings');
            // setHoldingsData(sampleHoldingsData);
            return;
        }
        console.log('schemeData in fetchHoldingData:', schemeData);
        const params = {
            schemeId: schemeDetails?.id,
            schemeISINNo: schemeDetails?.schemeISIN,
            filters: false,
            limit: limit,
            page: page
        };

        console.log('Holdings data params:', params);

        try {
            setIsLoading(true);
            const response = await getMutualHoldingDataApi(params);

            if (!response) {
                console.log('No response from holdings API');
                // setHoldingsData(sampleHoldingsData);
                return;
            }

            const [result, error]: any = Array.isArray(response) ? response : [response, null];

            if (result && (result.data || result.success)) {
                const holdingsList = result.data || result.holdings || [];
                const pagination = result.data?.count || {};

                setHoldingsData(Array.isArray(holdingsList?.rows) ? holdingsList?.rows : []);
                setTotalPages(pagination.totalPages || Math.ceil((pagination || holdingsList.length) / limit));
                setTotalRecords(holdingsList.length);
                setCurrentPage(page);

                console.log('Holdings Data:', holdingsList);
                console.log('Pagination:', pagination);
            } else {
                console.error('Error fetching holdings data:', error);
                // Use sample data as fallback
                // setHoldingsData(sampleHoldingsData);
                if (error) {
                    showToast(toastTypes.error, (error as any)?.msg || 'Failed to fetch holdings data');
                }
            }
        } catch (err) {
            console.error('Holdings API error:', err);
            // Use sample data as fallback
            // setHoldingsData(sampleHoldingsData);
            showToast(toastTypes.error, 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('Holdings useEffect - schemeData:', schemeData, 'isVisible:', isVisible);

        if (isVisible && schemeData && typeof schemeData === 'object') {
            fetchHoldingData(1);
        } else if (isVisible) {
            console.log('Using sample holdings data - no valid scheme data');
            // setHoldingsData(sampleHoldingsData);
        }
    }, [schemeData, isVisible]);

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            fetchHoldingData(page);
        }
    };
    // Render individual holding item
    const renderHoldingItem = ({ item, index }: any) => {
        // console.log('item in renderHoldingItem:', item);
        const percentage = item?.portfolio_weighting
        const companyName = item.companyName || item.company || item.name || 'Unknown Company';
        const sector = item.sector || item.industry || item.category || 'Unknown Sector';
        // console.log('companyName:', percentage);
        return (
            <View style={additionalStyles.holdingItem}>
                <View style={additionalStyles.holdingInfo}>
                    <CusText
                        text={companyName}
                        size="M"
                        color={colors.black}
                        bold
                        numberOfLines={1}
                    />
                    <CusText
                        text={sector}
                        size="S"
                        color={colors.gray}
                        customStyles={{ marginTop: responsiveWidth(1) }}
                    />
                </View>

                <View style={additionalStyles.holdingPercentage}>
                    <CusText
                        text={`${percentage ? percentage : 0}%`}
                        size="M"
                        color={colors.black}
                        bold
                    />
                    <View style={additionalStyles.progressBarContainer}>
                        <View
                            style={[
                                additionalStyles.progressBar,
                                { width: `${Math.min(percentage, 100)}%` }
                            ]}
                        />
                    </View>
                </View>
            </View>
        );
    };

    const renderHoldings = () => {
        if (isLoading) {
            return (
                <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(20) }}>
                    <ActivityIndicator size="large" color={colors.primary1} />
                    <CusText text="Loading holdings data..." size="S" color={colors.gray} customStyles={{ marginTop: responsiveWidth(2) }} />
                </Wrapper>
            );
        }

        return (
            <Wrapper customStyles={additionalStyles.holdingsContainer}>
                {/* Holdings Header */}
                <Wrapper customStyles={{ }}>
                    <CusText
                        text="Top Holdings"
                        size="L"
                        color={colors.black}
                        bold
                    />
                </Wrapper>

                {/* Holdings List */}
                <FlatList
                    data={holdingsData}
                    renderItem={renderHoldingItem}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: responsiveWidth(4) }}
                    ListEmptyComponent={
                        <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
                            <CusText text="No holdings data available" size="S" color={colors.gray} />
                        </Wrapper>
                    }
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <Wrapper customStyles={{ marginTop: responsiveWidth(4) }}>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalRecords={totalRecords}
                            recordsPerPage={limit}
                        />
                    </Wrapper>
                )}
            </Wrapper>
        );
    };

    const renderOldHoldings = () => (
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
    return (
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
        padding: responsiveWidth(0),
        marginVertical: responsiveWidth(2),
    },
    holdingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: responsiveWidth(4),
        borderBottomWidth: 1,
        borderBottomColor: colors.fieldborder,
    },
    holdingInfo: {
        flex: 1,
        paddingRight: responsiveWidth(4),
    },
    holdingPercentage: {
        alignItems: 'flex-end',
        minWidth: responsiveWidth(20),
    },
    progressBarContainer: {
        width: responsiveWidth(25),
        height: responsiveWidth(1.5),
        backgroundColor: colors.fieldborder,
        borderRadius: responsiveWidth(1),
        marginTop: responsiveWidth(2),
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FF8C42',
        borderRadius: responsiveWidth(1),
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
    // holdingItem: {
    //     paddingVertical: responsiveWidth(2),
    //     borderBottomWidth: 1,
    //     borderBottomColor: colors.cardborder,
    // },
    comingSoonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: responsiveWidth(10),
    }
});
export default Holding;