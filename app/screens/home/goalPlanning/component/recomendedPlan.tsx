import React, { useEffect, useState } from 'react'
import Modal from "react-native-modal";
import Wrapper from '../../../../ui/wrapper';
import CusText from '../../../../ui/custom-text';
import { borderRadius, colors, responsiveHeight, responsiveWidth } from '../../../../styles/variables';
import IonIcon from 'react-native-vector-icons/Ionicons';
import CusButton from '../../../../ui/custom-button';
import Spacer from '../../../../ui/spacer';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { styles } from '../goaltabview/goalDashboardStyle';
import { TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import API from '../../../../utils/API';
import { showToast, toastTypes } from '../../../../services/toastService';
import { getGoalPlanning, setGoalPlanningDetails } from '../../../../utils/Commanutils';

const RecommendedPlan = ({ isVisible, setisVisible, flag, goalPlanID }: any) => {


    const isFocused = useIsFocused();
    const navigation: any = useNavigation();
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {

        return () => {

        };
    }, [isFocused]);


    const clearData = () => {
        setisVisible(false)
    }

    const getMandate = async () => {
        try {

            const result: any = await API.post('account-holdings/check-investors-mandate');
            console.log('getMandate result : ', result)
            if (result?.code === 200) {

            } else {
                console.log('getMandate else error : ', result?.msg)
                showToast(toastTypes.info, result?.msg)
            }

        } catch (error: any) {
            console.log('getMandate catch error : ', error)
            showToast(toastTypes.error, error[0].msg)
        }
    }


    const handleSelect = (option: any) => {
        setSelectedOption(option);
    };

    const submit = () => {

        let data = getGoalPlanning()
        // data.investment = selectedOption
        console.log('data : ', data)
        setGoalPlanningDetails(data)
        setisVisible(false)
        setSelectedOption(null);
        // navigation.navigate('SuggestedScheme', { goalPlanID: goalPlanID })
        navigation.navigate('SuggestedScheme', { goalPlanData: data, goalPlanID: goalPlanID, type: selectedOption })
        // flag(true)
    }

    return (
        <Modal
            isVisible={isVisible}

            animationIn='fadeIn'
            animationOut='fadeOut'
            backdropTransitionOutTiming={0}
            backdropTransitionInTiming={0}
            useNativeDriver={true}>
            <Wrapper width={responsiveWidth(90)}
                customStyles={{
                    backgroundColor: colors.Hard_White,
                    borderRadius: borderRadius.normal
                }}>
                <Wrapper width={responsiveWidth(90)} row justify='apart' align='center' customStyles={{
                    paddingVertical: responsiveWidth(3),
                    paddingHorizontal: responsiveWidth(3)
                }}>

                    <CusText semibold size='M' position='center'
                        text={'Recommended Plan'} />

                    <IonIcon onPress={() => { clearData() }} name='close-outline' color={colors.black} size={25} ></IonIcon>
                </Wrapper>

                <Wrapper
                    customStyles={{
                        height: responsiveHeight(0.1),
                        width: responsiveWidth(90),
                        backgroundColor: colors.gray,
                    }}
                />
                <Spacer y='S' />
                <Wrapper row align='center' justify='apart' customStyles={{ paddingHorizontal: responsiveWidth(4) }}>
                    <TouchableOpacity onPress={() => { handleSelect('Lumpsum') }}>

                        <Wrapper row align='center' customStyles={{
                            // borderRadius: borderRadius.middleSmall,
                            // borderWidth: 1,
                            // borderColor: colors.primary
                        }}>
                            {selectedOption === 'Lumpsum' ? (
                                <>
                                    <IonIcon name='checkmark-circle' color={colors.primary} size={25} />
                                </>
                            ) : (
                                <>
                                    <IonIcon name='ellipse-outline' color={colors.black} size={25} />
                                </>
                            )}

                            <CusText semibold text={' Lumpsum  '} color={colors.black} size="SN" />

                            <CusText text={`₹ ${getGoalPlanning()?.lumpsum_calculated_value}`} semibold size="SN" color={colors.orange} />


                        </Wrapper>

                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        handleSelect('SIP')
                    }}>


                        <Wrapper row align='center' customStyles={{
                            // borderRadius: borderRadius.middleSmall,
                            // borderWidth: 1,
                            // borderColor: colors.primary
                        }}>

                            {selectedOption === 'SIP' ? (
                                <>
                                    <IonIcon name='checkmark-circle' color={colors.primary} size={25} />
                                </>
                            ) : (
                                <>
                                    <IonIcon name='ellipse-outline' color={colors.black} size={25} />
                                </>
                            )}

                            <CusText position='center' semibold text={' SIP  '} color={colors.black} size="SN" />

                            <CusText text={`₹ ${getGoalPlanning()?.sip_calculated_value}`} size="SN" color={colors.orange} semibold />


                        </Wrapper>

                    </TouchableOpacity>

                </Wrapper>
                <Spacer y='XS' />
                <Wrapper width={responsiveWidth(85)}>
                    <CusText position='center' text={`${getGoalPlanning()?.inflation_rate !== 0 ? getGoalPlanning()?.inflation_rate + '%' : ' '}  ${getGoalPlanning()?.inflation_rate !== 0 ? 'Inflation adjusted' : ''} Projected amount after ${getGoalPlanning()?.months} months will be ₹ ${selectedOption === 'Lumpsum' ? getGoalPlanning()?.goal_projected_value : getGoalPlanning()?.goal_sip_projected_value} `} size="S" semibold />
                </Wrapper>
                <Spacer y='XS' />
                <CusButton
                    width={responsiveWidth(40)}
                    height={responsiveHeight(5)}
                    title="Proceed"
                    position="center"
                    radius={borderRadius.ring}
                    color={colors.secondary}
                    onPress={() => {
                        submit()

                    }}
                />
                <Spacer y='S' />
            </Wrapper>
        </Modal>
    )

}

export default RecommendedPlan;