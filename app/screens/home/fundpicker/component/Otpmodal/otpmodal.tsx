import { Keyboard, TextInput, View } from "react-native";
import Modal from "react-native-modal";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { borderRadius, colors, responsiveHeight, responsiveWidth } from "../../../../../styles/variables";
import CusText from "../../../../../ui/custom-text";
import Wrapper from "../../../../../ui/wrapper";
import { styles } from "./otpmodalStyles";
import Spacer from "../../../../../ui/spacer";
import CusButton from "../../../../../ui/custom-button";
import InputField from "../../../../../ui/InputField";

const Otpmodal = ({ AlertVisible, setAlertVisible }: any) => {
    const [value1, setvalue1] = useState('');
    const [value2, setvalue2] = useState('');
    const [value3, setvalue3] = useState('');
    const [value4, setvalue4] = useState('');
    const [value5, setvalue5] = useState('');
    const [value6, setvalue6] = useState('');

    //empty Otp error..
    const [otpErr, setOtpErr] = useState<boolean>(false);
    const [required, setrequired] = useState(false);

    const input0: any = useRef<null | TextInput>();
    const input1: any = useRef<null | TextInput>();
    const input2: any = useRef<null | TextInput>();
    const input3: any = useRef<null | TextInput>();
    const input4: any = useRef<null | TextInput>();
    const input5: any = useRef<null | TextInput>();

    const handleMultipleValues = (value: string) => {
        let arr = value.split('');
        setvalue1(arr?.[0] || '');
        setvalue2(arr?.[1] || '');
        setvalue3(arr?.[2] || '');
        setvalue4(arr?.[3] || '');
         setvalue5(arr?.[4] || '');
          setvalue6(arr?.[5] || '');
        setrequired(false);
        //input3.current?.focus();
        input0.current?.focus();
    };
    const inputKeyPress = (e: any, prev: any, next: any, inputName: any) => {

        const key = e.nativeEvent.key;

        if (key === "Backspace") {
            //console.log('key..',key);
            // console.log('current..',current)
            if (prev != '') {
                prev.current?.focus();
            }

            // if (current === '') {
            //     // If the current field is empty, move to the previous field
            //     console.log('current..')
            //     if (prev  && prev.current) {
            //         prev.current?.focus();
            //         console.log('Focused on previous field:', prev);
            //     }
            // }
        } else if (e.nativeEvent.key === '-' || e.nativeEvent.key === '.') {
        } else {
            if (next != '' && e.nativeEvent.key != '') {
                next.current?.focus();
                // console.log('next...')
                // console.log(e.nativeEvent.key)
            }
        }
    };
    return (
        <>
            <Modal
                isVisible={AlertVisible}
                animationIn="fadeIn"
                animationOut="fadeOut"
                onBackdropPress={() => setAlertVisible(false)}
                backdropTransitionOutTiming={0}
                backdropTransitionInTiming={0}
                useNativeDriver={true}>

                <View style={styles.alertView}>

                    <Wrapper row justify="apart" customStyles={{ padding: responsiveWidth(2) }}>
                        <Wrapper>
                            <CusText text={'HDFC Mid-Cap Opportunities Gr'} color={colors.black} size='N' bold />
                            <CusText text={'Equity - Mid-Cap'} color={colors.black} size='SS' />
                        </Wrapper>
                        <Ionicons
                            name="close-outline"
                            size={25}
                            color={colors.black}
                        />
                    </Wrapper>
                    <Wrapper row justify="apart">
                        <CusText text={'Investor Name: Rajendra'} color={colors.black} size='SS' bold />
                        <CusText text={'SIP Day: 15'} color={colors.black} size='SS' />
                    </Wrapper>
                    <Wrapper row justify="apart">
                        <CusText text={'Holding Name: Rajendra'} color={colors.black} size='SS' bold />
                        <CusText text={'Mandate Code: 1234'} color={colors.black} size='SS' />
                    </Wrapper>
                    <Wrapper row justify="apart">
                        <CusText text={'Folio No: 09876543321'} color={colors.black} size='SS' bold />
                        <CusText text={'Amount: ₹ 15000'} color={colors.black} size='SS' />
                    </Wrapper>
                    <Spacer y="S" />
                    <Wrapper align="center" justify="center">
                        <CusText text={'OTP'} color={colors.black} size='SS' semibold />
                        <CusText position="center" text={'We have sent the verification code to your email address and mobile number'} color={colors.black} size='MS' semibold />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper row justify="center">

                        <InputField
                            value={value1}
                            maxLength={1}
                            onChangeText={val => {
                                if (val?.length > 1) {

                                    handleMultipleValues(val);
                                }
                                else {
                                    setvalue1(val);
                                    setOtpErr(false);
                                    setrequired(false);
                                    if (val) {
                                        input1.current?.focus();
                                    }
                                }
                            }}
                            onKeyPress={e => {
                                inputKeyPress(e, '', input1, 'value1');
                            }}
                            autoFocus={true}
                            textColor={colors.black}
                            returnKeyType="next"
                            // keyboardType="number-pad"
                            keyboardType="numeric"
                           height={responsiveHeight(4)}
                            width={responsiveWidth(12)}
                            style={styles.input}
                            ref={input0}
                            cursorColor={colors.Hard_Black}
                            onSubmitEditing={() => input1.current?.focus()}

                        //error={otpErr ? 'Pls filled this ' : ''}

                        />
                        <Spacer x="XS" />
                        <InputField
                            value={value2}
                            maxLength={1}
                            // onChangeText={val => {
                            //     if (val?.length > 1) {
                            //         setOtpErr(false);
                            //         handleMultipleValues(val)

                            //     }
                            //     else {
                            //         setvalue2(val);
                            //         setrequired(false);
                            //         if (val) {
                            //             input2.current?.focus();
                            //         }
                            //         else{
                            //             input0.current?.focus();
                            //         }
                            //     }
                            // }}
                            onChangeText={value => {
                                setvalue2(value);
                                setrequired(false);
                                setOtpErr(false);
                                if (value) {
                                    input2.current.focus();
                                } else {
                                    input0.current.focus();
                                }
                            }}

                            onKeyPress={e => {
                                inputKeyPress(e, input0, input2, 'value2');
                            }}
                            // autoFocus={true}
                            ref={input1}
                            returnKeyType="next"
                            textColor={colors.black}
                            // keyboardType="number-pad"
                            keyboardType="numeric"
                           height={responsiveHeight(4)}
                            width={responsiveWidth(12)}
                            style={styles.input}
                            cursorColor={colors.Hard_Black}
                            onSubmitEditing={() => input2.current?.focus()}

                        //error={otpErr ? 'Pls filled this ' : ''}
                        />
                        <Spacer x="XS" />
                        <InputField
                            value={value3}
                            maxLength={1}
                            textColor={colors.black}
                            // onChangeText={val => {
                            //     if (val?.length > 1) {
                            //         setOtpErr(false);
                            //         handleMultipleValues(val)
                            //     }
                            //     else {
                            //         setvalue3(val);
                            //         setrequired(false);
                            //         if (val) {
                            //             input3.current?.focus();
                            //         }
                            //         else{
                            //             input1.current?.focus();
                            //         }
                            //     }
                            // }}
                            onChangeText={value => {
                                setvalue3(value);
                                setOtpErr(false);
                                setrequired(false);
                                if (value) {
                                    input3.current.focus();
                                } else {
                                    input1.current.focus();
                                }
                            }}

                            onKeyPress={e => {
                                inputKeyPress(e, input1, input3, 'value3');
                            }}
                            // autoFocus={true}
                            returnKeyType="next"
                            ref={input2}
                            // keyboardType="number-pad"
                            keyboardType="numeric"
                            height={responsiveHeight(4)}
                            width={responsiveWidth(12)}
                            style={styles.input}
                            cursorColor={colors.Hard_Black}
                            onSubmitEditing={() => input3.current?.focus()}

                        //error={otpErr ? 'Pls filled this ' : ''}
                        />
                        <Spacer x="XS" />
                        <InputField
                            value={value4}
                            maxLength={1}
                            textColor={colors.black}
                            // onChangeText={value => {
                            //     setOtpErr(false);
                            //     setvalue4(value);
                            //     setrequired(false);
                            //     if (value) {
                            //         Keyboard.dismiss();
                            //     } else {
                            //         input2.current?.focus();
                            //     }
                            // }}
                            onChangeText={value => {
                                setvalue4(value);
                                setOtpErr(false);
                                setrequired(false);
                                if (value) {
                                    //input2.current.focus();
                                    Keyboard.dismiss();
                                } else {
                                    input2.current.focus();
                                }
                            }}

                            onKeyPress={e => {
                                inputKeyPress(e, input2, '', 'value4');
                            }}
                            //  autoFocus={true}
                            returnKeyType="next"
                            ref={input3}
                            style={styles.input}
                            // keyboardType="number-pad"
                            keyboardType="numeric"
                           height={responsiveHeight(4)}
                            width={responsiveWidth(12)}
                            cursorColor={colors.Hard_Black}

                        //error={otpErr ? 'Pls filled this ' : ''}
                        />
                           <InputField
                            value={value5}
                            maxLength={1}
                            textColor={colors.black}
                            // onChangeText={value => {
                            //     setOtpErr(false);
                            //     setvalue4(value);
                            //     setrequired(false);
                            //     if (value) {
                            //         Keyboard.dismiss();
                            //     } else {
                            //         input2.current?.focus();
                            //     }
                            // }}
                            onChangeText={value => {
                                setvalue5(value);
                                setOtpErr(false);
                                setrequired(false);
                                if (value) {
                                    //input2.current.focus();
                                    Keyboard.dismiss();
                                } else {
                                    input3.current.focus();
                                }
                            }}

                            onKeyPress={e => {
                                inputKeyPress(e, input3, '', 'value5');
                            }}
                            //  autoFocus={true}
                            returnKeyType="next"
                            ref={input4}
                            style={styles.input}
                            // keyboardType="number-pad"
                            keyboardType="numeric"
                           height={responsiveHeight(4)}
                            width={responsiveWidth(12)}
                            cursorColor={colors.Hard_Black}

                        //error={otpErr ? 'Pls filled this ' : ''}
                        />
                           <InputField
                            value={value6}
                            maxLength={1}
                            textColor={colors.black}
                            // onChangeText={value => {
                            //     setOtpErr(false);
                            //     setvalue4(value);
                            //     setrequired(false);
                            //     if (value) {
                            //         Keyboard.dismiss();
                            //     } else {
                            //         input2.current?.focus();
                            //     }
                            // }}
                            onChangeText={value => {
                                setvalue6(value);
                                setOtpErr(false);
                                setrequired(false);
                                if (value) {
                                    //input2.current.focus();
                                    Keyboard.dismiss();
                                } else {
                                    input4.current.focus();
                                }
                            }}

                            onKeyPress={e => {
                                inputKeyPress(e, input4, '', 'value6');
                            }}
                            //  autoFocus={true}
                            returnKeyType="next"
                            ref={input5}
                            style={styles.input}
                            // keyboardType="number-pad"
                            keyboardType="numeric"
                            height={responsiveHeight(4)}
                            width={responsiveWidth(12)}
                            cursorColor={colors.Hard_Black}

                        //error={otpErr ? 'Pls filled this ' : ''}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <CusButton
                        width={responsiveWidth(40)}
                        height={responsiveHeight(5)}
                        title="Proceed"
                        lgcolor1={colors.secondary}
                        lgcolor2={colors.secondary}
                        textcolor={colors.white}
                        position="center"
                        textSize='SS'
                        radius={borderRadius.normal}

                    />
                    <Spacer y="XXS" />
                    <CusText text={'Resend OTP'} position="center" color={colors.primary1} size='SS' semibold underline />

                </View>
            </Modal>
        </>
    )

}

export default Otpmodal;