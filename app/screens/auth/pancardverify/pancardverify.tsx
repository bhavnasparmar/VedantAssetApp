import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from "../../../context/appearanceContext";
import { borderRadius, fontSize, responsiveHeight, responsiveWidth } from "../../../styles/variables";
import Container from "../../../ui/container";
import CusButton from "../../../ui/custom-button";
import CusText from "../../../ui/custom-text";
import InputField from "../../../ui/InputField";
import Wrapper from "../../../ui/wrapper";
import HeaderComponent from "../kycverification/headercomponent/headercomponent";
import OTPverify from "./component/panotpverify/otpVerify";
import PanOTPverify from "./component/panotpverify/panotpverify";


const PancardVerify = () => {
    const { colors }: any = React.useContext(AppearanceContext);
    const navigation: any = useNavigation();
    const [visible, setVisible] = useState(false)
    const [newUserVisible, setnewUserVisible] = useState(false)
    const [isdataVisible, setdataVisible] = useState(false)
    const [isSubmited, setisSubmited] = useState<boolean>(false);
    const [checkLoading, setcheckLoading] = useState(false);
    const [mobileLoading, setmobileLoading] = useState(false);
    const [emailLoading, setemailLoading] = useState(false);
    const [continueLoading, setcontinueLoading] = useState(false);
    const [editType, seteditType] = useState('');
    const [userPayload, setuserPayload] = useState<any>({});
    const [kycStatusData, setkycStatusData] = useState<any>({});
    const [Form, setForm] = useState({
        panNumber: '',
        fullName: '',
        phoneNumber: '',
        email: '',
    });
    const [FormError, setFormError] = useState({
        panNumber: '',
        fullName: '',
        phoneNumber: '',
        email: '',
    });
    const isFocused = useIsFocused();
    const panCardRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    useEffect(() => {
        setdataVisible(false)
        setVisible(false)
        seteditType('')
        return () => {
            setForm({
                ...Form,
                panNumber: '',
                fullName: '',
                phoneNumber: '',
                email: '',
            });
        };
    }, [isFocused]);
    useEffect(() => {
    

        return () => {};
    }, []);
    const handleFormChange = (values: any) => {
        const { key, value } = values;
        setForm((prev: any) => ({ ...prev, [key]: value }));
        if (key === 'panNumber') {
            if (panCardRegex.test(value)) {
                setFormError((prev) => ({ ...prev, panNumber: '' }));
            } else {
                setFormError((prev) => ({
                    ...prev,
                    panNumber: value ? 'PAN Number is invalid' : 'Pan Number is required',
                }));
            }
        }
        if (key === 'fullName' && !value) {
            setFormError((prev) => ({ ...prev, fullName: 'Full Name is required' }));
        }
    };
    const submit = async (isCheck?: any) => {
      

    };
    const handleValidate = (flag = false, values: any) => {
        if (!flag) return;
        let isValid = true;
        let data = Form;
        if (values) {
            const { key, value } = values;
            data = { ...data, [key]: value };
        }
        let panNumber = '';
        if (!data?.panNumber) {
            isValid = false;
            panNumber = 'Pan Number is required';
        }
        if (data?.panNumber && !panCardRegex.test(data?.panNumber)) {
            isValid = false;
            panNumber = 'Pan Number is invalid';
        }
        let fullName = '';
        if (!data?.fullName) {
            isValid = false;
            fullName = 'Full Name is required';
        }
        let phoneNumber = '';
        if (!data?.phoneNumber) {
            isValid = false;
            phoneNumber = 'Phone Number is required';
        }
        let email = '';
        if (!data?.email) {
            isValid = false;
            email = 'email is required';
        }

        setFormError({
            panNumber,
            phoneNumber,
            fullName,
            email
        });
        return isValid;
    };
    const checkPancard = async () => {
       
    }
    const handleFormChangeBatch = (updates: any) => {
        setForm((prev: any) => ({ ...prev, ...updates }));
        //  handleValidate(true, updates);
    };
    const editData = (data: any) => {
       
    }

    const validateData = async () => {
       


    }

    const headerBackAction = () => {

       

    };
    return (
        <>
            <HeaderComponent name={'PAN Number'} backAction={() => headerBackAction()} />
            {/* <SubHeader name={'Initiate KYC'} /> */}
            <Container Xcenter>
                <Wrapper position="center" row justify="apart" width={responsiveWidth(90)} customStyles={{ position: 'relative', marginTop: responsiveWidth(3) }}>
                    <InputField
                        editable={isdataVisible ? false : true}
                        label="Pan Number"
                        width={responsiveWidth(90)}
                        placeholder="Enter Your Pancard"
                        value={Form.panNumber}
                        // labelStyle={{ color: colors.darkGray }}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'panNumber', value })
                        }}
                        error={
                            FormError.panNumber
                        }
                        borderColor={colors.darkGray}

                    />
                    <Wrapper row customStyles={{ position: "absolute", right: responsiveWidth(1.5), top: 42 }}>
                        <CusButton
                            loading={checkLoading}
                            radius={borderRadius.medium}
                            width={responsiveWidth(20)}
                            height={responsiveHeight(5)}
                            title="Check"
                            lgcolor1={colors.primary}
                            lgcolor2={colors.secondry}
                            position="center"
                            onPress={() => { checkPancard() }}
                        />
                        {
                            isdataVisible ?
                                <CusButton
                                    loading={checkLoading}
                                    buttonStyle={{ marginLeft: responsiveWidth(1) }}
                                    width={responsiveWidth(20)}
                                    height={responsiveHeight(5)}
                                    radius={borderRadius.medium}
                                    title="Reset"
                                    lgcolor1={colors.primary}
                                    lgcolor2={colors.secondry}
                                    position="center"
                                    onPress={() => {
                                        setdataVisible(false)
                                    }}
                                /> : null
                        }
                    </Wrapper>


                </Wrapper>

                {
                    isdataVisible ?
                        (
                            <>
                                <Wrapper position="center" row justify="apart" width={responsiveWidth(90)} customStyles={{ position: 'relative', marginTop: responsiveWidth(3) }}>
                                    <InputField
                                        // editable={getNew_User() ? true : false}
                                        label="Full Name"
                                        width={responsiveWidth(90)}
                                        placeholder="Enter Your Full Name"
                                        value={Form.fullName}
                                        // labelStyle={{ color: colors.darkGray }}
                                        onChangeText={(value: string) => {
                                            handleFormChange({ key: 'fullName', value })
                                        }}
                                        error={
                                            FormError.fullName
                                        }
                                        borderColor={colors.darkGray}
                                    />
                                </Wrapper>
                                <Wrapper position="center" row justify="apart" width={responsiveWidth(90)} customStyles={{ position: 'relative', marginTop: responsiveWidth(3) }}>

                                    <InputField
                                       // editable={editType === 'phone' ? true : getNew_User() ? true : false}
                                        label="Phone Number"
                                        width={responsiveWidth(90)}
                                        placeholder="Enter Your Phone"
                                        value={Form.phoneNumber}
                                        // labelStyle={{ color: colors.darkGray }}
                                        onChangeText={(value: string) => {
                                            handleFormChange({ key: 'phoneNumber', value })
                                        }}
                                        error={
                                            FormError.phoneNumber
                                        }
                                        borderColor={colors.darkGray}

                                    />
                                    {
                                        !true ?
                                            <Wrapper row customStyles={{ position: "absolute", right: responsiveWidth(1.5), bottom: responsiveWidth(1.8) }}>
                                                <TouchableOpacity onPress={() => { editType === 'phone' ? validateData() : editData(1) }}>
                                                    <Wrapper justify="center" align="center" position="center" customStyles={{ padding: responsiveWidth(1.5), backgroundColor: colors.secondary, borderRadius: borderRadius.middleSmall }}>
                                                        {editType === 'phone' ?
                                                            <CusText text={'Validate'} />
                                                            :
                                                            <IonIcon
                                                                name="pencil-outline"
                                                                size={fontSize.large}
                                                                style={{ color: '#ffff' }}

                                                            />
                                                        }
                                                    </Wrapper>
                                                </TouchableOpacity>
                                                {
                                                    editType === 'phone' ?
                                                        (
                                                            <TouchableOpacity onPress={() => { seteditType('') }}>
                                                                <IonIcon
                                                                    name="close"
                                                                    size={22}
                                                                    style={{ color: '#ffff' }}

                                                                />
                                                            </TouchableOpacity>
                                                        )
                                                        :
                                                        null
                                                }
                                            </Wrapper> : null
                                    }
                                </Wrapper>
                                <Wrapper position="center" row justify="apart" width={responsiveWidth(90)} customStyles={{ position: 'relative', marginTop: responsiveWidth(3) }}>

                                    <InputField
                                        //editable={editType === 'email' ? true : '' ? true : false}
                                        label="E-mail"
                                        width={responsiveWidth(90)}
                                        placeholder="Enter Your Email"
                                        value={Form.email}
                                        // labelStyle={{ color: colors.darkGray }}
                                        onChangeText={(value: string) => {
                                            handleFormChange({ key: 'email', value })
                                        }}
                                        error={
                                            FormError.email
                                        }
                                        borderColor={colors.darkGray}
                                    />
                                    {
                                        !true ?
                                            <Wrapper row customStyles={{ position: "absolute", right: responsiveWidth(1.5), bottom: responsiveWidth(1.8) }}>
                                                <TouchableOpacity onPress={() => { editType === 'email' ? validateData() : editData(2) }}>
                                                    <Wrapper justify="center" align="center" position="center" customStyles={{ padding: responsiveWidth(1.5), backgroundColor: colors.secondary, borderRadius: borderRadius.middleSmall }}>
                                                        {editType === 'email' ?
                                                            <CusText position="center" customStyles={{ height: responsiveHeight(3) }} text={'Validate'} />
                                                            :
                                                            <IonIcon
                                                                name="pencil-outline"
                                                                size={fontSize.large}
                                                                style={{ color: '#ffff' }}

                                                            />
                                                        }
                                                    </Wrapper>
                                                </TouchableOpacity>
                                                {
                                                    editType === 'email' ?
                                                        (
                                                            <TouchableOpacity onPress={() => { seteditType('') }}>
                                                                <IonIcon
                                                                    name="close"
                                                                    size={22}
                                                                    style={{ color: '#ffff' }}

                                                                />
                                                            </TouchableOpacity>
                                                        )
                                                        :
                                                        null
                                                }
                                            </Wrapper> : null}
                                </Wrapper>

                            </>
                        )
                        :
                        null
                }
            </Container>
            {
                isdataVisible ?
                    <CusButton
                        loading={continueLoading}
                        width={responsiveWidth(90)}
                        title="Continue"
                        lgcolor1={colors.primary}
                        lgcolor2={colors.secondry}
                        position="center"
                        onPress={() => { submit() }}
                        radius={borderRadius.ring}
                        textStyle={{ fontSize: fontSize.medium }}
                    /> : null
            }

            <PanOTPverify
                visible={visible}
                setVisible={(value: any) => setVisible(value)}
                seteditType={(value: any) => seteditType(value)}
                userdata={userPayload}
            />
            <OTPverify
                visible={newUserVisible}
                setVisible={(value: any) => setnewUserVisible(value)}
                seteditType={(value: any) => seteditType(value)}
                userdata={userPayload}
                newUserData={kycStatusData}
                name={Form.fullName}
            />
        </>
    )
}
export default PancardVerify