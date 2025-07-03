import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../styles/variables';
// import Wrapper from '../../ui/wrapper';
// import CusText from '../../ui/custom-text';
import { styles } from './commonModalStyle';
import Wrapper from '../../../ui/wrapper';
import { borderRadius, responsiveWidth } from '../../../styles/variables';
import { AppearanceContext } from '../../../context/appearanceContext';
import CusText from '../../../ui/custom-text';
import CusButton from '../../../ui/custom-button';
import LinearGradient from 'react-native-linear-gradient';
// import CusButton from '../../ui/custom-button';


const CommonModal = ({
    visible,
    onClose,
    imageSource,
    iconName,
    iconSize,
    iconColor = '#000',
    title,
    description,
    button1Text,
    onButton1Press,
    button2Text,
    onButton2Press,
}: any) => {
      const { colors }: any = React.useContext(AppearanceContext);
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Wrapper justify='center' align='center' color='rgba(0, 0, 0, 0.5)'
                customStyles={styles.overlay}>
                <Wrapper
                    width={responsiveWidth(80)}
                    color={colors.white}
                    align='center'
                    customStyles={styles.modalContainer}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={colors.primary} />
                    </TouchableOpacity>

                    {/* Image or Icon */}
                    {imageSource ? (
                        <Image source={imageSource} style={styles.image} />
                    ) : iconName ? (
                        <Ionicons name={iconName} size={iconSize} color={iconColor} />
                    ) : null}

                    {/* Title */}
                    {title && <CusText bold size={"SL"} color={colors.primary} semibold customStyles={styles.title} text={title} />}

                    {/* Description */}
                    {description && <CusText size={"SS"} color={colors.primary} semibold customStyles={styles.description} text={description} />}
                      {/* <LinearGradient
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                   colors={[colors.primary, colors.primary, colors.primary]}
                   style={{ width: '100%', height: 1, opacity: 0.5,marginBottom:responsiveWidth(3) }}></LinearGradient> */}
                    {/* Buttons */}
                    <Wrapper width={responsiveWidth(65)} customStyles={{...styles.buttonContainer,...{justifyContent :( button1Text && button2Text) ? "space-between" : "center"}}}>
                        {button1Text && (
                            // <TouchableOpacity style={styles.button} onPress={onButton1Press}>
                            //     <CusText bold customStyles={styles.buttonText} text={button1Text} />
                            // </TouchableOpacity>
                            <Wrapper>
                                <CusButton
                                    height={responsiveWidth(9)}
                                    width={responsiveWidth(31)}
                                    title={button1Text}
                                    position="center"
                                    radius={borderRadius.middleSmall}
                                    onPress={onButton1Press}
                                    textSize='SS'
                                    textWeight='bold'
                                    lgcolor1={colors.orange} lgcolor2={colors.orange}
                                />
                            </Wrapper>
                        )}
                        {button2Text && (
                            // <TouchableOpacity style={styles.button} onPress={onButton2Press}>
                            //     {/* <Text style={styles.buttonText}>{button2Text}</Text> */}
                            //     <CusText bold customStyles={styles.buttonText} text={button2Text} />
                            // </TouchableOpacity>
                            <Wrapper>
                                <CusButton
                                height={responsiveWidth(9)}
                                    width={responsiveWidth(31)}
                                    title={button2Text}
                                    position="center"
                                    radius={borderRadius.middleSmall}
                                    onPress={onButton2Press}
                                     textSize='SS'
                                     textWeight='bold'
                                   lgcolor1={colors.orange} lgcolor2={colors.orange}
                                />
                            </Wrapper>
                        )}
                    </Wrapper>
                </Wrapper>
            </Wrapper>
        </Modal>
    );
};



export default CommonModal;
