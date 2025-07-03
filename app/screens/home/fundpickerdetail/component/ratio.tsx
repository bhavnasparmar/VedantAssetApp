import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, colors, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import IonIcon from 'react-native-vector-icons/Ionicons';

interface RatioItemProps {
  title: string;
  value: string;
  hasInfo?: boolean;
}

const Ratio = () => {
  const { colors }: any = useContext(AppearanceContext);
  
  // Sample ratio data
  const ratioData: RatioItemProps[] = [
    { title: 'Standard Deviation', value: '0.0426', hasInfo: true },
    { title: 'Beta', value: '0.2637', hasInfo: true },
    { title: 'Alpha', value: '0.4395', hasInfo: true },
    { title: 'Treynor Ratio', value: '0.5987', hasInfo: true },
    { title: 'Sharpe Ratio', value: '1.3456', hasInfo: true },
    { title: 'Sortino Ratio', value: '1.2312', hasInfo: true },
  ];

  // Render a single ratio item
  const renderRatioItem = (item: RatioItemProps, index: number) => (
    <View 
      key={index}
      style={[
        styles.ratioItem,
        index === ratioData.length - 1 && { borderBottomWidth: 0 }
      ]}
    >
      <Wrapper row align="center">
        <CusText
          text={item.title}
          size="N"
          color={colors.black}
        />
        {item.hasInfo && (
          <TouchableOpacity style={styles.infoButton}>
            <IonIcon
              name="information-circle-outline"
              size={responsiveWidth(5)}
              color={colors.gray}
            />
          </TouchableOpacity>
        )}
      </Wrapper>
      <CusText
        text={item.value}
        size="N"
        color={colors.black}
        bold
      />
    </View>
  );

  // Render the scheme header
  const renderSchemeHeader = () => (
    <Wrapper customStyles={styles.schemeHeader}>
      <Wrapper row justify="apart" align="center">
        <CusText
          text="Ratio"
          size="N"
          color={colors.black}
          bold
        />
        <CusText
          text="Scheme"
          size="N"
          color={colors.black}
          bold
        />
      </Wrapper>
    </Wrapper>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Scheme header */}
      {renderSchemeHeader()}
      
      <Spacer y="S" />
      
      {/* Ratio items */}
      <Wrapper customStyles={styles.ratioContainer}>
        {ratioData.map((item, index) => renderRatioItem(item, index))}
      </Wrapper>
      
      <Spacer y="L" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Hard_white,
    padding: responsiveWidth(4),
    width:responsiveWidth(100)
  },
  schemeHeader: {
    backgroundColor: colors.Hard_White,
    borderRadius: borderRadius.medium,
    padding: responsiveWidth(4),
  },
  ratioContainer: {
    backgroundColor: colors.Hard_White,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
  },
  ratioItem: {
    paddingVertical: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.cardborder,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
  },
  infoButton: {
    marginLeft: responsiveWidth(2),
    padding: responsiveWidth(1),
  },
  tabContainer: {
    backgroundColor: colors.Hard_White,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.cardborder,
    marginBottom: responsiveWidth(4),
  },
  tabIndicator: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2),
    borderRadius: borderRadius.small,
  },
  activeTabIndicator: {
    backgroundColor: colors.orange,
  },
});

export default Ratio;