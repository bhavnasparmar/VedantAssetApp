
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, RefreshControl, BackHandler } from 'react-native';
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
    USER_DATA,
    setKYC_ISMember,
    setKYC_Details,
    updateObjectKey,
    formatNumber,
    setKYC_MemberDetails
} from '../../../utils/Commanutils';
import { checkKYCStatusApi, getKycUsersApi, UpdateInvestorApi } from '../../../api/homeapi';
import { showToast, toastTypes } from '../../../services/toastService';
import CommonModal from '../../../shared/components/CommonAlert/commonModal';

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
    const [isKycCheckload, setIsKycCheckload] = useState(false);
    const [isVisible, setisVisible] = useState<boolean>(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<any>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        if (isFocused) {
            loadUserData();
        }
    }, [isFocused]);

    useEffect(() => {
        //getRiskProfile();
        checkKyc()
    }, [isFocused]);

    // Hardware back button handler - redirect to Dashboard tab
    useEffect(() => {
        const backAction = () => {
            // Navigate to Dashboard tab within Tabs navigator
            navigation.navigate('Tabs', { screen: 'Dashboard' });
            return true; // Return true to prevent default back behavior
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove(); // Clean up the listener on unmount
    }, [navigation]);

    const checkKyc = async () => {
        const useretail: any = await AsyncStorage.getItem(USER_DATA);
        let useretail1 = JSON.parse(useretail);
        const kycDetails = getKYC_Details();
        console.log('kycDetails data', kycDetails);

        console.log('userData data', useretail1);
        // if (!kycDetails?.user_basic_details?.is_kyc_complete) {
        //     setisVisible(true)
        // }
        if (
            (!useretail1?.InvestorRegistration) ||
            (kycDetails && kycDetails?.user_basic_details?.is_kyc_complete === false) ||
            kycDetails?.user_basic_details?.is_kyc_complete === null
        ) {
            setisVisible(true)
        }
        // setisVisible(true)
    }

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

    const isInvestorMinor = (dob: string) => {
        if (!dob) return false;

        const birthDate = new Date(dob);
        const today = new Date();

        // Calculate age more accurately
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age < 18;
    };

    const checkKYCStatus = async (kycUsers: any) => {
        try {

            const payload = {
                pan_no: kycUsers?.pan_no,
                investor_id: kycUsers?.id,
            }
            console.log('checkKYCStatus Payload : ', payload)
            setIsKycCheckload(true)
            const [result, error]: any = await checkKYCStatusApi(payload)

            if (result) {
                setIsKycCheckload(false)
                console.log('checkKYCStatus Result : ', result)

            } else {
                setIsKycCheckload(false)
                console.log('checkKYCStatus Error : ', error)
                showToast(toastTypes.error, error?.msg)
            }

        } catch (error: any) {
            setIsKycCheckload(false)
            console.log('checkKYCStatus Error : ', error)
            showToast(toastTypes.error, error)
        }
    }

    const checkKycSteps = (p0: boolean, id?: any) => {

        if (p0) {
            setKYC_ISMember(true);


            // If id is available, set the selected member details
            if (id && kycUsers?.GroupMemmber) {
                const selectedMember = kycUsers.GroupMemmber.find((member: any) => member.id === id);
                console.log('Selected Member : ', selectedMember)
                if (selectedMember) {
                    const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'member_basic_details', selectedMember);
                    setKYC_Details(update_data);
                }
            } else {
                const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'member_basic_details', null);
                setKYC_Details(update_data);
            }

            if (getKYC_Details()?.member_basic_details?.last_kyc_step === 1) {
                navigation.navigate('KycInfoPage')
            } else if (getKYC_Details()?.member_basic_details?.last_kyc_step >= 2) {
                navigation.navigate('KycDashboard')
            } else {
                navigation.navigate('PancardVerify')
            }

        } else {
            console.log('User KYC Details : ', getKYC_Details()?.user_basic_details)
            setKYC_ISMember(false);
            const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'member_basic_details', null);
            setKYC_Details(update_data);
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

    const handleBackPress = () => {
        // Navigate to Dashboard tab within Tabs navigator
        navigation.navigate('Tabs', { screen: 'Dashboard' });
    };

    const handleRemoveMember = (member: any) => {
        setMemberToRemove(member);
        setShowRemoveModal(true);
    };

    const confirmRemoveMember = async () => {
        if (!memberToRemove) return;

        try {
            setIsRemoving(true);

            const payload = {
                investor_id: memberToRemove.id,
                group_leader_id: 0
            };

            console.log('Remove Member Payload:', payload);

            const [result, error]: any = await UpdateInvestorApi(payload);

            if (result) {
                console.log('Remove Member Result:', result);
                showToast(toastTypes.success, result?.msg || 'Member removed successfully');

                // Close modal and reset state
                setShowRemoveModal(false);
                setMemberToRemove(null);

                // Refresh the KYC users data
                await loadUserData();

            } else {
                console.log('Remove Member Error:', error);
                showToast(toastTypes.error, error?.msg || 'Failed to remove member');
            }
        } catch (error: any) {
            console.log('Remove Member Catch Error:', error);
            showToast(toastTypes.error, 'Something went wrong while removing member');
        } finally {
            setIsRemoving(false);
        }
    };

    const cancelRemoveMember = () => {
        setShowRemoveModal(false);
        setMemberToRemove(null);
    };

    return (
        <>
            <Header
                backBtn
                name="Profile"
                onBackPress={handleBackPress}
            />

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
                                    <CusText position='right' text={kycUsers?.dob || 'N/A'} size="SS" medium color={colors.Hard_Black} />
                                </Wrapper>
                                <Wrapper row align="center" justify="apart" customStyles={{}}>
                                    <CusText text="Mobile No." size="SS" medium color={colors.Hard_Black} />
                                    <CusText position='right' text={kycUsers?.reg_mobile || 'N/A'} size="SS" medium color={colors.Hard_Black} />
                                </Wrapper>
                                <Wrapper row align="center" justify="apart" customStyles={{}}>
                                    <CusText text="Email ID" size="SS" medium color={colors.Hard_Black} />
                                    <CusText position='right' text={kycUsers?.reg_email || 'N/A'} size="SS" medium color={colors.Hard_Black} />
                                </Wrapper>
                                <Wrapper row justify="apart" customStyles={{}}>
                                    <CusText text="Address" size="SS" medium color={colors.Hard_Black} />
                                    <Wrapper width={responsiveWidth(45)}>
                                        <CusText position='right' text={kycUsers?.AddressDetail?.address1 || 'N/A'} size="SS" medium color={colors.Hard_Black} />
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
                                    <Wrapper row align="center">
                                        <Wrapper row align="center" customStyles={{ gap: responsiveWidth(1) }}>
                                            <IonIcon
                                                name={kycUsers?.isKYCDone ? "checkmark-circle" : "close-circle"}
                                                size={responsiveWidth(4)}
                                                color={kycUsers?.isKYCDone ? colors.green : colors.red}
                                            />
                                            <CusText text={kycUsers?.isKYCDone ? "Verified" : "Not Verified"} size="SS" medium color={kycUsers?.isKYCDone ? colors.green : colors.red} />
                                        </Wrapper>
                                        {
                                            kycUsers?.is_kyc_complete && !kycUsers?.isKYCDone ?
                                                <>
                                                    <Spacer x='XXS' />
                                                    <TouchableOpacity onPress={() => {
                                                        // navigation.navigate('Main', { screen: 'KycDashboard' })
                                                        checkKYCStatus(kycUsers)
                                                    }}>
                                                        <Wrapper>
                                                            <CusText underline text="(Check KYC Status)" size="SS" medium color={colors.primary} />
                                                        </Wrapper>
                                                    </TouchableOpacity>
                                                </>
                                                :
                                                null
                                        }
                                    </Wrapper>
                                </Wrapper>

                                <Wrapper row align="center" justify="apart" customStyles={{}}>
                                    <CusText text="Profile" size="SS" medium color={colors.Hard_Black} />
                                    <Wrapper row align="center">
                                        <Wrapper row align="center" customStyles={{ gap: responsiveWidth(1) }}>
                                            <IonIcon
                                                name={kycUsers?.percentage == 100 ? "checkmark-circle" : "time"}
                                                size={responsiveWidth(4)}
                                                color={kycUsers?.percentage == 100 ? colors.green : colors.orange}
                                            />
                                            <CusText text={kycUsers?.percentage == 100 ? 'Completed' : 'Pending'} size="SS" medium color={colors.Hard_Black} />
                                            {
                                                kycUsers?.percentage == 100 ?
                                                    <TouchableOpacity activeOpacity={0.6} onPress={() => {
                                                        // navigation.navigate('Main', { screen: 'KycDashboard' })
                                                        setKYC_ISMember(false);
                                                        const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'member_basic_details', null);
                                                        setKYC_Details(update_data);
                                                        navigation.navigate('Main', { screen: 'KycDashboard' })
                                                    }}>
                                                        <Wrapper position='center' justify='center' color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingHorizontal: responsiveWidth(1) }}>
                                                            <CusText position='center' text={'View/Edit'} size="S" medium color={colors.Hard_White} />
                                                        </Wrapper>
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity activeOpacity={0.6} onPress={() => {
                                                        // navigation.navigate('Main', { screen: 'KycDashboard' })
                                                        checkKycSteps(false)
                                                    }}>
                                                        <Wrapper position='center' justify='center' color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingHorizontal: responsiveWidth(1) }}>
                                                            <CusText position='center' text={'Initial Kyc'} size="S" medium color={colors.Hard_White} />
                                                        </Wrapper>
                                                    </TouchableOpacity>
                                            }

                                        </Wrapper>
                                        {/* {
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
                                                        checkKycSteps(false)
                                                    }}>
                                                        <Wrapper position='center' color={colors.orange} customStyles={{ paddingHorizontal: responsiveWidth(1), borderRadius: borderRadius.small }}>
                                                            <CusText text="Initiate Kyc" size="S" medium color={colors.Hard_White} />
                                                        </Wrapper>
                                                    </TouchableOpacity>
                                                </Wrapper>

                                            )
                                        } */}
                                    </Wrapper>
                                </Wrapper>

                                <Wrapper row align="center" justify="apart">
                                    <CusText text="Account Holding" size="SS" medium color={colors.Hard_Black} />
                                    <CusText text={kycUsers?.accountHolding || 'Not Linked'} size="SS" medium color={themeColors.gray} />
                                </Wrapper>
                                <Wrapper row align="center" justify="right">
                                    {/* <CusText text="Account Holding" size="SS" medium color={colors.Hard_Black} /> */}
                                    {
                                        kycUsers?.is_kyc_complete && kycUsers?.isKYCDone && (
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => {
                                                    console.log('Navigating to Account Holdings');
                                                    navigation.navigate('AccountHolding');
                                                }}
                                            >
                                                <CusText text="Link Account" size="SS" medium color={colors.orange} underline />
                                            </TouchableOpacity>
                                        )
                                    }

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
                                <TouchableOpacity onPress={() => {
                                    checkKycSteps(true)
                                    // setKYC_ISMember(true);
                                    // navigation.navigate('PancardVerify');
                                }}>
                                    <Wrapper row align="center" customStyles={{ borderRadius: borderRadius.small, padding: responsiveWidth(1), gap: responsiveWidth(1) }}>
                                        <IonIcon name='pencil-outline' size={responsiveWidth(4)} color={colors.primary} />
                                        <CusText bold color={colors.primary} text={'Add Members'} />
                                    </Wrapper>
                                </TouchableOpacity>
                            </Wrapper>

                            {kycUsers?.GroupMemmber && kycUsers.GroupMemmber
                                .length === 0 ? (
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
                                <>
                                    {/* Members Information */}
                                    {kycUsers?.GroupMemmber && kycUsers.GroupMemmber.length > 0 && (
                                        <>
                                            <Spacer y="XXS" />
                                            <Wrapper
                                                color={themeColors.Hard_White}
                                                customStyles={{
                                                    borderRadius: borderRadius.medium,
                                                    padding: responsiveWidth(4),
                                                    shadowColor: colors.black,
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.1,
                                                    shadowRadius: 4,
                                                    elevation: 3,
                                                }}
                                            >


                                                {/* <Spacer y="S" /> */}

                                                {kycUsers.GroupMemmber.map((member: any, index: number) => (
                                                    <Wrapper key={member.id} customStyles={{ marginBottom: responsiveWidth(3) }}>
                                                        <Wrapper
                                                            color={themeColors.background}
                                                            customStyles={{
                                                                borderRadius: borderRadius.small,
                                                                padding: responsiveWidth(3),
                                                                borderLeftWidth: 4,
                                                                borderLeftColor: themeColors.primary
                                                            }}
                                                        >
                                                            <Wrapper row align="center" justify="apart">
                                                                <Wrapper flex>
                                                                    <CusText
                                                                        text={member.name || 'N/A'}
                                                                        size="M"
                                                                        bold
                                                                        color={themeColors.Hard_Black}
                                                                    />
                                                                    <Spacer y="XS" />
                                                                    <CusText
                                                                        text={`PAN: ${member.pan_no || 'N/A'}`}
                                                                        size="S"
                                                                        color={themeColors.gray}
                                                                    />
                                                                </Wrapper>
                                                                <Wrapper align="center">
                                                                    <StatusBadge
                                                                        status={member.annualFund == '<50K' ? 'N/A' : member?.isKYCDone ? "Verified" : "Not Verified"}
                                                                        type="kyc"
                                                                    />
                                                                    {member?.is_kyc_complete && !member?.isKYCDone ? (
                                                                        <TouchableOpacity activeOpacity={0.6} onPress={() => {
                                                                            checkKYCStatus(member)
                                                                        }}>
                                                                            <CusText underline text="(Check KYC Status)" size="XS" medium color={colors.primary} />
                                                                        </TouchableOpacity>
                                                                    ) : null}
                                                                    <Spacer y="XS" />
                                                                    <CusText
                                                                        text={`${member.percentage}%`}
                                                                        size="S"
                                                                        bold
                                                                        color={themeColors.primary}
                                                                    />
                                                                </Wrapper>
                                                            </Wrapper>

                                                            <Spacer y="S" />

                                                            <Wrapper row justify="apart">
                                                                <Wrapper flex customStyles={{ marginRight: responsiveWidth(2) }}>
                                                                    <CusText
                                                                        text="Annual Fund"
                                                                        size="XS"
                                                                        color={themeColors.gray}
                                                                    />
                                                                    <CusText
                                                                        text={member.annualFund || 'N/A'}
                                                                        size="S"
                                                                        medium
                                                                        color={themeColors.Hard_Black}
                                                                    />
                                                                </Wrapper>
                                                                <Wrapper flex>
                                                                    <CusText
                                                                        text="KYC Step"
                                                                        size="XS"
                                                                        color={themeColors.gray}
                                                                    />
                                                                    <CusText
                                                                        text={`${member.last_kyc_step || 0}/8`}
                                                                        size="S"
                                                                        medium
                                                                        color={themeColors.Hard_Black}
                                                                    />
                                                                </Wrapper>
                                                            </Wrapper>

                                                            {member.dob && (
                                                                <>
                                                                    <Spacer y="S" />
                                                                    <CusText
                                                                        text="Date of Birth"
                                                                        size="XS"
                                                                        color={themeColors.gray}
                                                                    />
                                                                    <CusText
                                                                        text={new Date(member.dob).toLocaleDateString()}
                                                                        size="S"
                                                                        medium
                                                                        color={themeColors.Hard_Black}
                                                                    />
                                                                </>
                                                            )}

                                                            <Spacer y="S" />
                                                            <Wrapper row align='center' justify="apart">
                                                                {
                                                                    member?.percentage === 100
                                                                        ?
                                                                        <TouchableOpacity activeOpacity={0.6} onPress={() => {
                                                                            // navigation.navigate('Main', { screen: 'KycDashboard' })
                                                                            // setKYC_ISMember(false);
                                                                            // const update_data = updateObjectKey(getKYC_Details() ? getKYC_Details() : {}, 'member_basic_details', null);
                                                                            // setKYC_Details(update_data);
                                                                            // navigation.navigate('Main', { screen: 'KycDashboard' })
                                                                            checkKycSteps(true, member?.id)
                                                                        }}>
                                                                            <Wrapper position='center' justify='center' color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingHorizontal: responsiveWidth(10), paddingVertical: responsiveWidth(2) }}>
                                                                                <CusText position='center' text={'View/Edit'} size="S" medium color={colors.Hard_White} />
                                                                            </Wrapper>
                                                                        </TouchableOpacity>
                                                                        :
                                                                        <TouchableOpacity activeOpacity={0.6} onPress={() => {
                                                                            // navigation.navigate('Main', { screen: 'KycDashboard' })
                                                                            // checkKycSteps(false)
                                                                            checkKycSteps(true, member?.id)
                                                                        }}>
                                                                            <Wrapper position='center' justify='center' color={colors.orange} customStyles={{ borderRadius: borderRadius.middleSmall, paddingHorizontal: responsiveWidth(10), paddingVertical: responsiveWidth(2) }}>
                                                                                <CusText position='center' text={'Initial Kyc'} size="S" medium color={colors.Hard_White} />
                                                                            </Wrapper>
                                                                        </TouchableOpacity>
                                                                }
                                                                {
                                                                    !isInvestorMinor(member.dob) && (
                                                                        <>
                                                                            <TouchableOpacity activeOpacity={0.6} onPress={() => {
                                                                                handleRemoveMember(member);
                                                                            }}>
                                                                                <Wrapper>
                                                                                    <CusText text={'Remove'} size="S" medium color={colors.red} />
                                                                                </Wrapper>
                                                                            </TouchableOpacity>
                                                                        </>
                                                                    )
                                                                }
                                                            </Wrapper>
                                                            {/* <TouchableOpacity
                                                                onPress={() => {
                                                                    // Navigate to member KYC details or continue KYC
                                                                    if (!member.is_kyc_complete) {
                                                                        // Set member details and navigate to continue KYC

                                                                        checkKycSteps(true, member?.id)
                                                                        // navigation.navigate('PancardVerify')
                                                                    }
                                                                }}
                                                                style={{
                                                                    backgroundColor: member.is_kyc_complete ? themeColors.green + '20' : themeColors.primary + '20',
                                                                    borderRadius: borderRadius.small,
                                                                    padding: responsiveWidth(2),
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <CusText
                                                                    text={member.is_kyc_complete ? 'View Details' : 'Continue KYC'}
                                                                    size="S"
                                                                    bold
                                                                    color={member.is_kyc_complete ? colors.green : themeColors.primary}
                                                                />
                                                            </TouchableOpacity> */}
                                                        </Wrapper>
                                                    </Wrapper>
                                                ))}
                                            </Wrapper>
                                        </>
                                    )}
                                </>
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
            <CommonModal
                visible={isVisible}
                onClose={() => { setisVisible(false) }}
                description={`Your on-boarding process is pending, please click on continue to proceed.`}
                button1Text="Continue!"
                onButton1Press={() => {

                    checkKycSteps(false)
                }}
            // button2Text="Yes"
            // onButton2Press={async () => { deleteGoal(id) }}

            />

            {/* Remove Member Confirmation Modal */}
            <CommonModal
                visible={showRemoveModal}
                onClose={cancelRemoveMember}
                title="Remove Member"
                description={
                    <Wrapper row customStyles={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                        <CusText
                            text="Are you sure you want to remove "
                            size="SS"
                            color={colors.primary}
                            semibold
                        />
                        <CusText
                            text={memberToRemove?.name || 'this member'}
                            size="SS"
                            bold
                            color={colors.red}
                        />
                        <CusText
                            text=" from the family members list?"
                            size="SS"
                            color={colors.primary}
                            semibold
                        />
                    </Wrapper>
                }
                subDescription="This action cannot be undone."
                button1Text="Cancel"
                onButton1Press={cancelRemoveMember}
                button2Text="Remove"
                onButton2Press={confirmRemoveMember}
                button2Loading={isRemoving}
                button2Color={colors.red}
            />
        </>
    );
};

export default Profile;

