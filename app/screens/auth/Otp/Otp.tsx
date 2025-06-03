import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, {useContext, useRef, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {regularLogin, resendOtp, userOtpVerify} from '../../../api/authapi';
import {toastTypes} from '../../../constant/constants';
import {AppearanceContext} from '../../../context/appearanceContext';
import {showToast} from '../../../services/toastService';
import {
  borderRadius,
  responsiveHeight,
  responsiveWidth,
} from '../../../styles/variables';
import Container from '../../../ui/container';
import CusButton from '../../../ui/custom-button';
import CusText from '../../../ui/custom-text';
import InputField from '../../../ui/InputField';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
import {styles} from './OtpStyles';
import DeviceInfo from 'react-native-device-info';
import {AuthContext} from '../../../context/AuthContext';

const Otp = ({route}: any) => {
  const {colors}: any = React.useContext(AppearanceContext);
  const navigation: any = useNavigation();
  // const navigation: any = useNavigation();
  const [Form, setForm] = useState({
    inputfeild1: '',
    inputfeild2: '',
    inputfeild3: '',
    inputfeild4: '',
    inputfeild5: '',
    inputfeild6: '',
  });
  const [Form2, setForm2] = useState({
    inputfeild1: '',
    inputfeild2: '',
    inputfeild3: '',
    inputfeild4: '',
    inputfeild5: '',
    inputfeild6: '',
  });
  const input1: any = useRef();
  const input2: any = useRef();
  const input3: any = useRef();
  const input4: any = useRef();
  const input5: any = useRef();
  const input6: any = useRef();
  const input01: any = useRef();
  const input02: any = useRef();
  const input03: any = useRef();
  const input04: any = useRef();
  const input05: any = useRef();
  const input06: any = useRef();
  const [inputError, setInputError] = useState(false);
  const [inputError2, setInputError2] = useState(false);
  const [loading, setloading] = useState(false);
  const isFocused = useIsFocused();
  const [Data, setData] = useState<any | null>(null);
  const {signIn, registerOtpVerify}: any = useContext(AuthContext);
  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.registerData) {
        setData(
          route?.params?.registerData ? route?.params?.registerData : null,
        );
      }

      return () => {
        setData(null);
        setForm({
          ...Form,
          inputfeild1: '',
          inputfeild2: '',
          inputfeild3: '',
          inputfeild4: '',
          inputfeild5: '',
          inputfeild6: '',
        });
        setForm2({
          ...Form2,
          inputfeild1: '',
          inputfeild2: '',
          inputfeild3: '',
          inputfeild4: '',
          inputfeild5: '',
          inputfeild6: '',
        });
      };
    }, [isFocused]),
  );

  const inputKeyPress = (e: any, prev: any, next: any, inputName: any) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (prev != '') {
        prev.current?.focus();
      }
    } else if (e.nativeEvent.key === '-' || e.nativeEvent.key === '.') {
    } else {
      if (next != '' && e.nativeEvent.key != '') {
        next.current?.focus();
      }
    }
  };
  const inputKeyPress2 = (e: any, prev: any, next: any, inputName: any) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (prev != '') {
        prev.current?.focus();
      }
    } else if (e.nativeEvent.key === '-' || e.nativeEvent.key === '.') {
    } else {
      if (next != '' && e.nativeEvent.key != '') {
        next.current?.focus();
      }
    }
  };

  const onSubmit = async () => {
    // console.log('')
    console.log(
      'route?.params?.registerData   submit-',
      route?.params?.registerData,
    );
    if (!route?.params?.registerData) {
      showToast(`${toastTypes.error}`, 'Reresgister your data');
      navigation.goBack();
      return;
    }
    let RegiterData = route?.params?.registerData;
    console.log('RegiterData---', RegiterData);
    if (
      !Form.inputfeild1 &&
      !Form.inputfeild2 &&
      !Form.inputfeild3 &&
      !Form.inputfeild4 &&
      !Form.inputfeild5 &&
      !Form.inputfeild6 &&
      !Form2.inputfeild1 &&
      !Form2.inputfeild2 &&
      !Form2.inputfeild3 &&
      !Form2.inputfeild4 &&
      !Form2.inputfeild5 &&
      !Form2.inputfeild6
    ) {
      showToast(toastTypes.info, 'All fields are required');
      setloading(false);
      return;
    } else if (
      !Form.inputfeild1 &&
      !Form.inputfeild2 &&
      !Form.inputfeild3 &&
      !Form.inputfeild4 &&
      !Form.inputfeild5 &&
      !Form.inputfeild6
    ) {
      setInputError(true);
      setloading(false);
      return;
    } else if (
      !Form2.inputfeild1 &&
      !Form2.inputfeild2 &&
      !Form2.inputfeild3 &&
      !Form2.inputfeild4 &&
      !Form2.inputfeild5 &&
      !Form2.inputfeild6
    ) {
      setInputError2(true);
      setloading(false);
      return;
    }

    setloading(true);

    let reqData = {
      email: Data?.email ? Data?.email : RegiterData?.email,
      mobile: Number(Data?.mobile ? Data?.mobile : RegiterData?.mobile),
      emailOTP: 
        ('' +
          Form.inputfeild1 +
          Form.inputfeild2 +
          Form.inputfeild3 +
          Form.inputfeild4 +
          Form.inputfeild5 +
          Form.inputfeild6)
      ,

      mobileOTP:
        '' +
          Form2.inputfeild1 +
          Form2.inputfeild2 +
          Form2.inputfeild3 +
          Form2.inputfeild4 +
          Form2.inputfeild5 +
          Form2.inputfeild6
      ,
    };
    setloading(true);
    console.log('reqData--', reqData);
    try {
      const [result, error]: any = await userOtpVerify(
        Data ? Data?.id : RegiterData?.id,
        reqData,
      );
      console.log('result----', result);
      if (result != null) {
        setloading(false);
        console.log('result');
        showToast(toastTypes?.success, 'OTP Verify Successfully');
        navigation.goBack();
        //registerOtpVerify(result?.data);
      } else {
        console.log('error', error);
        setloading(false);
        if (error?.msg) {
          showToast(`${toastTypes.error}`, error?.msg);
        } else {
          showToast(`${toastTypes.error}`, error[0]?.msg);
        }
      }
    } catch (error) {
      console.log(error, 'testtdsgdjd');
    }

    // try {
    //   setloading(false);
    //   showToast(`${toastTypes.success}`, 'User registered successfully!');
    //   navigation.navigate('Login');
    // } catch (error: any) {
    //   setloading(false);
    //   if (error[0]) {
    //     if (error[0]?.msg) {
    //       showToast(`${toastTypes.error}`, error[0]?.msg);
    //     }
    //   }
    // }
  };
  const onResendOTP = async () => {
    console.log(route?.params?.registerData);
    if (!route?.params?.registerData) {
      showToast(`${toastTypes.error}`, 'Reresgister your data');
      navigation.goBack();
      return;
    }
    let RegiterData = route?.params?.registerData;
    setloading(true);

    let reqData = {
      email: RegiterData?.email,
      isRegister: true,
    };
    setloading(true);
    console.log('reqData--', reqData);
    try {
      const [result, error]: any = await resendOtp(reqData);
      console.log('resendOtp result----', result);
      if (result != null) {
        setloading(false);
        showToast(`${toastTypes.success}`, result?.msg);
        setData(result?.data);
        //  navigation.navigate('Login')
      } else {
        console.log('error', error);
        setloading(false);
        if (error?.msg) {
          showToast(`${toastTypes.error}`, error?.msg);
        } else {
          showToast(`${toastTypes.error}`, error[0]?.msg);
        }
      }
    } catch (error) {
      console.log(error, 'testtdsgdjd');
    }
  };
  const onSubmitLoginOtp = async () => {
    console.log(route?.params?.registerData);
    if (!route?.params?.registerData) {
      showToast(`${toastTypes.error}`, 'Reresgister your data');
      navigation.goBack();
      return;
    }
    let RegiterData = route?.params?.registerData;
    console.log('RegiterData---', RegiterData);
    if (
      !Form.inputfeild1 &&
      !Form.inputfeild2 &&
      !Form.inputfeild3 &&
      !Form.inputfeild4 &&
      !Form.inputfeild5 &&
      !Form.inputfeild6 &&
      !Form2.inputfeild1 &&
      !Form2.inputfeild2 &&
      !Form2.inputfeild3 &&
      !Form2.inputfeild4 &&
      !Form2.inputfeild5 &&
      !Form2.inputfeild6
    ) {
      showToast(toastTypes.info, 'All fields are required');
      setloading(false);
      return;
    } else if (
      !Form.inputfeild1 &&
      !Form.inputfeild2 &&
      !Form.inputfeild3 &&
      !Form.inputfeild4 &&
      !Form.inputfeild5 &&
      !Form.inputfeild6
    ) {
      setInputError(true);
      setloading(false);
      return;
    }

    setloading(true);
    const fcmToken = 'fcmToken';

    let loginData = {
      email: Data?.email ? Data?.email : RegiterData?.email,
      loginOTP:
        '' +
          Form.inputfeild1 +
          Form.inputfeild2 +
          Form.inputfeild3 +
          Form.inputfeild4 +
          Form.inputfeild5 +
          Form.inputfeild6
      ,

      fcmToken: fcmToken,
      deviceId: await DeviceInfo.getUniqueId(),
    };
    try {
      const [result, error]: any = await regularLogin(loginData);
      console.log('regularLogin result----', result);
      if (result != null) {
        setloading(false);
        showToast(
          toastTypes.success,
          result?.msg ? result?.msg : 'Login Successfully',
        );
        signIn(result?.data);
      } else {
        if (error.msg) {
          setloading(false);
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 18}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{justifyContent: 'center', minHeight: '100%'}}>
          <Container Xcenter>
            <Wrapper align="center">
              <Image
                source={require('../../../assets/Images/logo_light.png')}
                style={{
                  height: responsiveHeight(15),
                  width: responsiveWidth(50),
                  resizeMode: 'contain',
                }}
              />
            </Wrapper>
            <Spacer y="S" />

            {route?.params?.registerData ? (
              <>
                <Wrapper
                  position="center"
                  align="center"
                  width={responsiveWidth(100)}>
                  <CusText text="OTP" size="L" bold color={colors.primary} />
                </Wrapper>
                <Spacer y="S" />
                <Wrapper
                  position="center"
                  align="center"
                  width={responsiveWidth(100)}>
                  <CusText
                    text="We have sent the verification code to your email address"
                    size="SS"
                    customStyles={styles.subtitle}
                    position="center"
                    color={colors.placeholderColor}
                  />
                </Wrapper>
                <Spacer y="S" />
                <Wrapper customStyles={{marginLeft: responsiveWidth(4)}}>
                  <CusText
                    text={
                      route?.params?.isEmailOTPVerified &&
                      route?.params?.isEmailOTPVerified
                        ? 'OTP'
                        : 'Email OTP'
                    }
                    size="S"
                    color={colors.black}
                  />
                </Wrapper>
                <Wrapper row justify="spEven">
                  <InputField
                    label=""
                    placeholder=""
                    keyboardType="numeric"
                    value={Form.inputfeild1}
                    maxLength={1}
                    bordered={true}
                    width={45}
                    textAlign={'center'}
                    ref={input1}
                    onKeyPress={e => {
                      inputKeyPress(e, '', input2, 'inputfeild1');
                    }}
                    onChangeText={value => {
                      if (value) {
                        setInputError(false);
                      }
                      setForm({
                        ...Form,
                        inputfeild1: value != '.' && value != '-' ? value : '',
                      });
                    }}
                    textContentType="oneTimeCode"
                  />

                  <InputField
                    label=""
                    placeholder=""
                    value={Form.inputfeild2}
                    maxLength={1}
                    keyboardType="numeric"
                    bordered={true}
                    width={45}
                    textAlign={'center'}
                    ref={input2}
                    onKeyPress={e => {
                      inputKeyPress(e, input1, input3, 'inputfeild2');
                    }}
                    onChangeText={value => {
                      if (value) {
                        setInputError(false);
                      }
                      setForm({
                        ...Form,
                        inputfeild2: value != '.' && value != '-' ? value : '',
                      });
                    }}
                    textContentType="oneTimeCode"
                  />
                  <InputField
                    label=""
                    placeholder=""
                    keyboardType="numeric"
                    value={Form.inputfeild3}
                    maxLength={1}
                    bordered={true}
                    width={45}
                    textAlign={'center'}
                    ref={input3}
                    onKeyPress={e => {
                      inputKeyPress(e, input2, input4, 'inputfeild3');
                    }}
                    onChangeText={value => {
                      if (value) {
                        setInputError(false);
                      }
                      setForm({
                        ...Form,
                        inputfeild3: value != '.' && value != '-' ? value : '',
                      });
                    }}
                    textContentType="oneTimeCode"
                  />
                  <InputField
                    label=""
                    placeholder=""
                    keyboardType="numeric"
                    value={Form.inputfeild4}
                    maxLength={1}
                    bordered={true}
                    width={45}
                    textAlign={'center'}
                    ref={input4}
                    onKeyPress={e => {
                      inputKeyPress(e, input3, input5, 'inputfeild4');
                    }}
                    onChangeText={value => {
                      if (value) {
                        setInputError(false);
                      }
                      setForm({
                        ...Form,
                        inputfeild4: value != '.' && value != '-' ? value : '',
                      });
                    }}
                    textContentType="oneTimeCode"
                  />
                  <InputField
                    label=""
                    placeholder=""
                    keyboardType="numeric"
                    value={Form.inputfeild5}
                    maxLength={1}
                    bordered={true}
                    width={45}
                    textAlign={'center'}
                    ref={input5}
                    onKeyPress={e => {
                      inputKeyPress(e, input4, input6, 'inputfeild5');
                    }}
                    onChangeText={value => {
                      if (value) {
                        setInputError(false);
                      }
                      setForm({
                        ...Form,
                        inputfeild5: value != '.' && value != '-' ? value : '',
                      });
                    }}
                    textContentType="oneTimeCode"
                  />
                  <InputField
                    label=""
                    placeholder=""
                    keyboardType="numeric"
                    value={Form.inputfeild6}
                    maxLength={1}
                    bordered={true}
                    width={45}
                    textAlign={'center'}
                    ref={input6}
                    onKeyPress={e => {
                      inputKeyPress(e, input5, '', 'inputfeild6');
                    }}
                    onChangeText={value => {
                      if (value) {
                        setInputError(false);
                      }
                      setForm({
                        ...Form,
                        inputfeild6: value != '.' && value != '-' ? value : '',
                      });
                    }}
                    textContentType="oneTimeCode"
                  />
                </Wrapper>
                <Spacer y="S" />
                {inputError == true ? (
                  <Wrapper row justify="center">
                    <CusText
                      size={'S'}
                      text={
                        inputError
                          ? (Form.inputfeild1 && Form.inputfeild2) ||
                            Form.inputfeild3 ||
                            Form.inputfeild4
                            ? 'Enter valid OTP'
                            : 'OTP is required'
                          : ''
                      }
                      error
                    />
                  </Wrapper>
                ) : null}

                {/* <Spacer y="S" /> */}
                {!(
                  route?.params?.isEmailOTPVerified &&
                  route?.params?.isEmailOTPVerified
                ) && (
                  <Wrapper customStyles={{marginLeft: responsiveWidth(4)}}>
                    <CusText text="Mobile OTP" size="S" color={colors.black} />
                  </Wrapper>
                )}
                {!(
                  route?.params?.isEmailOTPVerified &&
                  route?.params?.isEmailOTPVerified
                ) && (
                  <>
                    <Wrapper row justify="spEven">
                      <InputField
                        label=""
                        placeholder=""
                        keyboardType="numeric"
                        value={Form2.inputfeild1}
                        maxLength={1}
                        bordered={true}
                        width={45}
                        textAlign={'center'}
                        ref={input01}
                        onKeyPress={e => {
                          inputKeyPress2(e, '', input02, 'inputfeild1');
                        }}
                        onChangeText={value => {
                          if (value) {
                            setInputError2(false);
                          }
                          setForm2({
                            ...Form2,
                            inputfeild1:
                              value != '.' && value != '-' ? value : '',
                          });
                        }}
                        textContentType="oneTimeCode"
                      />

                      <InputField
                        label=""
                        placeholder=""
                        value={Form2.inputfeild2}
                        maxLength={1}
                        keyboardType="numeric"
                        bordered={true}
                        width={45}
                        textAlign={'center'}
                        ref={input02}
                        onKeyPress={e => {
                          inputKeyPress(e, input01, input03, 'inputfeild2');
                        }}
                        onChangeText={value => {
                          if (value) {
                            setInputError2(false);
                          }
                          setForm2({
                            ...Form2,
                            inputfeild2:
                              value != '.' && value != '-' ? value : '',
                          });
                        }}
                        textContentType="oneTimeCode"
                      />
                      <InputField
                        label=""
                        placeholder=""
                        keyboardType="numeric"
                        value={Form2.inputfeild3}
                        maxLength={1}
                        bordered={true}
                        width={45}
                        textAlign={'center'}
                        ref={input03}
                        onKeyPress={e => {
                          inputKeyPress2(e, input02, input04, 'inputfeild3');
                        }}
                        onChangeText={value => {
                          if (value) {
                            setInputError2(false);
                          }
                          setForm2({
                            ...Form2,
                            inputfeild3:
                              value != '.' && value != '-' ? value : '',
                          });
                        }}
                        textContentType="oneTimeCode"
                      />
                      <InputField
                        label=""
                        placeholder=""
                        keyboardType="numeric"
                        value={Form2.inputfeild4}
                        maxLength={1}
                        bordered={true}
                        width={45}
                        textAlign={'center'}
                        ref={input04}
                        onKeyPress={e => {
                          inputKeyPress2(e, input03, input05, 'inputfeild4');
                        }}
                        onChangeText={value => {
                          if (value) {
                            setInputError2(false);
                          }
                          setForm2({
                            ...Form2,
                            inputfeild4:
                              value != '.' && value != '-' ? value : '',
                          });
                        }}
                        textContentType="oneTimeCode"
                      />
                      <InputField
                        label=""
                        placeholder=""
                        keyboardType="numeric"
                        value={Form2.inputfeild5}
                        maxLength={1}
                        bordered={true}
                        width={45}
                        textAlign={'center'}
                        ref={input05}
                        onKeyPress={e => {
                          inputKeyPress2(e, input04, input06, 'inputfeild5');
                        }}
                        onChangeText={value => {
                          if (value) {
                            setInputError2(false);
                          }
                          setForm2({
                            ...Form2,
                            inputfeild5:
                              value != '.' && value != '-' ? value : '',
                          });
                        }}
                        textContentType="oneTimeCode"
                      />
                      <InputField
                        label=""
                        placeholder=""
                        keyboardType="numeric"
                        value={Form2.inputfeild6}
                        maxLength={1}
                        bordered={true}
                        width={45}
                        textAlign={'center'}
                        ref={input06}
                        onKeyPress={e => {
                          inputKeyPress2(e, input05, '', 'inputfeild6');
                        }}
                        onChangeText={value => {
                          if (value) {
                            setInputError2(false);
                          }
                          setForm2({
                            ...Form2,
                            inputfeild6:
                              value != '.' && value != '-' ? value : '',
                          });
                        }}
                        textContentType="oneTimeCode"
                      />
                    </Wrapper>
                    <Spacer y="S" />
                    {inputError2 == true ? (
                      <Wrapper row justify="center">
                        <CusText
                          size={'S'}
                          text={
                            inputError2
                              ? (Form2.inputfeild1 && Form2.inputfeild2) ||
                                Form2.inputfeild3 ||
                                Form2.inputfeild4
                                ? 'Enter valid OTP'
                                : 'OTP is required'
                              : ''
                          }
                          error
                        />
                      </Wrapper>
                    ) : null}
                  </>
                )}
              </>
            ) : null}
            <Spacer y="XS" />
            <Wrapper
              width={responsiveWidth(90)}
              position="center"
              row
              justify="right">
              <Wrapper>
                <TouchableOpacity
                  onPress={() => {
                    onResendOTP();
                  }}>
                  <CusText
                    text={'Resend OTP'}
                    color={colors.primary}
                    size="N"
                    position="right"
                    title
                  />
                </TouchableOpacity>
              </Wrapper>
            </Wrapper>
            <Spacer y="XS" />
            <Wrapper align="center">
              {route?.params?.isEmailOTPVerified &&
                route?.params?.isEmailOTPVerified && (
                  <CusText
                    text={` Otp :${
                      Data?.loginOTP
                        ? Data?.loginOTP
                        : route?.params?.registerData?.loginOTP
                    }`}
                  />
                )}

              {!(
                route?.params?.isEmailOTPVerified &&
                route?.params?.isEmailOTPVerified
              ) && (
                <CusText
                  text={`Email Otp :${
                    Data?.emailOTP
                      ? Data?.emailOTP
                      : route?.params?.registerData?.emailOTP
                  }`}
                />
              )}
              {!(
                route?.params?.isEmailOTPVerified &&
                route?.params?.isEmailOTPVerified
              ) && (
                <CusText
                  text={`Mobile OTP :${
                    Data?.mobileOTP
                      ? Data?.mobileOTP
                      : route?.params?.registerData?.mobileOTP
                  }`}
                />
              )}
            </Wrapper>

            <Spacer y="L" />

            <CusButton
              loading={loading}
              width={responsiveWidth(90)}
              title="Submit"
              position="center"
              radius={borderRadius.medium}
              onPress={() => {
                if (route?.params?.registerData) {
                  if (
                    !(
                      route?.params?.isEmailOTPVerified &&
                      route?.params?.isEmailOTPVerified
                    )
                  ) {
                    onSubmit();
                  } else {
                    onSubmitLoginOtp();
                  }
                } else {
                  navigation.navigate('ResetPassword');
                }

                //
              }}
            />
            <Spacer y="S" />
            <Wrapper>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <CusText
                  text={'Back To Login'}
                  color={colors.primary}
                  size="N"
                  position="center"
                  title
                />
              </TouchableOpacity>
            </Wrapper>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Otp;
