import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import Tabs from '../tab';
import {DrawerContent} from './DrawerContent';
import ChangePassword from '../../../screens/home/ChangePassword/ChangePassword';
import GoalDashboard from '../../../screens/home/goalPlanning/goaltabview/goalDashboard';
import RiskProfile from '../../../screens/home/riskProfile/riskProfile';

const Drawer = createDrawerNavigator();

function SideDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName={"Tabs"}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
      }}
      backBehavior="history"
      drawerContent={(props: any) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Tabs" component={Tabs} />
      <Drawer.Screen name="ChangePassword" component={ChangePassword} />
      <Drawer.Screen name='GoalDashboard' component={GoalDashboard} />
      <Drawer.Screen name='RiskProfile' component={RiskProfile} />
    </Drawer.Navigator>
  );
}

export default SideDrawer;
