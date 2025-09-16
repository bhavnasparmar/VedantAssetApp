// Goal Plan Module Exports
export { default as GoalPlan } from './GoalPlan';
export { default as NewGoal } from './components/NewGoal';
export { default as OngoingGoal } from './components/OngoingGoal';
export { default as CompletedGoal } from './components/CompletedGoal';
export { default as MFAllocation } from './components/MFAllocation';
export { default as SchemeSelection } from './components/SchemeSelection';
export { goalPlanStyles } from './styles/goalPlanStyles';

// Types and Interfaces
export interface GoalType {
    id: number;
    title: string;
    icon: string;
    color: string;
    description: string;
}

export interface OngoingGoalType {
    id: number;
    title: string;
    type: string;
    targetAmount: number;
    currentAmount: number;
    monthlyInvestment: number;
    timeRemaining: string;
    progress: number;
    icon: string;
    color: string;
    startDate: string;
    targetDate: string;
}

export interface CompletedGoalType {
    id: number;
    title: string;
    type: string;
    targetAmount: number;
    finalAmount: number;
    totalInvested: number;
    returns: number;
    duration: string;
    icon: string;
    color: string;
    completedDate: string;
    startDate: string;
}

// Navigation Types
export type GoalPlanStackParamList = {
    GoalPlan: undefined;
    CreateGoal: { goalType: GoalType };
    GoalDetails: { goal: OngoingGoalType };
    CompletedGoalDetails: { goal: CompletedGoalType };
    MFAllocation: {
        recommendedPlan?: any;
        selectedPlanType?: string;
        goalData?: any;
        isEditMode?: boolean;
        originalGoal?: any;
    };
    SchemeSelection: {
        payload: any;
        originalScheme: any;
        planType: string;
        isEditMode?: boolean;
        originalGoal?: any;
        goalData?: any;
        onSchemeSelected?: (scheme: any) => void;
    };
};

// Constants
export const GOAL_TYPES = [
    {
        id: 1,
        title: 'Retirement',
        icon: '👫',
        color: '#FF6B6B',
        description: 'Plan for your golden years'
    },
    {
        id: 2,
        title: 'Custom',
        icon: '🛰️',
        color: '#4ECDC4',
        description: 'Create your own goal'
    },
    {
        id: 3,
        title: 'World Tour',
        icon: '🌍',
        color: '#45B7D1',
        description: 'Travel around the world'
    },
    {
        id: 4,
        title: 'Education',
        icon: '📚',
        color: '#96CEB4',
        description: 'Fund your education'
    },
    {
        id: 5,
        title: 'Car',
        icon: '🚗',
        color: '#FFEAA7',
        description: 'Buy your dream car'
    },
    {
        id: 6,
        title: 'Wedding',
        icon: '👰',
        color: '#FD79A8',
        description: 'Plan your special day'
    },
];

// Utility Functions
export const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
        return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount}`;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

export const calculateReturnPercentage = (returns: number, invested: number): string => {
    return ((returns / invested) * 100).toFixed(1);
};

export const calculateProgress = (current: number, target: number): number => {
    return Math.min(Math.round((current / target) * 100), 100);
};
