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
import { getPlanDataApi } from '../../../../api/homeapi';
import LinearGradient from 'react-native-linear-gradient';

const SuggestedScheme = ({ isVisible, setisVisible, flag, goalPlanID }: any) => {
    const [ediDept, setediDept] = useState<any>([100]);
    const [schemeList, setSchemeList] = useState<any>([]);
    const [pieData1, setPieData1] = useState<any>([]);

    const isFocused = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const pieData = [
        { value: 54, color: '#177AD5', text: '54%' },
        { value: 40, color: '#79D2DE', text: '30%' },
        { value: 20, color: '#ED6665', text: '26%' },
    ];

    console.log('goalPlanID 2 : ', route?.params?.goalData)



    useEffect(() => {
        if (goalPlanID !== '') {
            GetPlanData(route?.params?.goalPlanID)
        }
        return () => {

        };
    }, [isFocused, route?.params?.goalPlanID]);




    const GetPlanData = async (goal_plan_id: any) => {
        try {
            const [result, error]: any = await getPlanDataApi(goal_plan_id);
            if (result) {
                console.log('result === > ', result?.data)
                setSchemeList(result?.data?.schemeList)
                const LineChartData = await Promise.all(
                    result?.data?.allocArr.map(async (item: any, index: any) => {
                        return {
                            value: item?.weightage,
                            text: item?.Name,
                            color: color[index % color.length]
                        };

                    })
                );
                console.log('LineChartData ==== >>> ', LineChartData)
                setPieData1(LineChartData)
            } else {
                console.log('GetPlanData Error', error)
                showToast(toastTypes.info, error)
            }
        } catch (error: any) {
            console.log('GetPlanData catch Error : ', error)
            showToast(toastTypes.error, error)
        }
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

    const reCalculate = () => {
        navigation.navigate('GoalPlanDashboard', { tabNumber: 2, showAlert: true, goalPlanData: route?.params?.goalData })
    }

    const renderScheme = ({ item, index }: any) => {
        let amount: any = item?.sip_amount > 0 ? item?.sip_amount : item?.lumpsum_amount ? item?.lumpsum_amount : 0

        return (
            <>
                {/* <Wrapper>
                    <Spacer y='S' />
                    <Wrapper row justify='apart'>
                        <Wrapper row width={responsiveWidth(65)} customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                            <CusText text={item?.SchemeMaster?.name} size='MS' medium customStyles={{ marginTop: responsiveHeight(0.5), width: responsiveWidth(50) }} />
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
                </Wrapper> */}
                <Wrapper customStyles={{ marginBottom: responsiveWidth(1), }}>
                    <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(2) }}>
                        <Wrapper row align='center' justify='apart' customStyles={{ marginVertical: responsiveWidth(3) }}>
                            <CusText underline size='M' color={colors.label} semibold text={`${item?.SchemeCategory?.Name} - ${item?.SchemeSubcategory?.Name}`} />
                            <TouchableOpacity activeOpacity={0.6} onPress={() => { }}>
                                <CusText size='N' color={colors.orange} bold text={'Change'} />
                            </TouchableOpacity>

                        </Wrapper>
                        <Wrapper align='center' row justify='apart'>
                            <CusText size='N' color={colors.label} bold text={`${item?.SchemeMaster?.name}`} />


                        </Wrapper>
                        <Spacer y='XS' />


                        {/* <Wrapper>
                            <LinearGradient
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                colors={[colors.transparent, colors.primary, colors.transparent]}
                                style={{ width: '100%', height: 2, opacity: 0.5 }}></LinearGradient>
                        </Wrapper>
                        <Spacer y='XS' /> */}
                        <Wrapper color={colors.lightGray} customStyles={{ borderWidth: 0, padding: responsiveWidth(2), borderRadius: borderRadius.middleSmall }}>
                            <Wrapper row align='center' justify='apart'>
                                <Wrapper position='center' align='start'>
                                    <CusText size='SS' color={colors.label} text={'Amount'} />
                                    <CusText size='M' color={colors.label} text={'₹ ' + amount} />
                                </Wrapper>
                                <Wrapper align='center' position='center'>
                                    <CusText size='SS' position='center' color={colors.label} text={'Morningstar Rating'} />
                                    <Wrapper row align='center'>
                                        <CusText size='M' color={colors.label} text={item?.SchemeMaster?.SchemePerformances[0]?.OverallRating || 0} />
                                        <IonIcon name='star' color={colors.orange} size={responsiveWidth(4)} />
                                    </Wrapper>
                                </Wrapper>
                                <Wrapper position='center' align='end'>
                                    <CusText size='SS' color={colors.label} text={'Weightage'} />
                                    <CusText size='M' color={colors.label} text={item?.weightage + ' %'} />
                                </Wrapper>
                            </Wrapper>
                            <Spacer y='XXS' />
                            <Wrapper row align='center' justify='apart'>
                                <Wrapper position='center' align='start'>
                                    <CusText size='SS' color={colors.label} text={'Return 1y'} />
                                    <CusText size='M' color={colors.label} text={item?.SchemeMaster?.SchemePerformances[0]?.Return1yr ? item?.SchemeMaster?.SchemePerformances[0]?.Return1yr.toFixed(2) + '%' : '----'} />
                                </Wrapper>
                                <Wrapper align='center' position='center'>
                                    <CusText size='SS' color={colors.label} text={'Return 3y'} />
                                    <CusText size='M' color={colors.label} text={item?.SchemeMaster?.SchemePerformances[0]?.Returns3yr ? item?.SchemeMaster?.SchemePerformances[0]?.Returns3yr.toFixed(2) + '%' : '----'} />
                                </Wrapper>
                                <Wrapper position='center' align='end'>
                                    <CusText size='SS' color={colors.label} text={'Return 5y'} />
                                    <CusText size='M' color={colors.label} text={item?.SchemeMaster?.SchemePerformances[0]?.Returns5yr ? item?.SchemeMaster?.SchemePerformances[0]?.Returns5yr.toFixed(2) + '%' : '----'} />
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>
                    </Wrapper>
                    <Spacer y='XXS' />
                    {/* <TouchableOpacity activeOpacity={0.6} onPress={() => { }}>
                        <Wrapper color={colors.primary} customStyles={{ paddingVertical: responsiveWidth(1), borderBottomLeftRadius: borderRadius.middleSmall, borderBottomRightRadius: borderRadius.middleSmall }}>
                            <CusText position='center' bold size='M' color={colors.Hard_White} text={'Change'} />
                        </Wrapper>
                    </TouchableOpacity> */}
                </Wrapper>
            </>
        )
    }


    return (
        <>
            <Header name={'MF Allocation'} menubtn />
            <Container Xcenter contentWidth={responsiveWidth(95)} bgcolor={colors.Hard_White}>
                <Wrapper align='center' row position='center' customStyles={{ gap: responsiveWidth(5), paddingVertical: responsiveWidth(5) }}>
                    <PieChart
                        donut
                        radius={responsiveWidth(15)}
                        innerRadius={responsiveWidth(10)}
                        data={pieData1}
                    />
                    <Wrapper>
                        {
                            pieData1?.map((pitem: any, index: any) => {
                                return (
                                    <>
                                        <Wrapper row align='center'>
                                            <Wrapper
                                                width={responsiveWidth(2.5)}
                                                height={responsiveWidth(2.5)}
                                                color={color[index % color.length]}
                                                customStyles={{ padding: responsiveWidth(1) }}
                                            />
                                            <Spacer x='XXS' />
                                            <CusText text={pitem?.text + '   '} />
                                            <CusText text={pitem?.value + '%'} />
                                        </Wrapper>
                                        {
                                            index + 1 < pieData1.length &&
                                            <Spacer y='XXS' />
                                        }
                                    </>
                                )
                            })
                        }
                    </Wrapper>
                </Wrapper>
                <Wrapper color={colors.primary} customStyles={{ paddingVertical: responsiveWidth(2.5), borderRadius: borderRadius.middleSmall }}>
                    <CusText bold color={colors.Hard_White} size='L' position='center' text={'Suggested Investments'} />
                </Wrapper>
                <Wrapper>
                    <LinearGradient
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[colors.transparent, colors.primary, colors.transparent]}
                        style={{ width: '100%', height: 2, opacity: 0.5 }}></LinearGradient>
                </Wrapper>
                <FlatList
                    data={schemeList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderScheme}
                />

            </Container>
            <Wrapper color={colors.Hard_White} row align='center' justify='apart' customStyles={{ paddingVertical: responsiveWidth(3), paddingHorizontal: responsiveWidth(4) }}>
                <TouchableOpacity activeOpacity={0.6} onPress={() => { reCalculate() }}>
                    <Wrapper width={responsiveWidth(30)} position='center' customStyles={{ padding: responsiveWidth(2.5), borderRadius: borderRadius.medium, borderColor: colors.gray, borderWidth: 1 }}>
                        <CusText size='SS' bold position='center' text={'Recalculate'} />
                    </Wrapper>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={() => { }}>
                    <Wrapper width={responsiveWidth(30)} color={colors.orange} position='center' customStyles={{ padding: responsiveWidth(2.5), borderRadius: borderRadius.medium }}>
                        <CusText size='SS' bold position='center' color={colors.Hard_White} text={'Save Goal'} />
                    </Wrapper>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={() => { }}>
                    <Wrapper width={responsiveWidth(30)} color={colors.orange} position='center' customStyles={{ padding: responsiveWidth(2.5), borderRadius: borderRadius.medium }}>
                        <CusText size='SS' bold position='center' color={colors.Hard_White} text={'Save & Execute'} />
                    </Wrapper>
                </TouchableOpacity>
            </Wrapper>
        </>
    )

}

export default SuggestedScheme;