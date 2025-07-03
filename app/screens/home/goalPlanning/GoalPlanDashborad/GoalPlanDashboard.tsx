import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, Text } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import {
  borderRadius,
  responsiveHeight,
  responsiveWidth,
} from '../../../../styles/variables';
import Wrapper from '../../../../ui/wrapper';
import Chartshow from '../component/chartShow';
import NewGoalpopup from '../component/newGoalpopup';
import RecommendedPlan from '../component/recomendedPlan';
import CompletedGoal from './components/completedGoal';
import Header from '../../../../shared/components/Header/Header';
import { AppearanceContext } from '../../../../context/appearanceContext';
import NewGoal from './Components/NewGoal';
import OnGoingGoal from './Components/OnGoingGoal';
import { useIsFocused, useRoute } from '@react-navigation/native';

const GoalDashboard = () => {
  const { colors }: any = useContext(AppearanceContext);
  const route: any = useRoute()
  const isFocused: any = useIsFocused()
  const layout = Dimensions.get('window');
  console.log('route Data : ', route?.params)

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'newgoal', title: 'New' },
    { key: 'ongoinggoal', title: 'Ongoing' },
    { key: 'completedgoal', title: 'Completed' },
  ]);

  const [chartshow, setChartshow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [goalID, setGoalId] = useState<any>('');
  const [goalPlanID, setGoalPlanID] = useState<any>('');
  const [recommended, setRecommended] = useState(false);
  const [riskProfileData, setriskProfileData] = useState<any>({})
  const [editGoalData, setEditGoalData] = useState<any>({})
  const [goalPlanName, setGoalPlanName] = useState<any>('')
  const [pageName, setPageName] = useState<any>('')

  useEffect(() => {
    if (route?.params?.tabNumber === 0) {
      setIndex(route?.params?.tabNumber)
      setIsVisible(false)
    } else {
      if (route?.params?.tabNumber) {
        console.log('Route Available')
        setEditGoalData(route?.params?.goalPlanData)
        setIndex(route?.params?.tabNumber)
        setIsVisible(route?.params?.tabNumber === 0 ? false : route?.params?.showAlert)
        setPageName('')
      } else {
        // console.log('Route Not Available')
        // setIsVisible(false)
      }
    }


  }, [isFocused])

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'newgoal':
        return (
          <NewGoal
            setisVisible={(value: boolean) => setIsVisible(value)}
            setgoalId={(value: any) => setGoalId(value)}
            setGoalPlanID={(value: any) => setGoalPlanID(value)}
            setGoalName={(value: any) => setGoalPlanName(value)}
            riskprofileData={(value: any) => setriskProfileData(value)}
            setPageName={(value: any) => setPageName(value)}
          />
        );
      case 'ongoinggoal':
        return (
          <OnGoingGoal
            setgoalId={(value: any) => setGoalId(value)}
            setGoalName={(value: any) => setGoalPlanName(value)}
            setGoalPlanID={(value: any) => setGoalPlanID(value)}
          />
        );
      case 'completedgoal':
        return <></>;
      // <CompletedGoal />;
      default:
        return null;
    }
  };
  console.log("setriskProfileData", goalPlanID, riskProfileData,)
  return (
    <>
      <Header backBtn name="Goal Planning" />
      <Wrapper color={colors.Hard_White} height={responsiveHeight(92)}>
        <TabView
          lazy
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          style={{
            marginBottom: responsiveWidth(3),
          }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: colors.Hard_White,
              borderTopLeftRadius: borderRadius.medium, borderTopRightRadius: borderRadius.medium, height: responsiveWidth(10) }}
                pressOpacity={0}
                pressColor={colors.tabBg}
              style={{ backgroundColor: colors.tabBg }}
              inactiveColor={colors.black}
              activeColor={colors.black}
              tabStyle={{paddingBottom :0}}
              // renderLabel={({ route, focused }: any) => (
              //   <Text
              //     style={{
              //       color: focused ? colors.pink : colors.pink,
              //       fontWeight: focused ? 'bold' : 'normal',
              //     }}>
              //     {route.title}
              //   </Text>
              // )}
            />
          )}
        />
      </Wrapper>
      <NewGoalpopup
        isVisible={isVisible}
        goalID={goalID}
        goalPlanID={goalPlanID}
        goalPlanName={goalPlanName}
        setisVisible={(value: any) => setIsVisible(value)}
        flag={(value: boolean) => setRecommended(value)}
        riskProfileData={riskProfileData}
        editGoalData={pageName === 'NewGoal' ? null : route?.params?.goalPlanData}
      />
      <RecommendedPlan
        isVisible={recommended}
        setisVisible={(value: any) => setRecommended(value)}
        goalPlanID={goalPlanID}
        flag={setChartshow}
      />
      <Chartshow
        isVisible={chartshow}
        setisVisible={setChartshow}
        goalPlanID={goalPlanID}
        flag={setRecommended}
      />
    </>
  );
};

export default GoalDashboard;
