
import Modal from "react-native-modal";
import { borderRadius, colors, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import Wrapper from "../../../../ui/wrapper";
import CusText from "../../../../ui/custom-text";
import IonIcon from 'react-native-vector-icons/Ionicons';
import Spacer from "../../../../ui/spacer";
import CusButton from "../../../../ui/custom-button";

const DeleteAlert = ({ isVisible, setisVisible, title,btnCallParent,btnTitle }: any) => {

    return (
        <Modal
            isVisible={isVisible}

            animationIn='fadeIn'
            animationOut='fadeOut'
            backdropTransitionOutTiming={0}
            backdropTransitionInTiming={0}
            useNativeDriver={true}>
            <Wrapper width={responsiveWidth(90)} align='center'
                customStyles={{
                    backgroundColor: colors.darkGray,
                    borderRadius: borderRadius.normal
                }}>
                <Wrapper row justify='apart' customStyles={{paddingVertical:responsiveWidth(3),
                    borderBottomWidth:0.3,borderBottomColor:colors.inputLabel}}>
                    <CusText position='center' customStyles={{
                        paddingLeft: responsiveWidth(3)
                        , width: responsiveWidth(85),
                    }}
                        text={title || '-'} />

                    <IonIcon onPress={() => { setisVisible(false) }} name='close-outline' color={colors.Hard_White} size={25} ></IonIcon>
                </Wrapper>
                <Spacer y='S'/>
                <CusText text={`Are you sure you want to delete ${title} Goal ?`} medium size="N" position="center"/>
                <Spacer y='S'/>
                <Wrapper row justify="apart" width={responsiveWidth(75)}>
                <CusButton
                width={responsiveWidth(30)}
                height={responsiveHeight(5)}
                title={btnTitle}
                lgcolor1={colors.darkGray}
                lgcolor2={colors.darkGray}
                position="center"
                radius={borderRadius.ring}
                exborder
                onPress={() => {
                    btnCallParent()
                }}
            />
            <CusButton
                width={responsiveWidth(30)}
                height={responsiveHeight(5)}
                title="No"
                lgcolor1={colors.primary}
                lgcolor2={colors.secondary}
                position="center"
                radius={borderRadius.ring}
                exborder
                onPress={() => {
                    setisVisible(false)
                }}
            />  
          </Wrapper>
          <Spacer y='N'/>
               </Wrapper>
               </Modal>
                 )

                }
                
export default DeleteAlert;