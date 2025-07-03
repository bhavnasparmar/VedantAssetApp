import React, { useState, useContext, useEffect, useRef } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { AppearanceContext } from '../../../context/appearanceContext';
import Header from '../../../shared/components/Header/Header';
import Wrapper from '../../../ui/wrapper';
import { borderRadius, responsiveHeight, responsiveWidth } from '../../../styles/variables';
import NavTab from './component/newTab';
import Information from './component/information';
import RelatedScheme from './component/relatedscheme';
import Performance from './component/performance';
import Holding from './component/holding';
import FundManager from './component/fundmanager';
import Ratio from './component/ratio';
import CusText from '../../../ui/custom-text';
import IonIcon from 'react-native-vector-icons/Ionicons';

const FunpickerDetail = () => {
    const { colors }: any = useContext(AppearanceContext);
    const route: any = useRoute()
    const isFocused: any = useIsFocused()
    const layout = Dimensions.get('window');
    const [active, setActive] = useState(0)
    const headerScrollView: any = useRef(undefined);
    const itemScrollView: any = useRef(undefined);

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'nav', title: 'NAV' },
        { key: 'information', title: 'Information' },
        { key: 'relatedscheme', title: 'Related Scheme' },
        { key: 'performance', title: 'Performance' },
        { key: 'holding', title: 'Holding' },
        { key: 'fundmanager', title: 'Fund Manager' },
        { key: 'ratio', title: 'Ratio' },
    ]);

    useEffect(()=>{



    },[isFocused])

    useEffect(() => {
        headerScrollView.current.scrollToIndex({ index: active, viewPosition: 0.5 })
    }, [active])

    const onPressHeader = (index: any) => {
        itemScrollView.current.scrollToIndex({ index })
        setActive(index);
    }

    const onMomentumScrollEnd = (e: any) => {
        const newIndex = Math.round(e.nativeEvent.contentOffset.x / responsiveWidth(100));
        if (active != newIndex) {
            setActive(newIndex)
        }
    }
    const renderScene = (route: any) => {
        switch (route.key) {
            case 'nav':
                return (
                    <NavTab />
                );
            case 'information':
                return (
                    <Information totaldata={25} />
                );
            case 'relatedscheme':
                return <RelatedScheme />;
            case 'performance':
                return (
                    <Performance />
                );
            case 'holding':
                return (
                    <Holding />
                );
            case 'fundmanager':
                return (
                    <FundManager />
                );
            case 'ratio':
                return (
                    <Ratio />
                );
            default:
                return null;
        }
    };



    return (
        <>
            <Header backBtn name="Scheme Details" />
            <Wrapper color={colors.Hard_White} height={responsiveHeight(92)}>
                <Wrapper color={colors.headerColor} row align='center' customStyles={{ paddingVertical: responsiveWidth(1.5), paddingHorizontal: responsiveWidth(5) }}>
                                            {/* <IonIcon name={'chevron-back-outline'} color={colors.primary1} size={25} /> */}
                    <CusText semibold size='N' text={'HDFC Mid-Cap Opportunities Gr'} />
                </Wrapper>
                <Wrapper color={colors.tabBg} height={responsiveWidth(10)}>
                    <FlatList
                        data={routes}
                        ref={headerScrollView}
                        keyExtractor={(item) => item?.key}
                        horizontal
                        style={{ paddingHorizontal: responsiveWidth(2) }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }: any) => (

                            <Wrapper position='end' justify='center'

                                customStyles={{
                                    paddingVertical: responsiveWidth(1),
                                    paddingHorizontal: responsiveWidth(3),
                                    borderTopLeftRadius: active == index ? borderRadius.medium : 0,
                                    borderTopRightRadius: active == index ? borderRadius.medium : 0,
                                }}
                                color={active == index ? colors.Hard_White : colors.tabBg}
                                height={responsiveWidth(7)}>
                                <TouchableOpacity activeOpacity={0.6} onPress={() => { onPressHeader(index) }}>
                                    <CusText semibold position='center' text={item?.title} customStyles={{ alignSelf: 'center' }} />
                                </TouchableOpacity>
                                {/* {active == index && <View style={styles.headerBar} />} */}

                            </Wrapper>

                        )}
                    />
                </Wrapper>
                <FlatList
                    data={routes}
                    ref={itemScrollView}
                    keyExtractor={(item) => item?.key}
                    horizontal
                    pagingEnabled
                    decelerationRate='fast'
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    renderItem={({ item, index }: any) => renderScene(item)}
                />
            </Wrapper>
        </>
    );
};

export default FunpickerDetail;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // headerScroll: {
    //     flexGrow: 0,
    // },
    headerItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    mainItem: {
        width: responsiveWidth(100),
        borderWidth: 5,
        borderColor: '#fff',
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    headerBar: {
        height: 2,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0
    }
})
