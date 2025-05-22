import React, { useEffect, useState } from 'react';
import CusText from '../../../../../ui/custom-text';
import { showToast, toastTypes } from '../../../../../services/toastService';
import { getAllGoalTypeApi } from '../../../../../api/homeapi';
import { useIsFocused } from '@react-navigation/native';
import Wrapper from '../../../../../ui/wrapper';
import { responsiveWidth } from '../../../../../styles/variables';
import { Image } from 'react-native';
import { getGoalTypeImage } from '../../../../../utils/Commanutils';

const NewGoal = () => {

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
            <Wrapper row color='yellow' position='center' customStyles={{ flexWrap: 'wrap', paddingHorizontal: responsiveWidth(5) }}>
                {
                    goalTypesData?.map((goal: any) => {
                        return (
                            <>
                                <Wrapper customStyles={{ flexWrap: 'wrap' }}>
                                    <Image
                                        resizeMode="contain"
                                        source={{ uri: getGoalTypeImage(goal?.goal_icon) }}
                                        style={{
                                            height:responsiveWidth(5),
                                            width:responsiveWidth(5)
                                        }}></Image>
                                    <CusText text={goal?.goal_name} />
                                </Wrapper>
                            </>
                        )
                    })
                }
            </Wrapper>
        </>
    )
}


export default NewGoal