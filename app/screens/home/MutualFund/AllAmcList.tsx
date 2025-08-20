import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
// import { colors } from '../../../constants/colors';
// import { responsiveWidth, borderRadius } from '../../../constants/dimensions';
import { showToast, toastTypes } from "../../../services/toastService";
import Wrapper from "../../../ui/wrapper";
import CusText from "../../../ui/custom-text";
// import Header from "../../../ui/header";
import { getTopAmcListApi } from "../../../api/homeapi";
import { convertToCrores } from "../../../utils/Commanutils";
import moment from 'moment';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { borderRadius, colors, responsiveWidth } from '../../../styles/variables';
import Header from '../../../shared/components/Header/Header';

const AllAmcList = () => {
    const navigation: any = useNavigation();
    const isFocused = useIsFocused();

    // State management
    const [amcList, setAmcList] = useState<any[]>([]);
    const [filteredAmcList, setFilteredAmcList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleBackPress = () => {
        navigation.goBack();
    };

    // Fetch AMC list with search
    const fetchAmcList = async (search: string = '') => {
        try {
            setLoading(true);
            console.log('Fetching AMC List with search:', search);

            const [result, error]: any = await getTopAmcListApi(search);

            if (result) {
                console.log('AMC List Result:', result);
                const amcData = result?.data || [];
                setAmcList(amcData);
                setFilteredAmcList(amcData);
            } else {
                console.log('AMC List Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to load AMC list');
            }
        } catch (error: any) {
            console.log('AMC List Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while loading AMC list');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (text: string) => {
        setSearchQuery(text);
        
        if (text.trim() === '') {
            setFilteredAmcList(amcList);
        } else {
            const filtered = amcList.filter(item => 
                item?.Name?.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredAmcList(filtered);
        }
    };

    // Render AMC item
    const renderAmcItem = ({ item }: any) => {
        return (
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
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.white,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        marginHorizontal: responsiveWidth(4),
                        marginVertical: responsiveWidth(0.5),
                        borderWidth: 1,
                        borderColor: colors.fieldborder,
                    }}
                >
                    <CusText
                        text={item?.Name}
                        size="M"
                        bold
                        color={colors.black}
                        customStyles={{ marginBottom: responsiveWidth(1) }}
                    />
                    
                    <CusText
                        text={`AUM: ${item?.total_AUM ? convertToCrores(item?.total_AUM) : 0} Cr.`}
                        size="S"
                        color={colors.gray}
                        customStyles={{ marginBottom: responsiveWidth(1) }}
                    />
                    
                    <CusText
                        text={`Schemes: ${item?.total_schemes || 0}`}
                        size="S"
                        color={colors.gray}
                    />
                </Wrapper>
            </TouchableOpacity>
        );
    };

    // Initial load
    useEffect(() => {
        if (isFocused) {
            fetchAmcList();
        }
    }, [isFocused]);

    return (
        <Wrapper flex customStyles={{ backgroundColor: colors.background }}>
            <Header
                backBtn
                name="Top AMC List"
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
                        placeholder="Search For Top Performing Schemes"
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

            {/* AMC List */}
            {loading ? (
                <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <CusText
                        text="Loading AMC list..."
                        size="S"
                        color={colors.gray}
                        customStyles={{ marginTop: responsiveWidth(2) }}
                    />
                </Wrapper>
            ) : (
                <FlatList
                    data={filteredAmcList}
                    renderItem={renderAmcItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: responsiveWidth(2) }}
                    ListEmptyComponent={() => (
                        <Wrapper align="center" customStyles={{ paddingVertical: responsiveWidth(5) }}>
                            <CusText
                                text={searchQuery ? "No AMCs found for your search" : "No AMCs available"}
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

export default AllAmcList;
