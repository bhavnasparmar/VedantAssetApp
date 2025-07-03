import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, Platform, TouchableOpacity, View} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {AppearanceContext} from '../../context/appearanceContext';

import {
  borderRadius,
  fontFamily,
  fontSize,
  isIpad,
  responsiveWidth,
} from '../../styles/variables';
import CusText from '../../ui/custom-text';
import Wrapper from '../../ui/wrapper';
import Dashboard from '../../screens/home/Dashboard/Dashboard';
import Spacer from '../../ui/spacer';
import FundPicker from '../../screens/home/fundpicker/fundpicker';
import GoalDashboard from '../../screens/home/goalPlanning/GoalPlanDashborad/GoalPlanDashboard';
import RiskProfile from '../../screens/home/riskProfile/riskProfile';

const Tab = createBottomTabNavigator();

const Tabs = ({route, navigation: parentNavigation}: any) => {
  const navigation: any = useNavigation();
  const {colors}: any = React.useContext(AppearanceContext);
  const [tabIndex, setTabIndex] = useState<any>(0);

  const screenOptions: any = {
    headerShown: false,
    tabBarActiveTintColor: colors.secondary,
    tabBarInactiveTintColor: colors.Hard_White,
    tabBarStyle: {
      backgroundColor: colors.bottomTabBG1,
      paddingHorizontal: responsiveWidth(3),
      borderTopWidth: 0,
      height:
        Platform.OS === 'ios' && !isIpad()
          ? responsiveWidth(18)
          : isIpad()
          ? responsiveWidth(10)
          : responsiveWidth(15),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.28,
      shadowRadius: 16.0,
      elevation: 24,
    },
    tabBarShowLabel: false,
    tabBarItemStyle: {
      margin: Platform.OS === 'ios' ? responsiveWidth(3) : responsiveWidth(3),
      flexDirection: 'column',
      height:
        Platform.OS === 'ios' && !isIpad()
          ? responsiveWidth(10)
          : isIpad()
          ? responsiveWidth(9)
          : responsiveWidth(16),
    },
    tabBarLabelStyle: {
      color: colors.black,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.extraSmall,
      width: '100%',
    },
  };
  
  const TabView = ({focused, source, page, type, isCenter, onPress}: any) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={onPress}
        style={{
          width: responsiveWidth(20),
          height: responsiveWidth(20),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Wrapper
          justify="center"
          align="center"
          position='center'
          customStyles={{
            backgroundColor: 'transparent',
            height: responsiveWidth(20),
            width: responsiveWidth(20),
            borderRadius: 0,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 0,
          }}>
          <Wrapper
            justify='center'
            customStyles={{
              position: 'relative',
              zIndex: 0,
              top: responsiveWidth(focused ? responsiveWidth(-1) : 0),
              backgroundColor: focused ? colors.orange : 'transparent',
              height: focused ? responsiveWidth(14) : undefined,
              width: focused ? responsiveWidth(14) : undefined,
              borderRadius: focused ? responsiveWidth(10) : 0,
            }}>
            {type === 'image' ? (
              <Image
                source={source}
                resizeMode="contain"
                style={{
                  tintColor: focused && tabIndex >= 0 ? colors.Hard_White : colors.orange,
                  height: responsiveWidth(7),
                  width: responsiveWidth(7),
                  alignSelf:'center',
                }}
              />
            ) : (
              <IonIcon
                name={source}
                style={{
                  color:
                    focused && tabIndex >= 0 ? colors.Hard_White : colors.orange,
                  fontSize: isIpad() ? responsiveWidth(4) : fontSize.XL,
                  width: responsiveWidth(8),
                  height: responsiveWidth(8),
                }}
              />
            )}
          </Wrapper>
          <Wrapper position='center' 
           customStyles={{
              position: 'relative',
              zIndex: 0,
              top: responsiveWidth(focused ? responsiveWidth(-1) : 0),
              marginTop:responsiveWidth(1.5)
            }}>
            <CusText bold position='center' color={colors.orange} text={page} size='XXS'/>
          </Wrapper>
        </Wrapper>
      </TouchableOpacity>
    );
  };

  // Custom tab bar component with TouchableOpacity
  const CustomTabBar = (props: any) => {
    const { state, descriptors, navigation } = props;
    const newRoutes = state.routes.slice(0, 5);
    const newIndex = newRoutes.findIndex(
      (route:any) => route.key === state.routes[state.index].key,
    );
    const newState = {
      ...state,
      routes: newRoutes,
      index: newIndex >= 0 ? newIndex : 0,
    };
    setTabIndex(newIndex);

    return (
      <View style={{ 
        flexDirection: 'row', 
        backgroundColor: colors.bottomTabBG1,
        height: Platform.OS === 'ios' && !isIpad()
          ? responsiveWidth(18)
          : isIpad()
          ? responsiveWidth(10)
          : responsiveWidth(15),
        paddingHorizontal: responsiveWidth(3),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.28,
        shadowRadius: 16.0,
        elevation: 24,
      }}>
        {newRoutes.map((route:any, index:number) => {
          const { options } = descriptors[route.key];
          const isFocused = newIndex === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (route.name === 'More') {
              parentNavigation.openDrawer();
              return;
            }

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Get the tab icon component
          let tabIcon;
          if (route.name === 'FundPicker') {
            tabIcon = (
              <TabView
                page="Fund Explore"
                focused={isFocused}
                source={require('../../assets/Images/fundExplo.png')}
                type="image"
                isCenter={false}
                onPress={onPress}
              />
            );
          } else if (route.name === 'GoalPlanDashboard') {
            tabIcon = (
              <TabView
                page="Goal Planning"
                focused={isFocused}
                source={require('../../assets/Images/goalPlan.png')}
                type="image"
                isCenter={true}
                onPress={onPress}
              />
            );
          } else if (route.name === 'Dashboard') {
            tabIcon = (
              <TabView
                page="Dashboard"
                focused={isFocused}
                source={require('../../assets/Images/dashboar.png')}
                type="image"
                isCenter={false}
                onPress={onPress}
              />
            );
          } else if (route.name === 'RiskProfile') {
            tabIcon = (
              <TabView
                page="Risk Profile"
                focused={isFocused}
                source={require('../../assets/Images/RiskProfile.png')}
                type="image"
                isCenter={false}
                onPress={onPress}
              />
            );
          } else if (route.name === 'More') {
            tabIcon = (
              <TabView
                page="More"
                focused={isFocused}
                source={require('../../assets/Images/more.png')}
                type="image"
                isCenter={false}
                onPress={onPress}
              />
            );
          }

          return (
            <View 
              key={index} 
              style={{ 
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {tabIcon}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="Dashboard"
        backBehavior="history"
        screenOptions={screenOptions}
        tabBar={props => <CustomTabBar {...props} />}
      >
        <Tab.Screen
          name="FundPicker"
          component={FundPicker}
        />

        <Tab.Screen
          name="GoalPlanDashboard"
          component={GoalDashboard}
        />
        
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
        />
        
        <Tab.Screen
          name="RiskProfile"
          component={RiskProfile}
        />
        
        <Tab.Screen
          name="More"
          component={Dashboard}
        />
      </Tab.Navigator>
    </>
  );
};

export default Tabs;