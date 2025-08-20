import React, { useState, useContext, useEffect, useRef } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { AppearanceContext } from '../../../context/appearanceContext';
import Header from '../../../shared/components/Header/Header';
import Wrapper from '../../../ui/wrapper';
import { borderRadius, responsiveHeight, responsiveWidth } from '../../../styles/variables';
import NavTab from './component/newTab';
import Information from './component/information';
import RelatedScheme from './component/relatedscheme';
import Performance from './component/performance';
import Holding from './component/holding';
import FundManager from './component/fundmanager';
import Ratio from './component/ratio';
import CusText from '../../../ui/custom-text';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { getSchemeByIdApi, getSchemeNavGraphDetailApi } from '../../../api/homeapi';
import { showToast, toastTypes } from '../../../services/toastService';

const FunpickerDetail = () => {
    const { colors }: any = useContext(AppearanceContext);
    const route: any = useRoute();
    const isFocused: any = useIsFocused();
    const layout = Dimensions.get('window');
    const [active, setActive] = useState(0);
    const headerScrollView: any = useRef(undefined);
    const itemScrollView: any = useRef(undefined);

    // Get scheme data from navigation params
    const schemeData = route?.params?.data;

    // State for API data
    const [isLoading, setIsLoading] = useState(false);
    const [schemeDetails, setSchemeDetails] = useState<any>(null);
    const [navGraphData, setNavGraphData] = useState<any>(null);

    // Use ref to track loaded scheme ID to prevent duplicate calls
    const loadedSchemeIdRef = useRef<string | null>(null);

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'nav', title: 'NAV' },
        { key: 'information', title: 'Information' },
        { key: 'relatedscheme', title: 'Related Scheme' },
        { key: 'performance', title: 'Performance' },
        { key: 'holding', title: 'Holding' },
        { key: 'fundmanager', title: 'Fund Manager' },
        { key: 'ratio', title: 'Ratio' },
    ]);

    // API call functions
    const fetchSchemeDetails = async () => {
        if (!schemeData?.id) return;
        console.log('Scheme data in ====>>>>:', schemeData);
        try {
            setIsLoading(true);
            const response = await getSchemeByIdApi(schemeData.scheme_id || schemeData.id);
            const [result, error]: any = response || [null, null];

            if (result) {
                setSchemeDetails(result?.data);
                console.log('Scheme data in ====>>>>:', result);
            } else {
                console.error('Error fetching scheme details:', error);
                showToast(toastTypes.error, (error as any)?.msg || 'Failed to fetch scheme details');
            }
        } catch (err) {
            console.error('Scheme details API error:', err);
            showToast(toastTypes.error, 'Something went wrong');
            // Reset loaded scheme ID on error so user can retry
            loadedSchemeIdRef.current = null;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchNavGraphData = async () => {
        if (!schemeData) return;

        // Create date range (1 month back from today)
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 1);

        const payload = {
            id: schemeData.id?.toString() || "42",
            scheme_type: "R",
            fromDate: fromDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
            toDate: toDate.toISOString().split('T')[0],
            schemeFullName: schemeData.ms_fullname || "Invesco India Mid Cap Gr",
            schemeName: schemeData.name || "Invesco India Mid Cap Fund"
        };

        try {
            const response = await getSchemeNavGraphDetailApi(payload);
            const [result, error] = response || [null, null];

            if (result) {
                setNavGraphData(result);
                console.log('NAV Graph Data:', result);
            } else {
                console.error('Error fetching NAV graph data:', error);
                showToast(toastTypes.error, (error as any)?.msg || 'Failed to fetch NAV data');
            }
        } catch (err) {
            console.error('NAV graph API error:', err);
            showToast(toastTypes.error, 'Something went wrong');
            // Reset loaded scheme ID on error so user can retry
            loadedSchemeIdRef.current = null;
        }
    };

    // Single useEffect to handle API calls only when component is focused
    useEffect(() => {
        console.log('FunpickerDetail - schemeData:', schemeData);
        console.log('FunpickerDetail - isFocused:', isFocused);
        console.log('FunpickerDetail - loadedSchemeId:', loadedSchemeIdRef.current);

        // Get current scheme ID
        const currentSchemeId = schemeData?.scheme_id || schemeData?.id;

        // Only call APIs when:
        // 1. Component is focused
        // 2. We have valid scheme data
        // 3. We haven't already loaded data for this specific scheme
        if (isFocused && schemeData && currentSchemeId && loadedSchemeIdRef.current !== currentSchemeId?.toString()) {
            console.log('🚀 Calling APIs for scheme:', schemeData?.ms_fullname || schemeData?.name);

            // Clear previous data
            setSchemeDetails(null);
            setNavGraphData(null);

            // Mark this scheme as being loaded
            loadedSchemeIdRef.current = currentSchemeId?.toString();

            // Call APIs
            fetchSchemeDetails();
            fetchNavGraphData();
        }
    }, [isFocused]);

    useEffect(() => {
        console.log('📱 Active tab changed to:', active, '- Tab:', routes[active]?.title);
        headerScrollView.current.scrollToIndex({ index: active, viewPosition: 0.5 })
    }, [active])

    const onPressHeader = (index: any) => {
        itemScrollView.current.scrollToIndex({ index })
        setActive(index);
    }

    const onMomentumScrollEnd = (e: any) => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / responsiveWidth(100));
        if (active != newIndex) {
            setActive(newIndex)
        }
    }
    const renderScene = (route: any) => {
        // Show loading state while data is being fetched
        if (isLoading) {
            return (
                <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(20) }}>
                    <ActivityIndicator size="large" color={colors.primary1} />
                    <CusText text="Loading..." size="S" color={colors.gray} customStyles={{ marginTop: responsiveWidth(2) }} />
                </Wrapper>
            );
        }

        switch (route.key) {
            case 'nav':
                return (
                    <NavTab />
                );
            case 'information':
                return (
                    <Information totaldata={25} schemeDetails={schemeDetails} />
                );
            case 'relatedscheme':
                return (
                    <RelatedScheme
                        schemeData={schemeData || null}
                        schemeDetails={schemeDetails || null}
                        isVisible={active === 2 && isFocused} // relatedscheme is index 2
                    />
                );
            case 'performance':
                return (
                    <Performance
                        schemeData={schemeData || null}
                        schemeDetails={schemeDetails || null}
                        isVisible={active === 3 && isFocused} // performance is index 3
                    />
                );
            case 'holding':
                return (
                    <Holding
                        schemeData={schemeData || null}
                        schemeDetails={schemeDetails || null}
                        isVisible={active === 4 && isFocused} // holding is index 4
                    />
                );
            case 'fundmanager':
                return (
                    <FundManager
                        schemeData={schemeData || null}
                        schemeDetails={schemeDetails || null}
                        isVisible={active === 5 && isFocused} // fundmanager is index 5
                    />
                );
            case 'ratio':
                return (
                    <Ratio
                        schemeData={schemeData || null}
                        schemeDetails={schemeDetails || null}
                        isVisible={active === 6 && isFocused} // ratio is index 6
                    />
                );
            default:
                return null;
        }
    };



    return (
        <>
            <Header backBtn name="Scheme Details" />
            <Wrapper color={colors.Hard_White} height={responsiveHeight(92)}>
                <Wrapper color={colors.headerColor} row align='center' customStyles={{ paddingVertical: responsiveWidth(1.5), paddingHorizontal: responsiveWidth(5) }}>
                    {/* <IonIcon name={'chevron-back-outline'} color={colors.primary1} size={25} /> */}
                    <CusText semibold size='N' text={schemeData?.ms_fullname || schemeData?.name || schemeData?.SchemeMaster?.ms_fullname || 'Scheme Details'} />
                </Wrapper>
                <Wrapper color={colors.tabBg} height={responsiveWidth(10)}>
                    <FlatList
                        data={routes}
                        ref={headerScrollView}
                        keyExtractor={(item) => item?.key}
                        horizontal
                        style={{ paddingHorizontal: responsiveWidth(2) }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }: any) => (

                            <Wrapper position='end' justify='center'

                                customStyles={{
                                    paddingVertical: responsiveWidth(1),
                                    paddingHorizontal: responsiveWidth(3),
                                    borderTopLeftRadius: active == index ? borderRadius.medium : 0,
                                    borderTopRightRadius: active == index ? borderRadius.medium : 0,
                                }}
                                color={active == index ? colors.Hard_White : colors.tabBg}
                                height={responsiveWidth(7)}>
                                <TouchableOpacity activeOpacity={0.6} onPress={() => { onPressHeader(index) }}>
                                    <CusText semibold position='center' text={item?.title} customStyles={{ alignSelf: 'center' }} />
                                </TouchableOpacity>
                                {/* {active == index && <View style={styles.headerBar} />} */}

                            </Wrapper>

                        )}
                    />
                </Wrapper>
                <FlatList
                    data={routes}
                    ref={itemScrollView}
                    keyExtractor={(item) => item?.key}
                    horizontal
                    pagingEnabled
                    decelerationRate='fast'
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    renderItem={({ item, index }: any) => renderScene(item)}
                />
            </Wrapper>
        </>
    );
};

export default FunpickerDetail;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // headerScroll: {
    //     flexGrow: 0,
    // },
    headerItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    mainItem: {
        width: responsiveWidth(100),
        borderWidth: 5,
        borderColor: '#fff',
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    headerBar: {
        height: 2,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0
    }
})
