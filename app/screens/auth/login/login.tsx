import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Wrapper from '../../../ui/wrapper';
import Spacer from '../../../ui/spacer';
import CusText from '../../../ui/custom-text';
import {
  borderRadius,
  fontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../styles/variables';
import InputField from '../../../ui/InputField';
import React, {useContext, useRef, useState} from 'react';
import {AppearanceContext} from '../../../context/appearanceContext';
import Container from '../../../ui/container';
import CusButton from '../../../ui/custom-button';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {AuthContext} from '../../../context/AuthContext';
import {showToast} from '../../../services/toastService';
import {toastTypes} from '../../../constant/constants';
import DeviceInfo from 'react-native-device-info';
import {regularLogin, regularLoginWithOtp} from '../../../api/authapi';

const Login = () => {
  const {colors}: any = React.useContext(AppearanceContext);
  const navigation: any = useNavigation();
  const {signIn}: any = useContext(AuthContext);
  const [loginloading, setloginloading] = useState(false);
  const [Otploading, setOtploading] = useState(false);
  const [emailerror, setemailerror] = useState(false);
  const [passworderror, setpassworderror] = useState(false);
  const [passError, setpassError] = useState<boolean>(false);
  const input1: any = useRef<null | TextInput>();
  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const CRED = {
    email: 'bhavna@yopmail.com',
    password: '123456',
  };

  const [Form, setForm] = useState(CRED);
  const isFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setForm(CRED);
      };
    }, [isFocused]),
  );

  const onSubmit = async () => {
    // navigation.navigate('KycList');
    // return
    const fcmToken = 'fcmToken';
    // try {
    //   const fcmToken = 'fcmToken' //await firebase.messaging().getToken();
    // } catch (error) {}
    // //
    setloginloading(true);
    if (!Form.email && !Form.password) {
      showToast(toastTypes.info, 'All fields are required');
      setloginloading(false);
      return;
    } else if (!emailRegex.test(Form.email)) {
      setemailerror(true);
      setloginloading(false);
      return;
    } else if (!Form.password) {
      setpassworderror(true);
      setloginloading(false);
      return;
    }
    let loginData = {
      email: Form.email,
      password: Form.password,
      fcmToken: fcmToken,
      deviceId: await DeviceInfo.getUniqueId(),
    };
    try {
      const [result, error]: any = await regularLogin(loginData);

      if (result != null) {
        setloginloading(false);
        showToast(
          toastTypes.success,
          result?.msg ? result?.msg : 'Login Successfully',
        );
        signIn(result?.data);
      } else {
        if (error.msg) {
          setloginloading(false);
          showToast(`${toastTypes.error}`, error.msg);
        } else {
          showToast(`${toastTypes.error}`, error[0].msg);
        }
      }
    } catch (error) {
      console.log(error, 'testtdsgdjd');
    }
  };

  const onSubmitWithOTP = async () => {
    const fcmToken = 'fcmToken';
    setOtploading(true);
    if (!emailRegex.test(Form.email)) {
      setemailerror(true);
      setOtploading(false);
      return;
    }

    let loginData = {
      email: Form.email,
    };
    try {
      const [result, error]: any = await regularLoginWithOtp(loginData);
      console.log('regularLoginWithOtp result', result);
      if (result != null) {
        setOtploading(false);
        showToast(
          toastTypes.success,
          result?.msg ? result?.msg : 'Your OTP send successfully!',
        );
        navigation.navigate('Otp', {
          registerData: result?.data,
          isEmailOTPVerified: result?.data?.isEmailOTPVerified,
          isMobileOTPVerified: result?.data?.isMobileOTPVerified,
        });
        //signIn(result?.data);
      } else {
        if (error.msg) {
          setOtploading(false);
          showToast(`${toastTypes.error}`, error.msg);
        } else {
          showToast(`${toastTypes.error}`, error[0].msg);
        }
      }
    } catch (error) {
      console.log(error, 'testtdsgdjd');
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 40}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{justifyContent: 'center', minHeight: '100%'}}>
          <Container Xcenter>
            <Spacer y="L" />
            <Wrapper
              position="center"
              align="center"
              width={responsiveWidth(100)}>
              <CusText title text="Welcome" size="L" color={colors.secondary} />
            </Wrapper>
            <Spacer y="S" />
            <Wrapper position="center">
              <InputField
                label="Email"
                value={Form.email}
                width={responsiveWidth(90)}
                placeholder="Enter Your Email"
                onChangeText={(value: string) => {
                  if (value) {
                    setemailerror(false);
                  }
                  setForm({
                    ...Form,
                    email: value,
                  });
                }}
                keyboardType="email-address"
                borderColor={colors.placeholderColor}
                suffixIcon={'mail-outline'}
                suffixArea={30}
                suffixColor={colors.placeholderColor}
                onSubmitEditing={() => input1.current.focus()}
                error={
                  emailerror
                    ? Form.email
                      ? 'Please enter valid Email'
                      : 'Please enter Email'
                    : null
                }
              />
              <InputField
                label="Password"
                value={Form.password}
                width={responsiveWidth(90)}
                placeholder="Enter Your Password"
                onChangeText={(value: string) => {
                  if (value) {
                    setpassError(false);
                  }
                  setForm({
                    ...Form,
                    password: value,
                  });
                }}
                password
                //  borderColor={colors.gray}
                suffixColor={colors.placeholderColor}
                placeholderColor={colors.placeholderColor}
                suffixArea={30}
                returnKeyType="done"
                error={
                  passworderror && !Form.password
                    ? 'Please enter Password'
                    : null
                }
                ref={input1}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  onSubmit();
                }}
              />
            </Wrapper>
            <Spacer y="XXS" />
            <Wrapper align="end" width={responsiveWidth(90)}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  navigation.navigate('Passwordrecovery');
                }}>
                <CusText
                  text="Forgot Password?"
                  size="S"
                  color={colors.primary1}
                />
              </TouchableOpacity>
            </Wrapper>
            <Spacer y="N" />
            <CusButton
              loading={loginloading}
              width={responsiveWidth(90)}
              title="Login"
              color={colors.secondary}
              position="center"
              radius={borderRadius.medium}
              onPress={() => {
                onSubmit();
              }}
            />
            <Spacer y="S" />
            <Wrapper align="center" justify="center" row>
              <TouchableOpacity
                onPress={() => {
                  if (!Otploading) {
                    onSubmitWithOTP();
                  }
                }}>
                <CusText
                  text="Login with OTP "
                  size="S"
                  color={colors.primary}
                />
              </TouchableOpacity>
              {Otploading && (
                <Wrapper>
                  <ActivityIndicator
                    color={colors.primary}
                    size={fontSize.normal}
                  />
                </Wrapper>
              )}
            </Wrapper>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Login;
