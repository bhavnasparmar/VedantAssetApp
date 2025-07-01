import React, {useEffect, useRef, useState} from 'react';
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
import * as echarts from 'echarts/core';
import { LineChart,GaugeChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { SVGRenderer, SvgChart } from '@wuba/react-native-echarts';
const {width} = Dimensions.get('window');
const HALF_CIRCLE_SIZE = width * 0.8;
const COLORS = ['#2E7D32', '#DCE775', '#FFEB3B', '#FFB74D', '#D32F2F']; // Low → High
const LABELS = ['Low', 'Moderately Low', 'Moderate', 'Moderately High', 'High'];

const FinalScreen = ({setIndex, data}: any) => {
  const {colors}: any = React.useContext(AppearanceContext);
  const [totaldata, settotaldata] = useState(data?.totalPoints || 0);
  const navigation: any = useNavigation();
   echarts.use([SVGRenderer, LineChart,GridComponent,GaugeChart ]);
      const chartRef = useRef<any>(null);
  // const getColor = (score: any) => {
  //   console.log('score', score);

  //   let per = (score / 20) * 100;
  //   if (per < 25) return '#D32F2F'; // Red for low score
  //   if (per < 41) return '#FFB74D';
  //   if (per < 58) return '#FFEB3B';
  //   if (per < 83) return '#DCE775'; // Orange for moderate score
  //   return '#2E7D32'; // Green for high score
  // };
  // const getLabel = (score: any) => {
  //   console.log('score', score);

  //   let per = (score / 20) * 100;
  //   if (per < 25) return 'High';
  //   if (per < 41) return 'Moderately High'; // Red for low score
  //   if (per < 58) return 'Moderate';
  //   if (per < 83) return 'Moderately Low'; // Orange for moderate score
  //   return 'Low'; // Green for high score
  // };
  const getColor = (score: number): string => {


    // [0.10, "#3e884d"],    // Low
    //           [0.32, "#ced450"],    // Moderately Low
    //           [0.64, "#f5e655"],    // Moderate
    //           [0.95, "#efa647"],    // Moderately High
    //           [1.00, "#cc3a3b"],    // High
  const per = score /  100;

  // if (per <= 25) return '#D32F2F';       // Very Low - Red
  // if (per <= 40) return '#FFB74D';       // Low - Orange
  // if (per <= 57) return '#FFEB3B';       // Moderate - Yellow
  // if (per <= 82) return '#DCE775';       // Good - Light Green
  // return '#2E7D32';                      // Excellent - Green
     if (per <= 0.10) return "#3e884d";
  if (per <= 0.32) return "#ced450";
  if (per <= 0.64) return "#f5e655";
  if (per <= 0.95) return "#efa647";
  return "#cc3a3b";
};

// Returns label based on percentage score
const getLabel = (score: number): string => {
  const per = score / 100;
  console.log('Percentage 11===>>>: ',per)
  if (per <= 0.10) return 'Low';
  if (per <= 0.32) return 'Moderately Low';
  if (per <= 0.64) return 'Moderate';
  if (per <= 0.95) return 'Moderately High';
  return 'High';
};
  useFocusEffect(
    React.useCallback(() => {
      console.log('data', data);
      if (data?.totalPoints) {
        //   settotaldata(data.totalPoints);
      }
    }, [data]),
  );
  // useEffect(() => {
  //   let chart: any;
  //   const option = {
  //     series: [
  //       {
  //         type: 'gauge',
  //         startAngle: 180,
  //         endAngle: 0,
  //         center: ['50%', '75%'],
  //         radius: '90%',
  //         min: 1,
  //         max: 100,
  //         // splitNumber: 1,
  //         axisLine: {
  //           lineStyle: {
  //             width: responsiveWidth(8),
  //             color: [
  //               [0.20, '#2E7D32'],
  //               [0.40, '#DCE775'],
  //               [0.60, '#FFEB3B'],
  //               [0.80, '#FFB74D'],
  //               [1, '#D32F2F']
  //             ]
  //           }
  //         },
  //         pointer: {
  //           icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
  //           length: '15%',
  //           width: 20,
  //           offsetCenter: [0, '-60%'],
  //           itemStyle: {
  //             color: 'black'
  //           }
  //         },
  //         axisTick: {
  //           length: 12,
  //           lineStyle: {
  //             color: 'white',
  //             width: 2
  //           }
  //         },
  //         splitLine: {
  //           length: 0,
  //           lineStyle: {
  //             color: 'white',
  //             width: 0
  //           }
  //         },
  //         axisLabel: {
  //           color: '#464646',
  //           fontSize: 20,
  //           distance: -60,
  //           rotate: 'tangential',
  //           formatter: function (value:any) {
  //             console.log("Value Data === ... ",value)
  //             if (value === 0.875) {
  //               return 'Grade A';
  //             } else if (value === 0.625) {
  //               return 'Grade B';
  //             } else if (value === 0.375) {
  //               return 'Grade C';
  //             } else if (value === 0.125) {
  //               return 'Grade D';
  //             }
  //             return '';
  //           }
  //         },
  //         title: {
  //           offsetCenter: [0, '-10%'],
  //           fontSize: 20
  //         },
  //         detail: {
  //           fontSize: 30,
          
  //           offsetCenter: [0, '-35%'],
  //           valueAnimation: true,
  //           formatter: function (value) {
  //             console.log('Value : ',value)
  //             return value;
  //           },
  //           color: 'black'
  //         },
  //         data: [
  //           {
  //             value: totaldata,
  //             name: 'Your Score'
  //           }
  //         ]
  //       }
  //     ]
  //   };
  //   if (chartRef.current) {
  //     chart = echarts.init(chartRef.current, 'light', {
  //       renderer: 'svg',
  //       width: responsiveWidth(100),
  //       height: responsiveWidth(70),
  //     });
  //     chart.setOption(option);
  //   }
  //   return () => chart?.dispose();
  // }, [])

   useEffect(() => {
    let chart: any;
    const option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        center: ["50%", "75%"],
        radius: "90%",
        min: 0,
        max: 1,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 36,
            color: [
              [0.10, "#3e884d"],    // Low
              [0.32, "#ced450"],    // Moderately Low
              [0.64, "#f5e655"],    // Moderate
              [0.95, "#efa647"],    // Moderately High
              [1.00, "#cc3a3b"],    // High
            ],
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowBlur: 10,
          },
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "12%",
          width: 20,
          offsetCenter: [0, "-60%"],
          itemStyle: {
            color: "rgba(0, 0, 0, 1)",
          },
        },
        axisTick: {
          length: 20,
          lineStyle: {
            color: "auto",
            width: 0,
          },
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: "auto",
            width: 0,
          },
        },
        axisLabel: {
          color: "#464646",
          fontSize: 10,
          distance: -60,
          width: 65,
          overflow: "break",
          rotate: "tangential",
          formatter: function (value: number) {
            return "";
          },
        },
        title: {
          offsetCenter: [0, "-10%"],
          fontSize: 14,
          color: "#aaa",
        },
        detail: {
          fontSize: 50,
          offsetCenter: [0, "-35%"],
          valueAnimation: true,
          formatter: function (value: number) {
            return Math.round(value * 100) + "";
          },
          color: "#000",
        },
        data: [
          {
            value: Number(totaldata) / 100,
            name: "Your Score",
            detail: {
              color: "rgba(0, 0, 0, 1)",
            },
          },
        ],
      },
    ],
  };
    if (chartRef.current) {
      chart = echarts.init(chartRef.current, 'light', {
        renderer: 'svg',
        width: responsiveWidth(100),
        height: responsiveWidth(70),
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [totaldata])
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
                <>
                  <Wrapper position='center'>
                     <SvgChart ref={chartRef} />
                     </Wrapper>
                </>
                // <AnimatedCircularProgress
                //   style={{marginBottom: responsiveHeight(-12)}}
                //   size={HALF_CIRCLE_SIZE}
                //   width={15}
                //   fill={(totaldata / 20) * 100 || 0}
                //   tintColor={getColor(totaldata)}
                //   backgroundColor="#E0E0E0"
                //   arcSweepAngle={180}
                //   rotation={270}
                //   lineCap="round">
                //   {() => (
                //     <View style={styles.scoreContainer}>
                //       <CusText
                //         semibold
                //         customStyles={styles.scoreText}
                //         text={data?.totalPoints}
                //       />
                //       <CusText
                //         bold
                //         color={colors.gray}
                //         size="M"
                //         text={'Your Score'}
                //       />
                //     </View>
                //   )}
                // </AnimatedCircularProgress>
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
