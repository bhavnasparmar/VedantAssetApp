import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Wrapper from "../../../../ui/wrapper";
import Header from "../../../../shared/components/Header/Header";
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Container from "../../../../ui/container";
import Spacer from "../../../../ui/spacer";
import { ScrollView, TouchableOpacity, View } from "react-native";
import InputField from "../../../../ui/InputField";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { getKYC_Details, setKYC_Details, updateObjectKey } from "../../../../utils/Commanutils";
import DropDown from "../../../../ui/dropdown";
import { CreateKYCInvsSignZy, getAddressInfoApi, getAddressTypeApi, getAllCountryApi, getAllStateByCountryApi, getFatcaDDApi, getOnBoardingListingsApi, getPersonalInfoApi, InvestorDeclarationApi, saveBankDetailsApi, saveFatcaDeclarationApi, updateAddressDetailApi, updateCancelledChequeApi, getBankInfoApi } from "../../../../api/homeapi";
import { showToast, toastTypes } from "../../../../services/toastService";
import API from "../../../../utils/API";
import ImagePickerModal from "../../../../shared/components/ImagePickerModal";
import { Image } from 'react-native';

const BankDetails = ({ setSelectedTab }: any) => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const [signZyData, setSignZydata] = useState<any>(null);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [occupation, setOccupation] = useState([]);
    const [annualIncome, setAnnualIncome] = useState([]);
    const [wealthSource, setWealthSource] = useState([]);


    const [isLoading, setIsLoading] = useState(false);
    const [isScanLoading, setIsScanLoading] = useState(false);

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



    const handleNext = async () => {
        if (validateBankForm()) {
            console.log('Bank Form Data:', bankForm);
            await saveBankDetails();
        } else {
            showToast(toastTypes.error, 'Please fill all required fields');
        }
    };

    const saveBankDetails = async () => {
        try {
            setIsLoading(true);

            const basicDetails = getKYC_Details()?.user_basic_details;

            const payload = {
                request_type: "updateBankDetails",
                investor_id: basicDetails?.id,
                userToken: signZyData?.id,
                synzyuserId: signZyData?.userId,
                kycStatus: basicDetails?.kycstatus || false,
                bankAccounts: [
                    {
                        bank_proof: parseInt(bankForm.bankProof),
                        branch: bankForm.bankBranch,
                        micr: bankForm.micr,
                        bank_id: bankForm.bankName.toString(),
                        ifsc: bankForm.ifsc,
                        account_type: bankForm.accountType === 'SB' ? 1 : 2,
                        account_no: bankForm.accountNumber,
                        cancelled_cheque: bankForm.cancelledCheque
                    }
                ]
            };

            console.log('Save Bank Details Payload:', payload);

            const [result, error]: any = await saveBankDetailsApi(payload);
            if (result) {
                console.log('Save Bank Details Result:', result);
                showToast(toastTypes.success, result?.msg || 'Bank details saved successfully');

                // Update KYC details if needed
                if (result?.data) {
                    const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data?.investor_data);
                    setKYC_Details(update_data);
                }

                // Navigate to next step or complete KYC
                setSelectedTab('Nominee');
            } else {
                console.log('Save Bank Details Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to save bank details');
            }
        } catch (error: any) {
            console.log('Save Bank Details Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while saving bank details');
        } finally {
            setIsLoading(false);
        }
    };




    useEffect(() => {
        kycSignZyStatus()
        getCountry()
        getOnBoardingListings()
        getBankInfo()
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
                console.log('getOnBoardingListings Result:', getKYC_Details()?.user_basic_details);

                // Get KYC status from user details
                const basicDetails = getKYC_Details()?.user_basic_details;
                const kycStatus = basicDetails?.is_kyc_complete
                    ;

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

                    setBankProofList(bankProofData);
                }

                // Populate Bank List options
                if (result.data?.bank_list && Array.isArray(result.data.bank_list)) {
                    const bankListData = result.data.bank_list.map((item: any) => ({
                        value: item.id,
                        label: item.bank_name || item.name
                    }));
                    setBankList(bankListData);
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

    const getBankInfo = async () => {
        try {
            const basicDetails = getKYC_Details()?.user_basic_details;
            const userId = basicDetails?.id;

            if (userId) {
                const [result, error]: any = await getBankInfoApi(userId);

                if (result?.data) {
                    console.log('getBankInfo Result:', result?.data);

                    // Set form data from API response
                    const bankData = result.data[0];

                    setBankForm({
                        bankProof: bankData.bank_proof || '',
                        cancelledCheque: bankData.cancelled_cheque || '',
                        accountNumber: bankData.account_no || '',
                        ifsc: bankData.ifsc || '',
                        accountType: bankData.account_type === '1' ? 'SB' : 'CB',
                        bankName: bankData.bank_id || '',
                        micr: bankData.micr || '',
                        bankBranch: bankData.branch || ''
                    });

                    // Clear any errors since we have valid data
                    setBankError({
                        bankProof: '',
                        cancelledCheque: '',
                        accountNumber: '',
                        ifsc: '',
                        accountType: '',
                        bankName: '',
                        micr: '',
                        bankBranch: ''
                    });
                } else {
                    console.log('getBankInfo Error:', error);
                }
            }
        } catch (error: any) {
            console.log('getBankInfo Catch Error:', error);
        }
    };

    const [bankForm, setBankForm] = useState({
        bankProof: '',
        cancelledCheque: '',
        accountNumber: '',
        ifsc: '',
        accountType: '',
        bankName: '',
        micr: '',
        bankBranch: ''
    });

    const [bankError, setBankError] = useState<any>({
        bankProof: '',
        cancelledCheque: '',
        accountNumber: '',
        ifsc: '',
        accountType: '',
        bankName: '',
        micr: '',
        bankBranch: ''
    });

    const [bankProofList, setBankProofList] = useState([]);
    const [bankList, setBankList] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [fileExt, setFileExt] = useState('');

    const accountTypeOptions = [
        { value: 'SB', label: 'Savings' },
        { value: 'CB', label: 'Current' }
    ];

    const handleBankFormChange = (key: string, value: string) => {
        setBankForm(prev => ({ ...prev, [key]: value }));
        // Clear error when user starts typing
        if (bankError[key]) {
            setBankError((prev: any) => ({ ...prev, [key]: '' }));
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleImagePick1 = (response: any) => {
        console.log('Response : ', response);
        if (response && response.uri) {
            const fileExtension = response.fileName ?
                response.fileName.split('.').pop()?.toLowerCase() :
                response.uri.split('.').pop()?.toLowerCase();

            setFileExt(fileExtension || '');
            handleBankFormChange('cancelledCheque', response.uri);

            // Call scan API after image is selected
            scanCancelledChequeDetails(response);
        }
        setModalVisible(false);
    };

    const handleImagePick = (response: any) => {
        const allowedExtensions = ["jpg", "jpeg"];
        console.log('response', response);
        if (response && response.didCancel !== true) {
            let name = response[0]?.name ? response[0]?.name : response?.assets[0]?.fileName;
            const fileExtension = name.split(".").pop().toLowerCase();
            setFileExt(fileExtension);

            if (allowedExtensions.includes(fileExtension)) {
                const fileData = response[0]?.uri ? response[0] : response?.assets[0];
                handleBankFormChange('cancelledCheque', response[0]?.uri ? response[0]?.fileCopyUri : response?.assets[0]?.uri);
                scanCancelledChequeDetails(fileData);
                // showToast(toastTypes.success, 'File selected successfully');
            } else {
                showToast(toastTypes.error, 'Unsupported file type. Please upload a jpg, jpeg, png or pdf file.');
            }
        }
    };

    const scanCancelledChequeDetails = async (fileData: any) => {
        console.log('scanCancelledChequeDetails : Entered')
        try {
            setIsScanLoading(true);

            let formData = new FormData();

            let passObj: any = {
                request_type: "updateSignZy",
                userToken: signZyData?.id,
                synzyuserId: signZyData?.userId,
                investor_id: getKYC_Details()?.user_basic_details?.id,
            };
            formData.append("formData", JSON.stringify(passObj));

            // Add cancelled cheque image if available
            if (fileData) {
                // console.log(fileData)
                const name = fileData.fileName || fileData.name;
                // let tempName = name.replace(/\s/g, '').replace(/[()]/g, '_');

                const chequeImage = {
                    name: name,
                    type: fileData.type || 'image/jpeg',
                    uri: fileData.uri,
                };

                formData.append("cancelled_cheque", chequeImage);
            }

            console.log('Scan Cancelled Cheque FormData:', formData);

            const [result, error]: any = await updateCancelledChequeApi(formData)
            console.log('Scan Cancelled Cheque Result:', result);
            console.log('Scan Cancelled Cheque error:', error);
            if (result?.data) {
                console.log('Scan Cancelled Cheque Result:', result);
                showToast(toastTypes.success, result?.msg || 'Cancelled cheque details scanned successfully');

                // Update form with scanned bank details
                const bankData = result.data;

                // setBankForm({
                //     ...bankForm,
                //     accountNumber: bankData.account_no || bankForm.accountNumber,
                //     ifsc: bankData.ifsc || bankForm.ifsc,
                //     accountType: bankData.account_type === 'Savings' ? 'SB' : (bankData.account_type === 'Current' ? 'CB' : bankForm.accountType),
                //     micr: bankData.micr || bankForm.micr,
                //     bankBranch: bankData.branch || bankForm.bankBranch,
                //     // Find bank name from bankList by matching bank_name
                //     bankName: bankList.find((bank: any) => bank.label === bankData.bank_name)?.value || bankForm.bankName,
                // });

                setBankForm(prev => ({
                    ...prev,
                    accountNumber: bankData.account_no || prev.accountNumber,
                    ifsc: bankData.ifsc || prev.ifsc,
                    accountType: bankData.account_type === 'Savings' ? 'SB' : (bankData.account_type === 'Current' ? 'CB' : prev.accountType),
                    micr: bankData.micr || prev.micr,
                    bankBranch: bankData.branch || prev.bankBranch,
                    bankName: bankList.find((bank: any) => bank.label === bankData.bank_name)?.value || prev.bankName,
                    // Keep the existing cancelled cheque image fileData.fileName || fileData.name
                    // cancelledCheque: prev.cancelledCheque
                    cancelledCheque: fileData.fileName || fileData.name

                }));

                // Clear any related errors
                setBankError({
                    ...bankError,
                    accountNumber: '',
                    ifsc: '',
                    accountType: '',
                    micr: '',
                    bankBranch: '',
                    bankName: ''
                });
            } else {
                console.log('Scan Cancelled Cheque Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to scan cancelled cheque details');
            }
        } catch (error: any) {
            console.log('Scan Cancelled Cheque Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while scanning cancelled cheque');
        } finally {
            setIsScanLoading(false);
        }
    };

    const validateBankForm = () => {
        let isValid = true;
        let errors = {
            bankProof: '',
            cancelledCheque: '',
            accountNumber: '',
            ifsc: '',
            accountType: '',
            bankName: '',
            micr: '',
            bankBranch: ''
        };

        if (!bankForm.bankProof) {
            errors.bankProof = 'Please select bank proof';
            isValid = false;
        }

        if (!bankForm.cancelledCheque) {
            errors.cancelledCheque = 'Please upload cancelled cheque';
            isValid = false;
        }

        if (!bankForm.accountNumber) {
            errors.accountNumber = 'Account number is required';
            isValid = false;
        } else if (bankForm.accountNumber.length < 9) {
            errors.accountNumber = 'Account number must be at least 9 digits';
            isValid = false;
        }

        if (!bankForm.ifsc) {
            errors.ifsc = 'IFSC code is required';
            isValid = false;
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankForm.ifsc)) {
            errors.ifsc = 'Invalid IFSC code format';
            isValid = false;
        }

        if (!bankForm.accountType) {
            errors.accountType = 'Please select account type';
            isValid = false;
        }

        if (!bankForm.bankName) {
            errors.bankName = 'Please select bank';
            isValid = false;
        }

        if (!bankForm.bankBranch) {
            errors.bankBranch = 'Bank branch is required';
            isValid = false;
        }

        setBankError(errors);
        return isValid;
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
                    <Spacer y="XXS" />
                    <Wrapper align="center" row customStyles={{ paddingVertical: responsiveWidth(1), paddingHorizontal: responsiveWidth(3) }}>
                        <CusText size="SS" semibold text={'Bank Account Details'} />
                    </Wrapper>

                    <Spacer y="S" />

                    {/* Bank Proof Dropdown */}
                    <Wrapper position="center">
                        <DropDown
                            width={responsiveWidth(89)}
                            data={bankProofList}
                            placeholder={'Select Bank Proof'}
                            placeholdercolor={colors.gray}
                            label="Bank Proof *"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                            required
                            value={bankForm.bankProof}
                            valueField="value"
                            labelField={'label'}
                            onChange={(data: any) => {
                                handleBankFormChange('bankProof', data.value);
                            }}
                            onClear={() => {
                                handleBankFormChange('bankProof', '');
                            }}
                            error={bankError.bankProof}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />

                    {/* Upload Cancelled Cheque */}
                    <Wrapper position="center">
                        <CusText text="Upload Cancelled Cheque *" size="SS" color={colors.Hard_Black} customStyles={{ marginBottom: responsiveWidth(2), marginLeft: responsiveWidth(2) }} />
                        <TouchableOpacity activeOpacity={0.7} onPress={toggleModal}>
                            <Wrapper
                                width={responsiveWidth(89)}
                                height={responsiveWidth(35)}
                                borderColor={bankError.cancelledCheque ? colors.red : colors.inputBorder}
                                // borderWidth={1}
                                // borderRadius={borderRadius.middleSmall}
                                align="center"
                                justify="center"
                                customStyles={{ borderStyle: 'dashed', borderRadius: borderRadius.middleSmall, borderWidth: 1 }}>
                                {
                                    bankForm.cancelledCheque ? (
                                        <Image
                                            resizeMode="contain"
                                            source={{ uri: bankForm.cancelledCheque }}
                                            style={{
                                                height: responsiveWidth(30),
                                                width: responsiveWidth(85),
                                                borderRadius: borderRadius.small
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <View style={{
                                                backgroundColor: colors.darkGrayShades,
                                                borderRadius: borderRadius.ring,
                                                padding: responsiveWidth(3),
                                                marginBottom: responsiveWidth(2)
                                            }}>
                                                <IonIcon name='camera-outline' color={colors.gray} size={30} />
                                            </View>
                                            <CusText
                                                text="Take a Photo - Cancelled Cheque"
                                                position="center"
                                                color={colors.gray}
                                                size="S"
                                            />
                                        </>
                                    )
                                }
                            </Wrapper>
                        </TouchableOpacity>
                        {bankError.cancelledCheque && (
                            <CusText text={bankError.cancelledCheque} size='S' color={colors.red} customStyles={{ marginTop: responsiveWidth(1), marginLeft: responsiveWidth(2) }} />
                        )}
                    </Wrapper>
                    <Spacer y="XXS" />

                    {/* Account Number */}
                    <Wrapper position="center">
                        <InputField
                            label="Account Number *"
                            width={responsiveWidth(89)}
                            placeholder="Enter Account Number"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                            fieldViewStyle={{
                                borderColor: 'rgba(152, 162, 179, 1)',
                                borderRadius: borderRadius.middleSmall
                            }}
                            value={bankForm.accountNumber}
                            keyboardType="numeric"
                            onChangeText={(value: string) => {
                                handleBankFormChange('accountNumber', value);
                            }}
                            error={bankError.accountNumber}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />

                    {/* IFSC */}
                    <Wrapper position="center">
                        <InputField
                            label="IFSC *"
                            width={responsiveWidth(89)}
                            placeholder="Enter IFSC Code"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                            fieldViewStyle={{
                                borderColor: 'rgba(152, 162, 179, 1)',
                                borderRadius: borderRadius.middleSmall
                            }}
                            value={bankForm.ifsc}
                            autoCapitalize="characters"
                            onChangeText={(value: string) => {
                                handleBankFormChange('ifsc', value.toUpperCase());
                            }}
                            error={bankError.ifsc}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />

                    {/* Account Type */}
                    <Wrapper position="center">
                        <DropDown
                            width={responsiveWidth(89)}
                            data={accountTypeOptions}
                            placeholder={'Select Account Type'}
                            placeholdercolor={colors.gray}
                            label="Account Type *"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                            required
                            value={bankForm.accountType}
                            valueField="value"
                            labelField={'label'}
                            onChange={(data: any) => {
                                handleBankFormChange('accountType', data.value);
                            }}
                            onClear={() => {
                                handleBankFormChange('accountType', '');
                            }}
                            error={bankError.accountType}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />

                    {/* Select Bank */}
                    <Wrapper position="center">
                        <DropDown
                            width={responsiveWidth(89)}
                            data={bankList}
                            placeholder={'Select Bank'}
                            placeholdercolor={colors.gray}
                            label="Select Bank *"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                            required
                            value={bankForm.bankName}
                            valueField="value"
                            labelField={'label'}
                            onChange={(data: any) => {
                                handleBankFormChange('bankName', data.value);
                            }}
                            onClear={() => {
                                handleBankFormChange('bankName', '');
                            }}
                            error={bankError.bankName}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />

                    {/* MICR */}
                    <Wrapper position="center">
                        <InputField
                            label="MICR"
                            width={responsiveWidth(89)}
                            placeholder="Enter MICR Code"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                            fieldViewStyle={{
                                borderColor: 'rgba(152, 162, 179, 1)',
                                borderRadius: borderRadius.middleSmall
                            }}
                            value={bankForm.micr}
                            keyboardType="numeric"
                            onChangeText={(value: string) => {
                                handleBankFormChange('micr', value);
                            }}
                            error={bankError.micr}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />

                    {/* Bank Branch */}
                    <Wrapper position="center">
                        <InputField
                            label="Bank Branch *"
                            width={responsiveWidth(89)}
                            placeholder="Enter Bank Branch"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                            fieldViewStyle={{
                                borderColor: 'rgba(152, 162, 179, 1)',
                                borderRadius: borderRadius.middleSmall
                            }}
                            value={bankForm.bankBranch}
                            onChangeText={(value: string) => {
                                handleBankFormChange('bankBranch', value);
                            }}
                            error={bankError.bankBranch}
                        />
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

                    <ImagePickerModal
                        visible={isModalVisible}
                        onClose={toggleModal}
                        onPickImage={handleImagePick}
                        isVideo={false}
                    />
                </ScrollView>

            </Wrapper>
        </>
    )
}

export default BankDetails;
