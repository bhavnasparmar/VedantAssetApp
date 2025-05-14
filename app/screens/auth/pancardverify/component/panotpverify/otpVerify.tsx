import React, { useRef, useState } from 'react'
import { AppearanceContext } from '../../../../../context/appearanceContext';
import { styles } from './otpVerifyStyle';
import Wrapper from '../../../../../ui/wrapper';
import { responsiveWidth } from '../../../../../styles/variables';
import Modal from "react-native-modal";
import Spacer from '../../../../../ui/spacer';
import CusText from '../../../../../ui/custom-text';
import InputField from '../../../../../ui/InputField';
// import { showToast, toastTypes } from '../../../../../service/toastService';
// import API from '../../../../../utils/API';
// import { getLoginUserDetails, getNew_User, getUserObject, setNewUserObject } from '../../../../../utils/Commanutils';
import { useNavigation } from '@react-navigation/native';
const OTPverify = ({ visible, setVisible, seteditType, userdata, newUserData, name }: any) => {

    const { colors }: any = React.useContext(AppearanceContext);
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
    const [emailOtp, setemailOtp] = useState<any>(0);
    const [mobileOTP, setmobileOTP] = useState<any>(0);
    const navigation: any = useNavigation();
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
    const validateOTP = async (otp: any, mobileOTP: any) => {
       
    }
    const clearOTP = () => {
        setForm({
            inputfeild1: '',
            inputfeild2: '',
            inputfeild3: '',
            inputfeild4: '',
            inputfeild5: '',
            inputfeild6: '',
        });
        setForm2({
            inputfeild1: '',
            inputfeild2: '',
            inputfeild3: '',
            inputfeild4: '',
            inputfeild5: '',
            inputfeild6: '',
        });
        input1.current?.focus()
    }

    return (
        <Modal
            isVisible={visible}
            style={styles.modalView}
            animationIn='fadeIn'
            animationOut='fadeOut'
            backdropTransitionOutTiming={0}
            backdropTransitionInTiming={0}
            useNativeDriver={true}>
            <Wrapper
                width={responsiveWidth(90)}
                color={colors.tabBg}
                customStyles={styles.modal}>
                <Spacer y="S" />
                <Wrapper align='center'>
                    <CusText text={'OTP Verification'} underline color={colors.black} size='M' />
                    <Spacer y="XXS" />
                    <CusText text="An 6 Digit code has been sent to your Email." size="SS"
                        customStyles={styles.subtitle} position="center" color={colors.gray} />
                </Wrapper>
                <Wrapper row justify="spEven">
                    <InputField
                        fieldColor={colors.tabBg}
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
                        fieldColor={colors.tabBg}
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
                        fieldColor={colors.tabBg}
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
                        fieldColor={colors.tabBg}
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
                        fieldColor={colors.tabBg}
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
                        fieldColor={colors.tabBg}
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
                            if (value) {
                                const otp = Object.values({ ...Form, inputfeild6: value }).join('');
                                setemailOtp(otp)
                                if (otp.length === 6) {
                                    input01.current?.focus()
                                }
                                const finalOtp = otp + mobileOTP
                                if (finalOtp.length === 12) {
                                    validateOTP(otp, mobileOTP);
                                }
                            }
                        }}
                        textContentType="oneTimeCode"
                    />
                </Wrapper>
                <Spacer y="N" />
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
                <Wrapper customStyles={{ marginLeft: responsiveWidth(4) }}>
                    <CusText text="Mobile OTP" size="S" color={colors.black} />
                </Wrapper>
                <Wrapper row justify="spEven">
                    <InputField
                        fieldColor={colors.tabBg}
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
                                inputfeild1: value != '.' && value != '-' ? value : '',
                            });
                        }}
                        textContentType="oneTimeCode"
                    />

                    <InputField
                        fieldColor={colors.tabBg}
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
                                inputfeild2: value != '.' && value != '-' ? value : '',
                            });
                        }}
                        textContentType="oneTimeCode"
                    />
                    <InputField
                        fieldColor={colors.tabBg}
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
                                inputfeild3: value != '.' && value != '-' ? value : '',
                            });
                        }}
                        textContentType="oneTimeCode"
                    />
                    <InputField
                        fieldColor={colors.tabBg}
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
                                inputfeild4: value != '.' && value != '-' ? value : '',
                            });
                        }}
                        textContentType="oneTimeCode"
                    />
                    <InputField
                        fieldColor={colors.tabBg}
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
                                inputfeild5: value != '.' && value != '-' ? value : '',
                            });
                        }}
                        textContentType="oneTimeCode"
                    />
                    <InputField
                        fieldColor={colors.tabBg}
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
                                inputfeild6: value != '.' && value != '-' ? value : '',
                            });
                            if (value) {
                                const otp = Object.values({ ...Form2, inputfeild6: value }).join('');
                                setmobileOTP(otp)
                                if (otp.length === 6) {
                                    input1.current?.focus()
                                }
                                const finalOtp = otp + emailOtp
                                if (finalOtp.length === 12) {
                                    validateOTP(emailOtp, otp);
                                }

                            }
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

            </Wrapper>
        </Modal>
    )
}

export default OTPverify