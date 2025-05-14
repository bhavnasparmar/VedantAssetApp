import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useContext, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from 'react-native';
import { toastTypes } from '../../../constant/constants';
import { AppearanceContext } from '../../../context/appearanceContext';
import { AuthContext } from '../../../context/AuthContext';
import { showToast } from '../../../services/toastService';
import Header from '../../../shared/components/Header/Header';
import {
  borderRadius,
  responsiveHeight,
  responsiveWidth
} from '../../../styles/variables';
import Container from '../../../ui/container';
import CusButton from '../../../ui/custom-button';
import InputField from '../../../ui/InputField';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
import CusText from '../../../ui/custom-text';
import { changePassword } from '../../../api/authapi';

const ChangePassword = () => {
  const { colors }: any = React.useContext(AppearanceContext);
  const navigation: any = useNavigation();
  const { signIn, signOut }: any = useContext(AuthContext);
  const [loginloading, setloginloading] = useState(false);
  const [emailerror, setemailerror] = useState(false);
  const [passworderror, setpassworderror] = useState(false);
  const [passError, setpassError] = useState<boolean>(false);
  const [loggingOut, setloggingOut] = useState(false);

  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const CRED = {
    oldpassword: '',
    newpassword: '',
    confirmPassword: ''
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
    try {


      if (!Form.oldpassword && !Form.newpassword && !Form.confirmPassword) {
        setpassworderror(true)
        showToast(toastTypes.info, 'All fields are required');
        return;
      }
      if (!Form.oldpassword) {
        setpassworderror(true)
        return;
      }
      if (!Form.newpassword) {
        setpassworderror(true)
        return;
      }
      if (!Form.confirmPassword) {
        setpassworderror(true)
        return;
      }

      if (Form.newpassword !== Form.confirmPassword) {
        setForm({
          ...Form,
          newpassword: '',
          confirmPassword: ''
        });
        showToast(toastTypes.info, 'New password and confirm password do not match.');
        return;
      }

      let passData: any = {
        oldPassword: Form.oldpassword,
        newPassword: Form.newpassword
      }

      const [result, error]: any = await changePassword(passData);
      console.log("result----", result)
      console.log("result?.data----", result?.data)
      console.log("result?.error----", error)
      if (result) {
        setForm({
          oldpassword: '',
          newpassword: '',
          confirmPassword: ''
        });
        showToast(toastTypes.info, result?.msg);
        setloggingOut(true);
        await signOut(setloggingOut);
      } else {
        setForm({
          oldpassword: '',
          newpassword: '',
          confirmPassword: ''
        });
        showToast(toastTypes.error, error?.msg);
      }

    } catch (error) {
      console.log('submit catch error : ', error)
    }

  };

  return (
    <>
      <Header menubtn name={'Change Password'} />
      {/* <Wrapper align='center'>
        <Image source={require('../../../assets/Images/logo_light.png')} style={{
          height: responsiveHeight(15),
          width: responsiveWidth(50),
          resizeMode: 'contain'
        }} />
      </Wrapper> */}

      <Container Xcenter contentWidth={responsiveWidth(100)}>
        <KeyboardAvoidingView
          //  style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 20}>
          {/* <Wrapper
            position="center"
            align="center"
            width={responsiveWidth(100)}>
            <CusText title text="Change Password" size="L" color={colors.secondary} />
          </Wrapper> */}
          <Wrapper position="center">

            <Spacer y='S' />
            <InputField
              label="Old Password"
              value={Form.oldpassword}
              width={responsiveWidth(90)}
              placeholder="Enter Your Password"
              onChangeText={(value: string) => {
                if (value) {
                  setpassworderror(false);
                }
                setForm({
                  ...Form,
                  oldpassword: value,
                });
              }}
              password
              //  borderColor={colors.gray}
              suffixColor={colors.placeholderColor}
              placeholderColor={colors.placeholderColor}
              suffixArea={30}
              returnKeyType="done"
              error={
                passworderror && !Form.oldpassword ? 'Please enter Password' : null
              }

              onSubmitEditing={() => {
                Keyboard.dismiss();
                onSubmit();
              }}
            />
            <InputField
              label="New Password"
              value={Form.newpassword}
              width={responsiveWidth(90)}
              placeholder="Enter Your Password"
              onChangeText={(value: string) => {
                if (value) {
                  setpassworderror(false);
                }
                setForm({
                  ...Form,
                  newpassword: value,
                });
              }}
              password
              //  borderColor={colors.gray}
              suffixColor={colors.placeholderColor}
              placeholderColor={colors.placeholderColor}
              suffixArea={30}
              returnKeyType="done"
              error={
                passworderror && !Form.newpassword ? 'Please enter Password' : null
              }

              onSubmitEditing={() => {
                Keyboard.dismiss();
                onSubmit();
              }}
            />
            <InputField
              label="confirm Password"
              value={Form.confirmPassword}
              width={responsiveWidth(90)}
              placeholder="Enter Your Password"
              onChangeText={(value: string) => {
                if (value) {
                  setpassworderror(false);
                }
                setForm({
                  ...Form,
                  confirmPassword: value,
                });
              }}
              password
              //  borderColor={colors.gray}
              suffixColor={colors.placeholderColor}
              placeholderColor={colors.placeholderColor}
              suffixArea={30}
              returnKeyType="done"
              error={
                passworderror && !Form.confirmPassword ? 'Please enter Password' : null
              }

              onSubmitEditing={() => {
                Keyboard.dismiss();
                onSubmit();
              }}
            />
          </Wrapper>

          <Spacer y="N" />
          <CusButton
            loading={loginloading}
            width={responsiveWidth(90)}
            title="Submit"
            color={colors.secondary}
            position="center"
            radius={borderRadius.medium}
            onPress={() => {
              onSubmit();
            }}
          />
          <Spacer y="XXS" />
        </KeyboardAvoidingView>
      </Container>
    </>
  );
};

export default ChangePassword;
