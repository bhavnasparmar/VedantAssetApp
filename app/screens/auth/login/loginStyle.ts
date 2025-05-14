import {StyleSheet} from 'react-native';
import { responsiveWidth } from '../../../styles/variables';
const styles = StyleSheet.create({
    subtitle:{
        width:responsiveWidth(90)
    },
      tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    width:responsiveWidth(60),
    alignSelf:'center'
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#f58220',
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#888',
    fontWeight: '600',
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
