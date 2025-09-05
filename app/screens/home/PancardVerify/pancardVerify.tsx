import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AppearanceContext } from '../../../context/appearanceContext';
import Header from '../../../shared/components/Header/Header';
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../../styles/variables';
import Container from '../../../ui/container';
import CusText from '../../../ui/custom-text';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getRiskObjectData,
    RISK_PROFILE_FINAL,
    setRiskObject,
    USER_DATA,
} from '../../../utils/Commanutils';
import { CheckKycStatus, CheckPANStatus, getRiskProfileInvestorAPi } from '../../../api/homeapi';
import CommonModal from '../../../shared/components/CommonAlert/commonModal';
import InputField from '../../../ui/InputField';
import { ActivityIndicator, BackHandler, Keyboard, TouchableOpacity } from 'react-native';
import { showToast, toastTypes } from '../../../services/toastService';

const PancardVerify = () => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute()
    const [panError, setPanError] = useState<boolean>(false);
    const [nameAsPanError, setNameAsPanError] = useState<boolean>(false);
    const [pinError, setPinError] = useState<boolean>(false);
    const [districtError, setDistrictError] = useState<boolean>(false);
    const [PANValid, setPANValid] = useState<boolean>(false);
    const [isLoad, setIsLaod] = useState<boolean>(false);
    const [isPanLoad, setIsPanLaod] = useState<boolean>(false);
    const [isPanValidated, setIsPanValidated] = useState<boolean>(false);
    const [checkPancardData, setcheckPancardData] = useState<any>({});
    const [kycStatus, setKycStatus] = useState<any>(false);
    const specialregex = /^[a-zA-Z0-9 ]*$/
    const [Form, setForm] = useState({
        panNumber: '',
        nameAsPan: '',
        pinCode: '',
        district: ''
    });

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

        if (route?.params?.panData) {
            setIsPanValidated(true)
            setForm({
                ...Form,
                panNumber: route?.params?.panData?.pan_no,
                nameAsPan: route?.params?.panData?.nameAsPan || '',
                pinCode: route?.params?.panData?.pincode,
                district: route?.params?.panData?.district,
            });
        }

    }, [isFocused]);

    const validate = () => {
        if (!Form.panNumber) {
            setPanError(true);
            return;
        }
        else if (!specialregex.test(Form.panNumber)) {
            showToast(toastTypes.error, 'Please Enter valid PAN Number');
            return;
        } else if (Form.panNumber.length != 10) {
            showToast(toastTypes.error, "Please enter valid PAN number")
            return;
        }
        else if (!Form.nameAsPan) {
            setNameAsPanError(true);
            return;
        }
        else if (!Form.pinCode) {
            setPinError(true);
            return;
        }
        else if (!Form.district) {
            setDistrictError(true);
            return;
        } else {
            checkKycStatus()
        }
    };

    const validatePanCard = async () => {
        try {
            if (Form.panNumber === '' || Form.panNumber === null || Form.panNumber === undefined) {
                showToast(toastTypes.error, 'Please Enter PAN Number');
                return;
            }

            let payload = {
                pan_no: Form.panNumber
            }
            console.log('PAN Validation Payload : ', payload)
            setIsPanLaod(true)
            const [result, error]: any = await CheckPANStatus(payload)
            console.log('PAN Validation Result : ', result)
            console.log('PAN Validation error: ', error)

            if (result) {
                // console.log('PAN Validation Success : ', result)
                setIsPanLaod(false)

                if (result?.data) {
                    setIsPanValidated(true)
                    setcheckPancardData(result?.data)
                    setKycStatus(result?.data?.kycStatus)
                    showToast(toastTypes.info, result?.msg || 'PAN validation successful')
                } else {
                    setIsPanValidated(false)
                    showToast(toastTypes.error, 'PAN validation failed')
                }
            } else {
                setIsPanLaod(false)
                console.log('PAN Validation Error : ', error)
                showToast(toastTypes.error, error || 'PAN validation failed')
            }

        } catch (error: any) {
            setIsPanLaod(false)
            console.log('validatePanCard Catch Error : ', error)
            showToast(toastTypes.error, error)
        }
    }

    const checkKycStatus = async () => {
        try {

            let payload = {
                pan_no: Form.panNumber,
                nameAsPan: Form.nameAsPan,
                pincode: Form.pinCode,
                district: Form.district,
            }
            console.log('KYC Payload : ', payload)
            setIsLaod(true)
            const [result, error]: any = await CheckKycStatus(payload)
            console.log('Result 1: ', result)
            console.log('error: ', error)
            if (result) {
                // console.log('Result : ', result)
                setIsLaod(false)
                showToast(toastTypes.success, result?.msg)

                // if (result?.data?.userType === 'Rural') {
                navigation.navigate('AnnualInvest', { data: result?.data, pandata: payload, kycStatus: kycStatus })
                // } else {

                // }

                setForm({
                    ...Form,
                    panNumber: '',
                    nameAsPan: '',
                    pinCode: '',
                    district: '',
                })

            } else {
                setIsLaod(false)
                console.log('checkKycStatus Error : ', error)
                showToast(toastTypes.error, error)
            }

        } catch (error: any) {
            setIsLaod(false)
            console.log('checkKycStatus Catch Error : ', error)
            showToast(toastTypes.error, error)
        }
    }



    return (
        <>
            <Header menubtn name={'Initial On-Boarding'} />
            <Container Xcenter bgcolor={colors.headerColor}>
                <Wrapper color={colors.Hard_White} position='center' width={responsiveWidth(95)} height={responsiveHeight(85)}>
                    <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(2) }}>
                        <CusText size='SS' semibold text={'Initiate On-boarding'} />
                    </Wrapper>
                    <Wrapper
                        position='center'
                        customStyles={{
                            height: responsiveHeight(0.1),
                            width: responsiveWidth(90),
                            backgroundColor: colors.fieldborder,

                        }}
                    />
                    <Wrapper position='center' customStyles={{ gap: responsiveWidth(0) }}>
                        <Wrapper row align="end" justify="apart" width={responsiveWidth(90)} customStyles={{}}>
                            <InputField
                                label="PAN"
                                labelStyle={{ color: colors.Hard_Black, fontWeight: '600', fontSize: fontSize.middleSmall }}
                                autoCapitalize="characters"
                                value={Form.panNumber}
                                width={responsiveWidth(68)}
                                placeholder="Enter PAN"
                                editable={!isPanLoad}
                                onChangeText={(value: string) => {
                                    if (value) {
                                        setPanError(false);
                                    }
                                    setIsPanValidated(false); // Reset validation when PAN changes
                                    setForm({ ...Form, panNumber: value });
                                }}
                                fieldViewStyle={{
                                    // height: responsiveWidth(9),
                                    borderRadius: borderRadius.normal
                                }}
                                keyboardType="email-address"
                                borderColor={colors.placeholderColor}
                                error={PANValid ? 'Please enter valid PAN number' : panError ? 'Please enter PAN number.' : null}
                                required
                            />
                            <TouchableOpacity activeOpacity={0.6} onPress={() => { validatePanCard() }}>
                                <Wrapper width={responsiveWidth(20)} color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingVertical: responsiveWidth(3), }}>
                                    {
                                        isPanLoad ?
                                            <Wrapper>
                                                <ActivityIndicator
                                                    color={colors.Hard_White}
                                                    size={fontSize.normal}
                                                />
                                            </Wrapper> :
                                            <CusText position='center' bold color={colors.Hard_White} text={'Check'} />
                                    }

                                </Wrapper>
                            </TouchableOpacity>
                        </Wrapper>

                        <InputField
                            label="Name As PAN"
                            labelStyle={{ color: colors.Hard_Black, fontWeight: '600', fontSize: fontSize.middleSmall }}
                            value={Form.nameAsPan}
                            width={responsiveWidth(90)}
                            placeholder="Enter Name As PAN"
                            editable={isPanValidated}
                            onChangeText={(value: string) => {
                                if (value) {
                                    setNameAsPanError(false);
                                }
                                setForm({ ...Form, nameAsPan: value });
                            }}
                            fieldViewStyle={{
                                borderRadius: borderRadius.normal
                            }}
                            keyboardType="default"
                            borderColor={colors.placeholderColor}
                            error={nameAsPanError ? 'Please enter Name As PAN.' : null}
                            required
                        />

                        <InputField
                            label="Pin Code"
                            labelStyle={{ color: colors.Hard_Black, fontWeight: '600', fontSize: fontSize.middleSmall }}
                            value={Form.pinCode}
                            width={responsiveWidth(90)}
                            placeholder="Pin Code"
                            editable={isPanValidated}
                            onChangeText={(value: string) => {
                                if (value) {
                                    setPinError(false);
                                }
                                setForm({ ...Form, pinCode: value });
                            }}
                            fieldViewStyle={{
                                // height: responsiveWidth(9),
                                borderRadius: borderRadius.normal
                            }}

                            keyboardType="email-address"
                            borderColor={colors.placeholderColor}
                            error={pinError ? 'Please enter Pin Code.' : null}
                            required
                        />
                        <InputField
                            label="District"
                            labelStyle={{ color: colors.Hard_Black, fontWeight: '600', fontSize: fontSize.middleSmall }}
                            value={Form.district}
                            width={responsiveWidth(90)}
                            placeholder="District"
                            editable={isPanValidated}
                            onChangeText={(value: string) => {
                                if (value) {
                                    setDistrictError(false);
                                }
                                setForm({ ...Form, district: value });
                            }}

                            fieldViewStyle={{
                                // height: responsiveWidth(9),
                                borderRadius: borderRadius.normal
                            }}
                            keyboardType="email-address"
                            borderColor={colors.placeholderColor}
                            error={districtError ? 'Please enter District.' : null}
                            required
                        />

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => { validate() }}
                            disabled={!isPanValidated}
                        >
                            <Wrapper
                                position='center'
                                width={responsiveWidth(40)}
                                color={isPanValidated ? colors.orange : colors.placeholderColor}
                                customStyles={{
                                    borderRadius: borderRadius.middleSmall,
                                    paddingVertical: responsiveWidth(2.5),
                                    marginTop: responsiveWidth(5)
                                }}
                            >
                                {
                                    isLoad ?
                                        <Wrapper>
                                            <ActivityIndicator
                                                color={colors.Hard_White}
                                                size={fontSize.normal}
                                            />
                                        </Wrapper> :
                                        <CusText position='center' bold color={colors.Hard_White} text={'Initiate'} />
                                }
                            </Wrapper>
                        </TouchableOpacity>
                    </Wrapper>

                </Wrapper>


            </Container>
        </>
    );
};

export default PancardVerify;
