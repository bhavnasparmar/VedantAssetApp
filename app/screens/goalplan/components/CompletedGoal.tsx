import React, { useContext, useState } from 'react';
import { TouchableOpacity, View, FlatList, StyleSheet } from 'react-native';
import { AppearanceContext } from '../../../context/appearanceContext';
import Wrapper from '../../../ui/wrapper';
import CusText from '../../../ui/custom-text';
import { colors, responsiveWidth, responsiveHeight, borderRadius } from '../../../styles/variables';
import { useNavigation } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const CompletedGoal = () => {
    const { colors: themeColors }: any = useContext(AppearanceContext);
    const navigation = useNavigation();

    // Sample completed goals data
    const [completedGoals] = useState([
        {
            id: 1,
            title: 'Emergency Fund',
            type: 'Emergency',
            targetAmount: 500000,
            finalAmount: 520000,
            totalInvested: 480000,
            returns: 40000,
            duration: '2 years 3 months',
            icon: '🛡️',
            color: '#00B894',
            completedDate: '2024-01-15',
            startDate: '2021-10-15'
        },
        {
            id: 2,
            title: 'Laptop Purchase',
            type: 'Electronics',
            targetAmount: 150000,
            finalAmount: 155000,
            totalInvested: 140000,
            returns: 15000,
            duration: '1 year 6 months',
            icon: '💻',
            color: '#6C5CE7',
            completedDate: '2023-08-20',
            startDate: '2022-02-20'
        },
        {
            id: 3,
            title: 'Home Renovation',
            type: 'Home',
            targetAmount: 800000,
            finalAmount: 825000,
            totalInvested: 750000,
            returns: 75000,
            duration: '3 years 2 months',
            icon: '🏠',
            color: '#FDCB6E',
            completedDate: '2023-12-10',
            startDate: '2020-10-10'
        },
    ]);

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const calculateReturnPercentage = (returns: number, invested: number) => {
        return ((returns / invested) * 100).toFixed(1);
    };

    const handleGoalPress = (goal: any) => {
        console.log('View completed goal details:', goal.title);
        // Navigate to goal details screen
        // navigation.navigate('CompletedGoalDetails', { goal });
    };

    const renderGoalCard = ({ item: goal }: any) => {
        const returnPercentage = calculateReturnPercentage(goal.returns, goal.totalInvested);
        const isPositiveReturn = goal.returns > 0;

        return (
            <TouchableOpacity
                onPress={() => handleGoalPress(goal)}
                activeOpacity={0.8}
                style={{ marginBottom: responsiveWidth(4) }}
            >
                <View style={[styles.goalCard, {
                    backgroundColor: themeColors.cardBackground,
                    borderLeftColor: goal.color,
                }]}>
                    {/* Header Row */}
                    <View style={styles.headerRow}>
                        {/* Icon */}
                        <LinearGradient
                            colors={[goal.color + '30', goal.color + '10']}
                            style={styles.iconContainer}
                        >
                            <CusText
                                text={goal.icon}
                                size="L"
                                customStyles={{ fontSize: responsiveWidth(6) }}
                            />
                        </LinearGradient>

                        {/* Goal Info */}
                        <View style={styles.goalInfo}>
                            <View style={styles.titleRow}>
                                <CusText
                                    text={goal.title}
                                    size="M"
                                    color={themeColors.text}
                                    bold
                                    customStyles={{ marginRight: responsiveWidth(2) }}
                                />
                                <IonIcon
                                    name="checkmark-circle"
                                    size={responsiveWidth(5)}
                                    color={colors.success}
                                />
                            </View>
                            <CusText
                                text={`Completed on ${formatDate(goal.completedDate)}`}
                                size="XS"
                                color={themeColors.subText}
                            />
                        </View>

                        {/* Returns Badge */}
                        <LinearGradient
                            colors={isPositiveReturn ? [colors.success + '30', colors.success + '10'] : [colors.error + '30', colors.error + '10']}
                            style={styles.returnsBadge}
                        >
                            <CusText
                                text={`+${returnPercentage}%`}
                                size="S"
                                color={isPositiveReturn ? colors.success : colors.error}
                                bold
                            />
                        </LinearGradient>
                    </View>

                    {/* Amount Info Grid */}
                    <View style={[styles.amountGrid, { backgroundColor: themeColors.background + '50' }]}>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <CusText
                                text="Target"
                                size="XS"
                                color={themeColors.subText}
                                customStyles={{ marginBottom: responsiveWidth(1) }}
                            />
                            <CusText
                                text={formatCurrency(goal.targetAmount)}
                                size="S"
                                color={themeColors.text}
                                bold
                            />
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <CusText
                                text="Achieved"
                                size="XS"
                                color={themeColors.subText}
                                customStyles={{ marginBottom: responsiveWidth(1) }}
                            />
                            <CusText
                                text={formatCurrency(goal.finalAmount)}
                                size="S"
                                color={colors.success}
                                bold
                            />
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <CusText
                                text="Returns"
                                size="XS"
                                color={themeColors.subText}
                                customStyles={{ marginBottom: responsiveWidth(1) }}
                            />
                            <CusText
                                text={formatCurrency(goal.returns)}
                                size="S"
                                color={isPositiveReturn ? colors.success : colors.error}
                                bold
                            />
                        </View>
                    </View>

                    {/* Bottom Info */}
                    <View style={styles.bottomInfo}>
                        <View>
                            <CusText
                                text="Duration"
                                size="XS"
                                color={themeColors.subText}
                                customStyles={{ marginBottom: responsiveWidth(1) }}
                            />
                            <CusText
                                text={goal.duration}
                                size="S"
                                color={themeColors.text}
                                bold
                            />
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <CusText
                                text="Total Invested"
                                size="XS"
                                color={themeColors.subText}
                                customStyles={{ marginBottom: responsiveWidth(1) }}
                            />
                            <CusText
                                text={formatCurrency(goal.totalInvested)}
                                size="S"
                                color={colors.primary1}
                                bold
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
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
                    name="trophy-outline"
                    size={responsiveWidth(20)}
                    color={themeColors.subText}
                    style={{ marginBottom: responsiveWidth(4) }}
                />
                <CusText
                    text="No Completed Goals Yet"
                    size="L"
                    color={themeColors.text}
                    bold
                    customStyles={{ marginBottom: responsiveWidth(2), textAlign: 'center' }}
                />
                <CusText
                    text="Complete your first goal to see your achievements here"
                    size="S"
                    color={themeColors.subText}
                    customStyles={{ textAlign: 'center', lineHeight: responsiveWidth(5) }}
                />
            </Wrapper>
        );
    };

    return (
        <Wrapper customStyles={{ flex: 1 }}>
            {completedGoals.length > 0 ? (
                <FlatList
                    data={completedGoals}
                    renderItem={renderGoalCard}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: responsiveWidth(5) }}
                />
            ) : (
                renderEmptyState()
            )}
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
        borderLeftWidth: responsiveWidth(1.2),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveWidth(3),
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
    goalInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveWidth(1),
    },
    returnsBadge: {
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(1.5),
        borderRadius: borderRadius.small,
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    amountGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveWidth(3),
        padding: responsiveWidth(3),
        borderRadius: borderRadius.medium,
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    bottomInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default CompletedGoal;
