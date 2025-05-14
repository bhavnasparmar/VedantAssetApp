import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { BackHandler, Image, TouchableOpacity, View } from "react-native";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from "../../../../context/appearanceContext";
import ImagePickerModal from "../../../../shared/components/ImagePickerModal";
import { borderRadius, fontSize, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import InputField from "../../../../ui/InputField";
import Container from "../../../../ui/container";
import CusButton from "../../../../ui/custom-button";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import HeaderComponent from "../headercomponent/headercomponent";
import { styles } from "../kycverificationStyles";

import Pdf from 'react-native-pdf';
import DropDown from "../../../../ui/dropdown";

const BankAccountDetail = ({ setSelectedTab, selectedTab, step }: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const [isscanload, setisscanload] = useState(false);
    const [isDetails, setDetails] = useState<any>({});
    const [continueLoading, setcontinueLoading] = useState(false);
    const [imageData, setimageData] = useState<any>({});
    const [isSubmited, setisSubmited] = useState<boolean>(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [signZyData, setsignZyData] = useState<any>({});
    const [isFocus, setIsFocus] = useState(false);
    const [scanVisible, setscanVisible] = useState(false);
    const [fileExt, setfileExt] = useState('');
    const [Form, setForm] = useState({
        cancelCheque: '',
        accountNumber: '',
        bankName: '',
        bankBranch: '',
        IFSC: '',
        MICR: '',
        accountType: '',
    });
    const [FormError, setFormError] = useState({
        cancelCheque: '',
        accountNumber: '',
        bankName: '',
        bankBranch: '',
        IFSC: '',
        MICR: '',
        accountType: '',
    });
    const [type, setBankAccountType] = useState([
        {
            value: 'SB',
            type: 'Savings'
        },
        {
            value: 'CB',
            type: 'Current'
        },
    ])
    const isFocused = useIsFocused();
    const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    useEffect(() => {
        setcontinueLoading(false)
        getDefaultData()
        getSummeryDetails()
        // if (getNew_User()) {
        //     if (step <= getUserObject()?.newKyc?.last_kyc_step) {
        //         setscanVisible(false)
        //         getSummeryDetails()
        //     }
        // } else {
        //     if (step <= getLoginUserDetails()?.user_basic_details?.last_kyc_step) {
        //         setscanVisible(false)
        //         getSummeryDetails()
        //     }
        // }

        return () => {
            setForm({
                ...Form,
                cancelCheque: '',
                accountNumber: '',
                bankName: '',
                bankBranch: '',
                IFSC: '',
                MICR: '',
                accountType: '',
            });
            setFormError({
                ...Form,
                cancelCheque: '',
                accountNumber: '',
                bankName: '',
                bankBranch: '',
                IFSC: '',
                MICR: '',
                accountType: '',
            });
        };
    }, [isFocused]);

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

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const getSummeryDetails = async () => {
      
    }

    const handleImagePick = (response: any) => {
       
    };

    const handleFormChange = (values: any) => {
        const { key, value } = values;
        setForm((prev: any) => ({ ...prev, [key]: value }));
        handleValidate(isSubmited, values);
    };

    const submit = async () => {
     
    };

    const handleValidate = (flag = false, values: any) => {
        if (!flag) return;
        let isValid = true;
        let data = Form;
        if (values) {
            const { key, value } = values;
            data = { ...data, [key]: value };
        }
        let cancelCheque = '';
        if (!data?.cancelCheque) {
            isValid = false;
            cancelCheque = 'cancel Cheque is required';
        }
        let accountNumber = '';
        if (!data?.accountNumber) {
            isValid = false;
            accountNumber = 'account Number is required';
        }
        let bankName = '';
        if (!data?.bankName) {
            isValid = false;
            bankName = 'Bank Name is required';
        }
        let bankBranch = '';
        if (!data?.bankBranch) {
            isValid = false;
            bankBranch = 'bank Branch is required';
        }
        let IFSC = '';
        if (!data?.IFSC) {
            isValid = false;
            IFSC = 'IFSC is required';
        }
        let MICR = '';
        if (!data?.MICR) {
            isValid = false;
            MICR = 'MICR is required';
        }
        let accountType = '';
        if (!data?.accountType) {
            isValid = false;
            accountType = 'accountType is required';
        }
        setFormError({
            cancelCheque,
            accountNumber,
            bankName,
            bankBranch,
            IFSC,
            MICR,
            accountType
        });
        return isValid;
    };

    const clear = () => {
        handleFormChange({ key: 'accountNumber', value: '' })
        handleFormChange({ key: 'bankName', value: '' })
        handleFormChange({ key: 'bankBranch', value: '' })
        handleFormChange({ key: 'IFSC', value: '' })
        handleFormChange({ key: 'MICR', value: '' })
        handleFormChange({ key: 'accountType', value: '' })
    }

    const scan = async () => {
        // try {
        //     clear()
        //     let formData = new FormData();
        //     formData.append("request_type", "updateSignZy");
        //     formData.append("userToken", signZyData?.data?.id);
        //     formData.append("synzyuserId", signZyData?.data?.userId);
        //     if (imageData != null) {
        //         const name = imageData.fileName ? imageData.fileName.replace(/\s/g, '') : imageData.name.replace(/\s/g, '');
        //         let tempName;
        //         tempName = name.replace(/[()]/g, '_');
        //         const FRONT_IMAGE: any = {
        //             name: tempName,
        //             type: imageData.type,
        //             uri: imageData.uri,
        //         };
        //         formData.append("canceled_check_image", FRONT_IMAGE);
        //     }
        //     formData.append("user", getNew_User() ? getUserObject()?.newKyc?.id : getLoginUserDetails()?.user_basic_details?.id);
        //     setisscanload(true)
        //     const result: any = await API.post('kyc/updateBankDetails', formData, {
        //         headers: {
        //             "Content-Type": "multipart/form-data",
        //         }
        //     });
        //     setisscanload(false)
        //     if (result?.code === 200) {
        //         setisscanload(false)
        //         setDetails(result?.data)
        //         handleFormChange({ key: 'accountNumber', value: result?.data?.account_no })
        //         handleFormChange({ key: 'bankName', value: result?.data?.bank_name })
        //         handleFormChange({ key: 'bankBranch', value: result?.data?.branch })
        //         handleFormChange({ key: 'IFSC', value: result?.data?.ifsc })
        //         handleFormChange({ key: 'MICR', value: result?.data?.micr })
        //         handleFormChange({ key: 'accountType', value: result?.data?.account_type === 'Savings' ? 'SB' : 'CB' })
        //     } else {
        //         setisscanload(false)
        //         console.log('scan else Error : ')
        //         showToast(toastTypes.error, result?.msg)
        //     }
        // } catch (error: any) {
        //     setisscanload(false)
        //     console.log('scan catch Error : ', error)
        //     showToast(toastTypes.error, error[0]?.msg)

        // }
    }

    return (
        <>
            <HeaderComponent name={'KYC Verification'} />
            {/* <SubHeader name={'Bank Account Details'} backAction={() => setSelectedTab('nomineeRoute')} /> */}
            {/* <LinearGradient
                style={styles.subHeader}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={[
                    colors.gradient3,
                    colors.gradient4,
                    colors.gradient5,
                ]}>
                <Wrapper row customStyles={styles.HeaderRow}>
                    <TouchableOpacity onPress={() => { setSelectedTab('nomineeRoute') }}>
                        <IonIcon name={'chevron-back-outline'} color={colors.primary1} size={25} />
                    </TouchableOpacity>
                    <Wrapper align="center" justify="center" width={responsiveWidth(80)}>
                        <CusText text={'Bank Account Details'} color={colors.Hard_white} size='N' />
                    </Wrapper>

                </Wrapper>
            </LinearGradient> */}
            <Container Xcenter>
                <Wrapper position="center">
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { setModalVisible(true); }}>
                        <Wrapper
                            customStyles={styles.uploadFrame}
                            height={responsiveWidth(35)}
                            borderColor={colors.inputBorder}
                            align="center"
                            justify="center">
                            {
                                Form.cancelCheque != '' ? null : <View style={[styles.button, { backgroundColor: colors.darkGrayShades }]}><IonIcon disabled name='camera-outline' color={colors.gray} size={30} ></IonIcon></View>
                            }
                            {
                                Form.cancelCheque != '' ?
                                    (
                                        fileExt === 'pdf' ?
                                            <Pdf
                                                trustAllCerts={false}
                                                source={{ uri: Form.cancelCheque, cache: true }}
                                                style={{ height: responsiveHeight(15), width: responsiveWidth(73) }}
                                                onError={(error) => {
                                                    console.error(error);

                                                }}
                                            />
                                            :
                                            <Image
                                                resizeMode="contain"
                                                source={{
                                                    uri: Form.cancelCheque,
                                                }}
                                                height={responsiveWidth(30)}
                                                width={responsiveWidth(84)}
                                                style={{ borderRadius: 10 }}
                                            />
                                    )
                                    :
                                    (
                                        <CusText
                                            text="Take a Photo - Cancelled Cheque"
                                            position="center"
                                            color={colors.gray}
                                        />
                                    )
                            }
                        </Wrapper>
                    </TouchableOpacity>
                    <Spacer y='XXS' />
                    <Wrapper row justify={FormError?.cancelCheque ? 'apart' : 'right'} width={responsiveWidth(90)}>
                        {
                            FormError?.cancelCheque ?
                                <CusText text={FormError?.cancelCheque} size='S' color={colors.gray} underline error />
                                :
                                null
                        }
                        {
                            scanVisible ?
                                <CusButton
                                    loading={isscanload}
                                    customStyle={{ borderRadius: borderRadius.medium }}
                                    width={responsiveWidth(30)}
                                    height={responsiveHeight(5)}
                                    title="Scan"
                                    lgcolor1={colors.primary}
                                    lgcolor2={colors.secondry}
                                    position="center"
                                    onPress={() => { scan() }}
                                />
                                : null
                        }
                    </Wrapper>
                    <InputField
                        editable={false}
                        label="Account Nmuber"
                        width={responsiveWidth(90)}
                        placeholder="Enter Your Account Nmuber"
                        value={Form.accountNumber}
                        // labelStyle={{ color: colors.gray }}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'accountNumber', value })
                        }}
                        borderColor={colors.gray}
                        error={FormError.accountNumber}
                    />
                    <InputField
                        label="Bank Name"
                        width={responsiveWidth(90)}
                        placeholder="Enter Bank Name"
                        value={Form.bankName}
                        // labelStyle={{ color: colors.gray }}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'bankName', value })
                        }}
                        borderColor={colors.gray}
                        error={FormError.bankName}
                    />
                    <DropDown
                        data={type}
                        placeholder={'Select Account Type'}
                        placeholdercolor={colors.gray}
                        labelText="Account Type"
                        required
                        value={Form.accountType}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        valueField="value"
                        labelField={'type'}
                        onChange={(item: any) => {
                            handleFormChange({ key: 'accountType', value: item.value })
                            setIsFocus(false);
                        }}
                        onClear={
                            () => {
                                handleFormChange({ key: 'accountType', value: '' })
                                setIsFocus(false);
                            }
                        }
                        error={FormError?.accountType}
                    />
                    <InputField
                        label="Bank Branch"
                        width={responsiveWidth(90)}
                        placeholder="Enter Your Bank Branch"
                        value={Form.bankBranch}
                        // labelStyle={{ color: colors.gray }}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'bankBranch', value })
                        }}
                        borderColor={colors.gray}
                        error={FormError.bankBranch}
                    />
                    <InputField
                        label="IFSC"
                        width={responsiveWidth(90)}
                        placeholder="Enter Your IFSC"
                        value={Form.IFSC}
                        // labelStyle={{ color: colors.gray }}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'IFSC', value })
                        }}
                        borderColor={colors.gray}
                        error={FormError.IFSC}
                    />
                    <InputField
                        label="MICR"
                        width={responsiveWidth(90)}
                        placeholder="Enter Your MICR"
                        value={Form.MICR}
                        // labelStyle={{ color: colors.gray }}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'MICR', value })
                        }}
                        borderColor={colors.gray}
                        error={FormError.MICR}
                    />
                </Wrapper>
                <Spacer y='N' />
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
export default BankAccountDetail