import React from "react";
import { AppearanceContext } from "../../../context/appearanceContext";
import Wrapper from "../../../ui/wrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Platform, TouchableOpacity } from "react-native";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { borderRadius, isIpad, responsiveHeight, responsiveWidth } from "../../../styles/variables";
import CusText from "../../../ui/custom-text";


const Footer = ({ navigation, groupId, type, categoryId }: any) => {
    const { colors }: any = React.useContext(AppearanceContext);

    const TabView = ({ focused, source, page, type, nav }: any) => {
        // return (
        //     <>
        //         {/* {
        //             page === 'Categories' ?
        //                 null : */}

        //         <Wrapper align='center' width={responsiveWidth(20)} customStyles={{

        //         }}>
        //             <Wrapper customStyles={{ marginBottom: 5 }}>
        //                 <IonIcon
        //                     name={source}
        //                     style={{
        //                         color: focused ? colors.Hard_White : colors.gray,
        //                         fontSize: isIpad() ? responsiveWidth(4) : 22,
        //                         width: '100%',
        //                     }}
        //                 />
        //             </Wrapper>
        //             <CusText position="center" color={colors.Hard_White} customStyles={{}} text={page} />
        //         </Wrapper>
        //         {/* } */}
        //     </>
        // );
        return (
            <>
                {/* <TouchableOpacity onPress={() => { navigation.navigate(nav) }}> */}
                <TouchableOpacity onPress={() => {

                    navigation.navigate('Tabs', { screen: nav })

                }}>
                    <Wrapper justify="center" align='center' width={responsiveWidth(20)} customStyles={{}}>
                        <Wrapper customStyles={{ marginBottom: 5 }}>
                            {
                                type === 'image' ?
                                    <Image source={source} resizeMode="contain" style={{ height: responsiveWidth(6), width: responsiveWidth(6) }} /> :

                                    <IonIcon
                                        name={source}
                                        style={{
                                            color: focused ? colors.Hard_White : colors.gray,
                                            fontSize: isIpad() ? responsiveWidth(4) : 22,
                                            width: '100%',
                                        }}
                                    />
                            }
                        </Wrapper>
                        <CusText position="center" color={colors.Hard_White} customStyles={{}} text={page} />
                    </Wrapper>
                </TouchableOpacity>

            </>
        );
    };

    return (
        <>
            <Wrapper color={colors.white}>
                <SafeAreaView>
                    <Wrapper
                        row
                        position="center"
                        align="center"
                        justify="center"
                        customStyles={{
                            position: "absolute",
                            left: responsiveWidth(2),
                            right: responsiveWidth(2),
                            bottom: 10,
                            borderRadius: borderRadius.large,
                            width: Platform.OS === 'ios' ? responsiveWidth(92) : responsiveWidth(96),
                            backgroundColor: colors.primary1,
                            height:
                                Platform.OS === 'ios' && !isIpad()
                                    ? responsiveWidth(18)
                                    : isIpad()
                                        ? responsiveWidth(10)
                                        : responsiveWidth(18),

                            // marginHorizontal:
                            //     Platform.OS === 'ios' ? responsiveWidth(4) : responsiveWidth(2),
                            // marginBottom:
                            //     Platform.OS === 'ios' ? responsiveWidth(2) : responsiveWidth(0),
                            // // paddingLeft: responsiveWidth(4),
                            //  marginTop: Platform.OS === 'ios' ? responsiveWidth(0) : responsiveWidth(2),
                        }}>
                        <TabView
                            page='Home'
                            focused={""}
                            source={"home-outline"}
                            nav={'Dashboard'}
                        />
                        <TabView
                            page='Order'
                            focused={''}
                            source={require('../../../../app/assets/Images/orders.png')}
                            type={'image'}
                            nav={'Order'}
                        />
                        <TabView
                            page='Offers'
                            focused={''}
                            source={require('../../../../app/assets/Images/offers.png')}
                            type={'image'}
                            nav={'Offer'}
                        />
                        <TabView
                            page='Prfile'
                            focused={''}
                            source={require('../../../../app/assets/Images/tabprofile.png')}
                            type={'image'}
                            nav={'Profile'}
                        />
                        <TabView
                            page='Menu'
                            focused={''}
                            source={require('../../../../app/assets/Images/tabmenu.png')}
                            type={'image'}
                            nav={'Dashboard'}
                        />
                    </Wrapper>
                </SafeAreaView>
            </Wrapper>
        </>
    )

}

export default Footer