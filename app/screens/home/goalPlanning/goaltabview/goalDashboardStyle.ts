import {StyleSheet} from 'react-native';
import {
  borderRadius,
  colors,
  responsiveHeight,
  responsiveWidth,
} from '../../../../styles/variables';

export const styles = StyleSheet.create({
  button: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    borderColor: colors.primary,
    padding: 10,
    borderRadius: borderRadius.ring,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveWidth(2),
  },

  buttonongoing: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderColor: colors.primary,
    padding: 10,
    borderRadius: borderRadius.ring,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveWidth(2),
  },

  flatliststyles: {
    width: responsiveWidth(20),
  },
  flatlistImage: {
    height: responsiveHeight(15),
    width: responsiveWidth(15),
  },
  card: {
      backgroundColor: colors.darkGray,
      // backgroundColor: colors.red,
      width: responsiveWidth(50),
      padding: responsiveWidth(2),
      borderBottomLeftRadius: responsiveWidth(2)
  },
  slider: {
    width: responsiveWidth(50),
    height: 20,
    position: 'relative',
    zIndex: 1,
  },
  sectralfield: {
    borderColor: colors.Hard_White,
    borderWidth: 0.5,
    borderRadius: borderRadius.ring,
    padding: 5,
    paddingHorizontal: responsiveWidth(2),
    marginRight: responsiveWidth(2),
  },
  changebtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(1),
  },
  riskfield: {
    borderColor: '#E59F39',
    borderWidth: 0.5,
    borderRadius: borderRadius.ring,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(1),
    marginLeft: responsiveWidth(4),
  },
  gender: {
    width: responsiveWidth(25),
    borderRadius: borderRadius.medium,
    padding: 2,
    marginHorizontal: responsiveWidth(2),
  },
  option: {
    borderRadius: borderRadius.medium,
    backgroundColor: colors.cardBg,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: responsiveWidth(3),
    paddingBottom: responsiveWidth(3),
  },
  checkmarkIcon: {
    marginRight: responsiveWidth(3),
    marginTop: responsiveWidth(2),
  },
  detailcard: {
    width: responsiveWidth(85),
    borderColor: colors.grayShades2,
    borderWidth: 0.3,
    borderRadius: borderRadius.medium,
  },
  innerdetail: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1),
  },
  newGoalcard: {
    borderWidth : 2,
    borderColor : colors.lightGray,
    width: responsiveWidth(40),
    backgroundColor:colors.white,
    padding: responsiveWidth(4),
    borderRadius: 10,
    alignItems: 'center',
    //elevation: 2,
  },
  image: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowCard: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});
