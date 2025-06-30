import { View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "./onetimesipStyles";
import { borderRadius, colors, responsiveHeight, responsiveWidth } from "../../../../../styles/variables";
import CusText from "../../../../../ui/custom-text";
import Wrapper from "../../../../../ui/wrapper";
import DropDown from "../../../../../ui/dropdown";
import React, { useState } from "react";
import CusButton from "../../../../../ui/custom-button";
import Spacer from "../../../../../ui/spacer";
import InputField from "../../../../../ui/InputField";


const OneTimeSIP = ({ AlertVisible, setAlertVisible }: any) => {
    const [MYType, setMYType] = useState(1);
    const [isFocus, setIsFocus] = useState(false);
    const months = [
        { id: 1, Name: 'Jan' },
        { id: 2, Name: 'Feb' },
        { id: 3, Name: 'Mar' },
        { id: 4, Name: 'Apr' },
        { id: 5, Name: 'May' },
        { id: 6, Name: 'Jun' },
        { id: 7, Name: 'Jul' },
        { id: 8, Name: 'Aug' },
        { id: 9, Name: 'Sep' },
        { id: 10, Name: 'Oct' },
        { id: 11, Name: 'Nov' },
        { id: 12, Name: 'Dec' },
    ];
    const [selectInclude, setSelectInclude] = useState<any>({
        New: false,
        Exhisting: false,
    });
    const nameToKeyMap: any = {
        'New': 'New',
        'Exhisting': 'Exhisting'
    };
    const [included, setincluded] = useState<any[]>([
        {
            Name: 'New',
            value: 'New'
        },
        {
            Name: 'Exhisting',
            value: 'Exhisting'
        }
    ])
    const toggleIncluded = (item: any) => {
        const key = nameToKeyMap[item.name];
        setSelectInclude((prev: any) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    return (
        <>
            <Modal
                isVisible={AlertVisible}
                animationIn="fadeIn"
                animationOut="fadeOut"
                onBackdropPress={() => setAlertVisible(false)}
                backdropTransitionOutTiming={0}
                backdropTransitionInTiming={0}
                useNativeDriver={true}>

                <View style={styles.alertView}>
                    <Wrapper row justify="apart" customStyles={{ padding: responsiveWidth(2) }}>
                        <CusText text={'One Time SIP'} color={colors.black} size='M' />
                        <Ionicons
                            name="close-outline"
                            size={25}
                            color={colors.black}
                        />
                    </Wrapper>
                    <Wrapper customStyles={styles.saprator}></Wrapper>
                    <Wrapper customStyles={{ padding: responsiveWidth(2) }}>
                        <CusText text={'HDFC Mid-Cap Opportunities Gr'} color={colors.black} size='N' bold />
                        <CusText text={'Equity - Mid-Cap'} color={colors.black} size='SS' />
                    </Wrapper>
                    <Wrapper customStyles={styles.saprator}></Wrapper>
                    <Wrapper row justify="apart">
                        <DropDown
                            data={months}
                            placeholder={'Months'}
                            width={responsiveWidth(38)}
                            placeholdercolor={colors.Hard_White}
                            value={MYType}
                            fieldColor={colors.disablebtn}
                            onFocus={() => {
                                setIsFocus(true);
                            }}
                            label={'Investor'}
                            onBlur={() => setIsFocus(false)}
                            valueField="id"
                            labelField={'Name'}
                            onChange={(item: any) => {
                                console.log(item?.id)
                                setMYType(item?.id)
                            }}
                            onClear={
                                () => {
                                    setIsFocus(false);
                                }
                            }
                        />
                        <DropDown
                            data={months}
                            placeholder={'Months'}
                            width={responsiveWidth(38)}
                            placeholdercolor={colors.Hard_White}
                            value={MYType}
                            fieldColor={colors.disablebtn}
                            label={'Account Holding'}
                            onFocus={() => {
                                setIsFocus(true);
                            }}
                            onBlur={() => setIsFocus(false)}
                            valueField="id"
                            labelField={'Name'}
                            onChange={(item: any) => {
                                console.log(item?.id)
                                setMYType(item?.id)
                            }}
                            onClear={
                                () => {
                                    setIsFocus(false);
                                }
                            }
                        />
                    </Wrapper>
                     <Spacer y="XXS" />
                    <CusText semibold size="N" text="Existing Folio" />
                    <Wrapper row customStyles={{ flexWrap: 'wrap', marginTop: responsiveWidth(1) }}>
                        {
                            included?.map((Iitem: any, Iinex: any) => {
                                const key = nameToKeyMap[Iitem.name];
                                const isSelected = selectInclude[key];

                                return (
                                    <>
                                        <TouchableOpacity activeOpacity={0.6} onPress={() => { toggleIncluded(Iitem) }}>
                                            <Wrapper width={responsiveWidth(40)} row align='start' customStyles={{ paddingVertical: responsiveWidth(1) }}>
                                                <Ionicons color={isSelected ? colors.primary1 : colors.Hard_Black} name={isSelected ? 'checkbox' : 'square-outline'} size={responsiveWidth(5)} />
                                                <Spacer x='XXS' />
                                                <Wrapper width={responsiveWidth(30)} customStyles={{}}>
                                                    <CusText color={isSelected ? colors.primary1 : colors.Hard_Black} size='SN' text={Iitem?.Name} />
                                                </Wrapper>

                                            </Wrapper>
                                        </TouchableOpacity>
                                    </>
                                )
                            })
                        }
                    </Wrapper>
                    <Spacer y="XXS" />
                    <Wrapper position="center">
                        <InputField
                            label="Amount"
                            labelStyle={{ color: colors.black }}
                            value={''}
                            height={responsiveHeight(1)}
                            width={responsiveWidth(80)}
                        />
                    </Wrapper>
                    <Spacer y="XXS" />
                    <CusButton
                        width={responsiveWidth(40)}
                        height={responsiveHeight(5)}
                        title="Proceed"
                        lgcolor1={colors.secondary}
                        lgcolor2={colors.secondary}
                        textcolor={colors.white}
                        position="center"
                        textSize='SS'
                        radius={borderRadius.normal}

                    />
                    <Spacer y="XXS" />
                </View>
            </Modal>
        </>
    )
}

export default OneTimeSIP;