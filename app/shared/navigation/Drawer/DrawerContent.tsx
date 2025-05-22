import {
  DrawerContentScrollView,
  DrawerItem,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
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
import CommonModal from '../../components/CommonModal/commonModal';
import { AuthContext } from '../../../context/AuthContext';
import Alert from '../../components/Alert/Alert';
import {
  getTokenExpiredflagChange,
  tokenExpiredflagChange,
} from '../../../utils/Commanutils';
import { useSelector } from 'react-redux';

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
      <Container contentWidth="100%">
        <DrawerContentScrollView
          style={{ paddingTop: 0 }}
          contentContainerStyle={{ paddingTop: 30 }}>
          <View style={[styles.menuItem, { borderColor: colors.gray }]}>
            {/* <View style={styles.iconSet}></View> */}
            <DrawerItem
              icon={({ }) => (
                <IonIcon
                  name="home"
                  color={colors.black}
                  size={19}
                  style={styles.menuIcon}
                />
              )}
              label={({ }) => (
                <CusText style={styles.menuTextstyle} text="Dashboard" />
              )}
              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('Dashboard');
              }}
            />
          </View>
          <View style={[styles.menuItem, { borderColor: colors.gray }]}>
            {/* <View style={styles.iconSet}></View> */}
            <DrawerItem
              icon={({ }) => (
                <IonIcon
                  name="lock-closed"
                  color={colors.black}
                  size={19}
                  style={styles.menuIcon}
                />
              )}
              label={({ }) => (
                <CusText style={styles.menuTextstyle} text="ChangePassword" />
              )}
              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('ChangePassword');
              }}
            />
          </View>
          <View style={[styles.menuItem, { borderColor: colors.gray }]}>
            {/* <View style={styles.iconSet}></View> */}
            <DrawerItem
              icon={({ }) => (
                <IonIcon
                  name="golf"
                  color={colors.black}
                  size={19}
                  style={styles.menuIcon}
                />
              )}
              label={({ }) => (
                <CusText style={styles.menuTextstyle} text="Goal Planning" />
              )}
              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('GoalPlanDashboard');
              }}
            />
          </View>
          <View style={[styles.menuItem, { borderColor: colors.gray }]}>
            {/* <View style={styles.iconSet}></View> */}
            <DrawerItem
              icon={({ }) => (
                <IonIcon
                  name="speedometer"
                  color={colors.black}
                  size={19}
                  style={styles.menuIcon}
                />
              )}
              label={({ }) => (
                <CusText style={styles.menuTextstyle} text="Risk Profile" />
              )}
              onPress={() => {
                // props.navigation.navigate("Tabs");
                props.navigation.navigate('RiskProfile');
              }}
            />
          </View>
        </DrawerContentScrollView>
        <Alert
          AlertVisible={AlertVisible}
          setAlertVisible={(value: any) => setAlertVisible(value)}
          alertMsgType="signOut"
          AlertMsg={'Are you sure want to Logout?'}
          navigation={props.navigation}
        />
        <Alert
          AlertVisible={tokenExpiredToggles}
          setAlertVisible={(value: any) => tokenExpiredflagChange(false)}
          onConfirm={() => { submit() }}
          alertMsgType={'SessionExpired'}
          AlertMsg={'Your Session is expired, Please login again'}
        />
      </Container>

      <Wrapper
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
      </Wrapper>
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
    color: colors.darkGray,
  },
  menuItem: {
    position: 'relative',
    borderBottomWidth: 1,
    borderStyle: 'solid',
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
