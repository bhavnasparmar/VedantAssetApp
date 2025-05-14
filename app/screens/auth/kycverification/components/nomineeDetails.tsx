import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, fontSize, responsiveWidth } from "../../../../styles/variables";
import InputField from "../../../../ui/InputField";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
// import DateTimePicker from "../../../../ui/datetimePicker";
import Container from "../../../../ui/container";
import CusButton from "../../../../ui/custom-button";
import DateTimePicker from "../../../../ui/datetimePicker";
import DropDown from "../../../../ui/dropdown";
import HeaderComponent from "../headercomponent/headercomponent";

const NomineeDetail = ({ setSelectedTab, selectedTab, step }: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const [continueLoading, setcontinueLoading] = useState(false);
    const [isSubmited, setisSubmited] = useState<boolean>(false);
    const [minorvalue, setminorvalue] = useState<boolean>(false);
    const [signZyData, setsignZyData] = useState<any>({});
    const [isFocus, setIsFocus] = useState(false);
    const isFocused = useIsFocused();
    const [Form, setForm] = useState({
        nomineeName: '',
        relationShip: '',
        dob: '',
        allocation: '',
        guardian_name: '',
        guardian_relation: ''
    });
    const [FormError, setFormError] = useState({
        nomineeName: '',
        relationShip: '',
        dob: '',
        allocation: '',
        guardian_name: '',
        guardian_relation: ''
    });
    const [occupation, setOccupation] = useState([])
    const [sourceofIncome, setSourceofIncome] = useState([])
    const [annualIncome, setannualIncome] = useState([])
    const [summeryDetails, setsummeryDetails] = useState<any>([])
    const [country, setCountry] = useState([])
    const [relationShip, setrelationShip] = useState([
        {
            value: 'FATHER',
            Address: 'FATHER'
        },
        {
            value: 'SPOUSE',
            Address: 'SPOUSE'
        },
    ])
    const allocationRegex = /^(100|[1-9]?[0-9])$/;
    useEffect(() => {
        getDefaultData()
        getOccupation()
        getSOI()
        getAI()
        getCountry()
        getSummeryDetails()
        handleFormChange({ key: 'allocation', value: 100 })
        return () => {
            setForm({
                ...Form,
                nomineeName: '',
                relationShip: '',
                dob: '',
                allocation: '',
                guardian_name: '',
                guardian_relation: ''
            });
            setFormError({
                ...FormError,
                nomineeName: '',
                relationShip: '',
                dob: '',
                allocation: '',
                guardian_name: '',
                guardian_relation: ''
            });
        };
    }, [isFocused]);

    const navigation: any = useNavigation();
    useEffect(() => {
        const backAction = () => {
            navigation.navigate('KycTrack')
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    const getOccupation = async () => {
      
    }
    const getSOI = async () => {
       
    }
    const getAI = async () => {
      
    }
    const getCountry = async () => {
       
    }

    const getSummeryDetails = async () => {
      
    }

    const getDefaultData = async () => {
       

    }

    const getNomineeAge = (value: Date) => {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            setminorvalue(true)
        } else {
            setminorvalue(false)
        }
    }

    const submit = async () => {
       
    };

    const handleFormChange = (values: any) => {
        const { key, value } = values;
        setForm((prev: any) => ({ ...prev, [key]: value }));
        handleValidate(isSubmited, values);
    };

    const handleValidate = (flag = false, values: any) => {
        if (!flag) return;
        let isValid = true;
        let data = Form;
        console.log('Data : ', data)
        if (values) {
            const { key, value } = values;
            data = { ...data, [key]: value };
        }
        let nomineeName = '';
        if (!data?.nomineeName) {
            isValid = false;
            nomineeName = 'Nominee Name is required';
        }
        let relationShip = '';
        if (!data?.relationShip) {
            isValid = false;
            relationShip = 'relationShip is required';
        }
        let dob = '';
        if (!data?.dob) {
            isValid = false;
            dob = 'Date of Birth field';
        }
        let allocation = '';
        if (!data?.allocation) {
            isValid = false;
            allocation = 'allocation is required';
        }
        if (data?.allocation && !allocationRegex.test(data?.allocation)) {
            isValid = false;
            allocation = 'Allocate between 0 to 100';
        }
        let guardian_name = '';
        let guardian_relation = '';
        if (minorvalue) {
            if (!data?.guardian_name) {
                isValid = false;
                guardian_name = 'guardian name is required';
            }

            if (!data?.guardian_relation) {
                isValid = false;
                guardian_relation = 'guardian relation is required';
            }
        }
        setFormError({
            nomineeName,
            relationShip,
            dob,
            allocation,
            guardian_name: minorvalue ? guardian_name : '',
            guardian_relation: minorvalue ? guardian_relation : ''
        });
        return isValid;
    };

    return (
        <>
            <HeaderComponent name={'KYC Verification'} />
            {/* <SubHeader name={'Nominee Details'} backAction={() => setSelectedTab('addressDetailRoute')} /> */}
            {/* <LinearGradient
                style={styles.subHeader}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={[
                    colors.gradient3,
                    colors.gradient4,
                    colors.gradient5,
                ]}>
                <Wrapper row customStyles={styles.HeaderRow}>
                    <TouchableOpacity onPress={() => { setSelectedTab('addressDetailRoute') }}>
                        <IonIcon name={'chevron-back-outline'} color={colors.primary1} size={25} />
                    </TouchableOpacity>
                    <Wrapper align="center" justify="center" width={responsiveWidth(80)}>
                        <CusText text={'Nominee Details'} color={colors.Hard_white} size='N' />
                    </Wrapper>

                </Wrapper>
            </LinearGradient> */}
            <Container Xcenter>
                <Wrapper position="center">
                    <InputField
                        label="Nominee Name"
                        width={responsiveWidth(90)}
                        placeholder="Enter Your Nominee"
                        value={Form.nomineeName}
                        // labelStyle={{ color: colors.gray }}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'nomineeName', value })
                        }}
                        borderColor={colors.gray}
                        error={FormError.nomineeName}
                    />
                    <DropDown
                        data={relationShip}
                        placeholder={'Select Relationship'}
                        placeholdercolor={colors.gray}
                        labelText="Relationship"
                        required
                        value={Form.relationShip}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        valueField="value"
                        labelField={'Address'}
                        onChange={(item: any) => {
                            handleFormChange({ key: 'relationShip', value: item.value })
                            setIsFocus(false);
                        }}
                        onClear={
                            () => {
                                handleFormChange({ key: 'relationShip', value: '' })
                                setIsFocus(false);
                            }
                        }
                        error={FormError?.relationShip}
                    />
                    {/* <Spacer y='XS' />
                    <CusText size='XS' text="Date of Birth" color={colors.gray} />
                    <Spacer y='XXS' /> */}
                    <DateTimePicker
                        label="Date of Birth"
                        maximum={new Date()}
                        value={Form.dob ? new Date(Form.dob) : undefined}
                        iconColor={colors.black}
                        width={responsiveWidth(90)}
                        borderColor={colors.gray}
                        customStyle={{
                            alignSelf: 'center',
                            borderBottomColor: colors.gray,
                            borderRadius: borderRadius.medium,
                        }}
                        setValue={(value: Date) => {
                            handleFormChange({ key: 'dob', value })
                            getNomineeAge(value)
                        }}
                        error={FormError.dob}
                    />
                    <InputField
                        editable={false}
                        label="% of allocation"
                        width={responsiveWidth(90)}
                        placeholder="Allocate"
                        value={'100'}
                        inputMode="numeric"
                        // labelStyle={{ color: colors.gray }}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'allocation', value })
                        }}
                        borderColor={colors.gray}
                        error={FormError.allocation}
                    />
                    {
                        minorvalue ?
                            <>
                                <InputField
                                    label="Name of the Gaurdian (if Minor)"
                                    width={responsiveWidth(90)}
                                    placeholder="Enter Gaurdian Name"
                                    value={Form.guardian_name}
                                    // labelStyle={{ color: colors.gray }}
                                    onChangeText={(value: string) => {
                                        handleFormChange({ key: 'guardian_name', value })
                                    }}
                                    borderColor={colors.gray}
                                    error={FormError.guardian_name}
                                />
                                <InputField
                                    label="Relationship with minor"
                                    width={responsiveWidth(90)}
                                    placeholder="Relationship"
                                    value={Form.guardian_relation}
                                    // labelStyle={{ color: colors.gray }}
                                    onChangeText={(value: string) => {
                                        handleFormChange({ key: 'guardian_relation', value })
                                    }}
                                    borderColor={colors.gray}
                                    error={FormError.guardian_relation}
                                />
                            </>

                            :
                            null
                    }
                </Wrapper>
                <Spacer y='N' />
            </Container>
            <CusButton
                loading={continueLoading}
                radius={borderRadius.ring}
                width={responsiveWidth(90)}
                title="Next"
                lgcolor1={colors.primary}
                lgcolor2={colors.secondry}
                position="center"
                onPress={() => { submit() }}
                textStyle={{ fontSize: fontSize.medium }}
                textWeight="semibold"
            />
        </>
    )
}
export default NomineeDetail