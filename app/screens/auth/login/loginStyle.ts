import {StyleSheet} from 'react-native';
import { borderRadius, colors, fontSize, responsiveWidth } from '../../../styles/variables';
const styles = StyleSheet.create({
    subtitle:{
        width:responsiveWidth(90)
    },
      tabBar: {
    flexDirection: 'row',
    // backgroundColor: '#f4f4f4',
    backgroundColor: colors.background,
 //   borderWidth:1,
    borderRadius: borderRadius.middleSmall,
    overflow: 'hidden',
    marginBottom: 20,
    width:responsiveWidth(60),
    alignSelf:'center',
    padding:responsiveWidth(2),
  //  borderColor:colors.orange
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    // borderBottomWidth: 3,
    // borderBottomColor: '#f58220',
   borderRadius:borderRadius.middleSmall,
    backgroundColor: colors.Hard_White,
  },
  activeTab1: {
    // borderBottomWidth: 3,
    // borderBottomColor: '#f58220',
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
    backgroundColor: colors.Hard_White,
    opacity:1
  },
  tabText: {
    color: '#888',
    fontWeight: '700',
    fontSize:fontSize.semiSmall
  },
  activeTabText: {
    color: '#f58220',
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export {styles};
