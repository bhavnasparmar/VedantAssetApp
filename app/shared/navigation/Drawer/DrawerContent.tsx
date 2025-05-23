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
  useEffect(() => {
    console.log("---", getTokenExpiredflagChange())
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
          style={{ paddingTop: 0 }}
          contentContainerStyle={{ paddingTop: responsiveWidth(5) }}>
          {/* <View style={[styles.menuItem, { borderColor: colors.gray }]}> */}
          {/* <View style={styles.iconSet}></View> */}
          <Wrapper>
            <DrawerItem
              icon={({ }) => (
                <IonIcon
                  name="home"
                  color={colors.white}
                  size={responsiveWidth(7)}
                // style={styles.menuIcon}
                />
              )}
              label={({ }) => (
                <CusText customStyles={{ marginLeft: responsiveWidth(4) }} color={colors.white} size='N' style={styles.menuTextstyle} text="Dashboard" />
              )}

              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('Dashboard');
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
          </Wrapper>
             <Wrapper>
            <DrawerItem
              icon={({ }) => (
                <IonIcon
                  name="cash"
                  color={colors.white}
                  size={responsiveWidth(7)}
                // style={styles.menuIcon}
                />
              )}
              label={({ }) => (
                <CusText customStyles={{ marginLeft: responsiveWidth(4) }} color={colors.white} size='N' style={styles.menuTextstyle} text="Fund Picker" />
              )}

              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('FundPicker');
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
          </Wrapper>

          {/* </View> */}
          {/* <View style={[styles.menuItem, { borderColor: colors.gray }]}> */}
          <Wrapper>
            {/* <View style={styles.iconSet}></View> */}
            <DrawerItem
              icon={({ }) => (
                <IonIcon
                  name="lock-closed"
                  color={colors.white}
                  size={responsiveWidth(7)}
                // style={styles.menuIcon}
                />
              )}
              label={({ }) => (
                <CusText customStyles={{ marginLeft: responsiveWidth(4) }} color={colors.white} size='N' style={styles.menuTextstyle} text="ChangePassword" />
              )}
              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('ChangePassword');
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
          </Wrapper>
          {/* </View> */}
          {/* <View style={[styles.menuItem, { borderColor: colors.gray }]}> */}
          <Wrapper>
            {/* <View style={styles.iconSet}></View> */}
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
                <CusText customStyles={{ marginLeft: responsiveWidth(4) }} color={colors.white} size='N' style={styles.menuTextstyle} text="Goal Planning" />
              )}
              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('GoalPlanDashboard');
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
          </Wrapper>
          {/* </View> */}

          {/* <View style={[styles.menuItem, { borderColor: colors.gray }]}> */}
          {/* <View style={styles.iconSet}></View> */}
          <Wrapper>
            <DrawerItem
              icon={({ }) => (
                <IonIcon
                  name="speedometer"
                  color={colors.white}
                  size={responsiveWidth(7)}
                // style={styles.menuIcon}
                />
              )}
              label={({ }) => (
                <CusText customStyles={{ marginLeft: responsiveWidth(4) }} color={colors.white} size='N' style={styles.menuTextstyle} text="Risk Profile" />
              )}
              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('RiskProfile');
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
          </Wrapper>
          {/* </View> */}
          {/* <View style={[styles.menuItem, { borderColor: colors.gray }]}> */}
          {/* <View style={styles.iconSet}></View> */}
          <Wrapper>
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
