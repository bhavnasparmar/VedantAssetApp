import React, { useState, useContext, useRef, useEffect } from 'react';
import { TouchableOpacity, View, ScrollView, Text } from 'react-native';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import * as echarts from 'echarts/core';
import { LineChart, GaugeChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { SVGRenderer, SvgChart } from '@wuba/react-native-echarts';
import styles from '../funpickerdetailstyles';
import { useIsFocused } from '@react-navigation/native';
const COLORS = ['#2E7D32', '#DCE775', '#FFEB3B', '#FFB74D', '#D32F2F']; // Low → High
const LABELS = ['Low', 'Moderately Low', 'Moderate', 'Moderately High', 'High'];
const Information = ({ totaldata }: any) => {
    const { colors }: any = useContext(AppearanceContext);
    const [activeTab, setActiveTab] = useState('Overview');
    const [totaldataa, settotaldata] = useState(totaldata || 0);
    echarts.use([SVGRenderer, LineChart, GridComponent, GaugeChart]);
    const chartRef = useRef<any>(null);
    // Sample data for the pie chart
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
                            value: Number(25) / 100,
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
    }, [totaldataa, useIsFocused])
    const InfoItem = ({ label, value }: any) => (
        <Wrapper customStyles={styles.infoItem}>
            <CusText text={label} size="S" color={colors.black} />
            <CusText text={value} size="S" color={colors.black} bold />
        </Wrapper>
    );

    const renderOverviewTab = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Wrapper customStyles={styles.section}>
                <CusText text="About" size="M" color={colors.primary} bold underline/>
                <Spacer y="XS" />

                <InfoItem
                    label="Scheme Name"
                    value="HDFC Mid-Cap Opportunities Gr"
                />
                <Wrapper customStyles={styles.saprator} />
                <InfoItem
                    label="AMC Name"
                    value="HDFC Mutual Fund"
                />
                <Wrapper customStyles={styles.saprator} />
                <InfoItem
                    label="Inception Date"
                    value="25 Jun 2007"
                />
                <Wrapper customStyles={styles.saprator} />
                <InfoItem
                    label="AUM as on March 2023"
                    value="₹ 72,610 Cr"
                />
                <Wrapper customStyles={styles.saprator} />
                <InfoItem
                    label="Min. Investment Lumpsum"
                    value="₹ 500"
                />
                <Wrapper customStyles={styles.saprator} />
                <InfoItem
                    label="Min. Investment SIP"
                    value="₹ 100"
                />
                <Wrapper customStyles={styles.saprator} />
                <InfoItem
                    label="Expense Ratio as on 30 Apr 2023"
                    value="1.51 %"
                />
                <Wrapper customStyles={styles.saprator} />
                <InfoItem
                    label="NIL exit load"
                    value="units on or before 1Y, NIL after 1Y"
                />
                 <Wrapper customStyles={styles.saprator} />
                  <InfoItem
                    label="Risk Rating"
                    value="High"
                />
                 <Wrapper customStyles={styles.saprator} />
                  <InfoItem
                    label="Benchmark"
                    value="CRISIL Hybrid 50+50 - Moderate Index"
                />
            </Wrapper>

        </ScrollView>
    );

    const renderObjectiveTab = () => (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Wrapper customStyles={styles.section}>
                <CusText text="Objective" size="M" color={colors.black} bold underline />
                <Spacer y="S" />

                <CusText
                    text="To provide capital appreciation and income distribution to the investors by using equity derivatives strategies, arbitrage opportunities and pure equity investments."
                    size="S"
                    color={colors.black}
                    customStyles={{ lineHeight: 22 }}
                />

                <Spacer y="N" />

                <CusText text="Scheme Risk" size="M" color={colors.black} bold underline />
                <Spacer y="S" />
                <Wrapper position='center'>
                    <SvgChart ref={chartRef} />
                </Wrapper>
                <Wrapper row align="center" customStyles={styles.legendContainer}>
                    {COLORS.map((color, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View
                                style={[styles.legendColor, { backgroundColor: color }]}
                            />
                            <Text style={styles.legendText}>{LABELS[index]}</Text>
                        </View>
                    ))}
                </Wrapper>
            </Wrapper>
        </ScrollView>
    );

    return (
        <>
        <Wrapper customStyles={{ padding: responsiveWidth(4) }}>
            {/* Tab buttons */}
            <Wrapper row customStyles={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 'Overview' && styles.activeTabButton
                    ]}
                    onPress={() => setActiveTab('Overview')}
                >
                    <CusText
                        text="Overview"
                        size="S"
                        color={activeTab === 'Overview' ? colors.white : colors.black}
                        bold={activeTab === 'Overview'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 'Objective' && styles.activeTabButton
                    ]}
                    onPress={() => {setActiveTab('Objective');settotaldata(25)}}
                >
                    <CusText
                        text="Objective"
                        size="S"
                        color={activeTab === 'Objective' ? colors.white : colors.black}
                        bold={activeTab === 'Objective'}
                    />
                </TouchableOpacity>
            </Wrapper>

            <Spacer y="S" />

            {/* Tab content */}
            {activeTab === 'Overview' ? renderOverviewTab() : renderObjectiveTab()}
        </Wrapper>
        </>
    );
};

export default Information;