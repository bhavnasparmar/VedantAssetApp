import React, { useContext, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

import { AppearanceContext } from '../../../context/appearanceContext';
import { styles } from './AlertStyle';

import { AuthContext } from '../../../context/AuthContext';

const Alert = ({
  AlertVisible,
  setAlertVisible,
  AlertMsg,
  AlertMsgsubTitle,
  alertMsgType,
  navigation,
  BtnArray,
}: any) => {
  const {signOut}: any = React.useContext(AuthContext);
  const [loggingOut, setloggingOut] = useState(false);
  const {colors, setnavigation}: any = useContext(AppearanceContext);
  // const logOut = async () => {
  //   const user: any = await getUser();
  //   const userPk: number = user?.userDetails?.usermaster_pk;
  //   DeviceInfo.getUniqueId().then(async (res: any) => {
  //     const device = res;
  //     let payloadData = {
  //       deviceId: device,
  //       userPK: userPk,
  //     };
  //     const [result, error]: any = await MobileLogOut(payloadData);
  //     if (error) {
  //       showToast(toastTypes.error, error);
  //     }
  //   });
  //   setloggingOut(true);
  //   await signOut(setloggingOut);
  //   // dispatch(getNewsList([]));
  //   // dispatch(getAnalysisList([]))
  //   setAlertVisible(false);
  //   setnavigation(false)
  // };
  const logOut = async () => {
  
      setloggingOut(true);
      await signOut(setloggingOut);
      // dispatch(getNewsList([]));
      // dispatch(getAnalysisList([]));
      setAlertVisible(false);
     
   
  };

  return (
    <Modal
      isVisible={AlertVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={() => setAlertVisible(false)}
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
      useNativeDriver={true}>
     
        <View style={styles.alertView}>
          <Text style={[styles.Alerttitle, {color: colors.black}]}>
            {AlertMsg}
          </Text>
          <Text style={[styles.Alertsubtitle, {color: colors.black}]}>
            {AlertMsgsubTitle}
          </Text>
          <View style={styles.btnRow}>
            {alertMsgType == 'signOut' ? (
              <>
                <TouchableOpacity
                  style={styles.Alertbutton}
                  onPress={() => {
                    setAlertVisible(false);
                  }}>
                  <Text style={styles.btnText}>{'Stay'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Alertbutton} onPress={logOut}>
                  <Text style={styles.btnText}>
                    {!loggingOut ? (
                      'Exit'
                    ) : (
                      <ActivityIndicator color={colors.white} />
                    )}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
               alertMsgType == 'SessionExpired' ? (
              <>
                <TouchableOpacity style={styles.Alertbutton} onPress={logOut}>
                  <Text style={styles.btnText}>
                    {!loggingOut ? (
                      'Okay'
                    ) : (
                      <ActivityIndicator color={colors.white} />
                    )}
                  </Text>
                </TouchableOpacity>
              </>
            ) :
              <>
                {!BtnArray ? (
                  <TouchableOpacity
                    style={styles.Alertbutton}
                    onPress={
                      () => {
                        navigation.navigate('Login');
                      }
                      /* setAlertVisible(false) */
                    }>
                    <Text style={styles.btnText}>
                      {!loggingOut ? (
                        'Okay'
                      ) : (
                        <ActivityIndicator color={colors.white} />
                      )}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}
            {BtnArray
              ? BtnArray.map((item: any, index: any) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.Alertbutton,
                      {backgroundColor: item.btnBgcolor},
                    ]}
                    onPress={
                      item.btnCallParent
                        ? item.btnCallParent
                        : () => {
                            setAlertVisible(false);
                          }
                    }>
                    <Text style={styles.btnText}>
                      {item.btnName ? item.btnName : 'Cancel'}
                    </Text>
                  </TouchableOpacity>
                ))
              : null}
          </View>
        </View>
     
    </Modal>
  );
};

export default Alert;
