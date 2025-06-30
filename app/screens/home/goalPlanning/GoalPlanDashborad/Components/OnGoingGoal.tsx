import React, { useEffect, useState } from 'react';
import CusText from '../../../../../ui/custom-text';
import { showToast, toastTypes } from '../../../../../services/toastService';
import { deleteGoalPlanApi, getAllGoalTypeApi, getAllongoingGoal } from '../../../../../api/homeapi';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Wrapper from '../../../../../ui/wrapper';
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../../../../styles/variables';
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { getGoalTypeImage, IMAGE_URL_GOAL } from '../../../../../utils/Commanutils';
import { styles } from '../../goaltabview/goalDashboardStyle';
import Spacer from '../../../../../ui/spacer';
import CusButton from '../../../../../ui/custom-button';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import DeleteAlert from '../../component/deleteAlert';
import API from '../../../../../utils/API';
import IonIcon from 'react-native-vector-icons/Ionicons';
import NoRecords from '../../../../../shared/components/NoRecords/NoRecords';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import LinearGradient from 'react-native-linear-gradient';
import CommonModal from '../../../../../shared/components/CommonAlert/commonModal';
// const OnGoingGoal = ({ setVisible, setGoalPlanID, setgoalId }: any) => {
const OnGoingGoal = ({ setgoalId, setGoalPlanID, setGoalName, riskprofileData }: any) => {

  const navigation: any = useNavigation();
  const isFocused = useIsFocused();
  const [onGoingGoalTypesData, setonGoingGoalTypesData] = useState<any[]>([]);
  const [actions, setAction] = useState<any[]>([
    {
      id: 1,
      name: 'Edit',
      icon: 'create',
    },
    {
      id: 2,
      name: 'Delete',
      icon: 'trash',
    },
    {
      id: 3,
      name: 'Execute',
      icon: 'eye',
    },
    {
      id: 4,
      name: 'Details',
      icon: 'brush',
    },
  ]);
  const [title, settitle] = useState('');
  const [id, setid] = useState('');
  const [actionIndex, setActionIndex] = useState(null);
  const [isVisible, setisVisible] = useState<boolean>(false);
  const [loader, setloader] = useState<boolean>(false);
  const [loading_loader, setLoading_Loader] = useState<boolean>(false);
  useEffect(() => {
    goalTypes();
  }, [isFocused]);

  const goalTypes = async () => {
    try {
      const [result, error]: any = await getAllongoingGoal();
      console.log('result--**--', result);
      console.log('result?.data----', result?.data);
      console.log('result?.error----', error);
      if (result) {
        if (result?.data?.onGoingGoalDetails.length > 0) {
          setonGoingGoalTypesData(result?.data?.onGoingGoalDetails);
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
  const deleteAPI = async () => {
    try {
      setloader(true);
      const result: any = await API.delete(`goal-plans/remove/${id}`);
      if (result?.code === 200) {
        console.log('data---', result?.data);
        if (result?.data) {
          setloader(false);
          setisVisible(false);
          goalTypes();
        } else {
          setloader(false);
        }
      } else {
        setloader(false);
        showToast(toastTypes.info, result?.msg);
      }
    } catch (error: any) {
      console.log('onGoingGoalTypes Catch Error 1', error);
      showToast(toastTypes.error, error[0].msg);
    }
  };

  const toggleActionArea = (index: any) => {
    if (index === actionIndex) {
      setActionIndex(null)
    } else {
      setActionIndex(index)
    }

  }


  const deleteGoal = async (id: any) => {
    try {
      let payload: any = {
        id: id
      }
      setloader(true);
      const [result, error]: any = await deleteGoalPlanApi(payload);
      if (result?.data === 1) {
        setloader(false);
        setisVisible(false);
        showToast(toastTypes.success, result?.msg);
        goalTypes()
      } else {
        console.log('delete Error : ', error);
        showToast(toastTypes.success, result?.error);

      }

    } catch (error) {
      console.log('onGoingGoalTypes Catch Error', error);
      showToast(toastTypes.error, error);

    }
  }


  const performActions = (action: any, data: any) => {
    if (action?.id === 1) {
      // setisModalVisible(true),
      setgoalId(data?.id),
        setGoalPlanID(action?.id),
        setGoalName(data?.GoalType?.goal_name)
      // setEditGoalData(data)
      navigation.navigate('SuggestedScheme', { goalPlanID: data?.id, goalData: data })
    }
    if (action?.id === 2) {
      setid(data?.id)
      // deleteGoal(data?.id)
      setisVisible(true)
    }

  }

  const renderItem = ({ item, index }: any) => {
    let investType: any = '';
    let recommended: any = '';
    let months: any = '';
    if (item?.sip_amt === 0) {
      investType = 'Lumpsum';
      recommended = item?.lumpsum_amt;
      months = item?.duration_mts;
    }
    if (item?.lumpsum_amt === 0) {
      investType = 'SIP';
      recommended = item?.sip_amt;
      months = item?.sip_duration_mts;
    }
    return (
      <>
        <Wrapper customStyles={{
           borderRadius: borderRadius.medium,
          borderWidth: 1,
           marginVertical: responsiveWidth(2),
           borderColor: colors.gray,
          paddingVertical: responsiveWidth(4),
          paddingHorizontal: responsiveWidth(5),

        }}>
          <Wrapper row align='center' justify='apart' customStyles={{ paddingVertical: responsiveWidth(1) }}>
            <CusText bold color={colors.black} size='M' text={item?.goal_label} />
            {/* <TouchableOpacity onPress={() => { toggleActionArea(index) }} activeOpacity={0.6}>

              <Wrapper position='center' align='center' justify='center' color={colors.Hard_White} customStyles={{ borderRadius: borderRadius.ring, padding: responsiveWidth(0) }}>
                <IonIcon size={responsiveWidth(8)} name={'ellipsis-vertical-circle'} color={colors.orange} />
              </Wrapper>
            </TouchableOpacity> */}
          </Wrapper>
          <Wrapper align='center' justify='apart' row customStyles={{}}>
            <Wrapper row align='center'>
              <CusText bold color={colors.label} size='SN' text={'Category : '} />
              <CusText bold color={colors.label} size='SN' text={item?.GoalType?.goal_name} />
            </Wrapper>
            <Wrapper color={colors.primary1} customStyles={{ minWidth: responsiveWidth(20), paddingVertical: responsiveWidth(1), paddingHorizontal: responsiveWidth(2), borderRadius: borderRadius.middleSmall }}>
              <CusText position='center' bold color={colors.Hard_White} size='SN' text={investType} />
            </Wrapper>
          </Wrapper>
          <Wrapper row align='center' justify='apart' customStyles={{ marginTop: responsiveWidth(2) }}>
            <Wrapper>
              <CusText  size='SN' text={'Target'} semibold color={colors.black}/>
           
            </Wrapper>
            <Wrapper align='end'>
               <CusText
                semibold
                size="M"
                color={colors.primary}
                text={'₹' + (item?.target_amt || 0)}
              />
            </Wrapper>
          </Wrapper>
          <Wrapper row align='center' justify='apart' customStyles={{ marginTop: responsiveWidth(2) }}>
            <Wrapper>
                <CusText size='SN' text={'Current Value'} semibold color={colors.black}/>
           
            </Wrapper>
            <Wrapper align='end'>
              <CusText
                extraBold
                size="M"
                color={colors.primary}
                text={'₹' + (item?.totalAlloc?.Current || 0)}
              />
            </Wrapper>
          </Wrapper>
          <Wrapper justify='apart' row align='center' borderColor={colors.primary} customStyles={{ marginTop: responsiveWidth(2), borderWidth: 1, borderRadius: borderRadius.middleSmall, paddingHorizontal: responsiveWidth(2), paddingVertical: responsiveWidth(2) }}>
            <CusText color={colors.label} size="SN" text={'Achieved'} />
            <CusText
              color={colors.label}
              bold
              size="SN"
              text={
                (
                  (item?.totalAlloc?.Current?.toFixed(2) /
                    item?.target_amt.toFixed(2)) *
                  100
                ).toFixed(2) + '%'
              }
            />
          </Wrapper>
          <Wrapper customStyles={{ marginTop: responsiveWidth(3) }}>
            {/* <Wrapper justify='apart' row align='center' >
              <Wrapper align='start'>
                <CusText size='SS' text={'Invested - Months'} />
                <CusText
                  bold
                  size="M"
                  color={colors.primary}
                  text={'₹' + (item?.totalAlloc?.Invested || 0) + ' - ' + (item?.totalAlloc?.transaction_month || 0)}
                />
              </Wrapper>
              <Wrapper align='end'>
                <CusText size='SS' text={'Recommended - Months'} />
                <CusText
                  bold
                  size="M"
                  color={colors.primary}
                  text={'₹' + (recommended || 0) + ' - ' + (months || 0)}
                />
              </Wrapper>
            </Wrapper> */}
            <Wrapper justify='apart' row align='center' >
              <Wrapper row align='start'>
                <CusText semibold size='SS' text={'Invested : '} />
                <CusText
                  size="SS"
                  color={colors.primary}
                  text={'₹' + (item?.totalAlloc?.Invested || 0)}
                />
              </Wrapper>
              <Wrapper row align='end'>
                <CusText semibold size='SS' text={'Months : '} />
                <CusText
                  size="SS"
                  color={colors.primary}
                  text={(item?.totalAlloc?.transaction_month || 0)}
                />
              </Wrapper>
            </Wrapper>
            <Wrapper justify='apart' row align='center' customStyles={{ marginTop: responsiveWidth(3) }} >
              <Wrapper row align='end'>
                <CusText semibold size='SS' text={'Recommended : '} />
                <CusText
                  size="SS"
                  color={colors.primary}
                  text={'₹' + (recommended || 0)}
                />
              </Wrapper>
              <Wrapper row align='end'>
                <CusText semibold size='SS' text={'Months : '} />
                <CusText
                  size="SS"
                  color={colors.primary}
                  text={(months || 0)}
                />
              </Wrapper>
            </Wrapper>
          </Wrapper>
                <Spacer y='XXS' />
                 <Wrapper customStyles={{ marginTop: responsiveWidth(2) }}>
                <LinearGradient
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                   colors={[colors.primary, colors.primary, colors.primary]}
                   style={{ width: '100%', height: 1, opacity: 0.5 }}></LinearGradient>
               </Wrapper>
               <Spacer y='XXS' />
                <Wrapper row justify='apart' align='center' position='center' customStyles={{ gap: responsiveWidth(2) }}>
                  {
                    actions.map((aitem: any, aindex: any) => {
                      return (
                        <>
                          <TouchableOpacity onPress={() => { performActions(aitem, item) }} activeOpacity={0.6}>
                            <Wrapper row position='center' align='center' justify='center' color={colors.secondary} customStyles={{ gap: responsiveWidth(1), 
                            borderRadius: borderRadius.middleSmall, 
                              paddingVertical: responsiveWidth(2),
                               paddingHorizontal: responsiveWidth(2),
                               width:responsiveWidth(20) }}>
                              {/* <IonIcon size={responsiveWidth(5)} name={aitem?.icon} color={colors.orange} /> */}
                              <CusText semibold size='SS' text={aitem?.name} color={colors.white}/>
                            </Wrapper>
                          </TouchableOpacity>
                        </>
                      )
                    })
                  }
                </Wrapper>
              

        </Wrapper>
      </>
    );
  };

  return (
    <>
      <Wrapper
        color={colors.primaryContainerBg}
        height={responsiveHeight(80)}
        customStyles={{
          borderBottomLeftRadius: borderRadius.medium,
          borderBottomRightRadius: borderRadius.medium,
          marginHorizontal:responsiveWidth(3)
        }}>
        <FlatList
          data={onGoingGoalTypesData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={() => <NoRecords />}
          // ItemSeparatorComponent={() =>
          //   <>
          //     <Wrapper customStyles={{ marginTop: responsiveWidth(2) }}>
          //       <LinearGradient
          //         start={{ x: 1, y: 0 }}
          //         end={{ x: 0, y: 1 }}
          //         colors={[colors.primary, colors.primary, colors.primary]}
          //         style={{ width: '100%', height: 2, opacity: 0.5 }}></LinearGradient>
          //     </Wrapper>
          //   </>}
        />
      </Wrapper>
      {/* <DeleteAlert
        isVisible={isVisible}
        setisVisible={(value: any) => setisVisible(value)}
        title={title}
        btnCallParent={() => {
          deleteGoal(id)
        }}
        btnTitle={
          loader ? <ActivityIndicator color={colors.Hard_White} /> : 'Yes'
        }
      /> */}

      <CommonModal
        visible={isVisible}
        onClose={() => { setisVisible(false) }}
        iconName="alert-circle-outline"
        iconColor={colors.red}
        iconSize={responsiveWidth(20)}
        title="Delete Goal"
        description={`Are you sure want to Delete this Goal?`}
        button1Text="No"
        onButton1Press={() => {
          setisVisible(false)
        }}
        button2Text="Yes"
        onButton2Press={async () => { deleteGoal(id) }}

      />

    </>
  );
}


export default OnGoingGoal