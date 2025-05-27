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
import { Image, TouchableOpacity } from "react-native";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { showToast } from "../../../../../services/toastService";
import { toastTypes } from "../../../../../constant/constants";
import { styles } from "../../../../../shared/components/CommonAlert/commonModalStyle";
import Ionicons from "react-native-vector-icons/Ionicons";


const Alert = ({
    visible,
    onClose,
    imageSource,
    iconName,
    iconSize,
    iconColor = '#000',
    title,
    description,
    button1Text,
    onButton1Press,
    button2Text,
    onButton2Press,
}: any) => {
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
            // setAlertClose(false)
            onClose()
            setTimeout(() => {
                navigation.navigate('RiskProfile');
            }, 2000);

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
                {/* <Wrapper color={colors.white} customStyles={{
                    padding: responsiveWidth(2),
                    borderRadius: borderRadius.medium
                }}>
                    <Wrapper position="center">
                        <IonIcon size={responsiveWidth(15)} color={colors.primary} name="alert-circle-outline" />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <CusText color={colors.primary} size="N" position="center" text={alertName} />
                    <Spacer y="XXS" />
                    <Wrapper >
                        <CusButton
                            radius={borderRadius.medium}
                            height={responsiveWidth(10)}
                            width={responsiveWidth(50)}
                            title="Continue"
                            lgcolor1={colors.orange}
                            lgcolor2={colors.orange}
                            position="center"
                            onPress={() => { onClose() }}
                        // textStyle={{ fontSize: fontSize.medium }}

                        />

                    </Wrapper>
                </Wrapper> */}
                <Wrapper
                    width={responsiveWidth(80)}
                    color={colors.white}
                    align='center'
                    customStyles={styles.modalContainer}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={colors.primary} />
                    </TouchableOpacity>

                    {/* Image or Icon */}
                    {imageSource ? (
                        <Image source={imageSource} style={styles.image} />
                    ) : iconName ? (
                        <Ionicons name={iconName} size={iconSize} color={iconColor} />
                    ) : null}

                    {/* Title */}
                    {title && <CusText bold size={"SL"} color={colors.primary} semibold customStyles={styles.title} text={title} />}

                    {/* Description */}
                    {description && <CusText size={"S"} color={colors.primary} semibold customStyles={styles.description} text={description} />}

                    {/* Buttons */}
                    <Wrapper width={responsiveWidth(70)} customStyles={styles.buttonContainer}>
                        {button1Text && (
                            // <TouchableOpacity style={styles.button} onPress={onButton1Press}>
                            //     <CusText bold customStyles={styles.buttonText} text={button1Text} />
                            // </TouchableOpacity>
                            <Wrapper>
                                <CusButton
                                    height={responsiveWidth(10)}
                                    width={responsiveWidth(31)}
                                    title={button1Text}
                                    position="center"
                                    radius={borderRadius.medium}
                                    onPress={onButton1Press}
                                    lgcolor1={colors.orange} lgcolor2={colors.orange}
                                />
                            </Wrapper>
                        )}
                        {button2Text && (
                            // <TouchableOpacity style={styles.button} onPress={onButton2Press}>
                            //     {/* <Text style={styles.buttonText}>{button2Text}</Text> */}
                            //     <CusText bold customStyles={styles.buttonText} text={button2Text} />
                            // </TouchableOpacity>
                            <Wrapper>
                                <CusButton
                                    height={responsiveWidth(10)}
                                    width={responsiveWidth(31)}
                                    title={button2Text}
                                    position="center"
                                    radius={borderRadius.medium}
                                    onPress={onButton2Press}
                                    lgcolor1={colors.orange} lgcolor2={colors.orange}
                                />
                            </Wrapper>
                        )}
                    </Wrapper>
                </Wrapper>
            </>
        </Modal>
    )
}

export default Alert