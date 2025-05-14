import React from "react";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Wrapper from "../../../../ui/wrapper";
import { styles } from "./headercomponetStyles";

const HeaderComponent = ({ name, backAction }: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    return (
        <>
            <Wrapper customStyles={styles.header} color={colors.headerBg}>
                <Wrapper row customStyles={styles.HeaderRow} align="center">
                    <Wrapper width={responsiveWidth(10)}>
                        {backAction ?
                            <IonIcon onPress={() => backAction()} name={'chevron-back-outline'} color={colors.Hard_white} size={35} />
                            : null
                        }

                    </Wrapper>
                    <Wrapper row width={responsiveWidth(76)} justify="center">
                        <CusText text={name} color={colors.Hard_white} size='L' title />
                    </Wrapper>
                    <Wrapper width={responsiveWidth(10)}></Wrapper>
                </Wrapper>
            </Wrapper>
        </>
    )
}

export default HeaderComponent