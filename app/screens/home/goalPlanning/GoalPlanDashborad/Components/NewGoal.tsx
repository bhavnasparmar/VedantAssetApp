import React, { useEffect, useState } from 'react';
import CusText from '../../../../../ui/custom-text';
import { showToast, toastTypes } from '../../../../../services/toastService';
import { getAllGoalTypeApi } from '../../../../../api/homeapi';
import { useIsFocused } from '@react-navigation/native';
import Wrapper from '../../../../../ui/wrapper';
import { borderRadius, colors, responsiveHeight, responsiveWidth } from '../../../../../styles/variables';
import { Image, TouchableOpacity } from 'react-native';
import { getGoalTypeImage } from '../../../../../utils/Commanutils';
import NewGoalModal from './NewGoalModal';

const NewGoal = () => {

    const isFocused = useIsFocused();
    const [goalTypesData, setGoalTypesData] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [goalDetailsObj, setGoalDetailsObj] = useState<any>({});
    useEffect(() => {
        goalTypes();
    }, [isFocused]);

    const goalTypes = async () => {
        try {
            const [result, error]: any = await getAllGoalTypeApi();
            console.log('result?.data----', result?.data);
            console.log('result?.error----', error);
            if (result) {
                if (result?.data.length > 0) {
                    setGoalTypesData(result?.data);
                } else {
                    showToast(toastTypes.info, 'No Data Found');
                }
            } else {
            }


        } catch (error: any) {
            console.log('goalTypes Catch Error', error);
            showToast(toastTypes.error, error[0].msg);
        }
    };

    const setGoalDetails = (goal: any) => {
        setGoalDetailsObj(goal)
        setModalVisible(true)
    }

    return (
        <>
            <Wrapper position='center' row customStyles={{ flexWrap: 'wrap', marginHorizontal: responsiveWidth(5), marginVertical: responsiveWidth(2), paddingBottom: responsiveWidth(2) }}>
                {goalTypesData?.map((item: any, i: number) =>
                    <Wrapper width={"33%"} customStyles={{ flexWrap: 'wrap', marginVertical: responsiveWidth(1) }}>
                        <TouchableOpacity style={{
                            width: responsiveWidth(12),
                            height: responsiveWidth(12),
                            borderColor: "rgba(226, 226, 226, 1)",
                            borderWidth: responsiveWidth(0.5),
                            padding: responsiveWidth(10),
                            borderRadius: borderRadius.medium,
                            justifyContent: "center",
                            alignItems: "center",
                            marginHorizontal: responsiveWidth(4),
                            marginVertical: responsiveWidth(2),
                            backgroundColor:colors.white
                        }} onPress={() => { setGoalDetails(item) }}>
                            <Image resizeMode='contain' source={{ uri: getGoalTypeImage(item?.goal_icon) }} style={{
                                height: responsiveHeight(10),
                                width: responsiveWidth(10)
                            }}></Image>
                        </TouchableOpacity>
                        <Wrapper >
                            <CusText semibold position="center" text={item?.goal_name} size='S'
                                customStyles={{ width: responsiveWidth(20) }} />
                        </Wrapper>
                    </Wrapper>
                )}
            </Wrapper>
            <NewGoalModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                goalName={goalDetailsObj?.goal_name}
            />
        </>
    )
}


export default NewGoal