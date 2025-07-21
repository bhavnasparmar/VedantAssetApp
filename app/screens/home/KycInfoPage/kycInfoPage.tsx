import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AppearanceContext } from '../../../context/appearanceContext';
import Header from '../../../shared/components/Header/Header';
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../../styles/variables';
import Container from '../../../ui/container';
import CusText from '../../../ui/custom-text';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
import CusButton from '../../../ui/custom-button';
import { ActivityIndicator, Image, Keyboard, TouchableOpacity, FlatList } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const KycInfoPage = () => {
    const isFocused: any = useIsFocused();
    const navigation: any = useNavigation();
    const route: any = useRoute();

    const documentList = [
        {
            id: 1,
            title: 'SIGNATURE SCAN',
            subtitle: 'Clear signature on white paper for verification',
            icon: 'edit',
            iconType: 'MaterialIcons',
            bgColor: '#E3F2FD',
            iconColor: '#2196F3'
        },
        {
            id: 2,
            title: 'VIDEO VERIFICATION',
            subtitle: 'Clear signature on white paper for verification',
            icon: 'videocam',
            iconType: 'Ionicons',
            bgColor: '#FFF3E0',
            iconColor: '#FF9800'
        },
        {
            id: 3,
            title: 'IDENTITY PROOF',
            subtitle: 'Clear signature on white paper for verification',
            icon: 'card-account-details',
            iconType: 'MaterialIcons',
            bgColor: '#FFEBEE',
            iconColor: '#F44336'
        },
        {
            id: 4,
            title: 'ADDRESS PROOF',
            subtitle: 'Clear signature on white paper for verification',
            icon: 'location-on',
            iconType: 'MaterialIcons',
            bgColor: '#E8F5E8',
            iconColor: '#4CAF50'
        }
    ];

    const renderDocumentItem = ({ item }: any) => {
        const IconComponent = item.iconType === 'Ionicons' ? IonIcon : MaterialIcons;

        return (
            <Wrapper
                row
                align='center'
                customStyles={{
                    paddingHorizontal: responsiveWidth(4),
                    paddingVertical: responsiveHeight(1),
                    marginVertical: responsiveHeight(0.5)
                }}
            >
                <Wrapper
                    position='center'
                    align='center'
                    justify='center'
                    width={responsiveWidth(12)}
                    height={responsiveWidth(12)}
                    color={item.bgColor}
                    customStyles={{
                        borderRadius: borderRadius.small,
                        marginRight: responsiveWidth(3)
                    }}
                >
                    <IconComponent
                        name={item.icon}
                        size={24}
                        color={item.iconColor}
                    />
                </Wrapper>

                <Wrapper customStyles={{ flex: 1 }}>
                    <CusText
                        text={item.title}
                        size='MS'
                        bold
                        color={colors.black}
                        customStyles={{ marginBottom: 4 }}
                    />
                    <CusText
                        text={item.subtitle}
                        size='XS'
                        color={colors.gray}
                        customStyles={{ lineHeight: 16 }}
                    />
                </Wrapper>
            </Wrapper>
        );
    };

    return (
        <>
            <Header name={'Initial On-Boarding'} />
            <Container Xcenter bgcolor={colors.Hard_White}>
                <Wrapper
                    color={colors.Hard_White}
                    justify='center'
                    position='center'
                    width={responsiveWidth(100)}
                    height={responsiveHeight(85)}
                    customStyles={{ paddingHorizontal: responsiveWidth(5) }}
                >
                    {/* Welcome Section */}
                    <Wrapper position='center' justify='center' customStyles={{ marginTop: responsiveHeight(3) }}>
                        <CusText position='center' bold size='XXXL' text={'Welcome!'} color={colors.black} />
                        <Spacer y='XS' />
                        <CusText
                            position='center'
                            medium
                            size='MS'
                            text={'Thank you for choosing Digital KYC.'}
                            color={colors.black}
                        />
                        <Spacer y='XS' />
                        <CusText
                            position='center'
                            medium
                            size='MS'
                            text={'We request you to keep the following documents handy for a smooth KYC process.'}
                            color={colors.black}
                            customStyles={{ textAlign: 'center', lineHeight: 20 }}
                        />
                    </Wrapper>
                    <Spacer y='S' />
                    {/* Document List Section */}
                    <Wrapper
                        color={colors.Hard_White}
                        width={responsiveWidth(90)}
                        customStyles={{
                            borderRadius: borderRadius.medium,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            // marginVertical: responsiveHeight(2)
                        }}
                    >
                        <FlatList
                            data={documentList}
                            renderItem={renderDocumentItem}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => (
                                <Wrapper
                                    customStyles={{
                                        height: 1,
                                        backgroundColor: colors.fieldborder,
                                        marginHorizontal: responsiveWidth(4)
                                    }}
                                />
                            )}
                        />
                    </Wrapper>
                    <Spacer y='S' />
                    {/* Button Section */}
                    <Wrapper position='center' customStyles={{ marginBottom: responsiveHeight(0) }}>
                        <CusButton
                            width={responsiveWidth(40)}
                            height={responsiveHeight(5)}
                            title={"Let's Go!"}
                            textWeight="bold"
                            textStyle={{
                                fontSize: fontSize.normal,
                                color: colors.Hard_White
                            }}
                            color={colors.orange || '#FF9800'}
                            position="center"
                            radius={borderRadius.medium}
                            onPress={() => {
                                // Navigate to next screen
                                navigation.navigate('KycDigiLockerInfo');
                            }}
                        />
                    </Wrapper>
                </Wrapper>
            </Container>
        </>
    );
};

export default KycInfoPage;
