import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, ActivityIndicator, Image, Linking } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Container from '../../../../ui/container';
import Wrapper from '../../../../ui/wrapper';
import Spacer from '../../../../ui/spacer';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Header from '../../../../shared/components/Header/Header';
import { borderRadius, colors, responsiveHeight, responsiveWidth } from '../../../../styles/variables';
import CusText from '../../../../ui/custom-text';

import { getInvestorSummaryApi, completeKycApi, CreateKYCInvsSignZy, completeKycFinalApi } from '../../../../api/homeapi';
import { showToast, toastTypes } from '../../../../services/toastService';
import { getKYC_Details, setKYC_Details, updateObjectKey, getImageUrl } from '../../../../utils/Commanutils';
import CheckBox from '../../../../ui/checkBox';

const QuickSummary = ({ setSelectedTab }: any) => {
    const isFocused = useIsFocused();
    const [summaryData, setSummaryData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [signZyData, setSignZydata] = useState<any>(null);
    const [expandedSections, setExpandedSections] = useState<any>({
        personal: false,
        address: false,
        fatca: false,
        bank: false,
        nominee: false,
        documents: false
    });

    useEffect(() => {
        getInvestorSummary();
        kycSignZyStatus()
    }, [isFocused]);

    const getInvestorSummary = async () => {
        try {
            setIsLoading(true);
            const investorId = getKYC_Details()?.user_basic_details?.id;

            if (investorId) {
                const [result, error]: any = await getInvestorSummaryApi(investorId);

                if (result?.data) {
                    console.log('Investor Summary Result:', result?.data);
                    setSummaryData(result.data);
                } else {
                    console.log('Investor Summary Error:', error);
                    showToast(toastTypes.error, error?.msg || 'Failed to fetch summary');
                }
            }
        } catch (error: any) {
            console.log('Investor Summary Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching summary');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSections((prevState: any) => {
            // If the clicked section is already open, close it
            if (prevState[section]) {
                return {
                    ...prevState,
                    [section]: false
                };
            }

            // Close all sections and open only the clicked one
            const newState = Object.keys(prevState).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {} as any);

            newState[section] = true;
            return newState;
        });
    };

    const kycSignZyStatus = async () => {
        try {
            let payload = {
                "username": getKYC_Details()?.user_basic_details?.signzy_user_name,
                "password": getKYC_Details()?.user_basic_details?.signzy_kyc_id
            }
            const [result, error]: any = await CreateKYCInvsSignZy(payload)
            if (result) {
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


    const handleCompleteKyc = async () => {
        if (!isAgreed) {
            showToast(toastTypes.error, 'Please agree to the terms before completing KYC');
            return;
        }

        try {
            setIsCompleting(true);
            const investorId = getKYC_Details()?.user_basic_details?.id;

            const payload = {
                "userToken": signZyData?.id,
                "synzyuserId": signZyData?.userId,

            }
            console.log('payload : ', payload);
            const [result, error]: any = await completeKycApi(payload);

            if (result) {
                console.log('Complete KYC Result:', result);
                handleCompleteKycFinal(result)
                // showToast(toastTypes.success, result?.msg || 'KYC completed successfully');
                // return
                // // Update KYC details if needed
                // if (result?.data) {
                //     const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data);
                //     setKYC_Details(update_data);
                // }

                // // Navigate to KYC Complete
                // setSelectedTab('KycComplete');
            } else {
                console.log('Complete KYC Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to complete KYC');
            }
        } catch (error: any) {
            console.log('Complete KYC Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while completing KYC');
        } finally {
            setIsCompleting(false);
        }
    };

    const handleCompleteKycFinal = async (data: any) => {


        try {



            const payload = {
                fileName: data.data.object.result.combinedPdf,
                userToken: signZyData?.id,
                synzyuserId: signZyData?.userId,
            }

            const [result, error]: any = await completeKycFinalApi(payload);

            if (result) {
                console.log('Complete KYC Result:', result);
                let redirect_data = result?.data?.object?.result?.url
                console.log('Completeredirect_data:', redirect_data);
                // Linking.openURL(redirect_data).catch((err: any) => console.error('An error occurred', err));
                              
                // Navigate to KYC WebView instead of opening external browser
               const currentKycDetails = getKYC_Details();
                const updatedDetails = {
                    ...currentKycDetails,
                    webview_url: redirect_data
                };
                setKYC_Details(updatedDetails);
                
                // Navigate to KYC WebView
                setSelectedTab('KycWebView');
                // return
                // // Update KYC details if needed
                // if (result?.data) {
                //     const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'user_basic_details', result?.data);
                //     setKYC_Details(update_data);
                // }

                // // Navigate to KYC Complete
                // setSelectedTab('KycComplete');
            } else {
                console.log('Complete KYC Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to complete KYC');
            }
        } catch (error: any) {
            console.log('Complete KYC Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while completing KYC');
        } finally {
            setIsCompleting(false);
        }
    };

    const renderAccordionItem = (title: string, sectionKey: string, content: any, editAction: () => void) => (
        <Wrapper customStyles={{ marginBottom: responsiveWidth(3) }}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleSection(sectionKey)}
                style={{
                    backgroundColor: colors.lightGray,
                    padding: responsiveWidth(4),
                    borderRadius: borderRadius.medium,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <CusText text={title} size="M" semibold color={colors.Hard_Black} />
                <IonIcon
                    name={expandedSections[sectionKey] ? "chevron-up" : "chevron-down"}
                    size={responsiveWidth(5)}
                    color={colors.gray}
                />
            </TouchableOpacity>

            {expandedSections[sectionKey] && (
                <Wrapper
                    color={colors.Hard_White}
                    customStyles={{
                        padding: responsiveWidth(4),
                        borderRadius: borderRadius.medium,
                        marginTop: responsiveWidth(1),
                        borderWidth: 1,
                        borderColor: colors.fieldborder
                    }}
                >
                    {content}
                </Wrapper>
            )}
        </Wrapper>
    );

    const renderPersonalInfoContent = () => (
        <Wrapper customStyles={{ padding: responsiveWidth(1) }}>
            {/* Header without Edit Button */}
            <Wrapper row align="center" justify="apart" customStyles={{ marginBottom: responsiveWidth(3) }}>
                <CusText text="Personal Information" size="M" bold color={colors.Hard_Black} />
            </Wrapper>

            {/* Info Cards Grid */}
            <Wrapper row customStyles={{ flexWrap: 'wrap', gap: responsiveWidth(2) }}>
                {/* Full Name Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.primary1,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="person" size={responsiveWidth(4)} color={colors.primary1} />
                        <Spacer x="XS" />
                        <CusText text="Full Name" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* PAN Number Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.orange,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="card" size={responsiveWidth(4)} color={colors.orange} />
                        <Spacer x="XS" />
                        <CusText text="PAN Number" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.pan_no || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* Date of Birth Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.green,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="calendar" size={responsiveWidth(4)} color={colors.green} />
                        <Spacer x="XS" />
                        <CusText text="Date of Birth" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText
                        text={summaryData?.dob ? new Date(summaryData.dob).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        }) : 'N/A'}
                        size="S"
                        color={colors.Hard_Black}
                        bold
                    />
                </Wrapper>

                {/* Gender Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.purple,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="male-female" size={responsiveWidth(4)} color={colors.purple} />
                        <Spacer x="XS" />
                        <CusText text="Gender" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.Gender?.gender || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* Marital Status Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.red,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="heart" size={responsiveWidth(4)} color={colors.red} />
                        <Spacer x="XS" />
                        <CusText text="Marital Status" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.MaritalStatus?.status || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* Father's Name Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.blue,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="man" size={responsiveWidth(4)} color={colors.blue} />
                        <Spacer x="XS" />
                        <CusText text="Father's Name" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.fathers_name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* Mother's Name Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.pink,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="woman" size={responsiveWidth(4)} color={colors.pink} />
                        <Spacer x="XS" />
                        <CusText text="Mother's Name" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.mothers_name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>
            </Wrapper>
        </Wrapper>
    );

    const renderAddressContent = () => (
        <Wrapper customStyles={{ padding: responsiveWidth(1) }}>
            {/* Header Section */}
            {/* <Wrapper 
                customStyles={{ 
                    backgroundColor: colors.blue + '10',
                    padding: responsiveWidth(3),
                    borderRadius: borderRadius.small,
                    marginBottom: responsiveWidth(4)
                }}
            >
                <CusText text="Permanent Address Information" size="M" bold color={colors.blue} />
            </Wrapper> */}

            {/* Address Cards Grid */}
            <Wrapper row customStyles={{ flexWrap: 'wrap', gap: responsiveWidth(2) }}>
                {/* Address Line 1 Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.primary1,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="location" size={responsiveWidth(4)} color={colors.primary1} />
                        <Spacer x="XS" />
                        <CusText text="Address Line 1" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.AddressDetail?.address1 || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* Address Type Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.orange,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="home" size={responsiveWidth(4)} color={colors.orange} />
                        <Spacer x="XS" />
                        <CusText text="Address Type" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.AddressDetail?.AddressType?.address_type || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* Address Line 2 Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.green,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="location-outline" size={responsiveWidth(4)} color={colors.green} />
                        <Spacer x="XS" />
                        <CusText text="Address Line 2" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.AddressDetail?.address2 || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* City Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.purple,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="business" size={responsiveWidth(4)} color={colors.purple} />
                        <Spacer x="XS" />
                        <CusText text="City" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.AddressDetail?.city || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* District Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.red,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="map" size={responsiveWidth(4)} color={colors.red} />
                        <Spacer x="XS" />
                        <CusText text="District" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.AddressDetail?.district || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* Pincode Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.blue,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="mail" size={responsiveWidth(4)} color={colors.blue} />
                        <Spacer x="XS" />
                        <CusText text="Pincode" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.AddressDetail?.pincode?.toString() || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* State Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.teal,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="flag" size={responsiveWidth(4)} color={colors.teal} />
                        <Spacer x="XS" />
                        <CusText text="State" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.AddressDetail?.StateMaster?.name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>

                {/* Country Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderLeftWidth: 4,
                        borderLeftColor: colors.pink,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                        <IonIcon name="earth" size={responsiveWidth(4)} color={colors.pink} />
                        <Spacer x="XS" />
                        <CusText text="Country" size="XS" color={colors.gray} medium />
                    </Wrapper>
                    <CusText text={summaryData?.AddressDetail?.CountryMaster?.name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                </Wrapper>
            </Wrapper>

            {/* Complete Address Section */}
            <Wrapper
                customStyles={{
                    backgroundColor: colors.primary1 + '05',
                    borderRadius: borderRadius.medium,
                    padding: responsiveWidth(3),
                    marginTop: responsiveWidth(4),
                    borderWidth: 1,
                    borderColor: colors.primary1 + '20'
                }}
            >
                <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(2) }}>
                    <IonIcon name="home-outline" size={responsiveWidth(5)} color={colors.primary1} />
                    <Spacer x="XS" />
                    <CusText text="Complete Permanent Address" size="M" bold color={colors.primary1} />
                </Wrapper>
                <CusText
                    text={`${summaryData?.AddressDetail?.address1 || ''} ${summaryData?.AddressDetail?.address2 || ''} ${summaryData?.AddressDetail?.city || ''} ${summaryData?.AddressDetail?.district || ''} ${summaryData?.AddressDetail?.StateMaster?.name || ''} ${summaryData?.AddressDetail?.CountryMaster?.name || ''} ${summaryData?.AddressDetail?.pincode || ''}`.trim()}
                    size="S"
                    color={colors.Hard_Black}
                    medium
                />
            </Wrapper>

            {/* Correspondence Address Section */}
            <Wrapper
                customStyles={{
                    backgroundColor: colors.blue + '05',
                    borderRadius: borderRadius.medium,
                    padding: responsiveWidth(3),
                    marginTop: responsiveWidth(3),
                    borderWidth: 1,
                    borderColor: colors.blue + '20'
                }}
            >
                <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(2) }}>
                    <IonIcon name="mail-outline" size={responsiveWidth(5)} color={colors.blue} />
                    <Spacer x="XS" />
                    <CusText text="Correspondence Address" size="M" bold color={colors.blue} />
                </Wrapper>
                <CusText
                    text={summaryData?.AddressDetail?.same_as_permanent ? "Same as Permanent Address" :
                        `${summaryData?.AddressDetail?.corr_address1 || ''} ${summaryData?.AddressDetail?.corr_address2 || ''} ${summaryData?.AddressDetail?.corr_city || ''} ${summaryData?.AddressDetail?.corr_district || ''} ${summaryData?.AddressDetail?.CorrState?.name || ''} ${summaryData?.AddressDetail?.CorrCountry?.name || ''} ${summaryData?.AddressDetail?.corr_pincode || ''}`.trim()
                    }
                    size="S"
                    color={colors.Hard_Black}
                    medium
                />
            </Wrapper>
        </Wrapper>
    );

    // FATCA Details Content
    const renderFatcaContent = () => {
        const fatcaData = summaryData?.InvestorDeclaration;

        return (
            <Wrapper customStyles={{ padding: responsiveWidth(1) }}>
                {/* Header Section */}
                {/* <Wrapper 
                customStyles={{ 
                    backgroundColor: colors.orange + '10',
                    padding: responsiveWidth(3),
                    borderRadius: borderRadius.small,
                    marginBottom: responsiveWidth(4)
                }}
            >
                <CusText text="FATCA Declaration Information" size="M" bold color={colors.orange} />
            </Wrapper> */}

                {/* FATCA Cards Grid */}
                <Wrapper row customStyles={{ flexWrap: 'wrap', gap: responsiveWidth(2) }}>
                    {/* Indian Citizen Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.green,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="flag" size={responsiveWidth(4)} color={colors.green} />
                            <Spacer x="XS" />
                            <CusText text="Indian Citizen" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={fatcaData?.is_indian_citizen === 'yes' ? 'Yes' : 'No'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* Indian Taxpayer Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.blue,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="receipt" size={responsiveWidth(4)} color={colors.blue} />
                            <Spacer x="XS" />
                            <CusText text="Indian Taxpayer Only" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={fatcaData?.is_indian_taxpayer === 'yes' ? 'Yes' : 'No'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* Politically Exposed Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.red,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="shield" size={responsiveWidth(4)} color={colors.red} />
                            <Spacer x="XS" />
                            <CusText text="Politically Exposed Person" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={fatcaData?.is_politically_exposed === 'yes' ? 'Yes' : 'No'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* Country of Birth Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.purple,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="earth" size={responsiveWidth(4)} color={colors.purple} />
                            <Spacer x="XS" />
                            <CusText text="Country of Birth" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={fatcaData?.ContryOfBirth?.name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* Place of Birth Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.teal,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="location" size={responsiveWidth(4)} color={colors.teal} />
                            <Spacer x="XS" />
                            <CusText text="Place of Birth" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={fatcaData?.POB || 'N/A'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* Occupation Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.pink,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="briefcase" size={responsiveWidth(4)} color={colors.pink} />
                            <Spacer x="XS" />
                            <CusText text="Occupation" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={fatcaData?.OccupationMaster?.occupation || 'N/A'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* Income Source Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.orange,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="cash" size={responsiveWidth(4)} color={colors.orange} />
                            <Spacer x="XS" />
                            <CusText text="Income Source" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={fatcaData?.IncomeSource?.source_name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* Annual Income Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.primary1,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="trending-up" size={responsiveWidth(4)} color={colors.primary1} />
                            <Spacer x="XS" />
                            <CusText text="Annual Income Slab" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={fatcaData?.AnnuaIincomeMaster?.income_range || 'N/A'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>
                </Wrapper>
            </Wrapper>
        )
    }



    // Bank Details Content
    const renderBankContent = () => {
        const bankData = summaryData?.BankAccountDetails[0];
        return (
            <Wrapper customStyles={{ padding: responsiveWidth(1) }}>
                {/* Header Section */}
                {/* <Wrapper
                customStyles={{
                    backgroundColor: colors.primary1 + '10',
                    padding: responsiveWidth(3),
                    borderRadius: borderRadius.small,
                    marginBottom: responsiveWidth(4)
                }}
            >
                <CusText text="Bank Account Information" size="M" bold color={colors.primary1} />
            </Wrapper> */}

                {/* Bank Cards Grid */}
                <Wrapper row customStyles={{ flexWrap: 'wrap', gap: responsiveWidth(2) }}>
                    {/* Account Number Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.primary1,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="card" size={responsiveWidth(4)} color={colors.primary1} />
                            <Spacer x="XS" />
                            <CusText text="Account Number" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={bankData?.account_no || 'N/A'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* Account Type Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.blue,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="library" size={responsiveWidth(4)} color={colors.blue} />
                            <Spacer x="XS" />
                            <CusText text="Account Type" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={bankData?.account_type || 'Savings'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* Bank Name Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.orange,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="business" size={responsiveWidth(4)} color={colors.orange} />
                            <Spacer x="XS" />
                            <CusText text="Bank Name" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={bankData?.BankMaster?.bank_name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* IFSC Code Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.green,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="code" size={responsiveWidth(4)} color={colors.green} />
                            <Spacer x="XS" />
                            <CusText text="IFSC Code" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={bankData?.ifsc || 'N/A'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* MICR Code Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.purple,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="barcode" size={responsiveWidth(4)} color={colors.purple} />
                            <Spacer x="XS" />
                            <CusText text="MICR Code" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={bankData?.micr || 'N/A'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>

                    {/* Branch Card */}
                    <Wrapper
                        customStyles={{
                            backgroundColor: colors.Hard_White,
                            borderRadius: borderRadius.medium,
                            padding: responsiveWidth(3),
                            borderLeftWidth: 4,
                            borderLeftColor: colors.red,
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            width: '48%'
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(1) }}>
                            <IonIcon name="location" size={responsiveWidth(4)} color={colors.red} />
                            <Spacer x="XS" />
                            <CusText text="Branch" size="XS" color={colors.gray} medium />
                        </Wrapper>
                        <CusText text={bankData?.branch || 'N/A'} size="S" color={colors.Hard_Black} bold />
                    </Wrapper>
                </Wrapper>

                {/* Cancelled Cheque Section */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.green + '05',
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        marginTop: responsiveWidth(4),
                        borderWidth: 1,
                        borderColor: colors.green + '20'
                    }}
                >
                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(2) }}>
                        <IonIcon name="document-outline" size={responsiveWidth(5)} color={colors.green} />
                        <Spacer x="S" />
                        <CusText text="Cancelled Cheque" size="M" bold color={colors.green} />
                    </Wrapper>

                    {/* Cancelled Cheque Image */}
                    {summaryData?.bank?.cancelled_cheque ? (
                        <Wrapper
                            customStyles={{
                                backgroundColor: colors.Hard_White,
                                borderRadius: borderRadius.small,
                                padding: responsiveWidth(2),
                                marginBottom: responsiveWidth(2),
                                borderWidth: 1,
                                borderColor: colors.green + '30'
                            }}
                        >
                            <Image
                                source={{ uri: getImageUrl('chequeDoc', summaryData.bank.cancelled_cheque) }}
                                style={{
                                    width: '100%',
                                    height: responsiveWidth(40),
                                    borderRadius: borderRadius.small
                                }}
                                resizeMode="contain"
                            />
                        </Wrapper>
                    ) : (
                        <Wrapper
                            customStyles={{
                                backgroundColor: colors.gray + '10',
                                borderRadius: borderRadius.small,
                                height: responsiveWidth(25),
                                marginBottom: responsiveWidth(2),
                                borderWidth: 1,
                                borderColor: colors.gray + '30',
                                borderStyle: 'dashed'
                            }}
                            align="center"
                            justify="center"
                        >
                            <IonIcon name="document-outline" size={responsiveWidth(8)} color={colors.gray} />
                            <Spacer y="XS" />
                            <CusText text="No cheque image available" size="S" color={colors.gray} />
                        </Wrapper>
                    )}

                    <Wrapper row align="center">
                        <IonIcon name="checkmark-circle" size={responsiveWidth(4)} color={colors.green} />
                        <Spacer x="XS" />
                        <CusText text="Document uploaded and verified" size="S" color={colors.Hard_Black} medium />
                    </Wrapper>
                </Wrapper>
            </Wrapper>
        )
    }

    // Nominee Details Content
    const renderNomineeContent = () => (
        <Wrapper customStyles={{ padding: responsiveWidth(1) }}>
            {summaryData?.NomineeDetails?.map((nominee: any, index: number) => {
                // Calculate age
                const calculateAge = (dob: string) => {
                    const today = new Date();
                    const birthDate = new Date(dob);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    return age;
                };

                const age = calculateAge(nominee.nominee_DOB);

                return (
                    <Wrapper key={nominee.id} customStyles={{ marginBottom: responsiveWidth(4) }}>
                        {/* Nominee Header */}
                        <Wrapper
                            customStyles={{
                                backgroundColor: nominee.nominee_Type === 'Minor' ? colors.orange + '10' : colors.blue + '10',
                                borderRadius: borderRadius.medium,
                                padding: responsiveWidth(3),
                                marginBottom: responsiveWidth(3),
                                borderLeftWidth: 4,
                                borderLeftColor: nominee.nominee_Type === 'Minor' ? colors.orange : colors.blue
                            }}
                        >
                            <Wrapper row align="center">
                                <IonIcon name="person-circle" size={responsiveWidth(6)} color={nominee.nominee_Type === 'Minor' ? colors.orange : colors.blue} />
                                <Spacer x="S" />
                                <Wrapper>
                                    <CusText text={nominee.nominee_name} size="M" bold color={colors.Hard_Black} />
                                    <CusText text={`${nominee.nominee_Type} • ${nominee.NominineeRelationshipType?.relationship} • ${nominee.percentage_allocation}% Allocation`} size="S" color={colors.gray} />
                                    <CusText text={`Age: ${age} years`} size="XS" color={nominee.nominee_Type === 'Minor' ? colors.orange : colors.blue} />
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>

                        {/* Personal Information Section */}
                        <Wrapper
                            customStyles={{
                                backgroundColor: colors.Hard_White,
                                borderRadius: borderRadius.medium,
                                padding: responsiveWidth(3),
                                marginBottom: responsiveWidth(3),
                                borderWidth: 1,
                                borderColor: colors.fieldborder
                            }}
                        >
                            <CusText text="Personal Information" size="M" bold color={colors.Hard_Black} customStyles={{ marginBottom: responsiveWidth(2) }} />

                            <Wrapper row customStyles={{ flexWrap: 'wrap', gap: responsiveWidth(2) }}>
                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="Full Name" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.nominee_name} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="Date of Birth" size="XS" color={colors.gray} medium />
                                    <CusText text={new Date(nominee.nominee_DOB).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="Relationship" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.NominineeRelationshipType?.relationship || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="Identity Type" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.NomineeIdentity?.type || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="Identity Number" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.identity_number || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="Mobile Number" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.mobile_number || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="Email Address" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.email_address || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="Allocation Percentage" size="XS" color={colors.gray} medium />
                                    <CusText text={`${nominee.percentage_allocation}%`} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>

                        {/* Address Information Section */}
                        <Wrapper
                            customStyles={{
                                backgroundColor: colors.Hard_White,
                                borderRadius: borderRadius.medium,
                                padding: responsiveWidth(3),
                                marginBottom: responsiveWidth(3),
                                borderWidth: 1,
                                borderColor: colors.fieldborder
                            }}
                        >
                            <CusText text="Address Information" size="M" bold color={colors.Hard_Black} customStyles={{ marginBottom: responsiveWidth(2) }} />

                            <Wrapper row customStyles={{ flexWrap: 'wrap', gap: responsiveWidth(2) }}>
                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="Address Line 1" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.address_line_1 || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="Pin Code" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.pin_code || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="City" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.city || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '48%' }}>
                                    <CusText text="State" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.StateMaster?.name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>

                                <Wrapper customStyles={{ width: '100%' }}>
                                    <CusText text="Country" size="XS" color={colors.gray} medium />
                                    <CusText text={nominee.CountryMaster?.name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>

                        {/* Guardian Information Section - Only for Minor */}
                        {nominee.nominee_Type === 'Minor' && (
                            <Wrapper
                                customStyles={{
                                    backgroundColor: colors.orange + '05',
                                    borderRadius: borderRadius.medium,
                                    padding: responsiveWidth(3),
                                    borderWidth: 1,
                                    borderColor: colors.orange + '20'
                                }}
                            >
                                <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(2) }}>
                                    <IonIcon name="shield-checkmark" size={responsiveWidth(5)} color={colors.orange} />
                                    <Spacer x="S" />
                                    <CusText text="Guardian Information" size="M" bold color={colors.orange} />
                                </Wrapper>

                                <Wrapper row customStyles={{ flexWrap: 'wrap', gap: responsiveWidth(2) }}>
                                    <Wrapper customStyles={{ width: '48%' }}>
                                        <CusText text="Guardian Name" size="XS" color={colors.gray} medium />
                                        <CusText text={nominee.guardian_name || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                    </Wrapper>

                                    <Wrapper customStyles={{ width: '48%' }}>
                                        <CusText text="Guardian PAN" size="XS" color={colors.gray} medium />
                                        <CusText text={nominee.guardian_PAN || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                    </Wrapper>

                                    <Wrapper customStyles={{ width: '48%' }}>
                                        <CusText text="Guardian DOB" size="XS" color={colors.gray} medium />
                                        <CusText text={nominee.guardian_DOB ? new Date(nominee.guardian_DOB).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'} size="S" color={colors.Hard_Black} bold />
                                    </Wrapper>

                                    <Wrapper customStyles={{ width: '48%' }}>
                                        <CusText text="Relationship" size="XS" color={colors.gray} medium />
                                        <CusText text={nominee.NomineeGuardianRelationship?.relationship || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                    </Wrapper>

                                    <Wrapper customStyles={{ width: '48%' }}>
                                        <CusText text="Guardian Mobile" size="XS" color={colors.gray} medium />
                                        <CusText text={nominee.guardian_mobile || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                    </Wrapper>

                                    <Wrapper customStyles={{ width: '48%' }}>
                                        <CusText text="Guardian Email" size="XS" color={colors.gray} medium />
                                        <CusText text={nominee.guardian_email || 'N/A'} size="S" color={colors.Hard_Black} bold />
                                    </Wrapper>
                                </Wrapper>
                            </Wrapper>
                        )}
                    </Wrapper>
                );
            })}
        </Wrapper>
    );

    // Documents Content
    const renderDocumentsContent = () => (
        <Wrapper customStyles={{ padding: responsiveWidth(1) }}>
            {/* Header Section */}
            {/* <Wrapper
                customStyles={{
                    backgroundColor: colors.green + '10',
                    padding: responsiveWidth(3),
                    borderRadius: borderRadius.small,
                    marginBottom: responsiveWidth(4)
                }}
            >
                <CusText text="Document Verification" size="M" bold color={colors.green} />
            </Wrapper> */}

            {/* Documents Grid */}
            <Wrapper row customStyles={{ gap: responsiveWidth(3), flexWrap: 'wrap' }}>
                {/* Digital Signature Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderWidth: 1,
                        borderColor: colors.green + '30',
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper align="center" customStyles={{ marginBottom: responsiveWidth(2) }}>
                        <Wrapper row align="center" justify="center">
                            <IonIcon name="create" size={responsiveWidth(5)} color={colors.green} />
                            <Spacer x="XS" />
                            <CusText text="Signature" size="M" bold color={colors.green} />
                        </Wrapper>
                    </Wrapper>

                    <CusText text="Your verified signature" size="XS" color={colors.gray} position="center" customStyles={{ marginBottom: responsiveWidth(2) }} />

                    {/* Signature Image */}
                    {summaryData?.PersonalDocument?.signature ? (
                        <Wrapper
                            customStyles={{
                                backgroundColor: colors.Hard_White,
                                borderRadius: borderRadius.small,
                                height: responsiveWidth(20),
                                marginBottom: responsiveWidth(2),
                                borderWidth: 1,
                                borderColor: colors.green + '30'
                            }}
                            align="center"
                            justify="center"
                        >
                            <Image
                                source={{ uri: getImageUrl('signature', summaryData?.PersonalDocument?.signature) }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: borderRadius.small
                                }}
                                resizeMode="contain"
                            />
                        </Wrapper>
                    ) : (
                        <Wrapper
                            customStyles={{
                                backgroundColor: colors.gray + '10',
                                borderRadius: borderRadius.small,
                                height: responsiveWidth(20),
                                marginBottom: responsiveWidth(2),
                                borderWidth: 1,
                                borderColor: colors.gray + '30',
                                borderStyle: 'dashed'
                            }}
                            align="center"
                            justify="center"
                        >
                            <IonIcon name="document-text" size={responsiveWidth(8)} color={colors.gray} />
                            <Spacer y="XS" />
                            <CusText text="No signature available" size="XS" color={colors.gray} position="center" />
                        </Wrapper>
                    )}

                    <Wrapper row align="center" justify="center">
                        <IonIcon name="checkmark-circle" size={responsiveWidth(4)} color={colors.green} />
                        <Spacer x="XS" />
                        <CusText text="Signature Verified" size="S" color={colors.green} bold />
                    </Wrapper>
                </Wrapper>

                {/* Profile Photo Card */}
                <Wrapper
                    customStyles={{
                        backgroundColor: colors.Hard_White,
                        borderRadius: borderRadius.medium,
                        padding: responsiveWidth(3),
                        borderWidth: 1,
                        borderColor: colors.blue + '30',
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        width: '48%'
                    }}
                >
                    <Wrapper align="center" customStyles={{ marginBottom: responsiveWidth(2) }}>
                        <Wrapper row align="center" justify="center">
                            <IonIcon name="camera" size={responsiveWidth(5)} color={colors.blue} />
                            <Spacer x="XS" />
                            <CusText text="Photo" size="M" bold color={colors.blue} />
                        </Wrapper>
                    </Wrapper>

                    <CusText text="Your verified photo" size="XS" color={colors.gray} position="center" customStyles={{ marginBottom: responsiveWidth(2) }} />

                    {/* Photo Image */}
                    {summaryData?.PersonalDocument?.photo ? (
                        <Wrapper
                            customStyles={{
                                backgroundColor: colors.Hard_White,
                                borderRadius: borderRadius.small,
                                height: responsiveWidth(20),
                                marginBottom: responsiveWidth(2),
                                borderWidth: 1,
                                borderColor: colors.blue + '30'
                            }}
                            align="center"
                            justify="center"
                        >
                            <Image
                                source={{ uri: getImageUrl('photo', summaryData?.PersonalDocument?.photo) }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: borderRadius.small
                                }}
                                resizeMode="contain"
                            />
                        </Wrapper>
                    ) : (
                        <Wrapper
                            customStyles={{
                                backgroundColor: colors.gray + '10',
                                borderRadius: borderRadius.small,
                                height: responsiveWidth(20),
                                marginBottom: responsiveWidth(2),
                                borderWidth: 1,
                                borderColor: colors.gray + '30',
                                borderStyle: 'dashed'
                            }}
                            align="center"
                            justify="center"
                        >
                            <IonIcon name="person" size={responsiveWidth(8)} color={colors.gray} />
                            <Spacer y="XS" />
                            <CusText text="No photo available" size="XS" color={colors.gray} position="center" />
                        </Wrapper>
                    )}

                    <Wrapper row align="center" justify="center">
                        <IonIcon name="checkmark-circle" size={responsiveWidth(4)} color={colors.green} />
                        <Spacer x="XS" />
                        <CusText text="Photo Verified" size="S" color={colors.green} bold />
                    </Wrapper>
                </Wrapper>

            </Wrapper>
        </Wrapper>
    );

    if (isLoading) {
        return (
            <>
                <Header menubtn name={'KYC Summary'} />
                <Wrapper position="center" align="center" justify="center" height={responsiveHeight(80)}>
                    <ActivityIndicator size="large" color={colors.primary1} />
                    <Spacer y="S" />
                    <CusText text="Loading summary..." size="M" color={colors.gray} />
                </Wrapper>
            </>
        );
    }

    return (
        <>
            <Header menubtn name={'KYC Summary'} />
            <Spacer y='XS' />
            <Wrapper
                color={colors.Hard_White}
                position="center"
                width={responsiveWidth(95)}
                height={responsiveHeight(85)}
                customStyles={{ borderRadius: borderRadius.medium }}
            >
                <Wrapper customStyles={{ paddingVertical: responsiveWidth(2), paddingHorizontal: responsiveWidth(3) }}>
                    <CusText size="SS" medium text={'KYC Summary'} />
                </Wrapper>
                <Wrapper
                    position='center'
                    customStyles={{
                        height: 2,
                        width: responsiveWidth(90),
                        backgroundColor: colors.fieldborder,
                    }}
                />

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <Wrapper customStyles={{ padding: responsiveWidth(3) }}>

                        {/* Personal Information */}
                        {renderAccordionItem(
                            "Personal and Proof of Identity",
                            "personal",
                            renderPersonalInfoContent(),
                            () => setSelectedTab('PersonalInfo')
                        )}

                        {/* Address Details */}
                        {renderAccordionItem(
                            "Proof of Address",
                            "address",
                            renderAddressContent(),
                            () => setSelectedTab('AddressInfo')
                        )}

                        {/* FATCA Details */}
                        {renderAccordionItem(
                            "FATCA",
                            "fatca",
                            renderFatcaContent(),
                            () => setSelectedTab('Fatca')
                        )}

                        {/* Bank Details */}
                        {renderAccordionItem(
                            "Bank Details",
                            "bank",
                            renderBankContent(),
                            () => setSelectedTab('BankDetails')
                        )}

                        {/* Nominee Details */}
                        {renderAccordionItem(
                            "Nominee Details",
                            "nominee",
                            renderNomineeContent(),
                            () => setSelectedTab('Nominee')
                        )}

                        {/* Documents */}
                        {renderAccordionItem(
                            "Documents",
                            "documents",
                            renderDocumentsContent(),
                            () => setSelectedTab('InPersonVerification')
                        )}

                        {/* <Spacer y="S" /> */}

                        {/* Agreement Checkbox */}
                        <Wrapper row align="center" customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                            <CheckBox
                                isChecked={isAgreed}
                                onPress={() => setIsAgreed(!isAgreed)}
                                label="I agree that the details are reviewed and verified."
                                size={20}
                                checkedColor={colors.orange}
                                uncheckedColor={colors.orange}
                            />

                        </Wrapper>

                        <Spacer y="S" />

                        {/* Edit and Complete KYC Buttons */}
                        <Wrapper row align="center" justify="apart" customStyles={{ gap: responsiveWidth(3) }}>
                            {/* Edit Button */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setSelectedTab('PersonalInfo')}
                                style={{
                                    backgroundColor: colors.primary,
                                    paddingVertical: responsiveWidth(2),
                                    borderRadius: borderRadius.medium,
                                    alignItems: 'center',
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}
                            >
                                <IonIcon name="pencil" size={responsiveWidth(4)} color={colors.Hard_White} />
                                <Spacer x="XS" />
                                <CusText text="Edit Details" size="M" bold color={colors.Hard_White} />
                            </TouchableOpacity>

                            {/* Complete KYC Button */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleCompleteKyc}
                                disabled={isCompleting}
                                style={{
                                    backgroundColor: isCompleting ? colors.gray : colors.orange,
                                    paddingVertical: responsiveWidth(2),
                                    borderRadius: borderRadius.medium,
                                    alignItems: 'center',
                                    flex: 1
                                }}
                            >
                                {isCompleting ? (
                                    <ActivityIndicator color={colors.Hard_White} size="small" />
                                ) : (
                                    <CusText text="Complete KYC" size="M" bold color={colors.Hard_White} />
                                )}
                            </TouchableOpacity>
                        </Wrapper>

                        <Spacer y="S" />
                    </Wrapper>
                </ScrollView>
            </Wrapper>
        </>
    );
};

export default QuickSummary;










