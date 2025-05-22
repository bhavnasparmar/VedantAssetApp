import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import Modal from "react-native-modal";
import { borderRadius, colors, responsiveWidth } from '../../../../styles/variables';
import Wrapper from '../../../../ui/wrapper';
// import DoughNut from 'react-native-pie-chart';

// import { showToast, toastTypes } from '../../../../service/toastService';

const Chartshow = ({ isVisible, setisVisible, flag, goalPlanID }: any) => {
  const [ediDept, setediDept] = useState<any>([100]);

  const isFocused = useIsFocused();
  const navigation: any = useNavigation();

  useEffect(() => {


    if (goalPlanID !== '') {

    }
    return () => {

    };
  }, [isFocused]);

  const clearData = () => {
    setisVisible(false)
  }

  // const setAllocation = async (goal_plan_id: any) => {
  //   try {

  //     let payload = {
  //       allocationList: getGoalPlanning()?.mf_alloc
  //         .filter((mfalloc: any) => mfalloc?.alloc_perc && mfalloc.alloc_perc !== 0)
  //         .map((mf_alloc: any) => (
  //           {
  //             goal_id: goal_plan_id,
  //             mf_type_id: mf_alloc?.Id,
  //             alloc_perc: mf_alloc?.alloc_perc,
  //             scheme_id: mf_alloc?.scheme_id
  //           }
  //         ))
  //     }

  //     const result: any = await API.post('goal-plans/set-alloc', payload);
  //     if (result?.code === 200) {

  //       // setisVisible(false)
  //       // setGoalPlanningDetails(null)
  //       //  showToast(toastTypes.success, result?.msg)
  //     } else {
  //       console.log('setAllocation Error', result?.msg)
  //       showToast(toastTypes.info, result?.msg)
  //     }


  //   } catch (error: any) {
  //     console.log('setAllocation catch Error : ', error)
  //     showToast(toastTypes.error, error.msg)
  //   }
  // }

  // const executePlan = async () => {
  //   try {
  //     let todayDate = new Date()
  //     let payload = {
  //       goal_type_id: getGoalPlanning()?.goal_type_id,
  //       goal_label: getGoalPlanning()?.title,
  //       risk_category_id: getGoalPlanning()?.goal_risk_category_id,
  //       target_amt: getGoalPlanning()?.targetammount,
  //       err_perc: getGoalPlanning()?.err_perc,
  //       lumpsum_amt: getGoalPlanning()?.investment === 'Lumpsum' ? getGoalPlanning()?.lumpsum_calculated_value : 0,
  //       sip_amt: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : getGoalPlanning()?.sip_calculated_value,
  //       calc_amt: getGoalPlanning()?.goal_sip_projected_value,
  //       duration_mts: getGoalPlanning()?.investment === 'Lumpsum' ? getGoalPlanning()?.months : 0,
  //       sip_duration_mts: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : getGoalPlanning()?.months,
  //       inflation_perc: getGoalPlanning()?.inflation_rate,
  //       lumpsum_current_amt: getGoalPlanning()?.goal_projected_value,
  //       goal_exec_date: todayDate,
  //       investment_type: getGoalPlanning()?.investment === 'Lumpsum' ? 'lumpsum' : 'sip',
  //       suggested_scheme: getGoalPlanning()?.schemes
  //         .filter((scheme: any) => scheme?.alloc_perc && scheme.alloc_perc !== 0)
  //         .map((scheme: any) => ({
  //           investment_type: getGoalPlanning()?.investment === 'Lumpsum' ? 'lumpsum' : 'sip',
  //           scheme_id: scheme.id,
  //           sip_amount: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : scheme.sip_amount,
  //           sip_duration: getGoalPlanning()?.investment === 'Lumpsum' ? 0 : getGoalPlanning()?.months,
  //           sip_frequency: 2, // Default frequency, adjustable as needed
  //           lumpsum_amount: getGoalPlanning()?.investment === 'Lumpsum' ? scheme.lumpsum_amount : 0,
  //           lumpsum_duration: getGoalPlanning()?.investment === 'Lumpsum' ? getGoalPlanning()?.months : 0,
  //           bse_order_id: 'random'
  //         }))
  //     };



  //     if (goalPlanID !== '') {
  //       const result: any = await API.post(`goal-plans/update/${goalPlanID}`, payload);
  //       if (result?.code === 200) {
  //         console.log('goal goalPlanID: ', result?.data?.finalplan?.goal_plan_id)
  //         setAllocation(result?.data?.finalplan?.goal_plan_id)
  //         setisVisible(false)
  //         setGoalPlanningDetails(null)
  //         showToast(toastTypes.success, result?.msg)
  //       } else {
  //         console.log('goalPlanID Error', result?.msg)
  //         showToast(toastTypes.info, result?.msg)
  //       }
  //     } else {
  //       const result: any = await API.post('goal-plans/add', payload);

  //       if (result?.code === 200) {
  //         setAllocation(result?.data?.plans?.goal_plan_id)
  //         setisVisible(false)
  //         setGoalPlanningDetails(null)
  //         // flag(true)
  //         showToast(toastTypes.success, result?.msg)
  //       } else {
  //         console.log('else Error', result?.msg)
  //         showToast(toastTypes.info, result?.msg)
  //       }
  //     }
  //   } catch (error: any) {
  //     console.log('executePlan catch Error : ', error)
  //     showToast(toastTypes.error, error[0].msg)
  //   }
  // }

  // const executePlanLater = () => {
  //   try {

  //   } catch (error) {

  //   }
  // }

  // const changeScheme = () => {

  //   let payload = {
  //     subcategory_id: getGoalPlanning()?.schemes[0]?.scheme_subcategory?.id,
  //     currentSchemeId: getGoalPlanning()?.schemes[0]?.id,
  //     sip_amount: getGoalPlanning()?.schemes[0]?.sip_amount,
  //     priority: getGoalPlanning()?.schemes[0]?.priority,
  //     lumpsum_amount: getGoalPlanning()?.schemes[0]?.lumpsum_amount,
  //     weightage: getGoalPlanning()?.schemes[0]?.alloc_perc
  //   }
  //   navigation.navigate('SchemeList', { payload: payload })
  // }

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
          backgroundColor: colors.darkGray,
          borderRadius: borderRadius.normal
        }}>
       
      </Wrapper>
    </Modal>
  )

}

export default Chartshow;