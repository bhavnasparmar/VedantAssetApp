import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Modal, PermissionsAndroid, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { colors, responsiveHeight, responsiveWidth } from '../../../styles/variables';
import CusButton from '../../../ui/custom-button';
import CusText from '../../../ui/custom-text';
import Dash from '../../../ui/dash';
import InputField from '../../../ui/InputField';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
//import { isObjectEmpty } from '../../../utils/Commanutils';
import { styles } from './filterStyle';

const FilterProducts = ({ visible, onClose, onImagePicked, productFilter }: any) => {


    const [filterType, setFilterType] = useState([
        {
            id: 1,
            name: 'Categories'
        },
        {
            id: 2,
            name: 'Brand'
        },
        {
            id: 3,
            name: 'Price'
        },
    ])

    const [filterPrice, setFilterPrice] = useState<any[]>([
        {
            _id: 1,
            name: 'Low to High'
        },
        {
            _id: 2,
            name: 'High to Low'
        },
    ])

    const [selectedData, setSelectedData] = useState<any[]>([])
    const [selectedFilterType, setSelectedFilterType] = useState<any>('')
    const [minimumPrice, setMinimumPrice] = useState<any>('')
    const [maximumPrice, setMaximumPrice] = useState<any>('')
    const [isPriceRange, setIsPriceRange] = useState<boolean>(false)
    const [priceFilter, setPriceFilter] = useState<any>('')
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});
    const [dataToFilter, setDataToFilter] = useState<any>({})
    const isFocued: any = useIsFocused()


    useEffect(() => {
        if (visible) {
            console.log('Use Effect called')
            setAllFilters(filterType[0])
            setSelectedData(
                productFilter?.searchAllCategory?.map((item: any) => item?.Category)
            )
        }

    }, [visible])


    const setAllFilters = (type: any) => {

        setSelectedFilterType(type?.name)
        if (type?.name === 'Categories') {
            console.log('type : ', type?.name)
            setIsPriceRange(false)
            setSelectedData(
                productFilter?.searchAllCategory?.map((item: any) => item?.Category)
            )
        }
        if (type?.name === 'Brand') {
            setIsPriceRange(false)
            setSelectedData(productFilter?.searchAllBrand?.map((item: any) => item?.Brand))
        }
        if (type?.name === 'Price') {
            // setSelectedData(filterPrice)
            setIsPriceRange(true)
        }
    }

    // const toggleFilterdata = (data: any) => {
    //     console.log('Data : ', data)
    //     console.log('selectedFilterType : ', selectedFilterType)


    // }

    // const toggleFilterData = (data: { _id: string }) => {
    //     const filterType = selectedFilterType; // Selected type (e.g., 'category', 'brand')

    //     setSelectedFilters((prevFilters) => {
    //         const prevSelectedIds = prevFilters[filterType] || [];

    //         // Check if the _id is already present
    //         if (prevSelectedIds.includes(data._id)) {
    //             // Remove _id if present
    //             return {
    //                 ...prevFilters,
    //                 [filterType]: prevSelectedIds.filter(id => id !== data._id),
    //             };
    //         } else {
    //             // Add _id if not present
    //             return {
    //                 ...prevFilters,
    //                 [filterType]: [...prevSelectedIds, data._id],
    //             };
    //         }
    //     });
    // };

    const toggleFilterData = (data: { _id: string }) => {
        const filterType = selectedFilterType; // Example: 'category', 'brand'

        setSelectedFilters((prevFilters) => {
            const prevSelectedIds = prevFilters[filterType] || [];

            // Check if the _id is already selected
            if (prevSelectedIds.includes(data._id)) {
                // Remove _id from the array
                const updatedIds = prevSelectedIds.filter(id => id !== data._id);

                // If no IDs left, remove the filter type entirely
                if (updatedIds.length === 0) {
                    const { [filterType]: _, ...restFilters } = prevFilters;
                    return restFilters;
                }

                return {
                    ...prevFilters,
                    [filterType]: updatedIds,
                };
            } else {
                // Add _id if not present
                return {
                    ...prevFilters,
                    [filterType]: [...prevSelectedIds, data._id],
                };
            }
        });
    };


    const requestGalleryPermission = async () => {
        if (Platform.OS === 'android') {
            let granted;

            if (Platform.Version >= 33) {
                // Android 13+ requires READ_MEDIA_IMAGES
                granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
            } else {
                // Android 12 and below require READ_EXTERNAL_STORAGE
                granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            }

            if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;

            if (granted === PermissionsAndroid.RESULTS.DENIED) {
                console.log('User denied gallery permission. Asking again...');
                return await requestGalleryPermission(); // Ask again
            } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                console.log('Permission permanently denied. Redirecting to settings...');
                Alert.alert(
                    'Permission Required',
                    'Please enable gallery access in settings to select an image.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
            }
            return false;
        } else {
            const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

            if (result === RESULTS.GRANTED) return true;
            if (result === RESULTS.DENIED) {
                console.log('User denied gallery permission. Asking again...');
                const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                return requestResult === RESULTS.GRANTED;
            }
            if (result === RESULTS.BLOCKED) {
                console.log('Permission permanently denied. Redirecting to settings...');
                Alert.alert(
                    'Permission Required',
                    'Please enable gallery access in settings to select an image.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
            }
            return false;
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Wrapper customStyles={styles.modalContainer}>
                <Wrapper customStyles={styles.modalContent}>
                    <Spacer y='XS' />
                    <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(5) }} row align='center' justify='apart'>
                        <CusText size='N' bold text={'Filter’s'} />
                        <TouchableOpacity onPress={onClose}>
                            <IonIcon color={colors.secondary3} name="close-circle-outline" size={responsiveWidth(5)} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Spacer y='XS' />
                    <Dash row gap="0" position="center" width={responsiveWidth(100)} height={1} color={colors.dashBorder} />
                    <Wrapper row width={responsiveWidth(100)}>

                        <Wrapper customStyles={{ overflow: 'hidden' }}>
                            {
                                filterType?.map((item: any) => {

                                    return (
                                        <>
                                            <TouchableOpacity activeOpacity={0.6} onPress={() => { setAllFilters(item) }}>
                                                <Wrapper align='center' color={selectedFilterType === item?.name ? colors.cardHeaderBg : colors.white} width={responsiveWidth(30)} customStyles={{ paddingVertical: responsiveWidth(2.5), paddingHorizontal: responsiveWidth(5), }}>
                                                    <CusText size='SS' text={item?.name} />
                                                </Wrapper>
                                                <Dash row gap="0" width={responsiveWidth(5)} height={1} color={colors.dashBorder} />
                                            </TouchableOpacity>
                                        </>
                                    )
                                })
                            }
                        </Wrapper>
                        <Dash gap="0" width={responsiveWidth(5)} height={1} color={colors.dashBorder} />

                        <Wrapper height={responsiveHeight(50)} width={responsiveWidth(100)} customStyles={{ paddingVertical: responsiveWidth(2.5), paddingHorizontal: responsiveWidth(0) }}>
                            <ScrollView>
                            {

                                isPriceRange ?

                                    <>

                                        <Wrapper>
                                            <InputField
                                                value={minimumPrice}
                                                textColor={colors.Hard_Black}
                                                onChangeText={(value: string) => {
                                                    setMinimumPrice(value)
                                                }}
                                                label="Minimum Price"
                                                cursorColor={colors.black}
                                                placeholder="Enter Minimum Price"
                                                width={responsiveWidth(40)}
                                                keyboardType='numeric'
                                            />
                                            <InputField
                                                value={maximumPrice}
                                                textColor={colors.Hard_Black}
                                                onChangeText={(value: string) => {
                                                    setMaximumPrice(value)
                                                }}
                                                label="Maximum Price"
                                                cursorColor={colors.black}
                                                placeholder="Enter Maximum Price"
                                                width={responsiveWidth(40)}
                                                keyboardType='numeric'
                                            />
                                        </Wrapper>

                                    </>
                                    :
                                    selectedData?.map((item: any) => {
                                        console.log(item?.name)
                                        let isSelected: boolean = false
                                        if (selectedFilterType === 'Price') {
                                            const price_id: any = priceFilter === 'Low' ? 1 : priceFilter === 'High' ? 2 : ''
                                            if (price_id === item?._id) {
                                                isSelected = true
                                            }
                                        } else {

                                            isSelected = selectedFilters[selectedFilterType]?.includes(item?._id);
                                        }
                                        return (
                                            <>
                                                {
                                                    item?.name ?
                                                        <TouchableOpacity activeOpacity={0.6} onPress={() => {
                                                            if (selectedFilterType === 'Price') {
                                                                setPriceFilter(item?._id === 1 ? 'Low' : 'High')
                                                            } else {
                                                                toggleFilterData(item)
                                                            }

                                                        }}>
                                                            <Wrapper row align='center' customStyles={{ paddingVertical: responsiveWidth(1) }}>
                                                                <IonIcon
                                                                    // color={
                                                                    //     isSelected ? colors.primary : colors.secondary3
                                                                    //     } 
                                                                    color={
                                                                        isSelected ? colors.primary : colors.secondary3
                                                                    }
                                                                    name="checkmark-circle" size={responsiveWidth(5)} />
                                                                <Spacer x='XS' />
                                                                <CusText size='SS' text={item?.name} />
                                                            </Wrapper>
                                                        </TouchableOpacity>
                                                        :
                                                        null
                                                }

                                            </>
                                        )
                                    })
                            }
                            </ScrollView>
                        </Wrapper>
                    </Wrapper>
                    <Dash row gap="0" position="center" width={responsiveWidth(100)} height={1} color={colors.dashBorder} />
                    <Wrapper color={colors.white} justify='center' align='center' row customStyles={{ paddingHorizontal: responsiveWidth(10), paddingVertical: responsiveWidth(5), overflow: 'hidden' }}>

                        <CusButton onPress={() => {
                            setSelectedFilters({})
                            setPriceFilter('')
                        }}
                            color={colors.white}
                            textSize="SS"
                            textcolor={colors.secondary3}
                            buttonStyle={{ borderColor: colors.secondary3, borderWidth: responsiveWidth(0.3) }}
                            height={responsiveHeight(5)}
                            width={responsiveWidth(30)}
                            position='center'
                            title='Reset All'
                        />
                        <Spacer x='S' />
                        <CusButton onPress={() => {

                            // console.log('selectedFilters : ', isObjectEmpty(selectedFilters), priceFilter)

                            // // if (!isObjectEmpty(selectedFilters) || priceFilter !== '') {
                            // if (!isObjectEmpty(selectedFilters) || minimumPrice !== '' || maximumPrice !== '') {
                            //     console.log('Present')
                            //     const newObject = { ...selectedFilters, lowPrice: minimumPrice, highPrice: maximumPrice };
                            //     onImagePicked(newObject);

                            // } else {
                            //     console.log('Not Preset')
                            //     onImagePicked({});
                            // }
                            onClose();
                        }}
                            lgcolor1={colors.primary}
                            lgcolor2={colors.primary1}
                            textSize="SS"
                            textcolor={colors.white}
                            buttonStyle={{}}
                            height={responsiveHeight(5)}
                            width={responsiveWidth(30)}
                            position='center'
                            title='Apply'
                        />


                    </Wrapper>
                </Wrapper>
            </Wrapper>
        </Modal>
    );
};



export default FilterProducts;
