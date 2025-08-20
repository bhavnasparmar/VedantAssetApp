import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { colors, responsiveWidth, borderRadius } from '../../../styles/variables';
import { showToast, toastTypes } from "../../../services/toastService";
import Wrapper from "../../../ui/wrapper";
import CusText from "../../../ui/custom-text";
import Header from '../../../shared/components/Header/Header';
import { getTopFundManagersListApi } from "../../../api/homeapi";
import { convertToCrores } from "../../../utils/Commanutils";
import IonIcon from 'react-native-vector-icons/Ionicons';

const AllFundManagerList = () => {
    const navigation: any = useNavigation();
    const isFocused = useIsFocused();

    // State management
    const [fundManagerList, setFundManagerList] = useState<any[]>([]);
    const [filteredFundManagerList, setFilteredFundManagerList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleBackPress = () => {
        navigation.goBack();
    };

    // Fetch Fund Manager list
    const fetchFundManagerList = async () => {
        try {
            setLoading(true);
            console.log('Fetching Fund Manager List...');

            const [result, error]: any = await getTopFundManagersListApi();

            if (result) {
                console.log('Fund Manager List Result:', result);
                const fundManagerData = result?.data || [];
                setFundManagerList(fundManagerData);
                setFilteredFundManagerList(fundManagerData);
            } else {
                console.log('Fund Manager List Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to load fund manager list');
            }
        } catch (error: any) {
            console.log('Fund Manager List Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while loading fund manager list');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (text: string) => {
        setSearchQuery(text);

        if (text.trim() === '') {
            setFilteredFundManagerList(fundManagerList);
        } else {
            const filtered = fundManagerList.filter(item =>
                item?.manager_name?.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredFundManagerList(filtered);
        }
    };

    // Get initials for fund manager
    const getInitials = (name: string) => {
        if (!name) return 'FM';
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Get background color for initials
    const getInitialsColor = (index: number) => {
        const colors_list = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        return colors_list[index % colors_list.length];
    };

    // Render Fund Manager item
    const renderFundManagerItem = ({ item, index }: any) => {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    // Navigate to TopPerformingSchemes with Fund Manager data
                    navigation.navigate('TopPerformingSchemes', {
                        fundManagerData: item
                    });
                }}
            >
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.white,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(2),
                        marginHorizontal: responsiveWidth(4),
                        marginVertical: responsiveWidth(1),
                        borderWidth: 1,
                        borderColor: colors.fieldborder,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                    }}
                >
                    {/* Top Row - Name and Initials */}
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(2) }}>
                        {/* Initials Circle */}
                        <Wrapper
                            align="center"
                            justify="center"
                            customStyles={{
                                width: responsiveWidth(9.5),
                                height: responsiveWidth(9.5),
                                borderRadius: responsiveWidth(6),
                                backgroundColor: getInitialsColor(index),
                                marginRight: responsiveWidth(3),
                            }}
                        >
                            <CusText
                                text={getInitials(item?.manager_name)}
                                size="N"
                                color={colors.white}
                                bold
                            />
                        </Wrapper>

                        {/* Fund Manager Name and Qualification */}
                        <Wrapper customStyles={{ flex: 1 }}>
                            <CusText
                                text={item?.manager_name}
                                size="N"
                                bold
                                color={colors.black}
                                customStyles={{ marginBottom: responsiveWidth(0) }}
                            />
                            <CusText
                                text={item?.qualification || 'Qualification not available'}
                                size="S"
                                color={colors.gray}
                            />
                        </Wrapper>

                        {/* 3Y Return Badge */}
                        <Wrapper
                            align="center"
                            justify="center"
                            customStyles={{
                                // backgroundColor: item?.Avg_5yrs_Return &&
                                //     parseFloat(item?.Avg_5yrs_Return) >= 0
                                //     ? colors.greenshade : '#FFEBEE',
                                borderRadius: borderRadius.small,
                                paddingHorizontal: responsiveWidth(2),
                                paddingVertical: responsiveWidth(1),
                            }}
                        >
                            <CusText
                                text={'Avg Returns ( 5 Yr. )'}
                                size="S"
                                color={colors.gray}
                            />
                            <CusText
                                text={item?.Avg_5yrs_Return ?
                                    `${parseFloat(item?.Avg_5yrs_Return).toFixed(2)}%` :
                                    '0.00%'
                                }
                                size="S"
                                bold
                                color={
                                    item?.Avg_5yrs_Return &&
                                        parseFloat(item?.Avg_5yrs_Return) >= 0
                                        ? colors.green : colors.red
                                }
                            />
                        </Wrapper>
                    </Wrapper>

                    {/* Bottom Row - Stats */}
                    <Wrapper row justify="apart" align="center">
                        {/* Experience */}
                        <Wrapper align="center" customStyles={{ flex: 1 }}>
                            <CusText
                                text="Experience"
                                size="XS"
                                color={colors.gray}
                                customStyles={{ marginBottom: responsiveWidth(0.5) }}
                            />
                            <CusText
                                text={(item?.manager_exp && item?.manager_exp !== 'NULL') ? `${item?.manager_exp || '0'} Years` : '0 Years'}
                                size="SS"
                                bold
                                color={colors.black}
                            />
                        </Wrapper>

                        {/* Total Schemes */}
                        <Wrapper align="center" customStyles={{ flex: 1 }}>
                            <CusText
                                text="Schemes"
                                size="XS"
                                color={colors.gray}
                                customStyles={{ marginBottom: responsiveWidth(0.5) }}
                            />
                            <CusText
                                text={item?.total_schemes?.toString() || '0'}
                                size="SS"
                                bold
                                color={colors.black}
                            />
                        </Wrapper>

                        {/* AUM */}
                        <Wrapper align="center" customStyles={{ flex: 1 }}>
                            <CusText
                                text="AUM"
                                size="XS"
                                color={colors.gray}
                                customStyles={{ marginBottom: responsiveWidth(0.5) }}
                            />
                            <CusText
                                text={item?.total_AUM ? `₹ ${convertToCrores(item.total_AUM)} Cr.` : '₹ 0 Cr.'}
                                size="SS"
                                bold
                                color={colors.black}
                            />
                        </Wrapper>
                    </Wrapper>
                </Wrapper>
            </TouchableOpacity>
        );
    };

    // Initial load
    useEffect(() => {
        if (isFocused) {
            fetchFundManagerList();
        }
    }, [isFocused]);

    return (
        <Wrapper flex customStyles={{ backgroundColor: colors.background }}>
            <Header
                backBtn
                name="Top Fund Managers"
                onBackPress={handleBackPress}
            />

            {/* Search Bar */}
            <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveWidth(3) }}>
                <Wrapper
                    row
                    align="center"
                    customStyles={{
                        backgroundColor: colors.white,
                        borderRadius: borderRadius.medium,
                        paddingHorizontal: responsiveWidth(3),
                        paddingVertical: responsiveWidth(2),
                        borderWidth: 1,
                        borderColor: colors.fieldborder,
                    }}
                >
                    <IonIcon
                        name="search-outline"
                        size={responsiveWidth(5)}
                        color={colors.gray}
                        style={{ marginRight: responsiveWidth(2) }}
                    />
                    <TextInput
                        placeholder="Search Fund Managers"
                        placeholderTextColor={colors.gray}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        style={{
                            flex: 1,
                            fontSize: responsiveWidth(3.5),
                            color: colors.black,
                            paddingVertical: responsiveWidth(1),
                        }}
                    />
                </Wrapper>
            </Wrapper>



            {/* Fund Manager List */}
            {loading ? (
                <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <CusText
                        text="Loading fund managers..."
                        size="S"
                        color={colors.gray}
                        customStyles={{ marginTop: responsiveWidth(2) }}
                    />
                </Wrapper>
            ) : (
                <FlatList
                    data={filteredFundManagerList}
                    renderItem={renderFundManagerItem}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: responsiveWidth(5) }}
                    ListEmptyComponent={() => (
                        <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
                            <CusText
                                text={searchQuery ? "No fund managers found for your search" : "No fund managers available"}
                                size="M"
                                color={colors.gray}
                            />
                        </Wrapper>
                    )}
                />
            )}
        </Wrapper>
    );
};

export default AllFundManagerList;
