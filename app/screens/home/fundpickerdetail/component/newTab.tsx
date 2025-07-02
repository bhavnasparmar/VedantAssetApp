import React, { useEffect, useRef, useState, useContext } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import { SVGRenderer, SvgChart } from '@wuba/react-native-echarts';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { colors, responsiveHeight, responsiveWidth, borderRadius, fontSize } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import styles from '../funpickerdetailstyles';

const NavTab = () => {
    const { colors }: any = useContext(AppearanceContext);
    const chartRef = useRef<any>(null);
    const [selectedPeriod, setSelectedPeriod] = useState('1Y');
    
    // Register necessary echarts components
    echarts.use([SVGRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent]);
    
    // Sample data for different time periods
    const chartData:any = {
        '1Y': {
            dates: ['25 May', '26 May', '27 May', '28 May', '29 May', '30 May', '31 May'],
            fund: [0.3, 0.5, 0.4, 0.6, 0.5, 0.4, 0.5],
            categoryAvg: [0.2, 0.3, 0.35, 0.4, 0.45, 0.35, 0.4],
            benchmark: [0.25, 0.4, 0.3, 0.5, 0.4, 0.3, 0.45]
        },
        '3Y': {
            dates: ['2021', '2022', '2023', '2024'],
            fund: [0.2, 0.4, 0.5, 0.6],
            categoryAvg: [0.15, 0.3, 0.4, 0.5],
            benchmark: [0.1, 0.35, 0.45, 0.55]
        },
        '5Y': {
            dates: ['2019', '2020', '2021', '2022', '2023', '2024'],
            fund: [0.1, 0.3, 0.4, 0.5, 0.6, 0.7],
            categoryAvg: [0.05, 0.2, 0.3, 0.4, 0.5, 0.6],
            benchmark: [0.15, 0.25, 0.35, 0.45, 0.55, 0.65]
        },
        '10Y': {
            dates: ['2014', '2016', '2018', '2020', '2022', '2024'],
            fund: [0.1, 0.3, 0.5, 0.6, 0.7, 0.8],
            categoryAvg: [0.05, 0.2, 0.4, 0.5, 0.6, 0.7],
            benchmark: [0.15, 0.25, 0.45, 0.55, 0.65, 0.75]
        }
    };

    useEffect(() => {
        if (chartRef.current) {
            const currentData = chartData[selectedPeriod];
            
            const option = {
                color: [colors.primary, colors.secondary, '#14B8A6'],
                legend: {
                    data: ['Fund', 'Category Avg', 'Benchmark'],
                    bottom: 0,
                    icon: 'circle',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        color: colors.gray,
                        fontSize: 12
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    top: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: currentData.dates,
                    axisLine: {
                        lineStyle: {
                            color: colors.gray
                        }
                    },
                    axisLabel: {
                        color: colors.gray,
                        fontSize: 10
                    }
                },
                yAxis: {
                    type: 'value',
                    min: 0,
                    max: 1,
                    interval: 0.2,
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function({value}:any) {
                            return value ? value.toFixed(1) : 0;
                        },
                        color: colors.gray,
                        fontSize: 10
                    },
                    splitLine: {
                        lineStyle: {
                            color: colors.Hard_White
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params:any) {
                        let result = params[0].axisValue + '<br/>';
                        params.forEach((param:any) => {
                            result += param.marker + ' ' + param.seriesName + ': ' + param.value + '<br/>';
                        });
                        return result;
                    }
                },
                series: [
                    {
                        name: 'Fund',
                        data: currentData.fund,
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        lineStyle: {
                            width: 3,
                            color: colors.primary
                        }
                    },
                    {
                        name: 'Category Avg',
                        data: currentData.categoryAvg,
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        lineStyle: {
                            width: 3,
                            color: colors.secondary
                        }
                    },
                    {
                        name: 'Benchmark',
                        data: currentData.benchmark,
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        lineStyle: {
                            width: 3,
                            color: '#14B8A6'
                        }
                    }
                ]
            };

            const chart = echarts.init(chartRef.current, 'light', {
                renderer: 'svg',
                width: responsiveWidth(90),
                height: responsiveHeight(30),
            });

            chart.setOption(option);

            return () => chart?.dispose();
        }
    }, [selectedPeriod, chartRef.current]);

    const PeriodButton = ({ period }:any) => (
        <TouchableOpacity 
            style={[
                styles.periodButton, 
                selectedPeriod === period && styles.selectedPeriodButton
            ]}
            onPress={() => setSelectedPeriod(period)}
        >
            <CusText 
                text={period} 
                color={selectedPeriod === period ? colors.white : colors.black} 
                size="S"
                bold={selectedPeriod === period}
            />
        </TouchableOpacity>
    );

    return (
        <Wrapper customStyles={{ padding: responsiveWidth(4) }}>
            {/* Period selector buttons */}
            <Wrapper row customStyles={{ marginBottom: responsiveWidth(4) }}>
                <PeriodButton period="1Y" />
                <Spacer x="XS" />
                <PeriodButton period="3Y" />
                <Spacer x="XS" />
                <PeriodButton period="5Y" />
                <Spacer x="XS" />
                <PeriodButton period="10Y" />
            </Wrapper>
            
            {/* Performance metrics */}
            <Wrapper row align="center">
                <CusText bold size="XL" text="28" />
                <Spacer x="XS" />
                <Wrapper row align="center">
                    <Wrapper customStyles={styles.chartpercentshow}>
                    <CusText color="#4ADE80" size="S" text="+0.45%" />
                    </Wrapper>
                    <Spacer x="XXS" />
                    <CusText color={colors.gray} size="S" text="0.2%" />
                </Wrapper>
            </Wrapper>
            <CusText color={colors.black} size="S" text="22 May 2023" />
            
            {/* Chart */}
            <Spacer y="N" />
            <SvgChart ref={chartRef} />
        </Wrapper>
    );
};
export default NavTab;