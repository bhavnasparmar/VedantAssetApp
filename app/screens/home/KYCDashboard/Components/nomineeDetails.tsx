import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { AppearanceContext } from '../../../../context/AppearanceContext';

import Wrapper from '../../../../ui/wrapper';

import Spacer from '../../../../ui/spacer';
import InputField from "../../../../ui/InputField";
import DropDown from '../../../../ui/dropdown';


import IonIcon from 'react-native-vector-icons/Ionicons';
import Header from '../../../../shared/components/Header/Header';
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../../../styles/variables';
import CusText from '../../../../ui/custom-text';
import RadioButton from '../../../../ui/radioButton';
import DateTimePicker from '../../../../ui/datetimePicker';
import { CreateKYCInvsSignZy, getAllCountryApi, getAllStateByCountryApi, getOnBoardingListingsApi, saveNomineeDetailsApi, getNomineeInfoApi } from '../../../../api/homeapi';
import { showToast, toastTypes } from '../../../../services/toastService';
import { getKYC_Details, setKYC_Details, updateObjectKey } from '../../../../utils/Commanutils';

const NomineeDetails = ({ setSelectedTab }: any) => {
    // const { colors }: any = React.useContext(AppearanceContext);
    const isFocused: any = useIsFocused();
    const [signZyData, setSignZydata] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<any>(null);

    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [nominees, setNominees] = useState([
        {
            id: 1,
            // Basic Information
            nomineeName: '',
            dateOfBirth: '',
            nomineeType: 'Major', // Major/Minor
            relationship: '',
            allocationPercentage: '',
            identityType: '',
            identityNumber: '',
            // Contact Information
            mobileNumber: '',
            emailAddress: '',
            // Address Information
            addressLine1: '',
            addressLine2: '',
            country: '',
            state: '',
            city: '',
            pinCode: '',
            // Guardian Information (for Minor)
            guardianName: '',
            guardianPAN: '',
            guardianDateOfBirth: '',
            relationshipToNominee: '',
            guardianMobileNumber: '',
            guardianEmailAddress: ''
        }
    ]);

    const [errors, setErrors] = useState<any>({});
    const [relationshipOptions, setRelationshipOptions] = useState([
        { value: 'FATHER', label: 'FATHER' },
        { value: 'MOTHER', label: 'MOTHER' },
        { value: 'SPOUSE', label: 'SPOUSE' },
        { value: 'SON', label: 'SON' },
        { value: 'DAUGHTER', label: 'DAUGHTER' },
        { value: 'BROTHER', label: 'BROTHER' },
        { value: 'SISTER', label: 'SISTER' }
    ]);

    const [identityTypeOptions, setIdentityTypeOptions] = useState([
        { value: 'PAN', label: 'PAN Card' },
        { value: 'AADHAR', label: 'Aadhar Card' },
        { value: 'PASSPORT', label: 'Passport' },
        { value: 'VOTER_ID', label: 'Voter ID' }
    ]);

    const [nomineeGuardianRelationOptions, setNomineeGuardianRelationOptions] = useState([
        { value: 'FATHER', label: 'FATHER' },
        { value: 'MOTHER', label: 'MOTHER' },
        { value: 'GUARDIAN', label: 'GUARDIAN' }
    ]);

    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);

    // Add state for each nominee's states
    const [nomineeStates, setNomineeStates] = useState<{ [key: number]: any[] }>({});

    const nomineeTypeOptions = [
        { label: 'Major', value: 'Major' },
        { label: 'Minor', value: 'Minor' }
    ];


    useEffect(() => {
        kycSignZyStatus();
        getOnBoardingListings();
        getCountry();
        getNomineeInfo();
    }, []);

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

                // Populate Relationship options from relationship_types
                if (result.data?.relationship_types && Array.isArray(result.data.relationship_types)) {
                    const relationshipData = result.data.relationship_types.map((item: any) => ({
                        value: item.id || item.id,
                        label: item.relationship || item.name
                    }));
                    setRelationshipOptions(relationshipData);
                }

                // Populate Identity Type options from identity_type_list
                if (result.data?.identity_type_list && Array.isArray(result.data.identity_type_list)) {
                    const identityTypeData = result.data.identity_type_list.map((item: any) => ({
                        value: item.id,
                        label: item.type
                    }));
                    setIdentityTypeOptions(identityTypeData);
                }

                // Populate Nominee Guardian Relationship options
                if (result.data?.nominee_guardian_relationship_types && Array.isArray(result.data.nominee_guardian_relationship_types)) {
                    const nomineeGuardianData = result.data.nominee_guardian_relationship_types.map((item: any) => ({
                        value: item.id,
                        label: item.relationship
                    }));
                    setNomineeGuardianRelationOptions(nomineeGuardianData);
                }

                // Get KYC status from user details
                const basicDetails = getKYC_Details()?.user_basic_details;
                const kycStatus = basicDetails?.is_kyc_complete;

                // Populate Bank Proof options based on KYC status
                if (result.data?.bank_proof && Array.isArray(result.data.bank_proof)) {
                    let bankProofData = result.data.bank_proof.map((item: any) => ({
                        value: item.id,
                        label: item.bank_proof || item.name
                    }));

                    // If KYC status is false, show only "Cheque Copy"
                    if (kycStatus === false) {
                        bankProofData = bankProofData.filter((item: any) =>
                            item.label === "Cheque Copy"
                        );
                    }
                }

                // Populate Bank List options
                if (result.data?.bank_list && Array.isArray(result.data.bank_list)) {
                    const bankListData = result.data.bank_list.map((item: any) => ({
                        value: item.id,
                        label: item.bank_name || item.name
                    }));
                }

            } else {
                console.log('getOnBoardingListings Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch onboarding data');
            }
        } catch (error: any) {
            console.log('getOnBoardingListings Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching onboarding data');
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
                setCountryOptions(countryData); // Set country options for nominees
            } else {
                console.log('getCountry Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch countries');
            }
        } catch (error: any) {
            console.log('getCountry Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching countries');
        }
    };



    // Function to get states for specific nominee
    const getStatesForNominee = async (nomineeId: number, countryId: any) => {
        try {
            const [result, error]: any = await getAllStateByCountryApi(countryId);

            if (result?.data) {
                const stateData = result.data.map((item: any) => ({
                    value: item.id,
                    label: item.name
                }));

                // Update states for specific nominee
                setNomineeStates(prev => ({
                    ...prev,
                    [nomineeId]: stateData
                }));
            } else {
                console.log('getStatesForNominee Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch states');
            }
        } catch (error: any) {
            console.log('getStatesForNominee Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching states');
        }
    };

    const handleNomineeChange = (nomineeId: number, field: string, value: any) => {
        // If changing allocation percentage, validate it doesn't exceed limits
        if (field === 'allocationPercentage') {
            const numValue = parseFloat(value) || 0;

            // Check if individual allocation exceeds 100%
            if (numValue > 100) {
                showToast(toastTypes.error, 'Individual allocation cannot exceed 100%');
                return;
            }

            // Check if total allocation would exceed 100%
            const otherNomineesTotal = nominees
                .filter(nominee => nominee.id !== nomineeId)
                .reduce((sum, nominee) => sum + (parseFloat(nominee.allocationPercentage) || 0), 0);

            if (otherNomineesTotal + numValue > 100) {
                showToast(toastTypes.error, `Total allocation cannot exceed 100%. Available: ${100 - otherNomineesTotal}%`);
                return;
            }
        }

        setNominees(prev => prev.map(nominee =>
            nominee.id === nomineeId
                ? { ...nominee, [field]: value }
                : nominee
        ));

        // Clear error when user starts typing
        if (errors[`${nomineeId}_${field}`]) {
            setErrors((prev: any) => ({ ...prev, [`${nomineeId}_${field}`]: '' }));
        }
    };

    // Function to calculate age and determine nominee type
    const calculateAgeAndType = (dateOfBirth: Date, nomineeId: number) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Automatically set nominee type based on age
        const nomineeType = age >= 18 ? 'Major' : 'Minor';
        handleNomineeChange(nomineeId, 'nomineeType', nomineeType);

        return { age, nomineeType };
    };

    const addNominee = () => {
        if (nominees.length < 3) {
            const newNominee = {
                id: nominees.length + 1,
                nomineeName: '',
                dateOfBirth: '',
                nomineeType: 'Major',
                relationship: '',
                allocationPercentage: '',
                identityType: '',
                identityNumber: '',
                mobileNumber: '',
                emailAddress: '',
                addressLine1: '',
                addressLine2: '',
                country: '',
                state: '',
                city: '',
                pinCode: '',
                guardianName: '',
                guardianPAN: '',
                guardianDateOfBirth: '',
                relationshipToNominee: '',
                guardianMobileNumber: '',
                guardianEmailAddress: ''
            };
            setNominees(prev => [...prev, newNominee]);
        } else {
            Alert.alert('Maximum Limit', 'You can add maximum 3 nominees only.');
        }
    };

    const removeNominee = (nomineeId: number) => {
        if (nominees.length > 1) {
            setNominees(prev => prev.filter(nominee => nominee.id !== nomineeId));
        }
    };

    const validateNominee = (nominee: any) => {
        let isValid = true;
        let nomineeErrors: any = {};

        // Basic Information validation
        if (!nominee.nomineeName.trim()) {
            nomineeErrors[`${nominee.id}_nomineeName`] = 'Nominee name is required';
            isValid = false;
        }
        if (!nominee.dateOfBirth) {
            nomineeErrors[`${nominee.id}_dateOfBirth`] = 'Date of birth is required';
            isValid = false;
        }
        if (!nominee.relationship) {
            nomineeErrors[`${nominee.id}_relationship`] = 'Relationship is required';
            isValid = false;
        }
        if (!nominee.allocationPercentage) {
            nomineeErrors[`${nominee.id}_allocationPercentage`] = 'Allocation percentage is required';
            isValid = false;
        }
        if (!nominee.identityType) {
            nomineeErrors[`${nominee.id}_identityType`] = 'Identity type is required';
            isValid = false;
        }
        if (!nominee.identityNumber.trim()) {
            nomineeErrors[`${nominee.id}_identityNumber`] = 'Identity number is required';
            isValid = false;
        }

        // Contact Information validation
        if (!nominee.mobileNumber.trim()) {
            nomineeErrors[`${nominee.id}_mobileNumber`] = 'Mobile number is required';
            isValid = false;
        }
        if (!nominee.emailAddress.trim()) {
            nomineeErrors[`${nominee.id}_emailAddress`] = 'Email address is required';
            isValid = false;
        }

        // Address Information validation
        if (!nominee.addressLine1.trim()) {
            nomineeErrors[`${nominee.id}_addressLine1`] = 'Address line 1 is required';
            isValid = false;
        }
        if (!nominee.country) {
            nomineeErrors[`${nominee.id}_country`] = 'Country is required';
            isValid = false;
        }
        if (!nominee.state) {
            nomineeErrors[`${nominee.id}_state`] = 'State is required';
            isValid = false;
        }
        if (!nominee.city.trim()) {
            nomineeErrors[`${nominee.id}_city`] = 'City is required';
            isValid = false;
        }
        if (!nominee.pinCode.trim()) {
            nomineeErrors[`${nominee.id}_pinCode`] = 'PIN code is required';
            isValid = false;
        }

        // Guardian Information validation (for Minor)
        if (nominee.nomineeType === 'Minor') {
            if (!nominee.guardianName.trim()) {
                nomineeErrors[`${nominee.id}_guardianName`] = 'Guardian name is required';
                isValid = false;
            }
            if (!nominee.guardianPAN.trim()) {
                nomineeErrors[`${nominee.id}_guardianPAN`] = 'Guardian PAN is required';
                isValid = false;
            }
            if (!nominee.guardianDateOfBirth) {
                nomineeErrors[`${nominee.id}_guardianDateOfBirth`] = 'Guardian date of birth is required';
                isValid = false;
            }
            if (!nominee.relationshipToNominee) {
                nomineeErrors[`${nominee.id}_relationshipToNominee`] = 'Relationship to nominee is required';
                isValid = false;
            }
            if (!nominee.guardianMobileNumber.trim()) {
                nomineeErrors[`${nominee.id}_guardianMobileNumber`] = 'Guardian mobile number is required';
                isValid = false;
            }
            if (!nominee.guardianEmailAddress.trim()) {
                nomineeErrors[`${nominee.id}_guardianEmailAddress`] = 'Guardian email address is required';
                isValid = false;
            }
        }

        return { isValid, errors: nomineeErrors };
    };

    const handleNext = async () => {
        let allValid = true;
        let allErrors: any = {};

        // Validate all nominees
        nominees.forEach(nominee => {
            const { isValid, errors: nomineeErrors } = validateNominee(nominee);
            if (!isValid) {
                allValid = false;
                allErrors = { ...allErrors, ...nomineeErrors };
            }
        });

        // Check total allocation percentage
        const totalAllocation = nominees.reduce((sum, nominee) =>
            sum + (parseFloat(nominee.allocationPercentage) || 0), 0
        );

        if (totalAllocation > 100) {
            Alert.alert('Invalid Allocation', 'Total allocation percentage cannot exceed 100%');
            allValid = false;
        } else if (totalAllocation !== 100) {
            Alert.alert('Invalid Allocation', 'Total allocation percentage must be exactly 100%');
            allValid = false;
        }

        setErrors(allErrors);

        if (allValid) {
            console.log('All nominees data:', nominees);
            await saveNomineeDetails();
        }
    };

    const saveNomineeDetails = async () => {
        try {
            setIsLoading(true);

            const basicDetails = getKYC_Details()?.user_basic_details;

            // Transform nominees data to match API payload structure
            const nominee_details = nominees.map(nominee => ({
                nominee_Type: nominee.nomineeType,
                nominee_name: nominee.nomineeName,
                nominee_DOB: nominee.dateOfBirth ? new Date(nominee.dateOfBirth).toISOString().split('T')[0] : '',
                relation: nominee.relationship.toString(),
                percentage_allocation: nominee.allocationPercentage,
                identity_type: nominee.identityType.toString(),
                identity_number: nominee.identityNumber,
                mobile_number: nominee.mobileNumber,
                email_address: nominee.emailAddress,
                address_line_1: nominee.addressLine1,
                address_line_2: nominee.addressLine2,
                country: nominee.country,
                state: nominee.state.toString(),
                city: nominee.city,
                pin_code: nominee.pinCode,
                // Guardian fields (empty for Major, filled for Minor)
                guardian_name: nominee.nomineeType === 'Minor' ? nominee.guardianName : '',
                guardian_PAN: nominee.nomineeType === 'Minor' ? nominee.guardianPAN : '',
                guardian_DOB: nominee.nomineeType === 'Minor' && nominee.guardianDateOfBirth
                    ? new Date(nominee.guardianDateOfBirth).toISOString().split('T')[0] : '',
                guardian_relationship: nominee.nomineeType === 'Minor' ? nominee.relationshipToNominee.toString() : '',
                guardian_mobile: nominee.nomineeType === 'Minor' ? nominee.guardianMobileNumber : '',
                guardian_email: nominee.nomineeType === 'Minor' ? nominee.guardianEmailAddress : ''
            }));

            const payload = {
                investor_id: basicDetails?.id,
                userToken: signZyData?.id,
                synzyuserId: signZyData?.userId,
                kycStatus: basicDetails?.kycstatus || false,
                nominee_details: nominee_details
            };

            console.log('Save Nominee Details Payload:', payload);
            const [result, error]: any = await saveNomineeDetailsApi(payload);

            if (result) {
                console.log('Save Nominee Details Result:', result);
                showToast(toastTypes.success, result?.msg || 'Nominee details saved successfully');
              
                // Update KYC details if needed
                if (result?.data) {
                    const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data?.investor_data);
                    setKYC_Details(update_data);
                }

                // Navigate to next step
                setSelectedTab('InPersonVerification');
            } else {
                console.log('Save Nominee Details Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to save nominee details');
            }
        } catch (error: any) {
            console.log('Save Nominee Details Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while saving nominee details');
        } finally {
            setIsLoading(false);
        }
    };

    // Add summary calculation function
    const calculateSummary = () => {
        const totalNominees = nominees.length;
        const totalAllocation = nominees.reduce((sum, nominee) =>
            sum + (parseFloat(nominee.allocationPercentage) || 0), 0
        );

        return {
            totalNominees,
            totalAllocation: totalAllocation.toFixed(1)
        };
    };

    const { totalNominees, totalAllocation } = calculateSummary();

    const renderNomineeForm = (nominee: any, index: number) => (
        <Wrapper key={nominee.id} position='center' customStyles={{ marginBottom: responsiveWidth(2) }}>
            {/* Nominee Header */}
            <Wrapper row justify="apart" align="center" customStyles={{ paddingHorizontal: responsiveWidth(3), marginHorizontal: responsiveWidth(0), borderRadius: borderRadius.middleSmall, paddingVertical: responsiveWidth(1) }}>
                <CusText size="M" color={colors.orange} bold text={`Nominee ${index + 1}`} />
                {nominees.length > 1 && (
                    <TouchableOpacity onPress={() => removeNominee(nominee.id)}>
                        <IonIcon name="trash-outline" size={responsiveWidth(5)} color={colors.red} />
                    </TouchableOpacity>
                )}
            </Wrapper>
            <Spacer y="XS" />

            {/* Basic Information */}
            <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                <CusText size="SN" semibold text="Basic Information" />
                <Spacer y="XS" />

                <InputField
                    label="Nominee Name *"
                    placeholder="Enter nominee name"
                    value={nominee.nomineeName}
                    onChangeText={(value: string) => handleNomineeChange(nominee.id, 'nomineeName', value)}
                    error={errors[`${nominee.id}_nomineeName`]}
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                    fieldViewStyle={{
                        borderColor: 'rgba(152, 162, 179, 1)',
                        borderRadius: borderRadius.middleSmall
                    }}
                    borderColor={colors.fieldborder}
                />
                {errors[`${nominee.id}_nomineeName`] ? (
                    <CusText text={errors[`${nominee.id}_nomineeName`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y='XS' />

                <DateTimePicker
                    label="Date of Birth *"
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                    maximum={new Date()}
                    value={nominee.dateOfBirth ? new Date(nominee.dateOfBirth) : undefined}
                    iconColor={colors.black}
                    width={responsiveWidth(90)}
                    borderColor={colors.gray}
                    customStyle={{
                        borderRadius: borderRadius.small,
                    }}
                    setValue={(value: Date) => {
                        handleNomineeChange(nominee.id, 'dateOfBirth', value);
                        // Automatically calculate age and set nominee type
                        calculateAgeAndType(value, nominee.id);
                    }}
                />
                {errors[`${nominee.id}_dateOfBirth`] ? (
                    <CusText text={errors[`${nominee.id}_dateOfBirth`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y='XS' />

                <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(0) }}>
                    <CusText color={colors.Hard_Black} size="SS" medium text="Nominee Type *" />
                    <Spacer y="XXS" />
                    <Wrapper
                        row
                        align="center"
                        customStyles={{
                            backgroundColor: colors.lightGray,
                            paddingVertical: responsiveWidth(3),
                            paddingHorizontal: responsiveWidth(4),
                            borderRadius: borderRadius.small,
                            borderWidth: 1,
                            borderColor: colors.fieldborder
                        }}
                    >
                        <CusText
                            size="SS"
                            semibold
                            text={nominee.nomineeType}
                            color={nominee.nomineeType === 'Minor' ? colors.red : colors.green}
                        />
                        <Spacer x="XS" />
                        <CusText
                            size="XXS"
                            medium
                            text="(Auto-selected based on age)"
                            color={colors.gray}
                        />
                    </Wrapper>
                </Wrapper>

                <Spacer y="XXS" />

                <DropDown
                    width={responsiveWidth(89)}
                    data={relationshipOptions}
                    placeholder="Select relationship"
                    placeholdercolor={colors.gray}
                    label="Relationship *"
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                    required
                    value={nominee.relationship}
                    valueField="value"
                    labelField="label"
                    onChange={(item: any) => handleNomineeChange(nominee.id, 'relationship', item.value)}
                    onClear={() => handleNomineeChange(nominee.id, 'relationship', '')}
                />
                {errors[`${nominee.id}_relationship`] ? (
                    <CusText text={errors[`${nominee.id}_relationship`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y="XXS" />

                <InputField
                    label="Percentage of Allocation *"
                    placeholder="Enter allocation percentage"
                    value={nominee.allocationPercentage}
                    inputMode="numeric"
                    onChangeText={(value: string) => handleNomineeChange(nominee.id, 'allocationPercentage', value)}
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                    fieldViewStyle={{
                        borderColor: 'rgba(152, 162, 179, 1)',
                        borderRadius: borderRadius.middleSmall
                    }}
                />
                {errors[`${nominee.id}_allocationPercentage`] ? (
                    <CusText text={errors[`${nominee.id}_allocationPercentage`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y='XS' />

                <DropDown
                    width={responsiveWidth(89)}
                    data={identityTypeOptions}
                    placeholder="Select identity type"
                    placeholdercolor={colors.gray}
                    label="Identity Type *"
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                    required
                    value={nominee.identityType}
                    valueField="value"
                    labelField="label"
                    onChange={(item: any) => handleNomineeChange(nominee.id, 'identityType', item.value)}
                    onClear={() => handleNomineeChange(nominee.id, 'identityType', '')}
                />
                {errors[`${nominee.id}_identityType`] ? (
                    <CusText text={errors[`${nominee.id}_identityType`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y="XXS" />

                <InputField
                    label="Identity Number *"
                    placeholder="Enter identity number"
                    value={nominee.identityNumber}
                    onChangeText={(value: string) => handleNomineeChange(nominee.id, 'identityNumber', value)}
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                    fieldViewStyle={{
                        borderColor: 'rgba(152, 162, 179, 1)',
                        borderRadius: borderRadius.middleSmall
                    }}
                />
                {errors[`${nominee.id}_identityNumber`] ? (
                    <CusText text={errors[`${nominee.id}_identityNumber`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y='XS' />
            </Wrapper>

            {/* Contact Information */}
            <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                <CusText size="SN" semibold text="Contact Information" />
                <Spacer y="XS" />


                <InputField
                    label="Mobile Number *"
                    placeholder="Enter mobile number"
                    value={nominee.mobileNumber}
                    inputMode="numeric"
                    onChangeText={(value: string) => handleNomineeChange(nominee.id, 'mobileNumber', value)}
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                    fieldViewStyle={{
                        borderColor: 'rgba(152, 162, 179, 1)',
                        borderRadius: borderRadius.middleSmall
                    }}
                />
                {errors[`${nominee.id}_mobileNumber`] ? (
                    <CusText text={errors[`${nominee.id}_mobileNumber`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y='XS' />

                <InputField
                    label="Email Address *"
                    placeholder="Enter email address"
                    value={nominee.emailAddress}
                    onChangeText={(value: string) => handleNomineeChange(nominee.id, 'emailAddress', value)}
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                    fieldViewStyle={{
                        borderColor: 'rgba(152, 162, 179, 1)',
                        borderRadius: borderRadius.middleSmall
                    }}
                />
                {errors[`${nominee.id}_emailAddress`] ? (
                    <CusText text={errors[`${nominee.id}_emailAddress`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y='XS' />
            </Wrapper>

            {/* Address Information */}
            <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                <CusText size="SN" semibold text="Address Information" />
                <Spacer y="XS" />

                <InputField
                    label="Address Line 1 *"
                    placeholder="Enter address line 1"
                    value={nominee.addressLine1}
                    onChangeText={(value: string) => handleNomineeChange(nominee.id, 'addressLine1', value)}
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                    fieldViewStyle={{
                        borderColor: 'rgba(152, 162, 179, 1)',
                        borderRadius: borderRadius.middleSmall
                    }}
                />
                {errors[`${nominee.id}_addressLine1`] ? (
                    <CusText text={errors[`${nominee.id}_addressLine1`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y='XS' />

                <InputField
                    label="Address Line 2"
                    placeholder="Enter address line 2"
                    value={nominee.addressLine2}
                    onChangeText={(value: string) => handleNomineeChange(nominee.id, 'addressLine2', value)}
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                    fieldViewStyle={{
                        borderColor: 'rgba(152, 162, 179, 1)',
                        borderRadius: borderRadius.middleSmall
                    }}
                />
                <Spacer y='XS' />

                <DropDown
                    width={responsiveWidth(89)}
                    data={countryOptions}
                    placeholder="Select country"
                    placeholdercolor={colors.gray}
                    label="Country *"
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                    required
                    value={nominee.country}
                    valueField="value"
                    labelField="label"
                    onChange={(item: any) => {
                        handleNomineeChange(nominee.id, 'country', item.value);
                        handleNomineeChange(nominee.id, 'state', '');
                        // Load states for selected country
                        getStatesForNominee(nominee.id, item.value);
                    }}
                    onClear={() => {
                        handleNomineeChange(nominee.id, 'country', '');
                        handleNomineeChange(nominee.id, 'state', '');
                        // Clear states for this nominee
                        setNomineeStates(prev => ({
                            ...prev,
                            [nominee.id]: []
                        }));
                    }}
                />
                {errors[`${nominee.id}_country`] ? (
                    <CusText text={errors[`${nominee.id}_country`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y="XXS" />

                <DropDown
                    width={responsiveWidth(89)}
                    data={nomineeStates[nominee.id] || []}
                    placeholder="Select state"
                    placeholdercolor={colors.gray}
                    label="State *"
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                    required
                    value={nominee.state}
                    valueField="value"
                    labelField="label"
                    onChange={(item: any) => handleNomineeChange(nominee.id, 'state', item.value)}
                    onClear={() => handleNomineeChange(nominee.id, 'state', '')}
                />
                {errors[`${nominee.id}_state`] ? (
                    <CusText text={errors[`${nominee.id}_state`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y="XXS" />

                <InputField
                    label="City *"
                    placeholder="Enter city"
                    value={nominee.city}
                    onChangeText={(value: string) => handleNomineeChange(nominee.id, 'city', value)}
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                    fieldViewStyle={{
                        borderColor: 'rgba(152, 162, 179, 1)',
                        borderRadius: borderRadius.middleSmall
                    }}
                />
                {errors[`${nominee.id}_city`] ? (
                    <CusText text={errors[`${nominee.id}_city`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y='XS' />

                <InputField
                    label="PIN Code *"
                    placeholder="Enter PIN code"
                    value={nominee.pinCode}
                    inputMode="numeric"
                    onChangeText={(value: string) => handleNomineeChange(nominee.id, 'pinCode', value)}
                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                    fieldViewStyle={{
                        borderColor: 'rgba(152, 162, 179, 1)',
                        borderRadius: borderRadius.middleSmall
                    }}
                />
                {errors[`${nominee.id}_pinCode`] ? (
                    <CusText text={errors[`${nominee.id}_pinCode`]} size='XXS' color={colors.red}
                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                ) : null}
                <Spacer y='XS' />
            </Wrapper>

            {/* Guardian Information (for Minor) */}
            {nominee.nomineeType === 'Minor' && (
                <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                    <CusText size="SN" semibold text="Guardian Information" />
                    <Spacer y="XS" />

                    <InputField
                        label="Guardian Name *"
                        placeholder="Enter guardian name"
                        value={nominee.guardianName}
                        onChangeText={(value: string) => handleNomineeChange(nominee.id, 'guardianName', value)}
                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                        fieldViewStyle={{
                            borderColor: 'rgba(152, 162, 179, 1)',
                            borderRadius: borderRadius.middleSmall
                        }}
                    />
                    {errors[`${nominee.id}_guardianName`] ? (
                        <CusText text={errors[`${nominee.id}_guardianName`]} size='XXS' color={colors.red}
                            customStyles={{ marginTop: responsiveHeight(0.5) }} />
                    ) : null}
                    <Spacer y='XS' />

                    <InputField
                        label="Guardian PAN *"
                        placeholder="Enter guardian PAN"
                        value={nominee.guardianPAN}
                        onChangeText={(value: string) => handleNomineeChange(nominee.id, 'guardianPAN', value)}
                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                        fieldViewStyle={{
                            borderColor: 'rgba(152, 162, 179, 1)',
                            borderRadius: borderRadius.middleSmall
                        }}
                    />
                    {errors[`${nominee.id}_guardianPAN`] ? (
                        <CusText text={errors[`${nominee.id}_guardianPAN`]} size='XXS' color={colors.red}
                            customStyles={{ marginTop: responsiveHeight(0.5) }} />
                    ) : null}
                    <Spacer y='XS' />

                    <DateTimePicker
                        label="Guardian Date of Birth *"
                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                        maximum={new Date()}
                        value={nominee.guardianDateOfBirth ? new Date(nominee.guardianDateOfBirth) : undefined}
                        iconColor={colors.black}
                        width={responsiveWidth(90)}
                        borderColor={colors.gray}
                        customStyle={{
                            borderRadius: borderRadius.small,
                            // width: responsiveWidth(87)
                        }}
                        setValue={(value: Date) => handleNomineeChange(nominee.id, 'guardianDateOfBirth', value)}
                    />
                    {errors[`${nominee.id}_guardianDateOfBirth`] ? (
                        <CusText text={errors[`${nominee.id}_guardianDateOfBirth`]} size='XXS' color={colors.red}
                            customStyles={{ marginTop: responsiveHeight(0.5) }} />
                    ) : null}
                    <Spacer y='XS' />

                    <DropDown
                        width={responsiveWidth(89)}
                        data={nomineeGuardianRelationOptions}
                        placeholder="Select relationship to nominee"
                        placeholdercolor={colors.gray}
                        label="Relationship to Nominee *"
                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                        required
                        value={nominee.relationshipToNominee}
                        valueField="value"
                        labelField="label"
                        onChange={(item: any) => handleNomineeChange(nominee.id, 'relationshipToNominee', item.value)}
                        onClear={() => handleNomineeChange(nominee.id, 'relationshipToNominee', '')}
                    />
                    {errors[`${nominee.id}_relationshipToNominee`] ? (
                        <CusText text={errors[`${nominee.id}_relationshipToNominee`]} size='XXS' color={colors.red}
                            customStyles={{ marginTop: responsiveHeight(0.5) }} />
                    ) : null}
                    <Spacer y="XXS" />

                    <InputField
                        label="Guardian Mobile Number *"
                        placeholder="Enter guardian mobile number"
                        value={nominee.guardianMobileNumber}
                        inputMode="numeric"
                        onChangeText={(value: string) => handleNomineeChange(nominee.id, 'guardianMobileNumber', value)}
                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                        fieldViewStyle={{
                            borderColor: 'rgba(152, 162, 179, 1)',
                            borderRadius: borderRadius.middleSmall
                        }}
                    />
                    {errors[`${nominee.id}_guardianMobileNumber`] ? (
                        <CusText text={errors[`${nominee.id}_guardianMobileNumber`]} size='XXS' color={colors.red}
                            customStyles={{ marginTop: responsiveHeight(0.5) }} />
                    ) : null}
                    <Spacer y='XS' />

                    <InputField
                        label="Guardian Email Address *"
                        placeholder="Enter guardian email address"
                        value={nominee.guardianEmailAddress}
                        onChangeText={(value: string) => handleNomineeChange(nominee.id, 'guardianEmailAddress', value)}
                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                        fieldViewStyle={{
                            borderColor: 'rgba(152, 162, 179, 1)',
                            borderRadius: borderRadius.middleSmall
                        }}
                    />
                    {errors[`${nominee.id}_guardianEmailAddress`] ? (
                        <CusText text={errors[`${nominee.id}_guardianEmailAddress`]} size='XXS' color={colors.red}
                            customStyles={{ marginTop: responsiveHeight(0.5) }} />
                    ) : null}
                    <Spacer y='XS' />
                </Wrapper>
            )}

            <Wrapper
                position='center'
                customStyles={{
                    height: 2,
                    width: responsiveWidth(90),
                    backgroundColor: colors.fieldborder,
                    marginVertical: responsiveWidth(3)
                }}
            />
        </Wrapper>
    );

    const getNomineeInfo = async () => {
        try {
            const basicDetails = getKYC_Details()?.user_basic_details;
            const userId = basicDetails?.id;

            if (userId) {
                const [result, error]: any = await getNomineeInfoApi(userId);

                if (result?.data && Array.isArray(result.data) && result.data.length > 0) {
                    console.log('getNomineeInfo Result:', result?.data);

                    // Transform API data to component state format
                    const transformedNominees = result.data.map((apiNominee: any, index: number) => ({
                        id: index + 1,
                        // Basic Information
                        nomineeName: apiNominee.nominee_name || '',
                        dateOfBirth: apiNominee.nominee_DOB || '',
                        nomineeType: apiNominee.nominee_Type || 'Major',
                        relationship: apiNominee.relation || '',
                        allocationPercentage: apiNominee.percentage_allocation?.toString() || '',
                        identityType: apiNominee.identity_type || '',
                        identityNumber: apiNominee.identity_number || '',
                        // Contact Information
                        mobileNumber: apiNominee.mobile_number || '',
                        emailAddress: apiNominee.email_address || '',
                        // Address Information
                        addressLine1: apiNominee.address_line_1 || '',
                        addressLine2: apiNominee.address_line_2 || '',
                        country: apiNominee.country?.toString() || '',
                        state: apiNominee.state || '',
                        city: apiNominee.city || '',
                        pinCode: apiNominee.pin_code || '',
                        // Guardian Information (for Minor)
                        guardianName: apiNominee.guardian_name || '',
                        guardianPAN: apiNominee.guardian_PAN || '',
                        guardianDateOfBirth: apiNominee.guardian_DOB || '',
                        relationshipToNominee: apiNominee.guardian_relationship || '',
                        guardianMobileNumber: apiNominee.guardian_mobile || '',
                        guardianEmailAddress: apiNominee.guardian_email || ''
                    }));

                    setNominees(transformedNominees);

                    // Load states for each nominee that has a country selected
                    transformedNominees.forEach((nominee: any) => {
                        if (nominee.country) {
                            getStatesForNominee(nominee.id, nominee.country);
                        }
                    });

                    // Clear any errors since we have valid data
                    setErrors({});

                    console.log('Transformed Nominees:', transformedNominees);
                } else {
                    console.log('getNomineeInfo: No nominee data found');
                }
            }
        } catch (error: any) {
            console.log('getNomineeInfo Catch Error:', error);
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
                    }}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Previous sections status */}
                    <Wrapper justify="apart" align="center" row customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" medium text={'PAN Card '} />
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(40)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
                        <IonIcon name={'checkmark-circle'} color={colors.green} size={responsiveWidth(5)} />
                        <TouchableOpacity onPress={() => { setSelectedTab('PersonalInfo') }}>
                            <CusText size="SS" medium text={'Edit'} color={colors.primary1} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper position='center' customStyles={{ height: 2, width: responsiveWidth(90), backgroundColor: colors.fieldborder }} />
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
                    <Wrapper justify="apart" align="center" row customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" medium text={'FATCA '} />
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(45)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
                        <IonIcon name={'checkmark-circle'} color={colors.green} size={responsiveWidth(5)} />
                        <TouchableOpacity onPress={() => { setSelectedTab('Fatca') }}>
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
                        <CusText size="SS" medium text={'Bank Account Detail '} />
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(21)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
                        <IonIcon name={'checkmark-circle'} color={colors.green} size={responsiveWidth(5)} />
                        <TouchableOpacity onPress={() => { setSelectedTab('BankDetails') }}>
                            <CusText size="SS" medium text={'Edit'} color={colors.primary1} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper position='center' customStyles={{ height: 2, width: responsiveWidth(90), backgroundColor: colors.fieldborder }} />

                    <Spacer y="XXS" />
                    <Wrapper align="center" row customStyles={{ paddingVertical: responsiveWidth(1), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" semibold text={'Nomination'} />
                    </Wrapper>
                    <Spacer y="XXS" />
                    {/* Nominee Forms */}
                    {nominees.map((nominee, index) => renderNomineeForm(nominee, index))}

                    {/* Add Nominee Button */}
                    {nominees.length < 3 && (
                        <Wrapper position='center' customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                            <TouchableOpacity onPress={addNominee}>
                                <Wrapper row align='center' justify='center' color={colors.lightGray} customStyles={{ borderRadius: borderRadius.medium, paddingVertical: responsiveWidth(3), paddingHorizontal: responsiveWidth(3), borderWidth: 1, borderColor: colors.orange, borderStyle: 'dashed' }}>
                                    <IonIcon name="add-circle-outline" size={responsiveWidth(5)} color={colors.orange} />
                                    <Spacer x="XXS" />
                                    <CusText text="Add Another Nominee" color={colors.orange} medium />
                                </Wrapper>
                            </TouchableOpacity>
                        </Wrapper>
                    )}

                    <Spacer y="S" />

                    {/* Summary Section */}
                    <Wrapper position='center' customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                        <Wrapper
                            width={responsiveWidth(90)}
                            color={colors.lightGray}
                            customStyles={{
                                borderRadius: borderRadius.medium,
                                paddingVertical: responsiveWidth(4),
                                paddingHorizontal: responsiveWidth(4),
                                borderWidth: 1,
                                borderColor: colors.fieldborder
                            }}
                        >
                            <CusText size="SN" semibold text="Summary" color={colors.Hard_Black} />
                            <Spacer y="XS" />

                            <Wrapper row justify="apart" align="center">
                                <CusText size="SS" medium text="Total Nominees:" color={colors.Hard_Black} />
                                <CusText size="SS" semibold text={totalNominees.toString()} color={colors.primary} />
                            </Wrapper>
                            <Spacer y="XXS" />

                            <Wrapper row justify="apart" align="center">
                                <CusText size="SS" medium text="Total Allocation:" color={colors.Hard_Black} />
                                <CusText
                                    size="SS"
                                    semibold
                                    text={`${totalAllocation}%`}
                                    color={
                                        parseFloat(totalAllocation) === 100
                                            ? colors.green
                                            : parseFloat(totalAllocation) > 100
                                                ? colors.red
                                                : colors.orange
                                    }
                                />
                            </Wrapper>
                            <Spacer y="XXS" />

                            {parseFloat(totalAllocation) !== 100 && (
                                <Wrapper row align="center" justify='center' customStyles={{ marginTop: responsiveWidth(1) }}>
                                    <IonIcon name="warning" size={responsiveWidth(5)} color={colors.orange} />
                                    <Spacer x="XXS" />
                                    <CusText
                                        size="MS"
                                        position='center'
                                        medium
                                        text={
                                            parseFloat(totalAllocation) > 100
                                                ? "Total allocation exceeds 100%"
                                                : "Total allocation should equal 100%"
                                        }
                                        color={parseFloat(totalAllocation) > 100 ? colors.red : colors.orange}

                                    />
                                </Wrapper>
                            )}
                        </Wrapper>
                    </Wrapper>

                    <Spacer y="S" />

                    {/* Next Button */}
                    <Wrapper position='center' row align='center' justify='center' customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={handleNext} disabled={isLoading}>
                            <Wrapper width={responsiveWidth(80)} color={isLoading ? colors.gray : colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingVertical: responsiveWidth(2.5) }}>
                                {isLoading ? (
                                    <ActivityIndicator color={colors.Hard_White} size="small" />
                                ) : (
                                    <CusText position='center' bold color={colors.Hard_White} text={'Next'} />
                                )}
                            </Wrapper>
                        </TouchableOpacity>
                    </Wrapper>
                    <Spacer y="XXS" />
                </ScrollView>
            </Wrapper>
        </>
    );
};

export default NomineeDetails;
