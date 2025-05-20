import React, {useEffect, useState, useContext} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';

import {AppearanceContext} from '../../../../context/appearanceContext';
import {
  borderRadius,
  responsiveHeight,
  responsiveWidth,
} from '../../../../styles/variables';
import {styles} from '../riskProfileStyles';

import Container from '../../../../ui/container';
import Wrapper from '../../../../ui/wrapper';
import Spacer from '../../../../ui/spacer';
import CusButton from '../../../../ui/custom-button';
import CusText from '../../../../ui/custom-text';
import InputField from '../../../../ui/InputField';

import API from '../../../../utils/API';
import {
  getLoginUserDetails,
  getRiskObjectData,
  RISK_PROFILE_FINAL,
  RISK_PROFILE_INFODATA,
  setLoginUserDetails,
  setRiskObject,
  updateObjectKey,
} from '../../../../utils/Commanutils';

import {showToast, toastTypes} from '../../../../services/toastService';
import {getAllRiskQuestionAPi} from '../../../../api/homeapi';

const SecondScreen = ({setIndex, queList, setdata}: any) => {
  const {colors}: any = useContext(AppearanceContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionList, setQuestionList] = useState<any[]>(queList);
  const [selectedAns, setSelectedAns] = useState('');
  const [sliderValue, setSliderValue] = useState('');
  const [type3Answer, setType3Answer] = useState('');
  const [sliderMarkers, setSliderMarkers] = useState<any[]>([]);
  const [sliderRawValue, setSliderRawValue] = useState(0);

  const ageRanges = [
    {min: 20, max: 30, points: 3},
    {min: 31, max: 40, points: 5},
    {min: 41, max: 50, points: 4},
    {min: 51, max: 60, points: 2},
  ];

  useEffect(() => {
    // const savedData = getRiskObjectData();
    // if (savedData) {
    //   const lastIndex = savedData.length - 1;
    //   setCurrentIndex(lastIndex);
    //   setQuestionList(savedData);
    // }

    const lastIndex = queList.length - 1;
    setCurrentIndex(lastIndex);
    setQuestionList(queList);
  }, []);

  useEffect(() => {
    const current = questionList[currentIndex];
    if (current?.question_type === 3) {
      const allRangeValues = current?.Risk_profile_answers?.flatMap(
        (item: any) => [item.range_min, item.range_max],
      );
      const uniqueSorted = [...new Set(allRangeValues)].sort((a, b) => a - b);
      setSliderMarkers(uniqueSorted);
    }
  }, [questionList, currentIndex]);

  const getPointsByAge = (age: number) => {
    const match = ageRanges.find(range => age >= range.min && age <= range.max);
    return match ? match.points : 0;
  };

  const getPointsByMaritalStatus = (
    status: string,
    numberOfChildren: number,
  ) => {
    if (status === 'UNMARRIED') return 5;
    if (status === 'MARRIED') {
      if (numberOfChildren === 0) return 4;
      if (numberOfChildren === 1) return 3;
      if (numberOfChildren === 2) return 1;
      if (numberOfChildren > 2) return 0;
    }
    return 0;
  };

  const handleAnswerChange = (item: any, index: number) => {
    const updatedList = [...questionList];
    if (item.answer === selectedAns) {
      updatedList[index].selectAns = '';
      updatedList[index].Points = null;
      setSelectedAns('');
    } else {
      updatedList[index].selectAns = item.answer;
      updatedList[index].Points = item.point;
      setSelectedAns(item.answer);
    }
    setQuestionList(updatedList);
  };

  const handleSliderChange = (val: number) => {
    const currentQ = questionList[currentIndex];
    const match = currentQ.Risk_profile_answers.find(
      (item: any) => val >= item.range_min && val < item.range_max,
    );

    if (match) {
      const updated = [...questionList];
      updated[currentIndex].selectAns = val.toString();
      updated[currentIndex].Points = match.point;
      setQuestionList(updated);
      setSliderRawValue(val);
      setSliderValue(val.toString());
    } else {
      showToast(toastTypes.error, `Value is out of valid range.`);
    }
  };

  const handleSubmit = async () => {
    const infoData: any = await AsyncStorage.getItem(RISK_PROFILE_INFODATA);
    const data = JSON.parse(infoData);

    const answers = questionList.map((item: any) => ({
      queId: item.id,
      queType: item.question_type,
      selectedAnswer: item.selectAns,
      point: item.Points,
    }));

    setRiskObject(null);
    setRiskObject(questionList);

    try {
      const [result, error]: any = await getAllRiskQuestionAPi();
      console.log('getAllRiskQuestionAPi result', result);
      if (result != null) {
        setIndex('4');
        const updatedUser = updateObjectKey(
          getLoginUserDetails(),
          'User_risk_profile',
          result?.data?.userRiskProfileData,
        );
        setLoginUserDetails(updatedUser);
        setdata(result?.data);

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

  const renderMarkers = () => (
    <View style={styles.markersContainer}>
      {sliderMarkers.map((val, idx) => (
        <View key={idx} style={styles.markerContainer}>
          <View
            style={[styles.marker, +sliderValue >= val && styles.activeMarker]}
          />
          <Text style={styles.markerLabel}>{val}</Text>
        </View>
      ))}
    </View>
  );

  const currentQ = queList[currentIndex];

  const isNextEnabled = !!currentQ?.selectAns;

  return (
    <Container Xcenter>
      <Wrapper
        color={colors.cardBg1}
        customStyles={{
          borderTopLeftRadius: borderRadius.large,
          borderTopRightRadius: borderRadius.large,
          padding: responsiveWidth(5),
        }}>
        <CusText text={currentQ?.question} size="SL" medium position="center" />
      </Wrapper>

      <Wrapper
        customStyles={{
          padding: responsiveWidth(5),
          minHeight: responsiveHeight(45),
        }}>
        {currentQ?.question_type === 1 &&
          currentQ?.Risk_profile_answers?.map((item: any, i: number) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              style={[
                styles.radioList,
                {
                  borderColor:
                    currentQ.selectAns === item.answer
                      ? colors.primary
                      : colors.gray,
                },
              ]}
              onPress={() => handleAnswerChange(item, currentIndex)}>
              <Wrapper row>
                <IonIcon
                  name={
                    currentQ.selectAns === item.answer
                      ? 'radio-button-on-outline'
                      : 'radio-button-off-outline'
                  }
                  size={20}
                  color={
                    currentQ.selectAns === item.answer
                      ? colors.primary
                      : colors.gray
                  }
                  style={{marginRight: responsiveWidth(3)}}
                />
                <CusText
                  text={item.answer}
                  size="SN"
                  customStyles={{width: responsiveWidth(70)}}
                />
              </Wrapper>
            </TouchableOpacity>
          ))}

        {currentQ?.question_type === 3 && (
          <>
            <Slider
              style={styles.slider}
              minimumValue={currentQ?.Risk_profile_answers[0]?.range_min}
              maximumValue={currentQ?.Risk_profile_answers.at(-1)?.range_max}
              step={1}
              value={sliderRawValue}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={colors.purpleShades5}
              maximumTrackTintColor="#FFFFFF"
              thumbTintColor={colors.purpleShades5}
            />
            {renderMarkers()}
            <InputField
              keyboardType="numeric"
              value={sliderValue}
              width={100}
              onChange={(val: string) => handleSliderChange(Number(val))}
            />
          </>
        )}

        {currentQ?.question_type === 2 && (
          <InputField
            keyboardType="numeric"
            value={type3Answer}
            onChangeText={(text: string) => {
              const val = Number(text);
              const match = currentQ.Risk_profile_answers.find(
                (item: any) => val >= item.range_min && val < item.range_max,
              );
              if (match) {
                const updated = [...questionList];
                updated[currentIndex].selectAns = text;
                updated[currentIndex].Points = match.point;
                setQuestionList(updated);
                setType3Answer(text);
              } else {
                showToast(
                  toastTypes.error,
                  `Value ${text} is out of valid ranges.`,
                );
              }
            }}
          />
        )}
      </Wrapper>

      <Spacer y="S" />

      <Wrapper
        row
        justify="apart"
        position="center"
        width={responsiveWidth(84)}>
        <CusButton
          radius={borderRadius.ring}
          title="Back"
          width={responsiveWidth(35)}
          onPress={() =>
            setCurrentIndex(
              currentIndex === 0 ? () => setIndex('1') : currentIndex - 1,
            )
          }
          color={colors.transparent}
        />

        <CusButton
          width={responsiveWidth(35)}
          radius={borderRadius.ring}
          color={isNextEnabled ? colors.primary : colors.gray}
          title={
            currentIndex === questionList.length - 1 ? 'Finish' : 'Continue'
          }
          onPress={() => {
            if (!isNextEnabled) {
              showToast(
                toastTypes.error,
                currentQ?.question_type === 1
                  ? 'Please select an option'
                  : 'Please enter a valid value',
              );
              return;
            }

            if (currentIndex === questionList.length - 1) {
              handleSubmit();
            } else {
              setCurrentIndex(currentIndex + 1);
            }
          }}
        />
      </Wrapper>

      <Spacer y="S" />
    </Container>
  );
};

export default SecondScreen;
