import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AppearanceContext } from '../../../context/appearanceContext';
import Header from '../../../shared/components/Header/Header';
import { responsiveWidth } from '../../../styles/variables';
import Container from '../../../ui/container';
import CusText from '../../../ui/custom-text';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getKYC_Details,
  getRiskObjectData,
  RISK_PROFILE_FINAL,
  setRiskObject,
  USER_DATA,
} from '../../../utils/Commanutils';
import { getRiskProfileInvestorAPi } from '../../../api/homeapi';
import CommonModal from '../../../shared/components/CommonAlert/commonModal';

const Dashboard = () => {
  const isFocused: any = useIsFocused();
  const navigation: any = useNavigation();
  const { colors }: any = React.useContext(AppearanceContext);
  const [desc, setDesc] = useState<any>('');
  const [isVisible, setisVisible] = useState<boolean>(false);

  useEffect(() => {
    //getRiskProfile();
    checkKyc()
  }, [isFocused]);

  const checkKyc = async () => {
    const useretail: any = await AsyncStorage.getItem(USER_DATA);
    let useretail1 = JSON.parse(useretail);
    // console.log('USER_DATA data', useretail1);
    setisVisible(true)
  }

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

  const checkKycSteps = () => {
    setisVisible(false)
    if (getKYC_Details() && getKYC_Details()?.user_basic_details?.last_kyc_step === 1) {
      navigation.navigate('KycInfoPage')
      // navigation.navigate('KycDashboard')
      //KycDashboard
      // navigation.navigate('KycDigiLockerInfo')
    } else if (getKYC_Details() && getKYC_Details()?.user_basic_details?.last_kyc_step >= 2) {
      navigation.navigate('KycDashboard')
    }
    else {
      navigation.navigate('PancardVerify')
    }
  }

  return (
    <>
      <Header menubtn name={'Dashboard'} />
      <Container Xcenter contentWidth={responsiveWidth(100)}>
        <Spacer y="XS" />
        <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(5) }}>
          <CusText title size="L" text={''} />
        </Wrapper>
        <Spacer y="XS" />
      </Container>
      <CommonModal
        visible={isVisible}
        onClose={() => { setisVisible(false) }}
        description={`Your on-boarding process is pending, please click on continue to proceed.`}
        button1Text="Continue!"
        onButton1Press={() => {

          checkKycSteps()
        }}
      // button2Text="Yes"
      // onButton2Press={async () => { deleteGoal(id) }}

      />
    </>
  );
};

export default Dashboard;
