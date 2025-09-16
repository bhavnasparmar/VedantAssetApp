import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppearanceContext } from '../../../context/appearanceContext';
import CusText from '../../../ui/custom-text';
import { colors, responsiveWidth, responsiveHeight, borderRadius } from '../../../styles/variables';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showToast, toastTypes } from '../../../services/toastService';
import CusButton from '../../../ui/custom-button';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Header from '../../../shared/components/Header/Header';
import Container from '../../../ui/container';
import Wrapper from '../../../ui/wrapper';
import Spacer from '../../../ui/spacer';
import { getSuggestedSchemesApi } from '../../../api/homeapi';

const SchemeSelection = () => {
    const { colors: themeColors }: any = useContext(AppearanceContext);
    const navigation = useNavigation() as any;
    const route: any = useRoute();

    // State management
    const [schemesList, setSchemesList] = useState<any[]>([]);
    const [selectedScheme, setSelectedScheme] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Get data from route params
    const { payload, originalScheme, planType, onSchemeSelected } = route.params as any;

    useEffect(() => {
        if (payload) {
            fetchSuggestedSchemes();
        }
    }, [payload]);

    const fetchSuggestedSchemes = async () => {
        setLoading(true);
        try {
            console.log('Fetching schemes with payload:', payload);

            const [result, error]: any = await getSuggestedSchemesApi(payload);

            if (result) {
                console.log('Suggested schemes result:', result?.data);
                setSchemesList(result?.data || []);
            } else {
                console.log('getSchemes Error', error);
                showToast(toastTypes.info, error || 'No schemes found');
            }
        } catch (error: any) {
            console.log('Fetch schemes error:', error);
            showToast(toastTypes.error, 'Failed to load schemes');
        } finally {
            setLoading(false);
        }
    };

    const toggleScheme = (scheme: any) => {
        if (scheme?.id === selectedScheme?.id) {
            setSelectedScheme(null);
        } else {
            setSelectedScheme(scheme);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const changeScheme = () => {
        if (!selectedScheme) {
            showToast(toastTypes.error, 'Please select a scheme');
            return;
        }

        console.log('Selected scheme:', selectedScheme);
        console.log('Original scheme:', originalScheme);

        // Following the exact SchemeEdit pattern
        // Update the scheme in the callback with the new SchemeMaster structure
        const updatedScheme = {
            ...originalScheme,
            SchemeMaster: selectedScheme,  // This is the key part from SchemeEdit
            scheme_id: selectedScheme?.id,
            // Preserve all other original data
            alloc_perc: originalScheme?.alloc_perc || originalScheme?.weightage,
            weightage: originalScheme?.weightage || originalScheme?.alloc_perc,
            sip_amount: originalScheme?.sip_amount,
            lumpsum_amount: originalScheme?.lumpsum_amount,
        };

        console.log('Updated scheme data:', updatedScheme);

        // Call the callback function if provided
        if (onSchemeSelected) {
            onSchemeSelected(updatedScheme);
        }

        showToast(toastTypes.success, 'Scheme updated successfully');
        navigation.goBack();
    };



    const renderSchemeItem = ({ item }: any) => {
        return (
            <Wrapper customStyles={{ ...styles.innercard, borderColor: selectedScheme?.id === item?.id ? colors.orange : colors.Hard_White, borderWidth: selectedScheme?.id === item?.id ? 1 : 0 }}>
                <Wrapper align='center' row justify='apart' customStyles={{ padding: responsiveWidth(0.5), paddingHorizontal: responsiveWidth(2) }}>
                    <Wrapper width={responsiveWidth(72)}>
                        <CusText size='N' color={colors.label} bold text={`${item?.ms_fullname}`} />
                    </Wrapper>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { toggleScheme(item) }}>
                        <CusText size='SN' color={colors.orange} semibold text={selectedScheme?.id === item?.id ? `Remove` : `Select`} />
                    </TouchableOpacity>

                </Wrapper>
                <Spacer y="XXS" />
                <Wrapper color={colors.lightGray} customStyles={{ borderWidth: 0, padding: responsiveWidth(2), borderRadius: borderRadius.middleSmall }}>
                    <Wrapper row align='center' justify='apart'>
                        <Wrapper position='center' align='start'>
                            <CusText size='SS' color={colors.label} text={'AUM'} />
                            <CusText size='M' color={colors.label} text={item?.SchemePerformances[0]?.AUM} />
                        </Wrapper>
                        <Wrapper align='end' position='center'>
                            <CusText size='SS' color={colors.label} text={'Rating'} />
                            <Wrapper row align='center'>
                                <CusText size='M' color={colors.label} text={item?.SchemePerformances[0]?.OverallRating || 0} />
                                <IonIcon name='star' color={colors.orange} size={responsiveWidth(4)} />
                            </Wrapper>
                        </Wrapper>
                        {/* <Wrapper position='center' align='end'>
                            <CusText size='SS' color={colors.label} text={'Weightage'} />
                            <CusText size='M' color={colors.label} text={item?.weightage + ' %'} />
                        </Wrapper> */}
                    </Wrapper>
                    <Spacer y='XXS' />
                    <Wrapper row align='center' justify='apart'>
                        <Wrapper position='center' align='start'>
                            <CusText size='SS' color={colors.label} text={'Return 1y'} />
                            <CusText size='M' color={colors.label} text={item?.SchemePerformances[0]?.Return1yr ? item?.SchemePerformances[0]?.Return1yr.toFixed(2) + '%' : '----'} />
                        </Wrapper>
                        <Wrapper align='center' position='center'>
                            <CusText size='SS' color={colors.label} text={'Return 3y'} />
                            <CusText size='M' color={colors.label} text={item?.SchemePerformances[0]?.Returns3yr ? item?.SchemePerformances[0]?.Returns3yr.toFixed(2) + '%' : '----'} />
                        </Wrapper>
                        <Wrapper position='center' align='end'>
                            <CusText size='SS' color={colors.label} text={'Return 5y'} />
                            <CusText size='M' color={colors.label} text={item?.SchemePerformances[0]?.Returns5yr ? item?.SchemePerformances[0]?.Returns5yr.toFixed(2) + '%' : '----'} />
                        </Wrapper>
                    </Wrapper>
                </Wrapper>
            </Wrapper>
        )
    }

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <IonIcon name="document-outline" size={60} color={colors.lightGray} />
            <CusText
                text="No alternative schemes found"
                size="M"
                color={themeColors.subText}
                customStyles={{ textAlign: 'center', marginTop: responsiveWidth(4) }}
            />
        </View>
    );

    const renderLoadingState = () => (
        <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.primary1} />
            <CusText
                text="Loading schemes..."
                size="M"
                color={themeColors.subText}
                customStyles={{ textAlign: 'center', marginTop: responsiveWidth(4) }}
            />
        </View>
    );

    return (
        <>
            <Header name="Select Scheme" backBtn />
            <Container Xcenter contentWidth={responsiveWidth(95)} bgcolor={colors.white}>
                {/* Current Scheme Info */}
                <View style={styles.currentSchemeSection}>
                    <CusText
                        text="Current Scheme"
                        size="M"
                        color={themeColors.text}
                        bold
                        customStyles={{ marginBottom: responsiveWidth(2) }}
                    />
                    <View style={[styles.currentSchemeCard, { backgroundColor: themeColors.cardBackground }]}>
                        <CusText
                            text={originalScheme?.SchemeMaster?.name || originalScheme?.scheme_name || 'Unknown Scheme'}
                            size="S"
                            color={themeColors.text}
                            bold
                        />
                        <CusText
                            text={`Allocation: ${originalScheme?.alloc_perc || originalScheme?.weightage || 0}%`}
                            size="XS"
                            color={themeColors.subText}
                        />
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Alternative Schemes */}
                <View style={styles.schemesSection}>
                    <CusText
                        text="Alternative Schemes"
                        size="M"
                        color={themeColors.text}
                        bold
                        customStyles={{ marginBottom: responsiveWidth(4) }}
                    />

                    {loading ? (
                        renderLoadingState()
                    ) : schemesList.length > 0 ? (
                        <FlatList
                            data={schemesList}
                            keyExtractor={(item, index) => `${item.id || index}`}
                            renderItem={renderSchemeItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: responsiveWidth(20) }}
                        />
                    ) : (
                        renderEmptyState()
                    )}
                </View>

                {/* Action Buttons */}

            </Container>
                    
            <Wrapper color='#fff' width={responsiveWidth(100)} row justify='apart' position='center' customStyles={{paddingHorizontal:responsiveWidth(5)}}>
                <CusButton
                    width={responsiveWidth(40)}
                    title="Back"
                    onPress={handleBack}
                    customStyle={[styles.button, styles.backButton]}
                    // textcolor={colors.primary1}
                />
                <CusButton
                    width={responsiveWidth(40)}
                    title="Proceed"
                    onPress={changeScheme}
                    customStyle={[styles.button, styles.proceedButton]}
                    disabled={!selectedScheme}
                />
            </Wrapper>
        </>
    );
};

const styles = StyleSheet.create({
    currentSchemeSection: {
        paddingVertical: responsiveWidth(4),
    },
    innercard: {
        backgroundColor: colors.Hard_White,
        width: responsiveWidth(95),
        borderRadius: responsiveWidth(2),
        marginTop: responsiveWidth(3),
        alignSelf: 'center',
        padding: responsiveWidth(2),
        paddingVertical: responsiveHeight(2)
    },
    currentSchemeCard: {
        padding: responsiveWidth(3),
        borderRadius: responsiveWidth(2),
        borderWidth: 1,
        borderColor: colors.lightGray + '40',
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGray + '50',
        marginVertical: responsiveWidth(2),
    },
    schemesSection: {
        flex: 1,
    },
    schemeCard: {
        borderRadius: responsiveWidth(3),
        padding: responsiveWidth(4),
        marginBottom: responsiveWidth(3),
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
    },
    schemeHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    schemeInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    radioButton: {
        width: responsiveWidth(5),
        height: responsiveWidth(5),
        borderRadius: responsiveWidth(2.5),
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(3),
        marginTop: responsiveWidth(0.5),
    },
    schemeDetails: {
        flex: 1,
    },
    performanceSection: {
        marginTop: responsiveWidth(2),
    },
    performanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveWidth(1),
    },
    riskSection: {
        marginTop: responsiveWidth(2),
        alignItems: 'flex-start',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: responsiveWidth(10),
    },
    loadingState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: responsiveWidth(10),
    },
    buttonContainer: {
        position: 'absolute',
        bottom: responsiveWidth(4),
        left: responsiveWidth(2.5),
        right: responsiveWidth(2.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: responsiveWidth(3),
        width: responsiveWidth(100)
    },
    button: {
        flex: 1,
        height: responsiveHeight(6),
    },
    backButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary1,
    },
    proceedButton: {
        backgroundColor: colors.primary1,
    },
});

export default SchemeSelection;
