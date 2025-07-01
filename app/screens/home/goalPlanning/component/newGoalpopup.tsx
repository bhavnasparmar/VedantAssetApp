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
import Ionicons from 'react-native-vector-icons/Ionicons';

const NewGoalpopup = ({ isVisible, goalID, setisVisible, flag, goalPlanID, goalPlanName, riskProfileData, editGoalData }: any) => {


    const [isFocus, setIsFocus] = useState(false);
    const [isSubmited, setisSubmited] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [slidervalue, setsliderValue] = useState(0)
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [isCalculated, setIsClculated] = useState<boolean>(false);
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
        console.log('editGoalData : ', editGoalData)
         setForm({
                ...Form,
                title: '',
                targetammount: '',
                inflation: 0,
                months: '',
            });
            setFormError({
                ...FormError,
                title: '',
                targetammount: '',
                inflation: '',
                months: '',
            })
       
            if (editGoalData) {
                getEditDetails(editGoalData)
            }
      


        return () => {
            setForm({
                ...Form,
                title: '',
                targetammount: '',
                inflation: 0,
                months: '',
            });
            setFormError({
                ...FormError,
                title: '',
                targetammount: '',
                inflation: '',
                months: '',
            })

        };

    }, [isVisible,isFocused]);




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
            ...FormError,
            title: '',
            targetammount: '',
            inflation: '',
            months: '',
        })
        setisVisible(false)
        flag(true)
    }

    const getEditDetails = async (data: any) => {
        try {
        //      setForm({
        //     title: '',
        //     targetammount: '',
        //     inflation: 0,
        //     months: '',
        // });
        console.log('Edit goal Data 1: ', data)
          setFormError({
            ...FormError,
            title: '',
            targetammount: '',
            inflation: '',
            months: '',
        })
        let inflation:any = 0
        if (Number(data?.inflation_perc) === 0 || data?.inflation_perc === undefined) {
                setIsEnabled(false)
                inflation=''
                // setForm({
                //     ...Form,
                //     inflation: 0,
                // });
                // handleFormChange({ key: 'inflation', value: '' })
            } else {

                setIsEnabled(true)
                // handleFormChange({ key: 'inflation', value: data?.inflation_perc })
                inflation=Number(data?.inflation_perc)
                // setForm({
                //     ...Form,
                //     inflation: Number(data?.inflation_perc),
                // });
            }
      
         setForm({
            title: data?.goal_label,
            targetammount:  String(data?.target_amt),
            inflation: inflation,
            months: data?.duration_mts === 0 ? String(data?.sip_duration_mts) : String(data?.duration_mts),
        });
            // console.log('Edit goal Data 1: ', data?.inflation_perc)
            // setEditedData(data)
            // handleFormChange({ key: 'title', value: data?.goal_label })
            // handleFormChange({ key: 'targetammount', value: String(data?.target_amt) })
            // if (Number(data?.inflation_perc) === 0 || data?.inflation_perc === undefined) {
            //     setIsEnabled(false)
            //     setForm({
            //         ...Form,
            //         inflation: 0,
            //     });
            //     // handleFormChange({ key: 'inflation', value: '' })
            // } else {

            //     setIsEnabled(true)
            //     // handleFormChange({ key: 'inflation', value: data?.inflation_perc })
            //     setForm({
            //         ...Form,
            //         inflation: Number(data?.inflation_perc),
            //     });
            // }
            // handleFormChange({ key: 'months', value: data?.duration_mts === 0 ? String(data?.sip_duration_mts) : String(data?.duration_mts) })

        } catch (error: any) {
            console.log('getEditDetails Catch Error 1', error)
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
                months: MYType === 1 ? Form.months : 12 * Number(Form.months),
                risk_category_id: riskProfileData?.riskProfileId,
                inflation_rate: Form.inflation,
                goal_type_id: goalPlanID

            }
            console.log('Payload : ', payload)
            setLoader(true)
            const result: any = await goalcal(payload);
            console.log(result[0].data, "result?.data")
            console.log(result, "result?.data")
            if (result[0].data) {
                setGoalPlanningDetails(null)
                setLoader(false)

                let data = result[0].data
                data.months = MYType === 1 ? Form.months : 12 * Number(Form.months)
                data.inflation_rate = Form.inflation
                data.title = Form.title
                data.targetammount = Form.targetammount
                data.goal_type_id = goalPlanID !== '' ? EditedData?.goal_type_id : goalID
                setGoalPlanningDetails(data)
                clearFomrData()
                
                showToast(toastTypes.success, 'Goal Calculated')
            }
            else {
                showToast(toastTypes.info, 'Try Again')
            }
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
            {/* <Wrapper color={colors.Hard_White} position='center' width={responsiveWidth(95)} customStyles={{ padding: responsiveWidth(1), borderRadius: borderRadius.middleSmall }}>
                <Wrapper align='center' row justify='apart' customStyles={{paddingHorizontal:responsiveWidth(3),paddingVertical:responsiveWidth(2)}}>
                    <CusText color={colors.label} semibold size='N' text={goalPlanName || 'Goal Plan'} />
                    <Wrapper align='center' row customStyles={{ gap: responsiveWidth(2) }}>
                        <Wrapper row align='center'>
                            <CusText color={colors.label} text={'Risk Profile-'} size="SS" />
                            <CusText color={colors.label} position='center' text={riskProfileData?.RiskCategory?.risk_type} size="SS" />
                        </Wrapper>
                        <IonIcon onPress={() => { clearData() }} name='close' size={responsiveWidth(5)} />
                    </Wrapper>
                </Wrapper>
                <Wrapper position='center' color={colors.gray} height={responsiveWidth(0.3)} width={responsiveWidth(90)} customStyles={{}} />
                <Wrapper align='center' row justify='apart' customStyles={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(4)}}>
                    <CusText size='SS' bold text={'Title'} />
                    <InputField
                        fieldColor={colors.Hard_White}
                        width={responsiveWidth(50)}
                        placeholder="Enter Title"
                        value={''}
                        onChangeText={(text: string) => {
                           
                        }}
                        placeholderColor={colors.gray}
                        borderColor={colors.fieldborder}
                        fieldViewStyle={{
                            height: responsiveWidth(8),
                            borderRadius: borderRadius.normal
                        }}
                        style={{
                            borderColor: colors.fieldborder
                        }}
                    />
                </Wrapper>
                 <Wrapper position='center' color={colors.gray} height={responsiveWidth(0.3)} width={responsiveWidth(90)} customStyles={{}} />
                <Wrapper align='center'  customStyles={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(4)}}>
                         <CusText size='SS' bold text={'How much money do you need to start your goal Business?'} />
                         <Spacer y='XXS' />
                    <InputField
                        fieldColor={colors.Hard_White}
                        placeholder="Enter Title"
                        value={''}
                        onChangeText={(text: string) => {

                        }}
                        placeholderColor={colors.gray}
                        borderColor={colors.fieldborder}
                        fieldViewStyle={{
                            height: responsiveWidth(8),
                            borderRadius: borderRadius.normal
                        }}
                        style={{
                            borderColor: colors.fieldborder
                        }}
                    />
                </Wrapper>
                 <Wrapper position='center' color={colors.gray} height={responsiveWidth(0.3)} width={responsiveWidth(90)} customStyles={{}} />
                  <Wrapper align='center' row  customStyles={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(4)}}>
                          <Ionicons name={'square-outline'} size={responsiveWidth(5)} />
                            <CusText text={' '} />
                          <CusText size='S' text={'Do you want to adjust the goal amount for inflation ?'} />
                 </Wrapper>
                  <Wrapper position='center' color={colors.gray} height={responsiveWidth(0.3)} width={responsiveWidth(90)} customStyles={{}} />
                   <Wrapper align='center'  customStyles={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(4)}}>
                         <CusText size='SS' position='left' bold text={'When do you need these funds for Custom ?'} />
                         <Spacer y='XXS' />
                    <Wrapper row align='center' justify='apart'>
                        <InputField
                            fieldColor={colors.Hard_White}
                            width={responsiveWidth(40)}
                            placeholder="Month/Years"
                            value={''}
                            onChangeText={(text: string) => {

                            }}
                            placeholderColor={colors.gray}
                            borderColor={colors.fieldborder}
                            fieldViewStyle={{
                                height: responsiveWidth(8),
                                borderRadius: borderRadius.normal
                            }}
                            style={{
                                borderColor: colors.fieldborder
                            }}
                        />
                        <Spacer x='S' />
                        <InputField
                            fieldColor={colors.Hard_White}
                            width={responsiveWidth(40)}
                            placeholder="Enter Title"
                            value={''}
                            onChangeText={(text: string) => {

                            }}
                            placeholderColor={colors.gray}
                            borderColor={colors.fieldborder}
                            fieldViewStyle={{
                                height: responsiveWidth(8),
                                borderRadius: borderRadius.normal
                            }}
                            style={{
                                borderColor: colors.fieldborder
                            }}
                        />
                    </Wrapper>
                </Wrapper>
            </Wrapper> */}
            <Wrapper position='center' width={responsiveWidth(95)} align='center'
                customStyles={{
                    backgroundColor: colors.Hard_White,
                    borderRadius: borderRadius.normal
                }}>
                <Spacer y='XXS' />
                <Wrapper width={responsiveWidth(90)} row justify='apart' align='center' customStyles={{
                    paddingVertical: responsiveWidth(2),
                    paddingHorizontal: responsiveWidth(2)
                }}>

                    <CusText semibold color={colors.label} size='M' position='center' text={goalPlanName || 'Goal Plan'} />
                    <Wrapper row align='center' customStyles={{gap:responsiveWidth(2)}}>
                        <Wrapper row align='center'>
                            <CusText size='SS' color={colors.label} text={'Risk Profile-'} />
                            <CusText size='SS' color={colors.label} text={riskProfileData?.RiskCategory?.risk_type} />
                        </Wrapper>
                        <IonIcon onPress={() => { clearData() }} name='close' color={colors.black} size={24} ></IonIcon>
                    </Wrapper>
                </Wrapper>

                <Wrapper
                    customStyles={{
                        height: responsiveHeight(0.1),
                        width: responsiveWidth(90),
                        backgroundColor: colors.gray,
                    }}
                />
                  <Wrapper  width={responsiveWidth(90)} align='center' row justify='apart' customStyles={{paddingHorizontal:responsiveWidth(4),paddingVertical:responsiveWidth(3)}}>
                    <CusText size='SS' bold text={'Title'} />
                    {/* <InputField
                        value={Form.title}
                        width={responsiveWidth(50)}
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
                    /> */}
                      <InputField
                        fieldColor={colors.Hard_White}
                        width={responsiveWidth(50)}
                        placeholder="Enter Title"
                         value={Form.title}
                         onChangeText={(value: string) => {
                            handleFormChange({ key: 'title', value })
                        }}
                        placeholderColor={colors.gray}
                        borderColor={colors.fieldborder}
                        fieldViewStyle={{
                            height: responsiveWidth(10),
                            borderRadius: borderRadius.normal
                        }}
                        style={{
                            borderColor: colors.fieldborder
                        }}
                          error={FormError.title}
                    />
                </Wrapper>
                 <Wrapper
                    customStyles={{
                        height: responsiveHeight(0.1),
                        width: responsiveWidth(90),
                        backgroundColor: colors.gray,
                    }}
                />
                 {/* <Wrapper position='center'  width={responsiveWidth(90)}>
                        <CusText size='SS' bold text={'How much money do you need to start your goal Business?'} />
                <InputField
                  
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
                </Wrapper> */}
                <Wrapper align='center' customStyles={{ paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveWidth(3) }}>
                    <CusText size='SS' bold text={'How much money do you need to start your goal Business?'} />
                    <Spacer y='XXS' />
                    <InputField
                        fieldColor={colors.Hard_White}
                        placeholder="Enter Amount"
                        value={Form.targetammount}
                        inputMode='numeric'
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'targetammount', value })
                        }}
                        placeholderColor={colors.gray}
                        borderColor={colors.fieldborder}
                        fieldViewStyle={{
                            height: responsiveWidth(10),
                            borderRadius: borderRadius.normal
                        }}
                        style={{
                            borderColor: colors.fieldborder
                        }}
                        error={FormError.targetammount}
                    />
                </Wrapper>
                <Wrapper
                    customStyles={{
                        height: responsiveHeight(0.1),
                        width: responsiveWidth(90),
                        backgroundColor: colors.gray,
                    }}
                />
                 <Wrapper align='center' row customStyles={{ paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveWidth(4) }}>
                    <TouchableOpacity onPress={()=>{setIsEnabled(!isEnabled)}}>
                     <Ionicons name={isEnabled ? 'checkbox' : 'square-outline'} size={responsiveWidth(4)} />
                     </TouchableOpacity>
                     <CusText text={' '} />
                          <CusText size='S' text={'Do you want to adjust the goal amount for inflation ?'} />
                    {/* <Spacer y='XXS' />
                    <InputField
                        fieldColor={colors.Hard_White}
                        placeholder="Enter Amount"
                        value={Form.targetammount}
                        inputMode='numeric'
                        onChangeText={(value: string) => {
                            handleFormChange({ key: 'targetammount', value })
                        }}
                        placeholderColor={colors.gray}
                        borderColor={colors.fieldborder}
                        fieldViewStyle={{
                            height: responsiveWidth(10),
                            borderRadius: borderRadius.normal
                        }}
                        style={{
                            borderColor: colors.fieldborder
                        }}
                        error={FormError.targetammount}
                    /> */}
                </Wrapper>
                 
                {/* <Wrapper row align='center' width={responsiveWidth(85)} justify='apart'>
                    <CusText semibold text={'Do you want to adjust the goal amount for inflation ?'}
                        size="SS" color={colors.inputLabel} customStyles={{ width: responsiveWidth(50) }} />
                    <Wrapper row align='center' justify='apart' >
                        <CusText text={'No'} size="SS" color={colors.inputLabel} medium customStyles={{}} />
                        <Spacer x='XXS' />
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
                        <Spacer x='XXS' />
                        <CusText text={'Yes'} size="SS" color={colors.inputLabel} medium customStyles={{}} />
                    </Wrapper>
                </Wrapper> */}

                {isEnabled ?
                    <>
                        {/* <Spacer y='S' /> */}
                        <Wrapper align='center' justify='apart' width={responsiveWidth(85)} row customStyles={{paddingVertical:responsiveWidth(1)}}>
                            <Wrapper position='center' width={responsiveWidth(70)} row align='center'>
                                <CusText text={0} size="SL" color={colors.inputLabel} semibold />
                                <Slider
                                    style={styles.slider}
                                    minimumValue={0}
                                    maximumValue={9}
                                    step={1}
                                    // value={slidervalue}
                                    value={Form.inflation}
                                    onValueChange={(val: any) => {
                                        setsliderValue(val)
                                        handleFormChange({ key: 'inflation', value: val })
                                    }}
                                    minimumTrackTintColor={colors.primary}
                                    maximumTrackTintColor={colors.gray}
                                    thumbTintColor={colors.primary}
                                />
                                <CusText text={9} size="SL" color={colors.inputLabel} semibold customStyles={{ marginRight: responsiveWidth(0) }} />
                            </Wrapper>

                            <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveWidth(1), borderRadius: borderRadius.middleSmall }} position='center' align='center' justify='center' color={colors.lightGray}>
                                <CusText
                                    // text={slidervalue}
                                    text={Form.inflation ? Form.inflation : 0}
                                    size="M" color={colors.primary} extraBold />
                            </Wrapper>
                        </Wrapper>
                    </>
                    : null
                }
                 <Wrapper
                    customStyles={{
                        height: responsiveHeight(0.1),
                        width: responsiveWidth(90),
                        backgroundColor: colors.gray,
                    }}
                />
                <Wrapper align='center' customStyles={{ paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveWidth(3) }}>
                    <CusText position='left' size='SS' bold text={'When do you need these funds for Business ?'} />
                    <Spacer y='XXS' />
                    <Wrapper row align='start' justify='apart'>
                        <InputField
                            fieldColor={colors.Hard_White}

                            value={Form.months}
                            inputMode='numeric'
                            width={responsiveWidth(40)}
                            placeholder={MYType === 1 ? "Enter Month" : "Enter Year"}
                            onChangeText={(value: string) => {
                                handleFormChange({ key: 'months', value })
                            }}
                            placeholderColor={colors.gray}
                            borderColor={colors.fieldborder}
                            fieldViewStyle={{
                                height: responsiveWidth(10),
                                borderRadius: borderRadius.normal
                            }}
                            style={{
                                borderColor: colors.fieldborder
                            }}
                            error={FormError.months}
                        />
                        <Spacer x='XXS' />
                        {/* <Wrapper position='center' align='center' justify='apart' color={colors.Hard_White} width={responsiveWidth(40)} height={responsiveWidth(10)} customStyles={{borderWidth:1,borderColor:colors.gray,borderRadius: borderRadius.middleSmall}}>
                           <CusText text={'Select Month'} />
                           <IonIcon  /> */}
                            <DropDown
                                data={months}
                                placeholder={'Months'}
                                width={responsiveWidth(40)}
                                placeholdercolor={colors.Hard_White}
                                value={MYType}
                                fieldColor={colors.Hard_White}
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
                                fieldViewStyle={{height: responsiveWidth(10)}}
                            />
                        {/* </Wrapper> */}
                    </Wrapper>
                </Wrapper>
                     <Wrapper
                    customStyles={{
                        height: responsiveHeight(0.1),
                        width: responsiveWidth(90),
                        backgroundColor: colors.gray,
                    }}
                />
                {/* <Spacer y='XS' /> */}
                {/* <Wrapper row width={responsiveWidth(87)}>
                    <CusText semibold text={'When do you need these funds for Business ?'}
                        size="SS" color={colors.inputLabel} customStyles={{}} />
                </Wrapper>
                <Wrapper row align='center' justify="apart" width={responsiveWidth(90)}>
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
                <Spacer y='S' /> */}

                {/* <Wrapper row width={responsiveWidth(85)} align='center'>
                    <CusText text={'Risk Profile'} size="N" color={colors.inputLabel} medium />
                    <Wrapper customStyles={styles.riskfield} align='center'>
                        <CusText position='center' text={riskProfileData?.RiskCategory?.risk_type} size="S" color={'#E59F39'} medium />
                    </Wrapper>
                </Wrapper> */}
                <Spacer y='XS' />
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