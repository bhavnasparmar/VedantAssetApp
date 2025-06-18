import React, { useEffect, useState } from 'react'
import Modal from "react-native-modal";
import Wrapper from '../../../../ui/wrapper';
import CusText from '../../../../ui/custom-text';
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../../../styles/variables';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DropDown from '../../../../ui/dropdown';
import CusButton from '../../../../ui/custom-button';
import Spacer from '../../../../ui/spacer';
import { useIsFocused } from '@react-navigation/native';
import { Switch, TouchableOpacity } from 'react-native';
import InputField from '../../../../ui/InputField';
import Slider from '@react-native-community/slider';
import { styles } from '../goaltabview/goalDashboardStyle';
import { getLoginUserDetails, setGoalPlanningDetails, USER_DATA } from '../../../../utils/Commanutils';
import API from '../../../../utils/API';
import { showToast, toastTypes } from '../../../../services/toastService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { goalcal } from '../../../../api/homeapi';

const NewGoalpopup = ({ isVisible, goalID, setisVisible, flag, goalPlanID, goalPlanName,riskProfileData }: any) => {


    const [isFocus, setIsFocus] = useState(false);
    const [isSubmited, setisSubmited] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [slidervalue, setsliderValue] = useState(0)
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [EditedData, setEditedData] = useState<any>({});
    const [months, setmonths] = useState<any>([
        {
            id: 1,
            Name: 'Months'
        },
        {
            id: 2,
            Name: 'Year'

        },
    ])
    const [MYType, setMYType] = useState<any>('')
    const [Form, setForm] = useState({
        title: '',
        targetammount: '',
        inflation: 0,
        months: '',
    });
    const [FormError, setFormError] = useState({
        title: '',
        targetammount: '',
        inflation: '',
        months: '',
    });
    const isFocused = useIsFocused();

    useEffect(() => {
        if (goalPlanID !== '') {
            getEditDetails(goalPlanID)
        }

        return () => {
            setForm({
                title: '',
                targetammount: '',
                inflation: 0,
                months: '',
            });
            setFormError({
                title: '',
                targetammount: '',
                inflation: '',
                months: '',
            })
        };
    }, [isFocused, goalPlanID]);




    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        if (isEnabled == false) {
        } else {
        }
    };

    const clearData = () => {
        setisVisible(false)
    }

    const clearFomrData = () => {
        setForm({
            title: '',
            targetammount: '',
            inflation: 0,
            months: '',
        });
        setFormError({
            title: '',
            targetammount: '',
            inflation: '',
            months: '',
        })
        setisVisible(false)
                  flag(true) 
    }

    const getEditDetails = async (goal_plan_id: any) => {
        try {
            const result: any = await API.get(`goal-plans/goal-details/${goal_plan_id}`);
            if (result?.code === 200) {
                setEditedData(result?.data?.goal)
                handleFormChange({ key: 'title', value: result?.data?.goal?.goal_label })
                handleFormChange({ key: 'targetammount', value: String(result?.data?.goal?.target_amt) })
                if (result?.data?.goal?.inflation_perc !== 0) {
                    setIsEnabled(true)
                    handleFormChange({ key: 'inflation', value: result?.data?.goal?.inflation_perc })
                }
                handleFormChange({ key: 'months', value: String(result?.data?.goal?.duration_mts) })
            } else {
                // showToast(toastTypes.info, result?.msg)
            }
        } catch (error: any) {
            console.log('getEditDetails Catch Error', error)
            showToast(toastTypes.error, error[0].msg)
        }
    }

    const handleFormChange = (values: any) => {
        const { key, value } = values;
        setForm((prev: any) => ({ ...prev, [key]: value }));
        handleValidate(isSubmited, values);
    };

    const submit = async () => {

        try {
            const submited = true;
            setisSubmited(submited);
            const isValid = handleValidate(submited, null);
            if (!isValid) return;
 const useretail: any = await AsyncStorage.getItem(USER_DATA);

    let useretail1 = JSON.parse(useretail);
            let payload = {        
    user_id: useretail1?.id,
    target_amount: Form.targetammount,
    months:  MYType === 1 ? Form.months : 12 * Number(Form.months),
    risk_category_id: riskProfileData?.riskProfileId,
    inflation_rate:Form.inflation,
     goal_type_id:goalPlanID

            }
            console.log('Payload : ', payload)
            setLoader(true)
            const result: any = await goalcal(payload);
console.log(result[0].data,"result?.data")
            // if (result?.code === 200) {
                setGoalPlanningDetails(null)
                setLoader(false)
                
                let data =result[0].data
                data.months = MYType === 1 ? Form.months : 12 * Number(Form.months)
                data.inflation_rate = Form.inflation
                data.title = Form.title
                data.targetammount = Form.targetammount
                data.goal_type_id = goalPlanID !== '' ? EditedData?.goal_type_id : goalID
                setGoalPlanningDetails(data)
                
                clearFomrData()
                showToast(toastTypes.success, result?.msg)
            // }
            /*  else {
                setLoader(false)
                showToast(toastTypes.info, result?.msg)

            } */

        } catch (error: any) {
            setLoader(false)
            console.log('submit catch Error : ', error)
            showToast(toastTypes.error, error[0]?.msg)
        }
    };

    function isMonthBetweenSixAndTwelve(month: any) {

        return month >= 6 && month <= 12;
    }

    const handleValidate = (flag = false, values: any) => {
        if (!flag) return;
        let isValid = true;
        let data = Form;

        if (values) {
            const { key, value } = values;
            data = { ...data, [key]: value };
        }
        let title = '';
        if (!data?.title) {
            isValid = false;
            title = 'title is required';
        }

        let targetammount = '';
        if (!data?.targetammount) {
            isValid = false;
            targetammount = 'target ammount is required';
        }
        if (data?.targetammount && Number(data?.targetammount) < 9999) {
            isValid = false;
            targetammount = 'target ammount should be 10,000 or more ';
        }
        let inflation = '';
        if (isEnabled) {
            if (!data?.inflation) {
                isValid = false;
                inflation = 'inflation is required';
            }
        }

        let months = '';
        if (!data?.months) {
            isValid = false;
            months = 'months is required';
        }


        if (data?.months) {
            if (MYType === 1) {
                if (!isMonthBetweenSixAndTwelve(Number(data?.months))) {
                    isValid = false;
                    months = 'The month is not between 6 and 12.';
                }
            }

        }


        setFormError({
            title,
            targetammount,
            inflation,
            months,
        });
        return isValid;
    };

    return (
        <Modal
            isVisible={isVisible}

            animationIn='fadeIn'
            animationOut='fadeOut'
            backdropTransitionOutTiming={0}
            backdropTransitionInTiming={0}
            useNativeDriver={true}>
            <Wrapper position='center' width={responsiveWidth(95)} align='center'
                customStyles={{
                    backgroundColor: colors.Hard_White,
                    borderRadius: borderRadius.normal
                }}>
                <Spacer y='XXS' />
                <Wrapper width={responsiveWidth(90)} row justify='apart' align='center' customStyles={{
                    paddingVertical: responsiveWidth(1.5),
                    paddingHorizontal: responsiveWidth(3)
                }}>

                    <CusText semibold size='M' position='center'
                        text={goalPlanName || 'Goal Plan'} />

                    <IonIcon onPress={() => { clearData() }} name='close-outline' color={colors.black} size={25} ></IonIcon>
                </Wrapper>
                <Spacer y='XXS' />
                <Wrapper
                    customStyles={{
                        height: responsiveHeight(0.1),
                        width: responsiveWidth(90),
                        backgroundColor: colors.lineColor,
                    }}
                />
                <InputField

                    label='Title'
                    value={Form.title}
                    width={responsiveWidth(90)}
                    placeholder="Enter Title"
                    onChangeText={(value: string) => {
                        handleFormChange({ key: 'title', value })
                    }}
                    labelStyle={{ color: colors.inputLabel, fontSize: fontSize.semiSmall }}
                    keyboardType="email-address"
                    borderColor={colors.disablebtn}
                    suffixColor={colors.placeholderColor}
                    error={FormError.title}
                    fieldColor={colors.disablebtn}
                />
                <InputField
                    label='How much money do you need to start your goal Business?'
                    value={Form.targetammount}
                    width={responsiveWidth(90)}
                    placeholder="Enter Amount"
                    inputMode='numeric'
                    onChangeText={(value: string) => {
                        handleFormChange({ key: 'targetammount', value })
                    }}
                    labelStyle={{ color: colors.inputLabel, fontSize: fontSize.semiSmall }}
                    keyboardType="email-address"
                    borderColor={colors.disablebtn}
                    suffixColor={colors.placeholderColor}
                    error={FormError.targetammount}
                    fieldColor={colors.disablebtn}
                />
                <Spacer y='XS' />
                <Wrapper row align='center' width={responsiveWidth(85)} justify='apart'>
                    <CusText  text={'Do you want to adjust the goal amount for inflation ?'}
                        size="SS" color={colors.inputLabel} customStyles={{ width: responsiveWidth(50) }} />
                    <Wrapper row align='center'>
                        <CusText text={'No'} size="SS" color={colors.inputLabel} medium customStyles={{ paddingRight: responsiveWidth(3) }} />
                        <Switch
                            trackColor={{
                                false: colors.gray,
                                true: colors.green,
                            }}
                            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                            ios_backgroundColor={colors.gray}
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                        <CusText text={'Yes'} size="SS" color={colors.inputLabel} medium customStyles={{ paddingRight: responsiveWidth(3) }} />
                    </Wrapper>
                </Wrapper>

                {isEnabled ?
                    <>
                        <Spacer y='S' />
                        <Wrapper align='center' justify='apart' width={responsiveWidth(85)} row customStyles={{ }}>
                            <Wrapper position='center' width={responsiveWidth(70)}  row align='center'>
                                <CusText text={1} size="SS" color={colors.inputLabel} medium />
                                <Slider 
                                    style={styles.slider}
                                    minimumValue={1}
                                    maximumValue={9}
                                    step={1}
                                    // value={slidervalue}
                                    value={Form.inflation}
                                    onValueChange={(val: any) => {
                                        setsliderValue(val)
                                        handleFormChange({ key: 'inflation', value: val })
                                    }}
                                    minimumTrackTintColor={colors.primary}
                                    maximumTrackTintColor="#FFFFFF"
                                    thumbTintColor={colors.primary}
                                />
                                <CusText text={9} size="SS" color={colors.inputLabel} medium customStyles={{ marginRight: responsiveWidth(5) }} />
                            </Wrapper>

                            <Wrapper customStyles={styles.sectralfield}>
                                <CusText
                                    // text={slidervalue}
                                    text={Form.inflation}
                                    size="S" color={colors.inputLabel} medium />
                            </Wrapper>
                        </Wrapper>
                    </>
                    : null
                }

                <Spacer y='XS' />
                <Wrapper row justify="apart" width={responsiveWidth(87)}>
                    <CusText position="left" text={'When do you need these funds for Business ?'} />
                </Wrapper>
                <Wrapper row justify="apart" width={responsiveWidth(90)}>
                    <InputField
                        // label='When do you need these funds for Business ?'
                        value={Form.months}
                        width={responsiveWidth(50)}
                        inputMode='numeric'
                        placeholder={MYType === 1 ? "Enter Month" : "Enter Year"}
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'months', value })
                        }}
                        labelStyle={{
                            color: colors.inputLabel,
                            width: responsiveWidth(50)
                        }}
                        keyboardType="email-address"
                        borderColor={colors.disablebtn}
                        suffixColor={colors.placeholderColor}
                        error={FormError.months}
                        fieldColor={colors.disablebtn}
                    />
                    <DropDown
                        data={months}
                        placeholder={'Months'}
                        width={responsiveWidth(30)}
                        placeholdercolor={colors.Hard_White}
                        value={MYType}
                        fieldColor={colors.disablebtn}
                        onFocus={() => {
                            setIsFocus(true);
                        }}
                        onBlur={() => setIsFocus(false)}
                        valueField="id"
                        labelField={'Name'}
                        onChange={(item: any) => {
                            console.log(item?.id)
                            setMYType(item?.id)
                        }}
                        onClear={
                            () => {
                                setIsFocus(false);
                            }
                        }
                    />
                </Wrapper>
                <Spacer y='S' />

                <Wrapper row width={responsiveWidth(85)} align='start'>
                    <CusText text={'Risk Profile'} size="N" color={colors.inputLabel} medium />
                    <Wrapper customStyles={styles.riskfield}>
                        <CusText text={riskProfileData?.RiskCategory?.risk_type} size="S" color={'#E59F39'} medium />
                    </Wrapper>
                </Wrapper>
                <Spacer y='S' />
                <CusButton
                    loading={loader}
                    width={responsiveWidth(40)}
                    height={responsiveHeight(5)}
                    title="Calculate"
                    color={colors.secondary}
                    position="center"
                    radius={borderRadius.medium}
                  
                    onPress={() => {

                        submit()
                    }}
                />
                <Spacer y='S' />
            </Wrapper>
        </Modal>
    )

}

export default NewGoalpopup;