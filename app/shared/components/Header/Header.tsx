import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Image,
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
import Spacer from '../../../ui/spacer';
import Container from '../../../ui/container';
import CusText from '../../../ui/custom-text';

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
  const { colors }: any = React.useContext(AppearanceContext);
  const navigation: any = useNavigation();
  const { signInAgain }: any = React.useContext(AuthContext);
  const [getuserData, setGetData] = useState<any>(null);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      userData();
      return () => { };
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
      <Wrapper color={colors.headerColor}  height={responsiveWidth(13)} row align='center'
        customStyles={{
        }}
      >
        <Spacer x='S' />
        <Wrapper align='center' row >
          {/* {menubtn ? 
           
          <></>  
          : null}   */}

          {backBtn ? (
            <>
              <IonIcon
                onPress={() => {
                  navigation.goBack();
                }}
                name="chevron-back-outline"
                size={responsiveWidth(6)}
               color={colors.primary}
                style={{
                  padding: responsiveWidth(0.5),
                }}
              />
            </>
          ) : null}
          {/* <Spacer x='XXS' /> */}
          <CusText semibold position='center' color={colors.primary} text={name} size='SL' />
        </Wrapper>

        {/* <Wrapper
          color='red'
          row
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
              <Wrapper align='center'>
                <Image
                  source={require('../../../assets/Images/drawermenu.png')}
                  style={{
                    height: responsiveWidth(9),
                    width: responsiveWidth(9)
                  }}
                />
              </Wrapper>
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
          <Spacer x='S' />
          <CusText position='center' text={name} size='M' />
        </Wrapper> */}

      </Wrapper>
    </>
  );
};
export default Header;
