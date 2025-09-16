# Goal Plan Module

A comprehensive goal planning module for financial planning and tracking, designed with responsive and attractive UI for mobile devices.

## 📁 Folder Structure

```
app/screens/goalplan/
├── GoalPlan.tsx              # Main container component with tab navigation
├── components/
│   ├── NewGoal.tsx           # New goal creation interface
│   ├── OngoingGoal.tsx       # Active goals tracking
│   └── CompletedGoal.tsx     # Completed goals history
├── styles/
│   └── goalPlanStyles.ts     # Centralized styles
├── index.ts                  # Module exports and types
└── README.md                 # Documentation
```

## 🎯 Features

### New Goal Component
- **Goal Types**: 6 predefined goal categories (Retirement, Custom, World Tour, Education, Car, Wedding)
- **Visual Design**: Colorful cards with emojis and descriptions
- **Responsive Grid**: 2-column layout on mobile, adaptive for tablets
- **Custom Goal Creation**: Option to create personalized goals

### Ongoing Goal Component
- **Progress Tracking**: Visual progress bars with percentage completion
- **Financial Overview**: Current amount, target amount, monthly SIP
- **Time Management**: Remaining time display
- **Interactive Cards**: Tap to view detailed goal information

### Completed Goal Component
- **Achievement Display**: Completed goals with success indicators
- **Returns Analysis**: Investment returns and percentage gains
- **Historical Data**: Duration and completion dates
- **Performance Metrics**: Target vs achieved amounts

## 🎨 Design Features

### Visual Elements
- **Color-coded Goals**: Each goal type has a unique color scheme
- **Progress Indicators**: Animated progress bars and percentage badges
- **Icon System**: Emoji-based icons for easy recognition
- **Card-based Layout**: Clean, modern card design with shadows

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Adaptive Layout**: Responsive grid system
- **Touch-friendly**: Large touch targets and proper spacing
- **Cross-platform**: Works on both iOS and Android

### Theme Support
- **Dark/Light Mode**: Supports appearance context
- **Dynamic Colors**: Theme-aware color system
- **Consistent Typography**: Unified text sizing and weights

## 🔧 Technical Implementation

### State Management
```typescript
const [activeTab, setActiveTab] = useState('newgoal');
const [ongoingGoals, setOngoingGoals] = useState([]);
const [completedGoals, setCompletedGoals] = useState([]);
```

### Navigation Structure
```typescript
type GoalPlanStackParamList = {
    GoalPlan: undefined;
    CreateGoal: { goalType: GoalType };
    GoalDetails: { goal: OngoingGoalType };
    CompletedGoalDetails: { goal: CompletedGoalType };
};
```

### Data Types
```typescript
interface OngoingGoalType {
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
```

## 📱 Usage

### Import the Module
```typescript
import { GoalPlan } from '../screens/goalplan';
```

### Navigation Setup
```typescript
// Add to your navigation stack
<Stack.Screen 
    name="GoalPlan" 
    component={GoalPlan}
    options={{ headerShown: false }}
/>
```

### Navigate to Goal Plan
```typescript
navigation.navigate('GoalPlan');
```

## 🎯 Goal Types Available

1. **Retirement** 👫 - Plan for your golden years
2. **Custom** 🛰️ - Create your own goal
3. **World Tour** 🌍 - Travel around the world
4. **Education** 📚 - Fund your education
5. **Car** 🚗 - Buy your dream car
6. **Wedding** 👰 - Plan your special day

## 💰 Financial Features

### Currency Formatting
- Automatic formatting (₹1.5L, ₹2.3Cr)
- Indian numbering system support
- Responsive text sizing

### Progress Calculation
- Real-time progress tracking
- Percentage-based completion
- Visual progress indicators

### Returns Analysis
- Investment returns calculation
- Percentage gain/loss display
- Color-coded performance indicators

## 🎨 Customization

### Colors
```typescript
const goalColors = {
    retirement: '#FF6B6B',
    custom: '#4ECDC4',
    worldTour: '#45B7D1',
    education: '#96CEB4',
    car: '#FFEAA7',
    wedding: '#FD79A8',
};
```

### Responsive Breakpoints
```typescript
const responsiveSizes = {
    mobile: responsiveWidth(42),    // Goal card width
    tablet: responsiveWidth(28),    // Tablet optimization
    padding: responsiveWidth(4),    // Standard padding
};
```

## 🚀 Future Enhancements

- [ ] Goal creation wizard
- [ ] Investment recommendations
- [ ] Goal sharing functionality
- [ ] Notification system
- [ ] Analytics dashboard
- [ ] Export functionality
- [ ] Goal templates
- [ ] Social features

## 📋 Dependencies

- React Native
- React Navigation
- Vector Icons
- Appearance Context
- Custom UI Components (Wrapper, CusText)

## 🎯 Performance Optimizations

- Lazy loading of components
- Optimized FlatList rendering
- Memoized calculations
- Efficient state management
- Minimal re-renders

## 📱 Platform Support

- ✅ iOS
- ✅ Android
- ✅ Responsive Design
- ✅ Dark/Light Theme
- ✅ Accessibility Support
