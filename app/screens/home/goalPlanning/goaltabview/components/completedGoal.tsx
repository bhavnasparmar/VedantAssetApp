import React, { useEffect, useState } from "react";
import CusText from "../../../../../ui/custom-text";
import Wrapper from "../../../../../ui/wrapper";
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from "../../../../../styles/variables";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import API from "../../../../../utils/API";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { styles } from "../goalDashboardStyle";
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import Spacer from "../../../../../ui/spacer";
import CusButton from "../../../../../ui/custom-button";
import NoRecords from "../../../../../shared/components/NoRecords/NoRecords";
import { IMAGE_URL_GOAL } from "../../../../../utils/Commanutils";




const CompletedGoal = () => {


    const navigation: any = useNavigation()
    const isFocused = useIsFocused();
    const [onGoingGoalTypesData, setonGoingGoalTypesData] = useState<any[]>([])

    useEffect(() => {
       // onGoingGoalTypes()
    }, [isFocused])

    // const onGoingGoalTypes = async () => {
    //     try {
    //         const result: any = await API.get('goal-plans/getAllGoals');
    //         if (result?.code === 200) {
    //             setonGoingGoalTypesData(result?.data?.completedGoalDetails)

    //         } else {
    //             // showToast(toastTypes.info, result?.msg)
    //         }

    //     } catch (error: any) {
    //         console.log('onGoingGoalTypes Catch Error', error)
    //         showToast(toastTypes.error, error[0].msg)
    //     }
    // }

    // const renderItem = ({ item }: any) => {

    //     let investType: any = ''
    //     let recommended: any = ''
    //     let months: any = ''
    //     if (item?.sip_amt === 0) {
    //         investType = 'Lumpsum'
    //         recommended = item?.lumpsum_amt
    //         months = item?.duration_mts
    //     }
    //     if (item?.lumpsum_amt === 0) {
    //         investType = 'SIP'
    //         recommended = item?.sip_amt
    //         months = item?.sip_duration_mts
    //     }

    //     return (
    //         <>
    //             <Wrapper customStyles={{
    //                 borderRadius: borderRadius.normal,
    //                 borderColor: colors.gray,
    //                 borderWidth: responsiveWidth(0.2),
    //                 marginVertical: responsiveWidth(2),
    //                 marginHorizontal: responsiveWidth(3),

    //             }}>
    //                 <Wrapper row
    //                     color={colors.darkGray}
    //                     // color={colors.yellow}
    //                     customStyles={{
    //                         borderRadius: borderRadius.normal,
    //                     }}>
    //                     <TouchableOpacity style={[styles.buttonongoing, { backgroundColor: colors.darkGrayShades }]} onPress={() => { }}>
    //                         <Image resizeMode='contain' source={{ uri: IMAGE_URL_GOAL + 'oceanfinvest//goalplanning/' + item?.goal_type?.goal_icon }} style={styles.flatlistImage}></Image>
    //                         {/*  <Icon name='car-sport-outline' size={16} /> */}
    //                     </TouchableOpacity>
    //                     <Wrapper

    //                         justify="center" customStyles={{ width: responsiveWidth(55), padding: responsiveWidth(1) }}>
    //                         <CusText bold text={item?.goal_label} size="MS" />
    //                         <Wrapper row customStyles={{ marginVertical: responsiveWidth(1) }}>
    //                             <Wrapper row justify="center" width={responsiveWidth(25)}
    //                                 customStyles={{
    //                                     borderRadius: borderRadius.middleSmall, borderWidth: responsiveWidth(0.5), borderColor: colors.Hard_White,
    //                                     padding: responsiveWidth(1)
    //                                 }}
    //                             >
    //                                 <CusText color={colors.Hard_White} position="center" text={'Category : '} />
    //                                 <CusText color={colors.Hard_White} position="center" text={'car '} />
    //                             </Wrapper>
    //                             <Spacer x='XXS' />
    //                             <CusButton

    //                                 textWeight="bold"
    //                                 title={investType}
    //                                 width={responsiveWidth(20)}
    //                                 radius={borderRadius.middleSmall}
    //                                 textStyle={{ fontSize: fontSize.small }}
    //                                 textArea={"100%"}
    //                                 color={'rgba(255, 255, 255, 0.1)'}
    //                                 textcolor={colors.Hard_White}
    //                                 height={responsiveWidth(8)} />

    //                         </Wrapper>
    //                     </Wrapper>
    //                 </Wrapper>
    //                 <Wrapper align="center" color={colors.darkGrayShades} customStyles={{ padding: responsiveWidth(1) }}>
    //                     <CusText semibold color={'#E59F39'} text={'Target'} />
    //                     <CusText semibold text={item?.target_amt} />
    //                 </Wrapper>
    //                 <Wrapper row align="center" justify="center" position="center">
    //                     <Wrapper customStyles={styles.card} >
    //                         <Wrapper row justify="apart">
    //                             <Wrapper>
    //                                 <CusText text={'Invested'} color={colors.gray} />
    //                                 <CusText text={'Name'} />
    //                             </Wrapper>
    //                             <Wrapper>
    //                                 <CusText text={'Months'} color={colors.gray} />
    //                                 <CusText text={'Name'} />
    //                             </Wrapper>
    //                         </Wrapper>
    //                         <Spacer y='XXS' />
    //                         <Wrapper row justify="apart">
    //                             <Wrapper>
    //                                 <CusText text={'Recommended'} color={colors.gray} />
    //                                 <CusText text={recommended} />
    //                             </Wrapper>
    //                             <Wrapper>
    //                                 <CusText text={'Months'} color={colors.gray} />
    //                                 <CusText text={months} />
    //                             </Wrapper>
    //                         </Wrapper>
    //                     </Wrapper>
    //                     <Spacer x="N" />
    //                     <Wrapper width={responsiveWidth(25)} height={responsiveHeight(13)} position="center" align="center" justify="center">
    //                         <AnimatedCircularProgress
    //                             size={75}
    //                             width={3}
    //                             fill={50} // Score between 0 and 100
    //                             tintColor={colors.secondary}
    //                             backgroundColor="#E0E0E0"
    //                             arcSweepAngle={360} // Half circle (180 degrees)
    //                             rotation={360} // Start from bottom
    //                             lineCap="round"
    //                         >
    //                             {() => (
    //                                 <Wrapper position="center" align="center">
    //                                     <CusText text={'Achieved'} />
    //                                     <CusText semibold text={'50.00%'} />
    //                                 </Wrapper>
    //                             )}
    //                         </AnimatedCircularProgress>
    //                     </Wrapper>
    //                 </Wrapper>

    //             </Wrapper>

    //         </>
    //     )
    // }

    return (
        <>
            {/* <Wrapper color={colors.darkGray}
                height={responsiveHeight(70)}
                customStyles={{
                    borderBottomLeftRadius: borderRadius.medium,
                    borderBottomRightRadius: borderRadius.medium,
                }}>
                <FlatList
                    data={onGoingGoalTypesData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={() => <NoRecords />}
                />
            </Wrapper> */}

        </>
    )
}
export default CompletedGoal;