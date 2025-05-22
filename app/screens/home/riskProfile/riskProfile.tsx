import React, {useEffect, useState} from 'react';

import StartProfile from './components/startProfile';
import FirstScreen from './components/firstScreen';
import FinalScreen from './components/finalScreen';
import API from '../../../utils/API';
import SecondScreen from './components/secondScreen';
import {
  getLoginUserDetails,
  getRiskObjectData,
  RISK_PROFILE_FINAL,
  setLoginUserDetails,
  setRiskObject,
  updateObjectKey,
  USER_DATA,
} from '../../../utils/Commanutils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Header from '../../../shared/components/Header/Header';
import {
  getAllRiskQuestionAPi,
  getRiskProfileInvestorAPi,
} from '../../../api/homeapi';

const RiskProfile = () => {
  const [index, setindex] = useState('1');
  const [finalScreen, setfinalScreen] = useState<any>({});
  const [basicDetail, setbasicDetail] = useState<any>({});
  const [queList, setqueList] = useState<any[]>([]);
  const [flag, setflag] = useState(false);
  const isFocused = useIsFocused();
 useFocusEffect(
      React.useCallback(() => {
        if (getRiskObjectData() === null) {
          setindex('1');
          setfinalScreen(null);
        }
        getData();
        getRiskProfile();
        return () => {
           setindex('1');
        };
      }, [isFocused]),
    );
  const getData = async () => {
    const data: any = await AsyncStorage.getItem(RISK_PROFILE_FINAL);
    console.log('RISK_PROFILE_FINAL data', data);
    let data1 = JSON.parse(data);
    setfinalScreen(data1);
    const useretail: any = await AsyncStorage.getItem(USER_DATA);

    let useretail1 = JSON.parse(useretail);
    console.log('USER_DATA data', useretail1);
    setbasicDetail(useretail1);
  };
  const getRiskProfile = async () => {
    try {
      const [result, error]: any = await getRiskProfileInvestorAPi();
      console.log('getRiskProfileInvestorAPi result', result);
      if (result != null) {
        console.log('getRiskObjectData()--', getRiskObjectData());
        if (result?.data != null) {
          if (flag) {
            setindex('1');
            setfinalScreen(null);
            getQuestionListForList();
          } else {
            setindex('3');
            setfinalScreen(result?.data);
            setRiskObject(result?.data);
          }
        } else if (getRiskObjectData() !== null) {
          if (flag) {
            setfinalScreen(null);
          }
          setqueList(getRiskObjectData());
        } else {
          if (flag) {
            setfinalScreen(null);
          }

          if (result?.data) {
            setqueList(result?.data);
          } else {
            getQuestionListForList();
          }
        }
      } else {
        console.log('getRiskProfileInvestorAPi error', error);
      }
    } catch (error) {
      console.log(error, 'getRiskProfileInvestorAPi error');
    }
  };

  const getQuestionListForList = async () => {
    try {
      const [result, error]: any = await getAllRiskQuestionAPi();
      console.log('getAllRiskQuestionAPi result', result);
      if (result != null) {
        //setIndex('4');
        // const updatedUser = updateObjectKey(
        //   getLoginUserDetails(),
        //   'User_risk_profile',
        //   result?.data?.userRiskProfileData,
        // );
        // setLoginUserDetails(updatedUser);
        setqueList(result?.data);

        await AsyncStorage.setItem(
          RISK_PROFILE_FINAL,
          JSON.stringify(result?.data),
        );
      } else {
        console.log('getAllRiskQuestionAPi error', error);
      }
    } catch (error) {
      console.log(error, 'getAllRiskQuestionAPi error');
    }
  };
  return (
    <>
      <Header menubtn name={'Risk Profile'} />
   
      {index == '1' && !finalScreen ? (
        <StartProfile
          setIndex={(val: any) => {
            setindex(val);
          }}
        />
      ) : null}

      {index == '2' && !finalScreen ? (
        <SecondScreen
          setIndex={(val: any) => {
            setindex(val);
          }}
          queList={queList}
          setdata={(data: any) => {
            setfinalScreen(data);
          }}
        />
      ) : // <></>
      null}
      {index == '3' || finalScreen ? (
        <FinalScreen
          setIndex={(val: any) => {
            if (val == '1') {
              setflag(true);
              getRiskProfile();
            }
            // if (val == '3') {
            //   console.log('val 3: ', val);
            //   setflag(true);
            //   setfinalScreen(null);
            // }
            setindex(val);
          }}
          data={finalScreen}
        />
      ) : null}

      {/* {index == '2' && !finalScreen ? (
        <FirstScreen
          setIndex={(val: any) => {
            setindex(val);
          }}
          basicDetail={basicDetail}
          setBasicDetail={(val: any) => {
            setbasicDetail(val);
          }}
        />
      ) : null} */}
      {/* 
            {index == "2" && !finalScreen ?
                <FirstScreen setIndex={(val: any) => { setindex(val) }} basicDetail={basicDetail} setBasicDetail={(val: any) => { setbasicDetail(val) }} /> : null}
            {index == "3" && !finalScreen ?
                // <SecondScreen setIndex={(val: any) => { setindex(val) }} queList={queList} setdata={(data: any) => { setfinalScreen(data) }} /> 
                <></>
                : null}
            {index == "4" || finalScreen ?
                <FinalScreen setIndex={(val: any) => {

                    if (val == '1') {
                        setflag(true)
                        getRiskProfile()
                    }
                    if (val == '3') {
                        console.log('val 3: ', val)
                        setflag(true)
                        setfinalScreen(null)
                    }
                    setindex(val)
                }} data={finalScreen} /> : null}
                  */}
    </>
  );
};
export default RiskProfile;
