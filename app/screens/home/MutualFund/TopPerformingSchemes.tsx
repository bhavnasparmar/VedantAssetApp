import { useNavigation, useIsFocused, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { ScrollView, ActivityIndicator, FlatList, TouchableOpacity, Modal, StyleSheet } from "react-native";
import Header from "../../../shared/components/Header/Header";
import { getMutualFundClassesSchemesApi, getSchemeByAmcIdApi, getFundManagerDetailApi } from "../../../api/homeapi";
import { showToast, toastTypes } from "../../../services/toastService";
import Wrapper from "../../../ui/wrapper";
import CusText from "../../../ui/custom-text";
import { colors, responsiveWidth, borderRadius } from "../../../styles/variables";
import IonIcon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { convertToCrores, toFixedDataForReturn } from "../../../utils/Commanutils";
import Pagination from "../../../ui/Pagination";
import { styles } from "../fundpicker/fundpickerStyles";
import { View } from "react-native";
import CusButton from "../../../ui/custom-button";
import moment from "moment";

const TopPerformingSchemes = () => {
    const navigation: any = useNavigation();
    const isFocused = useIsFocused();
    const route: any = useRoute();

    // Get navigation parameters
    const amcData = route?.params?.amcData;
    const fundManagerData = route?.params?.fundManagerData;
    const isAmcView = !!amcData; // true if coming from AMC list
    const isFundManagerView = !!fundManagerData; // true if coming from Fund Manager list
    const isSpecialView = isAmcView || isFundManagerView; // true if coming from AMC or Fund Manager

    // State management
    const [activeTab, setActiveTab] = useState(isSpecialView ? 'schemes' : 'schemes'); // Always default to 'schemes' tab
    const [topPerformingSchemes, setTopPerformingSchemes] = useState<any[]>([]);
    const [overviewData, setOverviewData] = useState<any>({});
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const [selectedCategorySchemes, setSelectedCategorySchemes] = useState<any[]>([]);
    const [selectedCategoryCount, setSelectedCategoryCount] = useState(0);
    const [paginatedSchemes, setPaginatedSchemes] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 25;

    // Sort state variables
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    // Filter state variables
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
    const [tempSelectedSubCategories, setTempSelectedSubCategories] = useState<number[]>([]);

    // Returns visibility state variables
    const [isReturnsVisible, setIsReturnsVisible] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState<number[]>([6, 8, 9]); // Default: 1Y, 3Y, 5Y

    // Available return periods
    const [defaultReturns] = useState([
        { id: 1, name: 'Return 1 Day', shortName: '1D', field: 'SchemePerformances.Return1d' },
        { id: 2, name: 'Return 1 Week', shortName: '1W', field: 'SchemePerformances.Return1w' },
        { id: 3, name: 'Return 1 Month', shortName: '1M', field: 'SchemePerformances.Return1mth' },
        { id: 4, name: 'Return 3 Month', shortName: '3M', field: 'SchemePerformances.Return3mth' },
        { id: 5, name: 'Return 6 Month', shortName: '6M', field: 'SchemePerformances.Return6mth' },
        { id: 6, name: 'Return 1 Year', shortName: '1Y', field: 'SchemePerformances.Return1yr' },
        { id: 7, name: 'Return 2 Year', shortName: '2Y', field: 'SchemePerformances.Returns2yr' },
        { id: 8, name: 'Return 3 Year', shortName: '3Y', field: 'SchemePerformances.Returns3yr' },
        { id: 9, name: 'Return 5 Year', shortName: '5Y', field: 'SchemePerformances.Returns5yr' },
        { id: 10, name: 'Return 7 Year', shortName: '7Y', field: 'SchemePerformances.Returns7yr' },
        { id: 11, name: 'Return 10 Year', shortName: '10Y', field: 'SchemePerformances.Returns10yr' },
        { id: 12, name: 'Return Since Incep', shortName: 'Since Incep', field: 'SchemePerformances.ReturnSinceIncep' }
    ]);

    const handleBackPress = () => {
        navigation.goBack();
    };



    // API call function
    const fetchTopPerformingSchemes = async (page: number = 1, categoryIndex?: number, sort: any = null, filters: any = null) => {
        try {
            setIsLoading(true);
            console.log('Fetching schemes for page:', page, 'categoryIndex:', categoryIndex, 'sort:', sort, 'filters:', filters, 'isAmcView:', isAmcView);

            // Build filters object
            let filterObj = {};
            if (filters && filters.subCategory && filters.subCategory.length > 0) {
                filterObj = { subCategory: filters.subCategory };
            }

            const payload = {
                filters: Object.keys(filterObj).length > 0 ? filterObj : false,
                limit: 25,
                sort: sort !== null ? sort : { "SchemePerformances.Returns3yr": "DESC" },
                page: page
            };

            let result: any, error: any;

            if (isAmcView && amcData?.id) {
                // Call AMC-specific API
                const response = await getSchemeByAmcIdApi(amcData.id.toString(), payload);
                [result, error] = Array.isArray(response) ? response : [response, null];
            } else if (isFundManagerView && fundManagerData?.manager_id) {
                // Call Fund Manager-specific API
                const response = await getFundManagerDetailApi(fundManagerData?.manager_id);
                [result, error] = Array.isArray(response) ? response : [response, null];

            } else {
                // Call regular top performing schemes API
                const response = await getMutualFundClassesSchemesApi(payload);
                [result, error] = Array.isArray(response) ? response : [response, null];
            }

            if (result) {
                console.log('Top Performing Schemes Result:', result);
                const categoriesData = result?.data || [];

                console.log('categoriesData === >>>:', categoriesData);

                setTopPerformingSchemes(categoriesData);

                if (isAmcView && amcData?.id) {
                    setOverviewData(categoriesData?.overview);
                    const targetCategoryIndex = categoryIndex !== undefined ? categoryIndex :
                        (selectedCategoryIndex < categoriesData.length ? selectedCategoryIndex : 0);

                    const selectedCategory = categoriesData[targetCategoryIndex];
                    const categorySchemes = categoriesData?.schemeList?.rows || [];
                    console.log('categoriesData categorySchemes=== >>>:', categorySchemes);
                    const categoryCount = categoriesData?.schemeList?.count || 0;

                    // Update state with the correct category index
                    setSelectedCategoryIndex(targetCategoryIndex);
                    setSelectedCategorySchemes(categorySchemes);
                    setSelectedCategoryCount(categoryCount);
                    setTotalPages(Math.ceil(categoryCount / itemsPerPage));
                    setCurrentPage(page);
                    setPaginatedSchemes(categorySchemes);

                } else if (isFundManagerView && fundManagerData?.manager_id) {
                    // Handle Fund Manager data structure
                    console.log('Fund Manager Data:', categoriesData);
                    setOverviewData(categoriesData?.overview || categoriesData);
                    const fundManagerSchemes = categoriesData?.SchemeFundManagers || categoriesData?.schemeList || [];
                    console.log('Fund Manager schemes=== >>>:', fundManagerSchemes);

                    // Update state for Fund Manager view
                    setSelectedCategorySchemes(fundManagerSchemes);
                    setSelectedCategoryCount(fundManagerSchemes.length);
                    setTotalPages(Math.ceil(fundManagerSchemes.length / itemsPerPage));
                    setCurrentPage(page);
                    setPaginatedSchemes(fundManagerSchemes);

                } else {



                    // Use passed categoryIndex or maintain current selected category
                    if (categoriesData.length > 0) {
                        const targetCategoryIndex = categoryIndex !== undefined ? categoryIndex :
                            (selectedCategoryIndex < categoriesData.length ? selectedCategoryIndex : 0);

                        const selectedCategory = categoriesData[targetCategoryIndex];
                        const categorySchemes = selectedCategory?.schemeList?.rows || [];
                        console.log('categoriesData categorySchemes=== >>>:', categorySchemes);
                        const categoryCount = selectedCategory?.schemeList?.count || 0;

                        // Update state with the correct category index
                        setSelectedCategoryIndex(targetCategoryIndex);
                        setSelectedCategorySchemes(categorySchemes);
                        setSelectedCategoryCount(categoryCount);
                        setTotalPages(Math.ceil(categoryCount / itemsPerPage));
                        setCurrentPage(page);
                        setPaginatedSchemes(categorySchemes);
                    }
                }
            } else {
                console.log('Top Performing Schemes Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to load top performing schemes');
            }
        } catch (error: any) {
            console.log('Top Performing Schemes Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while loading top performing schemes');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle category selection
    const handleCategorySelect = (categoryIndex: number) => {
        console.log('Category selected:', categoryIndex);

        // Reset filters when changing category
        setSelectedSubCategories([]);
        setTempSelectedSubCategories([]);

        // Maintain current sort when changing category
        const currentSort = sortField && sortOrder ? { [sortField]: sortOrder } : null;

        // Call API with page 1 and the new category index
        // The API response handler will update all the states correctly
        fetchTopPerformingSchemes(1, categoryIndex, currentSort, null);
    };

    // Handle page change - reset sorting and call API with new page number
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            // Clear sort state when changing pages
            setSortField('');
            setSortOrder('');

            // Use default sort (3Y Returns DESC) when changing pages
            const defaultSort = { "SchemePerformances.Returns3yr": "DESC" };
            const currentFilters = selectedSubCategories.length > 0 ? { subCategory: selectedSubCategories } : null;
            fetchTopPerformingSchemes(page, selectedCategoryIndex, defaultSort, currentFilters);
        }
    };

    // Handle sort functionality - apply sort on current page
    const handleSort = (field: string) => {
        let newOrder = 'ASC';

        if (sortField === field) {
            if (sortOrder === 'ASC') {
                newOrder = 'DESC';
            } else if (sortOrder === 'DESC') {
                setSortField('');
                setSortOrder('');
                const defaultSort = { "SchemePerformances.Returns3yr": "DESC" };
                // Apply sort on current page, not page 1
                const currentFilters = selectedSubCategories.length > 0 ? { subCategory: selectedSubCategories } : null;
                fetchTopPerformingSchemes(currentPage, selectedCategoryIndex, defaultSort, currentFilters);
                return;
            }
        }

        setSortField(field);
        setSortOrder(newOrder);

        const sort = { [field]: newOrder };
        // Apply sort on current page, not page 1
        const currentFilters = selectedSubCategories.length > 0 ? { subCategory: selectedSubCategories } : null;
        fetchTopPerformingSchemes(currentPage, selectedCategoryIndex, sort, currentFilters);
    };

    // Handle filter functionality
    const handleFilterApply = () => {
        // Reset sort and pagination when applying filters
        setSortField('');
        setSortOrder('');
        setCurrentPage(1);

        // Apply selected filters
        setSelectedSubCategories([...tempSelectedSubCategories]);

        const filters = tempSelectedSubCategories.length > 0 ? { subCategory: tempSelectedSubCategories } : null;
        const defaultSort = { "SchemePerformances.Returns3yr": "DESC" };

        fetchTopPerformingSchemes(1, selectedCategoryIndex, defaultSort, filters);
        setIsFilterVisible(false);
    };

    const handleFilterReset = () => {
        // Reset all filters, sort, and pagination
        setTempSelectedSubCategories([]);
        setSelectedSubCategories([]);
        setSortField('');
        setSortOrder('');
        setCurrentPage(1);

        const defaultSort = { "SchemePerformances.Returns3yr": "DESC" };
        fetchTopPerformingSchemes(1, selectedCategoryIndex, defaultSort, null);
        setIsFilterVisible(false);
    };

    const toggleSubCategory = (subCategoryId: number) => {
        setTempSelectedSubCategories(prevSelected => {
            if (prevSelected.includes(subCategoryId)) {
                // Remove from selection
                return prevSelected.filter(id => id !== subCategoryId);
            } else {
                // Add to selection
                return [...prevSelected, subCategoryId];
            }
        });
    };

    // Toggle return columns visibility
    const toggleReturnColumns = (item: any) => {
        setSelectedReturn(prevSelected => {
            if (prevSelected.includes(item.id)) {
                return prevSelected.filter(id => id !== item.id);
            } else {
                return [...prevSelected, item.id];
            }
        });
    };

    // Helper function to get return value based on return type
    const getReturnValue = (item: any, returnItem: any) => {
        const performance = item?.SchemePerformances?.[0];
        if (!performance) return '-';

        switch (returnItem.id) {
            case 1: // 1 Day
                return toFixedDataForReturn(performance?.Return1d);
            case 2: // 1 Week
                return toFixedDataForReturn(performance?.Return1w);
            case 3: // 1 Month
                return toFixedDataForReturn(performance?.Return1mth);
            case 4: // 3 Month
                return toFixedDataForReturn(performance?.Return3mth);
            case 5: // 6 Month
                return toFixedDataForReturn(performance?.Return6mth);
            case 6: // 1 Year
                return toFixedDataForReturn(performance?.Return1yr);
            case 7: // 2 Year
                return toFixedDataForReturn(performance?.Returns2yr);
            case 8: // 3 Year
                return toFixedDataForReturn(performance?.Returns3yr);
            case 9: // 5 Year
                return toFixedDataForReturn(performance?.Returns5yr);
            case 10: // 7 Year
                return toFixedDataForReturn(performance?.Returns7yr);
            case 11: // 10 Year
                return toFixedDataForReturn(performance?.Returns10yr);
            case 12: // Since Inception
                return performance?.ReturnSinceIncep ? performance.ReturnSinceIncep.toFixed(2) + '%' : '-';
            default:
                return '-';
        }
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
                    // marginRight: responsiveWidth(2),
                    backgroundColor: isSelected ? colors.primary : colors.white,
                    borderRadius: borderRadius.middleSmall,
                    borderWidth: 1,
                    borderColor: isSelected ? colors.primary : colors.fieldborder,
                    justifyContent: 'center',
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

    // Render table header - FundPicker style with sort functionality
    const renderTableHeader = () => {
        return (
            <Wrapper customStyles={styles.headerRow}>
                {/* Scheme Column */}
                <Wrapper align='center' justify='center' row width={responsiveWidth(45)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
                    <CusText style={styles.headerCell} size='SS' semibold text={'Scheme'} />
                    <TouchableOpacity onPress={() => handleSort('ms_fullname')}>
                        <Ionicons
                            name={
                                sortField === 'ms_fullname'
                                    ? sortOrder === 'ASC'
                                        ? 'arrow-up-outline'
                                        : 'arrow-down-outline'
                                    : 'swap-vertical-outline'
                            }
                            color={colors.gray}
                            size={responsiveWidth(3.5)}
                        />
                    </TouchableOpacity>
                </Wrapper>

                {/* Rating Column */}
                <Wrapper row align='center' justify='center' width={responsiveWidth(30)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
                    <CusText style={styles.headerCell} size='SS' semibold text={'Rating'} />
                    <TouchableOpacity onPress={() => handleSort('SchemePerformances.OverallRating')}>
                        <Ionicons
                            name={
                                sortField === 'SchemePerformances.OverallRating'
                                    ? sortOrder === 'ASC'
                                        ? 'arrow-up-outline'
                                        : 'arrow-down-outline'
                                    : 'swap-vertical-outline'
                            }
                            color={colors.gray}
                            size={responsiveWidth(3.5)}
                        />
                    </TouchableOpacity>
                </Wrapper>

                {/* NAV Column */}
                <Wrapper row align='center' justify='center' width={responsiveWidth(20)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
                    <CusText style={styles.headerCell} size='SS' semibold text={'NAV'} />
                    <TouchableOpacity onPress={() => handleSort('SchemePerformances.Nav')}>
                        <Ionicons
                            name={
                                sortField === 'SchemePerformances.Nav'
                                    ? sortOrder === 'ASC'
                                        ? 'arrow-up-outline'
                                        : 'arrow-down-outline'
                                    : 'swap-vertical-outline'
                            }
                            color={colors.gray}
                            size={responsiveWidth(3.5)}
                        />
                    </TouchableOpacity>
                </Wrapper>

                {/* AUM Column */}
                <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
                    <CusText style={styles.headerCell} size='SS' semibold text={'AUM (Cr.)'} />
                    <TouchableOpacity onPress={() => handleSort('SchemePerformances.AUM')}>
                        <Ionicons
                            name={
                                sortField === 'SchemePerformances.AUM'
                                    ? sortOrder === 'ASC'
                                        ? 'arrow-up-outline'
                                        : 'arrow-down-outline'
                                    : 'swap-vertical-outline'
                            }
                            color={colors.gray}
                            size={responsiveWidth(3.5)}
                        />
                    </TouchableOpacity>
                </Wrapper>

                {/* Expense Ratio Column */}
                <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
                    <CusText style={styles.headerCell} size='SS' semibold text={'Exp. Ratio'} />
                    <TouchableOpacity onPress={() => handleSort('net_expense_ratio')}>
                        <Ionicons
                            name={
                                sortField === 'net_expense_ratio'
                                    ? sortOrder === 'ASC'
                                        ? 'arrow-up-outline'
                                        : 'arrow-down-outline'
                                    : 'swap-vertical-outline'
                            }
                            color={colors.gray}
                            size={responsiveWidth(3.5)}
                        />
                    </TouchableOpacity>
                </Wrapper>

                {/* Dynamic Return Columns based on selectedReturn */}
                {defaultReturns.map((returnItem) => (
                    selectedReturn.includes(returnItem.id) && (
                        <Wrapper
                            key={returnItem.id}
                            row
                            align='center'
                            justify='center'
                            width={responsiveWidth(25)}
                            customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}
                        >
                            <CusText style={styles.headerCell} size='SS' semibold text={returnItem.shortName} />
                            <TouchableOpacity onPress={() => handleSort(returnItem.field)}>
                                <Ionicons
                                    name={
                                        sortField === returnItem.field
                                            ? sortOrder === 'ASC'
                                                ? 'arrow-up-outline'
                                                : 'arrow-down-outline'
                                            : 'swap-vertical-outline'
                                    }
                                    color={colors.gray}
                                    size={responsiveWidth(3.5)}
                                />
                            </TouchableOpacity>
                        </Wrapper>
                    )
                ))}
            </Wrapper>
        );
    };

    // Render scheme row - FundPicker style
    const renderSchemeRow = ({ item }: any) => {


        let data: any = fundManagerData?.manager_id ? item?.SchemeMaster : item;

        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate('FunpickerDetail', { data });
            }}>
                <Wrapper customStyles={styles.row}>
                    {/* Scheme Name */}
                    <View style={[styles.cell, { width: responsiveWidth(45) }]}>
                        <CusText customStyles={styles.fundName} text={data?.ms_fullname || 'N/A'} />
                        <Wrapper row>
                            <CusText style={styles.fundCategory} text={data?.SchemeCategory?.Name} />
                            <CusText text={' - '} size="XS" color={colors.black} />
                            <CusText
                                text={data?.SchemeSubcategory?.Name}
                                style={styles.fundCategory}
                            />
                        </Wrapper>
                        <Wrapper row>
                            <Wrapper color={'#f9f9f9'} customStyles={styles.swipebutton}>
                                <IonIcon name='swap-horizontal-outline' />
                            </Wrapper>
                            <Wrapper color={colors.secondary} customStyles={styles.swipebutton}>
                                <IonIcon name='cart' color={colors.white} />
                            </Wrapper>
                        </Wrapper>
                    </View>

                    {/* Rating */}
                    <View style={[styles.cell, { width: responsiveWidth(30) }]}>
                        <Wrapper position='center' align="center" row>
                            {(data?.SchemePerformances?.length
                                ? data?.SchemePerformances[0]?.OverallRating
                                : 0) && (
                                    <CusText
                                        text={
                                            data?.SchemePerformances?.length
                                                ? data?.SchemePerformances[0]?.OverallRating
                                                : 0
                                        }
                                        size='SS'
                                    />
                                )}
                            {(data?.SchemePerformances?.length
                                ? data?.SchemePerformances[0]?.OverallRating
                                : 0) && (
                                    <IonIcon
                                        name="star"
                                        size={responsiveWidth(3)}
                                        color={colors.secondary}
                                    />
                                )}
                        </Wrapper>
                    </View>

                    {/* NAV */}
                    <View style={[styles.cell, { width: responsiveWidth(20) }]}>
                        <Wrapper position='center' align="center" row>
                            <CusText size='SS' position='center' text={data?.SchemePerformances?.[0]?.Nav || '-'} />
                        </Wrapper>
                    </View>

                    {/* AUM */}
                    <View style={[styles.cell, { width: responsiveWidth(25) }]}>
                        <Wrapper position='center' align="center" row>
                            <CusText size='SS' position='center' text={convertToCrores(
                                data?.SchemePerformances?.[0]?.AUM
                                    ? data?.SchemePerformances?.[0]?.AUM
                                    : 0,
                            )} />
                        </Wrapper>
                    </View>

                    {/* Expense Ratio */}
                    <View style={[styles.cell, { width: responsiveWidth(25) }]}>
                        <Wrapper position='center' align="center" row>
                            <CusText size='SS' position='center' text={data?.net_expense_ratio || '-'} />
                        </Wrapper>
                    </View>

                    {/* Dynamic Return Columns based on selectedReturn */}
                    {defaultReturns.map((returnItem) => (
                        selectedReturn.includes(returnItem.id) && (
                            <View
                                key={returnItem.id}
                                style={[styles.cell, { width: responsiveWidth(25) }]}
                            >
                                <Wrapper position='center' align="center" row>
                                    <CusText
                                        size='SS'
                                        position='center'
                                        text={getReturnValue(data, returnItem)}
                                    />
                                </Wrapper>
                            </View>
                        )
                    ))}
                </Wrapper>
            </TouchableOpacity>
        );
    };

    // Effect to set initial tab to schemes for all views
    useEffect(() => {
        setActiveTab('schemes');
    }, []);

    // Effect to load data when component mounts or comes into focus
    useEffect(() => {
        if (isFocused) {
            fetchTopPerformingSchemes();
        }
    }, [isFocused]);

    return (
        <Wrapper customStyles={{ flex: 1 }} color={colors.white}>
            <Header
                backBtn
                name={
                    isAmcView ? (amcData?.name || 'AMC Schemes') :
                        isFundManagerView ? (fundManagerData?.name || 'Fund Manager Schemes') :
                            "Top Performing Schemes"
                }
                onBackPress={handleBackPress}
            />

            {/* Tabs Section - Always Show */}
            <Wrapper
                customStyles={{
                    backgroundColor: colors.white,
                    paddingHorizontal: responsiveWidth(2),
                    paddingVertical: responsiveWidth(1),
                    borderBottomWidth: 1,
                    borderBottomColor: colors.fieldborder,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                }}
            >
                {isSpecialView ? (
                    // AMC/Fund Manager View - Show Schemes Overview and Overview tabs
                    <>
                        {
                            isFundManagerView && (
                                <Wrapper row align="center" customStyles={{ gap: responsiveWidth(2), marginBottom: responsiveWidth(2) }}>
                                    {/* Circular Avatars for Fund Manager Name */}
                                    {(() => {
                                        const fullName = fundManagerData?.manager_name || '';
                                        const nameParts = fullName.split(' ');
                                        const firstName = nameParts[0] || '';
                                        const lastName = nameParts[nameParts.length - 1] || '';

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

                                        const firstInitial = firstName.charAt(0)?.toUpperCase() || 'F';
                                        const lastInitial = lastName.charAt(0)?.toUpperCase() || 'M';

                                        const initials = lastName && lastName !== firstName
                                            ? `${firstInitial}${lastInitial}`
                                            : firstInitial;

                                        return (
                                            <>
                                                {/* Single Avatar with Both Initials */}
                                                <Wrapper
                                                    align="center"
                                                    justify="center"
                                                    customStyles={{
                                                        width: responsiveWidth(10),
                                                        height: responsiveWidth(10),
                                                        borderRadius: responsiveWidth(5),
                                                        backgroundColor: avatarColors[0],
                                                    }}
                                                >
                                                    <CusText
                                                        text={initials}
                                                        size="S"
                                                        bold
                                                        color={textColors[0]}
                                                    />
                                                </Wrapper>

                                                {/* Fund Manager Name */}
                                                <Wrapper customStyles={{ flex: 1 }}>
                                                    <CusText
                                                        text={fundManagerData?.manager_name}
                                                        size="M"
                                                        bold
                                                        color={colors.black}
                                                    />
                                                </Wrapper>
                                            </>
                                        );
                                    })()}
                                </Wrapper>
                            )
                        }
                        < Wrapper row align="center" justify="apart">
                            <Wrapper row customStyles={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => setActiveTab('schemes')}
                                    style={[
                                        additionalStyles.tabButton,
                                        activeTab === 'schemes' && additionalStyles.activeTabButton
                                    ]}
                                >
                                    <CusText
                                        text={isFundManagerView ? "Schemes" : "Schemes Overview"}
                                        size="S"
                                        color={activeTab === 'schemes' ? colors.white : colors.black}
                                        bold={activeTab === 'schemes'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setActiveTab('overview')}
                                    style={[
                                        additionalStyles.tabButton,
                                        activeTab === 'overview' && additionalStyles.activeTabButton
                                    ]}
                                >
                                    <CusText
                                        text="Overview"
                                        size="S"
                                        color={activeTab === 'overview' ? colors.white : colors.black}
                                        bold={activeTab === 'overview'}
                                    />
                                </TouchableOpacity>
                            </Wrapper>

                            {/* Show filters and sort only for regular view */}
                            {!isSpecialView && (
                                <Wrapper row align="center" customStyles={{ gap: responsiveWidth(2) }}>
                                    {/* Filter Icon - only show if selected category has subCategories */}
                                    {topPerformingSchemes[selectedCategoryIndex]?.subCategoryList?.length > 0 && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                // Initialize temp state with current selected filters
                                                setTempSelectedSubCategories([...selectedSubCategories]);
                                                setIsFilterVisible(true);
                                            }}
                                            style={{
                                                padding: responsiveWidth(2),
                                                borderRadius: borderRadius.normal,
                                                borderWidth: 1,
                                                borderColor: selectedSubCategories.length > 0 ? colors.primary1 : colors.fieldborder,
                                                backgroundColor: selectedSubCategories.length > 0 ? colors.primary1 : colors.white,
                                            }}
                                        >
                                            <Ionicons
                                                name="funnel"
                                                size={responsiveWidth(4)}
                                                color={selectedSubCategories.length > 0 ? colors.white : colors.gray}
                                            />
                                            {selectedSubCategories.length > 0 && (
                                                <Wrapper
                                                    customStyles={{
                                                        position: 'absolute',
                                                        top: -responsiveWidth(1),
                                                        right: -responsiveWidth(1),
                                                        backgroundColor: colors.red,
                                                        borderRadius: responsiveWidth(2),
                                                        width: responsiveWidth(4),
                                                        height: responsiveWidth(4),
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <CusText
                                                        text={selectedSubCategories.length.toString()}
                                                        size="XS"
                                                        color={colors.white}
                                                        bold
                                                    />
                                                </Wrapper>
                                            )}
                                        </TouchableOpacity>
                                    )}


                                </Wrapper>
                            )}
                        </Wrapper>
                    </>
                ) : (
                    // Regular View - Show category tabs
                    <Wrapper row align="center" justify="apart">
                        <Wrapper customStyles={{ flex: 1 }}>
                            <FlatList
                                data={topPerformingSchemes}
                                renderItem={renderCategoryTab}
                                keyExtractor={(_, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: responsiveWidth(0), gap: responsiveWidth(1) }}
                            />
                        </Wrapper>

                        {/* Vertical Divider */}
                        {!isSpecialView && (
                            <Wrapper
                                customStyles={{
                                    width: 1,
                                    height: responsiveWidth(8),
                                    backgroundColor: colors.primary,
                                    marginHorizontal: responsiveWidth(2.5),
                                }}
                            />
                        )}

                        {!isSpecialView && (
                            <Wrapper row align="center" customStyles={{ gap: responsiveWidth(1) }}>
                                {/* Filter Icon - only show if selected category has subCategories */}
                                {topPerformingSchemes[selectedCategoryIndex]?.subCategoryList?.length > 0 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            // Initialize temp state with current selected filters
                                            setTempSelectedSubCategories([...selectedSubCategories]);
                                            setIsFilterVisible(true);
                                        }}
                                        style={{
                                            padding: responsiveWidth(2),
                                            borderRadius: borderRadius.normal,
                                            borderWidth: 1,
                                            borderColor: selectedSubCategories.length > 0 ? colors.primary1 : colors.fieldborder,
                                            backgroundColor: selectedSubCategories.length > 0 ? colors.primary1 : colors.white,
                                        }}
                                    >
                                        <Ionicons
                                            name="funnel"
                                            size={responsiveWidth(4)}
                                            color={selectedSubCategories.length > 0 ? colors.white : colors.gray}
                                        />
                                        {selectedSubCategories.length > 0 && (
                                            <Wrapper
                                                customStyles={{
                                                    position: 'absolute',
                                                    top: -5,
                                                    right: -5,
                                                    backgroundColor: colors.red,
                                                    borderRadius: borderRadius.ring,
                                                    minWidth: responsiveWidth(4),
                                                    height: responsiveWidth(4),
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <CusText
                                                    text={selectedSubCategories.length.toString()}
                                                    size="XS"
                                                    color={colors.white}
                                                    bold
                                                />
                                            </Wrapper>
                                        )}
                                    </TouchableOpacity>
                                )}

                                {/* Returns Visibility Toggle */}
                                <Wrapper customStyles={{ position: "relative", zIndex: 1000 }}>
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        onPress={() => {
                                            setIsFilterVisible(false);
                                            setIsReturnsVisible(!isReturnsVisible);
                                        }}
                                        style={{
                                            padding: responsiveWidth(2),
                                            borderRadius: borderRadius.normal,
                                            borderWidth: 1,
                                            borderColor: colors.fieldborder,
                                            backgroundColor: colors.white,
                                        }}
                                    >
                                        <Ionicons
                                            name="eye-outline"
                                            size={responsiveWidth(4)}
                                            color={colors.gray}
                                        />
                                    </TouchableOpacity>
                                </Wrapper>
                            </Wrapper>
                        )}
                    </Wrapper>
                )}
            </Wrapper>

            {/* Main Content Area */}
            <Wrapper customStyles={{ flex: 1 }}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        paddingBottom: totalPages > 1 ? responsiveWidth(20) : responsiveWidth(5),
                        paddingTop: responsiveWidth(2)
                    }}
                >
                    <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(0) }}>
                        {/* Loading State */}
                        {isLoading ? (
                            <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <CusText text="Loading schemes..." size="S" color={colors.gray} />
                            </Wrapper>
                        ) : (
                            <>
                                {/* Content based on active tab */}
                                {activeTab === 'overview' ? (
                                    // Overview tab content for all views
                                    <Wrapper customStyles={{ paddingVertical: responsiveWidth(2) }}>
                                        <CusText
                                            text={
                                                isAmcView ? "AMC Overview" :
                                                    isFundManagerView ? "Fund Manager Overview" :
                                                        "Top Performing Schemes Overview"
                                            }
                                            size="L"
                                            color={colors.black}
                                            bold
                                            customStyles={{ marginBottom: responsiveWidth(2), marginLeft: responsiveWidth(5) }}
                                        />

                                        {/* Overview Details Table */}
                                        {isSpecialView ? (
                                            <Wrapper customStyles={additionalStyles.overviewTable}>
                                                {/* Row 1 */}
                                                <Wrapper customStyles={additionalStyles.tableRow}>
                                                    <Wrapper row customStyles={additionalStyles.rowContainer}>
                                                        <Wrapper customStyles={additionalStyles.fieldContainer}>
                                                            <CusText
                                                                text={isAmcView ? "AMC Name" : "Fund Manager Name"}
                                                                size="S"
                                                                color={colors.gray}
                                                                customStyles={additionalStyles.labelText}
                                                            />
                                                            <CusText
                                                                text={
                                                                    isAmcView ?
                                                                        (amcData?.name || overviewData?.name || '--') :
                                                                        (fundManagerData?.manager_name || overviewData?.name || '--')
                                                                }
                                                                size="M"
                                                                color={colors.black}
                                                                customStyles={additionalStyles.valueText}
                                                            />
                                                        </Wrapper>
                                                        <Wrapper customStyles={additionalStyles.fieldContainer}>
                                                            <CusText
                                                                text={isAmcView ? "Office Address" : "Experience"}
                                                                size="S"
                                                                color={colors.gray}
                                                                customStyles={additionalStyles.labelText}
                                                            />
                                                            <CusText
                                                                text={
                                                                    isAmcView ?
                                                                        (overviewData?.office_address || '--') :
                                                                        (overviewData?.manager_exp || '--')
                                                                }
                                                                size="M"
                                                                color={colors.black}
                                                                customStyles={additionalStyles.valueText}
                                                            />
                                                        </Wrapper>
                                                    </Wrapper>
                                                </Wrapper>

                                                {/* Row 2 */}
                                                <Wrapper customStyles={additionalStyles.tableRow}>
                                                    <Wrapper row customStyles={additionalStyles.rowContainer}>
                                                        <Wrapper customStyles={additionalStyles.fieldContainer}>
                                                            <CusText text={isAmcView ? "Number of schemes" : "Education"} size="S" color={colors.gray} customStyles={additionalStyles.labelText} />
                                                            <CusText text={isAmcView ? amcData?.totalSchemes?.toString() : overviewData?.manager_education || '--'} size="M" color={colors.black} customStyles={additionalStyles.valueText} />
                                                        </Wrapper>
                                                        <Wrapper customStyles={additionalStyles.fieldContainer}>
                                                            <CusText text={isAmcView ? "City" : "Joining Date"} size="S" color={colors.gray} customStyles={additionalStyles.labelText} />
                                                            <CusText text={isAmcView ? overviewData?.city : overviewData?.managerStartDate || '--'} size="M" color={colors.black} customStyles={additionalStyles.valueText} />
                                                        </Wrapper>
                                                    </Wrapper>
                                                </Wrapper>

                                                {/* Row 3 */}
                                                <Wrapper customStyles={additionalStyles.tableRow}>
                                                    <Wrapper row customStyles={additionalStyles.rowContainer}>
                                                        <Wrapper customStyles={additionalStyles.fieldContainer}>
                                                            <CusText text={isAmcView ? "AUM" : "Fund Managed"} size="S" color={colors.gray} customStyles={additionalStyles.labelText} />
                                                            {
                                                                isAmcView ? (
                                                                    <CusText
                                                                        text={amcData?.totalAUM ? `${convertToCrores(amcData.totalAUM)} Cr.` : '--'}
                                                                        size="M"
                                                                        color={colors.black}
                                                                        customStyles={additionalStyles.valueText}
                                                                    />
                                                                ) : (
                                                                    <CusText
                                                                        text={overviewData?.total_schemes || '--'}
                                                                        size="M"
                                                                        color={colors.black}
                                                                        customStyles={additionalStyles.valueText}
                                                                    />
                                                                )
                                                            }
                                                            {/* <CusText
                                                                text={amcData?.totalAUM ? `${convertToCrores(amcData.totalAUM)} Cr.` : overviewData?.total_aum ? `${convertToCrores(overviewData.total_aum)} Cr.` : '--'}
                                                                size="M"
                                                                color={colors.black}
                                                                customStyles={additionalStyles.valueText}
                                                            /> */}
                                                        </Wrapper>
                                                        <Wrapper customStyles={additionalStyles.fieldContainer}>
                                                            <CusText text={isAmcView ? "Contact" : "Total AUM"} size="S" color={colors.gray} customStyles={additionalStyles.labelText} />
                                                            <CusText text={isAmcView ? overviewData?.contact : overviewData?.total_AUM ? `${convertToCrores(overviewData.total_AUM)} Cr.` : '--'} size="M" color={colors.black} customStyles={additionalStyles.valueText} />
                                                        </Wrapper>
                                                    </Wrapper>
                                                </Wrapper>

                                                {/* Row 4 */}
                                                {/* <Wrapper customStyles={[additionalStyles.tableRow, { borderBottomWidth: 0 }]}> */}
                                                <Wrapper customStyles={{ ...additionalStyles.tableRow, borderBottomWidth: 0 }}>
                                                    <Wrapper row customStyles={additionalStyles.rowContainer}>
                                                        <Wrapper customStyles={additionalStyles.fieldContainer}>
                                                            <CusText text={isAmcView ? "Fax" : "Average Returns ( 5 Yr. )"} size="S" color={colors.gray} customStyles={additionalStyles.labelText} />
                                                            <CusText text={isAmcView ? overviewData?.fax : overviewData?.Avg_5yrs_Return ? `${parseFloat(overviewData?.Avg_5yrs_Return).toFixed(2)}%` : '--'} size="M" color={colors.black} customStyles={additionalStyles.valueText} />
                                                        </Wrapper>
                                                        <Wrapper customStyles={additionalStyles.fieldContainer}>
                                                            <CusText text="Website" size="S" color={colors.gray} customStyles={additionalStyles.labelText} />
                                                            <CusText text={overviewData?.website || '--'} size="M" color={colors.black} customStyles={additionalStyles.valueText} />
                                                        </Wrapper>
                                                    </Wrapper>
                                                </Wrapper>
                                            </Wrapper>
                                        ) : (
                                            // Regular view overview content
                                            <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
                                                <CusText
                                                    text="Top Performing Schemes"
                                                    size="L"
                                                    color={colors.black}
                                                    bold
                                                    customStyles={{ marginBottom: responsiveWidth(2) }}
                                                />
                                                <CusText
                                                    text="Discover the best performing mutual fund schemes across different categories"
                                                    size="M"
                                                    color={colors.gray}
                                                    customStyles={{ textAlign: 'center' }}
                                                />
                                            </Wrapper>
                                        )}
                                    </Wrapper>
                                ) : (
                                    // Schemes table (for both regular view and AMC schemes tab)
                                    <>
                                        {paginatedSchemes.length > 0 ? (
                                            <ScrollView horizontal={true}>
                                                <View style={styles.tableContainer}>
                                                    {renderTableHeader()}
                                                    <FlatList
                                                        data={paginatedSchemes}
                                                        renderItem={renderSchemeRow}
                                                        keyExtractor={(_, index) => index.toString()}
                                                    />
                                                </View>
                                            </ScrollView>
                                        ) : (
                                            <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
                                                <CusText
                                                    text="No schemes available for this category"
                                                    size="S"
                                                    color={colors.gray}
                                                />
                                            </Wrapper>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </Wrapper>
                </ScrollView>
            </Wrapper>

            {/* Fixed Pagination at Bottom */}
            {
                !isLoading && selectedCategorySchemes.length > 0 && totalPages > 1 && activeTab !== 'overview' && (
                    <Wrapper
                        customStyles={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: colors.white,
                            paddingVertical: responsiveWidth(3),
                            paddingHorizontal: responsiveWidth(4),
                            borderTopWidth: 1,
                            borderTopColor: colors.fieldborder,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                        align="center"
                    >
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalCount={selectedCategoryCount}
                            itemsPerPage={itemsPerPage}
                        />
                    </Wrapper>
                )
            }

            {/* Filter Modal */}
            <Modal
                visible={isFilterVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsFilterVisible(false)}
            >
                <Wrapper
                    customStyles={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'flex-end'
                    }}
                >
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.white,
                            borderTopLeftRadius: borderRadius.large,
                            borderTopRightRadius: borderRadius.large,
                            paddingHorizontal: responsiveWidth(5),
                            paddingTop: responsiveWidth(5),
                            paddingBottom: responsiveWidth(3),
                            maxHeight: '80%'
                        }}
                    >
                        {/* Filter Header */}
                        <Wrapper row align="center" justify="apart" customStyles={{ marginBottom: responsiveWidth(4) }}>
                            <CusText text="Filter Sub Categories" size="M" bold color={colors.Hard_Black} />
                            <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                                <Ionicons name="close" size={responsiveWidth(6)} color={colors.gray} />
                            </TouchableOpacity>
                        </Wrapper>

                        {/* Select All / Deselect All */}
                        <Wrapper row align="center" justify="apart" customStyles={{ marginBottom: responsiveWidth(3) }}>
                            <TouchableOpacity
                                onPress={() => {
                                    const allSubCategoryIds = topPerformingSchemes[selectedCategoryIndex]?.subCategoryList?.map((sub: any) => sub.Id) || [];
                                    setTempSelectedSubCategories(allSubCategoryIds);
                                }}
                                style={{
                                    paddingVertical: responsiveWidth(2),
                                    paddingHorizontal: responsiveWidth(3),
                                    borderRadius: borderRadius.small,
                                    backgroundColor: colors.primary1
                                }}
                            >
                                <CusText text="Select All" size="SS" color={colors.white} bold />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setTempSelectedSubCategories([])}
                                style={{
                                    paddingVertical: responsiveWidth(2),
                                    paddingHorizontal: responsiveWidth(3),
                                    borderRadius: borderRadius.small,
                                    backgroundColor: colors.lightGray,
                                    borderWidth: 1,
                                    borderColor: colors.fieldborder
                                }}
                            >
                                <CusText text="Deselect All" size="SS" color={colors.Hard_Black} bold />
                            </TouchableOpacity>
                        </Wrapper>

                        {/* Sub Categories List */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: responsiveWidth(80) }}
                        >
                            {topPerformingSchemes[selectedCategoryIndex]?.subCategoryList?.map((subCategory: any, index: number) => {
                                const isSelected = tempSelectedSubCategories.includes(subCategory.Id);

                                return (
                                    <TouchableOpacity
                                        key={`subcategory-${subCategory.Id}-${index}`}
                                        onPress={() => toggleSubCategory(subCategory.Id)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: responsiveWidth(3),
                                            paddingHorizontal: responsiveWidth(2),
                                            borderBottomWidth: 1,
                                            borderBottomColor: colors.fieldborder,
                                            backgroundColor: isSelected ? colors.lightGray : 'transparent'
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={isSelected ? 'checkbox' : 'square-outline'}
                                            size={responsiveWidth(5)}
                                            color={isSelected ? colors.primary1 : colors.gray}
                                        />
                                        <CusText
                                            text={subCategory.Name}
                                            size="S"
                                            color={colors.Hard_Black}
                                            customStyles={{
                                                marginLeft: responsiveWidth(3),
                                                flex: 1,
                                                fontWeight: isSelected ? 'bold' : 'normal'
                                            }}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* Filter Actions - Fixed at bottom */}
                        <Wrapper
                            row
                            align="center"
                            justify="apart"
                            customStyles={{
                                marginTop: responsiveWidth(4),
                                gap: responsiveWidth(3),
                                paddingTop: responsiveWidth(3),
                                borderTopWidth: 1,
                                borderTopColor: colors.fieldborder
                            }}
                        >
                            <Wrapper width={responsiveWidth(90)} position="center" row align="center" justify="apart" customStyles={{}}>
                                <CusButton
                                    title="Reset"
                                    width={responsiveWidth(40)}
                                    onPress={handleFilterReset}
                                    customStyle={{
                                        backgroundColor: colors.lightGray,
                                        borderColor: colors.fieldborder,
                                        borderWidth: 1
                                    }}
                                    textcolor={colors.Hard_Black}
                                />
                                <CusButton
                                    width={responsiveWidth(40)}
                                    title={`Apply (${tempSelectedSubCategories.length})`}
                                    onPress={handleFilterApply}
                                />
                            </Wrapper>
                            {/* <Wrapper customStyles={{ flex: 1 }}>
                               
                            </Wrapper> */}
                        </Wrapper>
                    </Wrapper>
                </Wrapper>
            </Modal>

            {/* Returns Selection Modal */}
            <Modal
                visible={isReturnsVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsReturnsVisible(false)}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    activeOpacity={1}
                    onPress={() => setIsReturnsVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { }} // Prevent modal from closing when clicking inside
                        style={{
                            backgroundColor: colors.white,
                            borderRadius: borderRadius.normal,
                            width: responsiveWidth(80),
                            maxHeight: responsiveWidth(120),
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 8,
                            elevation: 10,
                        }}
                    >
                        {/* Modal Header */}
                        <Wrapper
                            row
                            align="center"
                            justify="apart"
                            customStyles={{
                                paddingHorizontal: responsiveWidth(4),
                                paddingVertical: responsiveWidth(3),
                                borderBottomWidth: 1,
                                borderBottomColor: colors.fieldborder
                            }}
                        >
                            <CusText text="Select Return Periods" size="M" bold color={colors.Hard_Black} />
                            <TouchableOpacity onPress={() => setIsReturnsVisible(false)}>
                                <Ionicons name="close" size={responsiveWidth(6)} color={colors.gray} />
                            </TouchableOpacity>
                        </Wrapper>

                        {/* Returns List */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: responsiveWidth(80) }}
                        >
                            {defaultReturns?.map((item: any, index: any) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => toggleReturnColumns(item)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingHorizontal: responsiveWidth(4),
                                        paddingVertical: responsiveWidth(3),
                                        borderBottomWidth: index < defaultReturns.length - 1 ? 1 : 0,
                                        borderBottomColor: colors.fieldborder
                                    }}
                                >
                                    <Ionicons
                                        name={selectedReturn.includes(item?.id) ? 'checkbox' : 'square-outline'}
                                        size={responsiveWidth(5)}
                                        color={selectedReturn.includes(item?.id) ? colors.primary1 : colors.gray}
                                    />
                                    <CusText
                                        text={item?.name}
                                        size="S"
                                        customStyles={{ marginLeft: responsiveWidth(3), flex: 1 }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Modal Footer */}
                        <Wrapper
                            row
                            align="center"
                            justify="apart"
                            customStyles={{
                                paddingHorizontal: responsiveWidth(4),
                                paddingVertical: responsiveWidth(3),
                                borderTopWidth: 1,
                                borderTopColor: colors.fieldborder,
                                gap: responsiveWidth(3)
                            }}
                        >
                            {/* <Wrapper customStyles={{ flex: 1 }}>
                                <CusButton
                                    title="Select All"
                                    onPress={() => {
                                        const allIds = defaultReturns.map(item => item.id);
                                        setSelectedReturn(allIds);
                                    }}
                                    customStyle={{
                                        backgroundColor: colors.lightGray,
                                        borderColor: colors.fieldborder,
                                        borderWidth: 1
                                    }}
                                    textcolor={colors.Hard_Black}
                                />
                            </Wrapper> */}
                            {/* <Wrapper customStyles={{ flex: 1 }}>
                                <CusButton
                                    title="Clear All"
                                    onPress={() => setSelectedReturn([])}
                                    customStyle={{
                                        backgroundColor: colors.lightGray,
                                        borderColor: colors.fieldborder,
                                        borderWidth: 1
                                    }}
                                    textcolor={colors.Hard_Black}
                                />
                            </Wrapper> */}
                            <Wrapper customStyles={{}}>
                                <CusButton
                                    title="Done"
                                    onPress={() => setIsReturnsVisible(false)}
                                />
                            </Wrapper>
                        </Wrapper>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </Wrapper >
    );
};

// Additional styles for tab buttons and overview table
const additionalStyles = StyleSheet.create({
    tabButton: {
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(2),
        marginRight: responsiveWidth(2),
        borderRadius: borderRadius.small,
        backgroundColor: colors.lightGray,
    },
    activeTabButton: {
        backgroundColor: colors.primary,
    },
    overviewTable: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: colors.fieldborder,
        marginHorizontal: responsiveWidth(4),
    },
    tableRow: {
        borderBottomWidth: 1,
        borderBottomColor: colors.fieldborder,
        paddingVertical: responsiveWidth(4),
        paddingHorizontal: responsiveWidth(4),
    },
    rowContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    fieldContainer: {
        flex: 1,
        marginRight: responsiveWidth(4),
    },
    labelText: {
        marginBottom: responsiveWidth(1),
    },
    valueText: {
        lineHeight: responsiveWidth(5),
    },
    leftColumn: {
        flex: 1,
        paddingRight: responsiveWidth(2),
    },
    rightColumn: {
        flex: 1,
        paddingLeft: responsiveWidth(2),
    },
});

export default TopPerformingSchemes;
