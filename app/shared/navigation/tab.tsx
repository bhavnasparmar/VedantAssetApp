import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, Platform} from 'react-native';
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

const Tab = createBottomTabNavigator();
type TabViewProps = {
  focused: boolean;
  source: any;
  page: string;
};

const Tabs = ({route}: any) => {
  const navigation: any = useNavigation();
  const {colors}: any = React.useContext(AppearanceContext);
  const [tabIndex, setTabIndex] = useState<any>(0);

  const screenOptions: any = {
    headerShown: false,
    tabBarActiveTintColor: colors.secondary,
    tabBarDeactiveTintColor: colors.Hard_White,
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
  const TabView = ({focused, source, page, type, isCenter}: any) => {
    return (
      <Wrapper
       
        justify="center"
        align="center"
          position='center'
        // width={responsiveWidth(20)}
        customStyles={{
          // marginTop: focused ? -responsiveWidth(15) : 0,
          // backgroundColor: focused ? colors.orange : 'transparent',
          // height: focused ? responsiveWidth(15) : responsiveWidth(20),
          // width: focused ? responsiveWidth(15) : responsiveWidth(20),
          // borderRadius: focused ? responsiveWidth(10) : 0,

          //  marginTop:  0,
          backgroundColor:  'transparent',
          height:  responsiveWidth(20),
          width: responsiveWidth(20),
          borderRadius:  0,

          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          // elevation: focused ? 8 : 0,
          elevation: 0,
        }}>
        <Wrapper
          justify='center'
          customStyles={{
            position: 'relative',
            zIndex: 0,
            // right: responsiveWidth(0),
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
        {/* <Spacer y='XXS' /> */}
        <Wrapper position='center' 
        // customStyles={{marginTop:responsiveWidth(1)}}
         customStyles={{
            position: 'relative',
            zIndex: 0,
            // right: responsiveWidth(0),
            top: responsiveWidth(focused ? responsiveWidth(-1) : 0),
            // backgroundColor: focused ? colors.orange : 'transparent',
            //  height: focused ? responsiveWidth(15) : undefined,
            //  width: focused ? responsiveWidth(15) : undefined,
              // borderRadius: focused ? responsiveWidth(10) : 0,
              marginTop:responsiveWidth(1.5)
          }}>
        
          <CusText bold position='center' color={colors.orange} text={page} size='XXS'/>
        </Wrapper>
        {/* {focused ? (
          <Wrapper
            customStyles={{top: responsiveWidth(7), zIndex: 10,borderRadius : borderRadius.ring}}
            color={colors.orange}
            width={responsiveWidth(5)}
            height={responsiveWidth(2)}></Wrapper>
        ) : null} */}
      </Wrapper>
    );
  };


  return (
    <>
      <Tab.Navigator
         backBehavior="history"
        screenOptions={screenOptions}
        tabBar={props => {
          const newRoutes = props.state.routes.slice(0, 5);
          const newIndex = newRoutes.findIndex(
            route => route.key === props.state.routes[props.state.index].key,
          );
          const newState = {
            ...props.state,
            routes: newRoutes,
            index: newIndex >= 0 ? newIndex : 0,
          };
          setTabIndex(newIndex);
          return <BottomTabBar {...props} state={newState} />;
        }}>
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            tabBarIcon: ({focused}: any) => (
              <TabView
                page="Fund Explore"
                focused={focused}
                source={require('../../assets/Images/fundExplo.png')}
                type="image"
                isCenter={false}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Center"
          component={Dashboard}
          options={{
            tabBarIcon: ({focused}: any) => (
              <TabView
                page="Goal Planning"
                focused={focused}
               source={require('../../assets/Images/goalPlan.png')}
                type="image"
                isCenter={true} // The center button
              />
            ),
          }}
        />
 <Tab.Screen
          name="Dash"
          component={Dashboard}
          options={{
            tabBarIcon: ({focused}: any) => (
              <TabView
                page="Dashboard"
                focused={focused}
                 source={require('../../assets/Images/dashboar.png')}
                type="image"
                isCenter={false}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          component={Dashboard}
          options={{
            tabBarIcon: ({focused}: any) => (
              <TabView
                page="Risk Profile"
                focused={focused}
                source={require('../../assets/Images/RiskProfile.png')}
                type="image"
                isCenter={false}
              />
            ),
          }}
        />
          <Tab.Screen
          name="route"
          component={Dashboard}
          options={{
            tabBarIcon: ({focused}: any) => (
              <TabView
                page="More"
                focused={focused}
                source={require('../../assets/Images/more.png')}
                type="image"
                isCenter={false}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default Tabs;
