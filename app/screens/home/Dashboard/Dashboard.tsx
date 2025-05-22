import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {AppearanceContext} from '../../../context/appearanceContext';
import Header from '../../../shared/components/Header/Header';
import {responsiveWidth} from '../../../styles/variables';
import Container from '../../../ui/container';
import CusText from '../../../ui/custom-text';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getRiskObjectData,
  RISK_PROFILE_FINAL,
  setRiskObject,
  USER_DATA,
} from '../../../utils/Commanutils';
import {getRiskProfileInvestorAPi} from '../../../api/homeapi';

const Dashboard = () => {
  const isFocused: any = useIsFocused();
  const navigation: any = useNavigation();
  const {colors}: any = React.useContext(AppearanceContext);
  const [desc, setDesc] = useState<any>('');

  useEffect(() => {
    getRiskProfile();
  }, [isFocused]);

  const getRiskProfile = async () => {
    try {
      const [result, error]: any = await getRiskProfileInvestorAPi();
      console.log('getRiskProfileInvestorAPi result', result);
      if (result != null) {
        
        if (result?.data != null) {
          //setfinalScreen(result?.data);
          setRiskObject(result?.data);
          //  setindex('3');
        } else {
          setRiskObject(null);
        }
      } else {
        console.log('getRiskProfileInvestorAPi error', error);
      }
    } catch (error) {
      console.log(error, 'getRiskProfileInvestorAPi error');
    }
  };
  return (
    <>
      <Header menubtn name={'Dashboard'} />
      <Container Xcenter contentWidth={responsiveWidth(100)}>
        <Spacer y="XS" />
        <Wrapper customStyles={{paddingHorizontal: responsiveWidth(5)}}>
          <CusText title size="L" text={''} />
        </Wrapper>
        <Spacer y="XS" />
      </Container>
    </>
  );
};

export default Dashboard;
