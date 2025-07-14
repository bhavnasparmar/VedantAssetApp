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
import { CheckKycStatus, getRiskProfileInvestorAPi } from '../../../api/homeapi';
import CommonModal from '../../../shared/components/CommonAlert/commonModal';
import InputField from '../../../ui/InputField';
import { ActivityIndicator, Keyboard, TouchableOpacity } from 'react-native';
import { showToast, toastTypes } from '../../../services/toastService';
import IonIcon from 'react-native-vector-icons/Ionicons';

const AnnualInvest = () => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute()
    const [isLoad, setIsLaod] = useState<boolean>(false);
    const [investment, setInvestment] = useState<any>(1);
    const [Form, setForm] = useState({
        panNumber: '',
        pinCode: '',
        district: ''
    });


    useEffect(() => {

        console.log('route?.params?.pandata 11: ',route?.params?.pandata)

    }, [isFocused]);

    const validate = () => {

        //  if (!panPattern.test(Form.panNumber)) {
        //   setPANValid(true);
        //   return;
        // } 

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

    const checkKycStatus = async () => {
        try {

            let payload = {
                "pan_no": Form.panNumber,
                "pincode": Form.pinCode,
                "district": Form.district,
            }
            console.log('KYC Payload : ', payload)
            setIsLaod(true)
            const [result, error]: any = await CheckKycStatus(payload)
            console.log('Result 1: ', result)
            console.log('error: ', error)
            if (result) {
                console.log('Result : ', result)
                setIsLaod(false)
                showToast(toastTypes.success, result?.msg)
                setForm({
                    ...Form,
                    panNumber: '',
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

    const toggleInvestment = (p0: number) => {
        setInvestment(p0)
    }



    return (
        <>
            <Header menubtn name={'Initial On-Boarding'} />
            <Container Xcenter bgcolor={colors.headerColor}>
                <Wrapper color={colors.Hard_White} position='center' width={responsiveWidth(95)} height={responsiveHeight(85)}>
                    <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(4) }}>
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
                    <Wrapper row justify='apart' align='center' customStyles={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(4) }}>
                        <Wrapper row align='center' customStyles={{ gap: responsiveWidth(4) }}>
                            <CusText medium size='SS' text={!route?.params?.data?.kycstatus ? 'KYC not validated' : 'KYC validated'} />
                            <IonIcon name={!route?.params?.data?.kycstatus ? 'close' : 'checkmark'} color={colors.Hard_Black} size={responsiveWidth(5)} />
                        </Wrapper>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.navigate('PancardVerify', { panData: route?.params?.pandata }) }}>
                        <CusText text={'Edit'} size='SS' color={colors.action} />
                        </TouchableOpacity>
                    </Wrapper>
                    <Wrapper
                        position='center'
                        customStyles={{
                            height: responsiveHeight(0.1),
                            width: responsiveWidth(90),
                            backgroundColor: colors.fieldborder,

                        }}
                    />
                    <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(4), gap: responsiveWidth(2) }}>

                        <CusText medium size='SS' text={'Your annual investment in mutual funds will be,'} />
                        <Wrapper row align='center' customStyles={{ gap: responsiveWidth(5) }}>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => { toggleInvestment(1) }}>
                                <Wrapper row align='center' customStyles={{ gap: responsiveWidth(2) }}>
                                    <IonIcon name={investment === 1 ? 'checkbox' : 'square-outline'} color={investment === 1 ? colors.primary : colors.Hard_Black} size={responsiveWidth(4)} />
                                    <CusText medium size='MS' text={'less than 50,000'} />
                                </Wrapper>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => { toggleInvestment(2) }}>
                                <Wrapper row align='center' customStyles={{ gap: responsiveWidth(2) }}>
                                    <IonIcon name={investment === 2 ? 'checkbox' : 'square-outline'} color={investment === 2 ? colors.primary : colors.Hard_Black} size={responsiveWidth(4)} />
                                    <CusText medium size='MS' text={'Equal And Above 50,000'} />
                                </Wrapper>
                            </TouchableOpacity>
                        </Wrapper>

                    </Wrapper>
                    <Wrapper
                        position='center'
                        customStyles={{
                            height: responsiveHeight(0.1),
                            width: responsiveWidth(90),
                            backgroundColor: colors.fieldborder,

                        }}
                    />
                    <Wrapper row align='center' position='center' justify='apart' customStyles={{ gap: responsiveWidth(5) }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => {navigation.navigate('PancardVerify') }}>
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
                                <CusText position='center' bold color={colors.Hard_White} text={'Next'} />
                                {/* } */}

                            </Wrapper>
                        </TouchableOpacity>
                    </Wrapper>
                </Wrapper>


            </Container>
        </>
    );
};

export default AnnualInvest;
