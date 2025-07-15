import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AppearanceContext } from '../../../context/appearanceContext';
import Header from '../../../shared/components/Header/Header';
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../../styles/variables';
import Container from '../../../ui/container';
import CusText from '../../../ui/custom-text';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getKYC_Details,
    getKYC_PanDetails,
    getRiskObjectData,
    RISK_PROFILE_FINAL,
    setKYC_Details,
    setRiskObject,
    updateObjectKey,
    USER_DATA,
} from '../../../utils/Commanutils';
import { CheckKycStatus, CreateKYCInvs, getRiskProfileInvestorAPi, ValidateStatus } from '../../../api/homeapi';
import CommonModal from '../../../shared/components/CommonAlert/commonModal';
import InputField from '../../../ui/InputField';
import { ActivityIndicator, Keyboard, TouchableOpacity } from 'react-native';
import { showToast, toastTypes } from '../../../services/toastService';
import PanOTPverify from '../../../shared/components/OtpVerify/panotpverify';

const EditDetails = () => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute()
    const [mobileError, setMobileError] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [nameError, setNameError] = useState<boolean>(false);
    const [isLoad, setIsLaod] = useState<boolean>(false);
    const [isMobileEdit, setIsMobileEdit] = useState<boolean>(false);
    const [isEmailEdit, setIsEmailEdit] = useState<boolean>(false);
    const [userData, setUserData] = useState<any>({});
    const [userPayload, setUserPayload] = useState<any>({});
    const [visible, setVisible] = useState(false)
    const specialregex = /^[a-zA-Z0-9 ]*$/
    const [Form, setForm] = useState({
        mobileNo: "",
        email: '',
        name: ''
    });

    const getUserData = async () => {
        // await AsyncStorage.setItem(USER_DATA, JSON.stringify(data?.user));
        const data: any = await AsyncStorage.getItem(USER_DATA);
        const parsedData: any = JSON.parse(data)
        setUserData(parsedData)
        if (parsedData) {
            setForm(
                {
                    ...Form,
                    email: parsedData?.email,
                    mobileNo: parsedData?.mobile,

                }
            )
        }
    }


    useEffect(() => {

        getUserData()
        // console.log('getKYC_PanDetails() ===>>>', getKYC_PanDetails())
    }, [isFocused]);

    const validate = () => {

        //  if (!panPattern.test(Form.panNumber)) {
        //   setPANValid(true);
        //   return;
        // } 

        if (isEmailEdit) {
            showToast('info', 'Email Verification Required')
            return
        }

        if (isMobileEdit) {
            showToast('info', 'Mobile Verification Required')
            return
        }

        if (!Form.mobileNo) {
            setMobileError(true);
            return;
        }

        if (!Form.email) {
            setEmailError(true);
            return;
        }
        if (!Form.name) {
            setNameError(true);
            return;
        }

        createUserKyc()


    };




    const validateData = async (type: any) => {
        try {

            if (isEmailEdit && (Form?.email === '' || Form.email === undefined)) {
                showToast('info', 'Please Enter Email')
                return
            }
            if (isMobileEdit && (Form?.mobileNo === '' || Form.mobileNo === undefined)) {
                showToast('info', 'Please Enter Mobile')
                return
            }

            let payload: any = {
                email: userData?.email,
                mobile: userData?.mobile,
                emailFlag: type === 'email' ? true : false,
                mobileFlag: type === 'mobile' ? true : false,
                reg_email: Form?.email,
                reg_mobile: Form?.mobileNo
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
                // setIsLaod(false)
                console.log('validateData Status Error : ', error)
                showToast(toastTypes.error, error?.msg)
            }

        } catch (error: any) {
            // setIsLaod(false)
            console.log('validateData Status Catch Error : ', error)
            showToast(toastTypes.error, error)
        }
    }

    const createUserKyc = async () => {
        try {

            const data: any = await AsyncStorage.getItem(USER_DATA);
            const parsedData: any = JSON.parse(data)
            let payload: any = {
                pan_no: getKYC_PanDetails()?.pan_no,
                kycStatus: false,
                kyc_id: "NEW",
                kyc_type: "Registered",
                kyc_stage: "NEW",
                User_kycName: Form?.name,
                userType: getKYC_PanDetails()?.userType,
                pincode: getKYC_PanDetails()?.pincode,
                district: getKYC_PanDetails()?.district,
                email: Form?.email,
                mobile: Form?.mobileNo,
                user_id: 0,
                id: parsedData?.id,
                user_type: getKYC_PanDetails()?.userType,
                annualFund: route?.params?.annualInvest === 2 ? ">=50K" : "<=50K"
            }

            const [result, error]: any = await CreateKYCInvs(payload)
            if (result) {
                const update_data = updateObjectKey({}, 'user_basic_details', result?.data?.newKyc)
                setKYC_Details(update_data)
                showToast('success', result?.msg)
            } else {
                console.log('createUserKyc error ', result)
                showToast(toastTypes.error, error?.msg)
            }
        } catch (error: any) {
            console.log('createUserKyc catch Error ', error)
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
                        <Wrapper row align='end' customStyles={{ gap: responsiveWidth(1) }}>
                            <InputField
                                label="Mobile"
                                editable={isMobileEdit ? true : false}
                                labelStyle={{ color: colors.Hard_Black, fontWeight: '600', fontSize: fontSize.middleSmall }}
                                value={Form.mobileNo}
                                width={isMobileEdit ? responsiveWidth(60) : responsiveWidth(79)}
                                placeholder="Enter Mobile"
                                onChangeText={(value: string) => {
                                    if (value) {
                                        setMobileError(false);
                                    }
                                    setForm({ ...Form, mobileNo: value });
                                }}
                                fieldViewStyle={{
                                    // height: responsiveWidth(9),
                                    borderRadius: borderRadius.normal,

                                }}
                                keyboardType="email-address"
                                borderColor={colors.placeholderColor}
                                error={mobileError ? 'Please enter PAN number.' : null}
                                required
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
                        <Wrapper row align='end' customStyles={{ gap: responsiveWidth(1) }}>
                            <InputField
                                label="Email"
                                labelStyle={{ color: colors.Hard_Black, fontWeight: '600', fontSize: fontSize.middleSmall }}
                                editable={isEmailEdit ? true : false}
                                width={isEmailEdit ? responsiveWidth(60) : responsiveWidth(79)}
                                value={Form.email}
                                placeholder="Enter Email"
                                onChangeText={(value: string) => {
                                    if (value) {
                                        setEmailError(false);
                                    }
                                    setForm({ ...Form, email: value });
                                }}
                                fieldViewStyle={{
                                    // height: responsiveWidth(9),
                                    borderRadius: borderRadius.normal
                                }}
                                keyboardType="email-address"
                                borderColor={colors.placeholderColor}
                                error={emailError ? 'Please enter Email.' : null}
                                required
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
                        <InputField
                            label="Name As PAN"
                            labelStyle={{ color: colors.Hard_Black, fontWeight: '600', fontSize: fontSize.middleSmall }}
                            value={Form.name}
                            width={responsiveWidth(90)}
                            placeholder="Enter Name"
                            onChangeText={(value: string) => {
                                if (value) {
                                    setNameError(false);
                                }
                                setForm({ ...Form, name: value });
                            }}

                            fieldViewStyle={{
                                // height: responsiveWidth(9),
                                borderRadius: borderRadius.normal
                            }}
                            keyboardType="email-address"
                            borderColor={colors.placeholderColor}
                            error={nameError ? 'Please enter Name.' : null}
                            required
                        />

                        <Wrapper row align='center' position='center' justify='apart' customStyles={{ gap: responsiveWidth(5) }}>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => { }}>
                                <Wrapper position='center' width={responsiveWidth(40)} color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingVertical: responsiveWidth(2.5), marginTop: responsiveWidth(5) }}>
                                    {/* {
                                    isLoad ? */}
                                    {/* <Wrapper>
                                            <ActivityIndicator
                                                color={colors.Hard_White}
                                                size={fontSize.normal}
                                            />
                                        </Wrapper> : */}
                                    <CusText position='center' bold color={colors.Hard_White} text={'Back'} />
                                    {/* } */}

                                </Wrapper>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => { validate() }}>
                                <Wrapper position='center' width={responsiveWidth(40)} color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingVertical: responsiveWidth(2.5), marginTop: responsiveWidth(5) }}>
                                    {/* {
                                    isLoad ? */}
                                    {/* <Wrapper>
                                            <ActivityIndicator
                                                color={colors.Hard_White}
                                                size={fontSize.normal}
                                            />
                                        </Wrapper> : */}
                                    <CusText position='center' bold color={colors.Hard_White} text={'Next'} />
                                    {/* } */}

                                </Wrapper>
                            </TouchableOpacity>
                        </Wrapper>
                    </Wrapper>

                </Wrapper>


            </Container>
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
    );
};

export default EditDetails;
