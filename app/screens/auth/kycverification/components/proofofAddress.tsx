import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { BackHandler, Image, TouchableOpacity, View } from "react-native";
import Pdf from 'react-native-pdf';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { toastTypes } from "../../../../constant/constants";
import { AppearanceContext } from "../../../../context/appearanceContext";
import { showToast } from "../../../../services/toastService";
import ImagePickerModal from "../../../../shared/components/ImagePickerModal";
import { borderRadius, fontSize, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import Container from "../../../../ui/container";
import CusButton from "../../../../ui/custom-button";
import CusText from "../../../../ui/custom-text";
import DropDown from "../../../../ui/dropdown";
import InputField from "../../../../ui/InputField";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import HeaderComponent from "../headercomponent/headercomponent";
import { styles } from "../kycverificationStyles";
const ProofOfAddress = ({ setSelectedTab, step }: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const [isSubmited, setisSubmited] = useState<boolean>(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [photo, setPhoto] = useState<any>(0);
    const [defaultCountryId, setdefaultCountryId] = useState<any>();
    const [signZyData, setsignZyData] = useState<any>({});
    const [frontImageData, setfrontImageData] = useState<any>({});
    const [backImageData, setbackImageData] = useState<any>({});
    const [isscanload, setisscanload] = useState(false);
    const [isDetails, setDetails] = useState<any>({});
    const [continueLoading, setcontinueLoading] = useState(false);
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [scanEnabled, setScanEnabled] = useState(false);
    const [fileExt, setfileExt] = useState('');
    const [backfileExt, setbackfileExt] = useState('');
    const [Form, setForm] = useState({
        document: '',
        docFrontPhoto: '',
        docBackPhoto: '',
        addresstype: '',
        poanumber: '',
        address: '',
        city: '',
        district: '',
        state: '',
        country: '',
        pincode: ''
    });
    const [FormError, setFormError] = useState({
        document: '',
        docFrontPhoto: '',
        docBackPhoto: '',
        addresstype: '',
        poanumber: '',
        address: '',
        city: '',
        district: '',
        state: '',
        country: '',
        pincode: ''
    });
    const [isFocus, setIsFocus] = useState(false);
    const [addressProof, setaddressProof] = useState([
        {
            value: '1',
            Address: 'Adhaar Card'
        },
        {
            value: '2',
            Address: 'Driving License'
        },
        {
            value: '3',
            Address: 'Passport'
        },
        {
            value: '4',
            Address: 'Voter Id'
        },
    ])
    const [addressProoftype, setaddressProoftype] = useState([])
    const [country, setCountry] = useState([])
    const [state, setState] = useState([])
    const isFocused = useIsFocused();
    const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    useEffect(() => {

        setcontinueLoading(false)
        getDefaultData()
        getAddressType()
        getCountry()
        getState(102)
        setFrontImage(null)
        setBackImage(null)
        setdefaultCountryId(102)
        return () => {
            setForm({
                ...Form,
                document: '',
                docFrontPhoto: '',
                docBackPhoto: '',
                addresstype: '',
                poanumber: '',
                address: '',
                city: '',
                district: '',
                state: '',
                country: '',
                pincode: ''
            });
            setFormError({
                ...Form,
                document: '',
                docFrontPhoto: '',
                docBackPhoto: '',
                addresstype: '',
                poanumber: '',
                address: '',
                city: '',
                district: '',
                state: '',
                country: '',
                pincode: ''
            });
        };
    }, [isFocused]);


    useEffect(() => {

        const loadData = async () => {
            try {
                await getCountry();
                await getState(102);
                getSummeryDetails();
            } catch (error) {
                console.log('Error loading data', error);
            }
        };
        loadData();
        // if (getNew_User()) {
        //     if (step <= getUserObject()?.newKyc?.last_kyc_step) {
        //         loadData();
        //     }
        // } else {
        //     if (step <= getLoginUserDetails()?.user_basic_details?.last_kyc_step) {
        //         loadData();
        //     }
        // }

    }, [])


    const navigation: any = useNavigation();
    useEffect(() => {
        const backAction = () => {
            navigation.navigate('KycTrack')
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    const getDefaultData = async () => {
      

    }

    const getSummeryDetails = async () => {
       
    }
    const getAddressType = async () => {
       
    }
    const getCountry = async () => {
      
    }
    const getState = async (id: any) => {
       
    }
    const handleFormChange = (values: any) => {
        const { key, value } = values;
        setForm((prev: any) => ({ ...prev, [key]: value }));
        handleValidate(isSubmited, values);
    };
    const handleValidate = (flag = false, values: any) => {
        if (!flag) return;
        let isValid = true;
        let data = Form;
        if (values) {
            const { key, value } = values;
            data = { ...data, [key]: value };
        }
        let document = '';
        if (!data?.document) {
            isValid = false;
            document = 'Document is required';
        }
        let docFrontPhoto = '';
        if (!data?.docFrontPhoto) {
            isValid = false;
            docFrontPhoto = 'Front Photo is required';
        }
        let docBackPhoto = '';
        if (!data?.docBackPhoto) {
            isValid = false;
            docBackPhoto = 'Back Photo is required';
        }
        let addresstype = '';
        if (!data?.addresstype) {
            isValid = false;
            addresstype = 'Address type is required';
        }
        let poanumber = '';
        if (!data?.poanumber) {
            isValid = false;
            poanumber = 'POA Number is required';
        }
        let address = '';
        if (!data?.address) {
            isValid = false;
            address = 'address is required';
        }
        let city = '';
        if (!data?.city) {
            isValid = false;
            city = 'city is required';
        }
        let district = '';
        if (!data?.district) {
            isValid = false;
            district = 'district is required';
        }
        let state = '';
        if (!data?.state) {
            isValid = false;
            state = 'state is required';
        }
        let country = '';
        if (!data?.country) {
            isValid = false;
            country = 'country is required';
        }
        let pincode = '';
        if (!data?.pincode) {
            isValid = false;
            pincode = 'pincode is required';
        }
        setFormError({
            document,
            docFrontPhoto,
            docBackPhoto,
            addresstype,
            poanumber,
            address,
            city,
            district,
            state,
            country,
            pincode,
        });
        return isValid;
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleImagePick = (response: any) => {
      
    };

    useEffect(() => {
        if (frontImage && backImage) {
            setScanEnabled(true);
        } else {
            setScanEnabled(false);
        }
    }, [frontImage, backImage]);

    const checkImages = (front: any, back: any) => {
        if (front && back) {
            setScanEnabled(true);
        } else {
            setScanEnabled(false);
        }
    };

    const submit = async () => {
     
    };

    const clearData = () => {
        handleFormChange({ key: 'addresstype', value: '' })
        handleFormChange({ key: 'poanumber', value: '' })
        handleFormChange({ key: 'address', value: '' })
        handleFormChange({ key: 'city', value: '' })
        handleFormChange({ key: 'district', value: '' })
        handleFormChange({ key: 'state', value: '' })
        handleFormChange({ key: 'country', value: 102 })
        handleFormChange({ key: 'pincode', value: '' })
    }

    const scan = async () => {
       
    }

    return (
        <>
            <HeaderComponent name={'KYC Verification'} />
            {/* <SubHeader name={'Proof of Address'} backAction={() => setSelectedTab('proofofIdentity')} /> */}
            <Container Xcenter>
                <DropDown
                    data={addressProof}
                    placeholder={'Select Address proof'}
                    placeholdercolor={colors.gray}
                    labelText="Address Proof Type"
                    required
                    // value={value}
                    value={Form.document}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    valueField="value"
                    labelField={'Address'}
                    onChange={(item: any) => {
                        handleFormChange({ key: 'document', value: item.value })
                        handleFormChange({ key: 'docFrontPhoto', value: '' })
                        handleFormChange({ key: 'docBackPhoto', value: '' })
                        clearData()
                        setIsFocus(false);
                    }}
                    onClear={
                        () => {
                            handleFormChange({ key: 'document', value: '' })
                            setIsFocus(false);
                        }
                    }
                    error={FormError?.document}
                />
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    if (Form.document !== '') {
                        setModalVisible(true); setPhoto(0)
                    } else {
                        showToast(toastTypes.info, 'Please Select Document type')
                    }

                }}>
                    <Wrapper
                        customStyles={styles.uploadFrame}
                        height={responsiveWidth(35)}
                        borderColor={colors.inputBorder}
                        align="center"
                        justify="center">
                        {
                            Form.docFrontPhoto != '' ? null : <View style={[styles.button, { backgroundColor: colors.darkGrayShades }]}><IonIcon disabled name='camera-outline' color={colors.gray} size={30} ></IonIcon></View>
                        }
                        {
                            Form.docFrontPhoto != '' ?
                                (
                                    fileExt === 'pdf' ?
                                        <Pdf
                                            trustAllCerts={false}
                                            source={{ uri: Form.docFrontPhoto, cache: true }}
                                            style={{ height: responsiveHeight(15), width: responsiveWidth(73) }}
                                            onError={(error) => {
                                                console.error(error);

                                            }}
                                        />
                                        :
                                        <Image
                                            resizeMode="contain"
                                            source={{
                                                uri: Form.docFrontPhoto,
                                            }}
                                            height={responsiveWidth(30)}
                                            width={responsiveWidth(84)}
                                            style={{ borderRadius: 10 }}
                                        />
                                )
                                :
                                (
                                    <CusText
                                        text="Front side-Take a Photo"
                                        position="center"
                                        color={colors.gray}
                                    />
                                )
                        }
                    </Wrapper>
                </TouchableOpacity>
                <Wrapper row justify={FormError?.docFrontPhoto ? 'apart' : 'right'} width={responsiveWidth(87)}>
                    {
                        FormError?.docFrontPhoto ?
                            <CusText text={FormError?.docFrontPhoto} size='S' color={colors.gray} underline error />
                            :
                            null
                    }
                </Wrapper>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    if (Form.document !== '') {
                        setModalVisible(true); setPhoto(1)
                    } else {
                        showToast(toastTypes.info, 'Please Select Document type')
                    }

                }}>
                    <Wrapper
                        customStyles={styles.uploadFrame}
                        height={responsiveWidth(35)}
                        borderColor={colors.inputBorder}
                        align="center"
                        justify="center">
                        {
                            Form.docBackPhoto != '' ? null : <View style={[styles.button, { backgroundColor: colors.darkGrayShades }]}><IonIcon disabled name='camera-outline' color={colors.gray} size={30} ></IonIcon></View>
                        }
                        {
                            Form.docBackPhoto != '' ?
                                (
                                    backfileExt === 'pdf' ?
                                        <Pdf
                                            trustAllCerts={false}
                                            source={{ uri: Form.docBackPhoto, cache: true }}
                                            style={{ height: responsiveHeight(15), width: responsiveWidth(73) }}
                                            onError={(error) => {
                                                console.error(error);
                                            }}
                                        />
                                        :
                                        <Image
                                            resizeMode="contain"
                                            source={{
                                                uri: Form.docBackPhoto,
                                            }}
                                            height={responsiveWidth(30)}
                                            width={responsiveWidth(84)}
                                            style={{ borderRadius: 10 }}
                                        />
                                )
                                :
                                (
                                    <CusText
                                        text="Back Side-Take a Photo"
                                        position="center"
                                        color={colors.gray}
                                    />
                                )
                        }
                    </Wrapper>
                </TouchableOpacity>
                <Spacer y='XXS' />
                <Wrapper row justify={FormError?.docBackPhoto ? 'apart' : 'right'} width={responsiveWidth(87)}>
                    {FormError?.docBackPhoto ? <CusText text={FormError?.docBackPhoto} size='S' color={colors.gray} underline error /> : null}
                    {
                        scanEnabled ? <CusButton
                            loading={isscanload}
                            customStyle={{ borderRadius: borderRadius.medium }}
                            width={responsiveWidth(30)}
                            height={responsiveHeight(5)}
                            title="Scan"
                            lgcolor1={colors.primary}
                            lgcolor2={colors.secondry}
                            position="center"
                            onPress={() => { scan() }} /> : null}
                </Wrapper>
                <DropDown
                    data={addressProoftype}
                    placeholder={'Select Address Type'}
                    placeholdercolor={colors.gray}
                    labelText="Address Type"
                    required
                    value={Form.addresstype}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    valueField="ID"
                    labelField={'address_type'}
                    onChange={(item: any) => {
                        handleFormChange({ key: 'addresstype', value: item.ID })
                        setIsFocus(false);
                    }}
                    onClear={
                        () => {
                            handleFormChange({ key: 'addresstype', value: '' })
                            setIsFocus(false);
                        }
                    }
                    error={FormError?.addresstype}
                />
                <InputField

                    editable={false}
                    label="POA Number"
                    width={responsiveWidth(90)}
                    placeholder="Enter POA Number"
                    value={Form.poanumber}
                    // labelStyle={{ color: colors.gray }}
                    borderColor={colors.gray}
                    onChangeText={(value: string) => {
                        handleFormChange({ key: 'poanumber', value })
                    }}
                    error={FormError.poanumber}
                />
                <InputField
                    label="Address"
                    width={responsiveWidth(90)}
                    placeholder="Enter Address"
                    value={Form.address}
                    multiline
                    numberOfLines={4}
                    textAlignVertical={'top'}
                    // labelStyle={{ color: colors.gray }}
                    borderColor={colors.gray}
                    onChangeText={(value: string) => {
                        handleFormChange({ key: 'address', value })
                    }}
                    error={FormError.address}
                />
                <InputField
                    label="City"
                    width={responsiveWidth(90)}
                    placeholder="Enter City"
                    value={Form.city}
                    // labelStyle={{ color: colors.gray }}
                    borderColor={colors.gray}
                    onChangeText={(value: string) => {
                        handleFormChange({ key: 'city', value })
                    }}
                    error={FormError.city}
                />
                <Wrapper row width={responsiveWidth(90)} justify="apart"
                    customStyles={{
                    }}>
                    <InputField
                        label="District"
                        width={responsiveWidth(43)}
                        placeholder="Enter District"
                        value={Form.district}
                        // labelStyle={{ color: colors.gray }}
                        borderColor={colors.gray}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'district', value })
                        }}
                        error={FormError.district}
                    />
                    <DropDown
                        width={responsiveWidth(43)}
                        data={state}
                        placeholder={'Select State'}
                        placeholdercolor={colors.gray}
                        labelText="State"
                        required
                        value={Form.state}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        valueField="ID"
                        labelField={'state_name'}
                        onChange={(item: any) => {
                            handleFormChange({ key: 'state', value: item.ID })
                            setIsFocus(false);
                        }}
                        onClear={
                            () => {
                                handleFormChange({ key: 'state', value: '' })
                            }
                        }
                        error={FormError?.state}
                    />
                </Wrapper>
                <Wrapper row width={responsiveWidth(90)} justify="apart"
                    customStyles={{
                    }}>
                    <DropDown
                        width={responsiveWidth(43)}
                        data={country}
                        placeholder={'Select Country'}
                        placeholdercolor={colors.gray}
                        labelText="Country"
                        required
                        value={Form.country}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        valueField="id"
                        labelField={'name'}
                        onChange={(item: any) => {
                            handleFormChange({ key: 'country', value: item.id })
                            setdefaultCountryId(item.id)
                            getState(item.id)
                            setIsFocus(false);
                        }}
                        onClear={
                            () => {
                                handleFormChange({ key: 'country', value: 102 })
                                getState(102)
                                setIsFocus(false);
                            }
                        }
                        error={FormError?.country}
                    />
                    <InputField
                        label="Pincode"
                        width={responsiveWidth(43)}
                        placeholder="Enter Pincode"
                        value={Form.pincode}
                        keyboardType="numeric"
                        // labelStyle={{ color: colors.gray }}
                        borderColor={colors.gray}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'pincode', value })
                        }}
                        error={FormError.pincode}
                    />
                </Wrapper>
                <Spacer y='S' />
                <CusButton
                    loading={continueLoading}
                    radius={borderRadius.ring}
                    width={responsiveWidth(90)}
                    title="Next"
                    lgcolor1={colors.primary}
                    lgcolor2={colors.secondry}
                    position="center"
                    onPress={() => { submit() }}
                    textStyle={{ fontSize: fontSize.medium }}
                    textWeight="semibold"
                />
            </Container>
            <ImagePickerModal
                visible={isModalVisible}
                onClose={toggleModal}
                onPickImage={handleImagePick} isVideo={false} />
        </>
    )
}
export default ProofOfAddress