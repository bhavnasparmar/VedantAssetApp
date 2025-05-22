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
        width={responsiveWidth(20)}
        customStyles={{
          marginTop: focused ? -responsiveWidth(15) : 0,
          backgroundColor: focused ? colors.orange : 'transparent',
          height: focused ? responsiveWidth(15) : undefined,
          width: focused ? responsiveWidth(15) : undefined,
          borderRadius: focused ? responsiveWidth(10) : 0,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: focused ? 8 : 0,
        }}>
        <Wrapper
          row
          customStyles={{
            position: 'relative',
            zIndex: 0,
            right: responsiveWidth(-1),
            top: responsiveWidth(focused ? 1.5 : 0),
          }}>
          {type === 'image' ? (
            <Image
              source={source}
              resizeMode="contain"
              style={{
                tintColor: focused && tabIndex >= 0 ? null : colors.inputLabel,
                height: responsiveWidth(8),
                width: responsiveWidth(8),
              }}
            />
          ) : (
            <IonIcon
              name={source}
              style={{
                color:
                  focused && tabIndex >= 0 ? colors.Hard_White : colors.gray,
                fontSize: isIpad() ? responsiveWidth(4) : fontSize.XL,
                width: responsiveWidth(8),
                height: responsiveWidth(8),
              }}
            />
          )}
        </Wrapper>
        {focused ? (
          <Wrapper
            customStyles={{top: responsiveWidth(7), zIndex: 10,borderRadius : borderRadius.ring}}
            color={colors.orange}
            width={responsiveWidth(5)}
            height={responsiveWidth(2)}></Wrapper>
        ) : null}
      </Wrapper>
    );
  };

  return (
    <>
      <Tab.Navigator
         backBehavior="history"
        screenOptions={screenOptions}
        tabBar={props => {
          const newRoutes = props.state.routes.slice(0, 4);
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
                page="Dashboard"
                focused={focused}
                source={'home'}
                type="icon"
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
                page=""
                focused={focused}
                source={'person'}
                type="icon"
                isCenter={true} // The center button
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
                page="Chat"
                focused={focused}
                source="chatbubble"
                type="icon"
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
                page="Chat"
                focused={focused}
                source="analytics"
                type="icon"
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
