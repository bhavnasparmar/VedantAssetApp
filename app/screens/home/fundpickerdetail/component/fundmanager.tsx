import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { getFundManagerDataApi } from '../../../../api/homeapi';
import { showToast, toastTypes } from '../../../../services/toastService';

interface FundManagerData {
  name: string;
  designation?: string;
  experience: string;
  joiningDate?: string;
  managingSince?: string;
  qualification?: string;
  initials?: string;
}

interface FundManagerComponentProps {
  schemeData?: any;
  schemeDetails?: any;
  isVisible?: boolean;
}

const FundManager: React.FC<FundManagerComponentProps> = ({ schemeData, schemeDetails, isVisible = false }) => {
  const { colors }: any = useContext(AppearanceContext);
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  const [isLoading, setIsLoading] = useState(false);
  const [fundManagers, setFundManagers] = useState<FundManagerData[]>([]);
  // Sample fund manager data (fallback)
  // const sampleFundManagers: FundManagerData[] = [
  //   {
  //     name: 'Chirag Setalvad',
  //     experience: '0 years',
  //     managingSince: 'June 2007',
  //     initials: 'CS'
  //   },
  //   {
  //     name: 'Dhruv Muchhal',
  //     experience: '1.62 years',
  //     managingSince: 'June 2023',
  //     initials: 'DM'
  //   }
  // ];

  // API call to fetch fund manager data
  const fetchFundManagerData = async () => {
    if (!schemeData) {
      console.log('No scheme data available for fund managers');
      // setFundManagers(sampleFundManagers);
      return;
    }
     console.log('Fund manager data payload:', schemeDetails);
    const payload = {
      schemeId: schemeDetails?.id,
      schemeISINNo: schemeDetails?.schemeISIN,
    };

    console.log('Fund manager data payload:', payload);

    try {
      setIsLoading(true);
      const response = await getFundManagerDataApi(payload);

      if (!response) {
        console.log('No response from fund manager API');
        // setFundManagers(sampleFundManagers);
        return;
      }

      const [result, error]: any = Array.isArray(response) ? response : [response, null];

      if (result && (result.data || result.success)) {
        console.log('Fund Manager Data:', result);
        const managersList = result.data || result.managers || [];

        // Validate and clean the managers data
        const validManagers = Array.isArray(managersList)
          ? managersList.filter(manager => manager && (manager.name || manager.managerName))
          : [];

        setFundManagers(managersList.length > 0 ? managersList : []);
        // console.log('Fund Manager Data:', validManagers);
      } else {
        console.error('Error fetching fund manager data:', error);
        // Use sample data as fallback
        // setFundManagers(sampleFundManagers);
        if (error) {
          showToast(toastTypes.error, (error as any)?.msg || 'Failed to fetch fund manager data');
        }
      }
    } catch (err) {
      console.error('Fund manager API error:', err);
      // Use sample data as fallback
      // setFundManagers(sampleFundManagers);
      showToast(toastTypes.error, 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('FundManager useEffect - schemeData:', schemeData, 'isVisible:', isVisible);

    if (isVisible && schemeData && typeof schemeData === 'object') {
      fetchFundManagerData();
    } else if (isVisible) {
      console.log('Using sample fund manager data - no valid scheme data');
      // setFundManagers(sampleFundManagers);
    }
  }, [schemeData, isVisible]);

  // Generate initials from name
  const generateInitials = (name: string | undefined | null): string => {
    if (!name || typeof name !== 'string') {
      return 'FM'; // Default initials for Fund Manager
    }

    return name
      .trim()
      .split(' ')
      .filter(word => word.length > 0) // Filter out empty strings
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2) || 'FM'; // Fallback to 'FM' if no valid initials
  };

  // Format date to "Month Year" format
  const formatDateToMonthYear = (dateString: string | undefined | null): string => {
    if (!dateString || dateString === 'N/A' || dateString === 'NULL') {
      return 'N/A';
    }

    try {
      // Handle different date formats
      let date: Date;

      // If it's already in "Month Year" format, return as is
      if (/^[A-Za-z]+ \d{4}$/.test(dateString.trim())) {
        return dateString.trim();
      }

      // Try to parse various date formats
      if (dateString.includes('/')) {
        // Handle formats like "MM/DD/YYYY" or "DD/MM/YYYY"
        date = new Date(dateString);
      } else if (dateString.includes('-')) {
        // Handle formats like "YYYY-MM-DD"
        date = new Date(dateString);
      } else {
        // Try direct parsing
        date = new Date(dateString);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if can't parse
      }

      // Format to "Month Year"
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${month} ${year}`;
    } catch (error) {
      console.log('Date parsing error:', error);
      return dateString || 'N/A'; // Return original string if parsing fails
    }
  };

  // Sample fund manager data (old format)
  const oldFundManagers: any[] = [
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

  // Render individual fund manager item
  const renderFundManagerItem = ({ item, index }: any) => {
    if (!item || typeof item !== 'object') {
      return null;
    }

    const manager: any = item as FundManagerData;
    const managerName = manager?.FundManagersMaster?.manager_name;
    const experience = (manager?.FundManagersMaster?.manager_exp && manager?.FundManagersMaster?.manager_exp !== 'NULL') ? manager?.FundManagersMaster?.manager_exp + ' years' : '0 years';
    console.log('experience:', experience);
    const rawManagingSince = manager.manager_startdate || manager.joiningDate || 'N/A';
    const managingSince = formatDateToMonthYear(rawManagingSince);

    const initials = manager.initials || generateInitials(managerName);
    const avatarColors = ['#FFE4B5', '#E6F3FF', '#F0E6FF', '#E6FFE6', '#FFE6E6'];
    const avatarColor = avatarColors[index % avatarColors.length];

    return (
      <View style={additionalStyles.managerItem}>
        {/* Avatar with initials */}
        <View style={[additionalStyles.avatar, { backgroundColor: avatarColor }]}>
          <CusText
            text={initials}
            size="M"
            color={colors.black}
            bold
          />
        </View>

        {/* Manager Info */}
        <View style={additionalStyles.managerInfo}>
          <CusText
            text={managerName}
            size="M"
            color={colors.black}
            bold
            numberOfLines={1}
          />
          <CusText
            text={`Experience: ${experience} | Managing since: ${managingSince}`}
            size="S"
            color={colors.gray}
            customStyles={{ marginTop: responsiveWidth(1) }}
            numberOfLines={1}
          />
        </View>
      </View>
    );
  };

  // Render a single fund manager card (old format)
  const renderOldFundManagerCard = (manager: any, index: number) => (
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
  const PeriodButton = ({ period }: any) => (
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
  // Show loading state
  if (isLoading) {
    return (
      <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(20) }}>
        <ActivityIndicator size="large" color={colors.primary1} />
        <CusText text="Loading fund manager data..." size="S" color={colors.gray} customStyles={{ marginTop: responsiveWidth(2) }} />
      </Wrapper>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Fund Managers Header */}
      <Wrapper customStyles={additionalStyles.managersContainer}>
        <Wrapper customStyles={{ marginBottom: responsiveWidth(4) }}>
          <CusText
            text="Fund Managers"
            size="L"
            color={colors.black}
            bold
          />
        </Wrapper>

        {/* Fund Managers List */}
        <FlatList
          data={fundManagers}
          renderItem={renderFundManagerItem}
          keyExtractor={(item, index) => item.name || index.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: responsiveWidth(4) }}
          ListEmptyComponent={
            <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
              <CusText text="No fund manager data available" size="S" color={colors.gray} />
            </Wrapper>
          }
        />
      </Wrapper>

      <Spacer y="L" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Hard_white,
    width: responsiveWidth(100)
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

// Additional styles for new design
const additionalStyles = StyleSheet.create({
  managersContainer: {
    backgroundColor: colors.Hard_White,
    borderRadius: borderRadius.medium,
    padding: responsiveWidth(4),
    marginVertical: responsiveWidth(2),
    marginHorizontal: responsiveWidth(4),
  },
  managerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: colors.fieldborder,
  },
  avatar: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(4),
  },
  managerInfo: {
    flex: 1,
  },
});

export default FundManager;