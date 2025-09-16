import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View, FlatList, StyleSheet, Modal } from 'react-native';
import { AppearanceContext } from '../../../context/appearanceContext';
import Wrapper from '../../../ui/wrapper';
import CusText from '../../../ui/custom-text';
import { colors, responsiveWidth, responsiveHeight, borderRadius } from '../../../styles/variables';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { getAllongoingGoal, getPlanDataApi, deleteGoalPlanApi } from '../../../api/homeapi';
import { showToast, toastTypes } from '../../../services/toastService';
import API from '../../../utils/API';
import Spacer from '../../../ui/spacer';

const OngoingGoal = () => {
    const { colors: themeColors }: any = useContext(AppearanceContext);
    const navigation = useNavigation();
    const isFocused: any = useIsFocused();

    // Sample ongoing goals data
    const [ongoingGoals, setonGoingGoalTypesData] = useState<any[]>([]);

    // Delete confirmation dialog state
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState<any>(null);
    const [actions, setAction] = useState<any[]>([
        {
            id: 1,
            name: 'Edit',
            icon: 'create',
        },
        {
            id: 2,
            name: 'Delete',
            icon: 'trash',
        },
        {
            id: 3,
            name: 'Execute',
            icon: 'eye',
        },
        {
            id: 4,
            name: 'Details',
            icon: 'brush',
        },
    ]);

    useEffect(() => {
        goalTypes();
    }, [isFocused]);

    const goalTypes = async () => {
        try {
            const [result, error]: any = await getAllongoingGoal();
            console.log('result--**--', result);
            console.log('result?.data----', result?.data);
            console.log('result?.error----', error);
            if (result) {
                if (result?.data?.onGoingGoalDetails.length > 0) {
                    setonGoingGoalTypesData(result?.data?.onGoingGoalDetails);
                } else {
                    showToast(toastTypes.info, 'No Data Found');
                }
            } else {
            }


        } catch (error: any) {
            console.log('goalTypes Catch Error', error);
            showToast(toastTypes.error, error[0].msg);
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(1)}Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(0)}K`;
        }
        return `₹${amount}`;
    };

    const handleGoalPress = (goal: any) => {
        console.log('View goal details:', goal.title);
        // Navigate to goal details screen
        // navigation.navigate('GoalDetails', { goal });
    };

    // const GetPlanData = async (goal_plan_id: any) => {
    //     try {
    //         const [result, error]: any = await getPlanDataApi(goal_plan_id);
    //         if (result) {
    //             console.log('result === > ', result?.data)
    //             setAllData(result?.data)
    //             setSchemeList(result?.data?.schemeList)
    //             const LineChartData = await Promise.all(
    //                 result?.data?.allocArr.map(async (item: any, index: any) => {
    //                     return {
    //                         value: item?.weightage,
    //                         text: item?.Name,
    //                         color: color[index % color.length]
    //                     };

    //                 })
    //             );
    //             console.log('LineChartData ==== >>> ', LineChartData)
    //             setPieData1(LineChartData)
    //         } else {
    //             console.log('GetPlanData Error', error)
    //             showToast(toastTypes.info, error)
    //         }
    //     } catch (error: any) {
    //         console.log('GetPlanData catch Error : ', error)
    //         showToast(toastTypes.error, error)
    //     }
    // }


    const handleEditGoal = async (goal: any) => {
        try {
            console.log('=== EDIT GOAL DEBUG ===');
            console.log('Goal data:', goal);
            console.log('Goal ID:', goal.id);
            console.log('Goal keys:', Object.keys(goal));
            // Call API to get goal plan wise scheme data
            // const result = await API.get(`goal-plan/getGoalPlanWiseSchemeData/${goal.id}`);
            const [result, error]: any = await getPlanDataApi(goal.id);
            console.log('Goal plan edit scheme data:', result);

            if (result?.data) {
                console.log('Goal plan edit scheme data:', result.data);

                // Prepare the data for MFAllocation screen
                const goalData = {
                    title: goal?.goal_label,
                    targetAmount: goal?.target_amt,
                    timeFrame: goal?.duration_mts || goal?.sip_duration_mts,
                    timeFrameType: 'months',
                    inflationRate: goal?.inflation_perc,
                    goalType: { id: goal.goal_type_id, title: goal.GoalType?.goal_name }
                };

                const recommendedPlan = {
                    ...result.data,
                    schemesList: result.data.schemeList || result.data.schemes || result.data.schemesList || [],
                    allocArr: result.data.allocations || result.data.allocArr || [],
                    months: goal.duration_mts || goal.sip_duration_mts,
                    targetammount: goal.target_amt || goal.targetAmount,
                    goal_risk_category_id: goal.risk_category_id,
                    err_perc: goal.err_perc || 12,
                    lumpsum_calculated_value: goal.lumpsum_amt,
                    sip_calculated_value: goal.sip_amt,
                    goal_sip_projected_value: goal.calc_amt,
                    goal_projected_value: goal.lumpsum_current_amt,
                    inflation_rate: goal.inflation_perc
                };

                const selectedPlanType = goal.investment_type || 'sip';

                console.log('=== EDIT GOAL NAVIGATION DEBUG ===');
                console.log('Goal ID:', goal.id);
                console.log('API Response:', result.data);
                console.log('Schemes List:', result.data.schemeList || result.data.schemes);
                console.log('Prepared goalData:', goalData);
                console.log('Prepared recommendedPlan:', recommendedPlan);
                console.log('Selected Plan Type:', selectedPlanType);
                console.log('Original Goal:', goal);

                // Navigate to MFAllocation screen
                console.log('=== NAVIGATION PARAMS DEBUG ===');
                console.log('About to navigate with params:', {
                    recommendedPlan: recommendedPlan,
                    selectedPlanType: selectedPlanType,
                    goalData: goalData,
                    isEditMode: true,
                    originalGoal: goal
                });

                (navigation as any).navigate('MFAllocation', {
                    recommendedPlan: recommendedPlan,
                    selectedPlanType: selectedPlanType,
                    goalData: goalData,
                    isEditMode: true,
                    originalGoal: goal
                });

            } else {
                showToast(toastTypes.error, 'Failed to load goal data');
            }
        } catch (error: any) {
            console.log('Edit goal error:', error);
            showToast(toastTypes.error, 'Failed to load goal data');
        }
    };

    const handleDeleteGoal = async (goal: any) => {
        try {
            console.log('=== DELETE GOAL DEBUG ===');
            console.log('Goal to delete:', goal);
            console.log('Goal ID:', goal.id);

            const [result, error]: any = await deleteGoalPlanApi({ id: goal.id });

            if (result) {
                console.log('Delete goal result:', result);
                showToast(toastTypes.success, result?.msg || 'Goal deleted successfully');

                // Refresh the goals list
                goalTypes();

                // Close confirmation dialog
                setShowDeleteConfirmation(false);
                setGoalToDelete(null);
            } else {
                console.log('Delete goal error:', error);
                showToast(toastTypes.error, error || 'Failed to delete goal');
            }
        } catch (error: any) {
            console.log('Delete goal catch error:', error);
            showToast(toastTypes.error, 'An error occurred while deleting the goal');
        }
    };

    const confirmDeleteGoal = (goal: any) => {
        console.log('Confirming delete for goal:', goal.goal_label);
        setGoalToDelete(goal);
        setShowDeleteConfirmation(true);
    };

    const cancelDeleteGoal = () => {
        setShowDeleteConfirmation(false);
        setGoalToDelete(null);
    };

    const performActions = (action: any, goal: any) => {
        console.log('Performing action:', action.name, 'on goal:', goal.goal_label);

        switch (action.name) {
            case 'Edit':
                handleEditGoal(goal);
                break;
            case 'Delete':
                confirmDeleteGoal(goal);
                break;
            case 'Execute':
                // Implement execute functionality
                console.log('Execute goal:', goal.id);
                showToast(toastTypes.info, 'Execute functionality coming soon');
                break;
            case 'Details':
                // Implement details functionality
                console.log('View details for goal:', goal.id);
                showToast(toastTypes.info, 'Details functionality coming soon');
                break;
            default:
                console.log('Unknown action:', action.name);
        }
    };

    const renderProgressBar = (progress: number, color: string) => {
        return (
            <View style={styles.progressBarContainer}>
                <LinearGradient
                    colors={[color, color + '80']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBar, { width: `${progress}%` }]}
                />
            </View>
        );
    };

    const renderGoalCard_BUP = ({ item: goal }: any) => {
        const progress = goal.progress || 0;
        const isInitiated = goal.status !== 'Not Initiated';

        return (
            <TouchableOpacity
                onPress={() => handleGoalPress(goal)}
                activeOpacity={0.8}
                style={{ marginBottom: responsiveWidth(4) }}
            >
                <View style={[styles.goalCard, { backgroundColor: themeColors.cardBackground }]}>
                    {/* Header Row with Goal Name and Status */}
                    <View style={styles.headerRow}>
                        <View style={styles.goalNameContainer}>
                            <View style={styles.goalIconCircle}>
                                <CusText
                                    text={goal.title?.charAt(0) || 'G'}
                                    size="M"
                                    color={colors.white}
                                    bold
                                />
                            </View>
                            <CusText
                                text={goal.title || 'Goal'}
                                size="L"
                                color={themeColors.text}
                                bold
                                customStyles={{ marginLeft: responsiveWidth(3) }}
                            />
                        </View>

                        <View style={styles.statusContainer}>
                            <View style={[styles.statusBadge, {
                                backgroundColor: isInitiated ? colors.primary1 : '#6B7280'
                            }]}>
                                <CusText
                                    text={isInitiated ? 'Initiated' : 'Not Initiated'}
                                    size="XS"
                                    color={colors.white}
                                    bold
                                />
                            </View>
                            <View style={[styles.typeBadge, {
                                backgroundColor: '#3B82F6'
                            }]}>
                                <CusText
                                    text={goal.investment_type || 'Lumpsum'}
                                    size="XS"
                                    color={colors.white}
                                    bold
                                />
                            </View>
                        </View>
                    </View>

                    {/* Category */}
                    <View style={styles.categoryRow}>
                        <CusText
                            text="Category: "
                            size="S"
                            color={themeColors.subText}
                        />
                        <CusText
                            text={goal.category || goal.type || 'Wedding'}
                            size="S"
                            color={themeColors.text}
                            bold
                        />
                    </View>

                    {/* Target Amount */}
                    <View style={styles.targetRow}>
                        <CusText
                            text="Target"
                            size="S"
                            color={themeColors.subText}
                        />
                        <CusText
                            text={formatCurrency(goal.target_amt || goal.targetAmount || 10000000)}
                            size="XL"
                            color={themeColors.text}
                            bold
                        />
                    </View>

                    {/* Current Value and Achieved */}
                    <View style={styles.valuesRow}>
                        <View style={styles.valueItem}>
                            <CusText
                                text="Current Value"
                                size="XS"
                                color={themeColors.subText}
                            />
                            <CusText
                                text={formatCurrency(goal.current_value || goal.currentAmount || 0)}
                                size="S"
                                color={themeColors.text}
                                bold
                            />
                        </View>
                        <View style={styles.valueItem}>
                            <CusText
                                text="Achieved"
                                size="XS"
                                color={themeColors.subText}
                            />
                            <CusText
                                text={formatCurrency(goal.achieved_amount || 0)}
                                size="S"
                                color={themeColors.text}
                                bold
                            />
                        </View>
                    </View>

                    {/* Investment Details */}
                    <View style={styles.investmentRow}>
                        <View style={styles.investmentItem}>
                            <CusText
                                text="Invested Months:"
                                size="XS"
                                color={themeColors.subText}
                            />
                            <CusText
                                text={`${goal.invested_months || 0}%`}
                                size="S"
                                color={themeColors.text}
                                bold
                            />
                        </View>
                        <View style={styles.investmentItem}>
                            <CusText
                                text="Recommended Months:"
                                size="XS"
                                color={themeColors.subText}
                            />
                            <CusText
                                text={`${goal.recommended_months || goal.duration_mts || 0}`}
                                size="S"
                                color={themeColors.text}
                                bold
                            />
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F97316' }]}>
                            <CusText text="Edit" size="XS" color={colors.white} bold />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#EF4444' }]}>
                            <CusText text="Delete" size="XS" color={colors.white} bold />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10B981' }]}>
                            <CusText text="Execute" size="XS" color={colors.white} bold />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#6366F1' }]}>
                            <CusText text="Details" size="XS" color={colors.white} bold />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderGoalCard = ({ item, index }: any) => {
        let investType: any = '';
        let recommended: any = '';
        let months: any = '';
        if (item?.sip_amt === 0) {
            investType = 'Lumpsum';
            recommended = item?.lumpsum_amt;
            months = item?.duration_mts;
        }
        if (item?.lumpsum_amt === 0) {
            investType = 'SIP';
            recommended = item?.sip_amt;
            months = item?.sip_duration_mts;
        }
        return (
            <>
                <Wrapper customStyles={{
                    borderRadius: borderRadius.medium,
                    borderWidth: 1,
                    marginVertical: responsiveWidth(2),
                    borderColor: colors.gray,
                    paddingVertical: responsiveWidth(4),
                    paddingHorizontal: responsiveWidth(5),

                }}>
                    <Wrapper row align='center' justify='apart' customStyles={{ paddingVertical: responsiveWidth(1) }}>
                        <CusText bold color={colors.black} size='M' text={item?.goal_label} />
                        {/* <TouchableOpacity onPress={() => { toggleActionArea(index) }} activeOpacity={0.6}>

              <Wrapper position='center' align='center' justify='center' color={colors.Hard_White} customStyles={{ borderRadius: borderRadius.ring, padding: responsiveWidth(0) }}>
                <IonIcon size={responsiveWidth(8)} name={'ellipsis-vertical-circle'} color={colors.orange} />
              </Wrapper>
            </TouchableOpacity> */}
                    </Wrapper>
                    <Wrapper align='center' justify='apart' row customStyles={{}}>
                        <Wrapper row align='center'>
                            <CusText bold color={colors.label} size='SN' text={'Category : '} />
                            <CusText bold color={colors.label} size='SN' text={item?.GoalType?.goal_name} />
                        </Wrapper>
                        <Wrapper color={colors.primary1} customStyles={{ minWidth: responsiveWidth(20), paddingVertical: responsiveWidth(1), paddingHorizontal: responsiveWidth(2), borderRadius: borderRadius.middleSmall }}>
                            <CusText position='center' bold color={colors.Hard_White} size='SN' text={investType} />
                        </Wrapper>
                    </Wrapper>
                    <Wrapper row align='center' justify='apart' customStyles={{ marginTop: responsiveWidth(2) }}>
                        <Wrapper>
                            <CusText size='SN' text={'Target'} semibold color={colors.black} />

                        </Wrapper>
                        <Wrapper align='end'>
                            <CusText
                                semibold
                                size="M"
                                color={colors.primary}
                                text={'₹' + (item?.target_amt || 0)}
                            />
                        </Wrapper>
                    </Wrapper>
                    <Wrapper row align='center' justify='apart' customStyles={{ marginTop: responsiveWidth(2) }}>
                        <Wrapper>
                            <CusText size='SN' text={'Current Value'} semibold color={colors.black} />

                        </Wrapper>
                        <Wrapper align='end'>
                            <CusText
                                extraBold
                                size="M"
                                color={colors.primary}
                                text={'₹' + (item?.totalAlloc?.Current || 0)}
                            />
                        </Wrapper>
                    </Wrapper>
                    <Wrapper justify='apart' row align='center' borderColor={colors.primary} customStyles={{ marginTop: responsiveWidth(2), borderWidth: 1, borderRadius: borderRadius.middleSmall, paddingHorizontal: responsiveWidth(2), paddingVertical: responsiveWidth(2) }}>
                        <CusText color={colors.label} size="SN" text={'Achieved'} />
                        <CusText
                            color={colors.label}
                            bold
                            size="SN"
                            text={
                                (
                                    (item?.totalAlloc?.Current?.toFixed(2) /
                                        item?.target_amt.toFixed(2)) *
                                    100
                                ).toFixed(2) + '%'
                            }
                        />
                    </Wrapper>
                    <Wrapper customStyles={{ marginTop: responsiveWidth(3) }}>
                        {/* <Wrapper justify='apart' row align='center' >
              <Wrapper align='start'>
                <CusText size='SS' text={'Invested - Months'} />
                <CusText
                  bold
                  size="M"
                  color={colors.primary}
                  text={'₹' + (item?.totalAlloc?.Invested || 0) + ' - ' + (item?.totalAlloc?.transaction_month || 0)}
                />
              </Wrapper>
              <Wrapper align='end'>
                <CusText size='SS' text={'Recommended - Months'} />
                <CusText
                  bold
                  size="M"
                  color={colors.primary}
                  text={'₹' + (recommended || 0) + ' - ' + (months || 0)}
                />
              </Wrapper>
            </Wrapper> */}
                        <Wrapper justify='apart' row align='center' >
                            <Wrapper row align='start'>
                                <CusText semibold size='SS' text={'Invested : '} />
                                <CusText
                                    size="SS"
                                    color={colors.primary}
                                    text={'₹' + (item?.totalAlloc?.Invested || 0)}
                                />
                            </Wrapper>
                            <Wrapper row align='end'>
                                <CusText semibold size='SS' text={'Months : '} />
                                <CusText
                                    size="SS"
                                    color={colors.primary}
                                    text={(item?.totalAlloc?.transaction_month || 0)}
                                />
                            </Wrapper>
                        </Wrapper>
                        <Wrapper justify='apart' row align='center' customStyles={{ marginTop: responsiveWidth(3) }} >
                            <Wrapper row align='end'>
                                <CusText semibold size='SS' text={'Recommended : '} />
                                <CusText
                                    size="SS"
                                    color={colors.primary}
                                    text={'₹' + (recommended || 0)}
                                />
                            </Wrapper>
                            <Wrapper row align='end'>
                                <CusText semibold size='SS' text={'Months : '} />
                                <CusText
                                    size="SS"
                                    color={colors.primary}
                                    text={(months || 0)}
                                />
                            </Wrapper>
                        </Wrapper>
                    </Wrapper>
                    <Spacer y='XXS' />
                    <Wrapper customStyles={{ marginTop: responsiveWidth(2) }}>
                        <LinearGradient
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={[colors.primary, colors.primary, colors.primary]}
                            style={{ width: '100%', height: 1, opacity: 0.5 }}></LinearGradient>
                    </Wrapper>
                    <Spacer y='XXS' />
                    <Wrapper row justify='apart' align='center' position='center' customStyles={{ gap: responsiveWidth(2) }}>
                        {
                            actions.map((aitem: any, aindex: any) => {
                                return (
                                    <>
                                        <TouchableOpacity onPress={() => {
                                            performActions(aitem, item)
                                        }} activeOpacity={0.6}>
                                            <Wrapper row position='center' align='center' justify='center' color={colors.secondary} customStyles={{
                                                gap: responsiveWidth(1),
                                                borderRadius: borderRadius.middleSmall,
                                                paddingVertical: responsiveWidth(2),
                                                paddingHorizontal: responsiveWidth(2),
                                                width: responsiveWidth(20)
                                            }}>
                                                {/* <IonIcon size={responsiveWidth(5)} name={aitem?.icon} color={colors.orange} /> */}
                                                <CusText semibold text={aitem?.name} color={colors.white} />
                                            </Wrapper>
                                        </TouchableOpacity>
                                    </>
                                )
                            })
                        }
                    </Wrapper>


                </Wrapper>
            </>
        );
    };

    const renderEmptyState = () => {
        return (
            <Wrapper
                customStyles={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: responsiveWidth(20),
                    paddingHorizontal: responsiveWidth(8),
                }}
            >
                <IonIcon
                    name="flag-outline"
                    size={responsiveWidth(20)}
                    color={themeColors.subText}
                    style={{ marginBottom: responsiveWidth(4) }}
                />
                <CusText
                    text="No Ongoing Goals"
                    size="L"
                    color={themeColors.text}
                    bold
                    customStyles={{ marginBottom: responsiveWidth(2), textAlign: 'center' }}
                />
                <CusText
                    text="Start your financial journey by creating your first goal"
                    size="S"
                    color={themeColors.subText}
                    customStyles={{ textAlign: 'center', lineHeight: responsiveWidth(5) }}
                />
            </Wrapper>
        );
    };

    return (
        <Wrapper position='center' width={responsiveWidth(95)} customStyles={{}}>
            {ongoingGoals.length > 0 ? (
                <FlatList
                    data={ongoingGoals}
                    renderItem={renderGoalCard}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: responsiveWidth(5) }}
                />
            ) : (
                renderEmptyState()
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                visible={showDeleteConfirmation}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelDeleteGoal}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: colors.white }]}>
                        <View style={styles.modalHeader}>
                            <IonIcon
                                name="warning"
                                size={responsiveWidth(12)}
                                color={colors.red}
                                style={{ marginBottom: responsiveWidth(4) }}
                            />
                            <CusText
                                text="Delete Goal"
                                size="L"
                                color={themeColors.text}
                                bold
                                customStyles={{ marginBottom: responsiveWidth(2) }}
                            />
                            <CusText
                                text={`Are you sure you want to delete "${goalToDelete?.goal_label}"?`}
                                size="M"
                                color={themeColors.subText}
                                customStyles={{
                                    textAlign: 'center',
                                    lineHeight: responsiveWidth(5),
                                    marginBottom: responsiveWidth(2)
                                }}
                            />
                            <CusText
                                text="This action cannot be undone."
                                size="S"
                                color={colors.red}
                                customStyles={{
                                    textAlign: 'center',
                                    marginBottom: responsiveWidth(6)
                                }}
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={cancelDeleteGoal}
                                activeOpacity={0.7}
                            >
                                <CusText
                                    text="Cancel"
                                    size="M"
                                    color={themeColors.text}
                                    bold
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.deleteButton]}
                                onPress={() => handleDeleteGoal(goalToDelete)}
                                activeOpacity={0.7}
                            >
                                <CusText
                                    text="Delete"
                                    size="M"
                                    color={colors.white}
                                    bold
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    goalCard: {
        borderRadius: borderRadius.large,
        padding: responsiveWidth(4),
        marginHorizontal: responsiveWidth(4),
        elevation: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: colors.lightGray + '50',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: responsiveWidth(3),
    },
    goalNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    goalIconCircle: {
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        borderRadius: responsiveWidth(5),
        backgroundColor: colors.primary1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statusContainer: {
        alignItems: 'flex-end',
        gap: responsiveWidth(1),
    },
    statusBadge: {
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveWidth(1),
        borderRadius: borderRadius.small,
        elevation: 1,
    },
    typeBadge: {
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveWidth(1),
        borderRadius: borderRadius.small,
        elevation: 1,
    },
    categoryRow: {
        flexDirection: 'row',
        marginBottom: responsiveWidth(2),
    },
    targetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveWidth(3),
    },
    valuesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveWidth(3),
    },
    valueItem: {
        flex: 1,
    },
    investmentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveWidth(4),
    },
    investmentItem: {
        flex: 1,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: responsiveWidth(2),
    },
    actionButton: {
        flex: 1,
        paddingVertical: responsiveWidth(2.5),
        borderRadius: borderRadius.small,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    iconContainer: {
        width: responsiveWidth(14),
        height: responsiveWidth(14),
        borderRadius: responsiveWidth(7),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(3),
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    progressBadge: {
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(1.5),
        borderRadius: borderRadius.small,
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    progressBarContainer: {
        height: responsiveWidth(2.5),
        backgroundColor: colors.lightGray + '50',
        borderRadius: responsiveWidth(1.25),
        marginVertical: responsiveWidth(2),
        overflow: 'hidden',
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    progressBar: {
        height: '100%',
        borderRadius: responsiveWidth(1.25),
        elevation: 1,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: responsiveWidth(5),
    },
    modalContainer: {
        width: '100%',
        maxWidth: responsiveWidth(85),
        borderRadius: borderRadius.large,
        padding: responsiveWidth(6),
        elevation: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: responsiveWidth(4),
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: responsiveWidth(3),
    },
    modalButton: {
        flex: 1,
        paddingVertical: responsiveWidth(3.5),
        paddingHorizontal: responsiveWidth(4),
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    deleteButton: {
        backgroundColor: colors.red,
    },
});

export default OngoingGoal;
