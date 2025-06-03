import React, {useEffect, useState} from 'react';
import {AppearanceContext} from '../../../../context/appearanceContext';
import Container from '../../../../ui/container';
import Wrapper from '../../../../ui/wrapper';
import {
  borderRadius,
  colors,
  fontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../../styles/variables';
import Spacer from '../../../../ui/spacer';
import CusButton from '../../../../ui/custom-button';
import CusText from '../../../../ui/custom-text';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
// import {styles} from '../riskProfileStyles';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {setRiskObject} from '../../../../utils/Commanutils';
const {width} = Dimensions.get('window');
const HALF_CIRCLE_SIZE = width * 0.8;
const COLORS = ['#2E7D32', '#DCE775', '#FFEB3B', '#FFB74D', '#D32F2F']; // Low → High
const LABELS = ['Low', 'Moderately Low', 'Moderate', 'Moderately High', 'High'];

const FinalScreen = ({setIndex, data}: any) => {
  const {colors}: any = React.useContext(AppearanceContext);
  const [totaldata, settotaldata] = useState(data?.totalPoints || 0);
  const navigation: any = useNavigation();
  const getColor = (score: any) => {
    console.log('score', score);

    let per = (score / 20) * 100;
    if (per < 25) return '#D32F2F'; // Red for low score
    if (per < 41) return '#FFB74D';
    if (per < 58) return '#FFEB3B';
    if (per < 83) return '#DCE775'; // Orange for moderate score
    return '#2E7D32'; // Green for high score
  };
  const getLabel = (score: any) => {
    console.log('score', score);

    let per = (score / 20) * 100;
    if (per < 25) return 'High';
    if (per < 41) return 'Moderately High'; // Red for low score
    if (per < 58) return 'Moderate';
    if (per < 83) return 'Moderately Low'; // Orange for moderate score
    return 'Low'; // Green for high score
  };
  useFocusEffect(
    React.useCallback(() => {
      console.log('data', data);
      if (data?.totalPoints) {
        //   settotaldata(data.totalPoints);
      }
    }, [data]),
  );
  const handleBack = () => {
    setIndex('2');
  };

  return (
    <>
      {data && (
        <Container Xcenter>
          <Wrapper
            position="center"
            color={colors.cardBg}
            width={responsiveWidth(94)}
            customStyles={{
              borderRadius: borderRadius.large,
              marginVertical: responsiveWidth(3),
            }}>
          
             <Wrapper
             position='center'
             width={responsiveWidth(90)}
              row
              justify="center"
              color={colors.cardBg1}
              customStyles={{
                borderTopLeftRadius: borderRadius.large,
                borderTopRightRadius: borderRadius.large,
                padding: responsiveWidth(5),
                flexWrap : "wrap"
              }}>
            
              <CusText
                text={'Your Risk Profile is '}
                size="SL"
                medium
                position="center"
              />

              <Wrapper
                customStyles={{
                  paddingHorizontal: responsiveWidth(2),
                  borderRadius: borderRadius.medium,
                }}
                color={getColor(totaldata)}>
                <CusText
                  text={getLabel(totaldata) || '-'}
                  size="SL"
                  medium
                  position="center"
                  color={
                    getColor(totaldata) == '#2E7D32' ||
                    getColor(totaldata) == '#D32F2F'
                      ? colors.Hard_White
                      : colors.Hard_Black
                  }
                />
              </Wrapper>
            </Wrapper>
            <Wrapper
              customStyles={{
                padding: responsiveWidth(5),
                minHeight: responsiveHeight(45),
              }}>
              {/* <Wrapper>Put chart here</Wrapper> */}

              {data !== null ? (
                <AnimatedCircularProgress
                  style={{marginBottom: responsiveHeight(-12)}}
                  size={HALF_CIRCLE_SIZE}
                  width={15}
                  fill={(totaldata / 20) * 100 || 0}
                  tintColor={getColor(totaldata)}
                  backgroundColor="#E0E0E0"
                  arcSweepAngle={180}
                  rotation={270}
                  lineCap="round">
                  {() => (
                    <View style={styles.scoreContainer}>
                      <CusText
                        semibold
                        customStyles={styles.scoreText}
                        text={data?.totalPoints}
                      />
                      <CusText
                        bold
                        color={colors.gray}
                        size="M"
                        text={'Your Score'}
                      />
                    </View>
                  )}
                </AnimatedCircularProgress>
              ) : null}

              <Wrapper row align="center" customStyles={styles.legendContainer}>
                {COLORS.map((color, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View
                      style={[styles.legendColor, {backgroundColor: color}]}
                    />
                    <Text style={styles.legendText}>{LABELS[index]}</Text>
                  </View>
                ))}
              </Wrapper>
              <Spacer y="S" />
              <CusText
                text={'Your Investment Style'}
                size="XL"
                semibold
                color={colors.primary}
                position="center"
              />
              <Spacer y="S" />
              <CusText
                text={data?.RiskCategory?.risk_desc || '-'}
                size="MS"
                medium
                position="center"
              />
              <Spacer y="S" />
              <Wrapper
                row
                justify="apart"
                position="center"
                width={responsiveWidth(84)}>
                <CusButton
                  textcolor="black"
                  radius={borderRadius.ring}
                  title="Retake"
                  width={responsiveWidth(35)}
                  onPress={() => {
                    setRiskObject(null), setIndex('1');
                  }}
                  color={colors.transparent}
                  customStyle={{
                    borderWidth: 1,
                    borderRadius: borderRadius.ring,
                  }}
                />
                <CusButton
                  radius={borderRadius.ring}
                  title="Finish"
                  width={responsiveWidth(35)}
                  // onPress={() => { setIndex('4') }}
                  onPress={() => {
                    navigation.navigate('Tabs');
                  }}
                />
              </Wrapper>
              <Spacer y="S" />
            </Wrapper>
          </Wrapper>
        </Container>
      )}
    </>
  );
};

export default FinalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
    width: responsiveWidth(100),
  },
  scoreContainer: {
    // backgroundColor: 'pink',
    // position: 'absolute',
    //  top: '35%',
    marginTop: responsiveWidth(-12),
    alignItems: 'center',
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  scoreLabel: {
    fontSize: 16,
    color: 'gray',
  },
  legendContainer: {
    // flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // marginTop: 30,
    paddingHorizontal: responsiveWidth(2),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 6,
  },
  legendColor: {
    width: responsiveWidth(4),
    height: responsiveWidth(4),
    borderRadius: borderRadius.small,
    marginRight: responsiveWidth(2),
  },
  legendText: {
    fontSize: fontSize.normal,
    color: '#222',
  },
  investmentText: {
    marginTop: 8,
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.black,
  },
  label: {
    fontSize: 16,
    color: colors.black,
  },
});
