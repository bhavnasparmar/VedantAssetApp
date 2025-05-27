import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import Tabs from '../tab';
import { DrawerContent } from './DrawerContent';
import ChangePassword from '../../../screens/home/ChangePassword/ChangePassword';
import GoalDashboard from '../../../screens/home/goalPlanning/goaltabview/goalDashboard';
import RiskProfile from '../../../screens/home/riskProfile/riskProfile';
import { Dimensions } from 'react-native';
import { responsiveWidth } from '../../../styles/variables';
import GoalPlanDashboard from '../../../screens/home/goalPlanning/GoalPlanDashborad/GoalPlanDashboard';
import SelectScheme from '../../../screens/home/SelectScheme/SelectScheme';
import fundpicker from '../../../screens/home/fundpicker/fundpicker';
import FundPicker from '../../../screens/home/fundpicker/fundpicker';

const Drawer = createDrawerNavigator();

function SideDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName={"Tabs"}
      // screenOptions={{
      //   headerShown: false,
      //   swipeEnabled: false,
      // }}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,

        drawerStyle: {
          // width: Dimensions.get('window').width / 1.25,
          // width: Dimensions.get('window').width,
          // height:responsiveWidth(10)
        },
        // drawerType: 'back',

      }}
      backBehavior="history"
      // useLegacyImplementation={false}
      drawerContent={(props: any) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Tabs" component={Tabs} />
      <Drawer.Screen name="ChangePassword" component={ChangePassword} />
      {/* <Drawer.Screen name='GoalDashboard' component={GoalDashboard} /> */}
      <Drawer.Screen name='GoalPlanDashboard' component={GoalPlanDashboard} />
      <Drawer.Screen name='RiskProfile' component={RiskProfile} />
      <Drawer.Screen name='SelectScheme' component={SelectScheme} />
      <Drawer.Screen name='FundPicker' component={FundPicker} />
    </Drawer.Navigator>
  );
}

export default SideDrawer;
