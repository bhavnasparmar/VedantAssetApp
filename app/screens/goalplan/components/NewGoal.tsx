import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Modal, ScrollView, TextInput, Alert } from 'react-native';
import { AppearanceContext } from '../../../context/appearanceContext';
import CusText from '../../../ui/custom-text';
import { colors, responsiveWidth, responsiveHeight } from '../../../styles/variables';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getAllGoalTypeApi, getRiskProfileInvestorAPi, goalcal } from '../../../api/homeapi';
import { showToast, toastTypes } from '../../../services/toastService';
import { getGoalTypeImage, setGoalPlanningDetails, USER_DATA } from '../../../utils/Commanutils';

import Slider from '@react-native-community/slider';
import Dropdown from '../../../ui/dropdown';
import CusButton from '../../../ui/custom-button';
import IonIcon from 'react-native-vector-icons/Ionicons';
import InputField from '../../../ui/InputField';
import Wrapper from '../../../ui/wrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NewGoalProps {
    existingGoalData?: any;
    openCalculationModal?: boolean;
    isEditMode?: boolean;
    originalGoal?: any;
}

const NewGoal: React.FC<NewGoalProps> = ({ existingGoalData, openCalculationModal, isEditMode, originalGoal }) => {
    const { colors: themeColors }: any = useContext(AppearanceContext);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [goalTypes, setGoalTypesData] = useState<any[]>([]);

    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<any>(null);
    const [showRecommendedPlan, setShowRecommendedPlan] = useState(false);

    // Form states
    const [goalTitle, setGoalTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [adjustForInflation, setAdjustForInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState(6.5);
    const [timeFrame, setTimeFrame] = useState('');
    const [timeFrameType, setTimeFrameType] = useState('months'); // 'months' or 'years'
    const [riskProfileDatas, setriskProfileDatas] = useState<any>({})

    // Validation states
    const [errors, setErrors] = useState({
        goalTitle: '',
        targetAmount: '',
        timeFrame: '',
        planType: ''
    });

    // Recommended plan states
    const [recommendedPlan, setRecommendedPlan] = useState<any>(null);
    const [selectedPlanType, setSelectedPlanType] = useState(''); // 'lumpsum' or 'sip'

    useEffect(() => {
        allgoals();
        CheckRishCompleted();
    }, [isFocused]);

    // Handle existing goal data for re-calculation
    useEffect(() => {
        if (existingGoalData && openCalculationModal) {
            console.log('Pre-filling form with existing goal data:', existingGoalData);

            // Pre-fill form fields
            setGoalTitle(existingGoalData.goalTitle || '');
            setTargetAmount(existingGoalData.targetAmount || '');
            setTimeFrame(existingGoalData.timeFrame || '');
            setTimeFrameType(existingGoalData.timeFrameType || 'months');
            setAdjustForInflation(existingGoalData.adjustForInflation || false);
            setInflationRate(parseFloat(existingGoalData.inflationRate) || 6.5);
            setSelectedGoal(existingGoalData.selectedGoal || null);

            // Open the calculation modal automatically
            setModalVisible(true);

            // Clear any existing errors
            setErrors({
                goalTitle: '',
                targetAmount: '',
                timeFrame: '',
                planType: ''
            });
        }
    }, [existingGoalData, openCalculationModal]);

    const handleGoalPress = (goal: any) => {
        console.log('View goal details:', goal);
        setSelectedGoal(goal);
        setGoalTitle(goal?.goal_name || '');
        setModalVisible(true);
        setShowRecommendedPlan(false);
        // Reset form
        setTargetAmount('');
        setAdjustForInflation(false);
        setInflationRate(6.5);
        setTimeFrame('');
        setTimeFrameType('months');
        setRecommendedPlan(null);
        setSelectedPlanType('');
    };

    const allgoals = async () => {
        try {
            const [result, error]: any = await getAllGoalTypeApi();
            console.log('allgoals result', result?.data);
            console.log('allgoals error----', error);
            if (result) {
                if (result?.data.length > 0) {
                    setGoalTypesData(result?.data);
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

    const validateForm = () => {
        const newErrors = {
            goalTitle: '',
            targetAmount: '',
            timeFrame: '',
            planType: ''
        };

        let isValid = true;

        if (!goalTitle.trim()) {
            newErrors.goalTitle = 'Please enter goal title';
            isValid = false;
        }

        if (!targetAmount.trim()) {
            newErrors.targetAmount = 'Please enter target amount';
            isValid = false;
        } else if (isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
            newErrors.targetAmount = 'Please enter a valid amount';
            isValid = false;
        }

        if (!timeFrame.trim()) {
            newErrors.timeFrame = 'Please enter time frame';
            isValid = false;
        } else if (isNaN(Number(timeFrame)) || Number(timeFrame) <= 0) {
            newErrors.timeFrame = 'Please enter a valid duration';
            isValid = false;
        } else {
            const months = timeFrameType === 'years' ? parseInt(timeFrame) * 12 : parseInt(timeFrame);
            if (timeFrameType === 'months' && months < 6) {
                newErrors.timeFrame = 'Minimum 6 months required';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const CheckRishCompleted = async () => {
        try {
            const [result, error]: any = await getRiskProfileInvestorAPi();
            console.log('getRiskProfileInvestorAPi NewGoal result', result);
            console.log('result?.data----', result?.data);
            console.log('result?.error----', error);

            if (result?.data) {
                setriskProfileDatas(result.data);
            } else {
                // Set default risk profile if not available
                setriskProfileDatas({ riskProfileId: 2 });
                console.log('No risk profile found, using default');
            }
        } catch (error: any) {
            console.log('Risk profile fetch error:', error);
            // Set default risk profile on error
            setriskProfileDatas({ riskProfileId: 2 });
            // Don't show error toast as this shouldn't block the user
        }
    };


    const calculateGoalPlan = async () => {
        if (!validateForm()) {
            return;
        }

        const months = timeFrameType === 'years' ? parseInt(timeFrame) * 12 : parseInt(timeFrame);

        try {
            const useretail: any = await AsyncStorage.getItem(USER_DATA);

            if (!useretail) {
                showToast(toastTypes.error, 'User data not found. Please login again.');
                return;
            }

            let useretail1 = JSON.parse(useretail);

            if (!useretail1?.id) {
                showToast(toastTypes.error, 'Invalid user data. Please login again.');
                return;
            }

            if (!selectedGoal?.id) {
                showToast(toastTypes.error, 'Please select a goal first.');
                return;
            }

            const payload = {
                user_id: useretail1?.id,
                target_amount: parseInt(targetAmount),
                months: months,
                risk_category_id: riskProfileDatas?.riskProfileId, // Default to 2 if risk profile not available
                inflation_rate: adjustForInflation ? inflationRate : 0,
                goal_type_id: selectedGoal?.id?.toString()
            };

            console.log('Goal plan payload:', payload);

            // Call your API here

            const result: any = await goalcal(payload);
            console.log(result[0]?.data, "result?.data")
            console.log(result, "result")

            if (result[0]?.data) {
                let data = result[0].data;
                setGoalPlanningDetails(null)
                setRecommendedPlan(null);
                // Add form data to the response for reference
                data.months = months;
                data.inflation_rate = adjustForInflation ? inflationRate : 0;
                data.title = goalTitle;
                data.targetammount = parseInt(targetAmount);
                data.goal_type_id = selectedGoal?.id;
                data.timeFrameType = timeFrameType;
                data.originalTimeFrame = timeFrame;
                console.log('data : ', data)
                setRecommendedPlan(data);
                setGoalPlanningDetails(data)
                setShowRecommendedPlan(true);
                setSelectedPlanType('lumpsum'); // Default to lumpsum selection

                showToast(toastTypes.success, 'Goal Calculated Successfully');
            } else {
                showToast(toastTypes.error, 'Unable to calculate plan. Please try again.');
            }
            // For now, showing mock data


        } catch (error: any) {
            console.log('Calculate goal plan error:', error);
            showToast(toastTypes.error, 'Failed to calculate plan');
        }
    };

    const handleBack = () => {
        setShowRecommendedPlan(false);
        setRecommendedPlan(null);
        setSelectedPlanType('');
    };

    const handleProceed = () => {
        if (!selectedPlanType) {
            setErrors(prev => ({ ...prev, planType: 'Please select a plan type' }));
            return;
        }

        console.log('Proceeding with plan:', selectedPlanType);
        console.log('Recommended plan data:', recommendedPlan);

        // Close modal and navigate to MF Allocation screen
        setModalVisible(false);

        // Navigate to MF Allocation screen with the recommended plan data
        console.log('=== PROCEED NAVIGATION DEBUG ===');
        console.log('Passing isEditMode:', isEditMode);
        console.log('Passing originalGoal:', originalGoal);

        (navigation as any).navigate('MFAllocation', {
            recommendedPlan: recommendedPlan,
            selectedPlanType: selectedPlanType,
            goalData: {
                title: goalTitle,
                targetAmount: targetAmount,
                timeFrame: timeFrame,
                timeFrameType: timeFrameType,
                inflationRate: adjustForInflation ? inflationRate : 0,
                goalType: selectedGoal
            },
            isEditMode: isEditMode, // Pass edit mode flag
            originalGoal: originalGoal // Pass original goal data
        });
    };

    const clearError = (field: string) => {
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const renderGoalCard = (goal: any, index: number) => {
        return (
            <TouchableOpacity
                key={goal.id || index}
                onPress={() => handleGoalPress(goal)}
                style={styles.goalCardContainer}
                activeOpacity={0.9}
            >
                <View style={[styles.goalCard, { backgroundColor: themeColors.cardBackground }]}>
                    {/* Icon Container */}
                    <View style={styles.iconContainer}>
                        <Image
                            resizeMode='contain'
                            source={{ uri: getGoalTypeImage(goal?.goal_icon) }}
                            style={styles.goalIcon}
                        />
                    </View>

                    {/* Goal Title */}
                    <CusText
                        text={goal.goal_name}
                        size="S"
                        color={themeColors.text}
                        bold
                        customStyles={styles.goalTitle}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    const renderGoalModal = () => {
        // console.log('modalVisible : ', recommendedPlan)
        return (
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: colors.white }]}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <CusText
                                text={`Plan Your ${selectedGoal?.goal_name || selectedGoal?.title}`}
                                size="L"
                                color={themeColors.text}
                                bold
                            />
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <IonIcon name="close" size={24} color={themeColors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                            {!showRecommendedPlan ? (
                                <>
                                    {/* Goal Title Input */}
                                    <View style={styles.inputContainer}>
                                        <CusText text="Goal Title" size="S" color={themeColors.text} bold />
                                        <TextInput
                                            style={[styles.textInput, {
                                                backgroundColor: themeColors.background,
                                                color: themeColors.text,
                                                borderColor: errors.goalTitle ? '#FF3B30' : colors.lightGray
                                            }]}
                                            value={goalTitle}
                                            onChangeText={(text) => {
                                                setGoalTitle(text);
                                                clearError('goalTitle');
                                            }}
                                            placeholder="Enter your goal title"
                                            placeholderTextColor={themeColors.subText}
                                        />
                                        {errors.goalTitle ? (
                                            <CusText
                                                text={errors.goalTitle}
                                                size="XS"
                                                color="#FF3B30"
                                                customStyles={{ marginTop: responsiveWidth(1) }}
                                            />
                                        ) : null}
                                    </View>

                                    {/* Target Amount Input */}
                                    <View style={styles.inputContainer}>
                                        <CusText
                                            text={`How much money do you need for your ${selectedGoal?.goal_name || 'goal'}?`}
                                            size="S"
                                            color={themeColors.text}
                                            bold
                                        />
                                        <TextInput
                                            style={[styles.textInput, {
                                                backgroundColor: themeColors.background,
                                                color: themeColors.text,
                                                borderColor: errors.targetAmount ? '#FF3B30' : colors.lightGray
                                            }]}
                                            value={targetAmount}
                                            onChangeText={(text) => {
                                                setTargetAmount(text);
                                                clearError('targetAmount');
                                            }}
                                            placeholder="Enter amount in ₹"
                                            placeholderTextColor={themeColors.subText}
                                            keyboardType="numeric"
                                        />
                                        {errors.targetAmount ? (
                                            <CusText
                                                text={errors.targetAmount}
                                                size="XS"
                                                color="#FF3B30"
                                                customStyles={{ marginTop: responsiveWidth(1) }}
                                            />
                                        ) : null}
                                    </View>

                                    {/* Inflation Adjustment */}
                                    <View style={styles.inputContainer}>
                                        <TouchableOpacity
                                            style={styles.checkboxContainer}
                                            onPress={() => setAdjustForInflation(!adjustForInflation)}
                                        >
                                            <View style={[styles.customCheckbox, {
                                                backgroundColor: adjustForInflation ? colors.primary1 : 'transparent',
                                                borderColor: adjustForInflation ? colors.primary1 : colors.lightGray
                                            }]}>
                                                {adjustForInflation && (
                                                    <IonIcon name="checkmark" size={16} color={colors.white} />
                                                )}
                                            </View>
                                            <CusText
                                                text="Do you want to adjust the goal amount for inflation?"
                                                size="S"
                                                color={themeColors.text}
                                                customStyles={{ marginLeft: responsiveWidth(2), flex: 1 }}
                                            />
                                        </TouchableOpacity>

                                        {adjustForInflation && (
                                            <View style={styles.sliderContainer}>
                                                <CusText
                                                    text={`Inflation Rate: ${inflationRate.toFixed(1)}%`}
                                                    size="S"
                                                    color={themeColors.text}
                                                    bold
                                                />
                                                <Slider
                                                    style={styles.slider}
                                                    minimumValue={1}
                                                    maximumValue={9}
                                                    value={inflationRate}
                                                    onValueChange={setInflationRate}
                                                    step={0.1}
                                                    minimumTrackTintColor={colors.primary1}
                                                    maximumTrackTintColor={colors.lightGray}
                                                    thumbTintColor={colors.primary1}
                                                />
                                                <View style={styles.sliderLabels}>
                                                    <CusText text="1%" size="XS" color={themeColors.subText} />
                                                    <CusText text="9%" size="XS" color={themeColors.subText} />
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    {/* Time Frame Input */}
                                    <View style={styles.inputContainer}>
                                        <CusText
                                            text={`When do you need these funds for ${selectedGoal?.goal_name || 'your goal'}?`}
                                            size="S"
                                            color={themeColors.text}
                                            bold
                                        />
                                        <View style={styles.timeFrameContainer}>
                                            <TextInput
                                                style={[styles.timeInput, {
                                                    backgroundColor: themeColors.background,
                                                    color: themeColors.text,
                                                    borderColor: errors.timeFrame ? '#FF3B30' : colors.lightGray
                                                }]}
                                                value={timeFrame}
                                                onChangeText={(text) => {
                                                    setTimeFrame(text);
                                                    clearError('timeFrame');
                                                }}
                                                placeholder="Enter duration"
                                                placeholderTextColor={themeColors.subText}
                                                keyboardType="numeric"
                                            />
                                            <View style={[styles.dropdownContainer, { backgroundColor: themeColors.background }]}>
                                                <Dropdown
                                                    data={[
                                                        { label: 'Months', value: 'months' },
                                                        { label: 'Years', value: 'years' }
                                                    ]}
                                                    value={timeFrameType}
                                                    onChange={(item: any) => setTimeFrameType(item.value)}
                                                    placeholder="Select"
                                                    labelField="label"
                                                    valueField="value"
                                                    style={styles.dropdown}
                                                />
                                            </View>
                                        </View>
                                        {errors.timeFrame ? (
                                            <CusText
                                                text={errors.timeFrame}
                                                size="XS"
                                                color="#FF3B30"
                                                customStyles={{ marginTop: responsiveWidth(1) }}
                                            />
                                        ) : timeFrameType === 'months' ? (
                                            <CusText
                                                text="Minimum 6 months required"
                                                size="XS"
                                                color="#FF9500"
                                                customStyles={{ marginTop: responsiveWidth(1) }}
                                            />
                                        ) : null}
                                    </View>

                                    {/* Calculate Button */}
                                    <CusButton
                                        position='center'
                                        title="Calculate"
                                        onPress={calculateGoalPlan}
                                        customStyle={styles.calculateButton}
                                    />
                                </>
                            ) : (
                                <>
                                    {/* Recommended Plan Section */}
                                    <View style={styles.recommendedPlanContainer}>
                                        <CusText
                                            text="Recommended Plan"
                                            size="L"
                                            color={themeColors.text}
                                            bold
                                            customStyles={{ marginBottom: responsiveWidth(4) }}
                                        />

                                        {/* Lumpsum Option */}
                                        <TouchableOpacity
                                            style={[styles.planOption, {
                                                backgroundColor: selectedPlanType === 'lumpsum' ? colors.primary1 + '20' : themeColors.background,
                                                borderColor: selectedPlanType === 'lumpsum' ? colors.primary1 : colors.lightGray
                                            }]}
                                            onPress={() => {
                                                setSelectedPlanType('lumpsum');
                                                clearError('planType');
                                            }}
                                        >
                                            <View style={styles.planOptionHeader}>
                                                <View style={[styles.customCheckbox, {
                                                    backgroundColor: selectedPlanType === 'lumpsum' ? colors.primary1 : 'transparent',
                                                    borderColor: selectedPlanType === 'lumpsum' ? colors.primary1 : colors.lightGray
                                                }]}>
                                                    {selectedPlanType === 'lumpsum' && (
                                                        <IonIcon name="checkmark" size={16} color={colors.white} />
                                                    )}
                                                </View>
                                                <CusText text="Lumpsum Investment" size="M" color={themeColors.text} bold />
                                            </View>
                                            <CusText
                                                text={`Invest ₹${recommendedPlan?.lumpsum_calculated_value ? Number(recommendedPlan.lumpsum_calculated_value).toLocaleString() : 'N/A'} once`}
                                                size="S"
                                                color={themeColors.subText}
                                            />
                                            <CusText
                                                text={`Expected Returns after ${recommendedPlan?.months} months: ₹ ${recommendedPlan?.goal_projected_value || 'N/A'}`}
                                                size="S"
                                                bold
                                                color="#28A745"
                                            />
                                        </TouchableOpacity>

                                        {/* SIP Option */}
                                        <TouchableOpacity
                                            style={[styles.planOption, {
                                                backgroundColor: selectedPlanType === 'sip' ? colors.primary1 + '20' : themeColors.background,
                                                borderColor: selectedPlanType === 'sip' ? colors.primary1 : colors.lightGray
                                            }]}
                                            onPress={() => {
                                                setSelectedPlanType('sip');
                                                clearError('planType');
                                            }}
                                        >
                                            <View style={styles.planOptionHeader}>
                                                <View style={[styles.customCheckbox, {
                                                    backgroundColor: selectedPlanType === 'sip' ? colors.primary1 : 'transparent',
                                                    borderColor: selectedPlanType === 'sip' ? colors.primary1 : colors.lightGray
                                                }]}>
                                                    {selectedPlanType === 'sip' && (
                                                        <IonIcon name="checkmark" size={16} color={colors.white} />
                                                    )}
                                                </View>
                                                <CusText text="SIP Investment" size="M" color={themeColors.text} bold />
                                            </View>
                                            <CusText
                                                text={`Invest ₹${recommendedPlan?.sip_calculated_value ? Number(recommendedPlan.sip_calculated_value).toLocaleString() : 'N/A'} monthly`}
                                                size="S"
                                                color={themeColors.subText}
                                            />
                                            <CusText
                                                text={`Expected Returns after ${recommendedPlan?.months} months: ₹ ${recommendedPlan?.goal_sip_projected_value || 'N/A'}%`}
                                                size="S"
                                                bold
                                                color="#28A745"
                                            />
                                        </TouchableOpacity>

                                        {/* Plan Selection Validation */}
                                        {errors.planType ? (
                                            <CusText
                                                text={errors.planType}
                                                size="XS"
                                                color="#FF3B30"
                                                customStyles={{ marginTop: responsiveWidth(2), textAlign: 'center' }}
                                            />
                                        ) : null}
                                    </View>

                                    {/* Action Buttons */}
                                    <View style={styles.actionButtons}>
                                        <CusButton
                                            width={responsiveWidth(40)}
                                            title="Back"
                                            onPress={handleBack}
                                            customStyle={[styles.actionButton, styles.backButton]}
                                        // textcolor={colors.primary1}
                                        />
                                        <CusButton
                                            width={responsiveWidth(40)}
                                            title="Proceed"
                                            onPress={handleProceed}
                                            customStyle={[styles.actionButton, styles.proceedButton]}
                                        />
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <CusText
                    text="Choose Your Goal"
                    size="XL"
                    color={themeColors.text}
                    bold
                    customStyles={{ textAlign: 'center', marginBottom: responsiveWidth(2) }}
                />
                <CusText
                    text="Select a goal type to start planning your financial future"
                    size="S"
                    color={themeColors.subText}
                    customStyles={{ textAlign: 'center', lineHeight: responsiveWidth(5) }}
                />
            </View>

            {/* Goals Grid */}
            <Wrapper width={responsiveWidth(90)} row position='center' justify='center' customStyles={{ flexWrap: 'wrap', }}>
                {goalTypes.map((goal, index) => renderGoalCard(goal, index))}
            </Wrapper>

            {/* Goal Planning Modal */}
            {renderGoalModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveWidth(3),
    },
    headerSection: {
        marginBottom: responsiveWidth(8),
        alignItems: 'center',
    },
    goalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-around',
        // alignItems: 'flex-start',
        width: responsiveWidth(90),
        // paddingHorizontal: responsiveWidth(2),
    },
    goalCardContainer: {
        backgroundColor: colors.white,
        width: responsiveWidth(27),
        marginBottom: responsiveWidth(5),
        marginHorizontal: responsiveWidth(1),
        borderRadius: responsiveWidth(3),
    },
    goalCard: {
        backgroundColor: colors.white,
        borderRadius: responsiveWidth(3),
        padding: responsiveWidth(4),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: responsiveWidth(28),
        width: '100%',
        // Clean, minimal shadow
        // elevation: 1,
        // shadowColor: colors.black,
        // shadowOffset: { width: 0, height: 0.5 },
        // shadowOpacity: 0.06,
        // shadowRadius: 2,
        // // Clean border
        // borderWidth: 0.3,
        // borderColor: colors.lightGray + '60',
    },
    iconContainer: {
        width: responsiveWidth(15),
        height: responsiveWidth(15),
        // backgroundColor: colors.primary1 + '08',
        borderRadius: responsiveWidth(2),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsiveWidth(2.5),
    },
    goalIcon: {
        height: responsiveWidth(14),
        width: responsiveWidth(14),
        // tintColor: colors.primary1,
    },
    goalTitle: {
        textAlign: 'center',
        fontSize: responsiveWidth(3.2),
        lineHeight: responsiveWidth(4),
        marginTop: responsiveWidth(0.5),
        paddingHorizontal: responsiveWidth(1),
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: responsiveWidth(95),
        height: responsiveHeight(65),
        borderRadius: responsiveWidth(4),
        elevation: 10,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        backgroundColor: colors.white,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: responsiveWidth(4),
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray + '50',
    },
    closeButton: {
        padding: responsiveWidth(1),
    },
    modalContent: {
        flex: 1,
        padding: responsiveWidth(4),
    },
    inputContainer: {
        marginBottom: responsiveWidth(4),
    },
    textInput: {
        borderWidth: 1,
        borderRadius: responsiveWidth(2),
        padding: responsiveWidth(3),
        marginTop: responsiveWidth(2),
        fontSize: responsiveWidth(3.5),
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveWidth(2),
    },
    customCheckbox: {
        width: responsiveWidth(5),
        height: responsiveWidth(5),
        borderWidth: 2,
        borderRadius: responsiveWidth(1),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(2),
    },
    sliderContainer: {
        marginTop: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(2),
    },
    slider: {
        width: '100%',
        height: responsiveWidth(10),
        marginVertical: responsiveWidth(2),
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeFrameContainer: {
        flexDirection: 'row',
        marginTop: responsiveWidth(2),
        gap: responsiveWidth(2),
    },
    timeInput: {
        flex: 2,
        borderWidth: 1,
        borderRadius: responsiveWidth(2),
        padding: responsiveWidth(3),
        fontSize: responsiveWidth(3.5),
    },
    dropdownContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: responsiveWidth(2),
    },
    dropdown: {
        padding: responsiveWidth(2),
    },
    calculateButton: {
        marginTop: responsiveWidth(4),
        marginBottom: responsiveWidth(2),
    },
    recommendedPlanContainer: {
        marginBottom: responsiveWidth(4),
    },
    planOption: {
        borderWidth: 1,
        borderRadius: responsiveWidth(3),
        padding: responsiveWidth(4),
        marginBottom: responsiveWidth(3),
    },
    planOptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveWidth(2),
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveWidth(4),
        gap: responsiveWidth(3),
        width: '100%',
    },
    actionButton: {
        flex: 1,
    },
    backButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary1,
    },
    proceedButton: {
        backgroundColor: colors.primary1,
    },
});

export default NewGoal;
