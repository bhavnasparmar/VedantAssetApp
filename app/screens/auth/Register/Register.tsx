import React, {useContext, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import {AppearanceContext} from '../../../context/appearanceContext';
import {borderRadius, fontSize, responsiveHeight, responsiveWidth} from '../../../styles/variables';
import CusButton from '../../../ui/custom-button';
import CusText from '../../../ui/custom-text';
import InputField from '../../../ui/InputField';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';

import {toastTypes} from '../../../constant/constants';
import {AuthContext} from '../../../context/AuthContext';
import {showToast} from '../../../services/toastService';
import {styles} from './RegisterStyle';
import {REGEX} from '../../../utils/Commanutils';
import {regularLogin, userRegiter} from '../../../api/authapi';
import CheckBox from '../../../ui/check-box';
import Container from '../../../ui/container';

const Signup = () => {
  const {colors}: any = React.useContext(AppearanceContext);
  const navigation: any = useNavigation();
  const {signUp}: any = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [mobileError, setMobileError] = useState<boolean>(false);
  const [emailerror, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [conPasswordError, setConPasswordError] = useState<boolean>(false);

  const input1: any = useRef<null | TextInput>();
  const input2: any = useRef<null | TextInput>();
  const input3: any = useRef<null | TextInput>();
  const input4: any = useRef<null | TextInput>();
  const [Form, setForm] = useState({
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    isPartner: false,
  });
  const isFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setForm({
          email: '',
          mobile: '',
          password: '',
          confirmPassword: '',
          isPartner: false,
        });
        setEmailError(false);
        setMobileError(false);
        setPasswordError(false);
        setConPasswordError(false);
      };
    }, [isFocused]),
  );

  const onSubmit = async () => {
    setloading(true);
    Keyboard.dismiss();
    if (!Form.email && !Form.password && !Form.mobile) {
      showToast(toastTypes.info, 'All fields are required');
      setloading(false);
      return;
    } else if (!REGEX.email.test(Form.email)) {
      setEmailError(true);
      setloading(false);
      return;
    } else if (!REGEX.mobile.test(Form.mobile)) {
      setMobileError(true);
      setloading(false);
      return;
    } else if (!Form.password) {
      setPasswordError(true);
      setloading(false);
      return;
    } else if (!Form.confirmPassword) {
      setConPasswordError(true);
      setloading(false);
      return;
    } else if (Form.password != Form.confirmPassword) {
      setConPasswordError(true);
      setloading(false);
      return;
    }
    let reqData = {
      email: Form.email,
      mobile: Number(Form.mobile),
      password: Form.password,
      isPartner: false,
    };
    try {
      const [result, error]: any = await userRegiter(reqData);
      console.log('result-------', result);
      if (result != null) {
        setloading(false);
        navigation.navigate('Otp', {registerData: result?.data,registerFlag : true});
      } else {
        console.log('error--------', error);
        setloading(false);
        if (error.msg) {
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : responsiveHeight(25)}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{justifyContent: 'center', minHeight: '100%'}}>
             <Container Xcenter bgcolor={colors.Hard_White}>
          <Wrapper customStyles={{flex: 1, justifyContent: 'center'}}>
             <Spacer y="S" />
            <Wrapper
              position="center"
              align="center"
              width={responsiveWidth(100)}>
              <CusText
                title
                text="Get Started!"
                size="L"
               color={colors.secondary}
              />
              <Spacer y="XS" />
              <CusText
                text="For beginners, simple investing in diversified portfolios can minimize risk and increase long-term returns."
                size="SS"
                customStyles={styles.subtitle}
                position="center"
                color={colors.placeholderColor}
              />
            </Wrapper>
            <Spacer y="S" />
            <Wrapper position="center" customStyles={{gap:responsiveWidth(7)}}>
              <InputField
                label="Email"
                width={responsiveWidth(90)}
                placeholder="Enter Your Email"
                value={Form?.email}
                onChangeText={(value: string) => {
                  if (value) {
                    setEmailError(false);
                  }
                  setForm({
                    ...Form,
                    email: value,
                  });
                }}
                fieldViewStyle={{
                  height: responsiveWidth(11),
                  borderRadius: borderRadius.normal,
                }}
                borderColor={colors.placeholderColor}
                suffixIcon={'mail-outline'}
                suffixColor={colors.placeholderColor}
                suffixArea={30}
                error={
                  emailerror
                    ? Form?.email
                      ? 'Enter valid Email'
                      : 'Please enter Email'
                    : null
                }
                ref={input1}
                onSubmitEditing={() => input2.current.focus()}
                returnKeyType="next"
                keyboardType="email-address"
              />
              <InputField
                label="Mobile No."
                width={responsiveWidth(90)}
                placeholder="Enter Your Phone No."
                value={Form?.mobile}
                onChangeText={(value: string) => {
                  if (value) {
                    setMobileError(false);
                  }
                  setForm({
                    ...Form,
                    mobile: value,
                  });
                }}
                 fieldViewStyle={{
                  height: responsiveWidth(11),
                  borderRadius: borderRadius.normal,
                }}
                borderColor={colors.placeholderColor}
                suffixIcon={'call-outline'}
                suffixColor={colors.placeholderColor}
                suffixArea={30}
                error={
                  mobileError
                    ? Form?.mobile
                      ? 'Enter valid Mobile'
                      : 'Please enter Mobile'
                    : null
                }
                ref={input2}
                onSubmitEditing={() => input3.current.focus()}
                returnKeyType="next"
                maxLength={10}
                keyboardType="number-pad"
              />
              <InputField
                label="Password"
                width={responsiveWidth(90)}
                placeholder={'Enter your Password'}
                value={Form?.password}
                onChangeText={(value: string) => {
                  if (value) {
                    setPasswordError(false);
                  }
                  setForm({
                    ...Form,
                    password: value,
                  });
                }}
                 fieldViewStyle={{
                  height: responsiveWidth(11),
                  borderRadius: borderRadius.normal,
                }}
                password
                borderColor={colors.placeholderColor}
                suffixColor={colors.placeholderColor}
                suffixArea={30}
                error={passwordError ? 'Please enter Password' : null}
                ref={input3}
                onSubmitEditing={() => input4.current.focus()}
                returnKeyType="next"
              />
              <InputField
                label="Confirm Password"
                width={responsiveWidth(90)}
                placeholder={'Enter your confirm password'}
                value={Form?.confirmPassword}
                 fieldViewStyle={{
                  height: responsiveWidth(11),
                  borderRadius: borderRadius.normal,
                }}
                onChangeText={(value: string) => {
                  if (value) {
                    setConPasswordError(false);
                  }
                  setForm({
                    ...Form,
                    confirmPassword: value,
                  });
                }}
                password
                borderColor={colors.placeholderColor}
                suffixColor={colors.placeholderColor}
                suffixArea={30}
                error={
                  conPasswordError
                    ? Form?.confirmPassword
                      ? 'Passwords do not match'
                      : 'Please enter Confirm Password'
                    : null
                }
                ref={input4}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  onSubmit();
                }}
                returnKeyType="done"
              />
            </Wrapper>
            <Spacer y="N" />
            <Wrapper
              width={responsiveWidth(90)}
              position="center"
              row
              justify="left">
              <Wrapper row align='center'>
                <CheckBox
                  label={''}
                  value={Form.isPartner}
                  onChange={() => {
                    setForm({...Form, isPartner: !Form.isPartner});
                  }}
                  
                />
                <Spacer x='XXS' />
                <TouchableOpacity
                  onPress={() => {
                    setForm({...Form, isPartner: !Form.isPartner});
                  }}>
                  <CusText
                    text={'Sign me up as Partner'}
                    color={colors.darkGray}
                    size="SS"
                    position="center"
                    title
                  />
                </TouchableOpacity>
              </Wrapper>
              {/* <Wrapper>
                <TouchableOpacity onPress={() => {}}>
                  <CusText
                    text={'Forget password?'}
                    color={colors.secondary}
                    size="N"
                    position="center"
                    title
                  />
                </TouchableOpacity>
              </Wrapper> */}
            </Wrapper>
            <Spacer y="S" />
 {/* <CusText position='center' bold color={colors.Hard_White} text={'LOGIN'} /> */}
            <CusButton
              loading={loading}
              width={responsiveWidth(80)}
              height={responsiveWidth(10)}
              title="SIGN UP"
              textSize="SS"
              position="center"
              textWeight='bold'
             color={colors.secondary}
            //  buttonStyle={{borderWidth: 1, borderColor: colors.btnBorder}}
              radius={borderRadius.middleSmall}
              onPress={() => {
                onSubmit();
              }}
            />
          
          </Wrapper>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Signup;
