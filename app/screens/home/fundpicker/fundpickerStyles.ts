import {StyleSheet} from 'react-native';
import {
  borderRadius,
  colors,
  marginHorizontal,
  responsiveHeight,
  responsiveWidth,
} from '../../../styles/variables';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    width: responsiveWidth(95),
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(3),
    alignSelf: 'center',
  },
  innercard: {
    backgroundColor: colors.cardBg,
    width: responsiveWidth(90),
    borderRadius: borderRadius.medium,
    marginBottom: responsiveWidth(3),
    alignSelf: 'center',
    paddingHorizontal: responsiveWidth(3),
    // paddingBottom: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.5),
  },

  checkboxText: {
    // marginTop: 3,
    // marginLeft: 6
  },
  maincard: {
    // backgroundColor: colors.cardBg2,
    width: responsiveWidth(95),
    borderRadius: borderRadius.medium,
    marginBottom: responsiveWidth(3),
    alignSelf: 'center',
    paddingHorizontal: responsiveWidth(3),
    paddingBottom: responsiveWidth(3),

    // paddingVertical:responsiveHeight(2)
  },
  maincardsearch: {
    backgroundColor: colors.cardBg2,
    width: responsiveWidth(95),
    borderRadius: borderRadius.medium,
    marginBottom: responsiveWidth(3),
    alignSelf: 'center',
    paddingHorizontal: responsiveWidth(3),
    paddingBottom: responsiveWidth(3),
    zIndex: 1,
    // paddingVertical:responsiveHeight(2)
  },
  modal: {
    position: 'absolute',
    right: 0,
    top: responsiveWidth(10),
    backgroundColor: colors.cardBg2,
    width: responsiveWidth(45),
    borderRadius: borderRadius.medium,
    // marginBottom: responsiveWidth(3),
    alignSelf: 'center',
    paddingHorizontal: responsiveWidth(3),
    paddingBottom: responsiveWidth(3),
    // paddingVertical:responsiveHeight(2)
  },
  searchcard: {
    backgroundColor: colors.cardBg,
    width: responsiveWidth(95),
    borderRadius: responsiveWidth(4),
    alignSelf: 'center',
    // borderBottomWidth:0.5,
    // borderColor:colors.gray,
    paddingHorizontal: responsiveWidth(2),
    paddingBottom: responsiveWidth(3),
    marginBottom: responsiveWidth(3),
  },
  filterbutton: {
    width: responsiveWidth(13),
    height: responsiveWidth(12),
    borderRadius: borderRadius.medium,
    marginTop: marginHorizontal.extraSmall,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: responsiveHeight(12),
    width: responsiveWidth(12),
  },
  button: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: borderRadius.ring,
    // marginTop: responsiveWidth(5),
    backgroundColor: colors.secondary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectralfield: {
    borderColor: colors.Hard_White,
    borderWidth: 0.5,
    borderRadius: borderRadius.normal,
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginRight: responsiveWidth(4),
  },
  chartimage: {
    height: responsiveHeight(10),
    width: responsiveWidth(50),
    resizeMode: 'contain',
  },
  personIcon: {
    marginRight: responsiveWidth(1),
  },
  saprator: {
    width: responsiveWidth(50),
    alignSelf: 'center',
    backgroundColor: colors.Hard_White,
    borderWidth: 0.5,
  },
  radioCircle: {
    height: 15,
    width: 15,
    borderRadius: borderRadius.ring,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(1),
  },
  label: {
    opacity: 0.6,
  },
  value: {
    marginVertical: 5,
    alignItems: 'center',
  },
  // panel: {
  //     position: 'absolute',
  //     left: 0,
  //     right: 0,
  //     bottom: 0,
  //     height: 300,
  //     backgroundColor: 'white',
  //     padding: 20,
  //     borderTopLeftRadius: 20,
  //     borderTopRightRadius: 20,
  //     shadowColor: '#000',
  //     shadowOffset: {
  //         width: 0,
  //         height: -2,
  //     },
  //     shadowOpacity: 0.25,
  //     shadowRadius: 4,
  //     elevation: 5,
  // },
  panel: {
    borderRadius: borderRadius.medium,
    backgroundColor: colors.bottomTabBg,
    width: responsiveWidth(95),
    // overflow: 'hidden',
    alignSelf: 'center',
    // marginBottom: responsiveWidth(-5),
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  //   scrollView: {
  //     flexGrow: 0,
  //     // marginHorizontal: 5,
  //   },
  item: {
    width: 100,
    marginHorizontal: 10 / 2,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonScroll: {
    padding: 10,
    backgroundColor: '#2ecc71',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  returnIcon: {
    borderRadius: borderRadius.ring,
    padding: responsiveWidth(0.5),
    fontWeight : 'bold'
  },
});
export {styles};
