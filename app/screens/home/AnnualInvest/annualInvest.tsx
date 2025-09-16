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
    getKYC_Details,
    getKYC_ISMember,
    getKYC_PanDetails,
    getRiskObjectData,
    RISK_PROFILE_FINAL,
    setKYC_Details,
    setKYC_PanDetails,
    setRiskObject,
    updateObjectKey,
    USER_DATA,
} from '../../../utils/Commanutils';
import { CheckKycStatus, CreateKYCInvs, getRiskProfileInvestorAPi } from '../../../api/homeapi';
import CommonModal from '../../../shared/components/CommonAlert/commonModal';
import InputField from '../../../ui/InputField';
import { ActivityIndicator, Keyboard, TouchableOpacity } from 'react-native';
import { showToast, toastTypes } from '../../../services/toastService';
import IonIcon from 'react-native-vector-icons/Ionicons';

const AnnualInvest = () => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute()
    console.log('route Data : ', route?.params)
    const [isLoad, setIsLaod] = useState<boolean>(false);
    const [investment, setInvestment] = useState<any>(1);
    const [Form, setForm] = useState({
        panNumber: '',
        pinCode: '',
        district: ''
    });


    useEffect(() => {


    }, [isFocused]);





    const toggleInvestment = (p0: number) => {
        setInvestment(p0)
    }

    const setData = () => {

        let obj: any = { ...route?.params?.pandata, ...route?.params?.data, ...route?.params?.kycStatus };
        console.log('obj : ', obj)
        console.log('obj : ', route?.params?.kycStatus)

        createUserKyc(obj)
    }

    const createUserKyc = async (obj: any) => {
        try {
            setIsLaod(true);

            const data: any = await AsyncStorage.getItem(USER_DATA);
            const parsedData: any = JSON.parse(data)


            let payload: any = {
                userType: obj?.userType,
                pan_no: obj?.pan_no,
                pincode: obj?.pincode,
                district: obj?.district,
                nameAsPan: obj?.nameAsPan,
                isMember: getKYC_ISMember() ? true : false,
                group_leader_id: getKYC_ISMember() ? getKYC_Details()?.user_basic_details?.id : 0,
                user_type: obj?.userType,
                // kycStatus: investment === 2 ? false : true,
                kycStatus: route?.params?.kycStatus,
                annualFund: obj?.userType === 'Rural' ? investment === 2 ? ">=50K" : "<50K" : null,
                investor_id: !getKYC_ISMember() ? getKYC_Details()?.user_basic_details?.id : null,
            }
            if (obj?.userType === 'Rural' && investment === 1) {
                payload.kycStatus = true;
            }
            console.log('createUserKyc Payload : ', payload)

            const [result, error]: any = await CreateKYCInvs(payload)
            if (result) {
                console.log('createUserKyc result : ', result)
                if (getKYC_ISMember()) {
                    const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'member_basic_details', result?.data?.newKyc)
                    setKYC_Details(update_data)
                } else {
                    const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data?.newKyc)
                    setKYC_Details(update_data)
                }

                showToast('success', result?.msg)
                setIsLaod(false); // Stop loader before navigation

                if (investment === 2) {
                    // navigation.navigate('EditDetails', { annualInvest: investment })
                    navigation.navigate('KycInfoPage')
                } else {
                    // navigation.navigate('KycInfoPage')
                    navigation.navigate('KycDashboard')
                }
            } else {
                setIsLaod(false); // Stop loader on error
                console.log('createUserKyc error ', error)
                showToast(toastTypes.error, error?.msg)
            }
        } catch (error: any) {
            setIsLaod(false); // Stop loader on catch error
            console.log('createUserKyc catch Error ', error)
            showToast(toastTypes.error, error)
        }
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
                    {
                        !route?.params?.kycStatus && route?.params?.data?.userType === 'Rural' ? (
                            <>
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
                            </>
                        ) :
                            null
                    }

                    <Wrapper row align='center' position='center' justify='apart' customStyles={{ gap: responsiveWidth(5) }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.navigate('PancardVerify') }}>
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
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { setData() }}>
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
