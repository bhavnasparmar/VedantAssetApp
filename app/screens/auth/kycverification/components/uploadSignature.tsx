import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, responsiveWidth } from "../../../../styles/variables";
import Container from "../../../../ui/container";
import CusButton from "../../../../ui/custom-button";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import HeaderComponent from "../headercomponent/headercomponent";
import { styles } from "../kycverificationStyles";

const UploadSignature = ({setSelectedTab}: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const navigation: any = useNavigation();
    return (
        <>
            <HeaderComponent />
            <LinearGradient
                style={styles.subHeader}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}  
                colors={[   
                    colors.gradient3,
                    colors.gradient4,    
                    colors.gradient5,        
                ]}>
                <Wrapper row justify="apart" customStyles={styles.HeaderRow}>
                    <TouchableOpacity onPress={()=>{setSelectedTab('bankDetailRoute')}}>
                    <IonIcon name={'chevron-back-outline'} color={colors.primary1} size={25} />
                    </TouchableOpacity>
                    <CusText text={'Upload Signature'} color={colors.Hard_white} size='N' />
                    <TouchableOpacity onPress={()=>{setSelectedTab('capturePhotoRoute')}}>
                    <IonIcon name={'chevron-forward-outline'} color={colors.primary1} size={25} />
                    </TouchableOpacity>
                </Wrapper>
            </LinearGradient>
            <Container Xcenter>
            <Wrapper position="center">
                <Wrapper
                    customStyles={styles.uploadFrame}
                    height={responsiveWidth(35)}
                    borderColor={colors.gray}
                    align="center"
                    justify="center">
                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.tabBg }]} >
                        <IonIcon name='camera-outline' color={colors.gray} size={30} ></IonIcon>
                    </TouchableOpacity>
                    <CusText
                        text="Take a Photo - Signature"
                        position="center"
                        color={colors.gray}
                    />
                </Wrapper>
                <Spacer y='XXS' />
                <Wrapper align="end" width={responsiveWidth(94)}>
                    <TouchableOpacity onPress={() => { navigation.navigate('ResetPasswordverify') }}>
                        <CusText text="Upload Document" size='S' color={colors.gray} underline />
                    </TouchableOpacity>
                </Wrapper>
                </Wrapper>
               
                <Spacer y='XL' />
                <Spacer y='XL' />
                <Spacer y='XXL'/>
                <CusButton
                    customStyle={{ borderRadius: borderRadius.medium }}
                    width={responsiveWidth(90)}
                    title="Next"
                    lgcolor1={colors.primary}
                    lgcolor2={colors.secondry}
                    position="center"
                    onPress={()=>{setSelectedTab('capturePhotoRoute')}}
                />
            </Container>
        </>
    )
}
export default UploadSignature