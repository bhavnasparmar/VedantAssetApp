import React, { useRef, useState } from 'react'
import { AppearanceContext } from '../../../../../context/appearanceContext';
import { styles } from './panotpveriftStyles';
import Wrapper from '../../../../../ui/wrapper';
import { responsiveWidth } from '../../../../../styles/variables';
import Modal from "react-native-modal";
import Spacer from '../../../../../ui/spacer';
import CusText from '../../../../../ui/custom-text';
import InputField from '../../../../../ui/InputField';
// import { showToast, toastTypes } from '../../../../../service/toastService';
// import API from '../../../../../utils/API';
const PanOTPverify = ({ visible, setVisible, seteditType, userdata }: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const [Form, setForm] = useState({
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
        // try {
        //     let updatedUserInfo = {};
        //     if (otp.length === 6) {
        //         if (userdata?.emailFlag) {
        //             updatedUserInfo = {
        //                 ...userdata,
        //                 otpemail: otp
        //             };
        //         }
        //         else if (userdata?.mobileFlag) {
        //             updatedUserInfo = {
        //                 ...userdata,
        //                 otpmobile: otp
        //             };
        //         }
        //         const result: any = await API.post('kyc/validateOTP', updatedUserInfo);
        //         if (result?.data?.validEmailOTP) {
        //             showToast(toastTypes.success, 'OTP Verified!!');
        //             clearOTP()
        //             seteditType('')
        //             setVisible(false)
        //         }
        //     } else {
        //         showToast(toastTypes.info, 'Please Check OTP');
        //     }
        // } catch (error:any) {
        //     console.log('validateOTP catch Error : ', error[0]?.msg)
        //     showToast(toastTypes.error, error[0]?.msg)
        //     clearOTP()
        // }
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
                width={responsiveWidth(90)}
                color={colors.tabBg}
                customStyles={styles.modal}>
                <Spacer y="S" />
                <Wrapper align='center'>
                    <CusText text={'OTP Verification'} underline color={colors.black} size='M' />
                    <Spacer y="XXS" />
                    <CusText text="An 6 Digit code has been sent to your phone number." size="SS"
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
                                if (otp.length === 6) {
                                    validateOTP(otp);
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
            </Wrapper>
        </Modal>
    )
}

export default PanOTPverify