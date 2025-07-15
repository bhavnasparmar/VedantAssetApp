import {
  DrawerContentScrollView,
  DrawerItem,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, Platform, StyleSheet, View } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from '../../../context/appearanceContext';
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  responsiveHeight,
  responsiveWidth,
  spaceVertical,
} from '../../../styles/variables';
import Container from '../../../ui/container';
import CusButton from '../../../ui/custom-button';
import CusText from '../../../ui/custom-text';
import Wrapper from '../../../ui/wrapper';
// import CommonModal from '../../components/CommonModal/commonModal';
import CommonModal from '../../components/CommonAlert/commonModal';
import { AuthContext } from '../../../context/AuthContext';
import Alert from '../../components/Alert/Alert';
import {
  getTokenExpiredflagChange,
  tokenExpiredflagChange,
} from '../../../utils/Commanutils';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

export function DrawerContent(props: any) {
  const appState = useSelector((state: any) => state);
  const tokenExpiredToggles = appState.tokenReducer.tokenExpiredFlag;

  const { signOut }: any = React.useContext(AuthContext);
  const { colors }: any = React.useContext(AppearanceContext);
  const [loggingOut, setloggingOut] = useState(false);
  const [AlertVisible, setAlertVisible] = useState(false);
  const isDrawerOpen = useDrawerStatus() === 'open';
  const isFocused = useIsFocused();
  const state = props.navigation.getState();
  const currentRoute = state.routes[state.index].name;
  useEffect(() => {
    Keyboard.dismiss();
  }, [isDrawerOpen, isFocused]);

  const submit = () => {
    setloggingOut(true);
    signOut(setloggingOut);
    tokenExpiredflagChange(false);
  };

  return (
    <>
      <Container bgcolor={colors.primary} contentWidth="100%">
        <Wrapper position='center'>
          <Image style={{
            height: responsiveWidth(30),
            width: responsiveWidth(90)
          }} source={require('../../../assets/Images/FeatureGraphic.png')} />
        </Wrapper>
        <DrawerContentScrollView
          style={{ width: '100%', padding: 0, gap: 0 }}
          contentContainerStyle={{ paddingTop: responsiveWidth(2), flex: 1 }}>
          {/* <View style={[styles.menuItem, { borderColor: colors.gray }]}> */}
          {/* <View style={styles.iconSet}></View> */}
          <Wrapper customStyles={{ flex: 1, }}>

            <DrawerItem

              icon={({ focused }) => (
                // <IonIcon
                //   name="home"
                //   color={colors.white}
                //   size={responsiveWidth(7)}
                // // style={styles.menuIcon}
                // />
                <Image
                  source={require('../../../assets/Images/dashboar.png')}
                  style={{
                    height: responsiveWidth(6),
                    width: responsiveWidth(6)
                  }}
                />
              )}
              label={({ }) => (
                <CusText customStyles={{}} color={colors.white} size='N' style={styles.menuTextstyle} text="Dashboard" />
              )}

              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('Main', {
                  screen: 'Tabs',
                  params: { screen: 'Dashboard' }
                });
              }}

            />


            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[
                colors.Hard_White,
                colors.Hard_White,
                colors.Hard_White,
              ]}
              style={{ width: "90%", alignSelf: 'center', height: 0.5, opacity: 0.2 }}
            ></LinearGradient>
          </Wrapper>
          <Wrapper color={currentRoute === 'FundPicker' ? colors.Hard_White : colors.primary}>
            <DrawerItem
              icon={({ focused }) => (

                <Image
                  source={require('../../../assets/Images/fundExplo.png')}
                  style={{
                    height: currentRoute === 'FundPicker' ? responsiveWidth(8) : responsiveWidth(6),
                    width: currentRoute === 'FundPicker' ? responsiveWidth(8) : responsiveWidth(6),
                    tintColor: currentRoute === 'FundPicker' ? colors.primary : colors.Hard_White
                  }}
                />
              )}
              label={({ focused }) => {
                return (
                  <>
                    <CusText bold={currentRoute === 'FundPicker' ? true : false} customStyles={{}} color={currentRoute === 'FundPicker' ? colors.primary : colors.Hard_White} size={currentRoute === 'FundPicker' ? 'N' : 'SS'} style={styles.menuTextstyle} text="Fund Explore" />
                  </>
                )
              }
              }
              onPress={() => {
                props.navigation.navigate('Main', {
                  screen: 'Tabs',
                  params: { screen: 'FundPicker' }
                });
              }}
            />
            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[
                colors.Hard_White,
                colors.Hard_White,
                colors.Hard_White,
              ]}
              style={{ width: "90%", alignSelf: 'center', height: 0.5, opacity: 0.2 }}
            ></LinearGradient>
          </Wrapper>

          <Wrapper color={currentRoute === 'GoalPlanDashboard' ? colors.Hard_White : colors.primary}>

            <DrawerItem
              icon={({ focused }) => (
                <Image
                  source={require('../../../assets/Images/goalPlan.png')}
                  style={{
                    height: currentRoute === 'GoalPlanDashboard' ? responsiveWidth(8) : responsiveWidth(6),
                    width: currentRoute === 'GoalPlanDashboard' ? responsiveWidth(8) : responsiveWidth(6),
                    tintColor: currentRoute === 'GoalPlanDashboard' ? colors.primary : colors.Hard_White
                  }}
                />
              )}
              label={({ }) => (
                <CusText bold={currentRoute === 'GoalPlanDashboard' ? true : false} customStyles={{ marginLeft: responsiveWidth(0) }} color={currentRoute === 'GoalPlanDashboard' ? colors.primary : colors.Hard_White} size={currentRoute === 'GoalPlanDashboard' ? 'N' : 'SS'} style={styles.menuTextstyle} text="Goal Planning" />
              )}
              onPress={() => {
                props.navigation.navigate('Main', {
                  screen: 'Tabs',
                  params: { screen: 'GoalPlanDashboard' }
                });
              }}
            />
            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[
                colors.Hard_White,
                colors.Hard_White,
                colors.Hard_White,
              ]}
              style={{ width: "90%", alignSelf: 'center', height: 0.5, opacity: 0.2 }}
            ></LinearGradient>
          </Wrapper>
          <Wrapper color={currentRoute === 'RiskProfile' ? colors.Hard_White : colors.primary}>
            <DrawerItem
              icon={({ focused }) => (
                <Image
                  source={require('../../../assets/Images/RiskProfile.png')}
                  style={{
                    height: currentRoute === 'RiskProfile' ? responsiveWidth(8) : responsiveWidth(6),
                    width: currentRoute === 'RiskProfile' ? responsiveWidth(8) : responsiveWidth(6),
                    tintColor: currentRoute === 'RiskProfile' ? colors.primary : colors.Hard_White,
                  }}
                />
              )}
              label={({ }) => (
                <CusText bold={currentRoute === 'RiskProfile' ? true : false} customStyles={{ marginLeft: responsiveWidth(0) }} color={currentRoute === 'RiskProfile' ? colors.primary : colors.Hard_White} size={currentRoute === 'RiskProfile' ? 'N' : 'SS'} style={styles.menuTextstyle} text="Risk Profile" />
              )}
              onPress={() => {
                props.navigation.navigate('Main', {
                  screen: 'Tabs',
                  params: { screen: 'RiskProfile' }
                });
              }}
            />
            {/* <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[
                colors.Hard_White,
                colors.Hard_White,
                colors.Hard_White,
              ]}
              style={{ width: "90%", alignSelf: 'center', height: 0.5, opacity: 0.2 }}
            ></LinearGradient> */}
          </Wrapper>
          {/* </View> */}
          {/* <View style={[styles.menuItem, { borderColor: colors.gray }]}> */}
          {/* <View style={styles.iconSet}></View> */}
          {/*  <Wrapper>
            <DrawerItem
              icon={({ }) => (
                <IonIcon
                  name="golf"
                  color={colors.white}
                  size={responsiveWidth(7)}
                // style={styles.menuIcon}
                />
              )}
              label={({ }) => (
                <CusText customStyles={{ marginLeft: responsiveWidth(4) }} color={colors.white} size='N' style={styles.menuTextstyle} text="Scheme Edit" />
              )}
              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('SchemeEdit');
              }}
            />
            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[
                colors.transparent,
                colors.Hard_White,
                colors.transparent,
              ]}
              style={{ width: "100%", height: 1, opacity: 0.5 }}
            ></LinearGradient>
          </Wrapper> */}
          {/* <Wrapper>
            <DrawerItem
              icon={({ }) => (
                <IonIcon
                  name="power-outline"
                  color={colors.white}
                  size={responsiveWidth(7)}
                // style={styles.menuIcon}
                />
              )}
              label={({ }) => (
                <CusText customStyles={{ marginLeft: responsiveWidth(4) }} color={colors.white} size='N' style={styles.menuTextstyle} text="Logout" />
              )}
              onPress={() => {
                // props.navigation.navigate("Tabs");
                // props.navigation.navigate('RiskProfile');
                setAlertVisible(true);
              }}
            />
          </Wrapper>
            */}
          {/* </View> */}
        </DrawerContentScrollView>


        {/* <Alert
          AlertVisible={AlertVisible}
          setAlertVisible={(value: any) => setAlertVisible(value)}
          alertMsgType="signOut"
          AlertMsg={'Are you sure want to Logout?'}
          navigation={props.navigation}
        /> */}
        <CommonModal
          visible={AlertVisible}
          onClose={() => { setAlertVisible(false) }}
          iconName="power-outline"
          iconColor={colors.red}
          iconSize={responsiveWidth(20)}
          title="Log Out"
          // description={`Would You Like to create new activity ? if yes choose "Create New", it will mark previous activity as "Complete".`}
          description={`Are you sure want to Logout?`}
          button1Text="Stay"
          onButton1Press={() => {
            setAlertVisible(false)
          }}
          button2Text="Yes"
          onButton2Press={async () => { await signOut(setloggingOut); }}

        />
        <Alert
          AlertVisible={tokenExpiredToggles}
          setAlertVisible={(value: any) => tokenExpiredflagChange(false)}
          onConfirm={() => { submit() }}
          alertMsgType={'SessionExpired'}
          AlertMsg={'Your Session is expired, Please login again'}
        />
      </Container>
      <Wrapper width={'100%'} customStyles={{ paddingHorizontal: responsiveWidth(0) }} color={colors.primary}>
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[
            colors.Hard_White,
            colors.Hard_White,
            colors.Hard_White,
          ]}
          style={{ width: "100%", alignSelf: 'center', height: 0.5, opacity: 0.2 }}
        ></LinearGradient>
        <DrawerItem
          icon={({ }) => (
            <IonIcon
              name="power-outline"
              color={colors.white}
              size={responsiveWidth(7)}
            // style={styles.menuIcon}
            />
          )}
          label={({ }) => (
            <CusText customStyles={{ marginLeft: responsiveWidth(0) }} color={colors.white} size='N' style={styles.menuTextstyle} text="Logout" />
          )}

          onPress={() => {
            // props.navigation.navigate("Tabs");
            // props.navigation.navigate('RiskProfile');
            setAlertVisible(true);
          }}
        />
      </Wrapper>

      {/* <Wrapper
        width={'100%'}
        position="end"
        justify="center"
        align="center"
        customStyles={styles.bottom}
        color={colors.background}>
        <CusButton
          textcolor={colors.Hard_White}
          title="Logout"
          position="center"
          radius={50}
          width={150}
          onPress={() => {
            setAlertVisible(true);
          }}
          iconName={'log-out-outline'}
          customStyle={{ paddingRight: 15 }}
        />
      </Wrapper> */}
    </>
  );
}

const styles = StyleSheet.create({
  profile: {
    borderRadius: borderRadius.medium,
    height: responsiveWidth(12),
    width: responsiveWidth(12),
    marginRight: responsiveWidth(3),
    backgroundColor: colors.HARD_WHITE,
  },
  user: {
    fontFamily: fontFamily.semiBold,
  },
  logo: {
    width: responsiveWidth(21),
    resizeMode: 'contain',
    height: responsiveHeight(9.6),
  },
  iconSet: {
    width: '20%',
    height: '100%',
    // borderRadius: borderRadius.inputRadius,
    // backgroundColor: colors.lightGray,
    position: 'absolute',
    left: '5%',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  menuTextstyle: {
    fontFamily: fontFamily.semiBold,
    color: colors.white,
  },
  menuItem: {
    position: 'relative',
    // borderBottomWidth: 1,
    // borderStyle: 'solid',
  },
  menuIcon: {
    // marginLeft: responsiveWidth(4),
    width: 24,
    fontSize: 24,
  },
  icon: {
    color: colors.darkGray,
    fontSize: fontSize.large,
  },
  logout: {
    borderRadius: borderRadius.medium,
    width: responsiveWidth(50),
    marginLeft: responsiveWidth(10),
    marginTop: spaceVertical.small,
  },
  bottom: {
    paddingBottom:
      Platform.OS === 'ios' ? spaceVertical.small : spaceVertical.small,
  },
});
