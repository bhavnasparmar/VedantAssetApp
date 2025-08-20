import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, Alert, ActivityIndicator, BackHandler } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CheckKycStatus, CreateKYCInvsSignZy, getOnBoardingListingsApi, getPersonalInfoApi, updatePersonalDetailApi, ValidateStatus } from '../../../../api/homeapi';
import { showToast, toastTypes } from '../../../../services/toastService';
import Header from '../../../../shared/components/Header/Header';
import Container from '../../../../ui/container';
import Wrapper from '../../../../ui/wrapper';
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../../../styles/variables';
import CusText from '../../../../ui/custom-text';
import InputField from '../../../../ui/InputField';
import DropDown from '../../../../ui/dropdown';
import Spacer from '../../../../ui/spacer';
import DateTimePicker from '../../../../ui/datetimePicker';
// import DateTimePicker from '../../../../ui/DateTimePicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { getImageUrl, getKYC_Details, getKYC_ISMember, setKYC_Details, updateObjectKey, USER_DATA } from '../../../../utils/Commanutils';
// import DocumentPicker from 'react-native-document-picker';
import ImagePickerModal from '../../../../shared/components/ImagePickerModal';
import CommonModal from '../../../../shared/components/CommonAlert/commonModal';
import API from '../../../../utils/API';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import PanOTPverify from '../../../../shared/components/OtpVerify/panotpverify';
import { get } from 'lodash';
import LoadingModal from '../../../../shared/components/CommonModal/LoadingModal';

const PersonalInfo = ({ setSelectedTab }: any) => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute();

    const [Form, setForm] = useState<any>({
        taxStatus: '1',
        panNumber: '',
        firstName: '',
        dateOfBirth: 0,
        gender: '',
        title: '',
        fatherSpouseName: '',
        mobile: '',
        mobileRelation: '',
        email: '',
        emailRelation: '',
        panFile: null,
        relation: '',
        motherName: '',
        maritalStatus: '',
        guardian_Name: "",
        guardian_DOB: 0,
        guardian_PAN: "",
        relationship_Primary_Holder: "",
        guardian_Relation_proof: "",
        guadian_Mobile: "",
        guadian_Mobile_Relation: "",
        guadian_Email: "",
        guadian_Email_Relation: ""
    });

    const [taxStatusOptions, setTaxStatusOptions] = useState([
    ]);

    const [genderOptions, setGenderOptions] = useState([
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
    ]);

    const [mobileRelationOptions, setMobileRelationOptions] = useState([
        { value: 'Self', label: 'Self' },
        { value: 'Father', label: 'Father' },
        { value: 'Mother', label: 'Mother' },
        { value: 'Spouse', label: 'Spouse' },
        { value: 'Other', label: 'Other' }
    ]);

    const [emailRelationOptions, setEmailRelationOptions] = useState([
        { value: 'Self', label: 'Self' },
        { value: 'Father', label: 'Father' },
        { value: 'Mother', label: 'Mother' },
        { value: 'Spouse', label: 'Spouse' },
        { value: 'Other', label: 'Other' }
    ]);

    const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
    const [relationshipProofOptions, setRelationshipProofOptions] = useState([]);
    const [bankProofOptions, setBankProofOptions] = useState([]);
    const [identityTypeOptions, setIdentityTypeOptions] = useState([]);
    const [nomineeGuardianRelationOptions, setNomineeGuardianRelationOptions] = useState([]);
    const [relationOptions, setRelationOptions] = useState([
        { value: 'FATHER', label: 'FATHER' },
        // { value: 'Mother', label: 'Mother' },
        { value: 'SPOUSE', label: 'SPOUSE' },
        // { value: 'Self', label: 'Self' },
        // { value: 'Other', label: 'Other' }
    ]);

    const [guardianRelationOptions, setGuardianRelationOptions] = useState([
        { value: 'Father', label: 'Father' },
        { value: 'Mother', label: 'Mother' },
        { value: 'Guardian', label: 'Guardian' },
        { value: 'Other', label: 'Other' }
    ]);

    const [guardianRelationProofOptions, setGuardianRelationProofOptions] = useState([
        { value: 'Birth Certificate', label: 'Birth Certificate' },
        { value: 'Adoption Certificate', label: 'Adoption Certificate' },
        { value: 'Court Order', label: 'Court Order' },
        { value: 'Other', label: 'Other' }
    ]);

    const [isModalVisible, setModalVisible] = useState(false);
    const [isMinor, setIsMinor] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [taxStatus, setTaxStatus] = useState<any>('Individual');
    const [fileExt, setfileExt] = useState('');
    const [fileError, setFileError] = useState('');
    const [selectedRelationProofFile, setSelectedRelationProofFile] = useState<any>(null);
    const [isRelationProofUpload, setIsRelationProofUpload] = useState(false);

    // Add validation state
    const [formErrors, setFormErrors] = useState({
        taxStatus: '',
        panFile: '',
        panNumber: '',
        firstName: '',
        dateOfBirth: '',
        gender: '',
        title: '',
        fatherSpouseName: '',
        email: '',
        emailRelation: '',
        mobile: '',
        mobileRelation: '',
        relation: '',
        motherName: '',
        maritalStatus: '',
        guardian_Name: '',
        guardian_DOB: '',
        guardian_PAN: '',
        relationship_Primary_Holder: '',
        guardian_Relation_proof: '',
        guardian_Relation_proof_doc: '',
        guadian_Mobile: '',
        guadian_Mobile_Relation: '',
        guadian_Email: '',
        guadian_Email_Relation: ''
    });

    const [signZyData, setSignZydata] = useState<any>(null);
    const [onBoardingData, setOnBoardingData] = useState<any>(null);
    const [isPPLoading, setIsPPLoading] = useState(false);
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPanLoading, setIspanLoading] = useState(false);
    const [apiPersonalData, setApiPersonalData] = useState<any>(null);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [panImageUrl, setPanImageUrl] = useState('');

    const [isMobileEdit, setIsMobileEdit] = useState<boolean>(false);
    const [isEmailEdit, setIsEmailEdit] = useState<boolean>(false);
    const [userPayload, setUserPayload] = useState<any>({});
    const [visible, setVisible] = useState(false);
    const [isPersonalInfoLoading, setIsPersonalInfoLoading] = useState(false);

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
        console.log('IS Menber : ', getKYC_ISMember())

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


        getOnBoardingListings();
        getPersonalInfo(); // This will now handle setting the form data
    }, [isFocused]);




    const setPrefieldDataFromAPI = async (apiData: any) => {


        const data: any = await AsyncStorage.getItem(USER_DATA);
        const parsedData: any = JSON.parse(data)

        setForm({
            ...Form,
            panNumber: apiData?.pan_no || '',
            panFile: apiData?.pan_doc || null,
            firstName: apiData?.name || '',
            mobile: apiData?.reg_mobile || parsedData?.mobile,
            email: apiData?.reg_email || parsedData?.email,
            taxStatus: apiData?.tax_status ? apiData?.tax_status.toString() : '1',
            dateOfBirth: apiData?.dob ? new Date(apiData?.dob) : '',
            gender: apiData?.gender ? apiData?.gender.toString() : '',
            title: apiData?.father_title || '',
            fatherSpouseName: apiData?.fathers_name || '',
            relation: apiData?.father_relation || '',
            motherName: apiData?.mothers_name || '',
            maritalStatus: apiData?.marital_status ? apiData?.marital_status.toString() : '',
            emailRelation: apiData?.email_relation ? apiData?.email_relation.toString() : '',
            mobileRelation: apiData?.mobile_relation ? apiData?.mobile_relation.toString() : '',
            // Guardian fields
            guardian_Name: apiData?.guardian_name || '',
            guardian_DOB: apiData?.guardian_dob ? new Date(apiData?.guardian_dob) : 0,
            guardian_PAN: apiData?.guardian_pan_no || '',
            relationship_Primary_Holder: apiData?.relationship_primary ? apiData?.relationship_primary.toString() : '',
            guardian_Relation_proof: apiData?.relationship_proof ? apiData?.relationship_proof.toString() : '',
            guadian_Mobile: apiData?.guardian_mobile || '',
            guadian_Mobile_Relation: apiData?.guardian_mobile_relation ? apiData?.guardian_mobile_relation.toString() : '',
            guadian_Email: apiData?.guardian_email || '',
            guadian_Email_Relation: apiData?.guardian_email_relation ? apiData?.guardian_email_relation.toString() : ''
        });

        // Set PAN image URL if document exists
        if (apiData?.pan_doc) {
            const imageUrl: any = getImageUrl('panDoc', apiData.pan_doc);
            setPanImageUrl(imageUrl);
        }

        // Set isMinor based on tax_status
        if (apiData?.tax_status === 2) {
            setIsMinor(apiData?.tax_status === 2);
            setTaxStatus('Individual')
        } else {
            if (apiData?.tax_status) {
                setIsMinor(false);
                setTaxStatus('Minor')
            }


        }


    }

    const kycSignZyStatus = async () => {
        try {
            let payload = {
                "username": getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.signzy_user_name : getKYC_Details()?.user_basic_details?.signzy_user_name,
                "password": getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.signzy_kyc_id : getKYC_Details()?.user_basic_details?.signzy_kyc_id
            }

            console.log('kycSignZyStatus payload : ', payload)

            const [result, error]: any = await CreateKYCInvsSignZy(payload)

            if (result) {
                console.log('kycSignZyStatus Result : ', result?.data)
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
            setIsPPLoading(true);
            const [result, error]: any = await getOnBoardingListingsApi();

            if (result?.data) {

                setOnBoardingData(result?.data);

                // Populate dropdowns from API response
                populateDropdownData(result?.data);
            } else {
                console.log('getOnBoardingListings Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch onboarding data');
            }
        } catch (error: any) {
            console.log('getOnBoardingListings Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching onboarding data');
        } finally {
            setIsPPLoading(false);
        }
    };

    const populateDropdownData = (data: any) => {
        try {


            // Populate Tax Status options
            if (data?.tax_status && Array.isArray(data.tax_status)) {
                const taxStatusData = data.tax_status.map((item: any) => ({
                    value: item.id,
                    label: item.status
                }));
                setTaxStatusOptions(taxStatusData);
            }

            // Populate Gender options
            if (data?.gender && Array.isArray(data.gender)) {
                const genderData = data.gender.map((item: any) => ({
                    value: item.id,
                    label: item.gender
                }));
                setGenderOptions(genderData);
            }

            // Populate Mobile Relation options and use same for Email Relation
            if (data?.mobile_relation && Array.isArray(data.mobile_relation)) {
                const relationData = data.mobile_relation.map((item: any) => ({
                    value: item.id,
                    label: item.relation
                }));
                setMobileRelationOptions(relationData);
                setEmailRelationOptions(relationData); // Use same data for email relation
            }

            // Populate Marital Status options
            if (data?.marital_status && Array.isArray(data.marital_status)) {
                const maritalStatusData = data.marital_status.map((item: any) => ({
                    value: item.id,
                    label: item.status
                }));
                setMaritalStatusOptions(maritalStatusData);
            }

            // Populate Relationship Proof options
            if (data?.relationship_proof && Array.isArray(data.relationship_proof)) {
                const relationshipProofData = data.relationship_proof.map((item: any) => ({
                    value: item.id,
                    label: item.type
                }));
                setRelationshipProofOptions(relationshipProofData);
            }

            // Populate Guardian Relation options for Relationship with Primary Holder
            if (data?.relationship_primaryHolder && Array.isArray(data.relationship_primaryHolder)) {
                const guardianRelationData = data.relationship_primaryHolder.map((item: any) => ({
                    value: item.id,
                    label: item.relationship
                }));
                setGuardianRelationOptions(guardianRelationData);
            }

            // Populate Bank Proof options
            if (data?.bank_proof && Array.isArray(data.bank_proof)) {
                const bankProofData = data.bank_proof.map((item: any) => ({
                    value: item.mfu_code.toString(),
                    label: item.bank_proof
                }));
                setBankProofOptions(bankProofData);
            }

            // Populate Identity Type options
            if (data?.identity_type_list && Array.isArray(data.identity_type_list)) {
                const identityTypeData = data.identity_type_list.map((item: any) => ({
                    value: item.mfu_code,
                    label: item.type
                }));
                setIdentityTypeOptions(identityTypeData);
            }

            // Populate Nominee Guardian Relationship options
            if (data?.nominee_guardian_relationship_types && Array.isArray(data.nominee_guardian_relationship_types)) {
                const nomineeGuardianData = data.nominee_guardian_relationship_types.map((item: any) => ({
                    value: item.mfu_code,
                    label: item.relationship
                }));
                setNomineeGuardianRelationOptions(nomineeGuardianData);
            }

        } catch (error) {
            console.log('Error populating dropdown data:', error);
            // Keep default values if API fails
        }
    };

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panCardRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    // Validation function
    const validatePersonalDetails = () => {
        let errors: any = {};
        let isValid = true;

        // Check if mobile or email edit is pending
        if (isEmailEdit) {
            showToast('info', 'Email Verification Required')
            return false;
        }

        if (isMobileEdit) {
            showToast('info', 'Mobile Verification Required')
            return false;
        }

        // Tax Status validation
        if (!Form.taxStatus) {
            errors.taxStatus = 'Tax Status is required';
            isValid = false;
        }

        // PAN File validation - only if KYC is not done, poiConsent is false and not Minor (taxStatus !== '2')
        const basicDetails = getKYC_Details()?.user_basic_details;
        const memberDetails = getKYC_Details()?.member_basic_details;
        const isKYCDone = basicDetails?.isKYCDone || memberDetails?.isKYCDone;
        const hasPoiConsent = basicDetails?.poiConsent || memberDetails?.poiConsent;

        if (!isKYCDone && !hasPoiConsent && !Form.panFile && !selectedFile && Form.taxStatus !== '2') {
            errors.panFile = 'PAN Card upload is required';
            isValid = false;
        }

        // PAN Number validation - only if not Minor (taxStatus !== '2')
        if (Form.taxStatus !== '2') {
            if (!Form.panNumber) {
                errors.panNumber = 'PAN Number is required';
                isValid = false;
            } else if (!panCardRegex.test(Form.panNumber.toUpperCase())) {
                errors.panNumber = 'Please enter a valid PAN Number (e.g., ABCDE1234F)';
                isValid = false;
            }
        }

        // First Name validation
        if (!Form.firstName) {
            errors.firstName = Form.taxStatus === '2' ? 'Name is required' : 'Name is required';
            isValid = false;
        } else if (Form.firstName.length < 2) {
            errors.firstName = Form.taxStatus === '2' ? 'Name must be at least 2 characters' : 'Name must be at least 2 characters';
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(Form.firstName)) {
            errors.firstName = Form.taxStatus === '2' ? 'Name should contain only letters' : 'Name should contain only letters';
            isValid = false;
        }

        // Date of Birth validation
        if (!Form.dateOfBirth) {
            errors.dateOfBirth = 'Date of Birth is required';
            isValid = false;
        } else {
            const today = new Date();
            const birthDate = new Date(Form.dateOfBirth);
            let age: any = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18) {
                errors.dateOfBirth = 'You must be at least 18 years old';
                isValid = false;
            } else if (age > 100) {
                errors.dateOfBirth = 'Please enter a valid date of birth';
                isValid = false;
            }
        }

        // Gender validation
        if (!Form.gender) {
            errors.gender = 'Gender is required';
            isValid = false;
        }
        // Title Name validation
        if (!Form.title) {
            errors.title = 'Title is required';
            isValid = false;
        }

        // Spouse Name validation
        if (!Form.fatherSpouseName) {
            errors.fatherSpouseName = 'Father/SpouseName is required';
            isValid = false;
        } else if (Form.fatherSpouseName.length < 2) {
            errors.fatherSpouseName = 'Father/SpouseName must be at least 2 characters';
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(Form.fatherSpouseName)) {
            errors.fatherSpouseName = 'Father/SpouseName should contain only letters';
            isValid = false;
        }

        // Mobile validation
        if (!Form.mobile) {
            errors.mobile = 'Mobile number is required';
            isValid = false;
        }
        //  else if (!mobileRegex.test(Form.mobile)) {
        //     errors.mobile = 'Please enter a valid 10-digit mobile number';
        //     isValid = false;
        // }

        // Mobile Relation validation
        if (!Form.mobileRelation) {
            errors.mobileRelation = 'Mobile Relation is required';
            isValid = false;
        }

        // Email validation
        if (!Form.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(Form.email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        } else if (Form.email.length > 50) {
            errors.email = 'Email must be less than 50 characters';
            isValid = false;
        }

        // Email Relation validation
        if (!Form.emailRelation) {
            errors.emailRelation = 'Email Relation is required';
            isValid = false;
        }

        // Relation validation
        if (!Form.relation) {
            errors.relation = 'Relation is required';
            isValid = false;
        }

        // Mother's Name validation
        if (!Form.motherName) {
            errors.motherName = 'Mother\'s Name is required';
            isValid = false;
        }

        // Marital Status validation
        if (!Form.maritalStatus) {
            errors.maritalStatus = 'Marital Status is required';
            isValid = false;
        }

        // Guardian validation - only if tax status is '2' (Minor)
        if (Form.taxStatus === '2') {
            // Guardian Name validation
            if (!Form.guardian_Name) {
                errors.guardian_Name = 'Guardian Name is required';
                isValid = false;
            } else if (Form.guardian_Name.length < 2) {
                errors.guardian_Name = 'Guardian Name must be at least 2 characters';
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(Form.guardian_Name)) {
                errors.guardian_Name = 'Guardian Name should contain only letters';
                isValid = false;
            }

            // Guardian PAN validation
            if (!Form.guardian_PAN) {
                errors.guardian_PAN = 'Guardian PAN Number is required';
                isValid = false;
            } else if (!panCardRegex.test(Form.guardian_PAN.toUpperCase())) {
                errors.guardian_PAN = 'Please enter a valid PAN Number (e.g., ABCDE1234F)';
                isValid = false;
            }

            // Guardian DOB validation
            if (!Form.guardian_DOB) {
                errors.guardian_DOB = 'Guardian Date of Birth is required';
                isValid = false;
            } else {
                const today = new Date();
                const guardianBirthDate = new Date(Form.guardian_DOB);
                let guardianAge: any = today.getFullYear() - guardianBirthDate.getFullYear();
                const monthDiff = today.getMonth() - guardianBirthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < guardianBirthDate.getDate())) {
                    guardianAge--;
                }

                if (guardianAge < 18) {
                    errors.guardian_DOB = 'Guardian must be at least 18 years old';
                    isValid = false;
                } else if (guardianAge > 100) {
                    errors.guardian_DOB = 'Please enter a valid date of birth';
                    isValid = false;
                }
            }

            // Relationship Primary Holder validation
            if (!Form.relationship_Primary_Holder) {
                errors.relationship_Primary_Holder = 'Relationship with Primary Holder is required';
                isValid = false;
            }

            // Guardian Relation Proof validation
            if (!Form.guardian_Relation_proof) {
                errors.guardian_Relation_proof = 'Guardian Relation Proof is required';
                isValid = false;
            }

            // Guardian Relation Proof Document validation
            if (!Form.guardian_Relation_proof_doc && !selectedRelationProofFile) {
                errors.guardian_Relation_proof_doc = 'Relationship Proof Document is required';
                isValid = false;
            }

            // Guardian Mobile validation
            if (!Form.guadian_Mobile) {
                errors.guadian_Mobile = 'Guardian Mobile number is required';
                isValid = false;
            } else if (!mobileRegex.test(Form.guadian_Mobile)) {
                errors.guadian_Mobile = 'Please enter a valid 10-digit mobile number';
                isValid = false;
            }

            // Guardian Mobile Relation validation
            if (!Form.guadian_Mobile_Relation) {
                errors.guadian_Mobile_Relation = 'Guardian Mobile Relation is required';
                isValid = false;
            }

            // Guardian Email validation
            if (!Form.guadian_Email) {
                errors.guadian_Email = 'Guardian Email is required';
                isValid = false;
            } else if (!emailRegex.test(Form.guadian_Email)) {
                errors.guadian_Email = 'Please enter a valid email address';
                isValid = false;
            } else if (Form.guadian_Email.length > 50) {
                errors.guadian_Email = 'Email must be less than 50 characters';
                isValid = false;
            }

            // Guardian Email Relation validation
            if (!Form.guadian_Email_Relation) {
                errors.guadian_Email_Relation = 'Guardian Email Relation is required';
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    // Handle form submission
    const handleNext = () => {
        if (validatePersonalDetails()) {
            // Save personal details instead of checking KYC status
            savePersonalDetails();
        } else {
            showToast(toastTypes.error, 'Please fill all required fields correctly');
        }
    };


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleImagePick = (response: any) => {
        const allowedExtensions = ["jpg", "jpeg"];

        if (response && response.didCancel !== true) {
            let name = response[0]?.name ? response[0]?.name : response?.assets[0]?.fileName;
            const fileExtension = name.split(".").pop().toLowerCase();
            setfileExt(fileExtension);

            if (allowedExtensions.includes(fileExtension)) {
                const fileData = response[0]?.uri ? response[0] : response?.assets[0];

                // Check if this is for relation proof document
                if (isRelationProofUpload) {
                    setSelectedRelationProofFile(fileData);
                    setForm({
                        ...Form,
                        guardian_Relation_proof_doc: response[0]?.uri ? response[0]?.fileCopyUri : response?.assets[0]?.uri
                    });
                    setFormErrors({ ...formErrors, guardian_Relation_proof_doc: '' });
                    setIsRelationProofUpload(false);
                } else {
                    // Original PAN card logic
                    setSelectedFile(fileData);
                    setForm({
                        ...Form,
                        panFile: response[0]?.uri ? response[0]?.fileCopyUri : response?.assets[0]?.uri
                    });
                    setFormErrors({ ...formErrors, panFile: '' });
                    scanPanCardDetails(fileData);
                }
            } else {
                showToast(toastTypes.error, 'Unsupported file type. Please upload a jpg, jpeg, png or pdf file.');
            }
        }
    };



    const scanPanCardDetails = async (fileData: any) => {
        try {
            setIspanLoading(true);

            let formData = new FormData();

            let passObj: any = {
                request_type: "updateSignZy",
                userToken: signZyData?.id,
                synzyuserId: signZyData?.userId,
                pan_no: Form.panNumber,
                investor_id: getKYC_Details()?.user_basic_details?.id,
            };
            formData.append("formData", JSON.stringify(passObj));
            // Add PAN card image if available
            if (fileData) {
                const name = fileData.fileName || fileData.name;
                // let tempName = name.replace(/\s/g, '').replace(/[()]/g, '_');

                const panCardImage = {
                    name: name,
                    type: fileData.type || 'image/jpeg',
                    uri: fileData.uri,
                };

                formData.append("pan_image", panCardImage);
            }

            console.log('Scan PAN Card FormData:', formData);

            const [result, error]: any = await updatePersonalDetailApi(formData);
            console.log('Scan PAN Card Result:', result);
            if (result) {

                showToast(toastTypes.success, result?.msg || 'PAN card details scanned successfully');

                // Update form with scanned details from kycbody
                if (result?.data?.kycbody) {
                    const kycData = result.data.kycbody;

                    // Format date from ISO string to timestamp
                    let dobTimestamp = 0;
                    if (kycData.dob) {
                        dobTimestamp = new Date(kycData.dob).getTime();
                    }

                    setForm({
                        ...Form,
                        firstName: kycData.name || Form.firstName,
                        panNumber: kycData.pan_no || Form.panNumber,
                        dateOfBirth: dobTimestamp || Form.dateOfBirth,
                        fatherSpouseName: kycData.fathers_name || Form.fatherSpouseName,
                    });

                    // Clear any related errors
                    setFormErrors({
                        ...formErrors,
                        firstName: '',
                        panNumber: '',
                        dateOfBirth: '',
                        fatherSpouseName: ''
                    });
                }
            } else {
                console.log('Scan PAN Card Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to scan PAN card details');
            }
        } catch (error: any) {
            console.log('Scan PAN Card Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while scanning PAN card');
        } finally {
            setIspanLoading(false);
        }
    };

    const savePersonalDetails = async () => {
        try {
            setIsLoading(true);
            let formData = new FormData();
            let payload = {
                investor_id: getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.id : getKYC_Details()?.user_basic_details?.id,
                user_id: getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.user_id : getKYC_Details()?.user_basic_details?.user_id,
                taxStatus: taxStatus,
                name: Form.firstName,
                pan_no: Form.panNumber,
                ...(getKYC_Details()?.user_basic_details?.isKYCDone || getKYC_Details()?.member_basic_details?.isKYCDone ? {} : {
                    userToken: signZyData?.id,
                    synzyuserId: signZyData?.userId,
                }),
                kycStatus: getKYC_Details()?.user_basic_details?.isKYCDone || getKYC_Details()?.member_basic_details?.isKYCDone ? true : false,
                poiConsent: getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.poiConsent : !getKYC_Details()?.user_basic_details?.poiConsent ? false : true,
                dob: Form.dateOfBirth ? new Date(Form.dateOfBirth).toISOString().split('T')[0] : null,
                fathers_name: Form.fatherSpouseName,
                father_title: Form.fatherTitle || "Mr.",
                father_relation: Form.relation,
                gender: Form.gender,
                marital_status: Form.maritalStatus,
                member_type: getKYC_ISMember() ? 2 : 1,
                mothers_name: Form.motherName,
                last_kyc_step: 2,
                tax_status: Form.taxStatus.toString(),
                reg_mobile: Form.mobile,
                mobile_relation: Form.mobileRelation,
                reg_email: Form.email,
                email_relation: Form.emailRelation,
                guardian_pan_no: Form.taxStatus === '2' && Form.guardian_PAN ? Form.guardian_PAN : null,
                guardian_name: Form.taxStatus === '2' && Form.guardian_Name ? Form.guardian_Name : null,
                guardian_dob: Form.taxStatus === '2' && Form.guardian_DOB ? new Date(Form.guardian_DOB).toISOString().split('T')[0] : null,
                relationship_primary: Form.taxStatus === '2' && Form.relationship_Primary_Holder ? Form.relationship_Primary_Holder : null,
                relationship_proof: Form.taxStatus === '2' && Form.guardian_Relation_proof ? Form.guardian_Relation_proof : null,
                relationship_proof_document: Form.taxStatus === '2' && Form.guardian_Relation_proof_doc ? Form.guardian_Relation_proof_doc : null,
                guardian_mobile: Form.taxStatus === '2' && Form.guadian_Mobile ? Form.guadian_Mobile : null,
                guardian_mobile_relation: Form.taxStatus === '2' && Form.guadian_Mobile_Relation ? Form.guadian_Mobile_Relation : null,
                guardian_email: Form.taxStatus === '2' && Form.guadian_Email ? Form.guadian_Email : null,
                guardian_email_relation: Form.taxStatus === '2' && Form.guadian_Email_Relation ? Form.guadian_Email_Relation : null,
                request_type: "updatePOI"
            };
            formData.append("formData", JSON.stringify(payload));
            console.log('Save Personal Details Payload:  ', payload);



            const [result, error]: any = await updatePersonalDetailApi(formData);

            if (result) {
                console.log('Save Personal Details Result:', result);
                showToast(toastTypes.success, result?.msg || 'Personal details saved successfully');

                // Update KYC details if needed
                if (result?.data) {
                    if (getKYC_ISMember()) {
                        const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'member_basic_details', result?.data);
                        setKYC_Details(update_data);
                    } else {
                        const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data);
                        setKYC_Details(update_data);
                    }
                    setSelectedTab('AddressInfo')
                }


            } else {
                console.log('Save Personal Details Error:', error);
                console.log('Save Personal Details Error:', result);
                showToast(toastTypes.error, error?.data?.err?.message || 'Failed to save personal details');
            }
        } catch (error: any) {
            console.log('Save Personal Details Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while saving personal details');
        } finally {
            setIsLoading(false);
        }
    };

    const getPersonalInfo = async () => {
        try {
            setIsPersonalInfoLoading(true);

            const id: any = getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.id : getKYC_Details()?.user_basic_details?.id

            const [result, error]: any = await getPersonalInfoApi(id);

            if (result?.data) {
                console.log('getPersonalInfo Result:', result?.data);
                setApiPersonalData(result.data);
                // Call setPrefieldData after getting API data
                setPrefieldDataFromAPI(result.data);
            } else {
                console.log('getPersonalInfo Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch personal info');
            }
        } catch (error: any) {
            console.log('getPersonalInfo Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching personal info');
        } finally {
            setIsPersonalInfoLoading(false);
        }
    };

    const validateData = async (type: any) => {
        try {
            if (isEmailEdit && (Form?.email === '' || Form.email === undefined)) {
                showToast('info', 'Please Enter Email')
                return
            }
            if (isMobileEdit && (Form?.mobile === '' || Form.mobile === undefined)) {
                showToast('info', 'Please Enter Mobile')
                return
            }


            const data: any = await AsyncStorage.getItem(USER_DATA);
            const parsedData: any = JSON.parse(data)

            let payload: any = {
                email: apiPersonalData?.reg_email || parsedData?.email,
                mobile: apiPersonalData?.reg_mobile || parsedData?.mobile,
                emailFlag: type === 'email' ? true : false,
                mobileFlag: type === 'mobile' ? true : false,
                reg_email: Form?.email,
                reg_mobile: Form?.mobile
            }

            const [result, error]: any = await ValidateStatus(payload)

            if (result) {
                showToast(toastTypes.success, result?.msg)
                payload.otp = result?.data?.kyc_mobile_otp ? result?.data?.kyc_mobile_otp : result?.data?.kyc_email_otp;
                setUserPayload(payload)
                setTimeout(() => {
                    setVisible(true)
                }, 1000);
            } else {
                console.log('validateData Status Error : ', error)
                showToast(toastTypes.error, error?.msg)
            }
        } catch (error: any) {
            console.log('validateData Status Catch Error : ', error)
            showToast(toastTypes.error, error)
        }
    }

    return (
        <>
            <Header menubtn name={'Initial On-Boarding'} />
            <Container Xcenter bgcolor={colors.headerColor} noscroll>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    // style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: responsiveHeight(10) }}
                        // style={{ backgroundColor: colors.red }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Wrapper
                            color={colors.Hard_White}
                            position='center'
                            width={responsiveWidth(95)}
                            // height={responsiveHeight(85)}
                            customStyles={{
                                borderRadius: borderRadius.medium,
                                paddingHorizontal: responsiveWidth(4),
                                paddingVertical: responsiveHeight(2)
                            }}
                        >
                            {/* Header Section */}
                            <Wrapper customStyles={{ paddingVertical: responsiveHeight(0) }}>
                                <CusText size='SS' semibold text={'Initiate On-boarding'} color={colors.black} />
                            </Wrapper>

                            <Wrapper
                                position='center'
                                customStyles={{
                                    height: 1,
                                    width: responsiveWidth(87),
                                    backgroundColor: colors.fieldborder,
                                    marginVertical: responsiveHeight(1)
                                }}
                            />

                            <Wrapper customStyles={{ paddingVertical: responsiveHeight(1) }}>
                                <CusText text={'Personal Info'} size='MS' medium color={colors.black} />
                            </Wrapper>

                            <Spacer y='XXS' />
                            {/* Form Section */}

                            <Wrapper customStyles={{}}>

                                {/* Tax Status */}
                                <DropDown
                                    data={isPPLoading ? [] : taxStatusOptions}
                                    placeholder={isPPLoading ? 'Loading...' : 'Select Tax Status'}
                                    placeholdercolor={colors.gray}
                                    label="Tax Status *"
                                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                    required
                                    value={Form.taxStatus}
                                    valueField="value"
                                    labelField={'label'}
                                    onChange={(data: any) => {
                                        setTaxStatus(data.label)
                                        setForm({ ...Form, taxStatus: data.value });
                                        setFormErrors({ ...formErrors, taxStatus: '' });

                                        // Check if tax status is '2' (Minor) to show guardian fields
                                        setIsMinor(data.value === '2');
                                    }}
                                    onClear={() => {
                                        setForm({ ...Form, taxStatus: '' });
                                        setIsMinor(false);
                                    }}
                                />
                                {formErrors.taxStatus ? (
                                    <CusText text={formErrors.taxStatus} size='XXS' color={colors.red}
                                        customStyles={{ marginTop: responsiveHeight(0.5) }} />
                                ) : null}

                                <Spacer y='XS' />

                                {/* Upload PAN Card - Only show if KYC is not done, not Minor and poiConsent is false */}
                                {/* {!getKYC_Details()?.user_basic_details?.isKYCDone &&
                                 !getKYC_Details()?.member_basic_details?.isKYCDone &&
                                    // (!getKYC_Details()?.user_basic_details?.poiConsent || !getKYC_Details()?.member_basic_details?.poiConsent) && Form.taxStatus !== '2' && (
                                    (!getKYC_Details()?.user_basic_details?.poiConsent || !getKYC_Details()?.member_basic_details?.poiConsent)  && (
                                        <>
                                            <Wrapper>
                                                <Wrapper align='center' row justify='apart'>
                                                    <CusText
                                                        text="Upload PAN Card *"
                                                        size='SS'
                                                        medium
                                                        color={colors.Hard_Black}
                                                        customStyles={{
                                                            fontSize: fontSize.semiSmall,
                                                            marginBottom: responsiveHeight(0.5)
                                                        }}
                                                    />

                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        onPress={() => {
                                                            if (Form.panFile || apiPersonalData?.pan_doc) {
                                                                setIsViewModalVisible(true);
                                                            }
                                                        }}
                                                    >
                                                        <CusText
                                                            text="view"
                                                            size='S'
                                                            color={colors.action}
                                                            customStyles={{
                                                                textDecorationLine: 'underline',
                                                                opacity: (Form.panFile || apiPersonalData?.pan_doc) ? 1 : 0.5
                                                            }}
                                                        />
                                                    </TouchableOpacity>
                                                </Wrapper>

                                                <Wrapper
                                                    row
                                                    align='center'
                                                    justify='apart'
                                                    customStyles={{
                                                        borderWidth: 1,
                                                        borderColor: formErrors.panFile ? colors.error : 'rgba(152, 162, 179, 1)',
                                                        borderRadius: borderRadius.middleSmall,
                                                        paddingHorizontal: responsiveWidth(3),
                                                        paddingVertical: responsiveHeight(1.2),
                                                        backgroundColor: colors.Hard_White
                                                    }}
                                                >
                                                    <CusText
                                                        text={selectedFile ? selectedFile.name || selectedFile.fileName || 'File selected' : 'No file chosen'}
                                                        size='S'
                                                        color={selectedFile ? colors.Hard_Black : colors.gray}
                                                    />

                                                    <Wrapper row align='center'>
                                                        <TouchableOpacity
                                                            onPress={() => setModalVisible(true)}
                                                            activeOpacity={0.7}
                                                            style={{
                                                                backgroundColor: colors.primary,
                                                                paddingHorizontal: responsiveWidth(4),
                                                                paddingVertical: responsiveHeight(0.8),
                                                                borderRadius: borderRadius.small,
                                                                marginRight: selectedFile ? responsiveWidth(2) : 0
                                                            }}
                                                        >
                                                            <CusText
                                                                text="Choose File"
                                                                size='XS'
                                                                color={colors.Hard_White}
                                                                medium
                                                            />
                                                        </TouchableOpacity>

                                                        {selectedFile && (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setSelectedFile(null);
                                                                    setForm({ ...Form, panFile: null });
                                                                    setFormErrors({ ...formErrors, panFile: '' });
                                                                    showToast(toastTypes.info, 'File removed');
                                                                }}
                                                                activeOpacity={0.7}
                                                                style={{
                                                                    padding: responsiveWidth(2),
                                                                    marginRight: responsiveWidth(2)
                                                                }}
                                                            >
                                                                <IonIcon
                                                                    name="close-circle"
                                                                    size={20}
                                                                    color={colors.error}
                                                                />
                                                            </TouchableOpacity>
                                                        )}
                                                    </Wrapper>
                                                </Wrapper>

                                                {formErrors.panFile ? (
                                                    <CusText
                                                        text={formErrors.panFile}
                                                        size='XXS'
                                                        color={colors.red}
                                                        customStyles={{ marginTop: responsiveHeight(0.5) }}
                                                    />
                                                ) : null}
                                            </Wrapper>

                                            <Spacer y='XS' />
                                        </>
                                    )} */}

                                {
                                    (getKYC_ISMember() ? !getKYC_Details()?.member_basic_details?.isKYCDone : !getKYC_Details()?.user_basic_details?.isKYCDone) && (getKYC_ISMember() ? !getKYC_Details()?.member_basic_details?.poiConsent : !getKYC_Details()?.user_basic_details?.poiConsent) && taxStatus !== "Minor" ?
                                        <>
                                            <Wrapper>
                                                <Wrapper align='center' row justify='apart'>
                                                    <CusText
                                                        text="Upload PAN Card *"
                                                        size='SS'
                                                        medium
                                                        color={colors.Hard_Black}
                                                        customStyles={{
                                                            fontSize: fontSize.semiSmall,
                                                            marginBottom: responsiveHeight(0.5)
                                                        }}
                                                    />

                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        onPress={() => {
                                                            if (Form.panFile || apiPersonalData?.pan_doc) {
                                                                setIsViewModalVisible(true);
                                                            }
                                                        }}
                                                    >
                                                        <CusText
                                                            text="view"
                                                            size='S'
                                                            color={colors.action}
                                                            customStyles={{
                                                                textDecorationLine: 'underline',
                                                                opacity: (Form.panFile || apiPersonalData?.pan_doc) ? 1 : 0.5
                                                            }}
                                                        />
                                                    </TouchableOpacity>
                                                </Wrapper>

                                                <Wrapper
                                                    row
                                                    align='center'
                                                    justify='apart'
                                                    customStyles={{
                                                        borderWidth: 1,
                                                        borderColor: formErrors.panFile ? colors.error : 'rgba(152, 162, 179, 1)',
                                                        borderRadius: borderRadius.middleSmall,
                                                        paddingHorizontal: responsiveWidth(3),
                                                        paddingVertical: responsiveHeight(1.2),
                                                        backgroundColor: colors.Hard_White
                                                    }}
                                                >
                                                    <CusText
                                                        text={selectedFile ? selectedFile.name || selectedFile.fileName || 'File selected' : 'No file chosen'}
                                                        size='S'
                                                        color={selectedFile ? colors.Hard_Black : colors.gray}
                                                    />

                                                    <Wrapper row align='center'>
                                                        <TouchableOpacity
                                                            onPress={() => setModalVisible(true)}
                                                            activeOpacity={0.7}
                                                            style={{
                                                                backgroundColor: colors.primary,
                                                                paddingHorizontal: responsiveWidth(4),
                                                                paddingVertical: responsiveHeight(0.8),
                                                                borderRadius: borderRadius.small,
                                                                marginRight: selectedFile ? responsiveWidth(2) : 0
                                                            }}
                                                        >
                                                            <CusText
                                                                text="Choose File"
                                                                size='XS'
                                                                color={colors.Hard_White}
                                                                medium
                                                            />
                                                        </TouchableOpacity>

                                                        {selectedFile && (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setSelectedFile(null);
                                                                    setForm({ ...Form, panFile: null });
                                                                    setFormErrors({ ...formErrors, panFile: '' });
                                                                    showToast(toastTypes.info, 'File removed');
                                                                }}
                                                                activeOpacity={0.7}
                                                                style={{
                                                                    padding: responsiveWidth(2),
                                                                    marginRight: responsiveWidth(2)
                                                                }}
                                                            >
                                                                <IonIcon
                                                                    name="close-circle"
                                                                    size={20}
                                                                    color={colors.error}
                                                                />
                                                            </TouchableOpacity>
                                                        )}
                                                    </Wrapper>
                                                </Wrapper>

                                                {formErrors.panFile ? (
                                                    <CusText
                                                        text={formErrors.panFile}
                                                        size='XXS'
                                                        color={colors.red}
                                                        customStyles={{ marginTop: responsiveHeight(0.5) }}
                                                    />
                                                ) : null}
                                            </Wrapper>

                                            <Spacer y='XS' />
                                        </>
                                        : <></>
                                }



                                {/* PAN Number - Only show if not Minor */}
                                {Form.taxStatus !== '2' && (
                                    <>
                                        <InputField
                                            label="PAN *"
                                            width={responsiveWidth(87)}
                                            placeholder="Enter PAN Number"
                                            value={Form.panNumber}
                                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                            fieldViewStyle={{
                                                borderColor: 'rgba(152, 162, 179, 1)',
                                                borderRadius: borderRadius.middleSmall
                                            }}
                                            onChangeText={(value: string) => {
                                                setForm({ ...Form, panNumber: value });
                                                setFormErrors({ ...formErrors, panNumber: '' });
                                            }}
                                            borderColor={colors.fieldborder}
                                            error={formErrors.panNumber}
                                        />
                                        <Spacer y='XS' />
                                    </>
                                )}

                                {/* Name As PAN / Name - Change label based on tax status */}
                                <InputField
                                    label={Form.taxStatus === '2' ? "Name *" : "Name As PAN *"}
                                    width={responsiveWidth(87)}
                                    placeholder={Form.taxStatus === '2' ? "Enter Name" : "Enter Name As PAN"}
                                    value={Form.firstName}
                                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                    fieldViewStyle={{
                                        borderColor: 'rgba(152, 162, 179, 1)',
                                        borderRadius: borderRadius.middleSmall
                                    }}
                                    onChangeText={(value: string) => {
                                        setForm({ ...Form, firstName: value });
                                        setFormErrors({ ...formErrors, firstName: '' });
                                    }}
                                    borderColor={colors.fieldborder}
                                    error={formErrors.firstName}
                                />

                                <Spacer y='XS' />

                                {/* Date of Birth */}
                                <Wrapper>
                                    {/* <DateTimePicker
                                maximum={new Date()}
                                label='Date of Birth *'
                                value={Form.dateOfBirth || undefined}
                                iconColor={colors.black}
                                borderColor={formErrors.dateOfBirth ? colors.error : 'rgba(152, 162, 179, 1)'}
                                bgColor={colors.Hard_White}
                                placeholder="DD-MM-YYYY"
                                formatFunction={(date: Date) => {
                                    const day = date.getDate().toString().padStart(2, '0');
                                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                    const year = date.getFullYear();
                                    return `${day}-${month}-${year}`;
                                }}
                                customStyle={{
                                    borderRadius: borderRadius.small,
                                    width: responsiveWidth(87)
                                }}
                                labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                setValue={(value: Date) => {
                                    setForm({ ...Form, dateOfBirth: value });
                                    setFormErrors({ ...formErrors, dateOfBirth: '' });
                                }}
                            /> */}
                                    <DateTimePicker
                                        label="Date of Birth"
                                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                        maximum={new Date()}
                                        value={Form.dateOfBirth ? new Date(Form.dateOfBirth) : undefined}
                                        iconColor={colors.black}
                                        width={responsiveWidth(90)}
                                        borderColor={colors.gray}
                                        customStyle={{
                                            borderRadius: borderRadius.small,
                                            width: responsiveWidth(87)
                                        }}
                                        setValue={(value: Date) => {
                                            setForm({ ...Form, dateOfBirth: value });
                                            setFormErrors({ ...formErrors, dateOfBirth: '' });
                                        }}
                                    />
                                    {/* {formErrors.dateOfBirth ? (
                                <CusText text={formErrors.dateOfBirth} size='XXS' color={colors.error}
                                    customStyles={{ marginTop: responsiveHeight(0.5) }} />
                            ) : null} */}
                                </Wrapper>

                                <Spacer y='XS' />

                                {/* Gender */}
                                <DropDown
                                    data={isPPLoading ? [] : genderOptions}
                                    placeholder={isPPLoading ? 'Loading...' : 'Select Gender'}
                                    placeholdercolor={colors.gray}
                                    label="Gender *"
                                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                    required
                                    value={Form.gender}
                                    valueField="value"
                                    labelField={'label'}
                                    onChange={(data: any) => {
                                        setForm({ ...Form, gender: data.value });
                                        setFormErrors({ ...formErrors, gender: '' });
                                    }}
                                    onClear={() => {
                                        setForm({ ...Form, gender: '' });
                                    }}
                                    error={formErrors.gender}
                                />


                                <Spacer y='XS' />

                                {/* Title and Father/Spouse Name in one row */}
                                <Wrapper row justify='apart' align='center' width={responsiveWidth(87)}>
                                    {/* Title Dropdown */}
                                    <DropDown
                                        data={[
                                            { value: 'Mr.', label: 'Mr.' },
                                            { value: 'Miss.', label: 'Miss.' }
                                        ]}
                                        placeholder={'Select Title'}
                                        placeholdercolor={colors.gray}
                                        label="Title *"
                                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                        required
                                        value={Form.title}
                                        valueField="value"
                                        labelField={'label'}
                                        width={responsiveWidth(30)}
                                        onChange={(data: any) => {
                                            setForm({ ...Form, title: data.value });
                                            setFormErrors({ ...formErrors, title: '' });
                                        }}
                                        onClear={() => {
                                            setForm({ ...Form, title: '' });
                                        }}
                                        error={formErrors.title}
                                    />

                                    {/* Father/Spouse Name Input */}
                                    <InputField
                                        label="Father/Spouse Name *"
                                        width={responsiveWidth(53)}
                                        placeholder="Enter Name"
                                        value={Form.fatherSpouseName}
                                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                        fieldViewStyle={{
                                            borderColor: 'rgba(152, 162, 179, 1)',
                                            borderRadius: borderRadius.middleSmall
                                        }}
                                        onChangeText={(value: string) => {
                                            setForm({ ...Form, fatherSpouseName: value });
                                            setFormErrors({ ...formErrors, fatherSpouseName: '' });
                                        }}
                                        borderColor={colors.fieldborder}
                                        error={formErrors.fatherSpouseName}
                                    />
                                </Wrapper>

                                {/* Error messages for the new fields */}
                                {/* {formErrors.title ? (
                            <CusText text={formErrors.title} size='XXS' color={colors.error}
                                customStyles={{ marginTop: responsiveHeight(0.5) }} />
                        ) : null} */}

                                <Spacer y='XS' />

                                {/* Relation */}
                                <DropDown
                                    data={isPPLoading ? [] : relationOptions}
                                    placeholder={isPPLoading ? 'Loading...' : 'Select Relation'}
                                    placeholdercolor={colors.gray}
                                    label="Relation *"
                                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                    required
                                    value={Form.relation}
                                    valueField="value"
                                    labelField={'label'}
                                    onChange={(data: any) => {
                                        setForm({ ...Form, relation: data.value });
                                        setFormErrors({ ...formErrors, relation: '' });
                                    }}
                                    onClear={() => {
                                        setForm({ ...Form, relation: '' });
                                    }}
                                    error={formErrors.relation}
                                />


                                <Spacer y='XS' />

                                {/* Mother's Name */}
                                <InputField
                                    label="Mother's Name *"
                                    width={responsiveWidth(87)}
                                    placeholder="Enter Mother's Name"
                                    value={Form.motherName}
                                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                    fieldViewStyle={{
                                        borderColor: formErrors.motherName ? colors.error : 'rgba(152, 162, 179, 1)',
                                        borderRadius: borderRadius.middleSmall
                                    }}
                                    onChangeText={(value: string) => {
                                        setForm({ ...Form, motherName: value });
                                        setFormErrors({ ...formErrors, motherName: '' });
                                    }}
                                    borderColor={formErrors.motherName ? colors.error : colors.fieldborder}
                                    error={formErrors.motherName}
                                />

                                <Spacer y='XS' />

                                {/* Marital Status */}
                                <DropDown
                                    data={isPPLoading ? [] : maritalStatusOptions}
                                    placeholder={isPPLoading ? 'Loading...' : 'Select Marital Status'}
                                    placeholdercolor={colors.gray}
                                    label="Marital Status *"
                                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                    required
                                    value={Form.maritalStatus}
                                    valueField="value"
                                    labelField={'label'}
                                    onChange={(data: any) => {
                                        setForm({ ...Form, maritalStatus: data.value });
                                        setFormErrors({ ...formErrors, maritalStatus: '' });
                                    }}
                                    onClear={() => {
                                        setForm({ ...Form, maritalStatus: '' });
                                    }}
                                    error={formErrors.maritalStatus}
                                />

                                <Spacer y='XS' />
                                {/* Email */}
                                <Wrapper row align='end' customStyles={{ gap: responsiveWidth(1) }}>
                                    <InputField
                                        label="Email *"
                                        width={isEmailEdit ? responsiveWidth(55) : responsiveWidth(75)}
                                        placeholder="Enter Email Address"
                                        value={Form.email}
                                        editable={isEmailEdit ? true : false}
                                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                        fieldViewStyle={{
                                            borderColor: formErrors.email ? colors.error : 'rgba(152, 162, 179, 1)',
                                            borderRadius: borderRadius.middleSmall
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        onChangeText={(value: string) => {
                                            setForm({ ...Form, email: value.toLowerCase().trim() });
                                            setFormErrors({ ...formErrors, email: '' });
                                        }}
                                        borderColor={formErrors.email ? colors.error : colors.fieldborder}
                                        error={formErrors.email}
                                    />
                                    {
                                        isEmailEdit ?
                                            <>
                                                <TouchableOpacity activeOpacity={0.6} onPress={() => { validateData('email') }}>
                                                    <Wrapper color={colors.orange} height={responsiveWidth(11)} justify='center' width={responsiveWidth(18)} customStyles={{ borderRadius: borderRadius.medium }}>
                                                        <CusText color={colors.Hard_White} size='MS' medium position='center' text={'Validate'} />
                                                    </Wrapper>
                                                </TouchableOpacity>
                                            </>
                                            :
                                            null
                                    }
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => { setIsEmailEdit(!isEmailEdit), setIsMobileEdit(false) }}>
                                        <Wrapper color={colors.orange} customStyles={{ padding: responsiveWidth(2.5), borderRadius: borderRadius.medium }}>
                                            <IonIcon name={isEmailEdit ? 'close' : 'pencil'} color={colors.Hard_White} size={responsiveWidth(5.5)} />
                                        </Wrapper>
                                    </TouchableOpacity>
                                </Wrapper>

                                <Spacer y='XS' />

                                {/* Email Relation */}
                                <DropDown
                                    data={isPPLoading ? [] : emailRelationOptions}
                                    placeholder={isPPLoading ? 'Loading...' : 'Select Email Relation'}
                                    placeholdercolor={colors.gray}
                                    label="Email Relation *"
                                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                    required
                                    value={Form.emailRelation}
                                    valueField="value"
                                    labelField={'label'}
                                    onChange={(data: any) => {
                                        setForm({ ...Form, emailRelation: data.value });
                                        setFormErrors({ ...formErrors, emailRelation: '' });
                                    }}
                                    onClear={() => {
                                        setForm({ ...Form, emailRelation: '' });
                                    }}
                                    error={formErrors.emailRelation}
                                />

                                <Spacer y='XS' />

                                {/* Mobile */}
                                <Wrapper row align='end' customStyles={{ gap: responsiveWidth(1) }}>
                                    <InputField
                                        label="Mobile *"
                                        width={isMobileEdit ? responsiveWidth(55) : responsiveWidth(75)}
                                        placeholder="Enter Mobile Number"
                                        value={Form.mobile}
                                        editable={isMobileEdit ? true : false}
                                        labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                        fieldViewStyle={{
                                            borderColor: formErrors.mobile ? colors.error : 'rgba(152, 162, 179, 1)',
                                            borderRadius: borderRadius.middleSmall
                                        }}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        onChangeText={(value: string) => {
                                            setForm({ ...Form, mobile: value });
                                            setFormErrors({ ...formErrors, mobile: '' });
                                        }}
                                        borderColor={formErrors.mobile ? colors.error : colors.fieldborder}
                                        error={formErrors.mobile}
                                    />
                                    {
                                        isMobileEdit ?
                                            <>
                                                <TouchableOpacity activeOpacity={0.6} onPress={() => { validateData('mobile') }}>
                                                    <Wrapper color={colors.orange} height={responsiveWidth(11)} justify='center' width={responsiveWidth(18)} customStyles={{ borderRadius: borderRadius.medium }}>
                                                        <CusText color={colors.Hard_White} size='MS' medium position='center' text={'Validate'} />
                                                    </Wrapper>
                                                </TouchableOpacity>
                                            </>
                                            :
                                            null
                                    }
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => { setIsMobileEdit(!isMobileEdit), setIsEmailEdit(false) }}>
                                        <Wrapper color={colors.orange} customStyles={{ padding: responsiveWidth(2.5), borderRadius: borderRadius.medium }}>
                                            <IonIcon name={isMobileEdit ? 'close' : 'pencil'} color={colors.Hard_White} size={responsiveWidth(5.5)} />
                                        </Wrapper>
                                    </TouchableOpacity>
                                </Wrapper>

                                <Spacer y='XS' />

                                {/* Mobile Relation */}
                                <DropDown
                                    data={isPPLoading ? [] : mobileRelationOptions}
                                    placeholder={isPPLoading ? 'Loading...' : 'Select Mobile Relation'}
                                    placeholdercolor={colors.gray}
                                    label="Mobile Relation *"
                                    labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                    required
                                    value={Form.mobileRelation}
                                    valueField="value"
                                    labelField={'label'}
                                    onChange={(data: any) => {
                                        setForm({ ...Form, mobileRelation: data.value });
                                        setFormErrors({ ...formErrors, mobileRelation: '' });
                                    }}
                                    onClear={() => {
                                        setForm({ ...Form, mobileRelation: '' });
                                    }}
                                    error={formErrors.mobileRelation}
                                />


                                {/* <TouchableOpacity
                            onPress={scanPanCardDetails}
                            disabled={!selectedFile || !Form.panNumber || isPanLoading}
                            activeOpacity={0.7}
                            style={{
                                backgroundColor: (!selectedFile || !Form.panNumber || isPanLoading)
                                    ? colors.gray
                                    : colors.primary,
                                paddingHorizontal: responsiveWidth(3),
                                paddingVertical: responsiveHeight(1),
                                borderRadius: borderRadius.small,
                                marginLeft: responsiveWidth(2),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {isPanLoading ? (
                                <ActivityIndicator size="small" color={colors.Hard_White} />
                            ) : (
                                <CusText
                                    text="Scan"
                                    size='S'
                                    color={colors.Hard_White}
                                />
                            )}
                        </TouchableOpacity> */}

                                <Spacer y='XS' />

                                {/* Guardian Fields - Only show if tax status is '2' (Minor) */}
                                {Form.taxStatus === '2' && (
                                    <>
                                        {/* Guardian Name */}
                                        <InputField
                                            label="Guardian Name *"
                                            width={responsiveWidth(87)}
                                            placeholder="Enter Guardian Name"
                                            value={Form.guardian_Name}
                                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                            fieldViewStyle={{
                                                borderColor: 'rgba(152, 162, 179, 1)',
                                                borderRadius: borderRadius.middleSmall
                                            }}
                                            onChangeText={(value: string) => {
                                                setForm({ ...Form, guardian_Name: value });
                                                setFormErrors({ ...formErrors, guardian_Name: '' });
                                            }}
                                            borderColor={colors.fieldborder}
                                            error={formErrors.guardian_Name}
                                        />

                                        <Spacer y='XS' />

                                        {/* Guardian PAN Number */}
                                        <InputField
                                            label="Guardian PAN Number *"
                                            width={responsiveWidth(87)}
                                            placeholder="Enter Guardian PAN Number"
                                            value={Form.guardian_PAN}
                                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                            fieldViewStyle={{
                                                borderColor: 'rgba(152, 162, 179, 1)',
                                                borderRadius: borderRadius.middleSmall
                                            }}
                                            onChangeText={(value: string) => {
                                                setForm({ ...Form, guardian_PAN: value.toUpperCase() });
                                                setFormErrors({ ...formErrors, guardian_PAN: '' });
                                            }}
                                            borderColor={colors.fieldborder}
                                            error={formErrors.guardian_PAN}
                                            autoCapitalize="characters"
                                            maxLength={10}
                                        />

                                        <Spacer y='XS' />

                                        {/* Guardian Date of Birth */}
                                        <DateTimePicker
                                            label="Guardian Date of Birth *"
                                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                            maximum={new Date()}
                                            value={Form.guardian_DOB ? new Date(Form.guardian_DOB) : undefined}
                                            iconColor={colors.black}
                                            width={responsiveWidth(90)}
                                            borderColor={colors.gray}
                                            customStyle={{
                                                borderRadius: borderRadius.small,
                                                width: responsiveWidth(87)
                                            }}
                                            setValue={(value: Date) => {
                                                setForm({ ...Form, guardian_DOB: value });
                                                setFormErrors({ ...formErrors, guardian_DOB: '' });
                                            }}
                                        />
                                        {formErrors.guardian_DOB ? (
                                            <CusText text={formErrors.guardian_DOB} size='XXS' color={colors.red}
                                                customStyles={{ marginTop: responsiveHeight(0.5) }} />
                                        ) : null}

                                        <Spacer y='XS' />

                                        {/* Relationship with Primary Holder */}
                                        <DropDown
                                            data={isPPLoading ? [] : guardianRelationOptions}
                                            placeholder={isPPLoading ? 'Loading...' : 'Select Relationship'}
                                            placeholdercolor={colors.gray}
                                            label="Relationship with Primary Holder *"
                                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                            required
                                            value={Form.relationship_Primary_Holder}
                                            valueField="value"
                                            labelField={'label'}
                                            onChange={(data: any) => {
                                                setForm({ ...Form, relationship_Primary_Holder: data.value });
                                                setFormErrors({ ...formErrors, relationship_Primary_Holder: '' });
                                            }}
                                            onClear={() => {
                                                setForm({ ...Form, relationship_Primary_Holder: '' });
                                            }}
                                            error={formErrors.relationship_Primary_Holder}
                                        />

                                        <Spacer y='XS' />

                                        {/* Guardian Relation Proof */}
                                        <DropDown
                                            data={isPPLoading ? [] : relationshipProofOptions}
                                            placeholder={isPPLoading ? 'Loading...' : 'Select Relation Proof'}
                                            placeholdercolor={colors.gray}
                                            label="Guardian Relation Proof *"
                                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                            required
                                            value={Form.guardian_Relation_proof}
                                            valueField="value"
                                            labelField={'label'}
                                            onChange={(data: any) => {
                                                setForm({ ...Form, guardian_Relation_proof: data.value });
                                                setFormErrors({ ...formErrors, guardian_Relation_proof: '' });
                                            }}
                                            onClear={() => {
                                                setForm({ ...Form, guardian_Relation_proof: '' });
                                            }}
                                            error={formErrors.guardian_Relation_proof}
                                        />

                                        <Spacer y='XS' />

                                        {/* Upload Relationship Proof Document */}
                                        <Wrapper customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(0), gap: responsiveWidth(1) }}>
                                            <Wrapper row align="center" justify="apart">
                                                <CusText size="SS" medium text={'Upload Relationship'} />
                                                <CusText size="SS" text={'View'} />
                                            </Wrapper>
                                            <TouchableOpacity onPress={() => {
                                                setIsRelationProofUpload(true);
                                                setModalVisible(true);
                                            }}>
                                                <Wrapper row customStyles={{ borderRadius: borderRadius.middleSmall, borderColor: colors.fieldborder, borderWidth: 1 }}>
                                                    <Wrapper color={colors.fieldborder} customStyles={{ paddingVertical: responsiveWidth(3), paddingHorizontal: responsiveWidth(2) }}>
                                                        <CusText text={'Choose File'} />
                                                    </Wrapper>
                                                    <Wrapper justify='center' customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                                                        <CusText text={selectedRelationProofFile ? (selectedRelationProofFile.name || selectedRelationProofFile.fileName || 'File selected') : 'No file chosen'} />
                                                    </Wrapper>
                                                </Wrapper>
                                            </TouchableOpacity>
                                            {formErrors.guardian_Relation_proof_doc ? <CusText text={formErrors.guardian_Relation_proof_doc} size='S' color={colors.error} /> : null}
                                        </Wrapper>

                                        <Spacer y='XS' />

                                        {/* Guardian Mobile */}
                                        <InputField
                                            label="Guardian Mobile *"
                                            width={responsiveWidth(87)}
                                            placeholder="Enter Guardian Mobile Number"
                                            value={Form.guadian_Mobile}
                                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                            fieldViewStyle={{
                                                borderColor: 'rgba(152, 162, 179, 1)',
                                                borderRadius: borderRadius.middleSmall
                                            }}
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                            onChangeText={(value: string) => {
                                                setForm({ ...Form, guadian_Mobile: value });
                                                setFormErrors({ ...formErrors, guadian_Mobile: '' });
                                            }}
                                            borderColor={colors.fieldborder}
                                            error={formErrors.guadian_Mobile}
                                        />

                                        <Spacer y='XS' />

                                        {/* Guardian Mobile Relation */}
                                        <DropDown
                                            data={isPPLoading ? [] : mobileRelationOptions}
                                            placeholder={isPPLoading ? 'Loading...' : 'Select Guardian Mobile Relation'}
                                            placeholdercolor={colors.gray}
                                            label="Guardian Mobile Relation *"
                                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                            required
                                            value={Form.guadian_Mobile_Relation}
                                            valueField="value"
                                            labelField={'label'}
                                            onChange={(data: any) => {
                                                setForm({ ...Form, guadian_Mobile_Relation: data.value });
                                                setFormErrors({ ...formErrors, guadian_Mobile_Relation: '' });
                                            }}
                                            onClear={() => {
                                                setForm({ ...Form, guadian_Mobile_Relation: '' });
                                            }}
                                            error={formErrors.guadian_Mobile_Relation}
                                        />

                                        <Spacer y='XS' />

                                        {/* Guardian Email */}
                                        <InputField
                                            label="Guardian Email *"
                                            width={responsiveWidth(87)}
                                            placeholder="Enter Guardian Email Address"
                                            value={Form.guadian_Email}
                                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                                            fieldViewStyle={{
                                                borderColor: 'rgba(152, 162, 179, 1)',
                                                borderRadius: borderRadius.middleSmall
                                            }}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            onChangeText={(value: string) => {
                                                setForm({ ...Form, guadian_Email: value.toLowerCase().trim() });
                                                setFormErrors({ ...formErrors, guadian_Email: '' });
                                            }}
                                            borderColor={colors.fieldborder}
                                            error={formErrors.guadian_Email}
                                        />

                                        <Spacer y='XS' />

                                        {/* Guardian Email Relation */}
                                        <DropDown
                                            data={isPPLoading ? [] : emailRelationOptions}
                                            placeholder={isPPLoading ? 'Loading...' : 'Select Guardian Email Relation'}
                                            placeholdercolor={colors.gray}
                                            label="Guardian Email Relation *"
                                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                                            required
                                            value={Form.guadian_Email_Relation}
                                            valueField="value"
                                            labelField={'label'}
                                            onChange={(data: any) => {
                                                setForm({ ...Form, guadian_Email_Relation: data.value });
                                                setFormErrors({ ...formErrors, guadian_Email_Relation: '' });
                                            }}
                                            onClear={() => {
                                                setForm({ ...Form, guadian_Email_Relation: '' });
                                            }}
                                            error={formErrors.guadian_Email_Relation}
                                        />

                                        <Spacer y='XS' />
                                    </>
                                )}
                            </Wrapper>
                            <Spacer y='XS' />

                            {/* Next Button */}
                            <Wrapper position='center' row align='center' justify='center' customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                                <TouchableOpacity activeOpacity={0.6} onPress={handleNext}>
                                    <Wrapper width={responsiveWidth(80)} color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingVertical: responsiveWidth(2.5) }}>

                                        {
                                            isLoading ?
                                                <Wrapper>
                                                    <ActivityIndicator
                                                        color={colors.Hard_White}
                                                        size={fontSize.normal}
                                                    />
                                                </Wrapper> :
                                                <CusText position='center' bold color={colors.Hard_White} text={'Next'} />
                                        }


                                    </Wrapper>
                                </TouchableOpacity>
                            </Wrapper>
                            <Spacer y="XXS" />
                        </Wrapper>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Container>
            <CommonModal
                visible={isPanLoading}
                onClose={() => { setIspanLoading(false) }}
                description={`Processing Pan Card..`}
            // button1Text="Continue!"
            // onButton1Press={() => {

            //     checkKycSteps()
            // }}
            // button2Text="Yes"
            // onButton2Press={async () => { deleteGoal(id) }}

            />
            <LoadingModal
                visible={isPersonalInfoLoading}
                message="Please wait..."
            />
            <ImagePickerModal
                visible={isModalVisible}
                onClose={toggleModal}
                onPickImage={handleImagePick}
                isVideo={false}
            />
            <CommonModal
                visible={isViewModalVisible}
                onClose={() => setIsViewModalVisible(false)}
                title="PAN Card Document"
                imageSource={{ uri: panImageUrl }}
            />
            <PanOTPverify
                visible={visible}
                setVisible={(value: any) => {
                    setVisible(value)
                    if (!value) {
                        setIsEmailEdit(false)
                        setIsMobileEdit(false)
                    }
                }}
                seteditType={(value: any) => ''}
                userdata={userPayload}
                title={userPayload?.emailFlag ? 'Email address' : 'Mobile Number'}
            />
        </>
    )
}
export default PersonalInfo;
