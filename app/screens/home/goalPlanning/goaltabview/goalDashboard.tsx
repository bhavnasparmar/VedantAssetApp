import React, {useState, useContext} from 'react';
import {Dimensions, Text} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
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
import NewGoal from './components/newGoal';
import OnGoingGoal from './components/onGoingGoal';
import Header from '../../../../shared/components/Header/Header';
import {AppearanceContext} from '../../../../context/appearanceContext';

const GoalDashboards = () => {
  const {colors}: any = useContext(AppearanceContext);
  const layout = Dimensions.get('window');

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'newgoal', title: 'New Goal'},
    {key: 'ongoinggoal', title: 'Ongoing Goal'},
    {key: 'completedgoal', title: 'Completed Goal'},
  ]);

  const [chartshow, setChartshow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [goalID, setGoalId] = useState<any>('');
  const [goalPlanID, setGoalPlanID] = useState<any>('');
  const [recommended, setRecommended] = useState(false);
  const [riskProfileData, setriskProfileData] = useState<any>({})
 const [goalPlanName, setGoalPlanName] = useState<any>('')
  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'newgoal':
        return (
          <NewGoal
           setisVisible={(value: boolean) => setIsVisible(value)}
                    setgoalId={(value: any) => setGoalId(value)}
                    setGoalPlanID={(value: any) => setGoalPlanID(value)}
                    setGoalName={(value: any) => setGoalPlanName(value)}
                    riskprofileData={(value:any) => setriskProfileData(value)}
          />
        );
      case 'ongoinggoal':
        return (
          <></>
          // <OnGoingGoal
          //     setVisible={setIsVisible}
          //     setgoalId={setGoalId}
          //     setGoalPlanID={setGoalPlanID}
          // />
        );
      case 'completedgoal':
        return <></>;
      // <CompletedGoal />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header menubtn name="Goal Planning" />
      <Wrapper color={colors.Hard_White} height={responsiveHeight(92)}>
        <TabView
          lazy
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          style={{
            marginHorizontal: responsiveWidth(3),
            marginBottom: responsiveWidth(3),
            borderRadius: borderRadius.medium,
          }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{backgroundColor: colors.primary}}
              style={{backgroundColor: colors.primary}}
              renderLabel={({route, focused}: any) => (
                <Text
                  style={{
                    color: focused ? colors.pink : colors.pink,
                    fontWeight: focused ? 'bold' : 'normal',
                  }}>
                  {route.title}
                </Text>
              )}
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
      />
      <RecommendedPlan
        isVisible={recommended}
        setisVisible={setRecommended}
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

export default GoalDashboards;
