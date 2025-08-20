import {StyleSheet} from 'react-native';
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
  card: {
    backgroundColor: colors.cardBg,
    width: responsiveWidth(95),
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(3),
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  head: {
  //  height: 50,
  width:550,
    backgroundColor: '#f1f8ff',
  },
   scrollViewHeight: {
    height: 300, // Set vertical height to scroll the body
  },
  headText: {
    margin: 6,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rowText: {
    margin: 6,
    textAlign: 'center',
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
  tableContainer: {
    flex: 1,
    marginHorizontal: 10,
    // marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  swipebutton:{
  padding:responsiveWidth(1),
  marginVertical:responsiveWidth(1),
  marginHorizontal:responsiveWidth(1),
  borderRadius:borderRadius.small
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    // paddingVertical: 12,
    backgroundColor:  colors.fieldborder,
  },
  headerCell: {
    flex: 1,
    fontSize: fontSize.semiSmall,
    fontFamily:fontFamily.semiBold,
    color: colors.label,
    width:responsiveWidth(15),
    // paddingHorizontal: responsiveWidth(2),
  },
   
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  cell: {
    flex: 1,
    fontSize: fontSize.semiSmall,
    width:responsiveWidth(25),
    paddingHorizontal: responsiveWidth(3),
    justifyContent:'center',
  },
  filterCell: {
   width:responsiveWidth(45)
  },
  nameCell: {
   width:responsiveWidth(25)
  },
  fundName: {
    fontFamily:fontFamily.semiBold,
    marginBottom: 4,
  },
  fundCategory: {
    fontSize: 12,
    color: '#666',
  },
  starContainer: {
    flexDirection: 'row',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
});
export {styles};
