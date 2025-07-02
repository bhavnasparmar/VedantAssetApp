import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, ScrollView, Text } from 'react-native';
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

const FunpickerDetail = () => {
    const { colors }: any = useContext(AppearanceContext);
    const route: any = useRoute()
    const isFocused: any = useIsFocused()
    const layout = Dimensions.get('window');

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'nav', title: 'Nav' },
        { key: 'information', title: 'Information' },
        { key: 'relatedscheme', title: 'Related Scheme' },
        { key: 'performance', title: 'Performance' },
        { key: 'holding', title: 'Holding' },
        { key: 'fundmanager', title: 'Fund Manager' },
        { key: 'ratio', title: 'Ratio' },
    ]);



    const renderScene = ({ route }: any) => {
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
            // <CompletedGoal />;
            default:
                return null;
        }
    };
    return (
        <>
            <Header menubtn name="Scheme Details" />
            <Wrapper color={colors.Hard_White} height={responsiveHeight(92)}>
                <TabView
                    lazy
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    // initialLayout={{ width: layout.width }}
                    style={{
                        marginBottom: responsiveWidth(3),
                    }}
                    renderTabBar={props => (
                        <TabBar
                            {...props}
                            indicatorStyle={{
                                backgroundColor: colors.Hard_White,
                                borderTopLeftRadius: borderRadius.medium,
                                borderTopRightRadius: borderRadius.medium,
                                height: responsiveWidth(10)
                            }}
                            pressOpacity={0}
                            pressColor={colors.tabBg}
                            style={{ backgroundColor: colors.tabBg }}
                            inactiveColor={colors.black}
                            activeColor={colors.black}
                            tabStyle={{
                                width: 'auto',
                                paddingHorizontal: responsiveWidth(3),
                                paddingBottom: 0
                            }}

                        />
                    )}
                />
            </Wrapper>
        </>
    );
};

export default FunpickerDetail;
