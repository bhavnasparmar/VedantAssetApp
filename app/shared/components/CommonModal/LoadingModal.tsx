import React from 'react';
import { Modal, ActivityIndicator } from 'react-native';
import Wrapper from '../../../ui/wrapper';
import CusText from '../../../ui/custom-text';
import { AppearanceContext } from '../../../context/appearanceContext';
import { responsiveHeight, responsiveWidth, borderRadius } from '../../../styles/variables';

interface LoadingModalProps {
    visible: boolean;
    message?: string;
    onClose?: () => void;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ 
    visible, 
    message = 'Loading...', 
    onClose 
}) => {
    const { colors }: any = React.useContext(AppearanceContext);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Wrapper 
                justify='center' 
                align='center' 
                color='rgba(0, 0, 0, 0.5)'
                customStyles={{ flex: 1 }}
            >
                <Wrapper
                    width={responsiveWidth(70)}
                    color={colors.white}
                    align='center'
                    customStyles={{
                        borderRadius: borderRadius.medium,
                        paddingHorizontal: responsiveWidth(6),
                        paddingVertical: responsiveHeight(4),
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    <ActivityIndicator 
                        size="large" 
                        color={colors.primary} 
                    />
                    <CusText
                        text={message}
                        size='M'
                        medium
                        color={colors.Hard_Black}
                        customStyles={{ 
                            marginTop: responsiveHeight(2),
                            textAlign: 'center'
                        }}
                    />
                </Wrapper>
            </Wrapper>
        </Modal>
    );
};

export default LoadingModal;