import React, { useEffect, useState } from 'react'
import Modal from "react-native-modal";
import Wrapper from '../../../../ui/wrapper';
import CusText from '../../../../ui/custom-text';
import { borderRadius, colors, responsiveHeight, responsiveWidth } from '../../../../styles/variables';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DropDown from '../../../../ui/dropdown';
import CusButton from '../../../../ui/custom-button';
import Spacer from '../../../../ui/spacer';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { styles } from '../goaltabview/goalDashboardStyle';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { getGoalPlanning, setGoalPlanningDetails } from '../../../../utils/Commanutils';
import API from '../../../../utils/API';
import Container from '../../../../ui/container';
import { PieChart } from "react-native-gifted-charts";
import { showToast, toastTypes } from '../../../../services/toastService';
import Header from '../../../../shared/components/Header/Header';

const SuggestedScheme = ({ isVisible, setisVisible, flag, goalPlanID }: any) => {
    const [ediDept, setediDept] = useState<any>([100]);

    const isFocused = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute();

    console.log('goalPlanID 2 : ', route?.params?.goalPlanID)
    console.log('goalPlanID 2 : ', getGoalPlanning())



    useEffect(() => {
        // clearData()
        if (goalPlanID !== '') {

        }
        return () => {

        };
    }, [isFocused, route?.params?.goalPlanID]);


    const getChartData = () => {

    }




    const setAllocation = async (goal_plan_id: any) => {
        try {

            let payload = {
                allocationList: getGoalPlanning()?.allocArr
                    .filter((mfalloc: any) => mfalloc?.weightage && mfalloc.weightage !== 0)
                    .map((mf_alloc: any) => (
                        {
                            goal_id: goal_plan_id,
                            mf_type_id: mf_alloc?.Id,
                            alloc_perc: mf_alloc?.weightage,
                            scheme_id: mf_alloc?.scheme_id
                        }
                    ))
            }

            const result: any = await API.post('goal-plans/set-alloc', payload);
            if (result?.code === 200) {

                // setisVisible(false)
                // setGoalPlanningDetails(null)
                //  showToast(toastTypes.success, result?.msg)
            } else {
                console.log('setAllocation Error', result?.msg)
                showToast(toastTypes.info, result?.msg)
            }


        } catch (error: any) {
            console.log('setAllocation catch Error : ', error)
            showToast(toastTypes.error, error.msg)
        }
    }

    const executePlan = async () => {
        try {
            console.log('executePlan called : ')
            let todayDate = new Date()
            let payload = {
                goal_type_id: getGoalPlanning()?.goal_type_id,
                goal_label: getGoalPlanning()?.title,
                risk_category_id: getGoalPlanning()?.goal_risk_category_id,
                target_amt: getGoalPlanning()?.targetammount,
                err_perc: getGoalPlanning()?.err_perc,
                lumpsum_amt: getGoalPlanning()?.investment === 'Lumpsum' ? getGoalPlanning()?.lumpsum_calculated_value : 0,
                sip_amt: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : getGoalPlanning()?.sip_calculated_value,
                calc_amt: getGoalPlanning()?.goal_sip_projected_value,
                duration_mts: getGoalPlanning()?.investment === 'Lumpsum' ? getGoalPlanning()?.months : 0,
                sip_duration_mts: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : getGoalPlanning()?.months,
                inflation_perc: getGoalPlanning()?.inflation_rate,
                lumpsum_current_amt: getGoalPlanning()?.goal_projected_value,
                goal_exec_date: todayDate,
                investment_type: getGoalPlanning()?.investment === 'Lumpsum' ? 'lumpsum' : 'sip',
                suggested_scheme: getGoalPlanning()?.schemes
                    .filter((scheme: any) => scheme?.alloc_perc && scheme.alloc_perc !== 0)
                    .map((scheme: any) => ({
                        investment_type: getGoalPlanning()?.investment === 'Lumpsum' ? 'lumpsum' : 'sip',
                        scheme_id: scheme.id,
                        sip_amount: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : scheme.sip_amount,
                        sip_duration: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : getGoalPlanning()?.months,
                        sip_frequency: 2, // Default frequency, adjustable as needed
                        lumpsum_amount: getGoalPlanning()?.investment === 'Lumpsum' ? scheme.lumpsum_amount : 0,
                        lumpsum_duration: getGoalPlanning()?.investment === 'Lumpsum' ? getGoalPlanning()?.months : 0,
                        bse_order_id: 'random'
                    }))
            };



            if (route?.params?.goalPlanID) {

                console.log(`goal-plans/update/${route?.params?.goalPlanID}`)

                const result: any = await API.post(`goal-plans/update/${route?.params?.goalPlanID}`, payload);
                // let [result, error]: any = await API.post(`goal-plans/update/77`,payload);

                // console.log('error', error)
                if (result?.code === 200) {
                    console.log('goal goalPlanID: ', result?.data?.finalplan?.goal_plan_id)
                    setAllocation(result?.data?.finalplan?.goal_plan_id)
                    // setisVisible(false)
                    // setGoalPlanningDetails(null)
                    navigation.navigate('GoalDashboard')
                    showToast(toastTypes.success, result?.msg)
                } else {
                    console.log('goalPlanID Error', result?.msg)
                    showToast(toastTypes.info, result?.msg)
                }
            } else {
                const result: any = await API.post('goal-plans/add', payload);

                if (result?.code === 200) {
                    setAllocation(result?.data?.plans?.goal_plan_id)
                    //  setisVisible(false)
                    //  setGoalPlanningDetails(null)
                    navigation.navigate('GoalDashboard')

                    showToast(toastTypes.success, result?.msg)
                } else {
                    console.log('else Error', result?.msg)
                    showToast(toastTypes.info, result?.msg)
                }
            }
        } catch (error: any) {
            console.log('executePlan catch Error : ', error)
            showToast(toastTypes.error, error[0].msg)
        }
    }

    const executePlanLater = () => {
        try {

        } catch (error) {

        }
    }

    const changeScheme = (item: any) => {

        let payload = {
            subcategory_id: item?.scheme_subcategory?.id,
            currentSchemeId: item?.id,
            sip_amount: item?.sip_amount,
            priority: item?.priority,
            lumpsum_amount: item?.lumpsum_amount,
            weightage: item?.alloc_perc
        }
        navigation.navigate('SchemeEdit', { payload: payload })
    }



    const color = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

    const chartData = getGoalPlanning()?.allocArr.map((item: any, index: any) => ({
        value: Number(item.weightage),
        text: item.Name,
        color: color[index % color.length]
    }));

    const renderDot = (color: any) => {
        return (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );
    };


    const renderLegendComponent = () => {
        return (
            <>
                <Wrapper row width={responsiveWidth(86)} position="center" customStyles={{ flexWrap: "wrap" }}>
                    {getGoalPlanning()?.allocArr.map((item: any, i: number) =>
                        // <Wrapper width={"25%"} customStyles={{ flexWrap: 'wrap', marginVertical: responsiveWidth(2) }}>
                        <Wrapper row align="center" customStyles={{
                            marginRight: 10,
                            marginBottom: 5
                        }}>
                            {renderDot('#006DFF')}
                            <CusText color={colors.black} text={item?.Name} />
                        </Wrapper>
                        // </Wrapper>
                    )}
                </Wrapper>
            </>
        );
    };


    return (
        <>
            <Header name={'MF Allocation'} menubtn/>
            <Container Xcenter>
                <Wrapper position='center' align='center'
                    customStyles={{
                        backgroundColor: colors.primaryContainerBg,
                        borderRadius: borderRadius.normal
                    }}>
                    <Wrapper row justify='apart' customStyles={{
                        paddingVertical: responsiveWidth(3)
                    }}>
                        <CusText position='center' underline customStyles={{
                            paddingLeft: responsiveWidth(3),width: responsiveWidth(85),
                        }}
                            text={`${getGoalPlanning()?.goal_risk_category_name} - MF Allocation`} />

                    </Wrapper>
                    <Spacer y='S' />
                    {renderLegendComponent()}
                     <PieChart
                        data={chartData}
                        donut
                        showGradient
                        sectionAutoFocus
                        radius={90}
                        innerRadius={60}
                        innerCircleColor={colors.primaryContainerBg}
                    /> 

                    <Spacer y='S' />
                  <Wrapper align="center"
                            color={colors.containerBg}>
                <Wrapper width={responsiveWidth(95)}  color={'rgba(255, 255, 255, 0.1)'} align='center'
          customStyles={{paddingHorizontal:responsiveHeight(1),paddingVertical:responsiveHeight(2)}}>
                        <CusText text={'Suggested Investments'} size='M' title />
                        </Wrapper>
                    </Wrapper>
                    {
                        getGoalPlanning()?.schemesList
                            .filter((scheme: any) => scheme?.weightage && scheme.weightage > 0)
                            .map((item: any) =>
                                <Wrapper>
                                    <Spacer y='S' />
                                    <Wrapper row justify='apart'>
                                        <Wrapper row width={responsiveWidth(65)} customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                                            <CusText text={item?.SchemeMaster?.name} size='MS' medium customStyles={{ marginTop: responsiveHeight(0.5),width:responsiveWidth(50) }} />
                                            <IonIcon name='bar-chart' size={25} color={'#E59F39'} style={{ marginLeft: responsiveWidth(2) }} />
                                        </Wrapper>
                                        <TouchableOpacity style={styles.changebtn} onPress={() => { changeScheme(item) }}>
                                            <CusText text={'Change'} size="S" color={colors.Hard_White} medium />
                                        </TouchableOpacity>
                                    </Wrapper>
                                    <Spacer y='XS' />
                                    <Wrapper customStyles={styles.detailcard}>
                                        <Wrapper customStyles={styles.innerdetail}>
                                            <Wrapper row justify='apart' >
                                                <CusText text={'Category'} size='S' medium color={colors.grayShades2} />
                                                <CusText text={item?.SchemeSubcategory?.Name} size='S' medium color={colors.black} />
                                            </Wrapper>
                                            <Spacer y='XXS' />
                                            <Wrapper row justify='apart' >
                                                <CusText text={'Weightage'} size='S' medium color={colors.grayShades2} />
                                                <CusText text={item?.weightage ? (item?.weightage + ' %') : '0'} size='S' medium color={colors.black} />
                                            </Wrapper>
                                            <Spacer y='XXS' />
                                            <Wrapper row justify='apart' >
                                                <CusText text={'Amount'} size='S' medium color={colors.grayShades2} />
                                                <CusText text={`₹ ${getGoalPlanning()?.investment === 'Lumpsum' ? item?.lumpsum_amount : item?.sip_amount}`} size='S' medium color={colors.black} />
                                            </Wrapper>
                                            <Spacer y='XXS' />
                                        </Wrapper>
                                        <Wrapper width={"100%"} customStyles={{ position: "relative" }}>
                                            <Wrapper position="center" color={colors.containerBg} customStyles={{ position: "relative", zIndex: 1, paddingHorizontal: 5 }}>
                                                <CusText position="center" text={"Past Return"} color={colors.Hard_White} />
                                            </Wrapper>
                                            <Wrapper color={colors.grayShades2} height={1} width={"100%"} customStyles={{ position: 'absolute', top: "50%", zIndex: 0 }} />
                                        </Wrapper>
                                        <Spacer y='XXS' />
                                        <Wrapper position='center'>
                                            <Wrapper row justify='apart' width={responsiveWidth(60)}>
                                                <Wrapper>
                                                    <CusText text={'1 Year'} size='S' medium color={colors.grayShades2} />
                                                    <CusText text={item?.SchemeMaster?.SchemePerformances[0]?.Return1yr ? `${item?.SchemeMaster?.SchemePerformances[0]?.Return1yr.toFixed(2)} %` : 0} size='S' medium color={colors.gary} />
                                                </Wrapper>
                                                <Wrapper>
                                                    <CusText text={'3 Year'} size='S' medium color={colors.grayShades2} />
                                                    <CusText text={item?.SchemeMaster?.SchemePerformances[0]?.Returns3yr ? `${item?.SchemeMaster?.SchemePerformances[0]?.Returns3yr.toFixed(2)} %` : 0} size='S' medium color={colors.gray} />
                                                </Wrapper>
                                                <Wrapper>
                                                    <CusText text={'5 Year'} size='S' medium color={colors.grayShades2} />
                                                    <CusText text={item?.SchemeMaster?.SchemePerformances[0]?.Returns5yr ? `${item?.SchemeMaster?.SchemePerformances[0]?.Returns5yr.toFixed(2)} %` : 0} size='S' medium color={colors.gray} />
                                                </Wrapper>
                                            </Wrapper>

                                        </Wrapper>
                                        <Spacer y='XS' />
                                    </Wrapper>
                                </Wrapper>
                            )
                    }
                    {/* <FlatList
                    data={getGoalPlanning()?.schemes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                /> */}
                    <Spacer y='S' />
                    <Wrapper row justify="apart" width={responsiveWidth(85)}>
                        <CusButton
                            width={responsiveWidth(40)}
                            height={responsiveHeight(5)}
                            title="Execution Plan Later"
                            color={colors.primaryContainerBg}
                            position="center"
                           // borderColor={colors.Hard_White}
                            radius={borderRadius.ring}
                         //   exborder
                            onPress={() => {
                                executePlan()

                            }}
                            textArea={"100%"}
                            textWeight='semibold'
                        />
                        <CusButton
                            width={responsiveWidth(40)}
                            height={responsiveHeight(5)}
                            title="Execution Plan Now"
                            position="center"
                            radius={borderRadius.ring}
                            onPress={() => {
                                // setisVisible(false)
                                // flag(true)
                                executePlan()
                            }}
                            textArea={"100%"}
                            textWeight='semibold'
                        />
                    </Wrapper>
                </Wrapper>
            </Container>
        </>
    )

}

export default SuggestedScheme;