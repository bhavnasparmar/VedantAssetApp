import * as React from 'react';
import { View, useWindowDimensions, Text,Image, TouchableOpacity } from 'react-native';
import { TabView, SceneMap} from 'react-native-tab-view';
import Login from '../login/login';
import { responsiveHeight, responsiveWidth } from '../../../styles/variables';
import Wrapper from '../../../ui/wrapper';
import { styles } from '../login/loginStyle';
import Register from '../Register/Register';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
const FirstRoute = () => (
    <Login />
);

const SecondRoute = () => (
    <>
    <Register />
    </>
);
const TabviewLogin = () => {
    const layout = useWindowDimensions();
  const isFocused = useIsFocused();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Login' },
        { key: 'second', title: 'Sign Up' },
    ]);

     useFocusEffect(
        React.useCallback(() => {
         setIndex(0)
    
          return () => {
         
          };
        }, [isFocused]),
      );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });
    const renderTabBar = ({ props }: any) => (
        <View style={styles.tabBar}>
            {routes?.map((route: any, i: number) => {
                const isActive = i === index
                return (
                    <TouchableOpacity
                        key={route.key}
                        style={[styles.tabItem, isActive && styles.activeTab]}
                        onPress={() => setIndex(i)}
                    >
                        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                            {route.title}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    return (
        <>
            <Wrapper align='center'>
                <Image source={require('../../../assets/Images/logo_light.png')} style={{
                    height: responsiveHeight(15),
                    width: responsiveWidth(50),
                    resizeMode: 'contain'
                }} />
            </Wrapper>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={(props) => renderTabBar(props)}
            />
        </>
    );
}

export default TabviewLogin;

