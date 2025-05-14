import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from '../../../context/appearanceContext';
import { AuthContext } from '../../../context/AuthContext';
import { localStorageKeys } from '../../../services/localStorageService';
import {
  responsiveWidth
} from '../../../styles/variables';
import Wrapper from '../../../ui/wrapper';
import { styles } from './HeaderStyle';

const Header = ({
  name,
  // navigation,
  menubtn,
  backBtn,
  notifBtn,
  cartBtn,
  searchBox,
  onSearch,
  onEnter,
  address,
  dashboard,
  subHeader,
  isShow,
}: any) => {
  const [searchText, setSearchText] = useState('');
  const {colors}: any = React.useContext(AppearanceContext);
  const navigation: any = useNavigation();
  const {signInAgain}: any = React.useContext(AuthContext);
  const [getuserData, setGetData] = useState<any>(null);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      userData();
      return () => {};
    }, [isFocused]),
  );

  const userData = async () => {
    try {
      const data: any = await AsyncStorage.getItem(localStorageKeys.USER_DATA);
      const userData: any = JSON.parse(data);
      setGetData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  return (
    <>
      <Wrapper customStyles={styles.headerView}>
        <Wrapper
          row
          justify="apart"
          align="center"
          customStyles={{
            paddingHorizontal: backBtn
              ? responsiveWidth(1.5)
              : responsiveWidth(5),
            marginVertical: responsiveWidth(3),
          }}>
          {menubtn ? (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}>
              <Text style={[styles.iconBtn, {backgroundColor: colors.iconBtn}]}>
                <IonIcon
                  name="menu"
                  size={35}
                  style={[styles.iconHeader, {color: colors.black}]}
                />
              </Text>
            </TouchableOpacity>
          ) : null}
          {backBtn ? (
            <>
              <IonIcon
                onPress={() => {
                  navigation.goBack();
                }}
                name="chevron-back-outline"
                size={responsiveWidth(7)}
                color={colors.black}
                style={{
                  padding: responsiveWidth(0.5),
                }}
              />
            </>
          ) : null}
          <View
              style={[styles.LogoBar, !name ? {justifyContent: 'center'} : {}]}>
            
                <TouchableOpacity
                  //activeOpacity={showPageName ? 0.5 : 1}
                  onPress={() => {
                    // if (showPageName) {
                    //   setShowName(true);
                    // }
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[styles.text, {color: colors.black}]}>
                    {name ?  name : ""}
                  </Text>
                </TouchableOpacity>
           
            </View>

        </Wrapper>
      </Wrapper>
    </>
  );
};
export default Header;
