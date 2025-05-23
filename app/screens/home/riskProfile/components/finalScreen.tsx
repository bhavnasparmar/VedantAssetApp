import React, { useEffect, useState } from "react";
import { AppearanceContext } from "../../../../context/appearanceContext";
import Container from "../../../../ui/container"
import Wrapper from "../../../../ui/wrapper"
import { borderRadius, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import Spacer from "../../../../ui/spacer";
import CusButton from "../../../../ui/custom-button";
import CusText from "../../../../ui/custom-text";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { styles } from "../riskProfileStyles";
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { setRiskObject } from "../../../../utils/Commanutils";
const { width } = Dimensions.get('window');
const HALF_CIRCLE_SIZE = width * 0.8;

const FinalScreen = ({ setIndex, data }: any) => {
  const { colors }: any = React.useContext(AppearanceContext);
  const [totaldata, settotaldata] = useState(data?.totalPoints)
  const navigation: any = useNavigation()
  const getColor = (score: any) => {
    console.log("score", score)
    if (score < 20) return '#FF6347'; // Red for low score
    if (score < 30) return colors.green;
    if (score < 40) return '#FFA500'; // Orange for moderate score
    return '#4CAF50'; // Green for high score
  };
  useFocusEffect(
    React.useCallback(() => {
      if (data?.totalPoints) {
        settotaldata(data.totalPoints);
      }
    }, [data])
  );
  const handleBack = () => {
    setIndex('2')
  }

  return (
    <>
      {data &&
        <Container Xcenter>
          <Wrapper position="center" color={colors.cardBg} width={responsiveWidth(94)} customStyles={{ borderRadius: borderRadius.large, marginVertical: responsiveWidth(3) }}>
            <Wrapper row justify="center" color={colors.cardBg1} customStyles={{ borderTopLeftRadius: borderRadius.large, borderTopRightRadius: borderRadius.large, padding: responsiveWidth(5) }}>
              <TouchableOpacity onPress={() => { handleBack() }}>
                {/* <Icon name='chevron-back-outline' color={colors.Hard_Black} size={30} /> */}
              </TouchableOpacity>
              <CusText text={"Your Risk Profile is "} size="SL" medium position="center" />
              <CusText text={data?.porfile || '-'} size="SL" medium position="center" />
            </Wrapper>
            <Wrapper customStyles={{ padding: responsiveWidth(5), minHeight: responsiveHeight(45) }}>
              <Wrapper>
                {/* Put chart here */}
              </Wrapper>
              <CusText text={"Your Investment Style"} size="XL" semibold color={colors.primary} position="center" />
              <Spacer y="S" />
              {data !== null ?
                <AnimatedCircularProgress
                  size={HALF_CIRCLE_SIZE}
                  width={15}
                  fill={data?.totalPoints || 0}
                  tintColor={getColor(data?.totalPoints)}
                  backgroundColor="#E0E0E0"
                  arcSweepAngle={180}
                  rotation={270}
                  lineCap="round"
                >
                  {() => (
                    <View style={styles.scoreContainer}>
                      <Text style={styles.scoreText}>{data?.totalPoints}</Text>
                      <Text style={styles.label}>Your Score</Text>
                    </View>
                  )}
                </AnimatedCircularProgress>
                : null}

              <Spacer y='S' />
              <CusText text={data?.RiskCategory?.risk_desc || '-'} size="MS" medium position="center" />
              <Spacer y="S" />
              <Wrapper row justify="apart" position="center" width={responsiveWidth(84)}>
                <CusButton textcolor="black" radius={borderRadius.ring} title='Retake' width={responsiveWidth(35)} onPress={() => { 
                    setRiskObject(null) ,setIndex('1')
                  }} color={colors.transparent} />
                <CusButton radius={borderRadius.ring} title='Finish' width={responsiveWidth(35)}
                  // onPress={() => { setIndex('4') }}
                  onPress={() => {
                    navigation.navigate('Tabs')
                  }}
                />
              </Wrapper>
              <Spacer y="S" />
            </Wrapper>
          </Wrapper>
        </Container>}
    </>
  )
}


export default FinalScreen