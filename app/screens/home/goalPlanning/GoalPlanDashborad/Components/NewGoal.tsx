import React, { useEffect, useState } from "react";
import CusText from "../../../../../ui/custom-text";
import Wrapper from "../../../../../ui/wrapper";
import { borderRadius, colors, responsiveHeight, responsiveWidth } from "../../../../../styles/variables";
import API from "../../../../../utils/API";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity } from "react-native";
import { Icon } from "react-native-vector-icons/Icon";
import { getGoalTypeImage } from "../../../../../utils/Commanutils";
import { showToast, toastTypes } from "../../../../../services/toastService";
import { styles } from "../../goaltabview/goalDashboardStyle";
import Spacer from "../../../../../ui/spacer";
import { getAllGoalTypeApi, getRiskProfileInvestorAPi } from "../../../../../api/homeapi";
import Alert from "../../../../../shared/components/Alert/Alert";




const NewGoal = ({ setisVisible, setgoalId, setGoalPlanID, setGoalName,riskprofileData,setPageName }: any) => {

    const navigation: any = useNavigation()
    const isFocused = useIsFocused();
    const [AlertVisible, setAlertVisible] = useState(false);
    const [alertShownOnce, setAlertShownOnce] = useState<boolean>(false);
    const [goalTypesData, setGoalTypesData] = useState<any[]>([])
 const [riskProfileDatas, setriskProfileDatas] = useState<any>({})
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
            riskprofileData(result?.data)

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
            console.log('result?.data----111111111111111', result?.data);
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
    return (
        <>
            <Wrapper
                color={colors.primaryContainerBg}
                height={responsiveHeight(80)}
                customStyles={{
                    borderBottomLeftRadius: borderRadius.medium,
                    borderBottomRightRadius: borderRadius.medium,
                }}
            >
                <Wrapper row color={colors.containerBg} customStyles={{ flexWrap: 'wrap', marginHorizontal: responsiveWidth(2), marginVertical: responsiveWidth(2), paddingBottom: responsiveWidth(2), borderRadius: borderRadius.medium }}>
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
                        }} onPress={() => { setgoalId(item?.id), setGoalPlanID(item?.id), setisVisible(true), 
                        setGoalName(item?.goal_name),setPageName('NewGoal') }}>
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
            </Wrapper> 
            <Alert
                visible={AlertVisible}
                onClose={() => { setAlertVisible(false) }}
                iconName="alert-circle-outline"
                iconColor={colors.red}
                iconSize={responsiveWidth(20)}
                description={`Your Risk Profile process is pending, please click on continue to proceed.`}
                button2Text="Continue"
                onButton2Press={async () => { navigation.navigate('RiskProfile') }}
            />
        </>
    )
}
export default NewGoal;