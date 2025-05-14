import {
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
  responsiveHeight,
  responsiveWidth,
} from '../../../styles/variables';
import InputField from '../../../ui/InputField';
import React, { useContext, useRef, useState } from 'react';
import { AppearanceContext } from '../../../context/appearanceContext';
import Container from '../../../ui/container';
import CusButton from '../../../ui/custom-button';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';
import { showToast } from '../../../services/toastService';
import { toastTypes } from '../../../constant/constants';
import DeviceInfo from 'react-native-device-info';
import { forgotpassword, regularLogin } from '../../../api/authapi';

const Passwordrecovery = () => {
  const { colors }: any = React.useContext(AppearanceContext);
  const navigation: any = useNavigation();
  const { signIn }: any = useContext(AuthContext);
  const [loginloading, setloginloading] = useState(false);
  const [emailerror, setemailerror] = useState(false);
  const [passworderror, setpassworderror] = useState(false);
  const [passError, setpassError] = useState<boolean>(false);
  const input1: any = useRef<null | TextInput>();
  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const CRED = {
    email: '',
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
    setloginloading(true);
   if (!emailRegex.test(Form.email)) {
      setemailerror(true);
      setloginloading(false);
      return;
    } 
    let loginData = {
      email: Form.email,
    };
    try {
      const [result, error]: any = await forgotpassword(loginData);
       console.log("result----",result)
      if (result != null) {
        setloginloading(false);
        showToast(`${toastTypes.success}`, result?.msg || 'New Password Sent via Email');
        navigation.navigate('TabviewLogin')
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

  return (
    <>
     <Wrapper align='center'>
                <Image source={require('../../../assets/Images/logo_light.png')} style={{
                    height: responsiveHeight(15),
                    width: responsiveWidth(50),
                    resizeMode: 'contain'
                }} />
            </Wrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 40}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ justifyContent: 'center', minHeight: '100%' }}>
          <Container Xcenter>
           
            <Spacer y='L' />
            <Wrapper
              position="center"
              align="center"
              width={responsiveWidth(100)}>
              <CusText title text="Password Recovery" size="L" color={colors.secondary} />
            </Wrapper>
            <Spacer y="S" />
            <Wrapper position="center">
              <InputField
                label="Email"
                value={Form.email}
                width={responsiveWidth(90)}
                placeholder="Your Email"
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
            </Wrapper>
            <Spacer y="L" />
            <CusButton
              loading={loginloading}
              width={responsiveWidth(90)}
              title="Send"
              color={colors.secondary}
              position="center"
              radius={borderRadius.medium}
              onPress={() => {
                onSubmit();
              }}
            />
            <Spacer y="XXS" />
            <Wrapper justify="center" row>
              <CusText
                text="Back to login? Click here "
                size="S"
                color={colors.primary1}
              />
            </Wrapper>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Passwordrecovery;
