import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AppearanceContext } from '../../../context/appearanceContext';
import Header from '../../../shared/components/Header/Header';
import { responsiveWidth } from '../../../styles/variables';
import Container from '../../../ui/container';
import CusText from '../../../ui/custom-text';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';

const Dashboard = () => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation()
    const { colors }: any = React.useContext(AppearanceContext);
    const [desc, setDesc] = useState<any>('')

    useEffect(() => {

    }, [isFocused]);

    return (
        <>
            <Header menubtn name={'Dashboard'} />
            <Container Xcenter contentWidth={responsiveWidth(100)}>
                <Spacer y='XS' />
                <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(5) }}>
                    <CusText title size='L' text={''} />
                </Wrapper>
                <Spacer y='XS' />
             
            </Container>
        </>

    )
};

export default Dashboard;
