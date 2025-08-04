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
import { CreateKYCInvsSignZy, getAddressInfoApi, getAddressTypeApi, getAllCountryApi, getAllStateByCountryApi, getOnBoardingListingsApi, getPersonalInfoApi, updateAddressDetailApi } from "../../../../api/homeapi";
import { showToast, toastTypes } from "../../../../services/toastService";
import API from "../../../../utils/API";
import ImagePickerModal from "../../../../shared/components/ImagePickerModal";

const AddressDetails = ({ setSelectedTab }: any) => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const [isModalVisible, setModalVisible] = useState(false);
    const [photo, setPhoto] = useState(0); // 0: permanent front, 1: permanent back, 2: corr front, 3: corr back
    const [adharFront, setAdharFront] = useState<any>(null);
    const [adharBack, setAdharBack] = useState<any>(null);
    const [corrAdharFront, setCorrAdharFront] = useState<any>(null);
    const [corrAdharBack, setCorrAdharBack] = useState<any>(null);
    const [doc_HolderName, setDoc_HolderName] = useState<any>(null);
    const [Form, setForm] = useState<any>({
        adharFront: '',
        adharBack: '',
        poaNumber: '',
        address1: '',
        address2: '',
        addressType: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        District: '',
    });
    const [FormAddress2, setFormAddress2] = useState<any>({
        adharFront: '',
        adharBack: '',
        poaNumber: '',
        address1: '',
        address2: '',
        addressType: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        District: '',
    });
    const [FormAddress2Error, setFormAddress2Error] = useState<any>({
        adharFront: '',
        adharBack: '',
        poaNumber: '',
        address1: '',
        address2: '',
        addressType: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        District: '',
    });
    const [addressType, setAddressType] = useState([]);
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [stateCorr, setStateCorr] = useState([]);
    const [city, setCity] = useState([]);
    const [signZyData, setSignZydata] = useState<any>(null);
    const [showAadharUpload, setShowAadharUpload] = useState(true);
    const [sameAsPermanent, setSameAsPermanent] = useState(false);
    const [FormError, setFormError] = useState<any>({
        adharFront: '',
        adharBack: '',
        poaNumber: '',
        address1: '',
        addressType: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        District: '',
    });

    const handleFormAddress2Change = (values: any) => {
        const { key, value } = values;
        setFormAddress2((prev: any) => ({ ...prev, [key]: value }));
        // Clear error when user starts typing
        setFormAddress2Error((prev: any) => ({ ...prev, [key]: '' }));
    };

    const getStateCorrByCountry = async (countryId: any) => {
        try {
            const [result, error]: any = await getAllStateByCountryApi(countryId);

            if (result?.data) {
                console.log('getStateCorr Result:', result?.data);
                const stateData = result.data.map((item: any) => ({
                    value: item.id,
                    label: item.name
                }));
                setStateCorr(stateData);
            } else {
                console.log('getStateCorr Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch states');
            }
        } catch (error: any) {
            console.log('getStateCorr Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching states');
        }
    };

    useEffect(() => {
        setPrefieldData()
        kycSignZyStatus();
        getOnBoardingListings();
        getAddressType();
        getPersonalInfo();
        getCountry();
        getAddressInfo();
    }, [isFocused])

    const getAddressType = async () => {
        try {
            const [result, error]: any = await getAddressTypeApi();

            if (result?.data) {

                const addressTypeData = result.data.map((item: any) => ({
                    value: item.id,
                    label: item.address_type
                }));
                setAddressType(addressTypeData);
            } else {
                console.log('getAddressType Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch address types');
            }
        } catch (error: any) {
            console.log('getAddressType Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching address types');
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
                    setForm({
                        ...Form,
                        address1: apiData?.address1 || '',
                        address2: apiData?.address2 || '',
                        addressType: apiData?.addressType || '',
                        country: apiData?.country || '',
                        state: apiData?.state || '',
                        city: apiData?.city || '',
                        pincode: apiData?.pincode || '',
                        District: apiData?.District || '',
                        paoNumber: apiData?.paoNumber || ''
                    });
                } else {
                    console.log('getPersonalInfo Error:', error);
                }
            }
        } catch (error: any) {
            console.log('getPersonalInfo Catch Error:', error);
        }
    };

    const setPrefieldData = () => {
        const basicDetails = getKYC_Details()?.user_basic_details;
        console.log('getKYC_Details() == ...', basicDetails)
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

            const [result, error]: any = await getOnBoardingListingsApi();

            if (result?.data) {
                console.log('getOnBoardingListings Result:', result?.data);
                // populateDropdownData(result?.data);
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
                    setShowAadharUpload(!apiData?.poaConsent);
                    console.log('getAddressInfo API Data:', apiData?.doc_no);
                    console.log('getAddressInfo API Data:', apiData);
                    // Set same as permanent address toggle
                    setSameAsPermanent(apiData?.same_as_permanent || false);
                    setDoc_HolderName(apiData?.doc_holder_name || '');
                    setForm({
                        ...Form,
                        poaNumber: apiData?.doc_no || '',
                        address1: apiData?.address1 || '',
                        address2: apiData?.address2 || '',
                        addressType: apiData?.address_type !== null ? apiData?.address_type.toString() : '',
                        country: apiData?.country_id.toString() || '',
                        state: apiData?.state_id || '',
                        city: apiData?.city || '',
                        pincode: apiData?.pincode.toString() || '',
                        District: apiData?.district || '',
                    });

                    // If country is selected, load states
                    if (apiData?.country_id) {
                        getState(apiData.country_id);
                    }
                } else {
                    console.log('getAddressInfo Error:', error);
                }
            }
        } catch (error: any) {
            console.log('getAddressInfo Catch Error:', error);
        }
    };

    // const populateDropdownData = (data: any) => {
    //     try {
    //         // console.log('API Response Structure:', data);

    //         // Populate Tax Status options
    //         if (data?.tax_status && Array.isArray(data.tax_status)) {
    //             const taxStatusData = data.tax_status.map((item: any) => ({
    //                 value: item.id,
    //                 label: item.status
    //             }));
    //             setTaxStatusOptions(taxStatusData);
    //         }

    //         // Populate Gender options
    //         if (data?.gender && Array.isArray(data.gender)) {
    //             const genderData = data.gender.map((item: any) => ({
    //                 value: item.id,
    //                 label: item.gender
    //             }));
    //             setGenderOptions(genderData);
    //         }

    //         // Populate Mobile Relation options and use same for Email Relation
    //         if (data?.mobile_relation && Array.isArray(data.mobile_relation)) {
    //             const relationData = data.mobile_relation.map((item: any) => ({
    //                 value: item.id,
    //                 label: item.relation
    //             }));
    //             setMobileRelationOptions(relationData);
    //             setEmailRelationOptions(relationData); // Use same data for email relation
    //         }

    //         // Populate Marital Status options
    //         if (data?.marital_status && Array.isArray(data.marital_status)) {
    //             const maritalStatusData = data.marital_status.map((item: any) => ({
    //                 value: item.id,
    //                 label: item.status
    //             }));
    //             setMaritalStatusOptions(maritalStatusData);
    //         }

    //         // Populate Relationship Proof options
    //         if (data?.relationship_proof && Array.isArray(data.relationship_proof)) {
    //             const relationshipProofData = data.relationship_proof.map((item: any) => ({
    //                 value: item.id,
    //                 label: item.type
    //             }));
    //             setRelationshipProofOptions(relationshipProofData);
    //         }

    //         // Populate Guardian Relation options for Relationship with Primary Holder
    //         if (data?.relationship_primaryHolder && Array.isArray(data.relationship_primaryHolder)) {
    //             const guardianRelationData = data.relationship_primaryHolder.map((item: any) => ({
    //                 value: item.id,
    //                 label: item.relationship
    //             }));
    //             setGuardianRelationOptions(guardianRelationData);
    //         }

    //         // Populate Bank Proof options
    //         if (data?.bank_proof && Array.isArray(data.bank_proof)) {
    //             const bankProofData = data.bank_proof.map((item: any) => ({
    //                 value: item.mfu_code.toString(),
    //                 label: item.bank_proof
    //             }));
    //             setBankProofOptions(bankProofData);
    //         }

    //         // Populate Identity Type options
    //         if (data?.identity_type_list && Array.isArray(data.identity_type_list)) {
    //             const identityTypeData = data.identity_type_list.map((item: any) => ({
    //                 value: item.mfu_code,
    //                 label: item.type
    //             }));
    //             setIdentityTypeOptions(identityTypeData);
    //         }

    //         // Populate Nominee Guardian Relationship options
    //         if (data?.nominee_guardian_relationship_types && Array.isArray(data.nominee_guardian_relationship_types)) {
    //             const nomineeGuardianData = data.nominee_guardian_relationship_types.map((item: any) => ({
    //                 value: item.mfu_code,
    //                 label: item.relationship
    //             }));
    //             setNomineeGuardianRelationOptions(nomineeGuardianData);
    //         }
    //     } catch (error) {
    //         console.log('Error populating dropdown data:', error);
    //         // Keep default values if API fails
    //     }
    // };
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleImagePick = (response: any) => {
        const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];

        if (response && response.didCancel !== true) {
            let name = response[0]?.name ? response[0]?.name : response?.assets[0]?.fileName;
            const fileExtension = name.split(".").pop().toLowerCase();

            if (allowedExtensions.includes(fileExtension)) {
                const fileData = response[0]?.uri ? response[0] : response?.assets[0];

                if (photo === 0) { // Permanent address front
                    setAdharFront(fileData);
                    setForm({ ...Form, adharFront: fileData.uri });
                    // Clear back image when front is selected
                    if (adharBack) {
                        setAdharBack(null);
                        setForm(prev => ({ ...prev, adharBack: '' }));
                    }
                } else if (photo === 1) { // Permanent address back
                    setAdharBack(fileData);
                    setForm({ ...Form, adharBack: fileData.uri });
                    // Clear front image when back is selected
                    if (adharFront) {
                        setAdharFront(null);
                        setForm(prev => ({ ...prev, adharFront: '' }));
                    }
                } else if (photo === 2) { // Correspondence address front
                    setCorrAdharFront(fileData);
                    handleFormAddress2Change({ key: 'adharFront', value: fileData.uri });
                    // Clear correspondence back image when front is selected
                    if (corrAdharBack) {
                        setCorrAdharBack(null);
                        handleFormAddress2Change({ key: 'adharBack', value: '' });
                    }
                } else if (photo === 3) { // Correspondence address back
                    setCorrAdharBack(fileData);
                    handleFormAddress2Change({ key: 'adharBack', value: fileData.uri });
                    // Clear correspondence front image when back is selected
                    if (corrAdharFront) {
                        setCorrAdharFront(null);
                        handleFormAddress2Change({ key: 'adharFront', value: '' });
                    }
                }

                showToast(toastTypes.success, 'File selected successfully');
            } else {
                showToast(toastTypes.error, 'Unsupported file type. Please upload a jpg, jpeg, png or pdf file.');
            }
        }
    };

    // Validation function for permanent address
    const validatePermanentAddress = () => {
        let isValid = true;
        let errors = {
            adharFront: '',
            adharBack: '',
            poaNumber: '',
            address1: '',
            addressType: '',
            country: '',
            state: '',
            city: '',
            pincode: '',
            District: '',
        };

        // Aadhar validation - only if showAadharUpload is true
        if (showAadharUpload) {
            if (!Form.adharFront && !adharFront) {
                errors.adharFront = 'Aadhar front image is required';
                isValid = false;
            }
            if (!Form.adharBack && !adharBack) {
                errors.adharBack = 'Aadhar back image is required';
                isValid = false;
            }
        }

        // POA Number validation
        if (!Form.poaNumber) {
            errors.poaNumber = 'POA Number is required';
            isValid = false;
        } else if (Form.poaNumber.length < 5) {
            errors.poaNumber = 'POA Number must be at least 5 characters';
            isValid = false;
        }

        // Address 1 validation
        if (!Form.address1) {
            errors.address1 = 'Address Line 1 is required';
            isValid = false;
        } else if (Form.address1.length < 5) {
            errors.address1 = 'Address must be at least 5 characters';
            isValid = false;
        }

        // Address Type validation
        if (!Form.addressType) {
            errors.addressType = 'Address Type is required';
            isValid = false;
        }

        // Country validation
        if (!Form.country) {
            errors.country = 'Country is required';
            isValid = false;
        }

        // State validation
        if (!Form.state) {
            errors.state = 'State is required';
            isValid = false;
        }

        // City validation
        if (!Form.city) {
            errors.city = 'City is required';
            isValid = false;
        } else if (Form.city.length < 2) {
            errors.city = 'City must be at least 2 characters';
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(Form.city)) {
            errors.city = 'City should contain only letters';
            isValid = false;
        }

        // Pincode validation
        if (!Form.pincode) {
            errors.pincode = 'Pincode is required';
            isValid = false;
        } else if (!/^\d{6}$/.test(Form.pincode)) {
            errors.pincode = 'Pincode must be 6 digits';
            isValid = false;
        }

        // District validation
        if (!Form.District) {
            errors.District = 'District is required';
            isValid = false;
        } else if (Form.District.length < 2) {
            errors.District = 'District must be at least 2 characters';
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(Form.District)) {
            errors.District = 'District should contain only letters';
            isValid = false;
        }
        console.log('Form Errors:', errors);
        setFormError(errors);
        return isValid;
    };

    // Validation function for correspondence address
    const validateCorrespondenceAddress = () => {
        let isValid = true;
        let errors = {
            adharFront: '',
            adharBack: '',
            poaNumber: '',
            address1: '',
            address2: '',
            addressType: '',
            country: '',
            state: '',
            city: '',
            pincode: '',
            District: '',
        };

        // Aadhar validation - always required for correspondence
        if (!FormAddress2.adharFront && !corrAdharFront) {
            errors.adharFront = 'Aadhar front image is required';
            isValid = false;
        }
        if (!FormAddress2.adharBack && !corrAdharBack) {
            errors.adharBack = 'Aadhar back image is required';
            isValid = false;
        }

        // POA Number validation
        if (!FormAddress2.poaNumber) {
            errors.poaNumber = 'POA Number is required';
            isValid = false;
        } else if (FormAddress2.poaNumber.length < 5) {
            errors.poaNumber = 'POA Number must be at least 5 characters';
            isValid = false;
        }

        // Address 1 validation
        if (!FormAddress2.address1) {
            errors.address1 = 'Address Line 1 is required';
            isValid = false;
        } else if (FormAddress2.address1.length < 5) {
            errors.address1 = 'Address must be at least 5 characters';
            isValid = false;
        }

        // Address Type validation
        if (!FormAddress2.addressType) {
            errors.addressType = 'Address Type is required';
            isValid = false;
        }

        // Country validation
        if (!FormAddress2.country) {
            errors.country = 'Country is required';
            isValid = false;
        }

        // State validation
        if (!FormAddress2.state) {
            errors.state = 'State is required';
            isValid = false;
        }

        // City validation
        if (!FormAddress2.city) {
            errors.city = 'City is required';
            isValid = false;
        } else if (FormAddress2.city.length < 2) {
            errors.city = 'City must be at least 2 characters';
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(FormAddress2.city)) {
            errors.city = 'City should contain only letters';
            isValid = false;
        }

        // Pincode validation
        if (!FormAddress2.pincode) {
            errors.pincode = 'Pincode is required';
            isValid = false;
        } else if (!/^\d{6}$/.test(FormAddress2.pincode)) {
            errors.pincode = 'Pincode must be 6 digits';
            isValid = false;
        }

        // District validation
        if (!FormAddress2.District) {
            errors.District = 'District is required';
            isValid = false;
        } else if (FormAddress2.District.length < 2) {
            errors.District = 'District must be at least 2 characters';
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(FormAddress2.District)) {
            errors.District = 'District should contain only letters';
            isValid = false;
        }

        setFormAddress2Error(errors);
        return isValid;
    };

    // Handle form change with validation
    const handleFormChange = (values: any) => {
        const { key, value } = values;
        setForm((prev: any) => ({ ...prev, [key]: value }));
        // Clear error when user starts   typing
        setFormError((prev: any) => ({ ...prev, [key]: '' }));
    };

    // Handle next button
    const handleNext = async () => {
        const isPermanentValid = validatePermanentAddress();
        const isCorrespondenceValid = !sameAsPermanent ? validateCorrespondenceAddress() : true;

        if (isPermanentValid && isCorrespondenceValid) {
            await saveAddressDetails();
        } else {
            showToast(toastTypes.error, 'Please fill all required fields correctly');
        }
    };

    const saveAddressDetails = async () => {
        try {
            const basicDetails = getKYC_Details()?.user_basic_details;
            const userId = basicDetails?.id;
            const userToken = basicDetails?.userToken || '';
            const synzyuserId = basicDetails?.signzy_user_name || '';
            const dob = basicDetails?.dob || '';

            const formData = new FormData();

            // Add permanent address Aadhar files if available
            if (adharFront) {
                formData.append('address_front_doc', {
                    uri: adharFront.uri,
                    type: adharFront.type || 'image/jpeg',
                    name: adharFront.name || adharFront.fileName || 'aadhar_front.jpg'
                } as any);
            }

            if (adharBack) {
                formData.append('address_back_doc', {
                    uri: adharBack.uri,
                    type: adharBack.type || 'image/jpeg',
                    name: adharBack.name || adharBack.fileName || 'aadhar_back.jpg'
                } as any);
            }

            // Add correspondence address Aadhar files if available
            if (corrAdharFront) {
                formData.append('corr_aadhaar_front_doc', {
                    uri: corrAdharFront.uri,
                    type: corrAdharFront.type || 'image/jpeg',
                    name: corrAdharFront.name || corrAdharFront.fileName || 'corr_aadhar_front.jpg'
                } as any);
            }

            if (corrAdharBack) {
                formData.append('corr_aadhaar_back_doc', {
                    uri: corrAdharBack.uri,
                    type: corrAdharBack.type || 'image/jpeg',
                    name: corrAdharBack.name || corrAdharBack.fileName || 'corr_aadhar_back.jpg'
                } as any);
            }

            // const payload = {
            //     request_type: "updatePOA",
            //     investor_id: userId,
            //     address_type: Form.addressType,
            //     doc_holder_name: basicDetails?.User_kycName || '',
            //     kycStatus: false,
            //     POAConsent: !showAadharUpload,
            //     doc_no: Form.poaNumber,
            //     address1: Form.address1,
            //     address2: Form.address2 || '',
            //     district: Form.District,
            //     pincode: Form.pincode,
            //     city: Form.city,
            //     state_id: Form.state,
            //     country_id: Form.country,
            //     same_as_permanent: sameAsPermanent,
            //     corr_doc_no: sameAsPermanent ? Form.poaNumber : FormAddress2.poaNumber,
            //     corr_address1: sameAsPermanent ? Form.address1 : FormAddress2.address1,
            //     corr_address2: sameAsPermanent ? Form.address2 : FormAddress2.address2 || '',
            //     corr_address_type: sameAsPermanent ? Form.addressType : FormAddress2.addressType,
            //     corr_district: sameAsPermanent ? Form.District : FormAddress2.District,
            //     corr_pincode: sameAsPermanent ? Form.pincode : FormAddress2.pincode,
            //     corr_city: sameAsPermanent ? Form.city : FormAddress2.city,
            //     corr_state_id: sameAsPermanent ? Form.state : FormAddress2.state,
            //     corr_country_id: sameAsPermanent ? Form.country : FormAddress2.country,
            //     userToken: userToken,
            //     synzyuserId: synzyuserId,
            //     dob: dob
            // };

            const payload = {
                "request_type": "updatePOA",
                "investor_id": getKYC_Details()?.user_basic_details?.id,
                "address_type": Form.addressType,
                "doc_holder_name": doc_HolderName,
                "kycStatus": false,
                "POAConsent": !showAadharUpload,
                "doc_no": Form.poaNumber,
                "address_front_doc": Form.adharFront ? Form.adharFront : '',
                "address_back_doc": Form.adharBack ? Form.adharBack : '',
                "corr_aadhaar_front_doc": FormAddress2.adharFront ? FormAddress2.adharFront : '',
                "corr_aadhaar_back_doc": FormAddress2.adharBack ? FormAddress2.adharBack : '',
                "address1": Form.address1 || '',
                "address2": Form.address2 || '',
                "district": Form.District || '',
                "pincode": Form.pincode || '',
                "city": Form.city || '',
                "state_id": Form.state.toString() || '',
                "country_id": Form.country || '',
                "same_as_permanent": sameAsPermanent,
                "corr_doc_no": sameAsPermanent ? Form.poaNumber : FormAddress2.poaNumber || '',
                "corr_address1": sameAsPermanent ? Form.address1 : FormAddress2.address1 || '',
                "corr_address2": sameAsPermanent ? Form.address2 : FormAddress2.address2 || '',
                "corr_address_type": sameAsPermanent ? Form.addressType : FormAddress2.addressType || '',
                "corr_district": sameAsPermanent ? Form.District : FormAddress2.District || '',
                "corr_pincode": sameAsPermanent ? Form.pincode : FormAddress2.pincode || '',
                "corr_city": sameAsPermanent ? Form.city : FormAddress2.city || '',
                "corr_state_id": sameAsPermanent ? Form.state.toString() : FormAddress2.state || '',
                "corr_country_id": sameAsPermanent ? Form.country : FormAddress2.country || '',
                "userToken": signZyData?.id,
                "synzyuserId": signZyData?.userId,
                "dob": dob
            }

            formData.append("formData", JSON.stringify(payload));
            console.log('Address Details Payload:', payload);


            const [result, error]: any = await updateAddressDetailApi(payload);
            console.log('Address Details Result:', result);
            console.log('Address Details error:', error);
            if (result) {
                console.log('Address Details Result:', result);
                showToast(toastTypes.success, result?.msg || 'Address details saved successfully');

                // Update KYC details if needed
                if (result?.data) {
                    const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data?.investor_data);
                    setKYC_Details(update_data);
                }

                // Navigate to next step
                setSelectedTab('Fatca');
            } else {
                // console.log('Address Details Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to save address details');
            }
        } catch (error: any) {
            console.log('Address Details Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while saving address details');
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
                        <Wrapper color={colors.fieldborder} width={responsiveWidth(50)} customStyles={{ paddingVertical: responsiveWidth(2), borderRadius: borderRadius.medium }} />
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
                    {/* Upload Aadhar Fields - Only show if poaConsent is false */}
                    {showAadharUpload && (
                        <>
                            <Wrapper customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(0) }}>
                                <Wrapper row align="center" justify="apart">
                                    <CusText size="SS" text={'Upload Front Side'} />
                                    <CusText size="SS" text={'Aadhaar Card'} />
                                </Wrapper>
                                <TouchableOpacity onPress={() => { setModalVisible(true); setPhoto(0); }}>
                                    <Wrapper row customStyles={{ borderRadius: borderRadius.middleSmall, borderColor: colors.fieldborder, borderWidth: 1, }}>
                                        <Wrapper color={colors.fieldborder} customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                                            <CusText text={'Choose File'} />
                                        </Wrapper>
                                        <Wrapper customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                                            <CusText text={adharFront ? (adharFront.name || adharFront.fileName || 'File selected') : 'No file chosen'} />
                                        </Wrapper>
                                    </Wrapper>
                                </TouchableOpacity>
                            </Wrapper>

                            <Wrapper customStyles={{ paddingVertical: responsiveWidth(1), paddingHorizontal: responsiveWidth(0) }}>
                                <Wrapper row align="center" justify="apart">
                                    <CusText size="SS" text={'Upload Back Side'} />
                                    <CusText size="SS" text={'Aadhaar Card'} />
                                </Wrapper>
                                <TouchableOpacity onPress={() => { setModalVisible(true); setPhoto(1); }}>
                                    <Wrapper row customStyles={{ borderRadius: borderRadius.middleSmall, borderColor: colors.fieldborder, borderWidth: 1, }}>
                                        <Wrapper color={colors.fieldborder} customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                                            <CusText text={'Choose File'} />
                                        </Wrapper>
                                        <Wrapper customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                                            <CusText text={adharBack ? (adharBack.name || adharBack.fileName || 'File selected') : 'No file chosen'} />
                                        </Wrapper>
                                    </Wrapper>
                                </TouchableOpacity>
                            </Wrapper>
                        </>
                    )}
                    <Spacer y="XXS" />
                    <Wrapper position="center">
                        <InputField
                            label="POA Number"
                            width={responsiveWidth(89)}
                            placeholder="Enter POA Number"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                            fieldViewStyle={{
                                borderColor: 'rgba(152, 162, 179, 1)',
                                borderRadius: borderRadius.middleSmall
                            }}
                            value={Form.poaNumber}
                            onChangeText={(value: string) => {
                                handleFormChange({ key: 'poaNumber', value });
                            }}
                            error={FormError.poaNumber}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper position="center">
                        <InputField
                            label="Address 1 *"
                            width={responsiveWidth(89)}
                            placeholder="Enter Address Line 1"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                            fieldViewStyle={{
                                borderColor: 'rgba(152, 162, 179, 1)',
                                borderRadius: borderRadius.middleSmall
                            }}
                            value={Form.address1}
                            onChangeText={(value: string) => {
                                handleFormChange({ key: 'address1', value });
                            }}
                            error={FormError.address1}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper position="center">
                        <InputField
                            label="Address 2"
                            width={responsiveWidth(89)}
                            placeholder="Enter Address Line 2"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                            fieldViewStyle={{
                                borderColor: 'rgba(152, 162, 179, 1)',
                                borderRadius: borderRadius.middleSmall
                            }}
                            value={Form.address2}
                            onChangeText={(value: string) => {
                                handleFormChange({ key: 'address2', value });
                            }}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper position="center">
                        <DropDown
                            width={responsiveWidth(89)}
                            data={addressType}
                            placeholder={'Select type'}
                            placeholdercolor={colors.gray}
                            label="Address Type *"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                            required
                            value={Form.addressType}
                            valueField="value"
                            labelField={'label'}
                            onChange={(data: any) => {
                                setForm({ ...Form, addressType: data.value });
                                setFormError({ ...FormError, addressType: '' });
                            }}
                            onClear={() => {
                                setForm({ ...Form, addressType: '' });
                            }}
                            error={FormError.addressType}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper position="center">
                        <DropDown
                            width={responsiveWidth(89)}
                            data={country}
                            placeholder={'Select Country'}
                            placeholdercolor={colors.gray}
                            label="Country *"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                            required
                            value={Form.country}
                            valueField="value"
                            labelField={'label'}
                            onChange={(data: any) => {
                                setForm({ ...Form, country: data.value });
                                setFormError({ ...FormError, country: '' });
                                // Call getState when country is selected
                                getState(data.value);
                                // Clear state when country changes
                                setForm(prev => ({ ...prev, state: '' }));
                            }}
                            onClear={() => {
                                setForm({ ...Form, country: '', state: '' });
                                setState([]);
                            }}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper position="center">
                        <DropDown
                            width={responsiveWidth(89)}
                            data={state}
                            placeholder={'Select State'}
                            placeholdercolor={colors.gray}
                            label="State *"
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall }}
                            required
                            value={Form.state}
                            valueField="value"
                            labelField={'label'}
                            onChange={(data: any) => {
                                setForm({ ...Form, state: data.value });
                                setFormError({ ...FormError, state: '' });
                            }}
                            onClear={() => {
                                setForm({ ...Form, state: '' });
                            }}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper position="center">
                        <InputField
                            label="City *"
                            width={responsiveWidth(89)}
                            placeholder="Enter City"
                            value={Form.city}
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                            fieldViewStyle={{
                                borderColor: 'rgba(152, 162, 179, 1)',
                                borderRadius: borderRadius.middleSmall
                            }}
                            onChangeText={(value: string) => {
                                setForm({ ...Form, city: value });
                                setFormError({ ...FormError, city: '' });
                            }}
                            error={FormError.city}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper position="center">
                        <InputField
                            label="Pincode *"
                            width={responsiveWidth(89)}
                            placeholder="Enter Pincode"
                            value={Form.pincode}
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                            fieldViewStyle={{
                                borderColor: 'rgba(152, 162, 179, 1)',
                                borderRadius: borderRadius.middleSmall
                            }}
                            onChangeText={(value: string) => {
                                setForm({ ...Form, pincode: value });
                                setFormError({ ...FormError, pincode: '' });
                            }}
                            error={FormError.pincode}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper position="center">
                        <InputField
                            label="District *"
                            width={responsiveWidth(89)}
                            placeholder="Enter District"
                            value={Form.District}
                            labelStyle={{ color: colors.Hard_Black, fontSize: fontSize.semiSmall, marginLeft: responsiveWidth(-1) }}
                            fieldViewStyle={{
                                borderColor: 'rgba(152, 162, 179, 1)',
                                borderRadius: borderRadius.middleSmall
                            }}
                            onChangeText={(value: string) => {
                                setForm({ ...Form, District: value });
                                setFormError({ ...FormError, District: '' });
                            }}
                            error={FormError.District}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />


                    {/* Correspondence Address Toggle */}
                    <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                        <Wrapper row align="center" justify="apart" customStyles={{
                            backgroundColor: colors.lightGray,
                            paddingVertical: responsiveWidth(3),
                            paddingHorizontal: responsiveWidth(4),
                            borderRadius: borderRadius.medium
                        }}>
                            <Wrapper row align="center">

                                <CusText
                                    size="S"
                                    medium
                                    text="Correspondence Address"
                                    color={colors.Hard_Black}
                                />
                            </Wrapper>
                            <TouchableOpacity
                                onPress={() => setSameAsPermanent(!sameAsPermanent)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <IonIcon
                                    name={sameAsPermanent ? "checkmark-circle" : "ellipse-outline"}
                                    color={sameAsPermanent ? colors.orange : colors.gray}
                                    size={responsiveWidth(5)}
                                />
                                <Spacer x="XXS" />
                                <CusText
                                    size="XS"
                                    text="Same as Permanent Address"
                                    color={colors.gray}
                                />
                            </TouchableOpacity>
                        </Wrapper>
                    </Wrapper>

                    <Spacer y='S' />

                    {/* Correspondence Address Fields - Only show if NOT same as permanent */}
                    {!sameAsPermanent && (
                        <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                            <CusText size="SS" medium text={'Correspondence Address Details'} />
                            <Spacer y='XS' />

                            {/* Upload Aadhar Fields for Correspondence */}
                            <Wrapper customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(0) }}>
                                <Wrapper row align="center" justify="apart">
                                    <CusText size="SS" text={'Upload Front Side'} />
                                    <CusText size="SS" text={'Aadhaar Card'} />
                                </Wrapper>
                                <TouchableOpacity onPress={() => { setModalVisible(true); setPhoto(2); }}>
                                    <Wrapper row customStyles={{ borderRadius: borderRadius.middleSmall, borderColor: colors.fieldborder, borderWidth: 1, }}>
                                        <Wrapper color={colors.fieldborder} customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                                            <CusText text={'Choose File'} />
                                        </Wrapper>
                                        <Wrapper customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                                            <CusText text={corrAdharFront ? (corrAdharFront.name || corrAdharFront.fileName || 'File selected') : 'No file chosen'} />
                                        </Wrapper>
                                    </Wrapper>
                                </TouchableOpacity>
                                {FormAddress2Error.adharFront ? <CusText text={FormAddress2Error.adharFront} size='S' color={colors.error} /> : null}
                            </Wrapper>

                            <Wrapper customStyles={{ paddingVertical: responsiveWidth(1), paddingHorizontal: responsiveWidth(0) }}>
                                <Wrapper row align="center" justify="apart">
                                    <CusText size="SS" text={'Upload Back Side'} />
                                    <CusText size="SS" text={'Aadhaar Card'} />
                                </Wrapper>
                                <TouchableOpacity onPress={() => { setModalVisible(true); setPhoto(3); }}>
                                    <Wrapper row customStyles={{ borderRadius: borderRadius.middleSmall, borderColor: colors.fieldborder, borderWidth: 1, }}>
                                        <Wrapper color={colors.fieldborder} customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                                            <CusText text={'Choose File'} />
                                        </Wrapper>
                                        <Wrapper customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                                            <CusText text={FormAddress2.adharBack ? 'File Selected' : 'No file chosen'} />
                                        </Wrapper>
                                    </Wrapper>
                                </TouchableOpacity>
                                {FormAddress2Error.adharBack ? <CusText text={FormAddress2Error.adharBack} size='S' color={colors.error} /> : null}
                            </Wrapper>
                            <Spacer y='XS' />

                            {/* Address Fields */}
                            <InputField
                                label="Address Line 1"
                                placeholder="Enter Address Line 1"
                                value={FormAddress2.address1}
                                onChangeText={(value: string) => {
                                    handleFormAddress2Change({ key: 'address1', value });
                                }}
                                error={FormAddress2Error.address1}
                            />
                            <Spacer y='XS' />

                            <InputField
                                label="Address Line 2"
                                placeholder="Enter Address Line 2"
                                value={FormAddress2.address2}
                                onChangeText={(value: string) => {
                                    handleFormAddress2Change({ key: 'address2', value });
                                }}
                                error={FormAddress2Error.address2}
                            />
                            <Spacer y='XS' />

                            <DropDown
                                width={responsiveWidth(89)}
                                data={addressType}
                                placeholder={'Select Address Type'}
                                label="Address Type"
                                value={FormAddress2.addressType}
                                valueField="value"
                                labelField={'label'}
                                onChange={(data: any) => {
                                    handleFormAddress2Change({ key: 'addressType', value: data.value });
                                }}
                                onClear={() => {
                                    handleFormAddress2Change({ key: 'addressType', value: '' });
                                }}
                                error={FormAddress2Error.addressType}
                            />
                            <Spacer y='XS' />

                            <DropDown
                                width={responsiveWidth(89)}
                                data={country}
                                placeholder={'Select Country'}
                                label="Country"
                                value={FormAddress2.country}
                                valueField="value"
                                labelField={'label'}
                                onChange={(data: any) => {
                                    handleFormAddress2Change({ key: 'country', value: data.value });
                                    // Load states for correspondence address
                                    getStateCorrByCountry(data.value);
                                    // Clear state when country changes
                                    handleFormAddress2Change({ key: 'state', value: '' });
                                }}
                                onClear={() => {
                                    handleFormAddress2Change({ key: 'country', value: '' });
                                    handleFormAddress2Change({ key: 'state', value: '' });
                                    setStateCorr([]);
                                }}
                                error={FormAddress2Error.country}
                            />
                            <Spacer y='XS' />

                            <DropDown
                                width={responsiveWidth(89)}
                                data={stateCorr}
                                placeholder={'Select State'}
                                label="State"
                                value={FormAddress2.state}
                                valueField="value"
                                labelField={'label'}
                                onChange={(data: any) => {
                                    handleFormAddress2Change({ key: 'state', value: data.value });
                                }}
                                onClear={() => {
                                    handleFormAddress2Change({ key: 'state', value: '' });
                                }}
                                error={FormAddress2Error.state}
                            />
                            <Spacer y='XS' />

                            <InputField
                                label="City"
                                placeholder="Enter City"
                                value={FormAddress2.city}
                                onChangeText={(value: string) => {
                                    handleFormAddress2Change({ key: 'city', value });
                                }}
                                error={FormAddress2Error.city}
                            />
                            <Spacer y='XS' />

                            <InputField
                                label="District"
                                placeholder="Enter District"
                                value={FormAddress2.District}
                                onChangeText={(value: string) => {
                                    handleFormAddress2Change({ key: 'District', value });
                                }}
                                error={FormAddress2Error.District}
                            />
                            <Spacer y='XS' />

                            <InputField
                                label="Pincode"
                                placeholder="Enter Pincode"
                                keyboardType="numeric"
                                value={FormAddress2.pincode}
                                onChangeText={(value: string) => {
                                    handleFormAddress2Change({ key: 'pincode', value });
                                }}
                                error={FormAddress2Error.pincode}
                            />
                            <Spacer y='S' />
                        </Wrapper>
                    )}


                    <Wrapper position='center' row align='center' justify='apart' customStyles={{ gap: responsiveWidth(2) }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={handleNext}>
                            <Wrapper width={responsiveWidth(80)} color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingVertical: responsiveWidth(2.5) }}>
                                <CusText position='center' bold color={colors.Hard_White} text={'Next'} />
                            </Wrapper>
                        </TouchableOpacity>

                    </Wrapper>
                    <Spacer y="XXS" />
                </ScrollView>

            </Wrapper>
            <ImagePickerModal
                visible={isModalVisible}
                onClose={toggleModal}
                onPickImage={handleImagePick}
                isVideo={false}
            />
        </>
    )
}

export default AddressDetails;
