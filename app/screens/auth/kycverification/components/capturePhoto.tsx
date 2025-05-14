import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from "../../../../context/appearanceContext";
import ImagePickerModal from "../../../../shared/components/ImagePickerModal";
import { borderRadius, responsiveWidth } from "../../../../styles/variables";
import Container from "../../../../ui/container";
import CusButton from "../../../../ui/custom-button";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import HeaderComponent from "../headercomponent/headercomponent";
import { styles } from "../kycverificationStyles";

const CapturePhoto = ({setSelectedTab}: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const [photo, setPhoto] = useState<any>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
    const handleImagePick = (response: any) => {
       setPhoto(response)
      };
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
                    <TouchableOpacity onPress={()=>{setSelectedTab('uploadSignatureRoute')}}>
                    <IonIcon name={'chevron-back-outline'} color={colors.primary1} size={25} />
                    </TouchableOpacity> 
                    <CusText text={'Capture Photo'} color={colors.Hard_white} size='N' />
                    <TouchableOpacity onPress={()=>{setSelectedTab('captureVideoRoute')}}>
                    <IonIcon name={'chevron-forward-outline'} color={colors.primary1} size={25} />
                    </TouchableOpacity>
                </Wrapper>
            </LinearGradient>
            <Container Xcenter>
                <Spacer y='S'/>
            <Wrapper position="center" align="center" width={responsiveWidth(100)}>
        <CusText text="Capture or Upload your passport size Photo" size="SS"
        customStyles={styles.subtitle} position="center" color={colors.black} />
        </Wrapper> 
            <Wrapper position="center">
                <Wrapper
                    customStyles={styles.uploadFrame}
                    height={responsiveWidth(35)}
                    borderColor={colors.gray}
                    align="center"
                    justify="center">
                    <TouchableOpacity onPress={()=>{ setModalVisible(true);}} style={[styles.button, { backgroundColor: colors.tabBg }]} >
                        <IonIcon name='camera-outline' color={colors.gray} size={30} ></IonIcon>
                    </TouchableOpacity>
                    <CusText
                        text="Take a Photo - Passport szie photo"
                        position="center"
                        color={colors.gray}
                    />
                </Wrapper>
                <Spacer y='XXS' />
                <Wrapper align="end" width={responsiveWidth(94)}>
                    <TouchableOpacity onPress={()=>{ setModalVisible(true);}}>
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
                    onPress={()=>{setSelectedTab('captureVideoRoute')}}
                />
            </Container>
            <ImagePickerModal
                visible={isModalVisible}
                onClose={toggleModal}
                onPickImage={handleImagePick} isVideo={false}      />
        </>
    )
}
export default CapturePhoto