import React from 'react';
import { Image, Text, View, Animated } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './CheckNetworkModalStyle';


const wifi = require('../../../assets/Images/wifi.png');

const CheckNetworkModal = ({ Visible }: any) => {
  const translation2 = new Animated.Value(0.2);
  const light = new Animated.Value(0.1);
  Animated.loop(
    Animated.sequence([
      Animated.timing(translation2, {
        toValue: 0.8,
        duration: 1500,
        // delay: 2000,
        useNativeDriver: true,
      }),
    ]),
    // {
    //   iterations: 4
    // }
  ).start()
  Animated.loop(
    Animated.sequence([
      Animated.timing(light, {
        toValue: 0.9,
        duration: 50,
        delay: 0,
        useNativeDriver: true,
      }),
      // Animated.timing(translation2, {
      //   toValue: -50,
      //   duration: 500,
      //   useNativeDriver: true,
      // })
    ]),
    // {
    //   iterations: 4
    // }
  ).start()
  return (
    <Modal
      isVisible={Visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
      useNativeDriver={true}
      style={styles.mainModal}>
      <View style={styles.modalView}>
        <>
          <View style={styles.container}>
            <View style={styles.content}>  
            <View> 
              <Animated.View style={{height:50,width:50, alignSelf: "center", opacity: translation2 }}>     
                <Image source={wifi} style={styles.loginImg} /> 
              </Animated.View>
              </View>
              <View style={styles.router}>
                <View style={styles.tower}></View>
                <Animated.View style={{height:50,width:50, alignSelf: "center", opacity: light }}>
                  <View style={styles.routerIndicator}>
                    <View style={styles.routerDot}></View>
                    <View style={styles.routerDot}></View>
                    <View style={styles.routerDot}></View>
                  </View>
                </Animated.View>
              </View>
             <View style={styles.textInfo}>   
              <Text style={styles.textTitle}>No Internet Connection</Text>
              <Text style={styles.textDescription}>No internet connection found. Please check your internet connection or try again</Text>
             </View>
            </View>
          </View>
        </>
      </View>
    </Modal>
  )
}

export default CheckNetworkModal