import React, { useRef, useState } from 'react'

import { styles } from './panotpveriftStyles';

import Modal from "react-native-modal";
import { showToast, toastTypes } from '../../../services/toastService';
import Wrapper from '../../../ui/wrapper';
import { colors, responsiveWidth } from '../../../styles/variables';
import Spacer from '../../../ui/spacer';
import CusText from '../../../ui/custom-text';
import InputField from '../../../ui/InputField';
import CusButton from '../../../ui/custom-button';
import { ValidateOtpVerify } from '../../../api/homeapi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_DATA } from '../../../utils/Commanutils';


const PanOTPverify = ({ visible, setVisible, seteditType, userdata, title }: any) => {

    const [Form, setForm] = useState({
        inputfeild1: '',
        inputfeild2: '',
        inputfeild3: '',
        inputfeild4: '',
        inputfeild5: '',
        inputfeild6: '',
    });
    const input1: any = useRef('');
    const input2: any = useRef('');
    const input3: any = useRef('');
    const input4: any = useRef('');
    const input5: any = useRef('');
    const input6: any = useRef('');
    const [inputError, setInputError] = useState(false);
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
    const validateOTP = async (otp: any) => {

        try {
            let updatedUserInfo: any = {};

            if (userdata?.emailFlag) {
                updatedUserInfo = {
                    ...userdata,
                    emailOTP: Form.inputfeild1 + Form.inputfeild2 + Form.inputfeild3 + Form.inputfeild4 + Form.inputfeild5 + Form.inputfeild6
                };
            }
            else if (userdata?.mobileFlag) {
                updatedUserInfo = {
                    ...userdata,
                    mobileOTP: Form.inputfeild1 + Form.inputfeild2 + Form.inputfeild3 + Form.inputfeild4 + Form.inputfeild5 + Form.inputfeild6
                };
            }
            console.log('Waiting....')
            // const result: any = await API.post('kyc/validateOTP', updatedUserInfo);
            const [result, error]: any = await ValidateOtpVerify(updatedUserInfo)

            console.log('updatedUserInfo : ', updatedUserInfo)
            console.log('Wait is over : ', result)
            if (result) {
                showToast(toastTypes.success, 'OTP Verified!!');
                // await AsyncStorage.setItem(USER_DATA, JSON.stringify(data?.user));
                const data: any = await AsyncStorage.getItem(USER_DATA);
                const parsedData: any = JSON.parse(data)
                console.log('parsedData before ===>> ', parsedData)
                if (userdata?.emailFlag) {
                    parsedData.email = updatedUserInfo?.reg_email
                }
                if (userdata?.mobileFlag) {
                    parsedData.mobile = updatedUserInfo?.reg_mobile
                }
                console.log('parsedData after ===>> ', parsedData)
                await AsyncStorage.setItem(USER_DATA, JSON.stringify(parsedData));

                clearOTP()
                seteditType('')
                setVisible(false)
            } else {
                showToast(toastTypes.success, error?.msg);
            }
            // if (result?.data?.validMobileOTP) {
            //     showToast(toastTypes.success, 'OTP Verified!!');
            //     clearOTP()
            //     seteditType('')
            //     setVisible(false)
            // }

        } catch (error: any) {
            console.log('validateOTP catch Error : ', error)
            showToast(toastTypes.error, error[0]?.msg)
            clearOTP()
        }
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
                width={responsiveWidth(95)}
                color={'white'}
                customStyles={styles.modal}>
                <Spacer y="S" />
                <Wrapper align='center'>
                    <CusText text={title} medium color={colors.black} size='SL' />
                    <Spacer y="S" />
                    {/* <CusText text="An 6 Digit code has been sent to your phone number." size="SS"
                        customStyles={styles.subtitle} position="center" color={colors.gray} /> */}
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
                                // const otp = Object.values({ ...Form, inputfeild6: value }).join('');
                                // if (otp.length === 6) {
                                //     console.log('otp.length : ', otp.length)
                                //     validateOTP(otp);
                                // }
                            }
                        }}
                        textContentType="oneTimeCode"
                    />
                </Wrapper>
                <Spacer y="S" />
                <CusText position='center' text={'OTP :- ' + userdata?.otp} />
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

                <Wrapper position='center'>
                    <CusButton title='Submit' onPress={() => {

                        validateOTP(6)
                    }} />
                </Wrapper>
                <Spacer y="S" />
            </Wrapper>
        </Modal>
    )
}

export default PanOTPverify