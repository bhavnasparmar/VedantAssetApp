
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import Container from '../../../ui/container';
import Wrapper from '../../../ui/wrapper';
import CusText from '../../../ui/custom-text';
import CusButton from '../../../ui/custom-button';
import Spacer from '../../../ui/spacer';
import Header from '../../../shared/components/Header/Header';
import { AppearanceContext } from '../../../context/appearanceContext';
import {
    borderRadius,
    colors,
    responsiveHeight,
    responsiveWidth
} from '../../../styles/variables';
import {
    getKYC_Details,
    getLoginUserDetails,
    USER_DATA
} from '../../../utils/Commanutils';
import { getKycUsersApi } from '../../../api/homeapi';
import { showToast, toastTypes } from '../../../services/toastService';

const Profile = () => {
    const navigation: any = useNavigation();
    const isFocused = useIsFocused();
    const { colors: themeColors }: any = useContext(AppearanceContext);

    const [userData, setUserData] = useState<any>(null);
    const [kycData, setKycData] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [familyMembers, setFamilyMembers] = useState<any[]>([]);
    const [kycUsers, setKycUsers] = useState<any>(null);
    const [isLoadingKycUsers, setIsLoadingKycUsers] = useState(false);

    useEffect(() => {
        if (isFocused) {
            loadUserData();
        }
    }, [isFocused]);

    const loadUserData = async () => {
        try {
            const userDetails = await AsyncStorage.getItem(USER_DATA);
            const kycDetails = getKYC_Details();

            if (userDetails) {
                const parsedUser = JSON.parse(userDetails);
                setUserData(parsedUser);
            }

            if (kycDetails) {
                setKycData(kycDetails);
                // Fetch KYC users data with investor_id
                await fetchKycUsers(kycDetails?.user_basic_details?.id);
            }
        } catch (error) {
            console.log('Error loading user data:', error);
        }
    };

    const fetchKycUsers = async (investorId: any) => {
        if (!investorId) {
            console.log('No investor ID found');
            return;
        }

        try {
            setIsLoadingKycUsers(true);

            const payload = {
                investor_id: investorId
            };

            console.log('KYC Users Payload:', payload);

            const [result, error]: any = await getKycUsersApi(payload);

            if (result?.data) {
                console.log('KYC Users Result:', result.data);
                setKycUsers(result.data);
            } else {
                console.log('KYC Users Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to fetch user data');
            }
        } catch (error: any) {
            console.log('KYC Users Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while fetching user data');
        } finally {
            setIsLoadingKycUsers(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUserData();
        setRefreshing(false);
    };

    const getKycStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'verified':
            case 'completed':
                return colors.green;
            case 'pending':
                return colors.orange;
            case 'not verified':
            case 'rejected':
                return colors.red;
            default:
                return colors.gray;
        }
    };

    const getKycStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'verified':
            case 'completed':
                return 'checkmark-circle';
            case 'pending':
                return 'time';
            case 'not verified':
            case 'rejected':
                return 'close-circle';
            default:
                return 'help-circle';
        }
    };

    const checkKycSteps = () => {

        if (getKYC_Details() && getKYC_Details()?.user_basic_details?.last_kyc_step === 1) {
            navigation.navigate('KycInfoPage')
            // navigation.navigate('KycDashboard')
            //KycDashboard
            // navigation.navigate('KycDigiLockerInfo')
        } else if (getKYC_Details() && getKYC_Details()?.user_basic_details?.last_kyc_step >= 2) {
            navigation.navigate('KycDashboard')
        }
        else {
            navigation.navigate('PancardVerify')
            // navigation.navigate('KycDashboard')
        }
    }

    const ProfileInfoCard = ({ title, value, icon, onPress }: any) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={{
                backgroundColor: themeColors.Hard_White,
                borderRadius: borderRadius.medium,
                padding: responsiveWidth(4),
                marginBottom: responsiveWidth(3),
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                borderLeftWidth: 4,
                borderLeftColor: themeColors.primary
            }}
        >
            <Wrapper row align="center" justify="apart">
                <Wrapper row align="center" flex>
                    <Wrapper
                        position="center"
                        align="center"
                        justify="center"
                        width={responsiveWidth(10)}
                        height={responsiveWidth(10)}
                        color={themeColors.primary + '20'}
                        customStyles={{ borderRadius: responsiveWidth(5) }}
                    >
                        <IonIcon
                            name={icon}
                            size={responsiveWidth(5)}
                            color={themeColors.primary}
                        />
                    </Wrapper>

                    <Spacer x="S" />

                    <Wrapper flex>
                        <CusText
                            text={title}
                            size="S"
                            color={themeColors.gray}
                            customStyles={{ marginBottom: 2 }}
                        />
                        <CusText
                            text={value || 'Not Available'}
                            size="M"
                            medium
                            color={themeColors.Hard_Black}
                        />
                    </Wrapper>
                </Wrapper>

                {onPress && (
                    <IonIcon
                        name="chevron-forward"
                        size={responsiveWidth(5)}
                        color={themeColors.gray}
                    />
                )}
            </Wrapper>
        </TouchableOpacity>
    );

    const StatusBadge = ({ status, type }: any) => {
        const statusColor = getKycStatusColor(status.toString());
        const statusIcon = getKycStatusIcon(status.toString());

        return (
            <Wrapper
                row
                align="center"
                color={statusColor + '20'}
                customStyles={{
                    paddingHorizontal: responsiveWidth(3),
                    paddingVertical: responsiveWidth(1),
                    borderRadius: borderRadius.small,
                    borderWidth: 1,
                    borderColor: statusColor + '40'
                }}
            >
                <IonIcon
                    name={statusIcon}
                    size={responsiveWidth(4)}
                    color={statusColor}
                />
                <Spacer x="XS" />
                <CusText
                    text={status.toString() || 'Unknown'}
                    size="XS"
                    bold
                    color={statusColor}
                />
            </Wrapper>
        );
    };

    return (
        <>
            <Header backBtn name="Profile" />

            <Container bgcolor={themeColors.background} contentWidth="100%">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    contentContainerStyle={{ paddingBottom: responsiveHeight(2) }}
                >
                    {/* Profile Header */}
                    <Spacer y='XS' />
                    <LinearGradient
                        colors={[themeColors.primary, themeColors.primary + 'CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            // marginHorizontal: responsiveWidth(2.5),
                            borderRadius: borderRadius.medium,
                            // alignItems: "center",
                            // justifyContent: 'center',
                            // alignContent: 'center',
                            alignSelf: 'center',
                            width: responsiveWidth(95),
                            paddingVertical: responsiveHeight(1),
                            paddingHorizontal: responsiveWidth(1),
                            // marginBottom: responsiveHeight(2)
                        }}
                    >
                        <Wrapper row align="center" customStyles={{ gap: responsiveWidth(3) }}>
                            {/* Profile Avatar */}
                            <Wrapper
                                position="center"
                                align="center"
                                justify="center"
                                width={responsiveWidth(15)}
                                height={responsiveWidth(15)}
                                color={themeColors.Hard_White}
                                customStyles={{
                                    // borderRadius: responsiveWidth(5),
                                    borderRadius: borderRadius.ring,
                                    marginLeft: responsiveWidth(2)
                                }}
                            >
                                <IonIcon
                                    name="person"
                                    size={responsiveWidth(8)}
                                    color={themeColors.primary}
                                />
                            </Wrapper>
                            <Wrapper >
                                <CusText
                                    text={kycUsers?.name || 'N/A'}
                                    size="N"
                                    bold
                                    color={themeColors.Hard_White}

                                />

                                <CusText
                                    text={kycUsers?.pan_no || 'N/A'}
                                    size="SS"
                                    color={themeColors.Hard_White}
                                    customStyles={{ opacity: 0.9 }}
                                />

                                <CusText
                                    text="Owner | Individual"
                                    size="SS"
                                    color={themeColors.Hard_White}
                                    customStyles={{ opacity: 0.9 }}
                                />
                            </Wrapper>





                        </Wrapper>
                    </LinearGradient>

                    <Spacer y='XS' />

                    {/* Personal Information */}
                    <Wrapper customStyles={{}}>
                        <Wrapper position='center' width={responsiveWidth(95)}>
                            <CusText
                                text="Personal Information"
                                size="M"
                                bold
                                color={themeColors.Hard_Black}
                                customStyles={{}}
                            />

                            <Wrapper
                                color={themeColors.Hard_White}
                                customStyles={{
                                    borderRadius: borderRadius.medium,
                                    padding: responsiveWidth(3),
                                    shadowColor: colors.black,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                    gap: responsiveWidth(1),
                                    // marginBottom: responsiveWidth(4)
                                }}
                            >
                                <Wrapper row align="center" justify="apart" customStyles={{}}>
                                    <CusText text="Date of Birth" size="SS" medium color={colors.Hard_Black} />
                                    <CusText text={kycUsers?.dob || 'N/A'} size="SS" medium color={colors.Hard_Black} />
                                </Wrapper>
                                <Wrapper row align="center" justify="apart" customStyles={{}}>
                                    <CusText text="Mobile No." size="SS" medium color={colors.Hard_Black} />
                                    <CusText text={kycUsers?.reg_mobile || 'N/A'} size="SS" medium color={colors.Hard_Black} />
                                </Wrapper>
                                <Wrapper row align="center" justify="apart" customStyles={{}}>
                                    <CusText text="Email ID" size="SS" medium color={colors.Hard_Black} />
                                    <CusText text={kycUsers?.reg_email || 'N/A'} size="SS" medium color={colors.Hard_Black} />
                                </Wrapper>
                                <Wrapper row justify="apart" customStyles={{}}>
                                    <CusText text="Address" size="SS" medium color={colors.Hard_Black} />
                                    <Wrapper width={responsiveWidth(45)}>
                                        <CusText text={kycUsers?.AddressDetail?.address1 || 'N/A'} size="SS" medium color={colors.Hard_Black} />
                                    </Wrapper>

                                </Wrapper>

                            </Wrapper>
                        </Wrapper>
                        <Spacer y='XS' />
                        <Wrapper position='center' width={responsiveWidth(95)}>
                            <CusText
                                text="KYC Information"
                                size="M"
                                bold
                                color={themeColors.Hard_Black}
                                customStyles={{}}
                            />

                            <Wrapper
                                color={themeColors.Hard_White}
                                customStyles={{
                                    borderRadius: borderRadius.medium,
                                    padding: responsiveWidth(3),
                                    shadowColor: colors.black,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                    gap: responsiveWidth(1),
                                    // marginBottom: responsiveWidth(4)
                                }}
                            >

                                <Wrapper row align="center" justify="apart" customStyles={{}}>
                                    <CusText text="KYC Status" size="SS" medium color={colors.Hard_Black} />

                                </Wrapper>

                                <Wrapper row align="center" justify="apart" customStyles={{}}>
                                    <CusText text="Profile Status" size="SS" medium color={colors.Hard_Black} />
                                    <Wrapper row align="center">
                                        {
                                           kycUsers?.is_kyc_complete ? (
                                                <>
                                                    <Wrapper row align="center" customStyles={{ gap: responsiveWidth(1) }}>
                                                        <IonIcon
                                                            name="checkmark-circle"
                                                            size={responsiveWidth(4)}
                                                            color={colors.green}
                                                        />
                                                        <CusText text="Completed" size="SS" medium color={colors.Hard_Black} />
                                                    </Wrapper>

                                                </>

                                            ) : (
                                                <Wrapper row align="center" customStyles={{ gap: responsiveWidth(1) }}>
                                                    <IonIcon
                                                        name="time"
                                                        size={responsiveWidth(4)}
                                                        color={colors.orange}
                                                    />
                                                    <CusText text="Pending" size="SS" medium color={colors.orange} />
                                                    <TouchableOpacity onPress={() => {
                                                        // navigation.navigate('Main', { screen: 'KycDashboard' })
                                                        checkKycSteps()
                                                    }}>
                                                        <Wrapper position='center' color={colors.orange} customStyles={{ paddingHorizontal: responsiveWidth(1), borderRadius: borderRadius.small }}>
                                                            <CusText text="Initiate Kyc" size="S" medium color={colors.Hard_White} />
                                                        </Wrapper>
                                                    </TouchableOpacity>
                                                </Wrapper>

                                            )
                                        }
                                    </Wrapper>
                                </Wrapper>

                                <Wrapper row align="center" justify="apart">
                                    <CusText text="Account Holding" size="SS" medium color={colors.Hard_Black} />
                                    <CusText text="Not Linked" size="SS" medium color={themeColors.gray} />
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>

                        <Spacer y='XS' />
                        <Wrapper position='center' width={responsiveWidth(95)}>
                            <Wrapper row align="center" justify="apart" customStyles={{}}>
                                <CusText
                                    text="Members Information"
                                    size="M"
                                    bold
                                    color={themeColors.Hard_Black}
                                    customStyles={{}}
                                />
                                <TouchableOpacity onPress={() => { }}>
                                    <Wrapper row align="center" customStyles={{ borderRadius: borderRadius.small, padding: responsiveWidth(1), gap: responsiveWidth(1) }}>
                                        <IonIcon name='pencil-outline' size={responsiveWidth(4)} color={colors.primary} />
                                        <CusText bold color={colors.primary} text={'Add Members'} />
                                    </Wrapper>
                                </TouchableOpacity>
                            </Wrapper>

                            {familyMembers.length === 0 ? (
                                <Wrapper
                                    color={themeColors.Hard_White}
                                    customStyles={{
                                        borderRadius: borderRadius.medium,
                                        padding: responsiveWidth(2),
                                        alignItems: 'center',
                                        shadowColor: colors.black,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3
                                    }}
                                >
                                    <IonIcon
                                        name="people-outline"
                                        size={responsiveWidth(12)}
                                        color={themeColors.gray}
                                    />
                                    {/* <Spacer y='S' /> */}
                                    <CusText
                                        text="No members added"
                                        size="M"
                                        color={themeColors.gray}
                                        position="center"
                                    />
                                    <CusText
                                        text="Add members to manage their investments"
                                        size="S"
                                        color={themeColors.gray}
                                        position="center"
                                        customStyles={{ marginTop: 4, textAlign: 'center' }}
                                    />
                                </Wrapper>
                            ) : (
                                <></>
                            )}
                        </Wrapper>

                        {/* <CusButton
                            title="Edit Profile"
                            width={responsiveWidth(95)}
                            height={responsiveHeight(6)}
                            position="center"
                            radius={borderRadius.medium}
                            lgcolor1={themeColors.primary}
                            lgcolor2={themeColors.primary}
                            textSize="M"
                            textWeight="bold"
                            iconName="pencil"
                            iconFirst={false}
                            onPress={() => {
                                // Navigate to edit profile
                                console.log('Edit profile pressed');
                            }}
                            customStyle={{ marginBottom: responsiveWidth(3) }}
                        />

                        <CusButton
                            title="Update KYC"
                            width={responsiveWidth(95)}
                            height={responsiveHeight(6)}
                            position="center"
                            radius={borderRadius.medium}
                            lgcolor1={colors.orange}
                            lgcolor2={colors.orange}
                            textSize="M"
                            textWeight="bold"
                            iconName="document-text"
                            iconFirst={false}
                            onPress={() => {
                                navigation.navigate('Main', {
                                    screen: 'KycDashboard'
                                });
                            }}
                        /> */}
                    </Wrapper>
                </ScrollView>
            </Container>
        </>
    );
};

export default Profile;

