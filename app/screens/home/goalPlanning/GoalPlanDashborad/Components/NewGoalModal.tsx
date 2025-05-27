import React, { useEffect, useState } from "react"
import Modal from "react-native-modal";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Wrapper from "../../../../../ui/wrapper";
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from "../../../../../styles/variables";
import CusText from "../../../../../ui/custom-text";
import IonIcon from 'react-native-vector-icons/Ionicons';
import Spacer from "../../../../../ui/spacer";
import InputField from "../../../../../ui/InputField";
import Slider from "@react-native-community/slider";
import DropDown from "../../../../../ui/dropdown";
import CusButton from "../../../../../ui/custom-button";
import { TouchableOpacity } from "react-native";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { showToast } from "../../../../../services/toastService";
import { toastTypes } from "../../../../../constant/constants";


const NewGoalModal = ({ visible, onClose, goalName, riskDetailsData }: any) => {
    const isFocused: any = useIsFocused()
    const navigation: any = useNavigation()
    const [isFocus, setIsFocus] = useState(false);
    const [isInflation, setIsInflation] = useState(false);
    const [isSubmited, setisSubmited] = useState<boolean>(false);
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
    const [MYType, setMYType] = useState<any>(1)
    const [Form, setForm] = useState({
        title: '',
        targetammount: '',
        inflation: 1,
        months: '',
    });
    const [FormError, setFormError] = useState({
        title: '',
        targetammount: '',
        inflation: '',
        months: '',
    });
    useEffect(() => {
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
    }, [isFocused])
    const handleFormChange = (values: any) => {
        const { key, value } = values;
        setForm((prev: any) => ({ ...prev, [key]: value }));
        handleValidate(isSubmited, values);
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
        if (isInflation) {
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


    const submit = async () => {
        try {

            navigation?.navigate('SelectScheme', { riskId: riskDetailsData?.riskProfileId })

            return
            const submited = true;
            setisSubmited(submited);
            const isValid = handleValidate(submited, null);
            if (!isValid) return;
        } catch (error: any) {
            console.log('submit catch Error : ', error)
            showToast(toastTypes.error, error)
        }
    }


    return (
        <Modal
            isVisible={visible}

            useNativeDriver={true}>
            <>
                <Wrapper color={colors.white} customStyles={{
                    padding: responsiveWidth(2),
                    borderRadius: borderRadius.medium
                }}>
                    <Wrapper row justify="apart" align="center" customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                        <CusText text={goalName || 'Name'} semibold size="M" />
                        <Wrapper row align="center">
                            <CusText text={'Risk Profile - Moderate'} />
                            <Spacer x="XXS" />
                            <TouchableOpacity activeOpacity={0.6} onPress={() => { onClose() }}>
                                <IonIcon name={'close-outline'} color={colors.black} size={responsiveWidth(6)} />
                            </TouchableOpacity>
                        </Wrapper>
                    </Wrapper>
                    <Wrapper
                        position="center"
                        customStyles={{ marginHorizontal: responsiveWidth(1), marginTop: responsiveWidth(1) }}
                        width={responsiveWidth(85)}
                        height={responsiveWidth(0.5)}
                        color="rgba(226, 226, 226, 1)"
                    />
                    <Spacer y="XXS" />
                    <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                        <CusText text={'Title'} size="N" />
                        <InputField
                            value={Form?.title}
                            // width={responsiveWidth(50)}
                            placeholder="Enter Title"
                            onChangeText={(value: string) => {
                                handleFormChange({ key: 'title', value })
                            }}
                            borderColor={colors.placeholderColor}
                            error={FormError.title}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper
                        position="center"
                        customStyles={{ marginHorizontal: responsiveWidth(1) }}
                        width={responsiveWidth(85)}
                        height={responsiveWidth(0.25)}
                        color="rgba(226, 226, 226, 1)"
                    />
                    <Spacer y="XXS" />
                    <Wrapper justify="apart" customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                        <CusText text={`How much money do you need to start your goal ${goalName}?`} size="N" />
                        <Spacer y="XXS" />
                        <InputField
                            value={Form.targetammount}
                            placeholder="Enter Amount"
                            onChangeText={(value: string) => {
                                handleFormChange({ key: 'targetammount', value })
                            }}
                            borderColor={colors.placeholderColor}
                            error={FormError.targetammount}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper
                        position="center"
                        customStyles={{ marginHorizontal: responsiveWidth(1) }}
                        width={responsiveWidth(85)}
                        height={responsiveWidth(0.25)}
                        color="rgba(226, 226, 226, 1)"
                    />
                    <Spacer y="XXS" />
                    <Wrapper justify="apart" customStyles={{ paddingHorizontal: responsiveWidth(1.5) }}>
                        <Wrapper row justify="apart">
                            <TouchableOpacity activeOpacity={0.6} onPress={() => { setIsInflation(!isInflation) }}>
                                <IonIcon name="checkbox" size={responsiveWidth(5)} color={isInflation ? colors.primary : colors.gray} />
                            </TouchableOpacity>

                            <CusText customStyles={{ marginLeft: responsiveWidth(2) }} text={'Do you want to adjust the goal amount for inflation ?'} size="N" />
                        </Wrapper>
                        {
                            isInflation ?
                                (
                                    <>
                                        <Spacer y="XXS" />
                                        <Wrapper align="center" row justify="apart" customStyles={{ paddingHorizontal: responsiveWidth(5) }}>
                                            <Wrapper align="center" justify="apart" row>
                                                <CusText text={1} size="SS" />
                                                <Slider
                                                    style={{
                                                        width: responsiveWidth(50),
                                                        height: 20,
                                                        position: "relative",
                                                        zIndex: 1,
                                                    }}
                                                    minimumValue={1}
                                                    maximumValue={9}
                                                    step={1}
                                                    value={Form.inflation}

                                                    onValueChange={(val: any) => {
                                                        handleFormChange({ key: 'inflation', value: val })
                                                    }}
                                                    minimumTrackTintColor={colors.primary}
                                                    maximumTrackTintColor="gray"
                                                    thumbTintColor={colors.primary}

                                                />
                                                <CusText text={9} size="SS" />
                                            </Wrapper>
                                            <Wrapper position="center" align="center" justify="center">
                                                <Wrapper position="center" align="center" justify="center" customStyles={{ paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveWidth(1), borderRadius: borderRadius.medium, borderWidth: responsiveWidth(0.25), borderColor: colors.gray }}>
                                                    <CusText text={Form.inflation} size="N" />
                                                </Wrapper>
                                            </Wrapper>
                                        </Wrapper>
                                    </>
                                ) :
                                null
                        }

                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper
                        position="center"
                        customStyles={{ marginHorizontal: responsiveWidth(1) }}
                        width={responsiveWidth(85)}
                        height={responsiveWidth(0.25)}
                        color="rgba(226, 226, 226, 1)"
                    />
                    <Spacer y="XXS" />
                    <Wrapper justify="center" customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                        <CusText text={`When do you need these funds for ${goalName}?`} size="N" />
                        <Spacer y="XXS" />
                        <Wrapper row align="center" justify="apart" >
                            <InputField
                                value={Form.months}
                                width={responsiveWidth(35)}
                                placeholder={MYType === 1 ? "Enter Month" : "Enter Year"}
                                onChangeText={(value: string) => {
                                    handleFormChange({ key: 'months', value })
                                }}
                                borderColor={colors.placeholderColor}
                                error={FormError.months}
                            />
                            <DropDown
                                data={months}
                                placeholder={'Select Type'}
                                width={responsiveWidth(35)}
                                placeholdercolor={colors.gray}
                                value={MYType}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                valueField="id"
                                labelField={'Name'}
                                onChange={(item: any) => {
                                    setIsFocus(false);
                                    setMYType(item?.id)
                                }}
                                onClear={
                                    () => {
                                        setIsFocus(false);
                                    }
                                }
                            // error={FormError?.accountType}
                            />
                        </Wrapper>
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper
                        position="center"
                        customStyles={{ marginHorizontal: responsiveWidth(1) }}
                        width={responsiveWidth(85)}
                        height={responsiveWidth(0.25)}
                        color="rgba(226, 226, 226, 1)"
                    />
                    <Spacer y="XXS" />
                    <Wrapper>
                        <CusButton
                            radius={borderRadius.medium}
                            height={responsiveWidth(10)}
                            width={responsiveWidth(50)}
                            title="Calculate"
                            lgcolor1={colors.orange}
                            lgcolor2={colors.orange}
                            position="center"
                            onPress={() => { submit() }}
                            textStyle={{ fontSize: fontSize.medium }}
                            textWeight="semibold"
                        />
                    </Wrapper>
                </Wrapper>
            </>
        </Modal>
    )
}

export default NewGoalModal