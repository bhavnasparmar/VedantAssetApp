import React, { useRef, useState } from 'react';
import { Modal, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';
import Wrapper from '../../../ui/wrapper';
import CusText from '../../../ui/custom-text';
import InputField from '../../../ui/InputField';
import CusButton from '../../../ui/custom-button';
import Spacer from '../../../ui/spacer';
import { AppearanceContext } from '../../../context/appearanceContext';
import { responsiveHeight, responsiveWidth, borderRadius } from '../../../styles/variables';
import { showToast, toastTypes } from '../../../services/toastService';
import API from '../../../utils/API';
import { confirmAadhaarVerificationApi, initiateAadhaarVerificationApi } from '../../../api/homeapi';


interface AadhaarOtpModalProps {
    visible: boolean;
    onClose: () => void;
    verificationData: any;
    onSuccess: (data: any) => void;
}

const AadhaarOtpModal: React.FC<AadhaarOtpModalProps> = ({
    visible,
    onClose,
    verificationData,
    onSuccess
}) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [otpnumber, setOtpNumber] = useState(null);
    console.log('Varifivation ', verificationData);
    // OTP form state
    const [Form, setForm] = useState({
        inputfeild1: '',
        inputfeild2: '',
        inputfeild3: '',
        inputfeild4: '',
        inputfeild5: '',
        inputfeild6: '',
    });

    // Input refs
    const input1: any = useRef<null | TextInput>(null);
    const input2: any = useRef<null | TextInput>(null);
    const input3: any = useRef<null | TextInput>(null);
    const input4: any = useRef<null | TextInput>(null);
    const input5: any = useRef<null | TextInput>(null);
    const input6: any = useRef<null | TextInput>(null);

    const inputKeyPress = (e: any, prevInput: any, nextInput: any, field: string) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (!Form[field as keyof typeof Form] && prevInput) {
                prevInput.current?.focus();
            }
        }
    };

    const handleMultipleValues = (val: string) => {
        const digits = val.split('');
        setForm({
            inputfeild1: digits[0] || '',
            inputfeild2: digits[1] || '',
            inputfeild3: digits[2] || '',
            inputfeild4: digits[3] || '',
            inputfeild5: digits[4] || '',
            inputfeild6: digits[5] || '',
        });

        if (digits.length >= 6) {
            input6.current?.focus();
        }
    };

    const clearOTP = () => {
        setForm({
            inputfeild1: '',
            inputfeild2: '',
            inputfeild3: '',
            inputfeild4: '',
            inputfeild5: '',
            inputfeild6: '',
        });
        input1.current?.focus();
    };

    const submitOtp = async () => {
        const otp = Form.inputfeild1 + Form.inputfeild2 + Form.inputfeild3 +
            Form.inputfeild4 + Form.inputfeild5 + Form.inputfeild6;

        console.log('otp', otpnumber);
        if (!otp || otp.length !== 6) {
            setInputError(true);
            showToast(toastTypes.error, 'Please enter valid 6-digit OTP');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                otp: otp,
                investor_id: verificationData?.investor_id,
                aadhaar: verificationData?.aadhaar,
                ref_id: verificationData?.ref_id
            };

            console.log('OTP verification payload:', payload);


            const [result, error]: any = await confirmAadhaarVerificationApi(payload);

            if (result?.data) {
                console.log('OTP verification result:', result);
                showToast(toastTypes.success, result?.msg || 'Aadhaar verified successfully');

                onSuccess(result.data);
                clearOTP();
                onClose();
            } else {
                console.log('OTP verification error:', error);
                showToast(toastTypes.error, error?.msg || 'Invalid OTP');
                clearOTP();
            }
        } catch (error) {
            console.log('OTP verification catch error:', error);
            showToast(toastTypes.error, 'Failed to verify OTP');
            clearOTP();
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        try {
            setResendLoading(true);
            const payload = {
                aadhaar: verificationData?.aadhaar,
                investor_id: verificationData?.investor_id,
            };


            const [result, error]: any = await initiateAadhaarVerificationApi(payload);

            if (result?.data) {
                showToast(toastTypes.success, 'OTP resent successfully');
            } else {
                showToast(toastTypes.error, error?.msg || 'Failed to resend OTP');
            }
        } catch (error) {
            console.log('Resend OTP error:', error);
            showToast(toastTypes.error, 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <Wrapper
                    justify='center'
                    align='center'
                    color='rgba(0, 0, 0, 0.5)'
                    customStyles={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                        <Wrapper
                            width={responsiveWidth(90)}
                            color={colors.white}
                            customStyles={{
                                borderRadius: borderRadius.medium,
                                padding: responsiveWidth(5),
                                margin: responsiveWidth(5),
                                shadowColor: colors.black,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}
                        >
                            <Wrapper position='center' row justify="apart" align="center">
                                <CusText
                                    text="Aadhaar OTP Verification"
                                    size='L'
                                    bold
                                    color={colors.Hard_Black}
                                />
                                {/* <TouchableOpacity onPress={onClose}>
                                    <CusText
                                        text="✕"
                                        size='L'
                                        color={colors.gray}
                                    />
                                </TouchableOpacity> */}
                            </Wrapper>

                            <Spacer y="XS" />

                            <CusText
                                text="Enter the 6-digit OTP sent to your registered mobile number"
                                size='S'
                                color={colors.gray}
                                position="center"
                            />

                            <Spacer y="XS" />

                            <Wrapper row justify="spEven">
                                <InputField
                                    value={Form.inputfeild1}
                                    maxLength={1}
                                    onChangeText={val => {
                                        if (val?.length > 1) {
                                            handleMultipleValues(val);
                                        } else {
                                            setForm({ ...Form, inputfeild1: val });
                                            setInputError(false);
                                            if (val) {
                                                input2.current?.focus();
                                            }
                                        }
                                    }}
                                    onKeyPress={e => {
                                        inputKeyPress(e, '', input2, 'inputfeild1');
                                    }}
                                    autoFocus={true}
                                    textColor={colors.black}
                                    returnKeyType="next"
                                    keyboardType="numeric"
                                    height={responsiveHeight(4)}
                                    width={responsiveWidth(12)}
                                    textAlign="center"
                                    ref={input1}
                                    cursorColor={colors.Hard_Black}
                                    onSubmitEditing={() => input2.current?.focus()}
                                />
                                <Spacer x="XS" />
                                <InputField
                                    value={Form.inputfeild2}
                                    maxLength={1}
                                    onChangeText={val => {
                                        setForm({ ...Form, inputfeild2: val });
                                        setInputError(false);
                                        if (val) {
                                            input3.current?.focus();
                                        } else {
                                            input1.current?.focus();
                                        }
                                    }}
                                    onKeyPress={e => {
                                        inputKeyPress(e, input1, input3, 'inputfeild2');
                                    }}
                                    ref={input2}
                                    returnKeyType="next"
                                    textColor={colors.black}
                                    keyboardType="numeric"
                                    height={responsiveHeight(4)}
                                    width={responsiveWidth(12)}
                                    textAlign="center"
                                    cursorColor={colors.Hard_Black}
                                    onSubmitEditing={() => input3.current?.focus()}
                                />
                                <Spacer x="XS" />
                                <InputField
                                    value={Form.inputfeild3}
                                    maxLength={1}
                                    onChangeText={val => {
                                        setForm({ ...Form, inputfeild3: val });
                                        setInputError(false);
                                        if (val) {
                                            input4.current?.focus();
                                        } else {
                                            input2.current?.focus();
                                        }
                                    }}
                                    onKeyPress={e => {
                                        inputKeyPress(e, input2, input4, 'inputfeild3');
                                    }}
                                    returnKeyType="next"
                                    ref={input3}
                                    textColor={colors.black}
                                    keyboardType="numeric"
                                    height={responsiveHeight(4)}
                                    width={responsiveWidth(12)}
                                    textAlign="center"
                                    cursorColor={colors.Hard_Black}
                                    onSubmitEditing={() => input4.current?.focus()}
                                />
                                <Spacer x="XS" />
                                <InputField
                                    value={Form.inputfeild4}
                                    maxLength={1}
                                    onChangeText={val => {
                                        setForm({ ...Form, inputfeild4: val });
                                        setInputError(false);
                                        if (val) {
                                            input5.current?.focus();
                                        } else {
                                            input3.current?.focus();
                                        }
                                    }}
                                    onKeyPress={e => {
                                        inputKeyPress(e, input3, input5, 'inputfeild4');
                                    }}
                                    returnKeyType="next"
                                    ref={input4}
                                    textColor={colors.black}
                                    keyboardType="numeric"
                                    height={responsiveHeight(4)}
                                    width={responsiveWidth(12)}
                                    textAlign="center"
                                    cursorColor={colors.Hard_Black}
                                    onSubmitEditing={() => input5.current?.focus()}
                                />
                                <Spacer x="XS" />
                                <InputField
                                    value={Form.inputfeild5}
                                    maxLength={1}
                                    onChangeText={val => {
                                        setForm({ ...Form, inputfeild5: val });
                                        setInputError(false);
                                        if (val) {
                                            input6.current?.focus();
                                        } else {
                                            input4.current?.focus();
                                        }
                                    }}
                                    onKeyPress={e => {
                                        inputKeyPress(e, input4, input6, 'inputfeild5');
                                    }}
                                    returnKeyType="next"
                                    ref={input5}
                                    textColor={colors.black}
                                    keyboardType="numeric"
                                    height={responsiveHeight(4)}
                                    width={responsiveWidth(12)}
                                    textAlign="center"
                                    cursorColor={colors.Hard_Black}
                                    onSubmitEditing={() => input6.current?.focus()}
                                />
                                <Spacer x="XS" />
                                <InputField
                                    value={Form.inputfeild6}
                                    maxLength={1}
                                    onChangeText={val => {
                                        setForm({ ...Form, inputfeild6: val });
                                        setInputError(false);
                                        if (val) {
                                            const otp: any = Form.inputfeild1 + Form.inputfeild2 + Form.inputfeild3 +
                                                Form.inputfeild4 + Form.inputfeild5 + val;
                                            setOtpNumber(otp);
                                            // if (otp.length === 6) {
                                            //     // Auto submit with complete OTP
                                            //     setTimeout(() => submitOtp(), 100);
                                            // }
                                        } else {
                                            input5.current?.focus();
                                        }
                                    }}
                                    onKeyPress={e => {
                                        inputKeyPress(e, input5, '', 'inputfeild6');
                                    }}
                                    returnKeyType="done"
                                    ref={input6}
                                    textColor={colors.black}
                                    keyboardType="numeric"
                                    height={responsiveHeight(4)}
                                    width={responsiveWidth(12)}
                                    textAlign="center"
                                    cursorColor={colors.Hard_Black}
                                />
                            </Wrapper>


                            {inputError && (
                                <>
                                    <Spacer y="S" />
                                    <Wrapper row justify="center">
                                        <CusText
                                            size='S'
                                            text="Please enter valid 6-digit OTP"
                                            color={colors.error}
                                        />
                                    </Wrapper>
                                </>

                            )}

                            <Spacer y="S" />

                            <CusButton
                                title="Verify OTP"
                                loading={loading}
                                onPress={submitOtp}
                                width={responsiveWidth(80)}
                                position="center"
                            />

                            <Spacer y="XS" />

                            <TouchableOpacity
                                onPress={resendOtp}
                                disabled={resendLoading}
                            >
                                <CusText
                                    text={resendLoading ? "Resending..." : "Resend OTP"}
                                    size='S'
                                    color={colors.primary}
                                    position="center"
                                    underline
                                />
                            </TouchableOpacity>
                        </Wrapper>
                    </ScrollView>
                </Wrapper>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AadhaarOtpModal;



