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
        setGoalPlanningDetails(data)
        setisVisible(false)
        setSelectedOption(null);
        navigation.navigate('SuggestedScheme', { goalPlanID: goalPlanID })
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
            <Wrapper width={responsiveWidth(90)} align='center'
                customStyles={{
                    backgroundColor: colors.Hard_White,
                    borderRadius: borderRadius.normal
                }}>
                <Wrapper row justify='apart' customStyles={{
                    paddingVertical: responsiveWidth(3),
                    borderBottomWidth: 0.3, borderBottomColor: colors.inputLabel
                }}>
                    <CusText position='center' customStyles={{
                        paddingLeft: responsiveWidth(3)
                        , width: responsiveWidth(83),
                    }}
                        text={'Recommended Plan'} />

                    <IonIcon onPress={() => { clearData() }} name='close-outline' color={colors.black} size={25} ></IonIcon>
                </Wrapper>
                <Spacer y='S' />
                <Wrapper row position="center">
                    <TouchableOpacity onPress={() => { handleSelect('Lumpsum') }}>
                         <Wrapper customStyles={styles.gender}  color={colors.black}>
                            <View style={[styles.option, {
                                backgroundColor:
                                    colors.Hard_White
                            }]}>
                                <Wrapper row>
                                    {selectedOption === 'Lumpsum' ? (
                                        <>
                                            <IonIcon name='checkmark-circle' color={colors.green} size={30} style={styles.checkmarkIcon} />
                                        </>
                                    ) : (
                                        <>
                                            <IonIcon name='ellipse-outline' color={colors.black} size={30} style={styles.checkmarkIcon} />
                                        </>
                                    )}
                                    <Wrapper>
                                        <CusText position='center' semibold text={'Lumpsum'} color={colors.black} size="SS" />
                                        <Wrapper customStyles={styles.sectralfield}>
                                            <CusText text={`₹ ${getGoalPlanning()?.lumpsum_calculated_value}`} size="S" color={colors.inputLabel} medium />
                                        </Wrapper>
                                    </Wrapper>
                                </Wrapper>
                            </View>
                        </Wrapper>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        // getMandate()
                        handleSelect('SIP')
                    }}>
                       {/*  <LinearGradient
                            style={[styles.gender, { width: responsiveWidth(40), }]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 0 }}
                            colors={[
                                colors.tertiary,
                                colors.quaternary,
                            ]}> */}
                            <Wrapper customStyles={styles.gender} color={colors.black}>
                            <View style={[styles.option, {
                                backgroundColor:
                                    colors.Hard_White
                            }]}>
                                <Wrapper row>
                                    {selectedOption === 'SIP' ? (
                                        <>
                                            <IonIcon name='checkmark-circle' color={colors.green} size={30} style={styles.checkmarkIcon} />
                                        </>
                                    ) : (
                                        <>
                                            <IonIcon name='ellipse-outline' color={colors.black} size={30} style={styles.checkmarkIcon} />
                                        </>
                                    )}
                                    <Wrapper>
                                        <CusText position='center' semibold text={'SIP'} color={colors.black} size="SS" />
                                        <Wrapper customStyles={styles.sectralfield}>
                                            <CusText text={`₹ ${getGoalPlanning()?.sip_calculated_value}`} size="S" color={colors.inputLabel} medium />
                                        </Wrapper>
                                    </Wrapper>
                                </Wrapper>
                            </View>
                        </Wrapper>
                    </TouchableOpacity>

                </Wrapper>
                <Spacer y='S' />
                <Wrapper customStyles={styles.sectralfield} align='center' width={responsiveWidth(85)}>
                    <CusText text={`${getGoalPlanning()?.inflation_rate !== 0 ? getGoalPlanning()?.inflation_rate : ''} % ${getGoalPlanning()?.inflation_rate !== 0 ? 'inflation adjusted' : ''} projected amount after ${getGoalPlanning()?.months} months will be ₹ ${selectedOption === 'Lumpsum' ? getGoalPlanning()?.goal_projected_value : getGoalPlanning()?.goal_sip_projected_value} `} size="S" color={colors.inputLabel} medium />
                </Wrapper>
                <Spacer y='S' />
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