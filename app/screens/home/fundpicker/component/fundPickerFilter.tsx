import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import Wrapper from '../../../../ui/wrapper';
import CusText from '../../../../ui/custom-text';
import {
  borderRadius,
  colors,
  responsiveHeight,
  responsiveWidth,
} from '../../../../styles/variables';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DropDown from '../../../../ui/dropdown';
import CusButton from '../../../../ui/custom-button';
import Spacer from '../../../../ui/spacer';
import {useIsFocused} from '@react-navigation/native';
import {Switch, TouchableOpacity} from 'react-native';
import InputField from '../../../../ui/InputField';
import Slider from '@react-native-community/slider';

// import { getGoalPlanning, getLoginUserDetails, setGoalPlanningDetails } from '../../../../utils/Commanutils';
import API from '../../../../utils/API';
import {showToast, toastTypes} from '../../../../services/toastService';
// import { showToast, toastTypes } from '../../../../service/toastService';

const FundPickerFilter = ({isVisible, setisVisible}: any) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isSubmited, setisSubmited] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [slidervalue, setsliderValue] = useState(0);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [EditedData, setEditedData] = useState<any>({});
  const [months, setmonths] = useState<any>([
    {
      id: 1,
      Name: 'Months',
    },
    {
      id: 2,
      Name: 'Year',
    },
  ]);
  const [MYType, setMYType] = useState<any>('');
  const [Form, setForm] = useState({
    title: '',
    targetammount: '',
    inflation: 0,
    months: '',
  });
  const [FormError, setFormError] = useState({
    title: '',
    targetammount: '',
    inflation: '',
    months: '',
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    return () => {
      setForm({
        title: '',
        targetammount: '',
        inflation: 0,
        months: '',
      });
      setFormError({
        title: '',
        targetammount: '',
        inflation: '',
        months: '',
      });
    };
  }, [isFocused]);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    if (isEnabled == false) {
    } else {
    }
  };

  const clearData = () => {
    setisVisible(false);
  };

  const clearFomrData = () => {
    setForm({
      title: '',
      targetammount: '',
      inflation: 0,
      months: '',
    });
    setFormError({
      title: '',
      targetammount: '',
      inflation: '',
      months: '',
    });
    setisVisible(false);
  };

  const getEditDetails = async (goal_plan_id: any) => {
    try {
      const result: any = await API.get(
        `goal-plans/goal-details/${goal_plan_id}`,
      );
      if (result?.code === 200) {
        setEditedData(result?.data?.goal);
        handleFormChange({key: 'title', value: result?.data?.goal?.goal_label});
        handleFormChange({
          key: 'targetammount',
          value: String(result?.data?.goal?.target_amt),
        });
        if (result?.data?.goal?.inflation_perc !== 0) {
          setIsEnabled(true);
          handleFormChange({
            key: 'inflation',
            value: result?.data?.goal?.inflation_perc,
          });
        }
        handleFormChange({
          key: 'months',
          value: String(result?.data?.goal?.duration_mts),
        });
      } else {
        // showToast(toastTypes.info, result?.msg)
      }
    } catch (error: any) {
      console.log('getEditDetails Catch Error', error);
      showToast(toastTypes.error, error[0].msg);
    }
  };

  const handleFormChange = (values: any) => {
    const {key, value} = values;
    setForm((prev: any) => ({...prev, [key]: value}));
    handleValidate(isSubmited, values);
  };

  const submit = async () => {};

  function isMonthBetweenSixAndTwelve(month: any) {
    return month >= 6 && month <= 12;
  }

  const handleValidate = (flag = false, values: any) => {
    if (!flag) return;
    let isValid = true;
    let data = Form;

    if (values) {
      const {key, value} = values;
      data = {...data, [key]: value};
    }
    let title = '';
    if (!data?.title) {
      isValid = false;
      title = 'title is required';
    }

    let targetammount = '';
    if (!data?.targetammount) {
      isValid = false;
      targetammount = 'target ammount is required';
    }
    if (data?.targetammount && Number(data?.targetammount) < 9999) {
      isValid = false;
      targetammount = 'target ammount should be 10,000 or more ';
    }
    let inflation = '';
    if (isEnabled) {
      if (!data?.inflation) {
        isValid = false;
        inflation = 'inflation is required';
      }
    }

    let months = '';
    if (!data?.months) {
      isValid = false;
      months = 'months is required';
    }

    if (data?.months) {
      if (MYType === 1) {
        if (!isMonthBetweenSixAndTwelve(Number(data?.months))) {
          isValid = false;
          months = 'The month is not between 6 and 12.';
        }
      }
    }

    setFormError({
      title,
      targetammount,
      inflation,
      months,
    });
    return isValid;
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
      useNativeDriver={true}>
      <Wrapper
        width={responsiveWidth(90)}
        align="center"
        customStyles={{
          backgroundColor: colors.Hard_White,
          borderRadius: borderRadius.normal,
        }}>
        <Wrapper
          row
          justify="apart"
          customStyles={{
            paddingVertical: responsiveWidth(3),
            borderBottomWidth: 0.3,
            borderBottomColor: colors.inputLabel,
          }}>
          <CusText
           // position="center"
            customStyles={{
              paddingLeft: responsiveWidth(3),
              width: responsiveWidth(85),
            }}
            text={'Business'}
          />

          <IonIcon
            onPress={() => {
              clearData();
            }}
            name="close-outline"
            color={colors.Hard_White}
            size={25}></IonIcon>
        </Wrapper>

        <Spacer y="S" />

        <Wrapper row justify="apart" width={responsiveWidth(85)}>
          <InputField
            // label='When do you need these funds for Business ?'
            value={Form.months}
            width={responsiveWidth(50)}
            inputMode="numeric"
            placeholder={MYType === 1 ? 'Enter Month' : 'Enter Year'}
            onChangeText={(value: string) => {
              handleFormChange({key: 'months', value});
            }}
            labelStyle={{
              color: colors.inputLabel,
              width: responsiveWidth(50),
            }}
            keyboardType="email-address"
            borderColor={colors.placeholderColor}
            suffixColor={colors.placeholderColor}
            error={FormError.months}
          />
          <DropDown
            data={months}
            placeholder={'Months'}
            width={responsiveWidth(30)}
            placeholdercolor={colors.gray}
            value={MYType}
            fieldColor={colors.inputBg}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => setIsFocus(false)}
            valueField="id"
            labelField={'Name'}
            onChange={(item: any) => {
              console.log(item?.id);
              setMYType(item?.id);
            }}
            onClear={() => {
              setIsFocus(false);
            }}
          />
        </Wrapper>
        <Spacer y="S" />
        <CusButton
          loading={loader}
          width={responsiveWidth(40)}
          height={responsiveHeight(5)}
          title="Calculate"
          lgcolor1={colors.primary}
          lgcolor2={colors.secondary}
          position="center"
          radius={borderRadius.ring}
          onPress={() => {
            setisVisible(false)
           // submit();
          }}
        />
        <Spacer y="S" />
      </Wrapper>
    </Modal>
  );
};

export default FundPickerFilter;
const styles = {};
