import { useEffect, useState } from "react";
import Header from "../../../shared/components/Header/Header";
import Container from "../../../ui/container";
import Wrapper from "../../../ui/wrapper";
import { borderRadius, colors, responsiveHeight, responsiveWidth } from "../../../styles/variables";
import { styles } from "./schemeEditStyles";
import CusText from "../../../ui/custom-text";
import IonIcon from 'react-native-vector-icons/Ionicons';
import Spacer from "../../../ui/spacer";
import { FlatList, TouchableOpacity } from "react-native";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { getSuggestedSchemesApi } from "../../../api/homeapi";
import { showToast, toastTypes } from "../../../services/toastService";

const SchemeEdit = () => {
    const isFocused: any = useIsFocused()
    const route: any = useRoute()
    const navigation: any = useNavigation()
    const [fundPickerList, setfundPickerList] = useState<any[]>([]);
    const [selectedScheme, setSelectedScheme] = useState<any>(null);
    useEffect(() => {
        console.log('ROutes  currentScheme: ', route?.params?.currentScheme)
        console.log('ROutes  schemeData: ', route?.params?.schemeData)
        getSchemes()
    }, [isFocused])

    const getSchemes = async () => {
        try {

            let payload: any = {
                subcategory_id: route?.params?.currentScheme?.scheme_subcate_id,
                currentSchemeId: route?.params?.currentScheme?.id,
                sip_amount: route?.params?.currentScheme?.sip_amount,
                lumpsum_amount: route?.params?.currentScheme?.lumpsum_amount,
                weightage: route?.params?.currentScheme?.weightage,
            }

            const [result, error]: any = await getSuggestedSchemesApi(payload)
            if (result) {
                console.log('Result : ', result)
                setfundPickerList(result?.data)
            } else {
                console.log('getSchemes Error', error)
                showToast(toastTypes.info, error)
            }

        } catch (error) {
            console.log('getScheme Ctach Error : ', error)
            showToast(toastTypes.error, error)
        }
    }

    const toggleScheme = (scheme: any) => {
        if (scheme?.id === selectedScheme?.id) {
            setSelectedScheme(null)
        } else {
            setSelectedScheme(scheme)
        }

    }

    const changeScheme = () => {
        console.log('current data : ', route?.params?.overAllData)

        console.log('current SchemeList : ', route?.params?.schemeData)
        let changedSchemeList: any = route?.params?.schemeData?.map((scheme: any, index: any) =>
            scheme?.id === route?.params?.currentScheme?.id ? { ...scheme, SchemeMaster: selectedScheme, scheme_id: selectedScheme?.id } : scheme
        )
        console.log('changedSchemeList : ', changedSchemeList)
        let changedData: any = { ...route?.params?.overAllData, schemesList: changedSchemeList }
        console.log('changed data : ', changedSchemeList)
        navigation.navigate('SuggestedScheme', {
            goalPlanData: changedData, goalData: route?.params?.goalData,
            goalPlanID: route?.params?.goalPlanID,
            type: route?.params?.type,
        })
    }

    const renderItem = ({ item }: any) => {
        console.log('')
        return (
            <Wrapper customStyles={{ ...styles.innercard, borderColor: selectedScheme?.id === item?.id ? colors.orange : colors.Hard_White, borderWidth: selectedScheme?.id === item?.id ? 1 : 0 }}>
                <Wrapper align='center' row justify='apart' customStyles={{ padding: responsiveWidth(0.5), paddingHorizontal: responsiveWidth(2) }}>
                    <Wrapper width={responsiveWidth(72)}>
                        <CusText size='N' color={colors.label} bold text={`${item?.ms_fullname}`} />
                    </Wrapper>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { toggleScheme(item) }}>
                        <CusText size='SN' color={selectedScheme?.id === item?.id ? colors.orange : colors.orange} semibold text={selectedScheme?.id === item?.id ? `Remove` : `Select`} />
                    </TouchableOpacity>

                </Wrapper>
                <Spacer y="XXS" />
                <Wrapper color={colors.lightGray} customStyles={{ borderWidth: 0, padding: responsiveWidth(2), borderRadius: borderRadius.middleSmall }}>
                    <Wrapper row align='center' justify='apart'>
                        <Wrapper position='center' align='start'>
                            <CusText size='SS' color={colors.label} text={'AUM'} />
                            <CusText size='M' color={colors.label} text={item?.SchemePerformances[0]?.AUM} />
                        </Wrapper>
                        <Wrapper align='end' position='center'>
                            <CusText size='SS' color={colors.label} text={'Morningstar Rating'} />
                            <Wrapper row align='center'>
                                <CusText size='M' color={colors.label} text={item?.SchemePerformances[0]?.OverallRating || 0} />
                                <IonIcon name='star' color={colors.orange} size={responsiveWidth(4)} />
                            </Wrapper>
                        </Wrapper>
                        {/* <Wrapper position='center' align='end'>
                            <CusText size='SS' color={colors.label} text={'Weightage'} />
                            <CusText size='M' color={colors.label} text={item?.weightage + ' %'} />
                        </Wrapper> */}
                    </Wrapper>
                    <Spacer y='XXS' />
                    <Wrapper row align='center' justify='apart'>
                        <Wrapper position='center' align='start'>
                            <CusText size='SS' color={colors.label} text={'Return 1y'} />
                            <CusText size='M' color={colors.label} text={item?.SchemePerformances[0]?.Return1yr ? item?.SchemePerformances[0]?.Return1yr.toFixed(2) + '%' : '----'} />
                        </Wrapper>
                        <Wrapper align='center' position='center'>
                            <CusText size='SS' color={colors.label} text={'Return 3y'} />
                            <CusText size='M' color={colors.label} text={item?.SchemePerformances[0]?.Returns3yr ? item?.SchemePerformances[0]?.Returns3yr.toFixed(2) + '%' : '----'} />
                        </Wrapper>
                        <Wrapper position='center' align='end'>
                            <CusText size='SS' color={colors.label} text={'Return 5y'} />
                            <CusText size='M' color={colors.label} text={item?.SchemePerformances[0]?.Returns5yr ? item?.SchemePerformances[0]?.Returns5yr.toFixed(2) + '%' : '----'} />
                        </Wrapper>
                    </Wrapper>
                </Wrapper>
            </Wrapper>
        )
    }
    return (
        <>
            <Header menubtn name={'Suggested Investments'} />
            <Container Xcenter contentWidth={responsiveWidth(95)}>
                <FlatList
                    keyExtractor={(item: any, index: number) => index.toString()}
                    data={fundPickerList}
                    renderItem={renderItem}
                    // onEndReached={loadMore}
                    onEndReachedThreshold={2}
                    // ListFooterComponent={() => loader && <ActivityIndicator />}
                    // refreshing={loader}
                    // onRefresh={onRefresh}
                    removeClippedSubviews={true}
                    initialNumToRender={5}
                // ListEmptyComponent={() => <NoRecords />}
                />
            </Container>
            {
                selectedScheme &&
                <>
                    <Wrapper color={colors.Hard_White} row align='center' justify='apart' customStyles={{ paddingVertical: responsiveWidth(3), paddingHorizontal: responsiveWidth(4) }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { }}>
                            <Wrapper width={responsiveWidth(30)} position='center' customStyles={{ padding: responsiveWidth(2.5), borderRadius: borderRadius.medium, borderColor: colors.gray, borderWidth: 1 }}>
                                <CusText size='SS' bold position='center' text={'Back'} />
                            </Wrapper>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { changeScheme() }}>
                            <Wrapper width={responsiveWidth(30)} color={colors.orange} position='center' customStyles={{ padding: responsiveWidth(2.5), borderRadius: borderRadius.medium }}>
                                <CusText size='SS' bold position='center' color={colors.Hard_White} text={'Proceed'} />
                            </Wrapper>
                        </TouchableOpacity>
                    </Wrapper>
                </>
            }
        </>
    )



}
export default SchemeEdit;
