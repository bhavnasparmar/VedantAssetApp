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
    getRiskObjectData,
    RISK_PROFILE_FINAL,
    setKYC_Details,
    setKYC_PanDetails,
    setRiskObject,
    updateObjectKey,
    USER_DATA,
} from '../../../utils/Commanutils';
import { CheckKycStatus, CreateKYCInvsSignZy, getDlDetailsApi, getRiskProfileInvestorAPi, initiateDlConsent } from '../../../api/homeapi';
import CommonModal from '../../../shared/components/CommonAlert/commonModal';
import InputField from '../../../ui/InputField';
import { ActivityIndicator, Keyboard, TouchableOpacity, Image, Linking } from 'react-native';
import { showToast, toastTypes } from '../../../services/toastService';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const KycDigiLockerInfo = () => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute()
    const [isLoad, setIsLaod] = useState<boolean>(false);
    const [isFinalLoad, setIsFinalLaod] = useState<boolean>(false);
    const [isVerify, setIsVerify] = useState<boolean>(false);

    const [signZyData, setSignZydata] = useState<any>(null);

    useEffect(() => {
        kycSignZyStatus()

    }, [isFocused]);

    const kycSignZyStatus = async () => {
        try {
            let payload = {
                "username": getKYC_Details()?.user_basic_details?.signzy_user_name,
                "password": getKYC_Details()?.user_basic_details?.signzy_kyc_id
            }


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

    const handleContinue = async () => {
        try {
            setIsLaod(true);

            let payload = {
                userToken: signZyData?.id,
                synzyuserId: signZyData?.userId,
                user_id: getKYC_Details()?.user_basic_details?.id
            };

            console.log('DigiLocker Consent Payload:', payload);

            const [result, error]: any = await initiateDlConsent(payload);

            if (result) {
                console.log('DigiLocker Consent Result:', result?.data);
                setIsLaod(false);

                // Extract URL from response and open in browser
                const consentUrl = result?.data?.result?.url
                console.log('consentUrl : ', consentUrl)

                if (consentUrl) {
                    showToast(toastTypes.success, result?.msg || 'Redirecting to DigiLocker...');
                    Linking.openURL(consentUrl).catch((err: any) => console.error('An error occurred', err));
                    setIsVerify(true)
                } else {
                    showToast(toastTypes.error, 'No consent URL received');
                }
            } else {
                setIsLaod(false);
                console.log('DigiLocker Consent Error:', error);
                showToast(toastTypes.error, error || 'Failed to initiate DigiLocker consent');
            }
        } catch (error: any) {
            setIsLaod(false);
            console.log('DigiLocker Consent Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong. Please try again.');
        }
    };

    const getDetails = async () => {
        try {
            let payload = {
                "userToken": signZyData?.id,
                "synzyuserId": signZyData?.userId,
                "investor_id": getKYC_Details()?.user_basic_details?.id
            }
            console.log('DigiLocker getDetails Payload:', payload);
            setIsFinalLaod(true)
            const [result, error]: any = await getDlDetailsApi(payload)

            if (result) {
                console.log('getDetails Result : ', result)
                setIsVerify(true)
                const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data?.investor_data)
                setKYC_Details(update_data)
                setIsFinalLaod(false)
                showToast('success', result?.msg)
                navigation.navigate('KycDashboard')
            } else {
                setIsVerify(false)
                setIsFinalLaod(false)
                console.log('getDetails Error : ', error)
                showToast(toastTypes.error, error?.msg)
            }
        } catch (error: any) {
            setIsFinalLaod(false)
            showToast(toastTypes.error, error)
            console.log('getDetails catch Error : ', error)
        }
    }

    return (
        <>
            <Header name={'Initial On-Boarding'} />
            <Container Xcenter bgcolor={colors.headerColor}>
                <Wrapper
                    color={colors.Hard_White}
                    position='center'
                    justify='center'
                    width={responsiveWidth(95)}
                    height={responsiveHeight(85)}
                    customStyles={{
                        borderRadius: borderRadius.medium,
                        paddingHorizontal: responsiveWidth(5),
                        paddingVertical: responsiveHeight(3)
                    }}
                >
                    {/* <Spacer y='L' /> */}

                    {/* Header Section */}
                    <Wrapper position='center' align='center'>
                        <CusText position='center' bold size='L' text={'Aadhaar Based KYC'} color={colors.black} />
                        <Spacer y='XXS' />
                        <CusText
                            position='center'
                            medium
                            size='MS'
                            text={isVerify ? 'Your existing Aadhaar details have been found. Click below to retrieve and continue with your KYC process' : 'Your Aadhar card must be linked to a mobile number to receive and confirm the OTP'}
                            color={colors.Hard_Black}
                            customStyles={{ textAlign: 'center', lineHeight: 20 }}
                        />
                    </Wrapper>

                    <Spacer y='S' />

                    {/* DigiLocker Logo Section */}
                    <Wrapper position='center' align='center'>
                        <Image
                            source={require('../../../assets/Images/digilockerimg.png')}
                            style={{
                                width: responsiveWidth(25),
                                height: responsiveWidth(25),
                                resizeMode: 'contain',
                                marginBottom: responsiveHeight(0)
                            }}
                        />
                    </Wrapper>

                    <Spacer y='S' />

                    {/* How DigiLocker Works Section */}
                    <Wrapper>
                        <CusText position='center' bold size='M' text={isVerify ? 'Retrieve Your Details' : 'How DigiLocker works'} color={colors.black} />
                        <Spacer y='S' />

                        {/* Step 1 */}
                        <Wrapper row align='start' customStyles={{ marginBottom: responsiveHeight(2) }}>
                            <Wrapper
                                position='center'
                                align='center'
                                justify='center'
                                width={responsiveWidth(6)}
                                height={responsiveWidth(6)}
                                color={isVerify ? colors.Hard_White : colors.black}
                                customStyles={{
                                    borderRadius: borderRadius.small,
                                    marginRight: responsiveWidth(3),
                                    marginTop: 2
                                }}
                            >
                                {
                                    isVerify ?
                                        <IonIcon name='checkbox' size={responsiveWidth(6)} style={{ alignSelf: 'center' }} color={colors.green} /> :
                                        <CusText color={colors.Hard_White} bold text={'1'} size='XS' />
                                }

                            </Wrapper>
                            <Wrapper customStyles={{ flex: 1 }}>
                                <CusText
                                    text={isVerify ? 'Your Aadhaar details are already linked and verified in our system' : 'Your KYC related documents are auto-verified using the Digilocker and approved instantly.'}
                                    size='MS'
                                    color={colors.black}
                                    customStyles={{ lineHeight: 20 }}
                                />
                            </Wrapper>
                        </Wrapper>

                        {/* Step 2 */}
                        <Wrapper row align='start' customStyles={{ marginBottom: responsiveHeight(2) }}>
                            <Wrapper
                                position='center'
                                align='center'
                                justify='center'
                                width={responsiveWidth(6)}
                                height={responsiveWidth(6)}
                                color={isVerify ? colors.Hard_White : colors.black}
                                customStyles={{
                                    borderRadius: borderRadius.small,
                                    marginRight: responsiveWidth(3),
                                    marginTop: 2
                                }}
                            >
                                {
                                    isVerify ?
                                        <IonIcon name='checkbox' size={responsiveWidth(6)} style={{ alignSelf: 'center' }} color={colors.green} /> :
                                        <CusText color={colors.Hard_White} bold text={'2'} size='XS' />
                                }

                            </Wrapper>
                            <Wrapper customStyles={{ flex: 1 }}>
                                <CusText
                                    text={isVerify ? 'Click "Get Details and Continue" to retrieve your information and proceed with KYC' : 'To access Digilocker you enter your Aadhar number and confirm the OTP received on the mobile linked to the Aadhar card.'}
                                    size='MS'
                                    color={colors.black}
                                    customStyles={{ lineHeight: 20 }}
                                />
                            </Wrapper>
                        </Wrapper>

                        {/* Step 3 */}
                        <Wrapper row align='start' customStyles={{ marginBottom: responsiveHeight(2) }}>
                            <Wrapper
                                position='center'
                                align='center'
                                justify='center'
                                width={responsiveWidth(6)}
                                height={responsiveWidth(6)}
                                color={isVerify ? colors.Hard_White : colors.black}
                                customStyles={{
                                    borderRadius: borderRadius.small,
                                    marginRight: responsiveWidth(3),
                                    marginTop: 2
                                }}
                            >
                                {
                                    isVerify ?
                                        <IonIcon name='checkbox' size={responsiveWidth(6)} style={{ alignSelf: 'center' }} color={colors.green} /> :
                                        <CusText color={colors.Hard_White} bold text={'3'} size='XS' />
                                }

                            </Wrapper>
                            <Wrapper customStyles={{ flex: 1 }}>
                                <CusText
                                    text={isVerify ? 'This will save time by auto-filling your verified documents and information' : 'You will be redirected to the Digilocker page wherein you need to provide consent for sharing document/information with CRA.'}
                                    size='MS'
                                    color={colors.black}
                                    customStyles={{ lineHeight: 20 }}
                                />
                            </Wrapper>
                        </Wrapper>
                    </Wrapper>

                    {/* <Spacer y='S' /> */}

                    {/* Continue Button */}
                    <TouchableOpacity onPress={() => { isVerify ? getDetails() : handleContinue() }} disabled={isLoad}>
                        <Wrapper
                            position='center'
                            row
                            align='center'
                            justify='center'
                            color={isLoad ? colors.gray : (colors.orange || '#FF9800')}
                            customStyles={{
                                borderRadius: borderRadius.middleSmall,
                                paddingVertical: responsiveHeight(1.5),
                                paddingHorizontal: responsiveWidth(5),
                                opacity: isLoad ? 0.7 : 1
                            }}
                        >
                            {isFinalLoad || isLoad ? (
                                <ActivityIndicator color={colors.Hard_White} size="small" />
                            ) : (
                                <>
                                    <CusText color={colors.Hard_White} size='MS' bold text={isVerify ? 'Get Details and Continue' : 'Continue'} />
                                    <Spacer x='S' />
                                    <IonIcon name='arrow-forward-outline' color={colors.Hard_White} size={responsiveWidth(5)} />
                                </>
                            )}
                        </Wrapper>
                    </TouchableOpacity>

                    <Spacer y='S' />

                    {/* Note Section */}
                    <Wrapper
                        position='center'
                        align='center'
                        color={colors.fieldborder}
                        customStyles={{
                            borderRadius: borderRadius.small,
                            paddingVertical: responsiveHeight(1.5),
                            paddingHorizontal: responsiveWidth(4)
                        }}
                    >
                        <CusText
                            text={isVerify ? 'Note: Your Aadhaar details are already verified and ready to use for quick KYC completion' : 'Note: Ensure your Aadhar is linked to your mobile number for seamless verification'}
                            size='S'
                            medium
                            color={isVerify ? colors.green : colors.Hard_Black}
                            position='center'
                            customStyles={{ textAlign: 'center', lineHeight: 16 }}
                        />
                    </Wrapper>
                </Wrapper>
            </Container>
        </>
    );
};

export default KycDigiLockerInfo;
