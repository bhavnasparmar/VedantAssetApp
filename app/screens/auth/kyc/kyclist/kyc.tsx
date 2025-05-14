import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, fontSize, isIpad, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import Container from "../../../../ui/container";
import CusButton from "../../../../ui/custom-button";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import { getNew_User, setNew_User } from "../../../../utils/Commanutils";
import HeaderComponent from "../../kycverification/headercomponent/headercomponent";


const KycList = () => {
    const navigation: any = useNavigation();
    const { colors, mode }: any = React.useContext(AppearanceContext);

    const [documentList, setDocumentList] = useState<any>([
        {
            titleText: 'PAN Card',
            subText: '(Keep the original PAN or a scan of the original PAN For Identity.)',
            icon: 'id-card-outline',
        },
        {
            image:
                mode ===
                    'light' ?
                    require('../../../../assets/Images/digital.png')
                    :
                    require('../../../../assets/Images/digital.png'),
            titleText: 'Aadhaar Card',
            subText: '(Keep the original Aadhaar Card with front and back for address proof.)',
        },
        {
            titleText: 'Camera',
            subText: '(Keep the camera ready for In-Person verification.)',
            icon: 'camera-outline'
        },
        {
            image: require('../../../../assets/Images/cheque.png'),
            titleText: 'Cancelled Cheque',
            subText: '(Keep cancelled and signed cheque for bank verification.)',
        },
        {
            image:
                mode ===
                    'light' ?
                    require('../../../../assets/Images/digital.png')
                    :
                    require('../../../../assets/Images/digital.png'),
            titleText: 'Aadhaar Number (UID)',
            subText: '(Keep 12-digit aadhaar number to e-sign using aadhaar-based e-sign from NSDL.)',
        },
    ])

    useEffect(() => {
       

      

        return () => {};
    }, []);


    const renderItem = ({ item }: any) => {
        return (

            <Wrapper row position="center"
                width={responsiveWidth(90)}

                customStyles={{
                    padding: 5,
                    marginVertical: 5
                }}
            >
                <Wrapper position="center" align="center" justify="center" width={responsiveWidth(10)} customStyles={{ marginHorizontal: 0 }}>
                    {item?.image ? <Image
                        resizeMode="contain"
                        style={{

                            height: responsiveWidth(6),
                            width: responsiveWidth(6),
                            tintColor: colors.Hard_White

                        }}
                        source={item?.image} /> : null}
                    {item?.icon ? <Icon name={item?.icon} size={24} /> : null}
                </Wrapper>
                <Wrapper customStyles={{ marginHorizontal: 10 }}>
                    <CusText text={item?.titleText}
                        size="SL"
                        color={colors.black}
                        lineHeight={responsiveHeight(2)}
                        bold
                        customStyles={{

                            fontSize: isIpad() ? 60 : fontSize.Xlarge,
                        }} />
                    <Wrapper width={responsiveWidth(75)} customStyles={{}}>
                        <CusText text={item?.subText}
                            size="XMS"
                            position="left"
                            color={colors.gray}
                            lineHeight={responsiveHeight(2)}
                            customStyles={{

                                fontSize: isIpad() ? 60 : fontSize.extraSmall,

                            }} />
                    </Wrapper>
                </Wrapper>
            </Wrapper>


        )
    }

    const headerBackAction = () => {

        if (getNew_User()) {
            setNew_User(false)
            navigation.navigate('ViewMembers')
            return true;

        } else {
            setNew_User(false)
            navigation.navigate('Dashboard')
            return true;

        }


    };

    return (
        <>
            <HeaderComponent name={"KYC Verification"} backAction={() => headerBackAction()} />
            <Container Xcenter>
                <Spacer y="L" />
                <Wrapper position="center"
                    customStyles={{ marginTop: responsiveWidth(5) }}
                >
                    <CusText text='In the next few steps, we would help you to be investment-ready.'
                        size="SL"
                        position="center"
                        color={colors.black}
                        lineHeight={responsiveHeight(2)}
                        customStyles={{
                            fontSize: isIpad() ? 60 : fontSize.Xlarge,

                        }} />
                </Wrapper>
                <Spacer y="N" />
                {/* <Wrapper

                    position="center" justify="center" align="center" customStyles={{
                        marginTop: responsiveWidth(5)
                    }}
                >
                    <Image
                        style={{
                            resizeMode: "contain",
                            height: responsiveWidth(40),
                            width: responsiveWidth(100),
                        }
                        }
                        source={require('../../../../assets/images/kyclistimage.png')} />
                </Wrapper> */}
                <Wrapper position="center" customStyles={{ marginTop: responsiveWidth(5) }}>
                    <CusText text='So, make sure you the following requirements handy'
                        size="SL"
                        position="center"
                        color={colors.black}
                        lineHeight={responsiveHeight(2)}
                        customStyles={{

                            fontSize: isIpad() ? 60 : fontSize.Xlarge,

                        }} />
                </Wrapper>

                <Wrapper position="center" customStyles={{
                    marginTop: 20,

                    width: responsiveWidth(100)
                }}>
                    <Wrapper color={colors.cardBg2} width={responsiveWidth(90)} position="center" customStyles={{ borderRadius: borderRadius.medium, paddingVertical: responsiveWidth(3) }}>
                        <FlatList
                            data={documentList}
                            renderItem={renderItem}
                            keyExtractor={(item: any) => item.titleText}
                            scrollEnabled={false}
                            ItemSeparatorComponent={(props) => {
                                return (
                                    <>
                                        <Wrapper
                                            customStyles={{ backgroundColor: colors.gray, opacity: 0.5, marginVertical: responsiveWidth(1) }}
                                            height={responsiveHeight(0.1)}
                                            position="center"
                                            width={responsiveWidth(90)} />
                                    </>
                                );
                            }}
                        />
                    </Wrapper>
                </Wrapper>

                {/* <Wrapper customStyles={{ marginTop: responsiveWidth(5) }}>
                    <CusButton
                        width={responsiveWidth(80)}
                        height={responsiveHeight(5)}
                        title={"Start"}
                        textWeight="semibold"
                        textStyle={{ fontSize: fontSize.normal }}
                        lgcolor1={colors.primary}
                        lgcolor2={colors.secondry}
                        position="center"
                        exborder
                        radius={borderRadius.ring}
                        onPress={() => { navigation.navigate('PancardVerify') }}
                    />
                </Wrapper> */}
            </Container>
            <Wrapper customStyles={{ marginTop: responsiveWidth(5) }}>
                <CusButton
                    width={responsiveWidth(80)}
                    height={responsiveHeight(5)}
                    title={"Start"}
                    textWeight="semibold"
                    textStyle={{ fontSize: fontSize.medium }}
                    position="center"
                    radius={borderRadius.ring}
                    onPress={() => { navigation.navigate('PancardVerify') }}
                />
            </Wrapper>
        </>

    )
}

export default KycList