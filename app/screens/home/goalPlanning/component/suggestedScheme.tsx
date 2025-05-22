import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
// import DoughNut from 'react-native-pie-chart';
import Header from '../../../../shared/components/header/header';
import Container from '../../../../ui/container';


const SuggestedScheme = ({ isVisible, setisVisible, flag, goalPlanID }: any) => {
    const [ediDept, setediDept] = useState<any>([100]);

    const isFocused = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute();

    // console.log('goalPlanID 2 : ', route?.params?.goalPlanID)
    // console.log('goalPlanID 2 : ', getGoalPlanning())



    useEffect(() => {
        // clearData()
        if (goalPlanID !== '') {

        }
        return () => {

        };
    }, [isFocused, route?.params?.goalPlanID]);


    // const getChartData = () => {

    // }




    // const setAllocation = async (goal_plan_id: any) => {
    //     try {

    //         let payload = {
    //             allocationList: getGoalPlanning()?.mf_alloc
    //                 .filter((mfalloc: any) => mfalloc?.alloc_perc && mfalloc.alloc_perc !== 0)
    //                 .map((mf_alloc: any) => (
    //                     {
    //                         goal_id: goal_plan_id,
    //                         mf_type_id: mf_alloc?.Id,
    //                         alloc_perc: mf_alloc?.alloc_perc,
    //                         scheme_id: mf_alloc?.scheme_id
    //                     }
    //                 ))
    //         }

    //         const result: any = await API.post('goal-plans/set-alloc', payload);
    //         if (result?.code === 200) {

    //             // setisVisible(false)
    //             // setGoalPlanningDetails(null)
    //             //  showToast(toastTypes.success, result?.msg)
    //         } else {
    //             console.log('setAllocation Error', result?.msg)
    //             showToast(toastTypes.info, result?.msg)
    //         }


    //     } catch (error: any) {
    //         console.log('setAllocation catch Error : ', error)
    //         showToast(toastTypes.error, error.msg)
    //     }
    // }

    // const executePlan = async () => {
    //     try {
    //         console.log('executePlan called : ')
    //         let todayDate = new Date()
    //         let payload = {
    //             goal_type_id: getGoalPlanning()?.goal_type_id,
    //             goal_label: getGoalPlanning()?.title,
    //             risk_category_id: getGoalPlanning()?.goal_risk_category_id,
    //             target_amt: getGoalPlanning()?.targetammount,
    //             err_perc: getGoalPlanning()?.err_perc,
    //             lumpsum_amt: getGoalPlanning()?.investment === 'Lumpsum' ? getGoalPlanning()?.lumpsum_calculated_value : 0,
    //             sip_amt: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : getGoalPlanning()?.sip_calculated_value,
    //             calc_amt: getGoalPlanning()?.goal_sip_projected_value,
    //             duration_mts: getGoalPlanning()?.investment === 'Lumpsum' ? getGoalPlanning()?.months : 0,
    //             sip_duration_mts: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : getGoalPlanning()?.months,
    //             inflation_perc: getGoalPlanning()?.inflation_rate,
    //             lumpsum_current_amt: getGoalPlanning()?.goal_projected_value,
    //             goal_exec_date: todayDate,
    //             investment_type: getGoalPlanning()?.investment === 'Lumpsum' ? 'lumpsum' : 'sip',
    //             suggested_scheme: getGoalPlanning()?.schemes
    //                 .filter((scheme: any) => scheme?.alloc_perc && scheme.alloc_perc !== 0)
    //                 .map((scheme: any) => ({
    //                     investment_type: getGoalPlanning()?.investment === 'Lumpsum' ? 'lumpsum' : 'sip',
    //                     scheme_id: scheme.id,
    //                     sip_amount: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : scheme.sip_amount,
    //                     sip_duration: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : getGoalPlanning()?.months,
    //                     sip_frequency: 2, // Default frequency, adjustable as needed
    //                     lumpsum_amount: getGoalPlanning()?.investment === 'Lumpsum' ? scheme.lumpsum_amount : 0,
    //                     lumpsum_duration: getGoalPlanning()?.investment === 'Lumpsum' ? getGoalPlanning()?.months : 0,
    //                     bse_order_id: 'random'
    //                 }))
    //         };



    //         if (route?.params?.goalPlanID) {

    //             console.log(`goal-plans/update/${route?.params?.goalPlanID}`)

    //             const result: any = await API.post(`goal-plans/update/${route?.params?.goalPlanID}`, payload);
    //             // let [result, error]: any = await API.post(`goal-plans/update/77`,payload);

    //             // console.log('error', error)
    //             if (result?.code === 200) {
    //                 console.log('goal goalPlanID: ', result?.data?.finalplan?.goal_plan_id)
    //                 setAllocation(result?.data?.finalplan?.goal_plan_id)
    //                 // setisVisible(false)
    //                 // setGoalPlanningDetails(null)
    //                 navigation.navigate('GoalDashboard')
    //                 showToast(toastTypes.success, result?.msg)
    //             } else {
    //                 console.log('goalPlanID Error', result?.msg)
    //                 showToast(toastTypes.info, result?.msg)
    //             }
    //         } else {
    //             const result: any = await API.post('goal-plans/add', payload);

    //             if (result?.code === 200) {
    //                 setAllocation(result?.data?.plans?.goal_plan_id)
    //                 //  setisVisible(false)
    //                 //  setGoalPlanningDetails(null)
    //                 navigation.navigate('GoalDashboard')

    //                 showToast(toastTypes.success, result?.msg)
    //             } else {
    //                 console.log('else Error', result?.msg)
    //                 showToast(toastTypes.info, result?.msg)
    //             }
    //         }
    //     } catch (error: any) {
    //         console.log('executePlan catch Error : ', error)
    //         showToast(toastTypes.error, error[0].msg)
    //     }
    // }

    // const executePlanLater = () => {
    //     try {

    //     } catch (error) {

    //     }
    // }

    // const changeScheme = (item: any) => {

    //     let payload = {
    //         subcategory_id: item?.scheme_subcategory?.id,
    //         currentSchemeId: item?.id,
    //         sip_amount: item?.sip_amount,
    //         priority: item?.priority,
    //         lumpsum_amount: item?.lumpsum_amount,
    //         weightage: item?.alloc_perc
    //     }
    //     navigation.navigate('SchemeList', { payload: payload })
    // }



    // const color = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

    // const chartData = getGoalPlanning()?.mf_alloc.map((item: any, index: any) => ({
    //     value: Number(item.alloc_perc),
    //     text: item.Name,
    //     color: color[index % color.length]
    // }));

    // const renderDot = (color: any) => {
    //     return (
    //         <View
    //             style={{
    //                 height: 10,
    //                 width: 10,
    //                 borderRadius: 5,
    //                 backgroundColor: color,
    //                 marginRight: 10,
    //             }}
    //         />
    //     );
    // };


    // const renderLegendComponent = () => {
    //     return (
    //         <>
    //             <Wrapper row width={responsiveWidth(86)} position="center" customStyles={{ flexWrap: "wrap" }}>
    //                 {getGoalPlanning()?.mf_alloc.map((item: any, i: number) =>
    //                     // <Wrapper width={"25%"} customStyles={{ flexWrap: 'wrap', marginVertical: responsiveWidth(2) }}>
    //                     <Wrapper row align="center" customStyles={{
    //                         marginRight: 10,
    //                         marginBottom: 5
    //                     }}>
    //                         {renderDot('#006DFF')}
    //                         <CusText color={colors.Hard_White} text={item?.Name} />
    //                     </Wrapper>
    //                     // </Wrapper>
    //                 )}
    //             </Wrapper>
    //         </>
    //     );
    // };


    return (
        <>
            <Header name={'MF Allocation'} />
            <Container Xcenter>
          
            </Container>
        </>
    )

}

export default SuggestedScheme;