import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CheckKycStatus, CreateKYCInvsSignZy, getOnBoardingListingsApi, updatePersonalDetailApi } from '../../../../api/homeapi';
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
import { getKYC_Details, setKYC_Details, updateObjectKey } from '../../../../utils/Commanutils';
// import DocumentPicker from 'react-native-document-picker';
import ImagePickerModal from '../../../../shared/components/ImagePickerModal';
import CommonModal from '../../../../shared/components/CommonAlert/commonModal';
import API from '../../../../utils/API';

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
        { value: 'Individual', label: 'Individual' },
        { value: 'HUF', label: 'HUF' },
        { value: 'Company', label: 'Company' },
        { value: 'Partnership', label: 'Partnership' }
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
        { value: 'Father', label: 'FATHER' },
        // { value: 'Mother', label: 'Mother' },
        { value: 'Spouse', label: 'SPOUSE' },
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
    const [fileExt, setfileExt] = useState('');
    const [fileError, setFileError] = useState('');

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
        guadian_Mobile: '',
        guadian_Mobile_Relation: '',
        guadian_Email: '',
        guadian_Email_Relation: ''
    });

    const [signZyData, setSignZydata] = useState<any>(null);
    const [onBoardingData, setOnBoardingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPanLoading, setIspanLoading] = useState(false);

    // Check if user is minor based on date of birth
    const checkIfMinor = (dateOfBirth: any) => {
        if (!dateOfBirth) return false;

        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age < 18;
    };

    useEffect(() => {

        kycSignZyStatus();
        getOnBoardingListings();
        setPrefieldData()
    }, [isFocused]);


    const setPrefieldData = () => {
        const basicDetails = getKYC_Details()?.user_basic_details;
        console.log('getKYC_Details() == ...', basicDetails?.relationship_proof)

        setForm({
            ...Form,
            panNumber: basicDetails?.pan_no ? basicDetails?.pan_no : '',
            firstName: basicDetails?.name ? basicDetails?.name : '',
            mobile: basicDetails?.reg_mobile ? basicDetails?.reg_mobile : '',
            email: basicDetails?.reg_email ? basicDetails?.reg_email : '',
            taxStatus: basicDetails?.tax_status ? basicDetails?.tax_status.toString() : '1',
            dateOfBirth: basicDetails?.dob ? new Date(basicDetails?.dob) : '',
            gender: basicDetails?.gender ? basicDetails?.gender.toString() : '',
            title: basicDetails?.father_title ? basicDetails?.father_title : '',
            fatherSpouseName: basicDetails?.fathers_name ? basicDetails?.fathers_name : '',
            relation: basicDetails?.father_relation ? basicDetails?.father_relation : '',
            motherName: basicDetails?.mothers_name ? basicDetails?.mothers_name : '',
            maritalStatus: basicDetails?.marital_status ? basicDetails?.marital_status.toString() : '',
            emailRelation: basicDetails?.email_relation ? basicDetails?.email_relation.toString() : '',
            mobileRelation: basicDetails?.mobile_relation ? basicDetails?.mobile_relation.toString() : '',
            // Guardian fields
            guardian_Name: basicDetails?.guardian_name ? basicDetails?.guardian_name : '',
            guardian_DOB: basicDetails?.guardian_dob ? new Date(basicDetails?.guardian_dob) : 0,
            guardian_PAN: basicDetails?.guardian_pan_no ? basicDetails?.guardian_pan_no : '',
            relationship_Primary_Holder: basicDetails?.relationship_primary ? basicDetails?.relationship_primary.toString() : '',
            guardian_Relation_proof: basicDetails?.relationship_proof ? basicDetails?.relationship_proof.toString() : '',
            guadian_Mobile: basicDetails?.guardian_mobile ? basicDetails?.guardian_mobile : '',
            guadian_Mobile_Relation: basicDetails?.guardian_mobile_relation ? basicDetails?.guardian_mobile_relation.toString() : '',
            guadian_Email: basicDetails?.guardian_email ? basicDetails?.guardian_email : '',
            guadian_Email_Relation: basicDetails?.guardian_email_relation ? basicDetails?.guardian_email_relation.toString() : '',
            // Set panFile if POI consent is true
            panFile: basicDetails?.poiConsent ? basicDetails?.pan_doc : null
        });

        // Set isMinor based on tax_status
        setIsMinor(basicDetails?.tax_status === 2);
    }

    const kycSignZyStatus = async () => {
        try {
            let payload = {
                "username": getKYC_Details()?.user_basic_details?.signzy_user_name,
                "password": getKYC_Details()?.user_basic_details?.signzy_kyc_id
            }


            const [result, error]: any = await CreateKYCInvsSignZy(payload)

            if (result) {
                // console.log('kycSignZyStatus Result : ', result?.data)
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
            setIsLoading(true);
            const [result, error]: any = await getOnBoardingListingsApi();

            if (result?.data) {
                // console.log('getOnBoardingListings Result:', result?.data);
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
            setIsLoading(false);
        }
    };

    const populateDropdownData = (data: any) => {
        try {
            // console.log('API Response Structure:', data);

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
    const validateForm = () => {
        let isValid = true;
        let errors = {
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
            guadian_Mobile: '',
            guadian_Mobile_Relation: '',
            guadian_Email: '',
            guadian_Email_Relation: ''
        };

        // Tax Status validation
        if (!Form.taxStatus) {
            errors.taxStatus = 'Tax Status is required';
            isValid = false;
        }

        // PAN File validation - only if poiConsent is false
        const basicDetails = getKYC_Details()?.user_basic_details;
        if (!basicDetails?.poiConsent && !Form.panFile && !selectedFile) {
            errors.panFile = 'PAN Card upload is required';
            isValid = false;
        }

        // PAN Number validation
        if (!Form.panNumber) {
            errors.panNumber = 'PAN Number is required';
            isValid = false;
        } else if (!panCardRegex.test(Form.panNumber.toUpperCase())) {
            errors.panNumber = 'Please enter a valid PAN Number (e.g., ABCDE1234F)';
            isValid = false;
        }

        // First Name validation
        if (!Form.firstName) {
            errors.firstName = 'Name is required';
            isValid = false;
        } else if (Form.firstName.length < 2) {
            errors.firstName = 'Name must be at least 2 characters';
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(Form.firstName)) {
            errors.firstName = 'Name should contain only letters';
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
        } else if (!mobileRegex.test(Form.mobile)) {
            errors.mobile = 'Please enter a valid 10-digit mobile number';
            isValid = false;
        }

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

        // console.log('Form Errors:', errors);
        setFormErrors(errors);
        return isValid;
    };

    // Handle form submission
    const handleNext = () => {
        if (validateForm()) {
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
        console.log('response', response);
        if (response && response.didCancel !== true) {
            let name = response[0]?.name ? response[0]?.name : response?.assets[0]?.fileName;
            const fileExtension = name.split(".").pop().toLowerCase();
            setfileExt(fileExtension);

            if (allowedExtensions.includes(fileExtension)) {
                const fileData = response[0]?.uri ? response[0] : response?.assets[0];
                setSelectedFile(fileData);

                setForm({
                    ...Form,
                    panFile: response[0]?.uri ? response[0]?.fileCopyUri : response?.assets[0]?.uri
                });
                setFormErrors({ ...formErrors, panFile: '' });
                scanPanCardDetails(fileData)
                // showToast(toastTypes.success, 'File selected successfully');
            } else {
                showToast(toastTypes.error, 'Unsupported file type. Please upload a jpg, jpeg, png or pdf file.');
            }
        }
    };

    const checkKycStatus = async () => {
        try {
            let payload = {
                "pan_no": Form.panNumber,
                "first_name": Form.firstName,
                "last_name": Form.lastName,
                "mobile": Form.mobile
            };
            console.log('KYC Payload : ', payload);

            const [result, error]: any = await CheckKycStatus(payload);
            console.log('Result 1: ', result);
            console.log('error: ', error);

            if (result) {
                console.log('Result : ', result);
                showToast(toastTypes.success, result?.msg);
                setForm({
                    ...Form,
                    panNumber: '',
                    firstName: '',
                    lastName: '',
                    mobile: ''
                });
            } else {
                console.log('checkKycStatus Error : ', error);
                showToast(toastTypes.error, error);
            }
        } catch (error: any) {
            console.log('checkKycStatus Catch Error : ', error);
            showToast(toastTypes.error, error);
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
                let tempName = name.replace(/\s/g, '').replace(/[()]/g, '_');

                const panCardImage = {
                    name: name,
                    type: fileData.type || 'image/jpeg',
                    uri: fileData.uri,
                };

                formData.append("pan_image", panCardImage);
            }

            console.log('Scan PAN Card FormData:', formData);

            const [result, error]: any = await updatePersonalDetailApi(formData);

            if (result) {
                console.log('Scan PAN Card Result:', result);
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
                investor_id: getKYC_Details()?.user_basic_details?.id,
                name: Form.firstName,
                pan_no: Form.panNumber,
                userToken: signZyData?.id,
                synzyuserId: signZyData?.userId,
                kycStatus: false,
                poiConsent: false,
                dob: Form.dateOfBirth ? new Date(Form.dateOfBirth).toISOString().split('T')[0] : null,
                fathers_name: Form.fatherSpouseName,
                father_title: Form.fatherTitle || "Mr.",
                father_relation: Form.relation,
                gender: Form.gender,
                marital_status: Form.maritalStatus,
                member_type: 1,
                mothers_name: Form.motherName,
                last_kyc_step: 2,
                tax_status: Form.taxStatus,
                reg_mobile: Form.mobile,
                mobile_relation: Form.mobileRelation,
                reg_email: Form.email,
                email_relation: Form.emailRelation,
                guardian_pan_no: Form.taxStatus === '2' && Form.guardian_PAN ? Form.guardian_PAN : null,
                guardian_name: Form.taxStatus === '2' && Form.guardian_Name ? Form.guardian_Name : null,
                guardian_dob: Form.taxStatus === '2' && Form.guardian_DOB ? new Date(Form.guardian_DOB).toISOString().split('T')[0] : null,
                relationship_primary: Form.taxStatus === '2' && Form.relationship_Primary_Holder ? Form.relationship_Primary_Holder : null,
                relationship_proof: Form.taxStatus === '2' && Form.guardian_Relation_proof ? Form.guardian_Relation_proof : null,
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
                    const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data);
                    setKYC_Details(update_data);
                    console.log('Save Personal Details Result: ===>>>', getKYC_Details());
                    setSelectedTab('AddressInfo')
                }

                // Navigate to next step
                // navigation.navigate('NextScreen');

            } else {
                console.log('Save Personal Details Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to save personal details');
            }
        } catch (error: any) {
            console.log('Save Personal Details Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while saving personal details');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header menubtn name={'Initial On-Boarding'} />
            <Container Xcenter bgcolor={colors.headerColor}>
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
                            data={taxStatusOptions}
                            placeholder={'Select Tax Status'}
                            placeholdercolor={colors.gray}
                            label="Tax Status *"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                            required
                            value={Form.taxStatus}
                            valueField="value"
                            labelField={'label'}
                            onChange={(data: any) => {
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

                        {/* Upload PAN Card - Only show if poiConsent is false */}
                        {!getKYC_Details()?.user_basic_details?.poiConsent && (
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

                                        <TouchableOpacity activeOpacity={0.7}>
                                            <CusText
                                                text="view"
                                                size='S'
                                                color={colors.action}
                                                customStyles={{ textDecorationLine: 'underline' }}
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
                        )}

                        {/* PAN Number */}
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

                        {/* Name As PAN */}
                        <InputField
                            label="Name As PAN *"
                            width={responsiveWidth(87)}
                            placeholder="Enter Name As PAN"
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
                            data={genderOptions}
                            placeholder={'Select Gender'}
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
                            data={relationOptions}
                            placeholder={'Select Relation'}
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
                            data={maritalStatusOptions}
                            placeholder={'Select Marital Status'}
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
                        <InputField
                            label="Email *"
                            width={responsiveWidth(87)}
                            placeholder="Enter Email Address"
                            value={Form.email}
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

                        <Spacer y='XS' />

                        {/* Email Relation */}
                        <DropDown
                            data={emailRelationOptions}
                            placeholder={'Select Email Relation'}
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
                        <InputField
                            label="Mobile *"
                            width={responsiveWidth(87)}
                            placeholder="Enter Mobile Number"
                            value={Form.mobile}
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

                        <Spacer y='XS' />

                        {/* Mobile Relation */}
                        <DropDown
                            data={mobileRelationOptions}
                            placeholder={'Select Mobile Relation'}
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
                                    data={guardianRelationOptions}
                                    placeholder={'Select Relationship'}
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
                                    data={relationshipProofOptions}
                                    placeholder={'Select Relation Proof'}
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
                                    data={mobileRelationOptions}
                                    placeholder={'Select Guardian Mobile Relation'}
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
                                    data={emailRelationOptions}
                                    placeholder={'Select Guardian Email Relation'}
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
                    <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
                        <Wrapper
                            position='center'
                            color={colors.primary}
                            customStyles={{
                                borderRadius: borderRadius.medium,
                                paddingVertical: responsiveHeight(1.5),
                                paddingHorizontal: responsiveHeight(3),
                            }}
                        >
                            <CusText color={colors.Hard_White} size='MS' bold text={'Next'} />
                        </Wrapper>
                    </TouchableOpacity>
                </Wrapper>
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
            <ImagePickerModal
                visible={isModalVisible}
                onClose={toggleModal}
                onPickImage={handleImagePick}
                isVideo={false}
            />
        </>
    )
}
export default PersonalInfo;
