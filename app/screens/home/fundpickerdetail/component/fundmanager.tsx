import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import IonIcon from 'react-native-vector-icons/Ionicons';

interface FundManagerProps {
  name: string;
  designation: string;
  experience: string;
  joiningDate: string;
  qualification: string;
}

const FundManager = () => {
  const { colors }: any = useContext(AppearanceContext);
   const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  // Sample fund manager data
  const fundManagers: FundManagerProps[] = [
    {
      name: 'Sankaran Naren',
      designation: 'Chief Investment Officer - Equity',
      experience: '31 Year Experience',
      joiningDate: 'Date Of Joining: 17 Dec 2004',
      qualification: 'B.Tech (IIT Madras), PGDM (IIM Calcutta)'
    },
    {
      name: 'Sankaran Naren',
      designation: 'Chief Investment Officer - Equity',
      experience: '31 Year Experience',
      joiningDate: 'Date Of Joining: 17 Dec 2004',
      qualification: 'B.Tech (IIT Madras), PGDM (IIM Calcutta)'
    },
    {
      name: 'Sankaran Naren',
      designation: 'Chief Investment Officer - Equity',
      experience: '31 Year Experience',
      joiningDate: 'Date Of Joining: 17 Dec 2004',
      qualification: 'B.Tech (IIT Madras), PGDM (IIM Calcutta)'
    }
  ];

  // Render a single fund manager card
  const renderFundManagerCard = (manager: FundManagerProps, index: number) => (
    <TouchableOpacity 
      key={index}
      style={[
        styles.managerCard,
        index === fundManagers.length - 1 && { borderBottomWidth: 0 }
      ]}
      activeOpacity={0.7}
    >
      <Wrapper customStyles={styles.managerInfo}>
        <CusText
          text={manager.name}
          size="M"
          color={colors.black}
          bold
          customStyles={styles.managerName}
        />
        <CusText
          text={manager.designation}
          size="S"
          color={colors.black}
          customStyles={styles.managerDesignation}
        />
        <CusText
          text={manager.experience}
          size="S"
          color={colors.black}
          customStyles={styles.managerExperience}
        />
        <CusText
          text={manager.joiningDate}
          size="S"
          color={colors.gray}
          customStyles={styles.managerJoiningDate}
        />
        <CusText
          text={manager.qualification}
          size="S"
          color={colors.gray}
          customStyles={styles.managerQualification}
        />
      </Wrapper>
      <Wrapper customStyles={styles.arrowContainer}>
        <IonIcon
          name="chevron-forward"
          size={responsiveWidth(5)}
          color={colors.gray}
        />
      </Wrapper>
    </TouchableOpacity>
  );
const PeriodButton = ({ period }:any) => (
        <TouchableOpacity 
            style={[
                styles.periodButton, 
                selectedPeriod === period && styles.selectedPeriodButton
            ]}
            onPress={() => setSelectedPeriod(period)}
        >
            <CusText 
                text={period} 
                color={selectedPeriod === period ? colors.white : colors.black} 
                size="S"
                bold={selectedPeriod === period}
            />
        </TouchableOpacity>
    );
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Tab indicator */}
     <Wrapper row customStyles={{ marginBottom: responsiveWidth(4),padding:responsiveWidth(4) }}>
                <PeriodButton period="1Y" />
                <Spacer x="XS" />
                <PeriodButton period="3Y" />
                <Spacer x="XS" />
                <PeriodButton period="5Y" />
                <Spacer x="XS" />
                <PeriodButton period="10Y" />
            </Wrapper>
            
      <Wrapper customStyles={styles.saprator}/>
      <Spacer y="S" />
      
      {/* Fund managers list */}
      <Wrapper customStyles={styles.managersContainer}>
        {fundManagers.map((manager, index) => renderFundManagerCard(manager, index))}
      </Wrapper>
      
      <Spacer y="L" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Hard_white,
    width:responsiveWidth(100)
  },
   periodButton: {
        paddingVertical: responsiveWidth(1.5),
        paddingHorizontal: responsiveWidth(3),
        borderRadius: borderRadius.small,
        backgroundColor: colors.cardborder
    },
    selectedPeriodButton: {
        backgroundColor: colors.secondary
    },
  tabContainer: {
    backgroundColor: colors.Hard_White,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.cardborder,
  },
  tabIndicator: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2),
    borderRadius: borderRadius.small,
  },
  activeTabIndicator: {
    backgroundColor: colors.orange,
  },
  managersContainer: {
    backgroundColor: colors.Hard_White,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
    marginHorizontal: responsiveWidth(4),
  },
  managerCard: {
    flexDirection: 'row',
    paddingVertical: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.cardborder,
  },
   saprator: {
        paddingHorizontal: responsiveWidth(2),
        backgroundColor: colors.headerlist,
        height: responsiveWidth(0.5),
       // marginVertical: responsiveWidth(2)
    },
  managerInfo: {
    flex: 1,
  },
  managerName: {
    marginBottom: responsiveWidth(1),
  },
  managerDesignation: {
    marginBottom: responsiveWidth(1),
  },
  managerExperience: {
    marginBottom: responsiveWidth(1),
  },
  managerJoiningDate: {
    marginBottom: responsiveWidth(1),
  },
  managerQualification: {
    marginBottom: responsiveWidth(1),
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(8),
  },
});

export default FundManager;