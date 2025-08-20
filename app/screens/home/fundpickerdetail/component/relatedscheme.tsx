import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import { useNavigation } from '@react-navigation/native';
import styles from '../funpickerdetailstyles';
import { getMutualRelatedSchemeDataApi } from '../../../../api/homeapi';
import { showToast, toastTypes } from '../../../../services/toastService';

interface RelatedSchemeProps {
    schemeData?: any;
    schemeDetails?: any;
    isVisible?: boolean;
}

const RelatedScheme: React.FC<RelatedSchemeProps> = ({ schemeData, schemeDetails, isVisible = false }) => {
    const { colors }: any = useContext(AppearanceContext);
    const navigation = useNavigation();
    const [activeTimeframe, setActiveTimeframe] = useState('1Y');
    const [isLoading, setIsLoading] = useState(false);
    const [relatedSchemes, setRelatedSchemes] = useState<any[]>([]);

    // Sample data for related schemes (fallback)

    // API call to fetch related schemes
    const fetchRelatedSchemes = async () => {
        if (!schemeData) {
            console.log('No scheme data available');

            return;
        }
        console.log('Related schemes payload 1:', schemeData);
        console.log('Related schemes payload 2:', schemeDetails);
        const payload = {
            schemeId: schemeDetails?.id,
            optionId: schemeDetails?.option_id,
            amcId: schemeDetails?.amc_id,
            categoryid: schemeDetails?.categoryid,
            subcategory_id: schemeDetails?.subcategory_id
        };

        console.log('Related schemes payload:', payload);

        try {
            setIsLoading(true);
            const response = await getMutualRelatedSchemeDataApi(payload);

            if (!response) {
                console.log('No response from API');

                return;
            }

            const [result, error]: any = Array.isArray(response) ? response : [response, null];

            if (result && (result.data || result.success)) {
                const schemes = result.data || result.schemes || [];
                setRelatedSchemes(Array.isArray(schemes) ? schemes : []);
                console.log('Related Schemes Data:', schemes);
            } else {
                console.error('Error fetching related schemes:', error);
                // Use sample data as fallback

                if (error) {
                    showToast(toastTypes.error, (error as any)?.msg || 'Failed to fetch related schemes');
                }
            }
        } catch (err) {
            console.error('Related schemes API error:', err);
            // Use sample data as fallback

            showToast(toastTypes.error, 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('RelatedScheme useEffect - schemeData:', schemeData, 'isVisible:', isVisible);

        if (isVisible && schemeData && typeof schemeData === 'object') {
            fetchRelatedSchemes();
        } else if (isVisible) {
            console.log('Using sample data - no valid scheme data');
            // Use sample data if no scheme data

        }
    }, [schemeData, isVisible]);

    const timeframes = [
        { id: '1M', label: '1M', field: 'Return1mth' },
        { id: '3M', label: '3M', field: 'Return3mth' },
        { id: '1Y', label: '1Y', field: 'Return1yr' }
    ];

    const handleSchemePress = (scheme: any) => {
        // Navigate to scheme details or perform any action
        console.log('Scheme pressed:', scheme);
    };

    const renderTimeframeButton = ({ item }: any) => (
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

    const renderSchemeItem = ({ item }: any) => {
        if (!item || typeof item !== 'object') {
            return null;
        }

        // Get the current timeframe field name
        const currentTimeframe = timeframes.find(tf => tf.id === activeTimeframe);
        const fieldName = currentTimeframe?.field || 'Return1yr';

        // Get return value from SchemePerformances[0]
        const schemePerformance = item.SchemePerformances?.[0] || {};
        const returnValue = schemePerformance[fieldName];

        // Format return value
        const formattedReturn = returnValue ? `${returnValue.toFixed(2)}%` : 'N/A';
        const isPositive = returnValue ? returnValue >= 0 : true;

        return (
            <>
                <TouchableOpacity
                    style={styles.schemeItem}
                    onPress={() => handleSchemePress(item)}
                >
                    <Wrapper width={responsiveWidth(55)}>
                        <CusText
                            text={item.name || item.schemeName || item.ms_fullname || "Unknown Scheme"}
                            size="S"
                            color={colors.black}
                            numberOfLines={2}
                        />
                    </Wrapper>

                    <Wrapper width={responsiveWidth(15)} align="center">
                        <CusText
                            text={item?.SchemePerformances[0]?.Nav ? parseFloat(item?.SchemePerformances[0]?.Nav).toFixed(2) : '-'}
                            size="S"
                            color={colors.black}
                            bold
                        />
                    </Wrapper>

                    <Wrapper width={responsiveWidth(20)} align="center">
                        <CusText
                            text={formattedReturn}
                            size="S"
                            color={isPositive ? '#4ADE80' : '#EF4444'}
                            bold
                        />
                    </Wrapper>
                </TouchableOpacity>
                <Wrapper customStyles={styles.saprator} />
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
            {isLoading ? (
                <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
                    <ActivityIndicator size="large" color={colors.primary1} />
                    <CusText text="Loading related schemes..." size="S" color={colors.gray} customStyles={{ marginTop: responsiveWidth(2) }} />
                </Wrapper>
            ) : (
                <FlatList
                    data={relatedSchemes}
                    renderItem={renderSchemeItem}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.tableContent}
                    ListEmptyComponent={
                        <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
                            <CusText text="No related schemes found" size="S" color={colors.gray} />
                        </Wrapper>
                    }
                />
            )}
        </Wrapper>
    );
};

export default RelatedScheme;