import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Switch } from "react-native";
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, fontSize, responsiveWidth } from "../../../../styles/variables";
import Container from "../../../../ui/container";
import CusButton from "../../../../ui/custom-button";
import CusText from "../../../../ui/custom-text";
import DropDown from "../../../../ui/dropdown";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import HeaderComponent from "../headercomponent/headercomponent";
import { styles } from "../kycverificationStyles";

const AddressDetails = ({ setSelectedTab, step }: any) => {
    const [isSubmited, setisSubmited] = useState<boolean>(false);
    const [continueLoading, setcontinueLoading] = useState(false);
    const [signZyData, setsignZyData] = useState<any>({});
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const { colors }: any = React.useContext(AppearanceContext);
    const [Form, setForm] = useState({
        citizenOfIndia: '',
        taxPayerIndia: '',
        politicallyExposed: '',
        relatedToPoliticallyExposed: '',
        occupation: '',
        sourceOfIncome: '',
        annualIncome: '',
    });
    const [FormError, setFormError] = useState({
        // citizenOfIndia: '',
        // taxPayerIndia: '',
        // politicallyExposed: '',
        // relatedToPoliticallyExposed: '',
        occupation: '',
        sourceOfIncome: '',
        annualIncome: '',
    });
    const [isFocus, setIsFocus] = useState(false);
    const [occupation, setOccupation] = useState([])
    const [sourceofIncome, setSourceofIncome] = useState([])
    const [annualIncome, setannualIncome] = useState([])
    const navigation: any = useNavigation();
    useEffect(() => {
        getDefaultData()
        getOccupation()
        getSOI()
        getAI()
        getSummeryDetails()
        return () => {
            setForm({
                ...Form,
                citizenOfIndia: '',
                taxPayerIndia: '',
                politicallyExposed: '',
                relatedToPoliticallyExposed: '',
                occupation: '',
                sourceOfIncome: '',
                annualIncome: '',
            });
            setFormError({
                ...FormError,
                occupation: '',
                sourceOfIncome: '',
                annualIncome: '',
            });
        };
    }, [isFocused]);

    useEffect(() => {


        // if (getNew_User()) {
        //     if (step <= getUserObject()?.newKyc?.last_kyc_step) {
        //         getSummeryDetails()
        //     }
        // } else {
        //     if (step <= getLoginUserDetails()?.user_basic_details?.last_kyc_step) {

        //         getSummeryDetails()
        //     }
        // }

        // getSummeryDetails()

    }, [])

    useEffect(() => {
        // const backAction = () => {
        //     navigation.navigate('KycTrack')
        //     return true;
        // };

        // const backHandler = BackHandler.addEventListener(
        //     'hardwareBackPress',
        //     backAction,
        // );

        return () =>
        {}
    }, []);

    const getDefaultData = async () => {
      

    }

    const getSummeryDetails = async () => {
        // try {
        //     const result: any = await API.get('kyc/summaryDetails', {
        //         headers: {
        //             checksum: getNew_User() ? getUserObject()?.newKyc?.id : getLoginUserDetails()?.user_basic_details?.id
        //         }
        //     });
        //     if (result) {

        //         let occupationID: any = null
        //         let sourceID: any = null
        //         let annualID: any = null

        //         const occupationResult: any = await API.get('kyc/occupation_master');
        //         if (occupationResult?.data) {
        //             occupationID = occupationResult?.data.find((item: any) => item.occupation === result?.data?.Investor_declaration?.occupation_id)
        //             if (occupationID) {
        //                 const sourceResult: any = await API.get('kyc/incomesource_master');
        //                 if (sourceResult?.data) {
        //                     sourceID = sourceResult?.data.find((item: any) => item.source_name === result?.data?.Investor_declaration?.income_source_id)
        //                     if (sourceID) {
        //                         const AIresult: any = await API.get('kyc/annual_income_master');
        //                         if (AIresult?.data) {
        //                             annualID = AIresult?.data.find((item: any) => item.income_range === result?.data?.Investor_declaration?.salary_slab_id)
        //                         }
        //                     }
        //                 }

        //             }
        //         }
        //         handleFormChange({
        //             key: 'citizenOfIndia',
        //             value: result?.data?.Investor_declaration?.is_indian_citizen ? 'Yes' : 'No'
        //         })
        //         handleFormChange({
        //             key: 'taxPayerIndia',
        //             value: result?.data?.Investor_declaration?.is_indian_taxpayer ? 'Yes' : 'No'
        //         })
        //         handleFormChange({
        //             key: 'politicallyExposed',
        //             value: result?.data?.Investor_declaration?.is_politically_exposed ? 'Yes' : 'No'
        //         })
        //         handleFormChange({
        //             key: 'relatedToPoliticallyExposed',
        //             value: result?.data?.Investor_declaration?.is_related_to_pep ? 'Yes' : 'No'
        //         })
        //         handleFormChange({
        //             key: 'occupation',
        //             value: occupationID?.id || ''
        //         })
        //         handleFormChange({
        //             key: 'sourceOfIncome',
        //             value: sourceID?.source_id || ''
        //         })
        //         handleFormChange({
        //             key: 'annualIncome',
        //             value: annualID?.ID || ''
        //         })
        //     }
        // } catch (error: any) {
        //     console.log('getSummeryDetails catch Error : ', error)
        //     showToast(toastTypes.error, error[0]?.msg)
        // }
    }

    const getOccupation = async () => {
        // const result: any = await API.get('kyc/occupation_master');
        // setOccupation(result?.data)
    }
    const getSOI = async () => {
        // const result: any = await API.get('kyc/incomesource_master');
        // setSourceofIncome(result?.data)
    }
    const getAI = async () => {
        // const result: any = await API.get('kyc/annual_income_master');
        // setannualIncome(result?.data)
    }

    const submit = async () => {
        // const submited = true;
        // setisSubmited(submited);
        // const isValid = handleValidate(submited, null);
        // if (!isValid) return;
        // try {
        //     let payload = {
        //         is_indian_citizen: Form.citizenOfIndia === 'Yes' ? true : false,
        //         is_politically_exposed: Form.politicallyExposed === 'Yes' ? true : false,
        //         is_indian_taxpayer: Form.taxPayerIndia === 'Yes' ? true : false,
        //         is_related_to_pep: Form.relatedToPoliticallyExposed === 'Yes' ? true : false,
        //         tax_type_id: 1,
        //         occupation_id: Form.occupation,
        //         income_source_id: Form.sourceOfIncome,
        //         salary_slab_id: Form.annualIncome,
        //         investor_id: getNew_User() ? getUserObject()?.newKyc?.id : getLoginUserDetails()?.user_basic_details?.id,
        //         signZy_user_id: signZyData?.data?.userId,
        //         signZy_user_Token: signZyData?.data?.id
        //     }

        //     setcontinueLoading(true)
        //     const result: any = await API.patch('kyc/kycuserDeclaration', payload);
        //     setcontinueLoading(false)
        //     if (result) {
        //         setcontinueLoading(false)
        //         showToast(toastTypes.success, result?.msg)
        //         if (getNew_User()) {
        //             const update_data = updateObjectKey(getUserObject(), 'newKyc', result?.data?.investor_data)
        //             setNewUserObject(update_data)
        //         } else {
        //             const update_data = updateObjectKey(getLoginUserDetails(), 'user_basic_details', result?.data?.investor_data)
        //             setLoginUserDetails(update_data)
        //         }
        //         setSelectedTab('nomineeRoute')
        //     }
        //     else {
        //         setcontinueLoading(false)
        //         showToast(toastTypes.error, 'Some Thing Wrong')
        //     }
        // } catch (error: any) {
        //     setcontinueLoading(false)
        //     console.log('submit catch Error : ', error)
        //     showToast(toastTypes.error, error[0]?.msg)
        // }
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
        if (values) {
            const { key, value } = values;
            data = { ...data, [key]: value };
        }
        // let citizenOfIndia = '';
        // if (!data?.citizenOfIndia) {
        //     isValid = false;
        //     citizenOfIndia = 'Citizenship is required';
        // }
        // let taxPayerIndia = '';
        // if (!data?.taxPayerIndia) {
        //     isValid = false;
        //     taxPayerIndia = 'Tax Payer is required';
        // }
        // let politicallyExposed = '';
        // if (!data?.politicallyExposed) {
        //     isValid = false;
        //     politicallyExposed = 'required field';
        // }
        // let relatedToPoliticallyExposed = '';
        // if (!data?.relatedToPoliticallyExposed) {
        //     isValid = false;
        //     relatedToPoliticallyExposed = 'required field';
        // }
        let occupation = '';
        if (!data?.occupation) {
            isValid = false;
            occupation = 'occupation is required';
        }
        let sourceOfIncome = '';
        if (!data?.sourceOfIncome) {
            isValid = false;
            sourceOfIncome = 'Source of Income is required';
        }
        let annualIncome = '';
        if (!data?.annualIncome) {
            isValid = false;
            annualIncome = 'Annual Income is required';
        }
        setFormError({
            // citizenOfIndia,
            // taxPayerIndia,
            // politicallyExposed,
            // relatedToPoliticallyExposed,
            occupation,
            sourceOfIncome,
            annualIncome
        });
        return isValid;
    };

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        if (isEnabled == false) {
        } else {
        }
    };


    const renderYesNo = (value: any, setvalue: any) => {
        const toggleSwitch = () => {
            const newValue = value === 'Yes' ? 'No' : 'Yes';
            handleFormChange({ key: setvalue, value: newValue });
        };

        return (
            <Wrapper row align="center" customStyles={{ marginLeft: responsiveWidth(5) }}>
                <CusText
                    text="No"
                    size="S"
                    // color={value === 'No' ? colors.primary : colors.inputLabel}
                    semibold
                    customStyles={{ paddingRight: responsiveWidth(3) }}
                />
                <Switch
                    trackColor={{ false: colors.gray, true: colors.green }}
                    thumbColor="#f4f3f4"
                    ios_backgroundColor={colors.gray}
                    onValueChange={toggleSwitch}
                    value={value === 'Yes'}
                />
                <CusText
                    text="Yes"
                    size="S"
                    // color={value === 'Yes' ? colors.primary : colors.inputLabel}
                    semibold
                    customStyles={{ paddingLeft: responsiveWidth(3) }}
                />
                {/* {Error && (
                    <CusText text={Error} size="S" color={colors.gray} underline error />
                )} */}
            </Wrapper>
        );
    };

    const backNavigate = () => {
     
    }

    return (
        <>
            <HeaderComponent name={'KYC Verification'} />
            {/* <SubHeader name={'Declaration'} backAction={() => backNavigate()} /> */}
            <Container Xcenter>
                <Wrapper customStyles={styles.row}>
                    <CusText
                        customStyles={{
                            paddingBottom: responsiveWidth(2),
                        }}
                        text={'1. I am a citizen of India?'}
                        size="SS"
                        color={colors.gray}
                        medium
                    />
                    {renderYesNo(Form.citizenOfIndia, 'citizenOfIndia')}
                </Wrapper>
                <Wrapper customStyles={styles.row}>
                    <CusText
                        customStyles={{
                            paddingBottom: responsiveWidth(2),
                        }}
                        text={'2. I am Tax payer only in India?'}
                        size="SS"
                        color={colors.gray}
                        medium
                    />
                    {renderYesNo(Form.taxPayerIndia, 'taxPayerIndia')}
                </Wrapper>
                <Wrapper customStyles={styles.row}>
                    <CusText
                        customStyles={{
                            paddingBottom: responsiveWidth(2),
                        }}
                        text={'3. I am politically exposed person?'}
                        size="SS"
                        color={colors.gray}
                        medium
                    />
                    {renderYesNo(Form.politicallyExposed, 'politicallyExposed')}
                </Wrapper>
                <Wrapper customStyles={styles.row}>
                    <CusText
                        customStyles={{
                            paddingBottom: responsiveWidth(2),
                        }}
                        text={'4. I am related to a politically exposed person?'}
                        size="SS"
                        color={colors.gray}
                        medium
                    />
                    {renderYesNo(Form.relatedToPoliticallyExposed, 'relatedToPoliticallyExposed')}
                </Wrapper>
                <Spacer y='XXS' />
                <DropDown
                    data={occupation}
                    placeholder={'Select Occupation Type'}
                    placeholdercolor={colors.gray}
                    labelText="Occupation"
                    required
                    value={Form.occupation}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    valueField="id"
                    labelField={'occupation'}
                    onChange={(item: any) => {
                        handleFormChange({ key: 'occupation', value: item.id })
                        setIsFocus(false);
                    }}
                    onClear={
                        () => {
                            handleFormChange({ key: 'occupation', value: '' })
                        }
                    }
                    error={FormError?.occupation}
                />
                <DropDown
                    data={sourceofIncome}
                    placeholder={'Source Of Income'}
                    placeholdercolor={colors.gray}
                    labelText="Source Of Income"
                    required
                    value={Form.sourceOfIncome}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    valueField="source_id"
                    labelField={'source_name'}
                    onChange={(item: any) => {
                        handleFormChange({ key: 'sourceOfIncome', value: item.source_id })
                        setIsFocus(false);
                    }}
                    onClear={
                        () => {
                            handleFormChange({ key: 'sourceOfIncome', value: '' })
                        }
                    }
                    error={FormError?.sourceOfIncome}
                />
                <DropDown
                    data={annualIncome}
                    placeholder={'Select Annual Income'}
                    placeholdercolor={colors.gray}
                    labelText="Annual Income"
                    required
                    value={Form.annualIncome}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    valueField="ID"
                    labelField={'income_range'}
                    onChange={(item: any) => {
                        handleFormChange({ key: 'annualIncome', value: item.ID })
                        setIsFocus(false);
                    }}
                    onClear={
                        () => {
                            handleFormChange({ key: 'annualIncome', value: '' })
                        }
                    }
                    error={FormError?.annualIncome}
                />
                <Spacer y='N' />
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
            </Container>
        </>
    )
}
export default AddressDetails