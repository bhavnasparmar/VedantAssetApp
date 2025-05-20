import { Image, Alert, Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native'
import React, { useRef } from 'react'
import CusText from '../../../../ui/custom-text'
import { AppearanceContext } from '../../../../context/appearanceContext';
import Container from '../../../../ui/container';
import Spacer from '../../../../ui/spacer';
import { borderRadius, responsiveHeight, responsiveWidth } from '../../../../styles/variables';
import Wrapper from '../../../../ui/wrapper';
import CusButton from '../../../../ui/custom-button';
import IonIcon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const lockWidth = width * 0.75;
const lockHeight = 60;
const smallgap = 4;
const finalPosition = lockWidth - lockHeight;

const StartProfile = ({ setIndex }: any) => {
    const { colors }: any = React.useContext(AppearanceContext);
    const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const translateBtn = pan.x.interpolate({ inputRange: [0, finalPosition], outputRange: [0, finalPosition], extrapolate: 'clamp' })
    const textOpacity = pan.x.interpolate({ inputRange: [0, lockWidth / 2], outputRange: [1, 0], extrapolate: 'clamp' })
    const translateText = pan.x.interpolate({ inputRange: [0, lockWidth / 2], outputRange: [0, lockWidth / 4], extrapolate: 'clamp' })
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => { },
            onPanResponderMove: Animated.event([null, { dx: pan.x }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (e, g) => {
                if (g.vx > 2 || g.dx > lockWidth / 2) {
                    unlock()
                } else {
                    reset()
                }
            },
            onPanResponderTerminate: () => reset(),
        }),
    ).current;
    const reset = () => {
        Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            bounciness: 0
        }).start();
    }
    const unlock = () => {
        Animated.spring(pan, {
            toValue: { x: finalPosition, y: 0 },
            useNativeDriver: true,
            bounciness: 0
        }).start();
        setIndex('2')
        // setTimeout(() => {
        //     Alert.alert(
        //         "Unlocked",
        //         "You can now remove this lock and display your View! Completely your logic!",
        //         [
        //             { text: "COOL", onPress: () => reset() }
        //         ]
        //     );
        // }, 300);
    }
    return (
        <>
            <Container Xcenter>
                <Wrapper position="center" color={colors.Hard_White} width={responsiveWidth(94)} customStyles={{ borderRadius: borderRadius.large, marginVertical: responsiveWidth(3), padding: responsiveWidth(5) }}>
                    <Wrapper position="center" customStyles={{ marginBottom: responsiveWidth(10) }}>
                        {/* <Image resizeMode='contain' source={require('../../../../assets/images/riskprofile.png')} style={{
                            width: responsiveWidth(80),
                            height: responsiveHeight(28)
                        }}></Image> */}
                    </Wrapper>
                    <CusText position='center' semibold text={"To Make Better Decisions. You Need to Understand Yourself."} color={colors.Hard_Black} size="L" />
                    <Spacer y="XS" />
                    <CusText position='center' text={"Introducing Inxits Investor Personality, a tool to help you understand your investing behaviour."} color={colors.Hard_Black} size="XS" customStyles={{ opacity: 0.6 }} />
                    <Spacer y="L" />
                    <CusText position='center' text={"Introducing OceanFinvest's Investor Personality."} color={colors.Hard_Black} size="S" />
                    <Spacer y="N" />
                    <CusButton position="center"  title='Know Your Personality'
                        onPress={() => { setIndex('2') }} />
                    {/* <Wrapper position='center' customStyles={styles.lockContainer}>
                        <Animated.Text style={[styles.txt, { opacity: textOpacity, transform: [{ translateX: translateText }] }]}>
                            {'Swipe to start'}
                        </Animated.Text>
                        <Animated.View style={[styles.bar, { transform: [{ translateX: translateBtn }] }]} {...panResponder.panHandlers}>
                            <Wrapper row position='center' justify='center' align='center'>
                                <IonIcon name="arrow-forward" size={24} color="#000" />
                            </Wrapper>

                        </Animated.View>
                    </Wrapper> */}
                </Wrapper>
            </Container>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 100
    },
    lockContainer: {
        height: lockHeight,
        width: lockWidth,
        borderRadius: lockHeight,
        backgroundColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    txt: {
        color: '#fff',
        letterSpacing: 2,
    },
    bar: {
        position: 'absolute',
        height: lockHeight - (smallgap * 2),
        width: lockHeight - (smallgap * 2),
        backgroundColor: '#fff',
        borderRadius: lockHeight,
        left: smallgap,
        elevation: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
})

export default StartProfile