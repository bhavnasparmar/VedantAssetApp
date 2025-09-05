import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { AppearanceContext } from '../../../context/appearanceContext';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Container from '../../../ui/container';
import Header from '../../../shared/components/Header/Header';
import Wrapper from '../../../ui/wrapper';
import CusText from '../../../ui/custom-text';
import Spacer from '../../../ui/spacer';
import { colors, responsiveWidth, responsiveHeight, borderRadius } from '../../../styles/variables';
import { showToast, toastTypes } from '../../../services/toastService';
import API from '../../../utils/API';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { USER_DATA, API_URL, promiseHandler, getKYC_Details } from '../../../utils/Commanutils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createACHoldingApi, getInvestorAcHoldingApi, getInvestorSearchApi, getMandatesApi } from '../../../api/homeapi';
import DropDown from '../../../ui/dropdown';
import CusButton from '../../../ui/custom-button';
import CheckBox from '../../../ui/checkBox';

// Account Holding Types
export const accountHoldingType: any = [
    { id: "SI", name: "Single" },
    { id: "JO", name: "Joint" },
    { id: "AS", name: "Anyone or Survivor" },
];

const AccountHolding = () => {
    const { colors: themeColors }: any = useContext(AppearanceContext);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // State management
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [investorData, setInvestorData] = useState<any>(null);
    const [accountHoldings, setAccountHoldings] = useState<any[]>([]);
    const [mandates, setMandates] = useState<any[]>([]);
    const [userId, setUserId] = useState<string>('');

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showMandatesModal, setShowMandatesModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);

    // Form state
    const [selectedAccountType, setSelectedAccountType] = useState<any>(null);
    const [selectedFirstApplicant, setSelectedFirstApplicant] = useState<any>(null);
    const [selectedSecondApplicant, setSelectedSecondApplicant] = useState<any>(null);
    const [holdingError, setHoldingError] = useState<any>(null);
    const [investorList, setInvestorList] = useState<any[]>([]);

    // Edit state
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingHolding, setEditingHolding] = useState<any>(null);
    const [isActiveStatus, setIsActiveStatus] = useState(true);

    useEffect(() => {
        getUserId();
    }, [isFocused]);

    useEffect(() => {
        if (userId) {
            fetchAllData();
        }
    }, [userId]);

    const getUserId = async () => {
        try {
            const userData = await AsyncStorage.getItem(USER_DATA);
            if (userData) {
                const user = JSON.parse(userData);
                setUserId(user?.id || '246'); // Default to 246 for testing
                console.log('User ID:', user?.id);
            }
        } catch (error) {
            console.log('Error getting user ID:', error);
            setUserId('246'); // Default fallback
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchInvestorData(),
                fetchAccountHoldings(),
                fetchMandates()
            ]);
        } catch (error) {
            console.log('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvestorData = async () => {
        try {
            console.log('=== FETCHING INVESTOR DATA ===');
            console.log('API Call: investor/search/' + userId);
            let kyc_ID: any = getKYC_Details()?.user_basic_details?.id;

            const [response, error]: any = await getInvestorSearchApi(kyc_ID);
            console.log('Investor data response:', response);

            if (response?.data) {
                setInvestorData(response?.data?.data);
                console.log('Investor data set:', response.data);
            } else {
                showToast(toastTypes.error, error?.response?.data?.message || 'Failed to fetch investor data');
                console.log('No investor data found');
            }
        } catch (error: any) {
            console.log('Fetch investor data error:', error);
            showToast(toastTypes.error, error?.response?.data?.message || 'Failed to fetch investor data');
        }
    };

    const fetchAccountHoldings = async () => {
        try {
            let kyc_ID: any = getKYC_Details()?.user_basic_details?.id;
            console.log('=== FETCHING ACCOUNT HOLDINGS ===');
            console.log('API Call: investor/account-holding/' + kyc_ID);

            const [response, error]: any = await getInvestorAcHoldingApi(kyc_ID);
            console.log('Account holdings response == >> :', response?.data?.data);

            if (response?.data) {
                setAccountHoldings(Array.isArray(response?.data?.data) ? response?.data?.data : []);
                // console.log('Account holdings set:', response.data);
            } else {
                showToast(toastTypes.error, error?.response?.data?.message || 'Failed to fetch account holdings');
                console.log('No account holdings found');
                setAccountHoldings([]);
            }
        } catch (error: any) {
            console.log('Fetch account holdings error:', error);
            showToast(toastTypes.error, error?.response?.data?.message || 'Failed to fetch account holdings');
        }
    };

    const fetchMandates = async () => {
        try {
            console.log('=== FETCHING MANDATES ===');
            console.log('API Call: mfu/mandates');

            const [response, error]: any = await getMandatesApi(userId);
            console.log('Mandates response:', response);

            if (response?.data) {
                // setMandates(Array.isArray(response.data) ? response.data : [response.data]);
                setMandates(Array.isArray(response.data?.data) ? response.data?.data : []);
                console.log('Mandates set:', response.data?.data);
            } else {
                showToast(toastTypes.error, error?.response?.data?.message || 'Failed to fetch mandates');
                console.log('No mandates found');
                setMandates([]);
            }
        } catch (error: any) {
            console.log('Fetch mandates error:', error);
            showToast(toastTypes.error, error?.response?.data?.message || 'Failed to fetch mandates');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAllData();
        setRefreshing(false);
    };

    const renderInvestorInfo = () => {
        if (!investorData) return null;

        return (
            <Wrapper customStyles={styles.section}>
                <CusText text="Investor Information" size="L" bold color={themeColors.text} />
                <Spacer y="S" />

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <CusText text="Name:" size="M" semibold color={themeColors.subText} />
                        <CusText text={investorData?.name || 'N/A'} size="M" color={themeColors.text} />
                    </View>

                    <View style={styles.infoRow}>
                        <CusText text="PAN:" size="M" semibold color={themeColors.subText} />
                        <CusText text={investorData?.pan || 'N/A'} size="M" color={themeColors.text} />
                    </View>

                    <View style={styles.infoRow}>
                        <CusText text="Email:" size="M" semibold color={themeColors.subText} />
                        <CusText text={investorData?.email || 'N/A'} size="M" color={themeColors.text} />
                    </View>

                    <View style={styles.infoRow}>
                        <CusText text="Mobile:" size="M" semibold color={themeColors.subText} />
                        <CusText text={investorData?.mobile || 'N/A'} size="M" color={themeColors.text} />
                    </View>
                </View>
            </Wrapper>
        );
    };

    const renderAccountHoldings = () => {
        return (
            <Wrapper customStyles={styles.section}>
                <CusText text="Account Holdings" size="L" bold color={themeColors.text} />
                <Spacer y="S" />

                {accountHoldings.length > 0 ? (
                    accountHoldings.map((holding, index) => (
                        <View key={index} style={styles.holdingCard}>
                            <View style={styles.holdingHeader}>
                                <IonIcon name="wallet" size={20} color={colors.primary1} />
                                <CusText
                                    text={holding?.scheme_name || `Holding ${index + 1}`}
                                    size="M"
                                    semibold
                                    color={themeColors.text}
                                    customStyles={{ flex: 1, marginLeft: responsiveWidth(2) }}
                                />
                            </View>

                            <View style={styles.holdingDetails}>
                                <View style={styles.infoRow}>
                                    <CusText text="Units:" size="S" color={themeColors.subText} />
                                    <CusText text={holding?.units || '0'} size="S" color={themeColors.text} />
                                </View>

                                <View style={styles.infoRow}>
                                    <CusText text="NAV:" size="S" color={themeColors.subText} />
                                    <CusText text={holding?.nav || '0'} size="S" color={themeColors.text} />
                                </View>

                                <View style={styles.infoRow}>
                                    <CusText text="Value:" size="S" color={themeColors.subText} />
                                    <CusText text={`₹${holding?.current_value || '0'}`} size="S" bold color={colors.primary1} />
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <IonIcon name="folder-open-outline" size={responsiveWidth(15)} color={themeColors.subText} />
                        <CusText text="No account holdings found" size="M" color={themeColors.subText} />
                    </View>
                )}
            </Wrapper>
        );
    };

    const renderMandates = () => {
        return (
            <Wrapper customStyles={styles.section}>
                <CusText text="Mandates" size="L" bold color={themeColors.text} />
                <Spacer y="S" />

                {mandates.length > 0 ? (
                    mandates.map((mandate, index) => (
                        <View key={index} style={styles.mandateCard}>
                            <View style={styles.mandateHeader}>
                                <IonIcon name="document-text" size={20} color={colors.orange} />
                                <CusText
                                    text={mandate?.mandate_id || `Mandate ${index + 1}`}
                                    size="M"
                                    semibold
                                    color={themeColors.text}
                                    customStyles={{ flex: 1, marginLeft: responsiveWidth(2) }}
                                />
                                <View style={[styles.statusBadge, {
                                    backgroundColor: mandate?.status === 'Active' ? colors.green : colors.orange
                                }]}>
                                    <CusText
                                        text={mandate?.status || 'Pending'}
                                        size="XS"
                                        bold
                                        color={colors.white}
                                    />
                                </View>
                            </View>

                            <View style={styles.mandateDetails}>
                                <View style={styles.infoRow}>
                                    <CusText text="Bank:" size="S" color={themeColors.subText} />
                                    <CusText text={mandate?.bank_name || 'N/A'} size="S" color={themeColors.text} />
                                </View>

                                <View style={styles.infoRow}>
                                    <CusText text="Amount:" size="S" color={themeColors.subText} />
                                    <CusText text={`₹${mandate?.amount || '0'}`} size="S" bold color={colors.primary1} />
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <IonIcon name="document-outline" size={responsiveWidth(15)} color={themeColors.subText} />
                        <CusText text="No mandates found" size="M" color={themeColors.subText} />
                    </View>
                )}
            </Wrapper>
        );
    };

    const handleViewAllMandates = () => {
        // Navigate to view all mandates screen
        console.log('View All Mandates pressed');
        // navigation.navigate('ViewAllMandates'); // Uncomment when screen is available
    };

    const handleCreateNew = () => {
        // Open create new modal
        setIsEditMode(false);
        setEditingHolding(null);
        setShowCreateModal(true);
        // Reset form
        setSelectedAccountType(null);
        setSelectedFirstApplicant(null);
        setSelectedSecondApplicant(null);
        setIsActiveStatus(true);
        // Set investor list for dropdowns
        if (investorData) {
            setInvestorList(investorData);
        }
    };

    const handleEditHolding = (holding: any) => {
        // Open modal in edit mode with pre-filled data
        setIsEditMode(true);
        setEditingHolding(holding);
        setShowCreateModal(true);

        // Pre-fill form with existing data
        // Find matching account type based on holding data
        const accountType = accountHoldingType.find((type: any) =>
            type.id === holding.account_type ||
            (holding.account_type === 'Single' && type.id === 'SI') ||
            (holding.account_type === 'Joint' && type.id === 'JO') ||
            (holding.account_type === 'Anyone or Survivor' && type.id === 'AS')
        );
        setSelectedAccountType(accountType || accountHoldingType[0]);

        // Set applicant data
        if (investorData) {
            setInvestorList(investorData);
            // setSelectedFirstApplicant(investorData);
        }

        setSelectedSecondApplicant(null);
        setIsActiveStatus(true); // Default to active for edit mode
    };


    const handleSaveHolding = async () => {
        if (!selectedAccountType) {
            showToast(toastTypes.error, 'Please select account type');
            return;
        }

        if (!selectedFirstApplicant) {
            showToast(toastTypes.error, 'Please select first applicant');
            return;
        }

        setModalLoading(true);
        try {
            if (isEditMode && editingHolding) {
                // Update existing holding
                console.log('Updating holding:', editingHolding);
                // For now, we'll simulate update success since we don't have update API
                // In real implementation, you would call an update API here
                showToast(toastTypes.success, 'Holding updated successfully');
                setShowCreateModal(false);
                setIsEditMode(false);
                setEditingHolding(null);
                // Refresh data
                fetchAllData();
                return;
            }

            const payload = {
                accountType: selectedAccountType?.id,
                investorId: selectedFirstApplicant?.id
            };

            console.log('Creating holding with payload:', payload);
            const [response, error]: any = await createACHoldingApi(payload);
            console.log('Create holding response:', response);

            if (response) {
                console.log('Holding created successfully:', response.data);
                const result = response?.data?.data?.CANIndFillEezzResp;


                if (result?.RESP_HEADER?.RES_CODE !== "0") {
                    console.log(result?.RESP_HEADER?.RES_MSG)
                    setHoldingError(result?.RESP_HEADER?.RES_MSG);
                    // showToast(toastTypes.error, result?.RESP_HEADER?.RES_MSG);

                } else {
                    const _investor = investorList.find((opt: any) => opt?.group_leader_id === 0)
                    console.log(_investor)
                    const _transactionData = {
                        can_id: result?.RESP_BODY?.CAN,
                        name: _investor?.name,
                        status: 'Success',

                    };
                    // seTransactionData(_transactionData)
                    // setAccountHoldingModal(false);
                    // setOpen(true)
                    setSuccessData({
                        canId: result?.RESP_BODY?.CAN,
                        name: _investor?.name,
                        status: 'Success'
                    });
                    setShowCreateModal(false);
                    setShowSuccessModal(true);
                    // Refresh data
                    fetchAllData();
                }



                // setSuccessData({
                //     canId: (response.data as any).canId || '32224FF002',
                //     name: selectedFirstApplicant.name || 'Rajan Prajapati',
                //     status: 'Success'
                // });
                // setShowCreateModal(false);
                // setShowSuccessModal(true);
                // // Refresh data
                // fetchAllData();
            } else {
                showToast(toastTypes.error, (error as any)?.response?.data?.message || 'Failed to create holding');
            }
        } catch (error: any) {
            console.log('Create holding error:', error);
            showToast(toastTypes.error, error?.response?.data?.message || 'Failed to create holding');
        } finally {
            setModalLoading(false);
        }
    };

    const renderActionButtons = () => {
        return (
            <Wrapper row justify="apart" align='center' width={responsiveWidth(90)} customStyles={{}}>
                <TouchableOpacity activeOpacity={0.6} onPress={handleViewAllMandates}>
                    <Wrapper width={responsiveWidth(42)} row align='center' justify='center' color={colors.primary1} customStyles={{ borderRadius: borderRadius.medium, paddingVertical: responsiveWidth(2), gap: responsiveWidth(1), }}>
                        <IonIcon name="list-outline" size={responsiveWidth(5)} color={colors.white} />
                        <CusText text="View All Mandates" size="SS" semibold color={colors.white} />
                    </Wrapper>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.6} onPress={handleCreateNew}>
                    <Wrapper width={responsiveWidth(42)} row align='center' justify='center' color={colors.green} customStyles={{ borderRadius: borderRadius.medium, paddingVertical: responsiveWidth(2), gap: responsiveWidth(1), }}>
                        <IonIcon name="add-circle-outline" size={responsiveWidth(5)} color={colors.white} />
                        <CusText text="Create New" size="SS" semibold color={colors.white} />
                    </Wrapper>
                </TouchableOpacity>
            </Wrapper>
        );
    };

    const renderApplicantCard = (item: any, mandates: number = 0) => {
        const onLinkedMandatesClick = () => {
            console.log('Linked Mandates clicked for:', item?.name);
            setShowMandatesModal(true);
        };

        const onEdit = () => {
            console.log('Edit clicked for:', item?.name);
            // navigation.navigate('EditApplicant', { applicantId: item?.id });
        };

        return (
            <View style={styles.newApplicantCard}>
                {/* Header Section */}
                <View style={styles.newCardHeader}>
                    <CusText text="Applicants" size="L" semibold color={themeColors.text} />
                    <View style={styles.newBadgeContainer}>
                        <View style={styles.singleBadge}>
                            <CusText text="Single" size="XS" semibold color={colors.orange} />
                        </View>
                        <View style={styles.activeBadge}>
                            <CusText text="Active" size="XS" semibold color={colors.green} />
                        </View>
                    </View>
                </View>

                {/* Applicant List */}
                <View style={styles.applicantList}>
                    <View style={styles.applicantItem}>
                        <View style={styles.applicantNumber}>
                            <CusText text="1" size="M" semibold color={themeColors.text} />
                        </View>
                        <View style={styles.newApplicantDetails}>
                            <CusText text={item?.name || 'MINA N BEDARKAR'} size="M" semibold color={themeColors.text} />
                            <CusText text={item?.pan || 'CQRPB5427Q'} size="S" color={themeColors.subText} />
                        </View>
                    </View>
                </View>

                {/* Footer Section */}
                <View style={styles.newCardFooter}>
                    <TouchableOpacity style={styles.newLinkedMandatesButton} onPress={onLinkedMandatesClick}>
                        <CusText text="Linked Mandates" size="M" color={colors.orange} />
                        <View style={styles.newMandateCountBadge}>
                            <CusText text={mandates.toString() || '4'} size="S" semibold color={themeColors.text} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                        <IonIcon name="create-outline" size={18} color={themeColors.subText} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // Render applicant cards using real account holdings data
    const renderApplicantCards = () => {
        // If no account holdings, show investor data as single applicant
        if (accountHoldings.length === 0) {
            return (
                <View style={styles.cardsContainer}>
                    <View style={styles.newApplicantCard}>
                        {/* Header Section */}
                        <View style={styles.newCardHeader}>
                            <CusText text="Applicants" size="M" semibold color={themeColors.text} />
                            <View style={styles.newBadgeContainer}>
                                <View style={styles.singleBadge}>
                                    <CusText text="Single" size="XS" semibold color={colors.orange} />
                                </View>
                                <View style={styles.activeBadge}>
                                    <CusText text="Active" size="XS" semibold color={colors.green} />
                                </View>
                            </View>
                        </View>

                        {/* Applicant List */}
                        <View style={styles.applicantList}>
                            <View style={styles.applicantItem}>
                                <View style={styles.applicantNumber}>
                                    <CusText text="1" size="M" semibold color={themeColors.text} />
                                </View>
                                <View style={styles.newApplicantDetails}>
                                    <CusText text={investorData?.name || 'N/A'} size="M" semibold color={themeColors.text} />
                                    <CusText text={investorData?.pan || 'N/A'} size="S" color={themeColors.subText} />
                                </View>
                            </View>
                        </View>

                        {/* Footer Section */}
                        <View style={styles.newCardFooter}>
                            <TouchableOpacity
                                style={styles.newLinkedMandatesButton}
                                onPress={() => setShowMandatesModal(true)}
                            >
                                <CusText text="Linked Mandates" size="M" color={colors.orange} />
                                <View style={styles.newMandateCountBadge}>
                                    <CusText text={mandates.length.toString()} size="S" semibold color={themeColors.text} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log('Edit clicked')} style={styles.editButton}>
                                <IonIcon name="create-outline" size={18} color={themeColors.subText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }

        // Map through accountHoldings array to create individual cards for each holding
        return (
            <View style={styles.cardsContainer}>
                {accountHoldings.map((holding: any, index: number) => (
                    <View key={holding.id || index} style={styles.newApplicantCard}>
                        {/* Header Section */}
                        <View style={styles.newCardHeader}>
                            <CusText text="Account Holding" size="M" semibold color={themeColors.text} />
                            <View style={styles.newBadgeContainer}>
                                <View style={styles.singleBadge}>
                                    <CusText text="Active" size="XS" semibold color={colors.orange} />
                                </View>
                                <View style={styles.activeBadge}>
                                    <CusText text="Verified" size="XS" semibold color={colors.green} />
                                </View>
                            </View>
                        </View>
                        <Spacer y="XXS" />
                        {/* Holding Details */}
                        <View style={styles.applicantList}>
                            <View style={styles.applicantItem}>
                                <View style={styles.applicantNumber}>
                                    <CusText text={(index + 1).toString()} size="M" semibold color={themeColors.text} />
                                </View>
                                <View style={styles.newApplicantDetails}>
                                    <CusText text={holding?.scheme_name || holding?.name || 'N/A'} size="M" semibold color={themeColors.text} />
                                    <CusText text={`${holding?.pan_no}`} size="S" color={themeColors.subText} />
                                    <CusText text={`${holding?.CAN_Id}`} size="S" color={themeColors.subText} />
                                </View>
                            </View>
                        </View>

                        {/* Footer Section */}
                        <View style={styles.newCardFooter}>
                            <TouchableOpacity
                                style={styles.newLinkedMandatesButton}
                                onPress={() => setShowMandatesModal(true)}
                            >
                                <CusText text="Linked Mandates" size="M" color={colors.orange} />
                                <View style={styles.newMandateCountBadge}>
                                    <CusText text={mandates.length.toString()} size="S" semibold color={themeColors.text} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleEditHolding(holding)} style={styles.editButton}>
                                <IonIcon name="create-outline" size={18} color={themeColors.subText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    // Create New Modal
    const renderCreateModal = () => {
        return (
            <Modal
                visible={showCreateModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCreateModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <Wrapper
                        justify='center'
                        align='center'
                        color='rgba(0, 0, 0, 0.5)'
                        customStyles={{ flex: 1 }}
                    >
                        <Wrapper
                            width={responsiveWidth(90)}
                            color={colors.white}
                            customStyles={{
                                borderRadius: borderRadius.medium,
                                padding: responsiveWidth(5),
                                margin: responsiveWidth(5),
                                shadowColor: colors.black,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                                maxHeight: responsiveHeight(80),
                            }}
                        >
                            {/* Header */}
                            <Wrapper row justify="apart" align="center" customStyles={{ marginBottom: responsiveWidth(4) }}>
                                <CusText text={isEditMode ? "Edit Holding" : "Create New Holding"} size="L" semibold color={themeColors.text} />
                                <TouchableOpacity onPress={() => {
                                    setShowCreateModal(false);
                                    setIsEditMode(false);
                                    setEditingHolding(null);
                                }}>
                                    <IonIcon name="close" size={24} color={themeColors.text} />
                                </TouchableOpacity>
                            </Wrapper>

                            {holdingError && (
                                <>
                                    <Spacer y="S" />
                                    <CusText text={holdingError} size="S" bold color={colors.red} customStyles={{ marginBottom: responsiveWidth(2) }} />
                                    <Spacer y="S" />
                                </>
                                // <CusText text={holdingError} size="S" color={colors.error} customStyles={{ marginBottom: responsiveWidth(2) }} />
                            )}

                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Account Type Dropdown */}
                                <Wrapper customStyles={{ marginBottom: responsiveWidth(4) }}>
                                    <CusText text="Account Type" size="M" semibold color={themeColors.text} customStyles={{ marginBottom: responsiveWidth(2) }} />
                                    <DropDown
                                        data={accountHoldingType}
                                        placeholder="Select Account Type"
                                        value={selectedAccountType}
                                        valueField="id"
                                        labelField="name"
                                        onChange={(data: any) => {
                                            setSelectedAccountType(data);
                                            // Reset second applicant when account type changes
                                            if (data.id === 'SI') {
                                                setSelectedSecondApplicant(null);
                                            }
                                        }}
                                        width={responsiveWidth(80)}
                                    />
                                </Wrapper>

                                {/* First Applicant Dropdown */}
                                <Wrapper customStyles={{ marginBottom: responsiveWidth(4) }}>
                                    <CusText text="First Applicant" size="M" semibold color={themeColors.text} customStyles={{ marginBottom: responsiveWidth(2) }} />
                                    <DropDown
                                        data={investorList}
                                        placeholder="Select First Applicant"
                                        value={selectedFirstApplicant}
                                        valueField="id"
                                        labelField="name"
                                        onChange={(data: any) => setSelectedFirstApplicant(data)}
                                        width={responsiveWidth(80)}
                                    />
                                </Wrapper>

                                {/* Second Applicant Dropdown - Only show for Joint or Anyone or Survivor */}
                                {selectedAccountType && (selectedAccountType.id === 'JO' || selectedAccountType.id === 'AS') && (
                                    <Wrapper customStyles={{ marginBottom: responsiveWidth(4) }}>
                                        <CusText text="Second Applicant" size="M" semibold color={themeColors.text} customStyles={{ marginBottom: responsiveWidth(2) }} />
                                        <DropDown
                                            data={investorList}
                                            placeholder="Select Second Applicant"
                                            value={selectedSecondApplicant}
                                            valueField="id"
                                            labelField="name"
                                            onChange={(data: any) => setSelectedSecondApplicant(data)}
                                            width={responsiveWidth(80)}
                                        />
                                    </Wrapper>
                                )}

                                {/* Active Status Checkbox - Only show in Edit Mode */}
                                {isEditMode && (
                                    <Wrapper row align="center" customStyles={{ marginBottom: responsiveWidth(4) }}>
                                        <CheckBox
                                            isChecked={isActiveStatus}
                                            onPress={() => setIsActiveStatus(!isActiveStatus)}
                                        />
                                        <Spacer x="S" />
                                        <CusText text="Active" size="M" color={themeColors.text} />
                                    </Wrapper>
                                )}

                                <Spacer y="L" />

                                {/* Save/Update Button */}
                                <CusButton
                                    title={modalLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update" : "Save")}
                                    onPress={handleSaveHolding}
                                    width={responsiveWidth(80)}
                                    loading={modalLoading}
                                    disabled={modalLoading}
                                />
                            </ScrollView>
                        </Wrapper>
                    </Wrapper>
                </KeyboardAvoidingView>
            </Modal>
        );
    };

    // Success Modal
    const renderSuccessModal = () => {
        return (
            <Modal
                visible={showSuccessModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <Wrapper
                    justify='center'
                    align='center'
                    color='rgba(0, 0, 0, 0.5)'
                    customStyles={{ flex: 1 }}
                >
                    <Wrapper
                        width={responsiveWidth(85)}
                        color={colors.white}
                        align="center"
                        customStyles={{
                            borderRadius: borderRadius.large,
                            padding: responsiveWidth(6),
                            shadowColor: colors.black,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                    >
                        {/* Success Icon */}
                        <View style={styles.successIcon}>
                            <IonIcon name="checkmark" size={40} color={colors.white} />
                        </View>

                        <Spacer y="XS" />

                        {/* Success Message */}
                        <CusText text="Can Created Successful" size="XL" semibold color={themeColors.text} customStyles={{ textAlign: 'center' }} />
                        {/* <Spacer y="XXS" /> */}
                        <CusText text="Congratulations" size="M" color={themeColors.subText} customStyles={{ textAlign: 'center' }} />

                        <Spacer y="XS" />

                        {/* Success Details */}
                        <View style={styles.successDetails}>
                            <View style={styles.successRow}>
                                <CusText text="Can Id" size="M" color={themeColors.subText} />
                                <CusText text={successData?.canId} size="M" semibold color={themeColors.text} />
                            </View>
                            <View style={styles.successRow}>
                                <CusText text="Name" size="M" color={themeColors.subText} />
                                <CusText text={successData?.name} size="M" semibold color={themeColors.text} />
                            </View>
                            <View style={styles.successRow}>
                                <CusText text="Status" size="M" color={themeColors.subText} />
                                <CusText text={successData?.status} size="M" semibold color={themeColors.text} />
                            </View>
                        </View>

                        <Spacer y="XXS" />

                        <CusText text="Thanks for being part of vedant mutual fund" size="M" color={colors.green} customStyles={{ textAlign: 'center', fontStyle: 'italic' }} />

                        <Spacer y="XS" />

                        {/* Okay Button */}
                        <CusButton
                            title="Okay"
                            onPress={() => setShowSuccessModal(false)}
                            width={responsiveWidth(70)}
                            lgcolor1={colors.orange}
                            lgcolor2={colors.orange}
                        />
                    </Wrapper>
                </Wrapper>
            </Modal>
        );
    };

    // Mandates List Modal
    const renderMandatesModal = () => {
        return (
            <Modal
                visible={showMandatesModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowMandatesModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <Wrapper
                        justify='center'
                        align='center'
                        color='rgba(0, 0, 0, 0.5)'
                        customStyles={{ flex: 1 }}
                    >
                        <Wrapper
                            width={responsiveWidth(95)}
                            height={responsiveHeight(80)}
                            color={colors.white}
                            customStyles={{
                                borderRadius: borderRadius.medium,
                                padding: responsiveWidth(4),
                                shadowColor: colors.black,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}
                        >
                            {/* Header */}
                            <Wrapper row justify="apart" align="center" customStyles={{ marginBottom: responsiveWidth(4) }}>
                                <CusText text="Linked Mandates" size="L" semibold color={themeColors.text} />
                                <TouchableOpacity onPress={() => setShowMandatesModal(false)}>
                                    <IonIcon name="close" size={24} color={themeColors.text} />
                                </TouchableOpacity>
                            </Wrapper>

                            {/* Mandates Count and Create Button */}
                            <Wrapper row justify="apart" align="center" customStyles={{ marginBottom: responsiveWidth(4) }}>
                                <CusText text={`Total Mandates: ${mandates.length}`} size="M" color={themeColors.subText} />
                                <TouchableOpacity
                                    style={styles.createMandateButton}
                                    onPress={() => {
                                        setShowMandatesModal(false);
                                        // Navigate to Create Mandate page with applicant data
                                        (navigation as any).navigate('CreateMandate', {
                                            applicantData: investorData,
                                            accountHoldings: accountHoldings
                                        });
                                    }}
                                >
                                    <IonIcon name="add-circle-outline" size={16} color={colors.white} />
                                    <CusText text="Create Mandate" size="S" semibold color={colors.white} />
                                </TouchableOpacity>
                            </Wrapper>

                            {/* Mandates List */}
                            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                                {mandates.length > 0 ? (
                                    mandates.map((mandate, index) => (
                                        <View key={mandate.id || index} style={styles.mandateListItem}>
                                            {/* Header Row */}
                                            <View style={styles.mandateItemHeader}>
                                                <View style={styles.mandateIdBadge}>
                                                    <CusText text={`#${mandate.id}`} size="XS" semibold color={colors.white} />
                                                </View>
                                                <View style={styles.mandateTypeBadge}>
                                                    <CusText text={mandate.mandate_type || 'E'} size="XS" semibold color={colors.primary1} />
                                                </View>
                                            </View>

                                            {/* Details */}
                                            <View style={styles.mandateDetails}>
                                                <View style={styles.mandateRow}>
                                                    <CusText text="CAN ID:" size="S" color={themeColors.subText} />
                                                    <CusText text={mandate.can_id || 'N/A'} size="S" semibold color={themeColors.text} />
                                                </View>
                                                <View style={styles.mandateRow}>
                                                    <CusText text="MMRN:" size="S" color={themeColors.subText} />
                                                    <CusText text={mandate.mmrn || 'N/A'} size="S" color={themeColors.text} />
                                                </View>
                                                <View style={styles.mandateRow}>
                                                    <CusText text="Account No:" size="S" color={themeColors.subText} />
                                                    <CusText text={mandate.acc_no || 'N/A'} size="S" color={themeColors.text} />
                                                </View>
                                                <View style={styles.mandateRow}>
                                                    <CusText text="IFSC:" size="S" color={themeColors.subText} />
                                                    <CusText text={mandate.ifsc || 'N/A'} size="S" color={themeColors.text} />
                                                </View>
                                                <View style={styles.mandateRow}>
                                                    <CusText text="Max Amount:" size="S" color={themeColors.subText} />
                                                    <CusText text={`₹${mandate.max_amt || '0'}`} size="S" semibold color={colors.green} />
                                                </View>
                                                <View style={styles.mandateRow}>
                                                    <CusText text="Start Date:" size="S" color={themeColors.subText} />
                                                    <CusText text={mandate.start_date || 'N/A'} size="S" color={themeColors.text} />
                                                </View>
                                                <View style={styles.mandateRow}>
                                                    <CusText text="End Date:" size="S" color={themeColors.subText} />
                                                    <CusText text={mandate.end_date || 'N/A'} size="S" color={themeColors.text} />
                                                </View>
                                                <View style={styles.mandateRow}>
                                                    <CusText text="Status:" size="S" color={themeColors.subText} />
                                                    <View style={[styles.statusBadge, {
                                                        backgroundColor: mandate.mandate_status === 'Active' ? colors.green : colors.orange
                                                    }]}>
                                                        <CusText text={mandate.mandate_status || 'Pending'} size="XS" semibold color={colors.white} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.emptyMandatesState}>
                                        <IonIcon name="document-outline" size={responsiveWidth(15)} color={themeColors.subText} />
                                        <CusText text="No mandates found" size="M" color={themeColors.subText} />
                                    </View>
                                )}
                            </ScrollView>
                        </Wrapper>
                    </Wrapper>
                </KeyboardAvoidingView>
            </Modal>
        );
    };

    return (
        <>
            <Header name="Account Holdings" backBtn />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Spacer y="XS" />

                {renderActionButtons()}

                <Spacer y="XS" />

                {/* New Applicant Cards Design */}
                {renderApplicantCards()}



                {/* <Spacer y="L" /> */}

                {/* Account Holdings Section */}
                {/* {renderAccountHoldings()} */}

                {/* Uncomment below sections if needed */}
                {/* {renderInvestorInfo()}
                {renderMandates()} */}

                <Spacer y="XL" />
            </ScrollView>

            {/* Modals */}
            {renderCreateModal()}
            {renderSuccessModal()}
            {renderMandatesModal()}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: responsiveWidth(4),
    },
    section: {
        marginBottom: responsiveWidth(6),
    },
    infoCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.medium,
        padding: responsiveWidth(4),
        borderWidth: 1,
        borderColor: colors.lightGray,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: responsiveWidth(2),
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray + '30',
    },
    holdingCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.medium,
        padding: responsiveWidth(4),
        marginBottom: responsiveWidth(3),
        borderWidth: 1,
        borderColor: colors.lightGray,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    holdingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveWidth(3),
    },
    holdingDetails: {
        paddingTop: responsiveWidth(2),
        borderTopWidth: 1,
        borderTopColor: colors.lightGray + '30',
    },
    mandateCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.medium,
        padding: responsiveWidth(4),
        marginBottom: responsiveWidth(3),
        borderWidth: 1,
        borderColor: colors.lightGray,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    mandateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveWidth(3),
    },
    mandateDetails: {
        paddingTop: responsiveWidth(2),
        borderTopWidth: 1,
        borderTopColor: colors.lightGray + '30',
    },
    statusBadge: {
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveWidth(1),
        borderRadius: borderRadius.small,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: responsiveWidth(10),
        backgroundColor: colors.white,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    // buttonContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     marginBottom: responsiveWidth(4),
    //     gap: responsiveWidth(3),
    // },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: responsiveWidth(3.5),
        paddingHorizontal: responsiveWidth(4),
        borderRadius: borderRadius.medium,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        gap: responsiveWidth(2),
    },
    viewAllButton: {
        backgroundColor: colors.primary1,
    },
    createNewButton: {
        backgroundColor: colors.green,
    },
    // Applicant Card Styles
    applicantCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: colors.lightGray,
        marginBottom: responsiveWidth(4),
        elevation: 3,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.lightGray + '20',
        padding: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: responsiveWidth(2),
    },
    badge: {
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveWidth(1),
        borderRadius: borderRadius.small,
    },
    primaryBadge: {
        backgroundColor: colors.primary1 + '20',
    },
    successBadge: {
        backgroundColor: colors.green + '20',
    },
    cardContent: {
        padding: responsiveWidth(4),
        paddingVertical: responsiveWidth(2),
    },
    applicantInfo: {
        flexDirection: 'row',
        gap: responsiveWidth(4),
        alignItems: 'flex-start',
    },
    numberBadge: {
        backgroundColor: colors.primary1 + '20',
        borderRadius: borderRadius.medium,
        padding: responsiveWidth(1.5),
        minWidth: responsiveWidth(6),
        alignItems: 'center',
    },
    applicantDetails: {
        flex: 1,
        gap: responsiveWidth(1),
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: responsiveWidth(4),
        borderTopWidth: 1,
        borderTopColor: colors.lightGray + '30',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
    },
    linkedMandatesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(2),
    },
    mandateCountBadge: {
        backgroundColor: colors.primary1,
        borderRadius: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveWidth(0.5),
        minWidth: responsiveWidth(5),
        alignItems: 'center',
    },
    // New Card Design Styles
    cardsContainer: {
        gap: responsiveWidth(2),
    },
    newApplicantCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: colors.lightGray,
        marginBottom: responsiveWidth(0),
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        overflow: 'hidden',
    },
    newCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: responsiveWidth(3),
        paddingBottom: responsiveWidth(0),
    },
    newBadgeContainer: {
        flexDirection: 'row',
        gap: responsiveWidth(2),
    },
    singleBadge: {
        backgroundColor: colors.orange + '20',
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveWidth(1),
        borderRadius: borderRadius.small,
    },
    activeBadge: {
        backgroundColor: colors.green + '20',
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveWidth(1),
        borderRadius: borderRadius.small,
    },
    applicantList: {
        paddingHorizontal: responsiveWidth(4),
        paddingBottom: responsiveWidth(0),
        gap: responsiveWidth(2),
    },
    applicantItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: responsiveWidth(0),
        // marginBottom: responsiveWidth(3),
    },
    applicantNumber: {
        width: responsiveWidth(6),
        alignItems: 'flex-start',
        paddingTop: responsiveWidth(0.5),
    },
    newApplicantDetails: {
        flex: 1,
        gap: responsiveWidth(0.5),
    },
    newCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
        borderTopWidth: 1,
        borderTopColor: colors.lightGray + '30',
    },
    newLinkedMandatesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(2),
    },
    newMandateCountBadge: {
        backgroundColor: colors.lightGray + '40',
        borderRadius: responsiveWidth(2.5),
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveWidth(1),
        minWidth: responsiveWidth(5),
        alignItems: 'center',
    },
    editButton: {
        padding: responsiveWidth(1),
    },
    // Success Modal Styles
    successIcon: {
        width: responsiveWidth(20),
        height: responsiveWidth(20),
        borderRadius: responsiveWidth(10),
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successDetails: {
        width: '100%',
        backgroundColor: colors.lightGray + '20',
        borderRadius: borderRadius.medium,
        padding: responsiveWidth(4),
    },
    successRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: responsiveWidth(1),
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray + '30',
    },
    // Mandates Modal Styles
    mandateListItem: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: colors.lightGray,
        marginBottom: responsiveWidth(3),
        padding: responsiveWidth(4),
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    mandateItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveWidth(3),
    },
    mandateIdBadge: {
        backgroundColor: colors.primary1,
        borderRadius: borderRadius.small,
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveWidth(1),
    },
    mandateTypeBadge: {
        backgroundColor: colors.primary1 + '20',
        borderRadius: borderRadius.small,
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveWidth(1),
    },
    mandateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: responsiveWidth(1.5),
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray + '20',
    },
    emptyMandatesState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: responsiveWidth(15),
        gap: responsiveWidth(3),
    },
    createMandateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary1,
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(2),
        borderRadius: borderRadius.small,
        gap: responsiveWidth(1),
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
});

export default AccountHolding;
