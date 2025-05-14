
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { AppearanceContext } from "../../../../context/appearanceContext"
import { borderRadius, responsiveWidth } from "../../../../styles/variables"
import Container from "../../../../ui/container"
import CusButton from "../../../../ui/custom-button"
import CusText from "../../../../ui/custom-text"
import Spacer from "../../../../ui/spacer"
import Wrapper from "../../../../ui/wrapper"
import HeaderComponent from "../headercomponent/headercomponent"
import { styles } from "../kycverificationStyles"




const Success = () => {

    const navigation: any = useNavigation();

    const { colors,mode }: any = React.useContext(AppearanceContext);
    
    return(
        <>
        <HeaderComponent name={'KYC Verification'}/>
        <Container Xcenter>
            <Spacer y='L' />
            <Wrapper>
                {/* <Image style={{maxHeight:responsiveHeight(25),width:responsiveHeight(45)}} source={mode == 'dark' ? require('../../../../assets/images/successlightmode.png'):
                    require('../../../../assets/images/successdarkmode.png')
                } resizeMode='contain'/> */}
                <Spacer y='XS' />
                  <Wrapper position="center" align="center" width={responsiveWidth(100)}>
        <CusText text="Verification Successful!" size='L' color={colors.black}/>
        <Spacer y='XS' />
        <CusText text="Thank you for completing user verification. Application is under review.." size="SS"
        customStyles={styles.subtitle} position="center" color={colors.gray} />
        </Wrapper>
            </Wrapper>
            <Wrapper position="center" align="center" width={responsiveWidth(100)}>
            <CusText text="Start your Investment Now..." size="SS"
        customStyles={styles.subtitle} position="center" color={colors.gray} />
                </Wrapper>
                <Spacer y='XS'/>
            <CusButton
                    customStyle={{ borderRadius: borderRadius.medium }}
                    width={responsiveWidth(90)}
                    title="Done"
                    lgcolor1={colors.primary}
                    lgcolor2={colors.secondry}
                    position="center"
                    onPress={()=>{ navigation.navigate('KycSummery') }}
                />
        </Container>
        </>
    )




}
export default Success