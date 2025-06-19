import React, {useEffect, useState} from 'react';
import CusText from '../../../../../ui/custom-text';
import Wrapper from '../../../../../ui/wrapper';
import {
  borderRadius,
  colors,
  responsiveHeight,
  responsiveWidth,
} from '../../../../../styles/variables';

import API from '../../../../../utils/API';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-vector-icons/Icon';
import {styles} from '../goalDashboardStyle';
// import { showToast, toastTypes } from "../../../../../services/toastService";
import {getGoalTypeImage} from '../../../../../utils/Commanutils';
import {showToast, toastTypes} from '../../../../../services/toastService';
import {getAllGoalTypeApi} from '../../../../../api/homeapi';
import Spacer from '../../../../../ui/spacer';

const NewGoal = ({setisVisible, setgoalId, setGoalPlanID}: any) => {
  const navigation: any = useNavigation();
  const isFocused = useIsFocused();
  const [goalTypesData, setGoalTypesData] = useState<any[]>([]);

  useEffect(() => {
    goalTypes();
  }, [isFocused]);

  const goalTypes = async () => {
    try {
      const [result, error]: any = await getAllGoalTypeApi();
      console.log('result--**--', result);
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

      // const result: any = await API.get('goal-plans');
      // if (result?.code === 200) {
      //     if (result?.data.length > 0) {
      //         setGoalTypesData(result?.data)
      //     } else {
      //         showToast(toastTypes.info, 'No Data Found')
      //     }
      // } else {
      //     showToast(toastTypes.info, result?.msg)
      // }
    } catch (error: any) {
      console.log('goalTypes Catch Error', error);
      showToast(toastTypes.error, error[0].msg);
    }
  };
  const renderItem = ({item}: any) => (
    <TouchableOpacity style={styles.newGoalcard} onPress={() => { setgoalId(item?.goal_type_id), setGoalPlanID(''), setisVisible(true) }}>
      {/* <Image source={item.image} style={styles.image} resizeMode="contain" /> */}
      <Image
        resizeMode="contain"
        source={{uri: getGoalTypeImage(item?.goal_icon)}}
        style={styles.image}></Image>
      <CusText
        position="center"
        text={item?.goal_name + '1'}
        // color={colors.Hard_White}
        size="XMS"
        customStyles={styles.title}
      />
      {/* <CusText   text={item.title} /> */}
    </TouchableOpacity>
  );

  return (
    <>
    <Wrapper>
        <Spacer y='S' />
      <FlatList
      showsVerticalScrollIndicator ={false}
        style={{paddingHorizontal: responsiveWidth(4)}}
        data={goalTypesData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.rowCard}
        contentContainerStyle={{paddingBottom: 10}}
      />
       <Spacer y='S' />
      </Wrapper>
    </>
  );
};
export default NewGoal;
