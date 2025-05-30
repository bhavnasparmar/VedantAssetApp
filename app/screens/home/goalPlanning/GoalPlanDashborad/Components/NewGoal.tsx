import React, { useEffect, useState } from 'react';
import CusText from '../../../../../ui/custom-text';
import { showToast, toastTypes } from '../../../../../services/toastService';
import { getAllGoalTypeApi, getRiskProfileInvestorAPi } from '../../../../../api/homeapi';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Wrapper from '../../../../../ui/wrapper';
import { borderRadius, colors, responsiveHeight, responsiveWidth } from '../../../../../styles/variables';
import { Image, TouchableOpacity } from 'react-native';
import { getGoalTypeImage } from '../../../../../utils/Commanutils';
import NewGoalModal from './NewGoalModal';
import Spacer from '../../../../../ui/spacer';
import CommonModal from '../../../../../shared/components/CommonModal/commonModal';
import Container from '../../../../../ui/container';
import Alert from './Alert';

const NewGoal = () => {
    const navigation: any = useNavigation()
    const isFocused = useIsFocused();
    const [goalTypesData, setGoalTypesData] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [AlertVisible, setAlertVisible] = useState(false);
    const [goalDetailsObj, setGoalDetailsObj] = useState<any>({});
    const [riskDetailsObj, setRiskDetailsObj] = useState<any>({});
    const [alertShownOnce, setAlertShownOnce] = useState<boolean>(false);
    useEffect(() => {
        if (isFocused && !alertShownOnce) {
            CheckRishCompleted();
        }
        goalTypes();
    }, [isFocused]);

    const CheckRishCompleted = async () => {
        try {
            const [result, error]: any = await getRiskProfileInvestorAPi();
            console.log('getRiskProfileInvestorAPi NewGoal result', result);
            console.log('result?.data----', result?.data);
            console.log('result?.error----', error);
            setRiskDetailsObj(result?.data)
            if (!alertShownOnce) {
                if (result?.data) {
                    setAlertVisible(false)
                } else {
                    setAlertVisible(true)
                    setAlertShownOnce(true);
                }
            }



        } catch (error: any) {
            console.log('goalTypes Catch Error', error);
            showToast(toastTypes.error, error[0].msg);
        }
    };

    const goalTypes = async () => {
        try {
            const [result, error]: any = await getAllGoalTypeApi();
            console.log('result?.data----', result?.data);
            console.log('result?.error----', error);
            if (result) {
                if (result?.data.length > 0) {
                    setGoalTypesData(result?.data);
                } else {
                    showToast(toastTypes.info, 'No Data Found');
                }
            } else {
            }


        } catch (error: any) {
            console.log('goalTypes Catch Error', error);
            showToast(toastTypes.error, error[0].msg);
        }
    };

    const setGoalDetails = (goal: any) => {
        setGoalDetailsObj(goal)
        setModalVisible(true)
    }

    return (
        <>
            <Wrapper position='center' row customStyles={{ flexWrap: 'wrap', paddingBottom: responsiveWidth(2), gap: responsiveWidth(3), marginLeft: responsiveWidth(3) }}>
                {goalTypesData?.map((item: any, i: number) =>
                    <Wrapper width={responsiveWidth(29)} customStyles={{ flexWrap: 'wrap' }}>
                        <TouchableOpacity style={{
                            width: responsiveWidth(29),
                            height: responsiveWidth(29),
                            borderColor: "rgba(226, 226, 226, 1)",
                            borderWidth: responsiveWidth(0.5),
                            borderRadius: borderRadius.medium,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: colors.white
                        }} onPress={() => { setGoalDetails(item) }}>
                            <Image resizeMode='contain' source={{ uri: getGoalTypeImage(item?.goal_icon) }} style={{
                                height: responsiveWidth(26),
                                width: responsiveWidth(26)
                            }}></Image>
                        </TouchableOpacity>
                        <Spacer y='XXS' />
                        <Wrapper position='center'>
                            <CusText semibold position="center" text={item?.goal_name} size='SS' color={colors.primary}
                                customStyles={{ width: responsiveWidth(21) }} />
                        </Wrapper>
                    </Wrapper>
                )}

            </Wrapper>
            <NewGoalModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                goalName={goalDetailsObj?.goal_name}
                riskDetailsData={riskDetailsObj}
            />
            <Alert
                // visible={AlertVisible}
                // onClose={() => {
                //     setAlertVisible(false),setTimeout(() => {navigation.navigate('RiskProfile');}, 2000);}}
                // alertName={'Your Risk Profile process is pending, please click on continue to proceed.'}
                // //setAlertClose={setAlertVisible}
                visible={AlertVisible}
                onClose={() => { setAlertVisible(false) }}
                iconName="alert-circle-outline"
                iconColor={colors.red}
                iconSize={responsiveWidth(20)}
                // title="Log Out"
                // description={`Would You Like to create new activity ? if yes choose "Create New", it will mark previous activity as "Complete".`}
                description={`Your Risk Profile process is pending, please click on continue to proceed.`}
                // button1Text="Stay"
                // onButton1Press={() => {
                //     setAlertVisible(false)
                // }}
                button2Text="Continue"
                onButton2Press={async () => { navigation.navigate('RiskProfile') }}
            />
        </>
    )
}


export default NewGoal