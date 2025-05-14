import { Platform, StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  marginHorizontal,
  responsiveHeight,
  responsiveWidth,
} from '../../../styles/variables';

const styles = StyleSheet.create({
  headerView: {
    // height:
    //   Platform.OS === 'ios' ? responsiveHeight(6) + 0 : responsiveHeight(18),
    width: responsiveWidth(100),
    alignSelf: 'center',
    paddingTop: Platform.OS === 'ios' ? responsiveWidth(2) : 0,
  },
  // header: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   width: responsiveWidth(95),
  //   alignSelf: 'center',
  // },
  header: {
    padding: responsiveWidth(1),
    // borderBottomEndRadius: borderRadius.large,
    // borderBottomStartRadius: borderRadius.large,
    width: "100%",

  },
  headerRow: {
    padding: responsiveWidth(1),
    // width: "100%",
    paddingHorizontal: responsiveWidth(8)
  },
  inputBox: {
    // paddingHorizontal: responsiveWidth(4),
    // marginTop: responsiveWidth(-1.5),
    // marginBottom: responsiveWidth(3)
  },
  searchIcon: {
    backgroundColor: colors.primary1
  },
  text: {
    color: colors.Hard_White,
  },
  iconHeader: {
    fontSize: fontSize.XXXL,
  },
  iconImgHeader: {
    width: 23,
    height: 23,
    resizeMode: "contain"
  },
  iconBtn: {
    backgroundColor: colors.white,
    padding: responsiveWidth(1),
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    elevation: 20,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },
  iconBtn2: {
    backgroundColor: colors.white,
    padding: responsiveWidth(1),
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    elevation: 20,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },
  notification: {
    width: responsiveWidth(1.5),
    height: responsiveHeight(0.75),
    borderRadius: borderRadius.normal,
    backgroundColor: colors.red,
    zIndex: 5,
    right: responsiveWidth(1.5),
    top: responsiveWidth(1),
    position: 'absolute',
    marginLeft: marginHorizontal.extraSmall + 2,
  },
  kitCount: {
    backgroundColor: colors.red,
    width: responsiveWidth(4),
    maxWidth: responsiveWidth(7),
    height: responsiveWidth(4),
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.white,
    zIndex: 7,
    right: responsiveWidth(-1),
    top: responsiveWidth(-1),
    position: 'absolute',
    fontSize: fontSize.nanoSize,
  },

  countView: {
    backgroundColor: colors.red,
    minWidth: responsiveWidth(4),
    maxWidth: responsiveWidth(7),
    height: responsiveWidth(4),
    alignItems: 'center',
    zIndex: 7,
    right: responsiveWidth(-0.5),
    top: responsiveWidth(-0.5),
    position: 'absolute',
    justifyContent: 'center',
  },

  count: {
    fontSize: fontSize.nanoSmall,
    color: colors.Hard_White,
  },

  logo: {
    width: responsiveWidth(50),
    resizeMode: 'contain',
    height: responsiveWidth(8),
  },
  LogoBar: {
    width: responsiveWidth(64),
  },
  logoIcon: {
    width: responsiveWidth(50),
    resizeMode: 'contain',
    height: responsiveWidth(15),
  },

});

export { styles };
