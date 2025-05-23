import React, { useEffect, useState } from 'react';
import CusText from '../../../../../ui/custom-text';
import { showToast, toastTypes } from '../../../../../services/toastService';
import { getAllGoalTypeApi } from '../../../../../api/homeapi';
import { useIsFocused } from '@react-navigation/native';
import Wrapper from '../../../../../ui/wrapper';
import { borderRadius, responsiveHeight, responsiveWidth } from '../../../../../styles/variables';
import { Image, TouchableOpacity } from 'react-native';
import { getGoalTypeImage } from '../../../../../utils/Commanutils';

const CompletedGoal = () => {

    const isFocused = useIsFocused();
    const [goalTypesData, setGoalTypesData] = useState<any[]>([]);
    useEffect(() => {
        goalTypes();
    }, [isFocused]);

    const goalTypes = async () => {
        try {
            const [result, error]: any = await getAllGoalTypeApi();
            console.log('result--**--', result);
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

    return (
        <>
            <Wrapper position='center' row customStyles={{ flexWrap: 'wrap', marginHorizontal: responsiveWidth(5), marginVertical: responsiveWidth(2), paddingBottom: responsiveWidth(2) }}>
                <CusText text={'Completed Goal'} />
            </Wrapper>
        </>
    )
}


export default CompletedGoal