import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Wrapper from "../../../../ui/wrapper";
import Header from "../../../../shared/components/Header/Header";
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Container from "../../../../ui/container";
import Spacer from "../../../../ui/spacer";
import { ScrollView, TouchableOpacity } from "react-native";
import InputField from "../../../../ui/InputField";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { getKYC_Details, setKYC_Details, updateObjectKey } from "../../../../utils/Commanutils";
import DropDown from "../../../../ui/dropdown";
import { CreateKYCInvsSignZy, getAddressInfoApi, getAddressTypeApi, getAllCountryApi, getAllStateByCountryApi, getFatcaDDApi, getOnBoardingListingsApi, getPersonalInfoApi, InvestorDeclarationApi, saveFatcaDeclarationApi, updateAddressDetailApi } from "../../../../api/homeapi";
import { showToast, toastTypes } from "../../../../services/toastService";
import API from "../../../../utils/API";
import ImagePickerModal from "../../../../shared/components/ImagePickerModal";

const Fatca = ({ setSelectedTab }: any) => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const [signZyData, setSignZydata] = useState<any>(null);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [occupation, setOccupation] = useState([]);
    const [annualIncome, setAnnualIncome] = useState([]);
    const [wealthSource, setWealthSource] = useState([]);
    const [fatcaForm, setFatcaForm] = useState({
        citizenOfIndia: 'yes',
        taxPayerOnlyIndia: 'yes',
        politicallyExposed: 'no',
        country: '',
        countryOfBirth: '',
        occupation: '',
        annualIncome: '',
        wealthSource: '',
        placeOfBirth: '',
        address: '',
        state: '',
        city: '',
        district: '',
        pincode: ''
    });

    const [fatcaError, setFatcaError] = useState({
        citizenOfIndia: '',
        taxPayerOnlyIndia: '',
        politicallyExposed: '',
        country: '',
        countryOfBirth: '',
        occupation: '',
        annualIncome: '',
        wealthSource: '',
        placeOfBirth: '',
        address: '',
        state: '',
        city: '',
        district: '',
        pincode: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const citizenOptions = [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
    ];

    const taxPayerOptions = [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
    ];

    const politicalOptions = [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Related', value: 'related' }
    ];

    const handleFatcaChange = (key: string, value: string) => {
        setFatcaForm(prev => ({ ...prev, [key]: value }));
        setFatcaError(prev => ({ ...prev, [key]: '' }));
    };

    const validateFatca = () => {
        let isValid = true;
        let errors = {
            citizenOfIndia: '',
            taxPayerOnlyIndia: '',
            politicallyExposed: '',
            country: '',
            countryOfBirth: '',
            occupation: '',
            annualIncome: '',
            wealthSource: '',
            placeOfBirth: '',
            address: '',
            state: '',
            city: '',
            district: '',
            pincode: ''
        };

        if (!fatcaForm.citizenOfIndia) {
            errors.citizenOfIndia = 'Please select an option';
            isValid = false;
        }

        if (!fatcaForm.taxPayerOnlyIndia) {
            errors.taxPayerOnlyIndia = 'Please select an option';
            isValid = false;
        }

        if (!fatcaForm.politicallyExposed) {
            errors.politicallyExposed = 'Please select an option';
            isValid = false;
        }

        // Validate country if citizen of India is No
        if (fatcaForm.citizenOfIndia === 'no' && !fatcaForm.country) {
            errors.country = 'Please select a country';
            isValid = false;
        }

        // Required fields validation
        if (!fatcaForm.countryOfBirth) {
            errors.countryOfBirth = 'Please select country of birth';
            isValid = false;
        }

        if (!fatcaForm.annualIncome) {
            errors.annualIncome = 'Please select annual income';
            isValid = false;
        }

        if (!fatcaForm.wealthSource) {
            errors.wealthSource = 'Please select wealth source';
            isValid = false;
        }

        if (!fatcaForm.occupation) {
            errors.occupation = 'Please select occupation';
            isValid = false;
        }

        // Validate additional fields if Tax payer only in India is No
        if (fatcaForm.taxPayerOnlyIndia === 'no') {
            // Address validation
            if (!fatcaForm.address) {
                errors.address = 'Address is required';
                isValid = false;
            } else if (fatcaForm.address.length < 5) {
                errors.address = 'Address must be at least 5 characters';
                isValid = false;
            }

            // State validation
            if (!fatcaForm.state) {
                errors.state = 'Please select state';
                isValid = false;
            }

            // City validation
            if (!fatcaForm.city) {
                errors.city = 'City is required';
                isValid = false;
            } else if (fatcaForm.city.length < 2) {
                errors.city = 'City must be at least 2 characters';
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(fatcaForm.city)) {
                errors.city = 'City should contain only letters';
                isValid = false;
            }

            // District validation
            if (!fatcaForm.district) {
                errors.district = 'District is required';
                isValid = false;
            } else if (fatcaForm.district.length < 2) {
                errors.district = 'District must be at least 2 characters';
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(fatcaForm.district)) {
                errors.district = 'District should contain only letters';
                isValid = false;
            }

            // Pincode validation
            if (!fatcaForm.pincode) {
                errors.pincode = 'Pincode is required';
                isValid = false;
            } else if (!/^\d{6}$/.test(fatcaForm.pincode)) {
                errors.pincode = 'Pincode must be 6 digits';
                isValid = false;
            }
        }

        setFatcaError(errors);
        return isValid;
    };

    const handleNext = async () => {
        if (validateFatca()) {
            console.log('FATCA Form Data:', fatcaForm);
            await saveFatcaDetails();
        } else {
            showToast(toastTypes.error, 'Please fill all required fields');
        }
    };

    const saveFatcaDetails = async () => {
        try {
            setIsLoading(true);

            let payload = {
                investor_id: getKYC_Details()?.user_basic_details?.id,
                is_indian_citizen: fatcaForm.citizenOfIndia,
                is_politically_exposed: fatcaForm.politicallyExposed,
                is_indian_taxpayer: fatcaForm.taxPayerOnlyIndia,
                kycStatus: false,
                is_related_to_pep: fatcaForm.politicallyExposed === 'related' ? 'yes' : 'no',
                occupation: fatcaForm.occupation.toString(),
                income_source_id: fatcaForm.wealthSource,
                salary_slab_id: fatcaForm.annualIncome,
                signZy_user_id: signZyData?.userId,
                signZy_user_Token: signZyData?.id,
                COB: fatcaForm.countryOfBirth,
                POB: fatcaForm.placeOfBirth,
                citizenship_country: fatcaForm.citizenOfIndia === 'no' ? fatcaForm.country : "",
                foreign_address: fatcaForm.taxPayerOnlyIndia === 'no' ? fatcaForm.address : "",
                foreign_pincode: fatcaForm.taxPayerOnlyIndia === 'no' ? fatcaForm.pincode : "",
                foreign_city: fatcaForm.taxPayerOnlyIndia === 'no' ? fatcaForm.city : "",
                foreign_district: fatcaForm.taxPayerOnlyIndia === 'no' ? fatcaForm.district : "",
                foreign_state: fatcaForm.taxPayerOnlyIndia === 'no' ? fatcaForm.state : "",
                foreign_country: fatcaForm.taxPayerOnlyIndia === 'no' ? fatcaForm.countryOfBirth : ""
            };

            console.log('FATCA Declaration Payload:', payload);

            const [result, error]: any = await saveFatcaDeclarationApi(payload);

            if (result) {
                console.log('Save FATCA Details Result:', result);
                showToast(toastTypes.success, result?.msg || 'FATCA details saved successfully');

                // Update KYC details if needed
                if (result?.data) {
                    const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data?.investor_data);
                    setKYC_Details(update_data);
                }

                // Navigate to next step
                setSelectedTab('BankDetails');
            } else {
                console.log('Save FATCA Details Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to save FATCA details');
            }
        } catch (error: any) {
            console.log('Save FATCA Details Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while saving FATCA details');
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        kycSignZyStatus()
        getPersonalInfo()
        getInvestorDeclartionInfo()
        getCountry()
        getFatcaDD()
        getAddressInfo()
        getAddressType()
        getOnBoardingListings()

    }, [isFocused])



    const kycSignZyStatus = async () => {
        try {
            let payload = {
                "username": getKYC_Details()?.user_basic_details?.signzy_user_name,
                "password": getKYC_Details()?.user_basic_details?.signzy_kyc_id
            }
            const [result, error]: any = await CreateKYCInvsSignZy(payload)
            if (result) {
                setSignZydata(result?.data)
            } else {
                console.log('kycSignZyStatus Error : ', error)
                showToast(toastTypes.error, error)
            }
        } catch (error: any) {

            console.log('kycSignZyStatus Catch Error : ', error)
            showToast(toastTypes.error, error)
        }
    }

    const getOnBoardingListings = async () => {
        try {
            const [result, error]: any = await getOnBoardingListingsApi();

            if (result?.data) {
                console.log('getOnBoardingListings Result:', result?.data);
                // Remove populateDropdownData call since we're using getFatcaDD now
            } else {
                console.log('getOnBoardingListings Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch onboarding data');
            }
        } catch (error: any) {
            console.log('getOnBoardingListings Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching onboarding data');
        } finally {

        }
    };

    const populateDropdownData = (data: any) => {
        try {
            console.log('API Response Structure:', data?.occupation);

            // Populate Occupation options
            if (data?.occupation && Array.isArray(data.occupation)) {
                const occupationData = data.occupation.map((item: any) => ({
                    value: item.id,
                    label: item.occupation || item.name
                }));
                setOccupation(occupationData);
            }

            // Populate Annual Income options
            if (data?.annual_income && Array.isArray(data.annual_income)) {
                const incomeData = data.annual_income.map((item: any) => ({
                    value: item.id,
                    label: item.income_range || item.name
                }));
                setAnnualIncome(incomeData);
            }

            // Populate Wealth Source options
            if (data?.wealth_source && Array.isArray(data.wealth_source)) {
                const wealthData = data.wealth_source.map((item: any) => ({
                    value: item.id,
                    label: item.source_name || item.name
                }));
                setWealthSource(wealthData);
            }

        } catch (error: any) {
            console.log('populateDropdownData Error:', error);
        }
    };

    const getPersonalInfo = async () => {
        try {
            const basicDetails = getKYC_Details()?.user_basic_details;
            const userId = basicDetails?.id;
            console.log('getStateCorr basicDetails:', basicDetails);
            if (userId) {
                const [result, error]: any = await getPersonalInfoApi(userId);

                if (result?.data) {
                    console.log('getPersonalInfo Result:', result?.data);
                    // Set form data from API response
                    const apiData = result.data;

                } else {
                    console.log('getPersonalInfo Error:', error);
                }
            }
        } catch (error: any) {
            console.log('getPersonalInfo Catch Error:', error);
        }
    };

    const getInvestorDeclartionInfo = async () => {
        try {
            const basicDetails = getKYC_Details()?.user_basic_details;
            const userId = basicDetails?.id;

            if (userId) {
                const [result, error]: any = await InvestorDeclarationApi(userId);

                if (result?.data) {
                    console.log('getInvestorDeclartionInfo Result:', result?.data);
                    const apiData = result.data;

                    // Set form data from API response if data exists
                    setFatcaForm({
                        ...fatcaForm,
                        citizenOfIndia: apiData?.is_indian_citizen || 'yes',
                        taxPayerOnlyIndia: apiData?.is_indian_taxpayer || 'yes',
                        politicallyExposed: apiData?.is_related_to_pep === 'yes' ? 'related' : (apiData?.is_politically_exposed || 'no'),
                        country: apiData?.citizenship_country || '',
                        countryOfBirth: apiData?.COB ? apiData.COB.toString() : '',
                        occupation: apiData?.occupation ? apiData.occupation : '',
                        annualIncome: apiData?.salary_slab_id ? apiData.salary_slab_id : '',
                        wealthSource: apiData?.income_source_id ? apiData.income_source_id : '',
                        placeOfBirth: apiData?.POB || '',
                        address: apiData?.foreign_address || '',
                        state: apiData?.foreign_state || '',
                        city: apiData?.foreign_city || '',
                        district: apiData?.foreign_district || '',
                        pincode: apiData?.foreign_pincode || ''
                    });

                    // If foreign address data exists, fetch states for the country
                    if (apiData?.foreign_country) {
                        getState(apiData.foreign_country);
                    }

                } else {
                    console.log('getInvestorDeclartionInfo Error:', error);
                }
            }
        } catch (error: any) {
            console.log('getInvestorDeclartionInfo Catch Error:', error);
        }
    };

    const getCountry = async () => {
        try {
            const [result, error]: any = await getAllCountryApi();

            if (result?.data) {
                console.log('getCountry Result:', result?.data);
                const countryData = result.data.map((item: any) => ({
                    value: item.id,
                    label: item.name
                }));
                setCountry(countryData);
            } else {
                console.log('getCountry Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch countries');
            }
        } catch (error: any) {
            console.log('getCountry Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching countries');
        }
    };

    const getState = async (countryId: any) => {
        try {
            const [result, error]: any = await getAllStateByCountryApi(countryId);

            if (result?.data) {
                console.log('getState Result:', result?.data);
                const stateData = result.data.map((item: any) => ({
                    value: item.id,
                    label: item.name
                }));
                setState(stateData);
            } else {
                console.log('getState Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch states');
            }
        } catch (error: any) {
            console.log('getState Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching states');
        }
    };


    const getFatcaDD = async () => {
        try {
            const [result, error]: any = await getFatcaDDApi();

            if (result?.data) {
                console.log('getFatcaDD Result:', result?.data);
                populateFatcaDropdownData(result?.data);
            } else {
                console.log('getFatcaDD Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch FATCA data');
            }
        } catch (error: any) {
            console.log('getFatcaDD Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching FATCA data');
        }
    };

    const populateFatcaDropdownData = (data: any) => {
        try {
            console.log('FATCA API Response Structure:', data);

            // Populate Occupation options from occupationList
            if (data?.occupationList && Array.isArray(data.occupationList)) {
                const occupationData = data.occupationList.map((item: any) => ({
                    value: item.id,
                    label: item.occupation
                }));
                setOccupation(occupationData);
            }

            // Populate Annual Income options from annualIncome
            if (data?.annualIncome && Array.isArray(data.annualIncome)) {
                const incomeData = data.annualIncome.map((item: any) => ({
                    value: item.id,
                    label: item.income_range
                }));
                setAnnualIncome(incomeData);
            }

            // Populate Wealth Source options from incomeList
            if (data?.incomeList && Array.isArray(data.incomeList)) {
                const wealthData = data.incomeList.map((item: any) => ({
                    value: item.source_id,
                    label: item.source_name
                }));
                setWealthSource(wealthData);
            }

        } catch (error: any) {
            console.log('populateFatcaDropdownData Error:', error);
        }
    };

    const getAddressInfo = async () => {
        try {
            const basicDetails = getKYC_Details()?.user_basic_details;
            const userId = basicDetails?.id;

            if (userId) {
                const [result, error]: any = await getAddressInfoApi(userId);

                if (result?.data) {
                    console.log('getAddressInfo Result:', result?.data);
                    // Set form data from API response
                    const apiData = result.data;

                    // Check poaConsent to show/hide Aadhar upload fields

                } else {
                    console.log('getAddressInfo Error:', error);
                }
            }
        } catch (error: any) {
            console.log('getAddressInfo Catch Error:', error);
        }
    };

    const getAddressType = async () => {
        try {
            const [result, error]: any = await getAddressTypeApi();

            if (result?.data) {

                const addressTypeData = result.data.map((item: any) => ({
                    value: item.id,
                    label: item.address_type
                }));

            } else {
                console.log('getAddressType Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch address types');
            }
        } catch (error: any) {
            console.log('getAddressType Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching address types');
        }
    };




    return (
        <>
            <Header menubtn name={'Initial On-Boarding'} />
            <Spacer y='XS' />
            <Wrapper color={colors.Hard_White} position="center" width={responsiveWidth(95)} height={responsiveHeight(85)} customStyles={{ borderRadius: borderRadius.medium }}>
                <Wrapper customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                    <CusText size="SS" medium text={'Initiate On-boarding'} />
                </Wrapper>
                <Wrapper
                    position='center'
                    customStyles={{
                        height: 2,
                        width: responsiveWidth(90),
                        backgroundColor: colors.fieldborder,
                        // marginVertical: responsiveHeight(1)
                    }}
                />
                <ScrollView >
                    <Wrapper justify="apart" align="center" row customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" medium text={'PAN Card '} />
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(40)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
                        <IonIcon name={'checkmark-circle'} color={colors.green} size={responsiveWidth(5)} />
                        <TouchableOpacity onPress={() => { setSelectedTab('PersonalInfo') }}>
                            <CusText size="SS" medium text={'Edit'} color={colors.primary1} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper
                        position='center'

                        customStyles={{
                            height: 2,
                            width: responsiveWidth(90),
                            backgroundColor: colors.fieldborder,

                        }}
                    />
                    <Wrapper justify="apart" align="center" row customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" medium text={'Proof of Address '} />
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(28)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
                        <IonIcon name={'checkmark-circle'} color={colors.green} size={responsiveWidth(5)} />
                        <TouchableOpacity onPress={() => { setSelectedTab('AddressInfo') }}>
                            <CusText size="SS" medium text={'Edit'} color={colors.primary1} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper
                        position='center'

                        customStyles={{
                            height: 2,
                            width: responsiveWidth(90),
                            backgroundColor: colors.fieldborder,

                        }}
                    />
                    <Spacer y="XXS" />
                    <Wrapper align="center" row customStyles={{ paddingVertical: responsiveWidth(1), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" semibold text={'FATCA'} />
                    </Wrapper>

                    <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(2) }}>
                        {/* I am a citizen of India */}
                        <Wrapper row justify="apart" align="center" customStyles={{ paddingVertical: responsiveWidth(2) }}>
                            <Wrapper width={responsiveWidth(50)}>
                                <CusText size="SS" text={'I am a citizen of India'} color={colors.Hard_Black} />
                            </Wrapper>
                            <Wrapper width={responsiveWidth(35)}>
                                <DropDown
                                    data={citizenOptions}
                                    placeholder="Select"
                                    value={fatcaForm.citizenOfIndia}
                                    valueField="value"
                                    labelField={'label'}
                                    onChange={(data: any) => handleFatcaChange('citizenOfIndia', data.value)}
                                    width={responsiveWidth(35)}
                                    height={responsiveWidth(10)}
                                    error={fatcaError.citizenOfIndia}
                                />
                            </Wrapper>
                        </Wrapper>

                        {/* Show country dropdown if citizen of India is No */}
                        {fatcaForm.citizenOfIndia === 'no' && (
                            <Wrapper row position="center" align="center" customStyles={{ paddingVertical: responsiveWidth(2) }}>

                                <Wrapper position="center" justify="center" >
                                    <DropDown
                                        data={country}
                                        placeholder="Select Country"
                                        value={fatcaForm.country}
                                        valueField="value"
                                        labelField={'label'}
                                        onChange={(data: any) => handleFatcaChange('country', data.value)}
                                        width={responsiveWidth(90)}
                                        height={responsiveWidth(10)}
                                        error={fatcaError.country}
                                    />
                                </Wrapper>
                            </Wrapper>
                        )}

                        {/* I am Tax payer only in India */}
                        <Wrapper row justify="apart" align="center" customStyles={{ paddingVertical: responsiveWidth(2) }}>
                            <Wrapper width={responsiveWidth(50)}>
                                <CusText size="SS" text={'I am Tax payer only in India'} color={colors.Hard_Black} />
                            </Wrapper>
                            <Wrapper width={responsiveWidth(35)}>
                                <DropDown
                                    data={taxPayerOptions}
                                    placeholder="Select"
                                    value={fatcaForm.taxPayerOnlyIndia}
                                    valueField="value"
                                    labelField={'label'}
                                    onChange={(data: any) => handleFatcaChange('taxPayerOnlyIndia', data.value)}
                                    width={responsiveWidth(35)}
                                    height={responsiveWidth(10)}
                                    error={fatcaError.taxPayerOnlyIndia}
                                />
                            </Wrapper>
                        </Wrapper>

                        {/* I am politically exposed person */}
                        <Wrapper row justify="apart" align="center" customStyles={{ paddingVertical: responsiveWidth(2) }}>
                            <Wrapper width={responsiveWidth(50)}>
                                <CusText size="SS" text={'I am politically exposed person'} color={colors.Hard_Black} />
                            </Wrapper>
                            <Wrapper width={responsiveWidth(35)}>
                                <DropDown
                                    data={politicalOptions}
                                    placeholder="Select"
                                    value={fatcaForm.politicallyExposed}
                                    valueField="value"
                                    labelField={'label'}
                                    onChange={(data: any) => handleFatcaChange('politicallyExposed', data.value)}
                                    width={responsiveWidth(35)}
                                    height={responsiveWidth(10)}
                                    error={fatcaError.politicallyExposed}
                                />
                            </Wrapper>
                        </Wrapper>

                        {/* Show additional fields if Tax payer only in India is No */}
                        {fatcaForm.taxPayerOnlyIndia === 'no' && (
                            <>
                                <Spacer y="S" />

                                {/* Address */}
                                <Wrapper position="center">
                                    <InputField
                                        label="Address *"
                                        width={responsiveWidth(89)}
                                        placeholder="Enter Address"
                                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                        fieldViewStyle={{
                                            borderColor: 'rgba(152, 162, 179, 1)',
                                            borderRadius: borderRadius.middleSmall
                                        }}
                                        value={fatcaForm.address}
                                        onChangeText={(value: string) => {
                                            handleFatcaChange('address', value);
                                        }}
                                        error={fatcaError.address}
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical={'top'}
                                    />
                                </Wrapper>
                                <Spacer y="XXS" />
                            </>
                        )}

                        {/* Country of Birth - Always visible */}
                        <Wrapper position="center">
                            <DropDown
                                width={responsiveWidth(89)}
                                data={country}
                                placeholder={'Select Country of Birth'}
                                placeholdercolor={colors.gray}
                                label="Country of Birth *"
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                required
                                value={fatcaForm.countryOfBirth}
                                valueField="value"
                                labelField={'label'}
                                onChange={(data: any) => {
                                    handleFatcaChange('countryOfBirth', data.value);
                                    getState(data.value);
                                    handleFatcaChange('state', '');
                                }}
                                onClear={() => {
                                    handleFatcaChange('countryOfBirth', '');
                                    handleFatcaChange('state', '');
                                    setState([]);
                                }}
                                error={fatcaError.countryOfBirth}
                            />
                        </Wrapper>
                        <Spacer y="XXS" />

                        {/* Show State, City, District, Pincode if Tax payer only in India is No */}
                        {fatcaForm.taxPayerOnlyIndia === 'no' && (
                            <>
                                {/* State */}
                                <Wrapper position="center">
                                    <DropDown
                                        width={responsiveWidth(89)}
                                        data={state}
                                        placeholder={'Select State'}
                                        placeholdercolor={colors.gray}
                                        label="State *"
                                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                        required
                                        value={fatcaForm.state}
                                        valueField="value"
                                        labelField={'label'}
                                        onChange={(data: any) => {
                                            handleFatcaChange('state', data.value);
                                        }}
                                        onClear={() => {
                                            handleFatcaChange('state', '');
                                        }}
                                        error={fatcaError.state}
                                    />
                                </Wrapper>
                                <Spacer y="XXS" />

                                {/* City */}
                                <Wrapper position="center">
                                    <InputField
                                        label="City *"
                                        width={responsiveWidth(89)}
                                        placeholder="Enter City"
                                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                        fieldViewStyle={{
                                            borderColor: 'rgba(152, 162, 179, 1)',
                                            borderRadius: borderRadius.middleSmall
                                        }}
                                        value={fatcaForm.city}
                                        onChangeText={(value: string) => {
                                            handleFatcaChange('city', value);
                                        }}
                                        error={fatcaError.city}
                                    />
                                </Wrapper>
                                <Spacer y="XXS" />

                                {/* District */}
                                <Wrapper position="center">
                                    <InputField
                                        label="District *"
                                        width={responsiveWidth(89)}
                                        placeholder="Enter District"
                                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                        fieldViewStyle={{
                                            borderColor: 'rgba(152, 162, 179, 1)',
                                            borderRadius: borderRadius.middleSmall
                                        }}
                                        value={fatcaForm.district}
                                        onChangeText={(value: string) => {
                                            handleFatcaChange('district', value);
                                        }}
                                        error={fatcaError.district}
                                    />
                                </Wrapper>
                                <Spacer y="XXS" />

                                {/* Pincode */}
                                <Wrapper position="center">
                                    <InputField
                                        label="Pincode *"
                                        width={responsiveWidth(89)}
                                        placeholder="Enter Pincode"
                                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                        fieldViewStyle={{
                                            borderColor: 'rgba(152, 162, 179, 1)',
                                            borderRadius: borderRadius.middleSmall
                                        }}
                                        value={fatcaForm.pincode}
                                        keyboardType="numeric"
                                        maxLength={6}
                                        onChangeText={(value: string) => {
                                            handleFatcaChange('pincode', value);
                                        }}
                                        error={fatcaError.pincode}
                                    />
                                </Wrapper>
                                <Spacer y="XXS" />
                            </>
                        )}

                        {/* Rest of the fields - Occupation, Annual Income, Wealth Source, Place of Birth */}
                        <Wrapper position="center">
                            <DropDown
                                width={responsiveWidth(89)}
                                data={occupation}
                                placeholder={'Select Occupation'}
                                placeholdercolor={colors.gray}
                                label="Occupation *"
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                required
                                value={fatcaForm.occupation}
                                valueField="value"
                                labelField={'label'}
                                onChange={(data: any) => {
                                    handleFatcaChange('occupation', data.value);
                                }}
                                onClear={() => {
                                    handleFatcaChange('occupation', '');
                                }}
                                error={fatcaError.occupation}
                            />
                        </Wrapper>
                        <Spacer y="XXS" />

                        <Wrapper position="center">
                            <DropDown
                                width={responsiveWidth(89)}
                                data={annualIncome}
                                placeholder={'Select Annual Income'}
                                placeholdercolor={colors.gray}
                                label="Annual Income *"
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                required
                                value={fatcaForm.annualIncome}
                                valueField="value"
                                labelField={'label'}
                                onChange={(data: any) => {
                                    handleFatcaChange('annualIncome', data.value);
                                }}
                                onClear={() => {
                                    handleFatcaChange('annualIncome', '');
                                }}
                                error={fatcaError.annualIncome}
                            />
                        </Wrapper>
                        <Spacer y="XXS" />

                        <Wrapper position="center">
                            <DropDown
                                width={responsiveWidth(89)}
                                data={wealthSource}
                                placeholder={'Select Wealth Source'}
                                placeholdercolor={colors.gray}
                                label="Wealth Source *"
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                required
                                value={fatcaForm.wealthSource}
                                valueField="value"
                                labelField={'label'}
                                onChange={(data: any) => {
                                    handleFatcaChange('wealthSource', data.value);
                                }}
                                onClear={() => {
                                    handleFatcaChange('wealthSource', '');
                                }}
                                error={fatcaError.wealthSource}
                            />
                        </Wrapper>
                        <Spacer y="XXS" />

                        <Wrapper position="center">
                            <InputField
                                label="Place of Birth"
                                width={responsiveWidth(89)}
                                placeholder="Enter Place of Birth"
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                fieldViewStyle={{
                                    borderColor: 'rgba(152, 162, 179, 1)',
                                    borderRadius: borderRadius.middleSmall
                                }}
                                value={fatcaForm.placeOfBirth}
                                onChangeText={(value: string) => {
                                    handleFatcaChange('placeOfBirth', value);
                                }}
                                error={fatcaError.placeOfBirth}
                            />
                        </Wrapper>
                    </Wrapper>

                    <Spacer y="S" />

                    {/* Next Button */}
                    <Wrapper position='center' row align='center' justify='center' customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={handleNext}>
                            <Wrapper width={responsiveWidth(80)} color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingVertical: responsiveWidth(2.5) }}>
                                <CusText position='center' bold color={colors.Hard_White} text={'Next'} />
                            </Wrapper>
                        </TouchableOpacity>
                    </Wrapper>
                    <Spacer y="XXS" />
                </ScrollView>

            </Wrapper>
        </>
    )
}

export default Fatca;
