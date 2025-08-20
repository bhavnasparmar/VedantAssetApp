import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Wrapper from "../../../../ui/wrapper";
import Header from "../../../../shared/components/Header/Header";
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Container from "../../../../ui/container";
import Spacer from "../../../../ui/spacer";
import { ActivityIndicator, BackHandler, ScrollView, TouchableOpacity, View } from "react-native";
import InputField from "../../../../ui/InputField";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { getImageUrl, getKYC_Details, getKYC_ISMember, setKYC_Details, updateObjectKey } from "../../../../utils/Commanutils";
import DropDown from "../../../../ui/dropdown";
import { CreateKYCInvsSignZy, getAddressInfoApi, getAddressTypeApi, getAllCountryApi, getAllStateByCountryApi, getFatcaDDApi, getOnBoardingListingsApi, getPersonalInfoApi, InvestorDeclarationApi, saveBankDetailsApi, saveFatcaDeclarationApi, updateAddressDetailApi, updateCancelledChequeApi, getBankInfoApi, updateCancelledChequeApiforKycDone, InitiateBankAccountVerification } from "../../../../api/homeapi";
import { showToast, toastTypes } from "../../../../services/toastService";
import API from "../../../../utils/API";
import ImagePickerModal from "../../../../shared/components/ImagePickerModal";
import CommonModal from '../../../../shared/components/CommonAlert/commonModal';
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
    const [isVerifyingBank, setIsVerifyingBank] = useState(false);
    const [currentImageAccountIndex, setCurrentImageAccountIndex] = useState(0);

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

            await saveBankDetails();
        } else {
            showToast(toastTypes.error, 'Please fill all required fields');
        }
    };

    const saveBankDetails = async () => {
        try {


            const basicDetails = getKYC_ISMember() ? getKYC_Details()?.member_basic_details : getKYC_Details()?.user_basic_details;

            // Prepare bank accounts array based on KYC status
            let bankAccountsData;
            if (isKYCDone) {
                // Use multiple bank accounts for KYC done users
                bankAccountsData = bankAccounts.map(account => ({
                    bank_proof: parseInt(account.bankProof),
                    branch: account.bankBranch,
                    micr: account.micr,
                    bank_id: account.bankName.toString(),
                    ifsc: account.ifsc,
                    account_type: account.accountType === 'SB' ? 1 : 2,
                    account_no: account.accountNumber,
                    cancelled_cheque: account.cancelledCheque
                }));
            } else {
                // Use single bank account for non-KYC users
                bankAccountsData = [
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
                ];
            }

            const payload = {
                request_type: "updateBankDetails",
                investor_id: basicDetails?.id,
                userToken: signZyData?.id,
                synzyuserId: signZyData?.userId,
                // kycStatus: getKYC_Details()?.user_basic_details?.isKYCDone || getKYC_Details()?.member_basic_details?.isKYCDone ? true : false,
                kycStatus: getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.isKYCDone ? true : false : getKYC_Details()?.user_basic_details?.isKYCDone ? true : false,
                bankAccounts: bankAccountsData
            };

            console.log('Save Bank Details Payload:', payload);

            setIsLoading(true);
            const [result, error]: any = await saveBankDetailsApi(payload);
            if (result) {
                console.log('Save Bank Details Result:', result);
                showToast(toastTypes.success, result?.msg || 'Bank details saved successfully');

                // Update KYC details if needed
                if (result?.data) {

                    if (getKYC_ISMember()) {
                        const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'member_basic_details', result?.data?.investor_data);
                        setKYC_Details(update_data);
                    } else {



                        const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data?.investor_data);
                        setKYC_Details(update_data);
                    }
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
        const backAction = () => {
            navigation.navigate('Profile')
            return true; // Return true to prevent default back behavior
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove(); // Clean up the listener on unmount
    }, []);


    useEffect(() => {

        if (getKYC_ISMember()) {
            if (getKYC_Details()?.member_basic_details?.signzy_user_name && getKYC_Details()?.member_basic_details?.signzy_kyc_id) {
                kycSignZyStatus();
            }
        }
        else {
            if (getKYC_Details()?.user_basic_details?.signzy_user_name && getKYC_Details()?.user_basic_details?.signzy_kyc_id) {
                kycSignZyStatus();
            }
        }


        // kycSignZyStatus()

        getOnBoardingListings()
        getBankInfo()
    }, [isFocused])



    const kycSignZyStatus = async () => {
        try {
            let payload = {
                "username": getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.signzy_user_name : getKYC_Details()?.user_basic_details?.signzy_user_name,
                "password": getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.signzy_kyc_id : getKYC_Details()?.user_basic_details?.signzy_kyc_id
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
                const basicDetails = getKYC_ISMember() ? getKYC_Details()?.member_basic_details : getKYC_Details()?.user_basic_details;
                const kycStatus = basicDetails?.isKYCDone;

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




    const getBankInfo = async () => {
        try {
            const basicDetails = getKYC_ISMember() ? getKYC_Details()?.member_basic_details : getKYC_Details()?.user_basic_details;
            const userId = basicDetails?.id;

            if (userId) {
                const [result, error]: any = await getBankInfoApi(userId);

                if (result?.data && Array.isArray(result.data)) {
                    console.log('getBankInfo Result:', result?.data);

                    if (isKYCDone && result.data.length > 0) {
                        // Handle multiple bank accounts for KYC done users
                        const bankAccountsData = result.data.map((bankData: any) => ({
                            bankProof: bankData.bank_proof || '',
                            cancelledCheque: bankData.cancelled_cheque || '',
                            accountNumber: bankData.account_no || '',
                            ifsc: bankData.ifsc || '',
                            accountType: bankData.account_type === '1' ? 'SB' : 'CB',
                            bankName: bankData.bank_id || '',
                            micr: bankData.micr || '',
                            bankBranch: bankData.branch || ''
                        }));

                        setBankAccounts(bankAccountsData);

                        // Clear errors for all accounts
                        const clearedErrors = bankAccountsData.map(() => ({
                            bankProof: '',
                            cancelledCheque: '',
                            accountNumber: '',
                            ifsc: '',
                            accountType: '',
                            bankName: '',
                            micr: '',
                            bankBranch: ''
                        }));
                        setBankErrors(clearedErrors);
                    } else if (result.data.length > 0) {
                        // Handle single bank account for non-KYC users
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
                    }
                } else {
                    console.log('getBankInfo Error:', error);
                }
            }
        } catch (error: any) {
            console.log('getBankInfo Catch Error:', error);
        }
    };

    const initiateBankAccountVerification = async (accountNumber: string, ifscCode: string, accountIndex: number = 0) => {
        try {
            // Get basic details for mobile number and account holder name
            const basicDetails = getKYC_ISMember() ? getKYC_Details()?.member_basic_details : getKYC_Details()?.user_basic_details;

            if (!basicDetails?.reg_mobile || !basicDetails?.name) {
                console.log('Missing mobile or name for bank verification');
                showToast(toastTypes.error, 'Missing mobile or name for bank verification');
                return;
            }

            console.log('basicDetails : ', basicDetails);

            setIsVerifyingBank(true);

            const payload = {
                bankAcNo: accountNumber,
                bankAcIfsc: ifscCode,
                mobile: basicDetails.reg_mobile,
                bankAcNameInBank: basicDetails.name
            };

            console.log('Bank Account Verification Payload:', payload);

            const [result, error]: any = await InitiateBankAccountVerification(payload);

            if (result) {
                console.log('Bank Account Verification Result:', result);
                showToast(toastTypes.success, result?.msg || 'Bank account verification initiated successfully');

                // Update the form with verification data if available
                if (result?.data) {
                    console.log('Bank verification data:', result.data);

                    // Extract data from response
                    const verificationData = result.data;
                    const ifscDetails = verificationData.ifsc_details;

                    // Find bank ID from bankList by matching bank name
                    const matchedBank = bankList.find((bank: any) => {
                        const bankLabel = bank?.label?.toLowerCase() || '';
                        const responseBankName = verificationData?.bank_name?.toLowerCase() || '';
                        const ifscBankName = ifscDetails?.bank?.toLowerCase() || '';

                        return (responseBankName && bankLabel.includes(responseBankName)) ||
                            (ifscBankName && bankLabel.includes(ifscBankName));
                    });

                    if (isKYCDone && accountIndex < bankAccounts.length) {
                        // Update specific bank account for KYC done users
                        setBankAccounts(prev => {
                            const updated = [...prev];
                            updated[accountIndex] = {
                                ...updated[accountIndex],
                                bankName: matchedBank?.value || updated[accountIndex].bankName,
                                micr: verificationData.micr?.toString() || ifscDetails?.micr?.toString() || updated[accountIndex].micr,
                                bankBranch: verificationData.branch || ifscDetails?.branch || updated[accountIndex].bankBranch
                            };
                            return updated;
                        });
                    } else {
                        // Update single bank account for non-KYC users
                        setBankForm(prev => ({
                            ...prev,
                            bankName: matchedBank?.value || prev.bankName,
                            micr: verificationData.micr?.toString() || ifscDetails?.micr?.toString() || prev.micr,
                            bankBranch: verificationData.branch || ifscDetails?.branch || prev.bankBranch
                        }));
                    }

                    // Show additional verification info
                    if (verificationData.account_status === 'VALID') {
                        showToast(toastTypes.success, `Account verified: ${verificationData.name_at_bank} - ${verificationData.bank_name}`);
                    }
                }
            } else {
                console.log('Bank Account Verification Error:', error);
                showToast(toastTypes.error, error?.msg || 'Bank account verification failed');
            }
        } catch (error: any) {
            console.log('Bank Account Verification Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong during bank account verification');
        } finally {
            setIsVerifyingBank(false);
        }
    };

    // Check if KYC is done to determine max bank accounts
    const isKYCDone = getKYC_Details()?.user_basic_details?.isKYCDone || getKYC_Details()?.member_basic_details?.isKYCDone;
    const maxBankAccounts = isKYCDone ? 3 : 1;

    const [bankAccounts, setBankAccounts] = useState([{
        bankProof: '',
        cancelledCheque: '',
        accountNumber: '',
        ifsc: '',
        accountType: '',
        bankName: '',
        micr: '',
        bankBranch: ''
    }]);

    const [bankErrors, setBankErrors] = useState([{
        bankProof: '',
        cancelledCheque: '',
        accountNumber: '',
        ifsc: '',
        accountType: '',
        bankName: '',
        micr: '',
        bankBranch: ''
    }]);

    // Keep backward compatibility with existing bankForm
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
    const [bankList, setBankList] = useState<any[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [fileExt, setFileExt] = useState('');

    const accountTypeOptions = [
        { value: 'SB', label: 'Savings' },
        { value: 'CB', label: 'Current' }
    ];

    const handleBankFormChange = (key: string, value: string, accountIndex: number = 0) => {
        if (isKYCDone && accountIndex < bankAccounts.length) {
            // Update specific bank account
            setBankAccounts(prev => {
                const updated = [...prev];
                updated[accountIndex] = { ...updated[accountIndex], [key]: value };

                // Check if both account number and IFSC are provided for bank verification
                const updatedAccount = updated[accountIndex];
                if ((key === 'accountNumber' || key === 'ifsc') &&
                    updatedAccount.accountNumber &&
                    updatedAccount.ifsc &&
                    updatedAccount.accountNumber.length >= 9 &&
                    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(updatedAccount.ifsc)) {
                    // Call bank verification API
                    setTimeout(() => {
                        initiateBankAccountVerification(updatedAccount.accountNumber, updatedAccount.ifsc, accountIndex);
                    }, 500); // Small delay to ensure state is updated
                }

                return updated;
            });
            // Clear error for specific account
            setBankErrors(prev => {
                const updated: any[] = [...prev];
                if (updated[accountIndex] && updated[accountIndex][key]) {
                    updated[accountIndex] = { ...updated[accountIndex], [key]: '' };
                }
                return updated;
            });
        } else {
            // Backward compatibility for single account
            setBankForm(prev => {
                const updatedForm = { ...prev, [key]: value };

                // Check if both account number and IFSC are provided for bank verification
                if ((key === 'accountNumber' || key === 'ifsc') &&
                    updatedForm.accountNumber &&
                    updatedForm.ifsc &&
                    updatedForm.accountNumber.length >= 9 &&
                    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(updatedForm.ifsc)) {
                    // Call bank verification API
                    setTimeout(() => {
                        initiateBankAccountVerification(updatedForm.accountNumber, updatedForm.ifsc, 0);
                    }, 500); // Small delay to ensure state is updated
                }

                return updatedForm;
            });
            // Clear error when user starts typing
            if (bankError[key]) {
                setBankError((prev: any) => ({ ...prev, [key]: '' }));
            }
        }
    };

    const addBankAccount = () => {
        if (bankAccounts.length < maxBankAccounts) {
            setBankAccounts(prev => [...prev, {
                bankProof: '',
                cancelledCheque: '',
                accountNumber: '',
                ifsc: '',
                accountType: '',
                bankName: '',
                micr: '',
                bankBranch: ''
            }]);
            setBankErrors(prev => [...prev, {
                bankProof: '',
                cancelledCheque: '',
                accountNumber: '',
                ifsc: '',
                accountType: '',
                bankName: '',
                micr: '',
                bankBranch: ''
            }]);
        }
    };

    const removeBankAccount = (index: number) => {
        if (bankAccounts.length > 1) {
            setBankAccounts(prev => prev.filter((_, i) => i !== index));
            setBankErrors(prev => prev.filter((_, i) => i !== index));
        }
    };

    const toggleModal = (accountIndex: number = 0) => {
        setCurrentImageAccountIndex(accountIndex);
        setModalVisible(!isModalVisible);
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
                const fileName = fileData.fileName || fileData.name || name;

                // Set the file name/path in the form for the correct account
                handleBankFormChange('cancelledCheque', fileName, currentImageAccountIndex);
                scanCancelledChequeDetails(fileData, currentImageAccountIndex);
                // showToast(toastTypes.success, 'File selected successfully');
            } else {
                showToast(toastTypes.error, 'Unsupported file type. Please upload a jpg, jpeg, png or pdf file.');
            }
        }
    };

    const scanCancelledChequeDetails = async (fileData: any, accountIndex: number = 0) => {
        console.log('scanCancelledChequeDetails : Entered')
        try {
            setIsScanLoading(true);

            let formData = new FormData();

            let passObj: any = {
                request_type: "updateSignZy",
                userToken: signZyData?.id,
                synzyuserId: signZyData?.userId,
                investor_id: getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.id : getKYC_Details()?.user_basic_details?.id,
            };

            if (isKYCDone) {
                delete passObj.userToken;
                delete passObj.synzyuserId;
            }

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

            const [result, error]: any = isKYCDone ? await updateCancelledChequeApiforKycDone(formData) : await updateCancelledChequeApi(formData)
            console.log('Scan Cancelled Cheque Result:', result);
            console.log('Scan Cancelled Cheque error:', error);
            if (result?.data) {
                console.log('Scan Cancelled Cheque Result:', result);
                showToast(toastTypes.success, result?.msg || 'Cancelled cheque details scanned successfully');

                // Update form with scanned bank details
                const bankData = result.data;
                const fileName = fileData.fileName || fileData.name;

                // Find bank name from bankList by matching bank_name with null checks
                const matchedBank = bankList.find((bank: any) => {
                    const bankLabel = bank?.label?.toLowerCase() || '';
                    const responseBankName = bankData?.bank_name?.toLowerCase() || '';
                    return responseBankName && bankLabel.includes(responseBankName);
                });

                if (isKYCDone) {
                    // Update multiple bank accounts for KYC done users
                    setBankAccounts(prev => {
                        const updated = [...prev];
                        // Update the specific account that was being edited
                        if (updated[accountIndex]) {
                            updated[accountIndex] = {
                                ...updated[accountIndex],
                                accountNumber: bankData.account_no || updated[accountIndex].accountNumber,
                                ifsc: bankData.ifsc || updated[accountIndex].ifsc,
                                accountType: bankData.account_type === 'Savings' ? 'SB' : (bankData.account_type === 'Current' ? 'CB' : updated[accountIndex].accountType),
                                micr: bankData.micr || updated[accountIndex].micr,
                                bankBranch: bankData.branch || updated[accountIndex].bankBranch,
                                bankName: matchedBank?.value || updated[accountIndex].bankName,
                                cancelledCheque: bankData.cancelled_cheque || fileName
                            };
                        }
                        return updated;
                    });

                    // Clear errors for the updated account
                    setBankErrors(prev => {
                        const updated = [...prev];
                        if (updated[accountIndex]) {
                            updated[accountIndex] = {
                                ...updated[accountIndex],
                                accountNumber: '',
                                ifsc: '',
                                accountType: '',
                                micr: '',
                                bankBranch: '',
                                bankName: ''
                            };
                        }
                        return updated;
                    });
                } else {
                    // Update single bank account for non-KYC users
                    setBankForm(prev => ({
                        ...prev,
                        accountNumber: bankData.account_no || prev.accountNumber,
                        ifsc: bankData.ifsc || prev.ifsc,
                        accountType: bankData.account_type === 'Savings' ? 'SB' : (bankData.account_type === 'Current' ? 'CB' : prev.accountType),
                        micr: bankData.micr || prev.micr,
                        bankBranch: bankData.branch || prev.bankBranch,
                        bankName: matchedBank?.value || prev.bankName,
                        cancelledCheque: bankData.cancelled_cheque || fileName
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
                }
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

        if (isKYCDone) {
            // Validate multiple bank accounts
            const newErrors = bankAccounts.map((account, index) => {
                const errors = {
                    bankProof: '',
                    cancelledCheque: '',
                    accountNumber: '',
                    ifsc: '',
                    accountType: '',
                    bankName: '',
                    micr: '',
                    bankBranch: ''
                };

                if (!account.bankProof) {
                    errors.bankProof = 'Please select bank proof';
                    isValid = false;
                }

                // No validation for cancelled cheque upload

                if (!account.accountNumber) {
                    errors.accountNumber = 'Account number is required';
                    isValid = false;
                } else if (account.accountNumber.length < 9) {
                    errors.accountNumber = 'Account number must be at least 9 digits';
                    isValid = false;
                }

                if (!account.ifsc) {
                    errors.ifsc = 'IFSC code is required';
                    isValid = false;
                } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(account.ifsc)) {
                    errors.ifsc = 'Invalid IFSC code format';
                    isValid = false;
                }

                if (!account.accountType) {
                    errors.accountType = 'Please select account type';
                    isValid = false;
                }

                if (!account.bankName) {
                    errors.bankName = 'Please select bank';
                    isValid = false;
                }

                if (!account.bankBranch) {
                    errors.bankBranch = 'Bank branch is required';
                    isValid = false;
                }

                return errors;
            });

            setBankErrors(newErrors);
        } else {
            // Validate single bank account (backward compatibility)
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

            // No validation for cancelled cheque upload

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
        }

        return isValid;
    };

    const renderBankAccountForm = (accountData: any, accountErrors: any, accountIndex: number) => {
        const isMultipleAccounts = isKYCDone && bankAccounts.length > 1;

        return (
            <Wrapper key={accountIndex}>
                {isMultipleAccounts && (
                    <Wrapper row justify="apart" align="center" customStyles={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(2) }}>
                        <CusText size="SS" semibold text={`Bank Account ${accountIndex + 1}`} />
                        {accountIndex > 0 && (
                            <TouchableOpacity onPress={() => removeBankAccount(accountIndex)}>
                                <IonIcon name="trash-outline" size={responsiveWidth(5)} color={colors.red} />
                            </TouchableOpacity>
                        )}
                    </Wrapper>
                )}

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
                        value={accountData.bankProof}
                        valueField="value"
                        labelField={'label'}
                        onChange={(data: any) => {
                            handleBankFormChange('bankProof', data.value, accountIndex);
                        }}
                        onClear={() => {
                            handleBankFormChange('bankProof', '', accountIndex);
                        }}
                        error={accountErrors.bankProof}
                    />
                </Wrapper>
                <Spacer y="XXS" />

                {/* Upload Cancelled Cheque */}
                <Wrapper position="center" width={responsiveWidth(89)} customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(0), gap: responsiveWidth(1) }}>
                    <Wrapper row align="center" justify="apart">
                        <CusText size="SS" medium text={'Upload Cancelled Cheque *'} color={colors.Hard_Black} />
                        <CusText size="SS" medium text={'Bank Document'} color={colors.Hard_Black} />
                    </Wrapper>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => toggleModal(accountIndex)}>
                        <Wrapper row customStyles={{
                            borderRadius: borderRadius.middleSmall,
                            borderColor: colors.fieldborder,
                            borderWidth: 1
                        }}>
                            <Wrapper color={colors.fieldborder} customStyles={{ paddingVertical: responsiveWidth(3), paddingHorizontal: responsiveWidth(2) }}>
                                <CusText text={'Choose File'} color={colors.Hard_Black} />
                            </Wrapper>
                            <Wrapper justify="center" customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(2), flex: 1 }}>
                                <CusText
                                    text={accountData.cancelledCheque ? (
                                        isKYCDone ?
                                            (accountData.cancelledCheque.split('/').pop() || 'File selected') :
                                            'File selected'
                                    ) : 'No file chosen'}
                                    color={accountData.cancelledCheque ? colors.Hard_Black : colors.gray}
                                    size="S"
                                />
                            </Wrapper>
                        </Wrapper>
                    </TouchableOpacity>

                    {/* Show selected image preview only if KYC is NOT done */}
                    {accountData.cancelledCheque && !isKYCDone && (
                        <Wrapper
                            width={responsiveWidth(89)}
                            customStyles={{
                                marginTop: responsiveWidth(2),
                                borderRadius: borderRadius.middleSmall,
                                borderWidth: 1,
                                borderColor: colors.fieldborder,
                                padding: responsiveWidth(2)
                            }}
                        >
                            <Image
                                resizeMode="contain"
                                source={{ uri: getImageUrl('chequeDoc', accountData.cancelledCheque) || '' }}
                                style={{
                                    height: responsiveWidth(25),
                                    width: '100%',
                                    borderRadius: borderRadius.small
                                }}
                            />
                        </Wrapper>
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
                        value={accountData.accountNumber}
                        keyboardType="numeric"
                        onChangeText={(value: string) => {
                            handleBankFormChange('accountNumber', value, accountIndex);
                        }}
                        error={accountErrors.accountNumber}
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
                        value={accountData.ifsc}
                        autoCapitalize="characters"
                        onChangeText={(value: string) => {
                            handleBankFormChange('ifsc', value.toUpperCase(), accountIndex);
                        }}
                        error={accountErrors.ifsc}
                    />

                    {/* Bank Verification Status */}
                    {isVerifyingBank && (
                        <Wrapper row align="center" customStyles={{ marginTop: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                            <ActivityIndicator size="small" color={colors.primary1} />
                            <CusText
                                text="Verifying bank account..."
                                size="S"
                                color={colors.primary1}
                                customStyles={{ marginLeft: responsiveWidth(2) }}
                            />
                        </Wrapper>
                    )}
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
                        value={accountData.accountType}
                        valueField="value"
                        labelField={'label'}
                        onChange={(data: any) => {
                            handleBankFormChange('accountType', data.value, accountIndex);
                        }}
                        onClear={() => {
                            handleBankFormChange('accountType', '', accountIndex);
                        }}
                        error={accountErrors.accountType}
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
                        value={accountData.bankName}
                        valueField="value"
                        labelField={'label'}
                        onChange={(data: any) => {
                            handleBankFormChange('bankName', data.value, accountIndex);
                        }}
                        onClear={() => {
                            handleBankFormChange('bankName', '', accountIndex);
                        }}
                        error={accountErrors.bankName}
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
                        value={accountData.micr}
                        keyboardType="numeric"
                        onChangeText={(value: string) => {
                            handleBankFormChange('micr', value, accountIndex);
                        }}
                        error={accountErrors.micr}
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
                        value={accountData.bankBranch}
                        onChangeText={(value: string) => {
                            handleBankFormChange('bankBranch', value, accountIndex);
                        }}
                        error={accountErrors.bankBranch}
                    />
                </Wrapper>

                {isMultipleAccounts && accountIndex < bankAccounts.length - 1 && (
                    <Wrapper
                        position='center'
                        customStyles={{
                            height: 2,
                            width: responsiveWidth(90),
                            backgroundColor: colors.fieldborder,
                            marginVertical: responsiveWidth(3)
                        }}
                    />
                )}
            </Wrapper>
        );
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

                    {/* Render Bank Account Forms */}
                    {isKYCDone ? (
                        <>
                            {bankAccounts.map((account, index) =>
                                renderBankAccountForm(account, bankErrors[index] || {}, index)
                            )}

                            {/* Add Bank Account Button */}
                            {bankAccounts.length < maxBankAccounts && (
                                <Wrapper position="center" customStyles={{ marginVertical: responsiveWidth(3) }}>
                                    <TouchableOpacity activeOpacity={0.6} onPress={addBankAccount}>
                                        <Wrapper
                                            row
                                            align="center"
                                            justify="center"
                                            width={responsiveWidth(60)}
                                            color={colors.primary1}
                                            customStyles={{
                                                borderRadius: borderRadius.middleSmall,
                                                paddingVertical: responsiveWidth(2.5),
                                                borderWidth: 1,
                                                borderColor: colors.primary1
                                            }}
                                        >
                                            <IonIcon name="add-circle-outline" size={responsiveWidth(5)} color={colors.Hard_White} />
                                            <CusText
                                                position='center'
                                                bold
                                                color={colors.Hard_White}
                                                text={`Add Bank Account (${bankAccounts.length}/${maxBankAccounts})`}
                                                customStyles={{ marginLeft: responsiveWidth(2) }}
                                            />
                                        </Wrapper>
                                    </TouchableOpacity>
                                </Wrapper>
                            )}
                        </>
                    ) : (
                        // Single bank account form for non-KYC users
                        renderBankAccountForm(bankForm, bankError, 0)
                    )}

                    <Spacer y="S" />

                    {/* Next Button */}
                    <Wrapper position='center' row align='center' justify='center' customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={handleNext}>
                            <Wrapper width={responsiveWidth(80)} color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingVertical: responsiveWidth(2.5) }}>

                                {isLoading ? (
                                    <ActivityIndicator color={colors.Hard_White} size="small" />
                                ) : (
                                    <CusText position='center' bold color={colors.Hard_White} text={'Next'} />
                                )}



                            </Wrapper>
                        </TouchableOpacity>
                    </Wrapper>
                    <Spacer y="XXS" />

                    <ImagePickerModal
                        visible={isModalVisible}
                        onClose={() => setModalVisible(false)}
                        onPickImage={handleImagePick}
                        isVideo={false}
                    />
                </ScrollView>

            </Wrapper>
            <CommonModal
                visible={isScanLoading}
                onClose={() => { setIsScanLoading(false) }}
                description={`Scanning Cancelled Cheque...`}
            // button1Text="Continue!"
            // onButton1Press={() => {

            //     checkKycSteps()
            // }}
            // button2Text="Yes"
            // onButton2Press={async () => { deleteGoal(id) }}

            />
        </>
    )
}

export default BankDetails;
