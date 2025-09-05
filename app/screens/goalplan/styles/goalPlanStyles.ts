import { StyleSheet } from 'react-native';
import { colors, responsiveWidth, responsiveHeight } from '../../../styles/variables';

export const goalPlanStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    
    // Tab Styles
    tabContainer: {
        backgroundColor: colors.white,
        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveWidth(4),
        borderRadius: responsiveWidth(3),
        padding: responsiveWidth(2),
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    
    tabRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    tabButton: {
        flex: 1,
        paddingVertical: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(2),
        borderRadius: responsiveWidth(2),
        marginHorizontal: responsiveWidth(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    activeTabButton: {
        backgroundColor: colors.primary1,
        elevation: 3,
        shadowColor: colors.primary1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    
    // Goal Card Styles
    goalCard: {
        backgroundColor: colors.white,
        borderRadius: responsiveWidth(4),
        padding: responsiveWidth(4),
        marginHorizontal: responsiveWidth(4),
        marginBottom: responsiveWidth(4),
        elevation: 3,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    
    goalCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveWidth(3),
    },
    
    goalIcon: {
        width: responsiveWidth(12),
        height: responsiveWidth(12),
        borderRadius: responsiveWidth(6),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(3),
    },
    
    goalInfo: {
        flex: 1,
    },
    
    progressBadge: {
        paddingHorizontal: responsiveWidth(2),
        paddingVertical: responsiveWidth(1),
        borderRadius: responsiveWidth(2),
    },
    
    // Progress Bar Styles
    progressBarContainer: {
        height: responsiveWidth(2),
        backgroundColor: colors.lightGray,
        borderRadius: responsiveWidth(1),
        marginVertical: responsiveWidth(2),
        overflow: 'hidden',
    },
    
    progressBarFill: {
        height: '100%',
        borderRadius: responsiveWidth(1),
    },
    
    // Amount Info Styles
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveWidth(3),
    },
    
    amountInfoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: responsiveWidth(3),
        borderRadius: responsiveWidth(2),
    },
    
    amountColumn: {
        alignItems: 'center',
        flex: 1,
    },
    
    // New Goal Styles
    newGoalGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(2),
    },
    
    newGoalCard: {
        width: responsiveWidth(42),
        marginBottom: responsiveWidth(4),
        marginHorizontal: responsiveWidth(2),
    },
    
    newGoalCardContent: {
        backgroundColor: colors.white,
        borderRadius: responsiveWidth(4),
        padding: responsiveWidth(4),
        alignItems: 'center',
        elevation: 3,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    
    newGoalIcon: {
        width: responsiveWidth(16),
        height: responsiveWidth(16),
        borderRadius: responsiveWidth(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsiveWidth(3),
    },
    
    // Button Styles
    primaryButton: {
        backgroundColor: colors.primary1,
        borderRadius: responsiveWidth(3),
        paddingVertical: responsiveWidth(4),
        alignItems: 'center',
        elevation: 3,
        shadowColor: colors.primary1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginTop: responsiveWidth(4),
        marginHorizontal: responsiveWidth(4),
    },
    
    // Empty State Styles
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: responsiveWidth(20),
        paddingHorizontal: responsiveWidth(8),
    },
    
    emptyStateIcon: {
        marginBottom: responsiveWidth(4),
    },
    
    emptyStateTitle: {
        marginBottom: responsiveWidth(2),
        textAlign: 'center',
    },
    
    emptyStateDescription: {
        textAlign: 'center',
        lineHeight: responsiveWidth(5),
    },
    
    // Completed Goal Specific Styles
    completedGoalCard: {
        borderLeftWidth: responsiveWidth(1),
    },
    
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveWidth(1),
    },
    
    checkmarkIcon: {
        marginLeft: responsiveWidth(2),
    },
    
    // Responsive Breakpoints
    tablet: {
        newGoalCard: {
            width: responsiveWidth(28),
        },
        goalCard: {
            marginHorizontal: responsiveWidth(8),
        },
        tabContainer: {
            marginHorizontal: responsiveWidth(8),
        },
    },
});

export default goalPlanStyles;
