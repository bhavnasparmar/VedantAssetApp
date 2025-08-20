import { Dimensions, Platform } from 'react-native';
import Device from 'react-native-device-info';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const isTablet = () => {
  let tablet = Device.isTablet();
  if (tablet) {
    return true;
  } else {
    return false;
  }
};

const isIpad = () => {
  if (deviceWidth > 500) {
    return true;
  } else {
    return false;
  }
};

// responsive
const responsiveHeight = (h: any) => {
  return deviceHeight * (h / 100);
};
const responsiveWidth = (w: any) => {
  return deviceWidth * (w / 100);
};

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) =>
  (deviceWidth / guidelineBaseWidth) * size;
// const responsiveHeight = (size) => (deviceHeight / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

const NAV_HEIGHT = responsiveHeight(6.6);
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 24;

// button size
const btnWidth = {
  normal: responsiveWidth(74.4),
  large: responsiveWidth(91.47),
};
let btnHeight = 50;
export const tabHeight = responsiveHeight(8);
export const drawerWidth = responsiveWidth(80);
let smallbtnHeight = 30;

let scrollableTabHeight = 50;

// input box height
let inputHeight = 43;

// SearchInput box height
let searchInputHeight = 36;
let searchLineHeight = 18;

// marginHorizontal
const marginHorizontal = {
  large: responsiveWidth(12.8), // margin = 48
  normal: responsiveWidth(8.5), // margin = 32
  semiSmall: responsiveWidth(6.4), // margin = 24
  small: responsiveWidth(4.27), // margin = 16,
  extraSmall: responsiveWidth(2),
  XXS: responsiveHeight(1),
  XLARGE: responsiveWidth(24),
  XXL: responsiveWidth(28),
  XXXL: responsiveWidth(35),
};

// margin or padding vertical
const spaceVertical = {
  XXlarge: responsiveHeight(20),
  extraLarge: responsiveHeight(14),
  large: responsiveHeight(7.19), // space = 48
  normal: responsiveHeight(4.8), // space = 32
  semiSmall: responsiveHeight(3.6), // space = 24
  small: responsiveHeight(2.4), // space = 16
  extraSmall: responsiveHeight(1.5),
  XXS: responsiveHeight(1),
};

let reptativeColors = {
  transparent: 'transparent',
  black: '#000000',
  white: '#ffffff',
  darkGray: '#262626',
  darkGrayShades: '#313131',
  gray: '#999999',
  lightGray: '#eeeeee',
  gridHeader:'#F7F6F6',
  // primary: 'rgba(35, 59, 116, 1)',
  primary: '#233B74',
  primarylow: '#8505B41F',
  primary1: '#3498DB',
  primary2: '#FF6207',
  primary2low: '#FF62071F',
  primary3: '#AEC3FF',
  secondary: '#F5862E',
  secondary2: '#A2DD4D',
  secondary3: '#96A8B0',
  red: '#c00808',
  orange: '#FF9F40',
  yellow: '#eef240',
  green: '#01b81a',
  innerCard: '#1c1c1d',
  tabBg: '#EAECF0',
  itemborder: '#090F471A',
  itemtextcolor: '#090F47',
  errorText: '#E33629',
  inputBorder1: '#BFCFD6',
  itembg: '#EAF0FA',
  itemClose: '#CECECE',
  itemDec: '#DFE3FF',
  card: '#D8F1FF',
  dotColor: '#0A2E6A',
  bannerBg1: '#D7D0FF',
  dashBorder: 'rgba(216, 222, 232, 0.6)',
  border: '#D3DAE1',
  favColor: '#B7B7B7',
  headerserachborder: '#D3DAE199',
  addressbuttoncolor: '#FCB716',
  locationIcon: '#569200',
  searchHeaderBG: '#EBEBEB',
  bottomTabBG1: '#FFF',
  altProductColor: '#9CC54466',
  altoffercolor: '#20B038',
  label:'#101828',
  headerlist:'#EAECF0',
  //extra color code
  greenshade:'#E6F8E9',
  inputLabel: '#BCBCBC',
  headerColor:'#F8F8F8',
  gradient1: '#DA79FF',
  gradient2: '#7200E4',
  // placeholderColor: 'rgba(153,153,153,0.6)',
  placeholderColor: '#98A2B3',
  placeholderColorFixed: 'rgba(255,255,255,0.6)',
  darkgreen: '#00830B',
  paginationborder: '#DFE3E8',
  paginationselected: "#1B47C40F",
  fieldborder:'#EAECF0',
  bg:'#F4F6F8',
  action:'#3498DB',
  cardborder:'#DEDEDE'
};

const colors: any = {
  lightGray :reptativeColors?.lightGray,
  gradient3: 'rgba(229, 75, 186, 0.4)',
  gradient4: 'rgba(243, 118, 124, 0.29)',
  gradient5: 'rgba(255, 151, 75, 0.2)',
  label:reptativeColors.label,
  transparent: reptativeColors.transparent,
  black: reptativeColors.black,
  white: reptativeColors.white,
  darkGray: reptativeColors.darkGray,
  darkGrayShades: reptativeColors.darkGrayShades,
  gridHeader:reptativeColors.gridHeader,
  gray: reptativeColors.gray,
  primary: reptativeColors.primary,
  primary1: reptativeColors.primary1,
  primary2: reptativeColors.primary2,
  primary3: reptativeColors.primary3,
  secondary: reptativeColors.secondary,
  secondary3: reptativeColors.secondary3,
  red: reptativeColors.red,
  orange: reptativeColors.orange,
  yellow: reptativeColors.yellow,
  green: reptativeColors.green,
  errorText: reptativeColors.errorText,
  dotcolor: reptativeColors.dotColor,
  bannerBg1: reptativeColors.bannerBg1,
  itemClose: reptativeColors.itemClose,
  itemDec: reptativeColors.itemDec,
  dashBorder: reptativeColors.dashBorder,
  border: reptativeColors.border,
  favColor: reptativeColors.favColor,
  primarylow: reptativeColors.primarylow,
  primary2low: reptativeColors.primary2low,
  headerserachborder: reptativeColors.headerserachborder,
  addressbuttoncolor: reptativeColors.addressbuttoncolor,
  placeholderColorFixed: reptativeColors.placeholderColorFixed,
  locationIcon: reptativeColors.locationIcon,
  altProductColor: reptativeColors.altProductColor,
  altoffercolor: reptativeColors.altoffercolor,
  darkgreen: reptativeColors.darkgreen,

  paginationborder: reptativeColors.paginationborder,
  paginationselected: reptativeColors.paginationselected,

  placeholder:reptativeColors.placeholderColor,
  fieldborder:reptativeColors.fieldborder,
  bg:reptativeColors.bg,
  action:reptativeColors.action,
  tabBg: reptativeColors.tabBg, //extra
greenshade:reptativeColors.greenshade,
  cardborder:reptativeColors.cardborder,
  headerColor:reptativeColors.headerColor,
 

  //Header
  headerBg: reptativeColors.gray,
  headerIcon: reptativeColors.white,
  headerIconBg: 'rgba(39,39,39,1)',
  headerText: reptativeColors.white,
  tabHeader: reptativeColors.primary3,
  count: reptativeColors.red,
  searchHeaderBG: reptativeColors.searchHeaderBG,
  headerlist:reptativeColors.headerlist,

  background: reptativeColors?.lightGray,

  //Bottom Tab
  bottomTabBG1: reptativeColors.bottomTabBG1,
  bottomTabBg: reptativeColors.gray,
  bottomTabIcon: reptativeColors.white,
  bottomTabIconActive: reptativeColors.white,
  bottomTabActive: reptativeColors.white,
  bottomTabText: reptativeColors.white,
  bottomTabTextActive: reptativeColors.white,

  //Input
  inputBg: reptativeColors.white,
  inputLabel: reptativeColors.secondary3,
  inputValue: reptativeColors.black,
  inputText: reptativeColors.white,
  inputPlaceholder: reptativeColors.placeholderColor,
  inputDisable: reptativeColors.white,
  inputCursor: reptativeColors.black,
  inputBorder: reptativeColors.placeholderColor,
  suffix: reptativeColors.darkGray,
  preffix: reptativeColors.darkGray,

  //Dropdown
  ddArrow: reptativeColors.black,
  ddItemBg: reptativeColors.white,
  ddItemText: reptativeColors.white,
  ddItemBorder: reptativeColors.white,
  ddItemActive: reptativeColors.white,
  ddItemTextActive: reptativeColors.white,

  //Switch
  switchBg: reptativeColors.white,
  switchBgActive: reptativeColors.white,
  thumbColorSwitch: reptativeColors.white,
  thumbColorSwitchActive: reptativeColors.white,

  //Button
  btnBg: reptativeColors.primary,
  btnBg1: reptativeColors.primary,
  btnBg2: reptativeColors.secondary,
  btnText: reptativeColors.white,
  btnBorder: reptativeColors.black,
  btnIcon: reptativeColors.white,
  btnInactive: reptativeColors.gray,
  paymentButtonbg: reptativeColors.secondary2,

  //RadioButton
  radioBg: reptativeColors.primary1,

  //Modal
  modalHeaderBg: reptativeColors.darkGray,
  modalHeaderBg2: reptativeColors.darkGray,
  modalBg: reptativeColors.white,
  modalBorder: reptativeColors.white,

  //Card
  cardBg: reptativeColors.white,
  cardBorder: reptativeColors.black,
  darkCardBg: reptativeColors.black,
  cardHeaderBg: reptativeColors.card,
  cardHeaderBgLight: reptativeColors.lightGray,
  // cardBgStart: reptativeColors.cardBgStart,
  // cardBgEnd: reptativeColors.cardBgEnd,

  //Item
  itemBg: reptativeColors.itembg,
  itemBorder: reptativeColors.itemborder,
  itemText: reptativeColors.itemtextcolor,

  //Drawer
  sideMenuBg: reptativeColors.white,
  sideMenuItem: reptativeColors.white,
  sideMenuActive: reptativeColors.white,
  sideMenuIcon: reptativeColors.white,
  sideMenuIconActive: reptativeColors.white,
  sideMenuText: reptativeColors.white,
  sideMenuTextActive: reptativeColors.white,
  sideMenuBorder: reptativeColors.white,

  //Accordion
  accordionBg: reptativeColors.white,
  accordionBgActive: reptativeColors.white,
  accordionBorder: reptativeColors.white,
  accordionTitle: reptativeColors.white,
  accordionTitleActive: reptativeColors.white,

  //Chart
  splitLine: reptativeColors.darkGray,
  chartColor1: reptativeColors.red,
  chartColor2: reptativeColors.green,
  chartColor3: reptativeColors.orange,

  //skeletone
  skeletonHl: '#575454',
  skeletonBg: '#333131',

  muted: 'rgb(74,74,74)',
  Hard_White: '#fff',
  Hard_Black: '#000',
  goldenYellow: '#FFDF00',



};


//dark theme

export const darkColors: any = {
  gradient3: 'rgba(229, 75, 186, 0.4)',
  gradient4: 'rgba(243, 118, 124, 0.29)',
  gradient5: 'rgba(255, 151, 75, 0.2)',
  transparent: reptativeColors.transparent,
    label:reptativeColors.label,
  black: reptativeColors.white,
  white: reptativeColors.black,
  darkGray: reptativeColors.lightGray,
  darkGrayShades: reptativeColors.darkGrayShades,
  gray: reptativeColors.lightGray,
  primary: reptativeColors.primary,
  primary1: reptativeColors.primary1,
  primary2: reptativeColors.primary2,
  primary3: reptativeColors.primary3,
  secondary: reptativeColors.secondary,
  secondary3: reptativeColors.secondary3,
  greenshade:reptativeColors.greenshade,
   gridHeader:reptativeColors.gridHeader,
  red: reptativeColors.red,
  orange: reptativeColors.orange,
  yellow: reptativeColors.yellow,
  green: reptativeColors.green,
  tabBg: reptativeColors.tabBg, //extra
  errorText: reptativeColors.errorText,
   headerColor:reptativeColors.headerColor,
  bannerBg1: reptativeColors.bannerBg1,
  itemDec: reptativeColors.itemDec,
  dashBorder: reptativeColors.dashBorder,
  border: reptativeColors.darkGray,
  primarylow: reptativeColors.primarylow,
  primary2low: reptativeColors.primary2low,
  searchHeaderBG: reptativeColors.searchHeaderBG,
  altProductColor: reptativeColors.altProductColor,
  altoffercolor: reptativeColors.altoffercolor,
  placeholderColor: reptativeColors.placeholderColor,
  placeholderColorFixed: reptativeColors.placeholderColorFixed,
  background: reptativeColors?.black,
  dotcolor: reptativeColors.dotColor,
  gradient1: reptativeColors.gradient1, //extra
  gradient2: reptativeColors.gradient2, //extra
  favColor: reptativeColors.favColor,
  headerserachborder: reptativeColors.headerserachborder,
  addressbuttoncolor: reptativeColors.addressbuttoncolor,
  locationIcon: reptativeColors.locationIcon,
  //Header
  headerBg: reptativeColors.darkGray,
  headerIcon: reptativeColors.white,
  headerIconBg: 'rgba(39,39,39,1)',
  headerText: reptativeColors.white,
  tabHeader: reptativeColors.primary3,
  count: reptativeColors.red,
  itemClose: reptativeColors.itemClose,

  headerlist:reptativeColors.headerlist,

    placeholder:reptativeColors.placeholderColor,
  fieldborder:reptativeColors.fieldborder,
  bg:reptativeColors.bg,
  action:reptativeColors.action,

  //Bottom Tab
  bottomTabBG1: reptativeColors.darkGray,
  bottomTabBg: reptativeColors.darkGray,
  bottomTabIcon: reptativeColors.white,
  bottomTabIconBorder: reptativeColors.gray,
  bottomTabIconActive: reptativeColors.white,
  bottomTabActive: reptativeColors.white,
  bottomTabText: reptativeColors.white,
  bottomTabTextActive: reptativeColors.white,

  //Input
  inputBg: reptativeColors.white,
  inputLabel: reptativeColors.secondary3,
  inputValue: reptativeColors.white,
  inputText: reptativeColors.white,
  inputPlaceholder: reptativeColors.white,
  inputDisable: reptativeColors.white,
  inputCursor: reptativeColors.black,
  inputBorder: reptativeColors.inputBorder1,
  suffix: reptativeColors.gray,
  preffix: reptativeColors.gray,

  //Dropdown
  ddArrow: reptativeColors.black,
  ddItemBg: reptativeColors.innerCard,
  ddItemText: reptativeColors.white,
  ddItemBorder: reptativeColors.white,
  ddItemActive: reptativeColors.white,
  ddItemTextActive: reptativeColors.white,

  //Switch
  switchBg: reptativeColors.gray,
  switchBgActive: reptativeColors.green,
  thumbColorSwitch: reptativeColors.white,
  thumbColorSwitchActive: reptativeColors.white,

  //Button
  btnBg: reptativeColors.primary,
  btnBg1: reptativeColors.secondary,
  btnBg2: reptativeColors.primary1,
  btnBg3: reptativeColors.primary2,
  btnText: reptativeColors.white,
  btnText2: reptativeColors.black,
  btnBorder: reptativeColors.white,
  btnIcon: reptativeColors.white,
  btnInactive: reptativeColors.gray,
  paymentButtonbg: reptativeColors.secondary2,

  //RadioButton
  radioBg: reptativeColors.primary1,

  //Modal
  modalHeaderBg: reptativeColors.darkGray,
  modalHeaderBg2: reptativeColors.darkGray,
  modalBg: reptativeColors.darkGray,
  modalBorder: reptativeColors.darkGrayShades,

  //Card
  cardBg: reptativeColors.darkGray,
  cardBg1: reptativeColors.darkGrayShades,
  cardBg2: reptativeColors.innerCard,
  cardBorder: reptativeColors.darkGray,
  cardHeaderBg: reptativeColors.card,
  cardHeaderBgLight: reptativeColors.lightGray,

  //Item
  itemBg: reptativeColors.darkGray,
  itemBorder: reptativeColors.itemborder,
  itemText: reptativeColors.itemtextcolor,

  //Drawer
  sideMenuBg: reptativeColors.white,
  sideMenuItem: reptativeColors.white,
  sideMenuActive: reptativeColors.white,
  sideMenuIcon: reptativeColors.white,
  sideMenuIconActive: reptativeColors.white,
  sideMenuText: reptativeColors.white,
  sideMenuTextActive: reptativeColors.white,
  sideMenuBorder: reptativeColors.white,

  //Accordion
  accordionBg: reptativeColors.transparent,
  accordionBgActive: reptativeColors.transparent,
  accordionBorder: reptativeColors.white,
  accordionTitle: reptativeColors.white,
  accordionTitleActive: reptativeColors.white,

  //Chart
  splitLine: reptativeColors.darkGray,
  chartColor1: reptativeColors.red,
  chartColor2: reptativeColors.green,
  chartColor3: reptativeColors.orange,

  //skeletone
  skeletonHl: '#575454',
  skeletonBg: '#333131',

  muted: 'rgb(74,74,74)',
  Hard_White: '#fff',
  Hard_Black: '#000',
  goldenYellow: '#FFDF00',
};


// font family
const fontFamily = {
  regular: 'Montserrat-Regular',
  medium:'Montserrat-Medium',
 bold: 'Montserrat-SemiBold',
  semiBold : 'Montserrat-SemiBold'
};


const LARGE_DEVICE_SCALE = 1.3;

let fontSize: any = {
  XXXS: (0.85 * deviceHeight) / 100, // 7,
  XXS: (1 * deviceHeight) / 100, // 8,
  nanoSmall: (1.15 * deviceHeight) / 100, // 9,
  extraSmall: (1.25 * deviceHeight) / 100, //10,
  XMS: (1.35 * deviceHeight) / 100,//11,
  small:(1.5 * deviceHeight) / 100, // 12,
  middleSmall:(1.65 * deviceHeight) / 100, // 13,
  semiSmall: (1.75 * deviceHeight) / 100, //14,
  semiNormal: (1.85 * deviceHeight) / 100, //15,
  normal: (2 * deviceHeight) / 100, //16,
  medium: (2.25 * deviceHeight) / 100, // 18
  semiLarge: (2.50 * deviceHeight) / 100, // 20
  large: (2.75 * deviceHeight) / 100, // 22
  extraLarge: (3 * deviceHeight) / 100, // 24
  // extraLarge:  24,
  XL:(3.25 * deviceHeight) / 100, // 26,
  XXL: (3.5 * deviceHeight) / 100,// 28,
  XXXL: (3.75 * deviceHeight) / 100,// 30,
};

let fontSize1: any = {
  XXXS: 7,
  XXS: 8,
  nanoSmall: 9,
  extraSmall: 10,
  XMS: 11,
  small: 12,
  middleSmall: 13,
  semiSmall: 14,
  semiNormal: 15,
  normal: 16,
  medium: 18,
  semiLarge: 20,
  large:  22,
  extraLarge:  24,
  XL: 26,
  XXL: 28,
  XXXL: 30,
};

let lineHeight = {
  medium: 22,
  normal: 20,
  small: 16,
};

let borderSize = {
  large: 1,
  normal: 0.5,
  small: 0.25,
};

let borderRadius = {
  XXS: 2,
  XS: 3,
  small: 4,
  middleSmall: 5,
  semiSmall: 6,
  normal: 7,
  medium: 10,
  large: 20,
  ring: 100,
};

// step indicator
let stepIndicatorHeight = 407;
let indicatorStyles: any = {
  stepIndicatorSize: 16,
  currentStepIndicatorSize: 16,
  stepStrokeWidth: 2,
  currentStepStrokeWidth: 2,
  stepStrokeCurrentColor: colors.black,
  stepStrokeFinishedColor: colors.black,
  stepStrokeUnFinishedColor: colors.gray,
  separatorStrokeWidth: 1,
  separatorFinishedColor: colors.black,
  separatorUnFinishedColor: colors.gray,
  stepIndicatorFinishedColor: colors.black,
  stepIndicatorUnFinishedColor: colors.white,
  stepIndicatorCurrentColor: colors.black,
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 10,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelSize: 16,
  labelColor: 'rgb(200,200,200)',
  currentStepLabelColor: colors.black,
  subLabelColor: 'rgb(200,200,200)',
  currentStepSubLabelColor: colors.gray,
};

// login screen: bottom text
let bottomTxtHeight = 19;

if (deviceWidth >= 768) {
  fontSize = {
    XXXS: 7 * LARGE_DEVICE_SCALE,
    XXS: 8 * LARGE_DEVICE_SCALE,
    nanoSmall: 9 * LARGE_DEVICE_SCALE,
    extraSmall: 10 * LARGE_DEVICE_SCALE,
    XMS: 11 * LARGE_DEVICE_SCALE,
    small: 12 * LARGE_DEVICE_SCALE,
    middleSmall: 13 * LARGE_DEVICE_SCALE,
    semiSmall: 14 * LARGE_DEVICE_SCALE,
    semiNormal: 15 * LARGE_DEVICE_SCALE,
    normal: 16 * LARGE_DEVICE_SCALE,
    medium: 18 * LARGE_DEVICE_SCALE,
    semiLarge: 20 * LARGE_DEVICE_SCALE,
    large: 22 * LARGE_DEVICE_SCALE,
    sizeGuideTxt: 64 * LARGE_DEVICE_SCALE,
    starIc: 18 * LARGE_DEVICE_SCALE,
    tileHeader: 19 * LARGE_DEVICE_SCALE,
    addIc: 22 * LARGE_DEVICE_SCALE,
    extraLarge: 24 * LARGE_DEVICE_SCALE,
    XL: 26 * LARGE_DEVICE_SCALE,
    XXL: 28 * LARGE_DEVICE_SCALE,
    XXXL: 30 * LARGE_DEVICE_SCALE,
  };
  lineHeight = {
    medium: 22 * LARGE_DEVICE_SCALE,
    normal: 20 * LARGE_DEVICE_SCALE,
    small: 16 * LARGE_DEVICE_SCALE,
  };
  borderRadius = {
    XXS: 2 * LARGE_DEVICE_SCALE,
    XS: 3 * LARGE_DEVICE_SCALE,
    small: 4 * LARGE_DEVICE_SCALE,
    middleSmall: 5 * LARGE_DEVICE_SCALE,
    semiSmall: 6 * LARGE_DEVICE_SCALE,
    normal: 7 * LARGE_DEVICE_SCALE,
    medium: 10 * LARGE_DEVICE_SCALE,
    large: 20 * LARGE_DEVICE_SCALE,
    ring: 100 * LARGE_DEVICE_SCALE,
  };
  btnHeight = 48 * LARGE_DEVICE_SCALE;
  smallbtnHeight = 24 * LARGE_DEVICE_SCALE;
  inputHeight = 43 * LARGE_DEVICE_SCALE;
  scrollableTabHeight = 40 * LARGE_DEVICE_SCALE;
  indicatorStyles = {
    stepIndicatorSize: 16 * LARGE_DEVICE_SCALE,
    currentStepIndicatorSize: 16 * LARGE_DEVICE_SCALE,
    stepStrokeWidth: 2 * LARGE_DEVICE_SCALE,
    currentStepStrokeWidth: 2 * LARGE_DEVICE_SCALE,
    stepStrokeCurrentColor: colors.black,
    stepStrokeFinishedColor: colors.black,
    stepStrokeUnFinishedColor: colors.gray,
    separatorStrokeWidth: 1,
    separatorFinishedColor: colors.black,
    stepIndicatorUnFinishedColor: colors.white,
    stepIndicatorCurrentColor: colors.black,
    stepIndicatorLabelFontSize: 10 * LARGE_DEVICE_SCALE,
    currentStepIndicatorLabelFontSize: 10 * LARGE_DEVICE_SCALE,
    stepIndicatorLabelCurrentColor: 'transparent',
    stepIndicatorLabelFinishedColor: 'transparent',
    stepIndicatorLabelUnFinishedColor: 'transparent',
    labelSize: 16 * LARGE_DEVICE_SCALE,
    labelColor: 'rgb(200,200,200)',
    currentStepLabelColor: colors.black,
    subLabelColor: 'rgb(200,200,200)',
    currentStepSubLabelColor: colors.gray,
  };
  stepIndicatorHeight = 407 * LARGE_DEVICE_SCALE;
  bottomTxtHeight = 19 * LARGE_DEVICE_SCALE;
}

export {
  responsiveHeight,
  responsiveWidth,
  isIpad,
  btnWidth,
  btnHeight,
  smallbtnHeight,
  inputHeight,
  searchInputHeight,
  searchLineHeight,
  marginHorizontal,
  spaceVertical,
  scrollableTabHeight,
  NAV_HEIGHT,
  STATUSBAR_HEIGHT,
  deviceHeight,
  deviceWidth,
  colors,
  fontSize,
  fontFamily,
  lineHeight,
  borderRadius,
  borderSize,
  // step indicator
  indicatorStyles,
  stepIndicatorHeight,
  //bottom text of login screen
  bottomTxtHeight,
};
