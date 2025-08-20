import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, colors, responsiveHeight, responsiveWidth } from "../../../../styles/variables";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { getRatioSchemeDataApi } from '../../../../api/homeapi';
import { showToast, toastTypes } from '../../../../services/toastService';

interface RatioItemProps {
  title: string;
  value: string;
  hasInfo?: boolean;
}

interface RatioComponentProps {
  schemeData?: any;
  schemeDetails?: any;
  isVisible?: boolean;
}

const Ratio: React.FC<RatioComponentProps> = ({ schemeData, schemeDetails, isVisible = false }) => {
  const { colors }: any = useContext(AppearanceContext);
  const [isLoading, setIsLoading] = useState(false);
  const [ratioData, setRatioData] = useState<RatioItemProps[]>([]);

  // Sample ratio data (fallback) - matching the UI format
  // const sampleRatioData: RatioItemProps[] = [
  //   { title: 'Expense Ratio', value: '1.40%', hasInfo: true },
  //   { title: 'Tracking Error', value: '3.69%', hasInfo: true },
  //   { title: 'Beta', value: '0.88', hasInfo: true },
  //   { title: 'Sharpe Ratio', value: '1.07', hasInfo: true },
  //   { title: 'Alpha', value: '4.34%', hasInfo: true },
  //   { title: 'Standard Deviation', value: '15.53%', hasInfo: true },
  // ];

  // API call to fetch ratio data
  const fetchRatioData = async () => {
    if (!schemeData) {
      console.log('No scheme data available for ratios');
      // setRatioData(sampleRatioData);
      return;
    }

    const payload = {
      schemeId: schemeDetails?.id,
      schemeISINNo: schemeDetails?.schemeISIN
    };

    console.log('Ratio data payload:', payload);

    try {
      setIsLoading(true);
      const response = await getRatioSchemeDataApi(payload);

      if (!response) {
        console.log('No response from ratio API');
        // setRatioData(sampleRatioData);
        return;
      }

      const [result, error]: any = Array.isArray(response) ? response : [response, null];

      if (result && (result.data || result.success)) {
        const ratiosList = result.data || result.ratios || {};

        // Convert API response to RatioItemProps format
        const formattedRatios = formatRatioData(ratiosList);
        setRatioData(formattedRatios.length > 0 ? formattedRatios : []);
        console.log('Ratio Data:', ratiosList);
      } else {
        console.error('Error fetching ratio data:', error);
        // Use sample data as fallback
        // setRatioData(sampleRatioData);
        if (error) {
          showToast(toastTypes.error, (error as any)?.msg || 'Failed to fetch ratio data');
        }
      }
    } catch (err) {
      console.error('Ratio API error:', err);
      // Use sample data as fallback
      // setRatioData(sampleRatioData);
      showToast(toastTypes.error, 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to safely format numbers
  const safeFormatNumber = (value: any, decimals: number = 2): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '--';
    }
    return Number(value).toFixed(decimals);
  };

  // Format API response to RatioItemProps format
  const formatRatioData = (apiData: any): RatioItemProps[] => {
    if (!apiData || typeof apiData !== 'object') {
      return [];
    }

    const ratios: RatioItemProps[] = [];

    // Map API fields to ratio items based on the actual response structure
    // Using 3-year data as default, similar to the UI shown

    // Always show these ratios, even if data is not available

    // Expense Ratio (if available in API response)
    ratios.push({
      title: 'Expense Ratio',
      value: `${safeFormatNumber(apiData.ExpenseRatio)}%`,
      hasInfo: true
    });

    // Tracking Error (3 Year)
    ratios.push({
      title: 'Tracking Error',
      value: `${safeFormatNumber(apiData.TrackingError3Yr)}%`,
      hasInfo: true
    });

    // Beta (3 Year)
    ratios.push({
      title: 'Beta',
      value: safeFormatNumber(apiData.Beta3Yr),
      hasInfo: true
    });

    // Sharpe Ratio (3 Year)
    ratios.push({
      title: 'Sharpe Ratio',
      value: safeFormatNumber(apiData.SharpeRatio3Yr),
      hasInfo: true
    });

    // Alpha (3 Year)
    ratios.push({
      title: 'Alpha',
      value: `${safeFormatNumber(apiData.Alpha3Yr)}%`,
      hasInfo: true
    });

    // Standard Deviation (3 Year)
    ratios.push({
      title: 'Standard Deviation',
      value: `${safeFormatNumber(apiData.StandardDeviation3Yr)}%`,
      hasInfo: true
    });

    // Additional ratios (commented out to show only main 6 ratios)
    // Uncomment these if you want to show more ratios

    // // Sortino Ratio (3 Year)
    // ratios.push({
    //   title: 'Sortino Ratio',
    //   value: safeFormatNumber(apiData.SortinoRatio3Yr),
    //   hasInfo: true
    // });

    // // Treynor Ratio (3 Year)
    // ratios.push({
    //   title: 'Treynor Ratio',
    //   value: safeFormatNumber(apiData.Treynor3Yr),
    //   hasInfo: true
    // });

    // // R-Squared (3 Year)
    // ratios.push({
    //   title: 'R-Squared',
    //   value: `${safeFormatNumber(apiData.RSquared3Yr)}%`,
    //   hasInfo: true
    // });

    return ratios;
  };

  useEffect(() => {
    console.log('Ratio useEffect - schemeData:', schemeData, 'isVisible:', isVisible);

    if (isVisible && schemeData && typeof schemeData === 'object') {
      fetchRatioData();
    } else if (isVisible) {
      console.log('Using sample ratio data - no valid scheme data');
      // setRatioData(sampleRatioData);
    }
  }, [schemeData, isVisible]);

  // Render a single ratio item in grid format
  const renderRatioItem = (item: RatioItemProps, index: number) => (
    <View key={index} style={additionalStyles.ratioGridItem}>
      <View style={additionalStyles.ratioCard}>
        <CusText
          text={item.title}
          size="M"
          color={colors.black}
          customStyles={{ marginBottom: responsiveWidth(2) }}
        />
        <CusText
          text={item.value}
          size="XXL"
          color="#4A90E2"
          bold
          customStyles={{ marginBottom: responsiveWidth(1) }}
        />
        <CusText
          text={getRatioSubtitle(item.title)}
          size="S"
          color={colors.gray}
        />
      </View>
    </View>
  );

  // Get subtitle for each ratio
  const getRatioSubtitle = (title: string): string => {
    switch (title) {
      case 'Expense Ratio':
        return 'Annual';
      case 'Tracking Error':
        return 'Annualized';
      case 'Beta':
        return 'vs Benchmark';
      case 'Sharpe Ratio':
        return '3 Year';
      case 'Alpha':
        return '3 Year';
      case 'Standard Deviation':
        return '3 Year';
      default:
        return '3 Year';
    }
  };

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

  // Show loading state
  if (isLoading) {
    return (
      <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(20) }}>
        <ActivityIndicator size="large" color={colors.primary1} />
        <CusText text="Loading ratio data..." size="S" color={colors.gray} customStyles={{ marginTop: responsiveWidth(2) }} />
      </Wrapper>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Ratio items in grid layout */}
      <View style={additionalStyles.ratioGridContainer}>
        {ratioData.length > 0 ? (
          ratioData.map((item, index) => renderRatioItem(item, index))
        ) : (
          <Wrapper align="center" justify="center" customStyles={{ paddingVertical: responsiveWidth(10) }}>
            <CusText text="No ratio data available" size="S" color={colors.gray} />
          </Wrapper>
        )}
      </View>

      <Spacer y="L" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Hard_white,
    padding: responsiveWidth(4),
    width: responsiveWidth(100)
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
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
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

// Additional styles for grid layout
const additionalStyles = StyleSheet.create({
  ratioGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(4),
  },
  ratioGridItem: {
    width: '48%',
    marginBottom: responsiveWidth(4),
  },
  ratioCard: {
    backgroundColor: colors.Hard_White,
    borderRadius: borderRadius.medium,
    padding: responsiveWidth(4),
    minHeight: responsiveWidth(25),
    justifyContent: 'space-between',
  },
});

export default Ratio;