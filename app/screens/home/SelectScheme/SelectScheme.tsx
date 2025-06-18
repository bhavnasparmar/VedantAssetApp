import { useEffect, useRef, useState } from "react"
import { toastTypes } from "../../../constant/constants"
import { showToast } from "../../../services/toastService"
import { useIsFocused, useRoute } from "@react-navigation/native"
import Wrapper from "../../../ui/wrapper"
import CusText from "../../../ui/custom-text"
import Header from "../../../shared/components/Header/Header"
import Container from "../../../ui/container"
import { getRiskCatWiseSchemeDataAPi } from "../../../api/homeapi"
import IonIcon from 'react-native-vector-icons/Ionicons';
import { FlatList } from "react-native"
import { borderRadius, colors,  responsiveWidth } from "../../../styles/variables"
import LinearGradient from "react-native-linear-gradient"
import Spacer from "../../../ui/spacer"


const SelectScheme = () => {

    const isFocused: any = useIsFocused()
    const route: any = useRoute()
    const [schemes, setSchemes] = useState<any[]>([])

    const svgRef = useRef<any>(null);
    useEffect(() => {
        getSchemes()
    }, [isFocused])
    useEffect(() => {
        const option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [150, 230, 224, 218, 135, 147, 260],
                    type: 'line',
                },
            ],
        };
       
    }, [])

    const getSchemes = async () => {

        try {

            const [result, error]: any = await getRiskCatWiseSchemeDataAPi(route?.params?.riskId);
            if (result?.data) {
                // console.log('getSchemes result', result);
                console.log('getSchemes result?.data----', result?.data);
                // console.log('getSchemes result?.error----', error);
                setSchemes(result?.data)
            } else {
                console.log('getSchemes else error : ', error)
                showToast(toastTypes.error, error)
            }


        } catch (error: any) {
            console.log('getSchemes Catch error : ', error)
            showToast(toastTypes.error, error)
        }

    }

    const renderItem = ({ item, index }: any) => {

        return (
            <>
                <Wrapper color={colors.Hard_White} customStyles={{ marginVertical: responsiveWidth(1), borderRadius: borderRadius.medium, paddingHorizontal: responsiveWidth(1.5), paddingVertical: responsiveWidth(3) }}>

                    <Wrapper row align="center" justify="apart" customStyles={{ paddingHorizontal: responsiveWidth(3) }}>
                        <Wrapper width={responsiveWidth(65)}>
                            <CusText semibold color={colors.primary} size="SS" text={item?.SchemeMaster?.ms_fullname} />
                            <CusText semibold color={colors.orange} size="S" text={item?.SchemeSubcategory?.Name} />
                        </Wrapper>
                        <Wrapper color={colors.primary} customStyles={{ borderRadius: borderRadius.ring, padding: responsiveWidth(1.5) }}>
                            <IonIcon name={'pencil-outline'} size={responsiveWidth(4)} color={colors?.Hard_White} />
                        </Wrapper>
                    </Wrapper>

                    <Spacer y="XXS" />
                    <LinearGradient
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[
                            colors.transparent,
                            colors.gray,
                            colors.transparent,
                        ]}
                        style={{ width: "100%", height: responsiveWidth(0.6), opacity: 0.5 }}
                    ></LinearGradient>
                    <Spacer y="XXS" />
                    <Wrapper customStyles={{}} position="center">
                        <Wrapper row justify="apart" align="center" width={responsiveWidth(90)}>
                            <Wrapper align="center" width={responsiveWidth(26.6)}>
                                <CusText size="S" text={'Return 1y'} />
                                {/* <CusText size="SS" text={`45.9%`} /> */}
                                <CusText semibold size="SS" text={item?.SchemeMaster?.SchemePerformances[0]?.Return1yr ? Number(item?.SchemeMaster?.SchemePerformances[0]?.Return1yr).toFixed(2) + '%' : '-'} />
                            </Wrapper>
                            <Wrapper align="center" width={responsiveWidth(26.6)}>
                                <CusText size="S" text={'Return 3y'} />
                                {/* <CusText size="SS" text={`456.99%`} /> */}
                                <CusText semibold size="SS" text={item?.SchemeMaster?.SchemePerformances[0]?.Returns3yr ? Number(item?.SchemeMaster?.SchemePerformances[0]?.Returns3yr).toFixed(2) + '%' : '-'} />
                            </Wrapper>
                            <Wrapper align="center" width={responsiveWidth(26.6)}>
                                <CusText size="S" text={'Return 5y'} />
                                {/* <CusText size="SS" text={`4.99%`} /> */}
                                <CusText semibold size="SS" text={item?.SchemeMaster?.SchemePerformances[0]?.Returns5yr ? Number(item?.SchemeMaster?.SchemePerformances[0]?.Returns5yr).toFixed(2) + '%' : '-'} />
                            </Wrapper>
                        </Wrapper>
                        <Spacer y="XXS" />
                        <Wrapper row justify="apart" width={responsiveWidth(90)}>
                            <Wrapper align="center" width={responsiveWidth(26.6)}>
                                <CusText size="S" text={'Weightage'} />
                                {/* <CusText size="SS" text={`45.9%`} /> */}
                                <CusText semibold size="SS" text={item?.weightage ? Number(item?.weightage).toFixed(2) + '%' : '-'} />
                            </Wrapper>
                            <Wrapper align="center" width={responsiveWidth(26.6)}>
                                <CusText size="S" position="center" text={'Morningstart Rating'} />
                                <Wrapper row align="center" position="center">
                                    {
                                        item?.SchemeMaster?.SchemePerformances[0]?.OverallRating ?
                                            <>
                                                <CusText semibold size="SS" text={item?.SchemeMaster?.SchemePerformances[0]?.OverallRating || '-'} />
                                                <IonIcon name="star" size={responsiveWidth(5)} color={colors.orange} />
                                            </>
                                            :
                                            <CusText text={'-'} />
                                    }
                                </Wrapper>
                            </Wrapper>
                            <Wrapper align="center" width={responsiveWidth(26.6)}>
                                <CusText size="S" text={'Amount'} />
                                <CusText semibold size="SS" text={`4.99%`} />
                            </Wrapper>
                        </Wrapper>
                    </Wrapper>
                </Wrapper>
            </>
        )
    }

    return (
        <>
            <Header menubtn name="MF Allocation" />
            <Container Xcenter>
                <Wrapper>
                  
                </Wrapper>
                <FlatList
                    data={schemes}
                    renderItem={renderItem}
                />
            </Container>
        </>
    )
}

export default SelectScheme