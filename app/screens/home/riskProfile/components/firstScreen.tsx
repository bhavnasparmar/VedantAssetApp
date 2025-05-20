import { View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppearanceContext } from '../../../../context/appearanceContext';
import Container from '../../../../ui/container';
import Wrapper from '../../../../ui/wrapper';
import { borderRadius, responsiveWidth } from '../../../../styles/variables';
import CusText from '../../../../ui/custom-text';
import Spacer from '../../../../ui/spacer';
import CusButton from '../../../../ui/custom-button';
import DateTimePicker from '../../../../ui/datetimePicker';
import InputField from '../../../../ui/InputField';
import { styles } from '../riskProfileStyles';
import LinearGradient from 'react-native-linear-gradient';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRiskObjectData, RISK_PROFILE_INFODATA, setRiskObject } from '../../../../utils/Commanutils';
import { showToast, toastTypes } from '../../../../services/toastService';

const FirstScreen = ({ setIndex, basicDetail, setBasicDetail }: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const [gender, setgender] = useState(basicDetail?.user_basic_details?.gender || '')
    const [Marital, setMarital] = useState(basicDetail?.user_basic_details?.marital_status || '')
    const [child, setchild] = useState(basicDetail?.user_basic_details?.child || '')
    const [date, setdate] = useState(basicDetail?.user_basic_details?.dob)
    const [age, setage] = useState('')
    useEffect(() => {
        if (getRiskObjectData() !== null) {
            getInfoData()
        }
        calculateAge(new Date(basicDetail?.user_basic_details?.dob))
    }, []);

    const getInfoData = async () => {
        const infoData: any = await AsyncStorage.getItem(RISK_PROFILE_INFODATA);
        let data = JSON.parse(infoData)
        setdate(data?.dob)
        setage(data?.age)
        setgender(data?.gender)
        setMarital(data?.maritalStatus)
        setchild(data?.child)
    }
    const [GenderList, setGenderList] = useState<any[]>([
        {
            title: 'Male',
            //image: require('../../../../assets/images/male.png'),
            value: 'M'
        },
        {
            title: 'Female',
          //  image: require('../../../../assets/images/female.png'),
            value: 'F'
        },
        {
            title: 'Other',
           // image: require('../../../../assets/images/both.png'),
            value: 'O'
        },
    ])
    const [childList, setchildList] = useState<any[]>([
        {
            title: '1',
            value: '1'
        },
        {
            title: '2',
            value: '2'
        },
        {
            title: '3',
            value: '3'
        },
        {
            title: '4',
            value: '4'
        },
        {
            title: '5',
            value: '5'
        },
    ])
    const [MaritalList, setMaritalList] = useState<any[]>([
        {
            title: 'Single',
            value: 'UNMARRIED'
        },
        {
            title: 'Married',
            value: 'MARRIED'
        },
        {
            title: 'Other',
            value: 'OTHER'
        },
    ])
    const onChangeGender = (item: any) => {
        if (gender != item?.value) {
            setgender(item?.value)
        } else {
            setgender('')
        }
    }
    const onChangeMarital = (item: any) => {
        if (Marital != item?.value) {
            setMarital(item?.value)
        } else {
            setMarital('')
        }
    }
    const onChangeChild = (item: any) => {
        if (child != item?.value) {
            setchild(item?.value)
        } else {
            setchild('')
        }
    }
    const calculateAge = (birthDate: Date) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust the age if the birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        const ages: any = age.toString()
        setage(ages)
    };
    const submit = async () => {
        if (!age) {
            showToast(toastTypes.info, 'Please select Birthdate')
            return
        }
        if (!gender) {
            showToast(toastTypes.info, 'Please select gender')
            return
        }
        if (!Marital) {
            showToast(toastTypes.info, 'Please select Marital status')
            return
        }
        let data = {
            age: age,
            gender: gender,
            maritalStatus: Marital,
            dob: format(date, 'yyyy-MM-dd'),
            agePoint: '',
            maritalPoint: '',
            child: child
        }

        await AsyncStorage.setItem(
            RISK_PROFILE_INFODATA,
            JSON.stringify(data),
        );
        let object = {
            user_basic_details: {
                marital_status: Marital,
                child: child,
                dob: format(date, 'yyyy-MM-dd'),
                gender: gender
            }
        }
        setRiskObject(null)
        setBasicDetail(object)
        setIndex('3')
    }
    return (
        <>
            <Container Xcenter>
                <Wrapper position="center" color={colors.cardBg} width={responsiveWidth(94)} customStyles={{ borderRadius: borderRadius.large, marginVertical: responsiveWidth(3), padding: responsiveWidth(5) }}>

                    <CusText position='center' semibold text={"Age Calculator"} color={colors.inputLabel} size="L" />
                    <Wrapper row position="center" justify="apart" width={responsiveWidth(88)} customStyles={{ marginBottom: responsiveWidth(10) }}>
                        <Wrapper width={responsiveWidth(55)}>
                            <DateTimePicker
                                maximum={new Date()}
                                value={date || undefined}
                                iconColor={colors.black}
                                borderColor={colors.gray}
                                bgColor={colors.cardBg}
                                customStyle={{
                                    borderRadius: borderRadius.medium,
                                }}
                                setValue={(value: Date) => {
                                    setdate(value)
                                    calculateAge(value)
                                }}
                            />
                        </Wrapper>
                        <InputField value={age}
                            placeholder='Age'
                            keyboardType='numeric'
                            onChange={(val: any) => { setage(val) }}
                            width={responsiveWidth(30)} />
                    </Wrapper>
                    <CusText position='center' semibold text={"Gender"} color={colors.inputLabel} size="L" />
                    <Spacer y="XS" />
                    <Wrapper row position="center">
                        {GenderList.map((item: any, i: number) =>
                            <TouchableOpacity onPress={() => { onChangeGender(item) }}>
                                <LinearGradient
                                    style={styles.gender}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={gender == item?.value ? [
                                        colors.tertiary,
                                        colors.quaternary,
                                    ] : [
                                        colors.gray,
                                        colors.gray,
                                    ]}>
                                    <View style={[styles.option, {
                                        backgroundColor:
                                            gender != item?.value ? colors.cardBg : colors.cardBg
                                    }]}>
                                        {/* <Image resizeMode='contain' source={item?.image} style={{
                                            width: responsiveWidth(15),
                                            height: responsiveWidth(15),
                                            borderRadius: borderRadius.ring,
                                            marginBottom: responsiveWidth(2)
                                        }}></Image> */}
                                        <CusText position='center' semibold text={item?.title} color={colors.Hard_White} size="MS" />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>)}
                    </Wrapper>
                    <Spacer y="N" />
                    <CusText position='center' semibold text={"Marital Status"} color={colors.inputLabel} size="L" />
                    <Spacer y="XS" />
                    <Wrapper row position="center">
                        {MaritalList?.map((item: any, i: number) =>
                            <TouchableOpacity onPress={() => { onChangeMarital(item) }}>
                                <LinearGradient
                                    style={styles.gender}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={Marital == item?.value ? [
                                        colors.tertiary,
                                        colors.quaternary,
                                    ] : [
                                        colors.gray,
                                        colors.gray,
                                    ]}>
                                    <View style={[styles.option, {
                                        backgroundColor:
                                            Marital != item?.value ? colors.cardBg : colors.cardBg
                                    }]}>
                                        <CusText position='center' semibold text={item?.title} color={colors.Hard_White} size="SS" />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>)}

                    </Wrapper>
                    {Marital == "MARRIED" ?
                        <>
                            <Spacer y="N" />
                            <CusText position='center' semibold text={"Number Of Childrens"} color={colors.inputLabel} size="L" />
                            <Spacer y="XS" />
                            <Wrapper row position="center">
                                {childList?.map((item: any, i: number) =>
                                    <TouchableOpacity onPress={() => { onChangeChild(item) }}>
                                        <LinearGradient
                                            style={[styles.gender, { width: responsiveWidth(13), }]}
                                            start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={child == item?.value ? [
                                                colors.tertiary,
                                                colors.quaternary,
                                            ] : [
                                                colors.gray,
                                                colors.gray,
                                            ]}>
                                            <View style={[styles.option, {
                                                backgroundColor:
                                                    child != item?.value ? colors.cardBg : colors.cardBg
                                            }]}>
                                                <CusText position='center' semibold text={item?.title} color={colors.Hard_White} size="SS" />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>)}

                            </Wrapper>
                        </>
                        : null}
                    <Spacer y="XS" />
                    <Spacer y="L" />
                    <Spacer y="XS" />
                    <Wrapper position="center">
                        <CusButton radius={borderRadius.ring} title='Continue' onPress={() => { submit() }} />
                    </Wrapper>
                </Wrapper>
            </Container>
        </>
    )
}

export default FirstScreen