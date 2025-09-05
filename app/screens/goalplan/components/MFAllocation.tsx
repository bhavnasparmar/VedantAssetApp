import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AppearanceContext } from '../../../context/appearanceContext';
import CusText from '../../../ui/custom-text';
import { colors, responsiveWidth, responsiveHeight, borderRadius } from '../../../styles/variables';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showToast, toastTypes } from '../../../services/toastService';
import CusButton from '../../../ui/custom-button';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Header from '../../../shared/components/Header/Header';
import Container from '../../../ui/container';
import Wrapper from '../../../ui/wrapper';
import Spacer from '../../../ui/spacer';
import { PieChart } from "react-native-gifted-charts";
import { getSuggestedSchemesApi, saveGoalDataApi, saveGoalDataAllocApi } from '../../../api/homeapi';
import API from '../../../utils/API';

interface MFAllocationProps {
    recommendedPlan?: any;
    selectedPlanType?: string;
    onBack?: () => void;
    onSave?: () => void;
    onSaveAndExecute?: () => void;
    isModal?: boolean;
    isEditMode?: boolean;
    originalGoal?: any;
}

const MFAllocation: React.FC<MFAllocationProps> = ({
    recommendedPlan,
    selectedPlanType,
    onBack,
    onSave,
    onSaveAndExecute,
    isModal = false,
    isEditMode = false,
    originalGoal
}) => {
    const { colors: themeColors }: any = useContext(AppearanceContext);
    const navigation = useNavigation() as any;
    const route: any = useRoute();

    // State management
    const [schemesList, setSchemesList] = useState<any[]>([]);
    const [pieData, setPieData] = useState<any[]>([]);
    const [allocationData, setAllocationData] = useState<any>(null);

    // Get data from props or route params
    const planData = recommendedPlan || route.params?.recommendedPlan;
    const planType = selectedPlanType || route.params?.selectedPlanType;
    const goalData = route.params?.goalData;
    const editMode = isEditMode || route.params?.isEditMode || false;
    const originalGoalData = originalGoal || route.params?.originalGoal;

    // TEMPORARY: Force edit mode for testing if we have originalGoal data
    const forceEditMode = editMode || (originalGoalData && Object.keys(originalGoalData).length > 0);

    console.log('=== EDIT MODE DETECTION ===');
    console.log('editMode from params:', editMode);
    console.log('originalGoalData exists:', !!originalGoalData);
    console.log('forceEditMode:', forceEditMode);

    // Debug logging
    console.log('=== MF ALLOCATION DEBUG ===');
    console.log('isEditMode prop:', isEditMode);
    console.log('route.params?.isEditMode:', route.params?.isEditMode);
    console.log('route.params full object:', JSON.stringify(route.params, null, 2));
    console.log('editMode final:', editMode);
    console.log('originalGoalData:', originalGoalData);
    console.log('originalGoalData has id?:', originalGoalData?.id);
    console.log('originalGoalData has goal_plan_id?:', originalGoalData?.goal_plan_id);

    useEffect(() => {
        if (planData) {
            initializeData();
        }
    }, [planData]);

    const initializeData = () => {
        // Set schemes list from recommendedPlan
        if (planData?.schemesList) {
            setSchemesList(planData.schemesList);
        }

        // Set pie chart data from allocArr
        if (planData?.allocArr) {
            generatePieChartData(planData.allocArr);
        }

        setAllocationData(planData);
    };

    const generatePieChartData = (allocArr: any[]) => {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

        const chartData = allocArr.map((item: any, index: number) => ({
            value: Number(item.weightage || 0),
            text: item.Name || item.name || 'Unknown',
            color: colors[index % colors.length]
        }));

        setPieData(chartData);
    };

    const handleSchemeChange = async (scheme: any) => {
        try {
            console.log('=== SCHEME CHANGE DEBUG ===');
            console.log('Original scheme data:', scheme);
            console.log('Scheme SchemeMaster:', scheme?.SchemeMaster);
            console.log('Scheme subcategory ID:', scheme?.scheme_subcate_id);

            const payload = {
                subcategory_id: scheme?.scheme_subcate_id,
                currentSchemeId: scheme?.id?.toString(),
                sip_amount: scheme?.sip_amount || 0,
                lumpsum_amount: scheme?.lumpsum_amount || 0,
                weightage: scheme?.alloc_perc || scheme?.weightage || 0
            };

            console.log('Scheme change payload:', payload);

            // Navigate to scheme selection screen
            navigation.navigate('SchemeSelection', {
                payload,
                originalScheme: scheme,
                planType,
                isEditMode: forceEditMode, // Pass edit mode flag
                originalGoal: originalGoalData, // Pass original goal data
                goalData: goalData, // Pass goal data
                onSchemeSelected: (newScheme: any) => {
                    console.log('Received updated scheme:', newScheme);
                    console.log('Current schemes list:', schemesList);

                    // Replace the scheme in the list following SchemeEdit pattern
                    const updatedSchemes = schemesList.map(item => {
                        if (item.id === scheme.id) {
                            console.log('Replacing scheme:', item.id, 'with:', newScheme);
                            return newScheme; // Use the complete updated scheme object
                        }
                        return item;
                    });

                    console.log('Updated schemes list:', updatedSchemes);
                    setSchemesList(updatedSchemes);

                    // Also update the allocation data if needed
                    if (allocationData && allocationData.schemesList) {
                        const updatedAllocationData = {
                            ...allocationData,
                            schemesList: updatedSchemes
                        };
                        setAllocationData(updatedAllocationData);
                    }
                }
            });

        } catch (error) {
            console.log('Scheme change error:', error);
            showToast(toastTypes.error, 'Failed to load scheme options');
        }
    };

    const handleBack = () => {
        if (forceEditMode) {
            // In edit mode, show the goal calculation modal
            console.log('Re-calculating forceEditMode:', forceEditMode);

            handleReCalculate();
        } else if (onBack) {
            onBack();
        } else {
            navigation.goBack();
        }
    };

    const handleReCalculate = () => {
        console.log('Re-calculating goal with original data:', originalGoalData);
        console.log('Re-calculating goal with original data:', goalData);
        console.log('Re-calculating with forceEditMode:', forceEditMode);

        // Navigate back to goal calculation with pre-filled data
        // Navigate to the tab navigation with GoalPlanDashboard
        navigation.navigate('Main', {
            screen: 'Tabs',
            params: {
                screen: 'GoalPlanDashboard',
                params: {
                    openCalculationModal: true,
                    isEditMode: true, // Pass edit mode flag
                    originalGoal: originalGoalData, // Pass original goal data
                    existingGoalData: {
                        goalTitle: originalGoalData?.goal_label || goalData?.title,
                        targetAmount: originalGoalData?.target_amt?.toString() || goalData?.targetAmount?.toString(),
                        timeFrame: originalGoalData?.duration_mts?.toString() || originalGoalData?.sip_duration_mts?.toString() || goalData?.timeFrame?.toString(),
                        timeFrameType: 'months',
                        adjustForInflation: (originalGoalData?.inflation_perc || goalData?.inflationRate) > 0,
                        inflationRate: originalGoalData?.inflation_perc?.toString() || goalData?.inflationRate?.toString(),
                        selectedGoal: {
                            id: originalGoalData?.goal_type_id || goalData?.goalType?.id,
                            title: originalGoalData?.GoalType?.goal_name || goalData?.goalType?.title
                        }
                    }
                }
            }
        });
    };

    const saveGoal = async () => {
        try {
            console.log('=== SAVE GOAL DEBUG ===');
            console.log('Edit mode:', editMode);
            console.log('Original goal data:', originalGoalData);
            console.log('Schemes list:', schemesList);
            console.log('Goal data:', goalData);
            console.log('Plan type:', planType);
            console.log('Plan data:', planData);

            // Prepare scheme data following suggestedScheme pattern
            const scheme = schemesList.map((item: any) => {
                console.log('Processing scheme item:', item);

                // Calculate amounts based on weightage and total amounts
                const totalSipAmount = planData?.sip_calculated_value || originalGoalData?.sip_amt || 0;
                const totalLumpsumAmount = planData?.lumpsum_calculated_value || originalGoalData?.lumpsum_amt || 0;
                const weightagePercent = (item?.weightage || item?.alloc_perc || 0) / 100;

                const calculatedSipAmount = Math.round(totalSipAmount * weightagePercent);
                const calculatedLumpsumAmount = Math.round(totalLumpsumAmount * weightagePercent);

                return {
                    investment_type: planType === 'sip' ? "sip" : "lumpsum",
                    scheme_id: item?.scheme_id || item?.SchemeMaster?.id || item?.id,
                    sip_amount: planType === 'lumpsum' ? 0 : (item?.sip_amount || calculatedSipAmount || 0),
                    sip_duration: planType === 'lumpsum' ? 0 : (parseInt(goalData?.timeFrame) || originalGoalData?.sip_duration_mts || planData?.months || 0),
                    sip_frequency: 2, // Monthly frequency
                    lumpsum_amount: planType === 'lumpsum' ? (item?.lumpsum_amount || calculatedLumpsumAmount || 0) : 0,
                    lumpsum_duration: planType === 'lumpsum' ? (parseInt(goalData?.timeFrame) || originalGoalData?.duration_mts || planData?.months || 0) : 0,
                    scheme_name: item?.SchemeMaster?.ms_fullname,
                    scheme_isin: item?.SchemeMaster?.schemeISIN,
                };
            });

            // Prepare main goal payload
            let payload: any = {
                goal_type_id: goalData?.goalType?.id || originalGoalData?.goal_type_id || 13,
                goal_label: goalData?.title || originalGoalData?.goal_label || 'Goal',
                risk_category_id: planData?.goal_risk_category_id || originalGoalData?.risk_category_id || 2,
                target_amt: parseInt(goalData?.targetAmount) || originalGoalData?.target_amt || 0,
                err_perc: planData?.err_perc || originalGoalData?.err_perc || 19.7,
                lumpsum_amt: planType === 'lumpsum' ? (planData?.lumpsum_calculated_value || originalGoalData?.lumpsum_amt || 0) : 0,
                sip_amt: planType === 'sip' ? (planData?.sip_calculated_value || originalGoalData?.sip_amt || 0) : 0,
                calc_amt: planData?.goal_sip_projected_value || planData?.goal_projected_value || originalGoalData?.calc_amt || 0,
                duration_mts: planType === 'sip' ? 0 : (parseInt(goalData?.timeFrame) || originalGoalData?.duration_mts || 0),
                sip_duration_mts: planType === 'sip' ? (parseInt(goalData?.timeFrame) || originalGoalData?.sip_duration_mts || 0) : 0,
                inflation_perc: parseInt(goalData?.inflationRate) || originalGoalData?.inflation_perc || 0,
                lumpsum_current_amt: planData?.goal_projected_value || originalGoalData?.lumpsum_current_amt || 0,
                goal_exec_date: new Date().toISOString(),
                investment_type: planType === 'sip' ? "sip" : "lumpsum",
                suggested_scheme: scheme,
            };

            console.log('Goal save payload:', payload);
            console.log('=== SAVE MODE CHECK ===');
            console.log('editMode:', editMode);
            console.log('forceEditMode:', forceEditMode);
            console.log('originalGoalData?.id:', originalGoalData?.id);
            console.log('originalGoalData?.goal_plan_id:', originalGoalData?.goal_plan_id);
            console.log('originalGoalData keys:', originalGoalData ? Object.keys(originalGoalData) : 'null');

            const goalId = originalGoalData?.id || originalGoalData?.goal_plan_id;
            console.log('Final goalId:', goalId);
            console.log('Edit condition result:', forceEditMode && goalId);

            if (forceEditMode && goalId) {
                // Update existing goal
                console.log('Updating existing goal with ID:', goalId);
                try {
                    const result = await API.put(`goal-plan/updateGoalPlanData/${goalId}`, payload);
                    console.log('Update goal result:', result);

                    if (result?.data) {
                        console.log('Goal updated successfully, now saving allocations...');

                        // Prepare allocation data for edit mode
                        let allocationList = schemesList?.map((allocation: any) => {
                            console.log('Processing allocation item for edit:', allocation);
                            return {
                                goal_plan_id: goalId, // Use correct goal ID for edit
                                risk_category_id: allocation?.risk_category_id,
                                scheme_cate_id: allocation?.scheme_cate_id,
                                scheme_subcate_id: allocation?.scheme_subcate_id,
                                weightage: allocation?.weightage,
                                scheme_id: allocation?.scheme_id,
                            };
                        });

                        let allocPayload: any = {
                            allocationList,
                            goal_plan_id: goalId,
                        };

                        console.log('Edit mode allocation save payload:', allocPayload);

                        // Call goal-plan/add-user-alloc API
                        const [resultAlloc, errorAlloc]: any = await saveGoalDataAllocApi(allocPayload);
                        if (resultAlloc) {
                            console.log('Allocation save result for edit:', resultAlloc);
                            showToast(toastTypes.success, result?.data?.msg || 'Goal updated successfully');

                            // Navigate to Goal Plan Dashboard - Ongoing tab
                            navigation.navigate('Main', {
                                screen: 'Tabs',
                                params: { screen: 'GoalPlanDashboard', tabNumber: 1 }
                            });
                        } else {
                            console.log('saveGoalDataAllocApi Error in edit mode:', errorAlloc);
                            showToast(toastTypes.error, errorAlloc || 'Failed to save allocation data');
                        }
                    } else {
                        showToast(toastTypes.error, 'Failed to update goal');
                    }
                } catch (updateError: any) {
                    console.log('Update goal error:', updateError);
                    showToast(toastTypes.error, updateError?.response?.data?.message || 'Failed to update goal');
                }
            } else {
                // Create new goal (existing logic)
                const [result, error]: any = await saveGoalDataApi(payload);
                if (result) {
                    console.log('Goal save result:', result);

                    // Prepare allocation data
                    let allocationList = schemesList?.map((allocation: any) => {
                        console.log('Processing allocation item:', allocation);
                        return {
                            goal_plan_id: result?.data?.plans?.id,
                            risk_category_id: allocation?.risk_category_id,
                            scheme_cate_id: allocation?.scheme_cate_id,
                            scheme_subcate_id: allocation?.scheme_subcate_id,
                            weightage: allocation?.weightage,
                            scheme_id: allocation?.scheme_id,
                        };
                    });

                    let allocPayload: any = {
                        allocationList,
                        goal_plan_id: result?.data?.plans?.id,
                    };

                    console.log('Allocation save payload:', allocPayload);

                    const [resultAlloc, errorAlloc]: any = await saveGoalDataAllocApi(allocPayload);
                    if (resultAlloc) {
                        console.log('Allocation save result:', resultAlloc);
                        showToast(toastTypes.success, result?.msg || 'Goal saved successfully');

                        // Navigate to Goal Plan Dashboard - New tab
                        navigation.navigate('Main', {
                            screen: 'Tabs',
                            params: { screen: 'GoalPlanDashboard', tabNumber: 0 }
                        });
                    } else {
                        console.log('saveGoalDataAllocApi Error', errorAlloc);
                        showToast(toastTypes.error, errorAlloc || 'Failed to save allocation data');
                    }
                } else {
                    console.log('saveGoal Error', error);
                    showToast(toastTypes.error, error || 'Failed to save goal');
                }
            }

        } catch (error) {
            console.log('saveGoal Error:', error);
            showToast(toastTypes.error, 'An error occurred while saving the goal');
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave();
        } else {
            // Use the new saveGoal function
            saveGoal();
        }
    };

    const handleSaveAndExecute = () => {
        if (onSaveAndExecute) {
            onSaveAndExecute();
        } else {
            // For now, both actions do the same thing
            // In the future, "Save & Execute" could trigger immediate investment
            saveGoal();
        }
    };

    const renderSchemeItem_bup = ({ item, index }: any) => {
        const amount = planType === 'sip' ? item?.sip_amount : item?.lumpsum_amount;
        const amountLabel = planType === 'sip' ? 'Monthly SIP' : 'Lumpsum Amount';

        return (
            <View style={[styles.schemeCard, { backgroundColor: themeColors.cardBackground }]}>
                <View style={styles.schemeHeader}>
                    <View style={styles.schemeInfo}>
                        <CusText
                            text={item?.SchemeMaster?.name || item?.scheme_name || 'Unknown Scheme'}
                            size="M"
                            color={themeColors.text}
                            bold
                            customStyles={{ flex: 1 }}
                        />
                        <IonIcon name='bar-chart' size={20} color={colors.primary1} />
                    </View>
                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => handleSchemeChange(item)}
                    >
                        <CusText text="Change" size="S" color={colors.white} bold />
                    </TouchableOpacity>
                </View>

                <Spacer y="XS" />

                <View style={styles.schemeDetails}>
                    <View style={styles.detailRow}>
                        <CusText text={amountLabel} size="S" color={themeColors.subText} />
                        <CusText
                            text={`₹${amount ? Number(amount).toLocaleString() : '0'}`}
                            size="S"
                            color={themeColors.text}
                            bold
                        />
                    </View>

                    <View style={styles.detailRow}>
                        <CusText text="Allocation" size="S" color={themeColors.subText} />
                        <CusText
                            text={`${item?.alloc_perc || item?.weightage || 0}%`}
                            size="S"
                            color={themeColors.text}
                            bold
                        />
                    </View>

                    {item?.expected_return && (
                        <View style={styles.detailRow}>
                            <CusText text="Expected Return" size="S" color={themeColors.subText} />
                            <CusText
                                text={`${item.expected_return}%`}
                                size="S"
                                color="#28A745"
                                bold
                            />
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const renderSchemeItem = ({ item, index }: any) => {
        let amount: any = item?.sip_amount > 0 ? item?.sip_amount : item?.lumpsum_amount ? item?.lumpsum_amount : 0

        return (
            <>
                {/* <Wrapper>
                    <Spacer y='S' />
                    <Wrapper row justify='apart'>
                        <Wrapper row width={responsiveWidth(65)} customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                            <CusText text={item?.SchemeMaster?.name} size='MS' medium customStyles={{ marginTop: responsiveHeight(0.5), width: responsiveWidth(50) }} />
                            <IonIcon name='bar-chart' size={25} color={'#E59F39'} style={{ marginLeft: responsiveWidth(2) }} />
                        </Wrapper>
                        <TouchableOpacity style={styles.changebtn} onPress={() => { changeScheme(item) }}>
                            <CusText text={'Change'} size="S" color={colors.Hard_White} medium />
                        </TouchableOpacity>
                    </Wrapper>
                    <Spacer y='XS' />
                    <Wrapper customStyles={styles.detailcard}>
                        <Wrapper customStyles={styles.innerdetail}>
                            <Wrapper row justify='apart' >
                                <CusText text={'Category'} size='S' medium color={colors.grayShades2} />
                                <CusText text={item?.SchemeSubcategory?.Name} size='S' medium color={colors.black} />
                            </Wrapper>
                            <Spacer y='XXS' />
                            <Wrapper row justify='apart' >
                                <CusText text={'Weightage'} size='S' medium color={colors.grayShades2} />
                                <CusText text={item?.weightage ? (item?.weightage + ' %') : '0'} size='S' medium color={colors.black} />
                            </Wrapper>
                            <Spacer y='XXS' />
                            <Wrapper row justify='apart' >
                                <CusText text={'Amount'} size='S' medium color={colors.grayShades2} />
                                <CusText text={`₹ ${getGoalPlanning()?.investment === 'Lumpsum' ? item?.lumpsum_amount : item?.sip_amount}`} size='S' medium color={colors.black} />
                            </Wrapper>
                            <Spacer y='XXS' />
                        </Wrapper>
                        <Wrapper width={"100%"} customStyles={{ position: "relative" }}>
                            <Wrapper position="center" color={colors.containerBg} customStyles={{ position: "relative", zIndex: 1, paddingHorizontal: 5 }}>
                                <CusText position="center" text={"Past Return"} color={colors.Hard_White} />
                            </Wrapper>
                            <Wrapper color={colors.grayShades2} height={1} width={"100%"} customStyles={{ position: 'absolute', top: "50%", zIndex: 0 }} />
                        </Wrapper>
                        <Spacer y='XXS' />
                        <Wrapper position='center'>
                            <Wrapper row justify='apart' width={responsiveWidth(60)}>
                                <Wrapper>
                                    <CusText text={'1 Year'} size='S' medium color={colors.grayShades2} />
                                    <CusText text={item?.SchemeMaster?.SchemePerformances[0]?.Return1yr ? `${item?.SchemeMaster?.SchemePerformances[0]?.Return1yr.toFixed(2)} %` : 0} size='S' medium color={colors.gary} />
                                </Wrapper>
                                <Wrapper>
                                    <CusText text={'3 Year'} size='S' medium color={colors.grayShades2} />
                                    <CusText text={item?.SchemeMaster?.SchemePerformances[0]?.Returns3yr ? `${item?.SchemeMaster?.SchemePerformances[0]?.Returns3yr.toFixed(2)} %` : 0} size='S' medium color={colors.gray} />
                                </Wrapper>
                                <Wrapper>
                                    <CusText text={'5 Year'} size='S' medium color={colors.grayShades2} />
                                    <CusText text={item?.SchemeMaster?.SchemePerformances[0]?.Returns5yr ? `${item?.SchemeMaster?.SchemePerformances[0]?.Returns5yr.toFixed(2)} %` : 0} size='S' medium color={colors.gray} />
                                </Wrapper>
                            </Wrapper>

                        </Wrapper>
                        <Spacer y='XS' />
                    </Wrapper>
                </Wrapper> */}
                <Wrapper customStyles={{ marginBottom: responsiveWidth(1), borderWidth: 1, borderRadius: borderRadius.medium }} borderColor={colors.cardborder}>
                    <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                        <Spacer y='XS' />
                        <CusText text={'Suggested Investments'} size='SS' semibold />
                        <Wrapper row align='center' justify='apart' customStyles={{ marginVertical: responsiveWidth(4) }}>
                            <Wrapper width={responsiveWidth(75)}>
                                <CusText underline size='SS' color={colors.label} semibold text={`${item?.SchemeCategory?.Name} - ${item?.SchemeSubcategory?.Name}`} />
                            </Wrapper>
                            {/* <TouchableOpacity activeOpacity={0.6} onPress={() => {
                                navigation.navigate('SchemeEdit',
                                    {
                                        currentScheme: item,
                                        schemeData: schemeList,
                                        overAllData: allData,
                                        goalData: route?.params?.goalData,
                                        goalPlanID: route?.params?.goalPlanID,
                                        type: route?.params?.type,
                                    })
                            }}>
                                <CusText size='N' color={colors.orange} bold text={'Change'} />
                            </TouchableOpacity> */}

                        </Wrapper>
                        <Wrapper customStyles={{ gap: responsiveWidth(1.5) }}>
                            <Wrapper align='center' row>
                                <CusText size='SS' color={colors.label} bold text={`Scheme: `} />
                                <CusText size='SS' color={colors.label} text={`${item?.SchemeMaster?.name}`} />
                            </Wrapper>
                            <Wrapper align='center' row>
                                <CusText size='SS' color={colors.label} bold text={`Rating: `} />
                                <Wrapper row align='center' customStyles={{ gap: responsiveWidth(1) }}>
                                    <CusText size='SS' color={colors.label} text={item?.SchemeMaster?.SchemePerformances[0]?.OverallRating || 0} />
                                    <IonIcon name='star' color={colors.orange} size={10} />
                                </Wrapper>
                            </Wrapper>
                            <Wrapper align='center' justify='apart' row customStyles={{}}>
                                <Wrapper customStyles={{ gap: responsiveWidth(1.5) }}>
                                    <Wrapper align='center' row >
                                        <CusText size='MS' color={colors.label} bold text={`Return 1y: `} />
                                        <CusText size='MS' color={colors.label} text={item?.SchemeMaster?.SchemePerformances[0]?.Return1yr ? item?.SchemeMaster?.SchemePerformances[0]?.Return1yr.toFixed(2) + '%' : '----'} />
                                    </Wrapper>
                                    <Wrapper align='center' row >
                                        <CusText size='MS' color={colors.label} bold text={`Weightage: `} />
                                        <CusText size='MS' color={colors.label} text={item?.weightage + ' %'} />
                                    </Wrapper>
                                </Wrapper>
                                <Wrapper customStyles={{ gap: responsiveWidth(1.5) }}>
                                    <Wrapper align='center' row >
                                        <CusText size='MS' color={colors.label} bold text={`Return 3y: `} />
                                        <CusText size='MS' color={colors.label} text={item?.SchemeMaster?.SchemePerformances[0]?.Returns3yr ? item?.SchemeMaster?.SchemePerformances[0]?.Returns3yr.toFixed(2) + '%' : '----'} />
                                    </Wrapper>
                                    <Wrapper align='center' row>
                                        <CusText size='MS' color={colors.label} bold text={`Amount: `} />
                                        <CusText size='MS' color={colors.label} text={'₹ ' + amount} />
                                    </Wrapper>
                                </Wrapper>
                                <Wrapper customStyles={{ gap: responsiveWidth(1.5) }}>
                                    <Wrapper align='center' row >
                                        <CusText size='MS' color={colors.label} bold text={`Return 5y: `} />
                                        <CusText size='MS' color={colors.label} text={item?.SchemeMaster?.SchemePerformances[0]?.Returns5yr ? item?.SchemeMaster?.SchemePerformances[0]?.Returns5yr.toFixed(2) + '%' : '----'} />
                                    </Wrapper>
                                    <Wrapper align='center' row >
                                        <TouchableOpacity activeOpacity={0.6} onPress={() => {
                                            // navigation.navigate('SchemeEdit',
                                            //     {
                                            //         currentScheme: item,
                                            //         schemeData: schemeList,
                                            //         overAllData: allData,
                                            //         goalData: route?.params?.goalData,
                                            //         goalPlanID: route?.params?.goalPlanID,
                                            //         type: route?.params?.type,
                                            //     })
                                            handleSchemeChange(item)
                                        }}>
                                            <CusText size='MS' color={colors.orange} bold text={'Change'} />
                                        </TouchableOpacity>
                                    </Wrapper>
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>
                        <Spacer y='XS' />
                    </Wrapper>
                </Wrapper>
            </>
        )
    }

    const renderPieChartLegend = () => {
        return (
            <View style={styles.legendContainer}>
                {pieData.map((item: any, index: number) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                        <CusText
                            text={`${item.text} ${item.value}%`}
                            size="XS"
                            color={themeColors.text}
                        />
                    </View>
                ))}
            </View>
        );
    };

    return (
        <>
            {!isModal && <Header name="MF Allocation" backBtn />}
            <Container Xcenter contentWidth={responsiveWidth(95)} bgcolor={colors.white}>
                {/* Pie Chart Section */}
                <View style={styles.chartSection}>
                    <CusText
                        text="Asset Allocation"
                        size="L"
                        color={themeColors.text}
                        bold
                        customStyles={{ textAlign: 'center', marginBottom: responsiveWidth(4) }}
                    />

                    <View style={styles.chartContainer}>
                        <PieChart
                            donut
                            radius={responsiveWidth(15)}
                            innerRadius={responsiveWidth(10)}
                            data={pieData}
                        />
                        {renderPieChartLegend()}
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Schemes List Section */}
                <View style={styles.schemesSection}>
                    <CusText
                        text="Suggested Schemes"
                        size="L"
                        color={themeColors.text}
                        bold
                        customStyles={{ marginBottom: responsiveWidth(4) }}
                    />

                    <FlatList
                        data={schemesList}
                        keyExtractor={(item, index) => `${item.id || index}`}
                        renderItem={renderSchemeItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: responsiveWidth(20) }}
                    />
                </View>

                {/* Action Buttons */}
                {/* <View style={styles.buttonContainer}>
                    <CusButton
                        title="Back"
                        onPress={handleBack}
                        customStyle={[styles.button, styles.backButton]}
                        textcolor={colors.primary1}
                    />
                    <CusButton
                        title="Save"
                        onPress={handleSave}
                        customStyle={[styles.button, styles.saveButton]}
                    />
                    <CusButton
                        title="Save & Execute"
                        onPress={handleSaveAndExecute}
                        customStyle={[styles.button, styles.executeButton]}
                    />
                </View> */}

            </Container>
            <Wrapper width={'100%'} color={colors.Hard_White} row align='center' position='center' justify='center' customStyles={{ gap: responsiveWidth(1), paddingVertical: responsiveWidth(3), paddingHorizontal: responsiveWidth(3) }}>
                <TouchableOpacity activeOpacity={0.6} onPress={handleBack}>
                    <Wrapper width={responsiveWidth(31)} position='center' customStyles={{ padding: responsiveWidth(2.5), paddingHorizontal: responsiveWidth(0), borderRadius: borderRadius.middleSmall, borderColor: colors.gray, borderWidth: 1 }}>
                        <CusText bold position='center' text={forceEditMode ? 'Re-Calculate' : 'Back'} />
                    </Wrapper>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={handleSave}>
                    <Wrapper width={responsiveWidth(31)} color={colors.orange} position='center' customStyles={{ padding: responsiveWidth(2.5), paddingHorizontal: responsiveWidth(0), borderRadius: borderRadius.middleSmall }}>
                        <CusText bold position='center' color={colors.Hard_White} text={'Save Goal'} />
                    </Wrapper>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={handleSaveAndExecute}>
                    <Wrapper width={responsiveWidth(31)} color={colors.orange} position='center' customStyles={{ padding: responsiveWidth(2.5), paddingHorizontal: responsiveWidth(0), borderRadius: borderRadius.middleSmall }}>
                        <CusText bold position='center' color={colors.Hard_White} text={'Save & Execute'} />
                    </Wrapper>
                </TouchableOpacity>
            </Wrapper>
        </>
    );
};

const styles = StyleSheet.create({
    chartSection: {
        paddingVertical: responsiveWidth(4),
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: responsiveWidth(5),
    },
    legendContainer: {
        flex: 1,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveWidth(2),
    },
    legendDot: {
        width: responsiveWidth(3),
        height: responsiveWidth(3),
        borderRadius: responsiveWidth(1.5),
        marginRight: responsiveWidth(2),
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGray + '50',
        marginVertical: responsiveWidth(4),
    },
    schemesSection: {
        flex: 1,
    },
    schemeCard: {
        borderRadius: responsiveWidth(3),
        padding: responsiveWidth(4),
        marginBottom: responsiveWidth(3),
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 0.5,
        borderColor: colors.lightGray + '40',
    },
    schemeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    schemeInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: responsiveWidth(2),
    },
    changeButton: {
        backgroundColor: colors.primary1,
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(1.5),
        borderRadius: responsiveWidth(1.5),
    },
    schemeDetails: {
        marginTop: responsiveWidth(2),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveWidth(1),
    },
    buttonContainer: {
        position: 'absolute',
        bottom: responsiveWidth(4),
        left: responsiveWidth(2.5),
        right: responsiveWidth(2.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: responsiveWidth(2),
    },
    button: {
        flex: 1,
        height: responsiveHeight(6),
    },
    backButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary1,
    },
    saveButton: {
        backgroundColor: colors.primary1,
    },
    executeButton: {
        backgroundColor: '#28A745',
    },
});

export default MFAllocation;
