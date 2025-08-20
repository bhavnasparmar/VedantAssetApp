import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Header from "../../../shared/components/Header/Header";
import {
    getTopPerformingSchemesApi,
    getAllSchemeCategoryApi,
    getTopMutualFundCatDataApi,
    getNewFundOfferListApi,
    getTopAmcListApi,
    getTopFundManagersListApi,
    getMutualFundClassesSchemesApi,
    getmfuisinDetailApi,
    getmfucanDetailApi
} from "../../../api/homeapi";
import { showToast, toastTypes } from "../../../services/toastService";
import Wrapper from "../../../ui/wrapper";
import CusText from "../../../ui/custom-text";
import { colors, responsiveWidth, responsiveHeight, borderRadius } from "../../../styles/variables";
import Spacer from "../../../ui/spacer";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { convertToCrores } from "../../../utils/Commanutils";
import moment from "moment";

const MutualFunds = () => {
    const navigation: any = useNavigation();
    const isFocused = useIsFocused();

    // State management for all API data
    const [topPerformingSchemes, setTopPerformingSchemes] = useState<any[]>([]);
    const [allSchemeCategories, setAllSchemeCategories] = useState<any[]>([]);
    const [topMutualFundCatData, setTopMutualFundCatData] = useState<any[]>([]);
    const [newFundOfferList, setNewFundOfferList] = useState<any[]>([]);
    const [topAmcList, setTopAmcList] = useState<any[]>([]);
    const [topFundManagersList, setTopFundManagersList] = useState<any[]>([]);

    // State for category selection
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const [selectedCategorySchemes, setSelectedCategorySchemes] = useState<any[]>([]);

    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStates, setLoadingStates] = useState({
        topPerformingSchemes: false,
        allSchemeCategories: false,
        topMutualFundCatData: false,
        newFundOfferList: false,
        topAmcList: false,
        topFundManagersList: false,
    });

    const handleBackPress = () => {
        // Navigate to Dashboard tab within Tabs navigator
        navigation.navigate('Tabs', { screen: 'Dashboard' });
    };

    // API call functions
    const fetchTopPerformingSchemes = async () => {
        try {
            setLoadingStates(prev => ({ ...prev, topPerformingSchemes: true }));
            console.log('Fetching Top Performing Schemes...');

            const [result, error]: any = await getTopPerformingSchemesApi();

            if (result) {
                console.log('Top Performing Schemes Result:', result);
                const schemesData = result?.data || [];
                setTopPerformingSchemes(schemesData);

                // Set the first category's schemes as default selected
                if (schemesData.length > 0) {
                    // console.log('schemesData[1]?.schemes', schemesData);
                    // console.log('schemesData[1]?.schemes', schemesData[1]?.scheme);
                    setSelectedCategorySchemes(schemesData[0]?.scheme || []);
                }

                // showToast(toastTypes.success, 'Top performing schemes loaded successfully');
            } else {
                console.log('Top Performing Schemes Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to load top performing schemes');
            }
        } catch (error: any) {
            console.log('Top Performing Schemes Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while loading top performing schemes');
        } finally {
            setLoadingStates(prev => ({ ...prev, topPerformingSchemes: false }));
        }
    };

    // Function to handle category selection
    const handleCategorySelect = (categoryIndex: number) => {
        setSelectedCategoryIndex(categoryIndex);
        const selectedCategory = topPerformingSchemes[categoryIndex];
        setSelectedCategorySchemes(selectedCategory?.scheme || []);
    };

    // Render category tab
    const renderCategoryTab = ({ item, index }: any) => {
        const isSelected = selectedCategoryIndex === index;
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleCategorySelect(index)}
                style={{
                    paddingHorizontal: responsiveWidth(4),
                    paddingVertical: responsiveWidth(1),
                    marginRight: responsiveWidth(2),
                    backgroundColor: isSelected ? colors.primary : colors.white,
                    borderRadius: borderRadius.middleSmall,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.fieldborder,
                }}
            >
                <CusText
                    text={item.categoryName || 'Category'}
                    size="SS"
                    medium
                    position="center"
                    color={isSelected ? colors.white : colors.Hard_Black}
                />
            </TouchableOpacity>
        );
    };

    // Render scheme card
    const renderSchemeCard = ({ item }: any) => {
        // console.log('item === >>>> ', item)
         let data: any = item;
        return (
            <Wrapper
                justify="apart"
                customStyles={{
                    backgroundColor: colors.white,
                    borderRadius: borderRadius.middleSmall,
                    padding: responsiveWidth(2),
                    marginRight: responsiveWidth(3),
                    width: responsiveWidth(80),
                    borderWidth: 1,
                    borderColor: colors.fieldborder,
                    gap: responsiveWidth(1)
                }}
            >
                <TouchableOpacity onPress={() => {
                    navigation.navigate('FunpickerDetail', { data });
                }}>
                    <Wrapper>
                        <CusText
                            text={item?.SchemeMaster?.ms_fullname}
                            size="SS"
                            bold
                            color={colors.primary1}
                        />
                    </Wrapper>
                </TouchableOpacity>
                <Wrapper row justify="apart" align="end">
                    <Wrapper align="center" row customStyles={{ gap: responsiveWidth(1) }}>
                        <IonIcon
                            name={parseFloat(item?.Return1yr || 0) >= 0 ? 'trending-up' : 'trending-down'}
                            color={parseFloat(item?.Return1yr || 0) >= 0 ? colors.green : colors.red}
                            size={responsiveWidth(5)}
                        />
                        <CusText
                            text={parseFloat(item?.Return1yr || 0).toFixed(2) + '%'}
                            size="SS"
                            color={parseFloat(item?.Return1yr || 0) >= 0 ? colors.green : colors.red}
                        />
                        <CusText
                            text={'p.a'}
                            size="S"
                            color={parseFloat(item?.Return1yr || 0) >= 0 ? colors.gray : colors.gray}
                        />
                    </Wrapper>
                    <Wrapper>
                        <CusText
                            text={'(1 Year)'}
                            size="S"
                            color={colors.gray}
                        />
                    </Wrapper>
                </Wrapper>
                <Wrapper row justify="apart" align="end">
                    <Wrapper>
                        <CusText
                            text={'Category'}
                            size="S"
                            color={colors.gray}
                        />
                        <CusText size="SS" text={item?.SchemeMaster?.SchemeCategory?.Name + ' - ' + item?.SchemeMaster?.SchemeSubcategory?.Name} />
                    </Wrapper>
                    <Wrapper align="center" row customStyles={{ gap: responsiveWidth(1) }}>
                        <IonIcon
                            name={parseFloat(item?.categoryReturnAvg || 0) >= 0 ? 'trending-up' : 'trending-down'}
                            color={parseFloat(item?.categoryReturnAvg || 0) >= 0 ? colors.green : colors.red}
                            size={responsiveWidth(5)}
                        />
                        <CusText
                            text={parseFloat(item?.categoryReturnAvg || 0).toFixed(2) + '%'}
                            size="SS"
                            color={parseFloat(item?.categoryReturnAvg || 0) >= 0 ? colors.green : colors.red}
                        />
                    </Wrapper>
                </Wrapper>
                <Wrapper row justify="apart" align="end">
                    <Wrapper>
                        <CusText
                            text={'Min. investment'}
                            size="S"
                            color={colors.gray}
                        />
                        <CusText size="SS" text={item?.minAmount || 0} />
                    </Wrapper>
                    <Wrapper align="end" >
                        <CusText
                            text={'Risk Rating'}
                            size="S"
                            color={colors.gray}
                        />
                        <CusText size="SS" text={item?.SchemeMaster?.riskLevel || '-'} />
                    </Wrapper>
                </Wrapper>
                <Wrapper row justify="apart" align="end">
                    <TouchableOpacity onPress={() => onTransactPress(item)}>
                        <Wrapper row align="center" color={colors.lightGray} customStyles={{ gap: responsiveWidth(0.5), borderRadius: borderRadius.middleSmall, padding: responsiveWidth(1) }}>
                            <IonIcon
                                name={'swap-horizontal-outline'}
                                color={colors.orange}
                                size={responsiveWidth(5)}
                            />
                            <CusText size="SS" text={'Transact'} />
                        </Wrapper>
                    </TouchableOpacity>
                    <Wrapper row align="center" color={colors.orange} customStyles={{ gap: responsiveWidth(0.5), borderRadius: borderRadius.middleSmall, padding: responsiveWidth(1) }}>
                        <IonIcon
                            name={'cart-outline'}
                            color={colors.Hard_White}
                            size={responsiveWidth(5)}
                        />

                    </Wrapper>
                </Wrapper>
            </Wrapper>
        );
    };

    const onTransactPress = async (item: any) => {
        console.log('onTransactPress item : ', item);
        try {

            const [result, error]: any = await getmfuisinDetailApi(item?.ISIN);
            if (result) {
                console.log('getmfuisinDetailApi result : ', result);
            } else {
                console.log('getmfuisinDetailApi error : ', error);
            }

            const [result1, error1]: any = await getmfucanDetailApi(item?.SchemeMaster?.ms_can);
            if (result1) {
                console.log('getmfucanDetailApi result : ', result1);
            } else {
                console.log('getmfucanDetailApi error : ', error1);
            }

        } catch (error: any) {
            console.log('onTransactPress error : ', error);
        }
    };

    const renderAmcCard = ({ item, index }: any) => {
        // Generate different colors for avatars
        const avatarColors = [
            'rgba(74, 144, 226, 0.15)', // Blue
            'rgba(52, 199, 89, 0.15)',  // Green
            'rgba(255, 149, 0, 0.15)',  // Orange
            'rgba(255, 59, 48, 0.15)',  // Red
            'rgba(175, 82, 222, 0.15)', // Purple
            'rgba(255, 204, 0, 0.15)',  // Yellow
        ];

        const textColors = [
            '#4A90E2', // Blue
            '#34C759', // Green
            '#FF9500', // Orange
            '#FF3B30', // Red
            '#AF52DE', // Purple
            '#FFCC00', // Yellow
        ];

        const avatarColor = avatarColors[index % avatarColors.length];
        const textColor = textColors[index % textColors.length];
        const firstLetter = item?.Name?.charAt(0)?.toUpperCase() || 'A';

        return (
            // <TouchableOpacity
            //     activeOpacity={0.7}
            //     onPress={() => {
            //         // Navigate to TopPerformingSchemes with AMC data
            //         navigation.navigate('TopPerformingSchemes', {
            //             amcData: {
            //                 id: item?.id,
            //                 name: item?.Name,
            //                 totalAUM: item?.total_AUM,
            //                 totalSchemes: item?.total_schemes,
            //                 aumDate: item?.AUMDate
            //             }
            //         });
            //     }}
            // >
            <Wrapper
                justify="apart"
                customStyles={{
                    backgroundColor: colors.white,
                    borderRadius: borderRadius.middleSmall,
                    padding: responsiveWidth(2),
                    marginRight: responsiveWidth(3),
                    width: responsiveWidth(50),
                    borderWidth: 1,
                    borderColor: colors.fieldborder,
                    gap: responsiveWidth(1)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        // Navigate to TopPerformingSchemes with AMC data
                        navigation.navigate('TopPerformingSchemes', {
                            amcData: {
                                id: item?.id,
                                name: item?.Name,
                                totalAUM: item?.total_AUM,
                                totalSchemes: item?.total_schemes,
                                aumDate: item?.AUMDate
                            }
                        });
                    }}
                >
                    <Wrapper row align="center" customStyles={{ gap: responsiveWidth(2) }}>
                        {/* Circular Avatar */}
                        <Wrapper
                            align="center"
                            justify="center"
                            position="center"
                            customStyles={{
                                width: responsiveWidth(9),
                                height: responsiveWidth(9),
                                borderRadius: responsiveWidth(5),
                                backgroundColor: avatarColor,
                            }}
                        >
                            <CusText
                                position="center"
                                text={firstLetter}
                                size="M"
                                bold
                                color={textColor}
                            />
                        </Wrapper>

                        {/* AMC Name */}
                        <Wrapper customStyles={{ flex: 1 }}>
                            <CusText
                                text={item?.Name}
                                size="SS"
                                bold
                                color={colors.hard_black}
                                numberOfLines={2}
                            />
                        </Wrapper>
                    </Wrapper>
                </TouchableOpacity>
                <Wrapper row justify="apart" align="end">
                    <Wrapper>
                        <CusText
                            text={'AUM'}
                            size="S"
                            color={colors.gray}
                        />
                        <CusText size="SS" text={item?.total_AUM ? convertToCrores(item?.total_AUM) : 0} />
                    </Wrapper>
                    <Wrapper align="end" >
                        <CusText
                            text={'Schemes'}
                            size="S"
                            color={colors.gray}
                        />
                        <CusText size="SS" text={item?.total_schemes || 0} />
                    </Wrapper>
                </Wrapper>
                <Wrapper row justify="apart" align="end">
                    <Wrapper>
                        <CusText
                            text={`(as on ${item?.AUMDate ? moment(item?.AUMDate).format('DD MMM YYYY') : '-'})`}
                            size="S"
                            color={colors.gray}
                        />

                    </Wrapper>
                </Wrapper>
            </Wrapper>
            // </TouchableOpacity>
        )
    }

    const renderFundManagerCard = ({ item, index }: any) => {
        // Generate different colors for avatars
        const avatarColors = [
            'rgba(74, 144, 226, 0.15)', // Blue
            'rgba(52, 199, 89, 0.15)',  // Green
            'rgba(255, 149, 0, 0.15)',  // Orange
            'rgba(255, 59, 48, 0.15)',  // Red
            'rgba(175, 82, 222, 0.15)', // Purple
            'rgba(255, 204, 0, 0.15)',  // Yellow
        ];

        const textColors = [
            '#4A90E2', // Blue
            '#34C759', // Green
            '#FF9500', // Orange
            '#FF3B30', // Red
            '#AF52DE', // Purple
            '#FFCC00', // Yellow
        ];

        const avatarColor = avatarColors[index % avatarColors.length];
        const textColor = textColors[index % textColors.length];
        const firstLetter = item?.manager_name?.charAt(0)?.toUpperCase() || 'F';
        const schemefirstLetter = item?.topScheme?.SchemeMaster?.ms_fullname?.charAt(0)?.toUpperCase() || 'F';

        return (
            // <TouchableOpacity
            //     activeOpacity={0.7}
            //     onPress={() => {
            //         // Navigate to TopPerformingSchemes with Fund Manager data
            //         navigation.navigate('TopPerformingSchemes', {
            //             fundManagerData: item
            //         });
            //     }}
            // >
            <Wrapper
                justify="apart"
                customStyles={{
                    backgroundColor: colors.white,
                    borderRadius: borderRadius.middleSmall,
                    padding: responsiveWidth(2),
                    marginRight: responsiveWidth(3),
                    width: responsiveWidth(70),
                    borderWidth: 1,
                    borderColor: colors.fieldborder,
                    gap: responsiveWidth(1)
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        // Navigate to TopPerformingSchemes with Fund Manager data
                        navigation.navigate('TopPerformingSchemes', {
                            fundManagerData: item
                        });
                    }}
                >
                    <Wrapper row align="center" customStyles={{ gap: responsiveWidth(2) }}>
                        {/* Circular Avatar */}
                        <Wrapper
                            align="center"
                            justify="center"
                            customStyles={{
                                width: responsiveWidth(9),
                                height: responsiveWidth(9),
                                borderRadius: responsiveWidth(5),
                                backgroundColor: avatarColor,
                            }}
                        >
                            <CusText
                                text={firstLetter}
                                size="N"
                                bold
                                color={textColor}
                            />
                        </Wrapper>

                        {/* Fund Manager Name */}
                        <Wrapper customStyles={{ flex: 1 }}>
                            <CusText
                                text={item?.manager_name}
                                size="SS"
                                bold
                                color={colors.hard_black}
                                numberOfLines={2}
                            />
                        </Wrapper>
                    </Wrapper>
                </TouchableOpacity>
                <Wrapper row align="start">
                    <Wrapper>
                        <CusText
                            text={'AUM Managed'}
                            size="S"
                            color={colors.gray}
                        />
                        <CusText size="SS" text={item?.total_AUM ? convertToCrores(item?.total_AUM) : 0} />
                    </Wrapper>
                </Wrapper>
                <Wrapper row justify="apart">
                    <Wrapper >
                        <CusText
                            text={'Top Performing Scheme'}
                            size="S"
                            color={colors.gray}
                        />
                        <Wrapper width={responsiveWidth(45)}>
                            <Wrapper row align="center" customStyles={{ gap: responsiveWidth(1.5) }}>
                                {/* Circular Avatar for Scheme */}
                                <Wrapper
                                    align="center"
                                    justify="center"
                                    customStyles={{
                                        width: responsiveWidth(6),
                                        height: responsiveWidth(6),
                                        borderRadius: responsiveWidth(3),
                                        backgroundColor: avatarColor,
                                    }}
                                >
                                    <CusText
                                        text={schemefirstLetter}
                                        size="XS"
                                        bold
                                        color={textColor}
                                    />
                                </Wrapper>

                                {/* Scheme Name */}
                                <Wrapper customStyles={{ flex: 1 }}>
                                    <CusText
                                        size="S"
                                        text={item?.topScheme?.SchemeMaster?.ms_fullname}
                                        numberOfLines={2}
                                    />
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>
                    </Wrapper>
                    <Wrapper align="end" >
                        <CusText
                            text={'3y Return %'}
                            size="S"
                            color={colors.gray}
                        />
                        <Wrapper align="center" row customStyles={{ gap: responsiveWidth(1) }}>
                            <IonIcon
                                name={parseFloat(item?.topScheme?.SchemeMaster?.SchemePerformances[0]?.Returns3yr || 0) >= 0 ? 'trending-up' : 'trending-down'}
                                color={parseFloat(item?.topScheme?.SchemeMaster?.SchemePerformances[0]?.Returns3yr || 0) >= 0 ? colors.green : colors.red}
                                size={responsiveWidth(5)}
                            />
                            <CusText
                                text={parseFloat(item?.topScheme?.SchemeMaster?.SchemePerformances[0]?.Returns3yr || 0).toFixed(2) + '%'}
                                size="SS"
                                color={parseFloat(item?.topScheme?.SchemeMaster?.SchemePerformances[0]?.Returns3yr || 0) >= 0 ? colors.green : colors.red}
                            />
                        </Wrapper>

                    </Wrapper>
                </Wrapper>
            </Wrapper>
            // </TouchableOpacity>
        )
    }

    const fetchAllSchemeCategories = async () => {
        try {
            setLoadingStates(prev => ({ ...prev, allSchemeCategories: true }));
            console.log('Fetching All Scheme Categories...');

            const [result, error]: any = await getAllSchemeCategoryApi();

            if (result) {
                console.log('All Scheme Categories Result:', result);
                setAllSchemeCategories(result?.data || []);
                showToast(toastTypes.success, 'Scheme categories loaded successfully');
            } else {
                console.log('All Scheme Categories Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to load scheme categories');
            }
        } catch (error: any) {
            console.log('All Scheme Categories Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while loading scheme categories');
        } finally {
            setLoadingStates(prev => ({ ...prev, allSchemeCategories: false }));
        }
    };

    const fetchTopMutualFundCatData = async () => {
        try {
            setLoadingStates(prev => ({ ...prev, topMutualFundCatData: true }));
            console.log('Fetching Top Mutual Fund Category Data...');

            const [result, error]: any = await getTopMutualFundCatDataApi();

            if (result) {
                console.log('Top Mutual Fund Category Data Result:', result);
                setTopMutualFundCatData(result?.data || []);
                showToast(toastTypes.success, 'Top mutual fund category data loaded successfully');
            } else {
                console.log('Top Mutual Fund Category Data Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to load top mutual fund category data');
            }
        } catch (error: any) {
            console.log('Top Mutual Fund Category Data Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while loading top mutual fund category data');
        } finally {
            setLoadingStates(prev => ({ ...prev, topMutualFundCatData: false }));
        }
    };

    const fetchNewFundOfferList = async () => {
        try {
            setLoadingStates(prev => ({ ...prev, newFundOfferList: true }));
            console.log('Fetching New Fund Offer List...');

            const [result, error]: any = await getNewFundOfferListApi();

            if (result) {
                console.log('New Fund Offer List Result:', result);
                setNewFundOfferList(result?.data || []);
                // showToast(toastTypes.success, 'New fund offers loaded successfully');
            } else {
                console.log('New Fund Offer List Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to load new fund offers');
            }
        } catch (error: any) {
            console.log('New Fund Offer List Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while loading new fund offers');
        } finally {
            setLoadingStates(prev => ({ ...prev, newFundOfferList: false }));
        }
    };

    const fetchTopAmcList = async () => {
        try {
            setLoadingStates(prev => ({ ...prev, topAmcList: true }));
            console.log('Fetching Top AMC List...');

            const [result, error]: any = await getTopAmcListApi('');

            if (result) {
                console.log('Top AMC List Result:', result);
                setTopAmcList(result?.data || []);
                // showToast(toastTypes.success, 'Top AMC list loaded successfully');
            } else {
                console.log('Top AMC List Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to load top AMC list');
            }
        } catch (error: any) {
            console.log('Top AMC List Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while loading top AMC list');
        } finally {
            setLoadingStates(prev => ({ ...prev, topAmcList: false }));
        }
    };

    const fetchTopFundManagersList = async () => {
        try {
            setLoadingStates(prev => ({ ...prev, topFundManagersList: true }));
            console.log('Fetching Top Fund Managers List...');

            const [result, error]: any = await getTopFundManagersListApi();

            if (result) {
                console.log('Top Fund Managers List Result:', result);
                setTopFundManagersList(result?.data || []);
                // showToast(toastTypes.success, 'Top fund managers loaded successfully');
            } else {
                console.log('Top Fund Managers List Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to load top fund managers');
            }
        } catch (error: any) {
            console.log('Top Fund Managers List Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while loading top fund managers');
        } finally {
            setLoadingStates(prev => ({ ...prev, topFundManagersList: false }));
        }
    };

    // Load all data function
    const loadAllMutualFundData = async () => {
        setIsLoading(true);
        try {
            // Call all APIs concurrently for better performance
            await Promise.all([
                fetchTopPerformingSchemes(),
                fetchNewFundOfferList(),
                fetchTopAmcList(),
                fetchTopFundManagersList(),

                // fetchAllSchemeCategories(),
                // fetchTopMutualFundCatData(),



            ]);
        } catch (error) {
            console.log('Error loading mutual fund data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to load data when component mounts or comes into focus
    useEffect(() => {
        if (isFocused) {
            loadAllMutualFundData();
        }
    }, [isFocused]);

    return (
        <>
            <Header
                backBtn
                name="Mutual Fund"
                onBackPress={handleBackPress}
            />

            <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
                <Wrapper customStyles={{}}>
                    {/* Top Performing Schemes Section */}
                    <Wrapper customStyles={{ marginBottom: responsiveWidth(0), paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveWidth(2) }}>
                        <Wrapper row justify="apart" align="center">
                            <CusText
                                text="Top Performing Schemes"
                                size="M"
                                bold
                                color={colors.Hard_Black}
                                customStyles={{}}
                            />
                            <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('TopPerformingSchemes')}>
                                <CusText
                                    text="View All"
                                    size="MS"
                                    color={colors.primary}
                                />
                            </TouchableOpacity>
                        </Wrapper>

                        {loadingStates.topPerformingSchemes ? (
                            <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(5) }}>
                                <ActivityIndicator size="small" color={colors.primary} />
                                <CusText text="Loading categories..." size="S" color={colors.gray} />
                            </Wrapper>
                        ) : (
                            <>
                                {/* Category Tabs */}
                                {topPerformingSchemes.length > 0 && (
                                    <Wrapper customStyles={{ paddingVertical: responsiveWidth(2) }}>
                                        <FlatList
                                            data={topPerformingSchemes}
                                            renderItem={renderCategoryTab}
                                            keyExtractor={(item, index) => index.toString()}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingHorizontal: responsiveWidth(0) }}
                                        />
                                    </Wrapper>
                                )}

                                {/* Schemes Slider */}
                                {selectedCategorySchemes.length > 0 ? (
                                    <Wrapper flex>
                                        <FlatList
                                            data={selectedCategorySchemes}
                                            renderItem={renderSchemeCard}
                                            keyExtractor={(item, index) => index.toString()}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingHorizontal: responsiveWidth(0) }}
                                        />
                                    </Wrapper>
                                ) : (
                                    <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(5) }}>
                                        <CusText
                                            text="No schemes available for this category"
                                            size="S"
                                            color={colors.gray}
                                        />
                                    </Wrapper>
                                )}
                            </>
                        )}
                    </Wrapper>

                    {/* Top NFO Section */}
                    <Wrapper customStyles={{ marginBottom: responsiveWidth(0), paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveWidth(2) }}>
                        {/* <CusText
                            text="New Fund Offers (NFO)"
                            size="M"
                            bold
                            color={colors.Hard_Black}
                            customStyles={{}}
                        /> */}

                        <Wrapper row justify="apart" align="center">
                            <CusText
                                text="New Fund Offers (NFO)"
                                size="M"
                                bold
                                color={colors.Hard_Black}
                                customStyles={{}}
                            />
                            {
                                newFundOfferList.length > 0 && (
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('FundPicker')}>
                                        <CusText
                                            text="View All"
                                            size="MS"
                                            color={colors.primary}
                                        />
                                    </TouchableOpacity>
                                )
                            }

                        </Wrapper>


                        {loadingStates.newFundOfferList ? (
                            <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(5) }}>
                                <ActivityIndicator size="small" color={colors.primary} />
                            </Wrapper>
                        ) : (
                            <>
                                <Wrapper customStyles={{ paddingVertical: responsiveWidth(2) }}>
                                    {
                                        newFundOfferList.length === 0 ? (
                                            <CusText
                                                text="No new fund offers available"
                                                size="S"
                                                color={colors.gray}
                                            />
                                        ) :
                                            (
                                                <FlatList
                                                    data={newFundOfferList}
                                                    renderItem={renderFundManagerCard}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                    contentContainerStyle={{ paddingHorizontal: responsiveWidth(0) }}
                                                />
                                            )

                                    }

                                    {/* <FlatList
                                        data={newFundOfferList}
                                        renderItem={renderFundManagerCard}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: responsiveWidth(0) }}
                                    /> */}
                                </Wrapper>
                            </>
                        )}
                    </Wrapper>

                    {/* Top AMC List Section */}
                    <Wrapper customStyles={{ marginBottom: responsiveWidth(0), paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveWidth(2) }}>
                        {/* <CusText
                            text="Top AMC List"
                            size="M"
                            bold
                            color={colors.Hard_Black}
                            customStyles={{}}
                        /> */}
                        <Wrapper row justify="apart" align="center">
                            <CusText
                                text="Top AMC List"
                                size="M"
                                bold
                                color={colors.Hard_Black}
                                customStyles={{}}
                            />
                            {
                                topAmcList.length > 0 && (
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('AllAmcList')}>
                                        <CusText
                                            text="View All"
                                            size="MS"
                                            color={colors.primary}
                                        />
                                    </TouchableOpacity>
                                )
                            }
                        </Wrapper>

                        {loadingStates.topAmcList ? (
                            <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(5) }}>
                                <ActivityIndicator size="small" color={colors.primary} />
                            </Wrapper>
                        ) : (
                            <>
                                <Wrapper customStyles={{ paddingVertical: responsiveWidth(2) }}>
                                    <FlatList
                                        data={topAmcList}
                                        renderItem={renderAmcCard}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: responsiveWidth(0) }}
                                    />
                                </Wrapper>
                            </>
                        )}
                    </Wrapper>

                    {/* Top Fund Managers Section */}
                    <Wrapper customStyles={{ marginBottom: responsiveWidth(0), paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveWidth(2) }}>
                        {/* <CusText
                            text="Top Fund Managers"
                            size="M"
                            bold
                            color={colors.Hard_Black}
                            customStyles={{}}
                        /> */}
                        <Wrapper row justify="apart" align="center">
                            <CusText
                                text="Top Fund Managers"
                                size="M"
                                bold
                                color={colors.Hard_Black}
                                customStyles={{}}
                            />
                            {
                                topFundManagersList.length > 0 && (
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('AllFundManagerList')}>
                                        <CusText
                                            text="View All"
                                            size="MS"
                                            color={colors.primary}
                                        />
                                    </TouchableOpacity>
                                )
                            }
                        </Wrapper>

                        {loadingStates.topFundManagersList ? (
                            <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(5) }}>
                                <ActivityIndicator size="small" color={colors.primary} />
                            </Wrapper>
                        ) : (
                            <>
                                <Wrapper customStyles={{ paddingVertical: responsiveWidth(2) }}>
                                    <FlatList
                                        data={topFundManagersList}
                                        renderItem={renderFundManagerCard}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: responsiveWidth(0) }}
                                    />
                                </Wrapper>
                            </>
                        )}
                    </Wrapper>

                    {/* <Spacer y="L" /> */}

                    {/* All Scheme Categories Section */}
                    {/* <Wrapper customStyles={{ marginBottom: responsiveWidth(4) }}>
                        <CusText
                            text="All Scheme Categories"
                            size="M"
                            bold
                            color={colors.Hard_Black}
                            customStyles={{ marginBottom: responsiveWidth(2) }}
                        />
                        {loadingStates.allSchemeCategories ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <CusText
                                text={`Loaded ${allSchemeCategories.length} categories`}
                                size="S"
                                color={colors.gray}
                            />
                        )}
                    </Wrapper> */}

                    {/* Top Mutual Fund Category Data Section */}
                    {/* <Wrapper customStyles={{ marginBottom: responsiveWidth(4) }}>
                        <CusText
                            text="Top Mutual Fund Category Data"
                            size="M"
                            bold
                            color={colors.Hard_Black}
                            customStyles={{ marginBottom: responsiveWidth(2) }}
                        />
                        {loadingStates.topMutualFundCatData ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <CusText
                                text={`Loaded ${topMutualFundCatData.length} category data`}
                                size="S"
                                color={colors.gray}
                            />
                        )}
                    </Wrapper> */}

                    {/* New Fund Offer List Section */}
                    {/* <Wrapper customStyles={{ marginBottom: responsiveWidth(4) }}>
                        <CusText
                            text="New Fund Offers"
                            size="M"
                            bold
                            color={colors.Hard_Black}
                            customStyles={{ marginBottom: responsiveWidth(2) }}
                        />
                        {loadingStates.newFundOfferList ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <CusText
                                text={`Loaded ${newFundOfferList.length} new fund offers`}
                                size="S"
                                color={colors.gray}
                            />
                        )}
                    </Wrapper> */}

                    {/* Top AMC List Section */}
                    {/* <Wrapper customStyles={{ marginBottom: responsiveWidth(4) }}>
                        <CusText
                            text="Top AMC List"
                            size="M"
                            bold
                            color={colors.Hard_Black}
                            customStyles={{ marginBottom: responsiveWidth(2) }}
                        />
                        {loadingStates.topAmcList ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <CusText
                                text={`Loaded ${topAmcList.length} AMCs`}
                                size="S"
                                color={colors.gray}
                            />
                        )}
                    </Wrapper> */}

                    {/* Top Fund Managers List Section */}
                    {/* <Wrapper customStyles={{ marginBottom: responsiveWidth(4) }}>
                        <CusText
                            text="Top Fund Managers"
                            size="M"
                            bold
                            color={colors.Hard_Black}
                            customStyles={{ marginBottom: responsiveWidth(2) }}
                        />
                        {loadingStates.topFundManagersList ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <CusText
                                text={`Loaded ${topFundManagersList.length} fund managers`}
                                size="S"
                                color={colors.gray}
                            />
                        )}
                    </Wrapper> */}

                </Wrapper>
            </ScrollView>
        </>
    )
}

export default MutualFunds;