import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Tabs from '../tab';
import { DrawerContent } from './DrawerContent';
import ChangePassword from '../../../screens/home/ChangePassword/ChangePassword';
import RiskProfile from '../../../screens/home/riskProfile/riskProfile';
import SelectScheme from '../../../screens/home/SelectScheme/SelectScheme';
import SchemeEdit from '../../../screens/home/schemeEdit/schemeEdit';
import SuggestedScheme from '../../../screens/home/goalPlanning/component/suggestedScheme';
import Cart from '../../../screens/home/cart/cart';
import FunpickerDetail from '../../../screens/home/fundpickerdetail/funpickerdetail';
import FundPicker from '../../../screens/home/fundpicker/fundpicker';
import GoalDashboard from '../../../screens/home/goalPlanning/GoalPlanDashborad/GoalPlanDashboard';
import Dashboard from '../../../screens/home/Dashboard/Dashboard';
import PancardVerify from '../../../screens/home/PancardVerify/pancardVerify';
import AnnualInvest from '../../../screens/home/AnnualInvest/annualInvest';
import EditDetails from '../../../screens/home/EditDetailsKYC/editDetails';
import KycInfoPage from '../../../screens/home/KycInfoPage/kycInfoPage';
import KycDigiLockerInfo from '../../../screens/home/KycInfoPage/kycDigiLockerInfo';
import KycDashboard from '../../../screens/home/KYCDashboard/kycDashboard';
import Profile from '../../../screens/home/Profile/profile';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const options = {
  headerShown: false,
};

// This is the main stack that will contain all screens
const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={options}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="GoalDashboard" component={GoalDashboard} />
      <Stack.Screen name="SelectScheme" component={SelectScheme} />
      <Stack.Screen name="SchemeEdit" component={SchemeEdit} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="SuggestedScheme" component={SuggestedScheme} />
      <Stack.Screen name="FunpickerDetail" component={FunpickerDetail} />
      <Stack.Screen name="PancardVerify" component={PancardVerify} />
      <Stack.Screen name="AnnualInvest" component={AnnualInvest} />
      <Stack.Screen name="EditDetails" component={EditDetails} />
      <Stack.Screen name="KycInfoPage" component={KycInfoPage} />
      <Stack.Screen name="KycDigiLockerInfo" component={KycDigiLockerInfo} />
      <Stack.Screen name="KycDashboard" component={KycDashboard} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

function SideDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        drawerStyle: {
          // width: Dimensions.get('window').width / 1.25,
        },
      }}
      backBehavior="history"
      drawerContent={(props: any) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Main" options={options} component={AppStack} />
    </Drawer.Navigator>
  );
}

export default SideDrawer;
