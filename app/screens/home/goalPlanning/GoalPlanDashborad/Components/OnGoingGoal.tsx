import React, { useEffect, useState } from 'react';
import CusText from '../../../../../ui/custom-text';
import { showToast, toastTypes } from '../../../../../services/toastService';
import { getAllGoalTypeApi, getAllongoingGoal } from '../../../../../api/homeapi';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Wrapper from '../../../../../ui/wrapper';
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../../../../styles/variables';
import { ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { getGoalTypeImage, IMAGE_URL_GOAL } from '../../../../../utils/Commanutils';
import { styles } from '../../goaltabview/goalDashboardStyle';
import Spacer from '../../../../../ui/spacer';
import CusButton from '../../../../../ui/custom-button';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import DeleteAlert from '../../component/deleteAlert';
import API from '../../../../../utils/API';
import IonIcon from 'react-native-vector-icons/Ionicons';
import NoRecords from '../../../../../shared/components/NoRecords/NoRecords';
const OnGoingGoal = ({setVisible, setGoalPlanID, setgoalId}: any) => {

   const navigation: any = useNavigation();
  const isFocused = useIsFocused();
  const [onGoingGoalTypesData, setonGoingGoalTypesData] = useState<any[]>([]);
  const [title, settitle] = useState('');
  const [id, setid] = useState('');
  const [isVisible, setisVisible] = useState<boolean>(false);
  const [loader, setloader] = useState<boolean>(false);
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
      console.log('onGoingGoalTypes Catch Error', error);
      showToast(toastTypes.error, error[0].msg);
    }
  };
 const renderItem = ({item}: any) => {
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
        <Wrapper
          customStyles={{
            borderRadius: borderRadius.normal,
            borderColor: colors.gray,
            borderWidth: responsiveWidth(0.2),
            marginVertical: responsiveWidth(2),
            marginHorizontal: responsiveWidth(3),
          }}>
          <Wrapper
            row
            color={colors.Hard_White}
            // color={colors.yellow}
            customStyles={{
              borderTopEndRadius: borderRadius.normal,
              borderTopStartRadius:borderRadius.normal
            }}>
            <TouchableOpacity
              style={[
                styles.buttonongoing,
                {backgroundColor: colors.darkGrayShades},
              ]}
              onPress={() => {}}>
              <Image
                resizeMode="contain"
                source={{
                  uri:
                    IMAGE_URL_GOAL +
                    '/goalplanning/' +
                    item?.goal_type?.goal_icon,
                }}
                style={styles.flatlistImage}></Image>
              {/*  <Icon name='car-sport-outline' size={16} /> */}
            </TouchableOpacity>
            <Wrapper
              justify="center"
              customStyles={{
                width: responsiveWidth(55),
                padding: responsiveWidth(1),
              }}>
              <CusText bold text={item?.goal_label || '-'} size="MS" />
              <Wrapper row customStyles={{marginVertical: responsiveWidth(1)}}>
                <Wrapper
                  row
                  justify="center"
                 // width={responsiveWidth(25)}
                  customStyles={{
                    borderRadius: borderRadius.middleSmall,
                    borderWidth: responsiveWidth(0.5),
                    borderColor: colors.Hard_White,
                    padding: responsiveWidth(1),
                  }}>
                  <CusText
                    color={colors.Hard_White}
                    position="center"
                    text={'Category :'}
                  />
                  <CusText
                    color={colors.Hard_White}
                    position="center"
                    text={item?.goal_type?.goal_name || '-'}
                  />
                </Wrapper>
                <Spacer x="XXS" />
                <CusButton
                  textWeight="bold"
                  title={investType || '-'}
                  width={responsiveWidth(20)}
                  radius={borderRadius.middleSmall}
                  textStyle={{fontSize: fontSize.small}}
                  textArea={'100%'}
                  color={'rgba(255, 255, 255, 0.1)'}
                  textcolor={colors.Hard_White}
                  height={responsiveWidth(8)}
                />
              </Wrapper>
            </Wrapper>
            <TouchableOpacity
              onPress={() => {
                setisVisible(true),
                  settitle(item?.goal_label),
                  setid(item?.goal_plan_id);
              }}>
              <Wrapper
                height={responsiveHeight(5.5)}
                width={responsiveWidth(11)}
                color={'rgba(217, 109, 109, 1)'}
                customStyles={{
                  borderTopRightRadius: borderRadius.normal,
                  borderBottomLeftRadius: responsiveWidth(9),
                  bottom: responsiveHeight(0.1),
                  left: responsiveWidth(3.8),
                }}
                justify="center"
                align="center">
                <IonIcon
                  style={{marginLeft: responsiveWidth(1)}}
                  name="trash-outline"
                  color={colors.Hard_White}
                  size={fontSize.medium}
                />
              </Wrapper>
            </TouchableOpacity>
          </Wrapper>
          <Wrapper
            align="center"
            color={colors.gray}>
            <Wrapper width={responsiveWidth(87)} color={'rgba(255, 255, 255, 0.1)'} align="center" customStyles={{padding: responsiveWidth(1)}}>
            <CusText semibold color={'#E59F39'} text={'Target'} />
            <CusText semibold text={'₹' + item?.target_amt || 0} />
            </Wrapper>
          </Wrapper>
          <Wrapper row align="center" justify="center" customStyles={{borderBottomStartRadius:borderRadius.medium,borderBottomEndRadius:borderRadius.medium}} color={colors.containerBg}>
            <Wrapper customStyles={styles.card}>
              <Wrapper row justify="apart">
                <Wrapper>
                  <CusText text={'Invested'} color={colors.gray} />
                  <CusText text={0} />
                </Wrapper>
                <Wrapper>
                  <CusText text={'Months'} color={colors.gray} />
                  <CusText text={0} />
                </Wrapper>
              </Wrapper>
              <Spacer y="XXS" />
              <Wrapper row justify="apart">
                <Wrapper>
                  <CusText text={'Recommended'} color={colors.gray} />
                  <CusText text={'₹' + recommended || 0} />
                </Wrapper>
                <Wrapper>
                  <CusText text={'Months'} color={colors.gray} />
                  <CusText text={months || 0} />
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <Spacer x="N" />
            <Wrapper
              width={responsiveWidth(25)}
              height={responsiveHeight(13)}
              position="center"
              align="center"
              justify="center">
              <AnimatedCircularProgress
                size={75}
                width={3}
                fill={
                  (item.totalAlloc?.Current?.toFixed(2) /
                    item?.target_amt.toFixed(2)) *
                    100 || 0
                } // Score between 0 and 100
                tintColor={colors.secondary}
                backgroundColor="#E0E0E0"
                arcSweepAngle={360} // Half circle (180 degrees)
                rotation={360} // Start from bottom
                lineCap="round">
                {() => (
                  <Wrapper position="center" align="center">
                    <CusText text={'Achieved'} />
                    <CusText
                      semibold
                      text={
                        (
                          (item?.totalAlloc?.Current?.toFixed(2) /
                            item?.target_amt.toFixed(2)) *
                          100
                        ).toFixed(2) + '%'
                      }
                    />
                  </Wrapper>
                )}
              </AnimatedCircularProgress>
            </Wrapper>
          </Wrapper>
        </Wrapper>
        <Wrapper
          color={colors.containerBg}
          width={responsiveWidth(75)}
          customStyles={{
            borderRadius: borderRadius.normal,
            borderColor: colors.gray,
            borderWidth: responsiveWidth(0.2),
            alignSelf: 'center',
            padding: responsiveWidth(2),
            paddingVertical: responsiveHeight(0.7),
            bottom: responsiveWidth(2),
            borderTopStartRadius: 0,
            borderTopEndRadius: 0,
            borderTopWidth: 0,
          }}>
          <Wrapper
            customStyles={{paddingHorizontal: responsiveWidth(3)}}
            row
            justify='center'>
            <CusButton
              iconName="timer-outline"
              iconColor={colors.Hard_White}
              width={responsiveWidth(10)}
              height={responsiveWidth(10)}
              customStyle={{marginHorizontal:responsiveWidth(1)}}
              radius={borderRadius.ring}
              //   onPress={() => {
              //     navigation.navigate('SchemeList');
              //   }}

              onPress={() => {
              //  kycCheck(item);
              }}
            />
            <CusButton
              iconName="eye-outline"
              iconColor={colors.Hard_White}
              width={responsiveWidth(10)}
              height={responsiveWidth(10)}
              radius={borderRadius.ring}
              customStyle={{marginHorizontal:responsiveWidth(1)}}
              onPress={() => {
                navigation.navigate('GoalPlanningDetail', {
                  id: item?.goal_plan_id,
                });
              }}
            />
            <CusButton
              onPress={() => {
                // getEditDetails(item?.goal_plan_id)
               // setGoalPlanID(item?.goal_plan_id),
                 // setgoalId(''),
                 // setVisible(true);
              }}
              iconName="create-outline"
              customStyle={{marginHorizontal:responsiveWidth(1)}}
              iconColor={colors.Hard_White}
              width={responsiveWidth(10)}
              height={responsiveWidth(10)}
              radius={borderRadius.ring}
            />
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
        }}>
        <FlatList
          data={onGoingGoalTypesData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={() => <NoRecords />}
        />
      </Wrapper>
      <DeleteAlert
        isVisible={isVisible}
        setisVisible={(value: any) => setisVisible(value)}
        title={title}
        btnCallParent={() => {
          deleteAPI();
        }}
        btnTitle={
          loader ? <ActivityIndicator color={colors.Hard_White} /> : 'Yes'
        }
      />
    </>
  );
}


export default OnGoingGoal