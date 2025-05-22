//#region Imports
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Appearance, NativeModules, Platform,  StatusBar, View} from 'react-native';
import {AppearanceContext} from './app/context/appearanceContext';
import {AuthContext} from './app/context/AuthContext';
import Login from './app/screens/auth/login/login';
import Register from './app/screens/auth/Register/Register';
import {_DarkTheme, _LightTheme} from './app/services/colorThemeService';
import {colors, darkColors, fontFamily, fontSize} from './app/styles/variables';
import SideDrawer from './app/shared/navigation/Drawer/Drawer';
import {BaseToast} from 'react-native-toast-message/lib/src/components/BaseToast';
import {ErrorToast} from 'react-native-toast-message/lib/src/components/ErrorToast';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {endPoints, TOKEN_PREFIX, USER_DATA} from './app/utils/Commanutils';
import {showToast} from './app/services/toastService';
import {toastTypes} from './app/constant/constants';
import NetInfo from '@react-native-community/netinfo';
import KycList from './app/screens/auth/kyc/kyclist/kyc';
import PancardVerify from './app/screens/auth/pancardverify/pancardverify';
import Kycvarification from './app/screens/auth/kycverification/kycvarification';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {persistor, store} from './app/Redux/Store';
import {PersistGate} from 'redux-persist/integration/react';
import TabviewLogin from './app/screens/auth/tabviewLogin/tabviewLogin';
import CheckNetworkModal from './app/shared/components/CheckNetworkModal/CheckNetworkModal';
import Passwordrecovery from './app/screens/auth/passwordrecovery/passwordrecovery';
import API from './app/utils/API';
import Otp from './app/screens/auth/Otp/Otp';
import SplashScreen from 'react-native-splash-screen';
import {localStorageKeys} from './app/services/localStorageService';

const {RootCheckModule} = NativeModules;
const RootStack = createNativeStackNavigator();
const options = {
  headerShown: false,
};

const authstack = () => (
  <RootStack.Navigator screenOptions={options} initialRouteName="TabviewLogin">
    <RootStack.Screen name="TabviewLogin" component={TabviewLogin} />
    {/* <RootStack.Screen name="Register" component={Register} /> */}
    <RootStack.Screen name="KycList" component={KycList} />
    <RootStack.Screen name="Kycvarification" component={Kycvarification} />
    <RootStack.Screen name="PancardVerify" component={PancardVerify} />
    <RootStack.Screen name="Passwordrecovery" component={Passwordrecovery} />
    <RootStack.Screen name="Otp" component={Otp} />
  </RootStack.Navigator>
);

export default function App() {
  const [internet, setInternet] = React.useState(false);
  const [mode, setmode] = React.useState(Appearance.getColorScheme());
  const [NetworkModal, setNetworkModal] = useState(false);
  const LIGHT = 'light';
  const [loginnavigation, setloginnavigation] = useState<boolean>(true);
  React.useEffect(() => {
    checkMode();
    const unsubscribe = NetInfo.addEventListener(state =>
      setNetworkModal(!state.isConnected),
    );
    setTimeout(() => {
      appUser();
      SplashScreen.hide();
    }, 2000);
    return () => {
      unsubscribe();
    };
  }, []);
  const checkMode = async () => {
    try {
      Appearance.addChangeListener((res: any) => {
        setmode(res.colorScheme);
      });
    } catch (error) {
      // console.log(error, 'while fetching apperance');
    }
  };

  const appUser = async () => {
    try {
      let initialRoute = 'Home';
      const token = await AsyncStorage.getItem(localStorageKeys.TOKEN_PREFIX);
      // console.log("company dataaaaaaaaa", companyData);
      // dispatch({
      //   type: 'RESTORE_TOKEN',
      //   token: token,
      //   isCompanyConfigured: !!companyData,
      //   initialRoute,
      // });
      dispatch({
        type: 'RESTORE_TOKEN',
        userToken: token,
        initialRoute: 'Home',
        //initialRoute,
        isLoading: false,
        isSignout: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        text1NumberOfLines={40}
        text2NumberOfLines={4}
        style={{
          borderLeftColor: colors.green,
          backgroundColor: colors.Hard_White,
        }}
        text1Style={{
          fontSize: fontSize.normal,
          fontFamily: fontFamily.regular,
          color: colors.Hard_Black,
        }}
        text2Style={{
          fontSize: fontSize.small,
          fontFamily: fontFamily.regular,
          color: colors.Hard_Black,
        }}
      />
    ),

    info: (props: any) => (
      <BaseToast
        {...props}
        text1NumberOfLines={40}
        text2NumberOfLines={4}
        style={{
          borderLeftColor: colors.goldenYellow,
          backgroundColor: colors.Hard_White,
        }}
        text1Style={{
          fontSize: fontSize.normal,
          fontFamily: fontFamily.regular,
          color: colors.Hard_Black,
        }}
      />
    ),

    error: (props: any) => (
      <ErrorToast
        {...props}
        text1NumberOfLines={40}
        text2NumberOfLines={4}
        style={{
          borderLeftColor: colors.red,
          backgroundColor: colors.Hard_White,
        }}
        text1Style={{
          fontSize: fontSize.normal,
          fontFamily: fontFamily.medium,
          color: colors.Hard_Black,
        }}
        text2Style={{
          fontSize: fontSize.small,
          fontFamily: fontFamily.regular,
          color: colors.Hard_Black,
        }}
      />
    ),
  };

  const [state, dispatch] = React.useReducer(
    (prevstate: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevstate,
            userToken: action.userToken,
            initialRoute: action.initialRoute,
            isLoading: false,
            isSignout: false,
            userData: action?.user,
          };

        case 'SIGN_UP':
          return {
            ...prevstate,
            isSignout: false,
            userToken: null,
            initialRoute: action.data.initialRoute,
            userData: null,
          };

        case 'SIGN_IN':
          return {
            ...prevstate,
            isSignout: false,
            userToken: action.data.token,
            initialRoute: action.data.initialRoute,
            userData: action?.user,
          };
        case 'WELCOME_USER':
          return {
            ...prevstate,
            isSignout: false,
            userToken: null,
            initialRoute: action.data.initialRoute,
            userData: null,
          };
        case 'SIGN_OUT':
          return {
            ...prevstate,
            userToken: null,
            isSignout: true,
            userData: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      initialRoute: 'Auth',
      notverified: false,
      userToken: null,
      userData: null,
    },
  );

  const authContext = React.useMemo(
    () => ({
      welcomeUser: async () => {
        try {
        } catch (error: any) {}
      },
      signIn: async (data: any) => {
        console.log("data", data);
        try {
          await AsyncStorage.setItem(TOKEN_PREFIX, data?.token);
          await AsyncStorage.setItem(USER_DATA, JSON.stringify(data?.user));

          showToast(toastTypes.success, 'Login SuccessFully');

          let initialRoute = 'App';
          dispatch({
            type: 'SIGN_IN',
            initialRoute: initialRoute,
            data: {token: data?.token},
          });
          return [null, null];
        } catch (error: any) {
          console.log(error);
          return [null, error];
        }
      },
      // RegisterOtpVerify: async (data: any) => {
      //   try {
      //     const result = await API.post('app-user/login', data);
      //     const res = result?.data?.data;
      //     await AsyncStorage.setItem(TOKEN_PREFIX, res?.token);
      //     await AsyncStorage.setItem(USER_DATA, JSON.stringify(res?.user));
      //     showToast(`${toastTypes.success}`, 'Login Successfully');
      //     let initialRoute = 'Auth';
      //     dispatch({
      //       type: 'SIGN_UP',
      //       data: {initialRoute},
      //     });
      //     return [result, null];
      //   } catch (error: any) {
      //     console.log(error);
      //     return [null, error];
      //   }
      // },

      signUp: async (data: any) => {
        return API.post(endPoints.register, data);
      },
      registerOtpVerify: (data: any) => {
        let initialRoute = 'App';
        dispatch({
          type: 'SIGN_IN',
          initialRoute: initialRoute,
          data: {token: null},
        });
      },
      signOut: async (setloggingOut: any) => {
        try {
          AsyncStorage.clear();
          dispatch({
            type: 'SIGN_OUT',
          });
          //console.log('************logout*************');
        } catch (e) {
          console.log('Error while logout', e);
        } finally {
          setloggingOut(false);
        }
      },
    }),
    [],
  );

  return (
    <>
      {/* <SafeAreaView style={{flex: 1}}> */}
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,}}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthContext.Provider value={authContext}>
              <AppearanceContext.Provider
                value={{
                  colors: mode == LIGHT ? colors : darkColors,
                  setloginnavigation,
                  loginnavigation,
                }}>
                <NavigationContainer
                  theme={mode === LIGHT ? _LightTheme : _DarkTheme}>
                  <RootStack.Navigator screenOptions={options}>
                    {/* <RootStack.Screen name="Auth" component={authstack} /> */}
                    {state?.userToken != null ? (
                      <RootStack.Screen name="App" component={SideDrawer} />
                    ) : (
                      <RootStack.Screen name="Auth" component={authstack} />
                    )}

                    {/* <RootStack.Screen name="App" component={SideDrawer} /> */}
                  </RootStack.Navigator>
                </NavigationContainer>
              </AppearanceContext.Provider>
            </AuthContext.Provider>
            <Toast config={toastConfig} />
            <CheckNetworkModal Visible={NetworkModal} />
          </PersistGate>
        </Provider>
    </SafeAreaView>
    </SafeAreaProvider>
    </>
  );
  //  return (
  //   <>
  //     <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: '#FFFFFF',
  //         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  //       }}>
  //       <Provider store={store}>
  //         <PersistGate loading={null} persistor={persistor}>
  //           <AuthContext.Provider value={authContext}>
  //             <AppearanceContext.Provider
  //               value={{
  //                 colors: mode === LIGHT ? colors : darkColors,
  //                 setloginnavigation,
  //                 loginnavigation,
  //               }}>
  //               <NavigationContainer theme={mode === LIGHT ? _LightTheme : _DarkTheme}>
  //                 <RootStack.Navigator screenOptions={options}>
  //                   {state?.userToken != null ? (
  //                     <RootStack.Screen name="App" component={SideDrawer} />
  //                   ) : (
  //                     <RootStack.Screen name="Auth" component={authstack} />
  //                   )}
  //                 </RootStack.Navigator>
  //               </NavigationContainer>
  //             </AppearanceContext.Provider>
  //           </AuthContext.Provider>
  //           <Toast config={toastConfig} />
  //           <CheckNetworkModal Visible={NetworkModal} />
  //         </PersistGate>
  //       </Provider>
  //     </View>
  //   </>
  // );

}
