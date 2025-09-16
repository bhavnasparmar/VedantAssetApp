import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { AppearanceContext } from '../../context/appearanceContext';
import Header from '../../shared/components/Header/Header';
import Wrapper from '../../ui/wrapper';
import CusText from '../../ui/custom-text';
import { colors, responsiveWidth, responsiveHeight, borderRadius } from '../../styles/variables';
import NewGoal from './components/NewGoal';
// import OngoingGoal from './components/OngoingGoal';
// import CompletedGoal from './components/CompletedGoal';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import OngoingGoal from './components/OngoingGoal';
import CompletedGoal from './components/CompletedGoal';
import Spacer from '../../ui/spacer';

const GoalPlan = () => {
    const { colors: themeColors }: any = useContext(AppearanceContext);
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const [activeTab, setActiveTab] = useState('newgoal');

    const tabs = [
        { key: 'newgoal', title: 'New', component: NewGoal },
        { key: 'ongoing', title: 'Ongoing', component: OngoingGoal },
        { key: 'completed', title: 'Completed', component: CompletedGoal },
    ];

    // Handle route params for re-calculation
    useEffect(() => {
        const params = route.params as any;
        if (params?.openCalculationModal && isFocused) {
            // Switch to New Goal tab and pass existing data
            setActiveTab('newgoal');
        }
    }, [route.params, isFocused]);

    const renderTabButton = (tab: any, index: number) => {
        const isActive = activeTab === tab.key;

        return (
            <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
            //     style={
            //         [
            //         styles.tabButton,
            //         {
            //             backgroundColor: isActive ? colors.primary1 : themeColors.cardBackground,
            //             borderColor: isActive ? colors.primary1 : colors.lightGray,
            //         }
            //     ]
            // }
                activeOpacity={0.8}
            >
            <Wrapper row align='center' customStyles={{ gap: responsiveWidth(0) }}>
                {
                    index === 1 ?
                        <>
                            <Spacer x='XXS' />
                            <Wrapper color={colors.gray} width={responsiveWidth(8)} height={1} customStyles={{}} />
                            <Spacer x='XXS' />
                        </>
                        : null
                }
                <Wrapper key={tab.key}>
                    <CusText
                        text={tab.title}
                        size="M"
                        color={isActive ? colors.orange : colors.black}
                        bold={isActive}
                        customStyles={{ textAlign: 'center' }}
                    />
                </Wrapper>
                {
                    index === 1 ?
                        <>
                            <Spacer x='XXS' />
                            <Wrapper color={colors.gray} width={responsiveWidth(8)} height={1} customStyles={{}} />
                            <Spacer x='XXS' />
                        </>
                        : null
                }
            </Wrapper>
        </TouchableOpacity>
        );
    };

    const renderActiveComponent = () => {
        const activeTabData = tabs.find(tab => tab.key === activeTab);
        if (activeTabData) {
            const Component = activeTabData.component;

            // Pass route params to NewGoal component for re-calculation
            if (activeTab === 'newgoal') {
                const params = route.params as any;
                return <Component
                    existingGoalData={params?.existingGoalData}
                    openCalculationModal={params?.openCalculationModal}
                    isEditMode={params?.isEditMode}
                    originalGoal={params?.originalGoal}
                />;
            }

            return <Component />;
        }
        return null;
    };

    return (
        <>
            <Header
                backBtn
                name="Goal Plan"
                onBackPress={() => navigation.goBack()}
            />
            {/* Tab Navigation */}
            {/* <View style={[styles.tabContainer, { backgroundColor: themeColors.cardBackground }]}>
                {tabs.map((tab, index) => renderTabButton(tab, index))}
            </View> */}
            <Spacer y='XXS' />
            <Wrapper row position='center' justify='center' align='center' customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                {tabs.map((tab, index) => renderTabButton(tab, index))}
            </Wrapper>
            <Spacer y='XXS' />
            <Wrapper position='center' color={colors.gray} width={responsiveWidth(90)} height={1} customStyles={{}} />
            <Spacer y='XXS' />
             //     {/* Content Area */}
             <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    {renderActiveComponent()}
                </View>
            </ScrollView>
        </>
        // <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        //     <Header
        //         backBtn
        //         name="Goal Plan"
        //         onBackPress={() => navigation.goBack()}
        //     />

        //     {/* Tab Navigation */}
        //     <View style={[styles.tabContainer, { backgroundColor: themeColors.cardBackground }]}>
        //         {tabs.map((tab, index) => renderTabButton(tab, index))}
        //     </View>

        //     {/* Content Area */}
        //     <ScrollView
        //         style={styles.scrollView}
        //         contentContainerStyle={styles.scrollContent}
        //         showsVerticalScrollIndicator={false}
        //     >
        //         <View style={styles.contentContainer}>
        //             {renderActiveComponent()}
        //         </View>
        //     </ScrollView>
        // </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveHeight(2),
        borderRadius: responsiveWidth(3),
        padding: responsiveWidth(1),
        elevation: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    tabButton: {
        flex: 1,
        paddingVertical: responsiveHeight(1.8),
        paddingHorizontal: responsiveWidth(3),
        borderRadius: responsiveWidth(2.5),
        marginHorizontal: responsiveWidth(0.5),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    scrollView: {
        flex: 1,
        marginTop: responsiveHeight(1),
    },
    scrollContent: {
        paddingBottom: responsiveHeight(12),
    },
    contentContainer: {
        flex: 1,
    },
});

export default GoalPlan;
