import { useIsFocused } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, { useCallback, useEffect,  useState } from 'react';
import {  FlatList, ScrollView, Text, View } from 'react-native';
import {
  getAmcApi,
  getCategoryWithSubCategoryApi,
  getFundPickerListDataApi,
  getNatureApi,
} from '../../../api/homeapi';
import { showToast, toastTypes } from '../../../services/toastService';
import Header from '../../../shared/components/Header/Header';
import {  colors, responsiveWidth } from '../../../styles/variables';
import InputField from '../../../ui/InputField';
import CusButton from '../../../ui/custom-button';
import CusText from '../../../ui/custom-text';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
import FundPickerFilter from './component/fundPickerFilter';
import { styles } from './fundpickerStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { convertToCrores, toFixedDataForReturn } from '../../../utils/Commanutils';
import moment from 'moment';

const FundPicker = () => {
  const isFocused: any = useIsFocused();
  const [isVisible, setIsVisible] = useState(false);
  const [fundPickerList, setfundPickerList] = useState<any[]>([]);
  const [search, setsearch] = useState<any>('');
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [natureList, setNatureList] = useState<any[]>([]);
  const [amcList, setAmcList] = useState<any>([]);
  const [filterObj, setFilterObj] = React.useState<any>({});
  const [loader, setloader] = React.useState<boolean>(false);
  const pagesize = 10;
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  //const [hasMoreData, setHasMoreData] = useState(true);
  const [funds, setFunds] = useState([
    { id: '1', name: 'HDFC Mid-Cap Opportunities Gr', category: 'Equity - Mid Cap', nav: '178.234', totalAum: '78201.08', stars: 5, return1Y: '41.86%', return3Y: '29.47%', return5Y: '33.39%', stdDev: '17.21%', date: '25/06/2023' },
    { id: '2', name: 'SBI Infrastructure Fund Gr', category: 'Equity - Sectoral Infrastructure', nav: '40.98', totalAum: '2770.33', stars: 3, return1Y: '17.77%', return3Y: '22.81%', return5Y: '29.34%', stdDev: '12.85%', date: '31/03/2023' },
    { id: '3', name: 'Invesco India Mid Cap Gr', category: 'Equity - Mid Cap', nav: '87.83', totalAum: '4680.96', stars: 4, return1Y: '1.97%', return3Y: '22.45%', return5Y: '31.28%', stdDev: '16.84%', date: '04/07/2007' },
    // Add more funds as needed
  ]);

  const debouncedGetFundPickerScheme = useCallback(
    debounce((text: string) => {
      // setPage(1);
      getFundPickerscheme(text, filterObj, 1);
    }, 500),
    [filterObj],
  );

  useEffect(() => {
    getFundPickerscheme(search);
    getCategories();
    getNatureList();
    getAmcList();
    return () => {
      // scrollIndex.current = 1;
      // setlistEnd(true);
    };
  }, [isFocused]);
  const onRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    getFundPickerscheme(search, filterObj, 1, true);
  };

  const getCategories = async () => {
    try {
      const [result, error]: any = await getCategoryWithSubCategoryApi();
      console.log('getCategoryWithSubCategoryApi result', result);
      if (result != null) {
        setCategoryData(result?.data);
      } else {
        console.log('getCategoryWithSubCategoryApi error', error);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getNatureList = async () => {
    try {
      const [result, error]: any = await getNatureApi();
      console.log('getNatureApi result', result);
      if (result != null) {
        setNatureList(result?.data);
      } else {
        console.log('getNatureApi error', error);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getAmcList = async () => {
    try {
      const [result, error]: any = await getAmcApi();
      console.log('getAmcList result', result);
      if (result != null) {
        setAmcList(result?.data);
      } else {
        console.log('getAmcList error', error);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const getFundPickerscheme = async (
    searchValue = '',
    filterVal: any = null,
    pageNumber = 1,
    isRefresh = false,
  ) => {
    try {
      // if (!isRefresh) setloader(true);
      setloader(true);
      let filter = {};
      if ((searchValue || '').trim() && filterVal) {
        filter = { name: searchValue.trim(), ...filterVal };
      } else if ((searchValue || '').trim()) {
        filter = { name: searchValue.trim() };
      } else if (filterVal) {
        filter = filterVal;
      }
      console.log("filter",filterVal)
      const payload = {
        page: pageNumber,
        limit: pagesize,
        filters: false,
        //sort: false,
        sort: { "SchemePerformances.Returns3yr": "DESC" },
        sort1: { "categoryid":filterVal?.categoryid
, "subcategory_id": filterVal?.subcategory_id
, "amc_id": filterVal?.amc_id
, "option_id":filterVal?.option_id}
      };
      console.log('payload', payload);
      const [result, error]: any = await getFundPickerListDataApi(payload);
      console.log('getFundPickerListDataApi=======', result.data.rows);
      if (result?.data?.rows) {
        const fetchedData = result.data.rows;
        setfundPickerList(prev => [...fetchedData]);
        setloader(false);
        // setHasMoreData(fetchedData.length === pagesize);
      } else {
        showToast(`${toastTypes.error}`, error?.msg || error?.[0]?.msg);
      }
    } catch (err) {
      setloader(false);
      console.log('Error fetching fund picker:', err);
    } finally {
      setloader(false);
      setIsRefreshing(false);
    }
  };
  // const loadMore = useCallback(() => {
  //   if (loader || !hasMoreData) return;

  //   const nextPage = page + 1;
  //   getFundPickerscheme(search, filterObj, nextPage);
  //   setPage(nextPage);
  // }, [loader, hasMoreData, page, search, filterObj]);

  const INRupees = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    currencySign: 'standard',
    maximumFractionDigits: 0,
  });
 
    const renderTableHeader = () => {
    return (
      <Wrapper customStyles={styles.headerRow}>
        <Wrapper row justify='apart' width={responsiveWidth(45)} customStyles={{paddingHorizontal: responsiveWidth(2)}}>
        <CusText style={styles.headerCell} size='MS' semibold text={'Scheme'} />
         <Ionicons name='swap-vertical-outline'/>
        </Wrapper>
        <Wrapper row justify='apart' width={responsiveWidth(25)} customStyles={{paddingHorizontal: responsiveWidth(2)}}>
        <CusText style={styles.headerCell} size='MS' semibold text={'Morning star'} />
         <Ionicons name='swap-vertical-outline'/>
        </Wrapper>
        {/* <Text style={[styles.headerCell, styles.nameCell]} >Morning star</Text> */}
        <Wrapper row justify='apart' width={responsiveWidth(20)} customStyles={{paddingHorizontal: responsiveWidth(2)}}>
        <CusText customStyles={styles.headerCell} text={'NAV'}/>
        <Ionicons name='swap-vertical-outline'/>
        </Wrapper>

         <Wrapper row justify='apart' width={responsiveWidth(20)} customStyles={{paddingHorizontal: responsiveWidth(2)}}>
          <CusText customStyles={styles.headerCell} text={'AUM (Cr.)'}/>
           <Ionicons name='swap-vertical-outline'/>
         </Wrapper>
         <Wrapper row justify='apart' width={responsiveWidth(20)} customStyles={{paddingHorizontal: responsiveWidth(2)}}>
        <CusText customStyles={styles.headerCell} text={'Exp. Ratio'}/>
         <Ionicons name='swap-vertical-outline'/>
        </Wrapper>
        <Wrapper row justify='apart' width={responsiveWidth(20)} customStyles={{paddingHorizontal: responsiveWidth(2)}}>
  <CusText customStyles={styles.headerCell} text={'1Y'}/>
   <Ionicons name='swap-vertical-outline'/>
        </Wrapper>
      <Wrapper row justify='apart' width={responsiveWidth(20)} customStyles={{paddingHorizontal: responsiveWidth(2)}}>
  <CusText customStyles={styles.headerCell} text={'3Y'}/>
   <Ionicons name='swap-vertical-outline'/>
        </Wrapper>
        <Wrapper row justify='apart' width={responsiveWidth(20)} customStyles={{paddingHorizontal: responsiveWidth(2)}}>
  <CusText customStyles={styles.headerCell} text={'5Y'}/>
   <Ionicons name='swap-vertical-outline'/>
        </Wrapper>
         <Wrapper row justify='apart' width={responsiveWidth(20)} customStyles={{paddingHorizontal: responsiveWidth(2)}}>
  <CusText customStyles={styles.headerCell} text={'Since Incep'}/>
   <Ionicons name='swap-vertical-outline'/>
        </Wrapper>
         <Wrapper row justify='apart' width={responsiveWidth(20)} customStyles={{paddingHorizontal: responsiveWidth(2)}}>
  <CusText customStyles={styles.headerCell} text={'Launch Date'}/>
   <Ionicons name='swap-vertical-outline'/>
        </Wrapper>
      </Wrapper>
    );
  };

  const renderItem = ({ item }: any) => {
    return (
      <>
        {/*    <Wrapper
          color={colors.cardBg}
          customStyles={{
            borderRadius: borderRadius.medium,
            marginHorizontal: responsiveWidth(1),
            paddingVertical: responsiveWidth(3),
          }}>
          <Wrapper
            row
            align="center"
            justify="apart"
            width={responsiveWidth(90)}>

            <Wrapper row>
              <Image
                style={{
                  resizeMode: 'contain',
                  height: responsiveWidth(22),
                  width: responsiveWidth(22),
                }}
                source={require('../../../assets/Images/bankImg.jpg')}
              />
              <Wrapper>
                <Wrapper
                  row
                  align="center"
                  customStyles={{
                    paddingHorizontal: responsiveWidth(1),
                    paddingVertical: responsiveWidth(0.5),
                  }}>
                  <Wrapper width={responsiveWidth(55)}>
                    <CusText
                      color={colors.primary}
                      customStyles={{marginLeft: responsiveWidth(1)}}
                      semibold
                      text={item?.name}
                      size="SS"
                    />
                  </Wrapper>
                </Wrapper>
                <Wrapper
                  row
                  align="center"
                  customStyles={{
                    paddingHorizontal: responsiveWidth(2),
                    paddingVertical: responsiveWidth(1),
                  }}>
                  <Wrapper
                    row
                    align="center"
                    customStyles={{
                      gap: responsiveWidth(1),
                    }}>
                    <Wrapper
                      row
                      align="center"
                      customStyles={{
                        borderWidth: 1,
                        paddingHorizontal: responsiveWidth(1),
                        paddingVertical: responsiveWidth(0.2),
                        borderRadius: borderRadius.small,
                      }}>
                      <CusText
                        text={item?.SchemeCategory?.Name}
                        size="XS"
                        color={colors.black}
                      />
                      <CusText text={'-'} size="XS" color={colors.black} />
                      <CusText
                        text={item?.SchemeSubcategory?.Name}
                        size="XS"
                        color={colors.black}
                      />
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
                <Wrapper
                  row
                  align="center"
                  customStyles={{
                    gap: responsiveWidth(5),
                    paddingHorizontal: responsiveWidth(2),
                    paddingVertical: responsiveWidth(1),
                  }}>
                  <Wrapper
                    row
                    align="center"
                    customStyles={{gap: responsiveWidth(1)}}>
                    <IonIcon
                      name="calendar-outline"
                      color={colors.gray}
                      size={responsiveWidth(3)}
                    />
                    <CusText
                      text={
                        item?.inception_date
                          ? moment(item?.inception_date).format('DD-MM-yyyy')
                          : '-'
                      }
                      size="S"
                      color={colors.gray}
                    />
                  </Wrapper>
                  <Wrapper align="center" row>
                    {(item?.SchemePerformances.length
                      ? item?.SchemePerformances[0]?.OverallRating
                      : 0) && (
                      <CusText
                        text={
                          item?.SchemePerformances.length
                            ? item?.SchemePerformances[0]?.OverallRating
                            : 0
                        }
                        size="S"
                        color={colors.gray}
                      />
                    )}
                    {(item?.SchemePerformances.length
                      ? item?.SchemePerformances[0]?.OverallRating
                      : 0) && (
                      <IonIcon
                        name="star"
                        size={responsiveWidth(3)}
                        color={'#F9BD36'}
                      />
                    )}
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <TouchableOpacity onPress={()=>{navigation.navigate('Cart')}}>
              
              <LinearGradient
                style={{
                  borderRadius: borderRadius.ring,
                  padding: responsiveWidth(1),
                }}
                
                start={{x: 1, y: 0}}
                end={{x: 0, y: 1}}
                colors={['#FF974BCC', '#E54BBACC']}>
                <IonIcon
                  name="add-outline"
                  color={colors.Hard_White}
                  size={responsiveWidth(6)}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Wrapper>

          <Wrapper>
            <LinearGradient
              start={{x: 1, y: 0}}
              end={{x: 0, y: 1}}
              colors={[colors.transparent, colors.primary, colors.transparent]}
              style={{width: '100%', height: 2, opacity: 0.5}}></LinearGradient>
          </Wrapper>
          <Spacer y="XS" />
          <Wrapper
            position="center"
            row
            align="center"
            justify="apart"
            width={responsiveWidth(85)}>
            <Wrapper align="center">
              <CusText
                extraBold
                text={'Return (1 Yr.)'}
                size="S"
                color={colors.gray}
              />
              <Wrapper
                row
                align="center"
                customStyles={{gap: responsiveWidth(1)}}>
                {toFixedDataForReturn(
                  item?.SchemePerformances?.[0]?.Return1yr,
                ) !== '--' && (
                  <IonIcon
                    style={[
                      {
                        backgroundColor: showArraow(
                          item?.SchemePerformances?.[0]?.Return1yr,
                          item?.SchemePerformances?.[0]?.CategoryAvgReturn1yr,
                        ),
                      },
                      styles.returnIcon,
                    ]}
                    name="arrow-up"
                    color={
                      showArraow(
                        item?.SchemePerformances?.[0]?.Return1yr,
                        item?.SchemePerformances?.[0]?.CategoryAvgReturn1yr,
                      ) == '#ffff00'
                        ? colors.black
                        : colors.white
                    }
                    size={responsiveWidth(3)}
                  />
                )}

                <CusText
                  semibold
                  color={colors.gray}
                  text={toFixedDataForReturn(
                    item?.SchemePerformances?.[0]?.Return1yr,
                  )}
                  size="N"
                />
              </Wrapper>
              <Spacer y="XS" />
              <CusText
                extraBold
                text={'Return (5 Yr.)'}
                size="S"
                color={colors.gray}
              />
              <Wrapper
                row
                align="center"
                customStyles={{gap: responsiveWidth(1)}}>
                <IonIcon
                  style={[
                    {
                      backgroundColor: showArraow(
                        item?.SchemePerformances?.[0]?.Returns5yr,
                        item?.SchemePerformances?.[0]?.CategoryAvgReturns5yr,
                      ),
                    },
                    styles.returnIcon,
                  ]}
                  name="arrow-up-outline"
                  color={
                    showArraow(
                      item?.SchemePerformances?.[0]?.Returns5yr,
                      item?.SchemePerformances?.[0]?.CategoryAvgReturns5yr,
                    ) == '#ffff00'
                      ? colors.black
                      : colors.white
                  }
                  size={responsiveWidth(3)}
                />

                <CusText
                  semibold
                  color={colors.gray}
                  text={toFixedDataForReturn(
                    item?.SchemePerformances?.[0]?.Returns5yr,
                  )}
                  size="N"
                />
              </Wrapper>
            </Wrapper>
            <Wrapper align="center">
              <CusText
                extraBold
                text={'Return (2 Yr.)'}
                size="S"
                color={colors.gray}
              />
              <Wrapper
                row
                align="center"
                customStyles={{gap: responsiveWidth(1)}}>
                <IonIcon
                  style={[
                    {
                      backgroundColor: showArraow(
                        item?.SchemePerformances?.[0]?.Returns2yr,
                        item?.SchemePerformances?.[0]?.CategoryAvgReturns2yr,
                      ),
                    },
                    styles.returnIcon,
                  ]}
                  name="arrow-up-outline"
                  color={
                    showArraow(
                      item?.SchemePerformances?.[0]?.Returns2yr,
                      item?.SchemePerformances?.[0]?.CategoryAvgReturns2yr,
                    ) == '#ffff00'
                      ? colors.black
                      : colors.white
                  }
                  size={responsiveWidth(3)}
                />

                <CusText
                  semibold
                  text={toFixedDataForReturn(
                    item?.SchemePerformances?.[0]?.Returns2yr,
                  )}
                  size="N"
                  color={colors.gray}
                />
              </Wrapper>
              <Spacer y="XS" />
              <CusText
                extraBold
                text={'Return (10 Yr.)'}
                size="S"
                color={colors.gray}
              />
              <Wrapper
                row
                align="center"
                customStyles={{gap: responsiveWidth(1)}}>
                <IonIcon
                  style={[
                    {
                      backgroundColor: showArraow(
                        item?.SchemePerformances?.[0]?.Returns10yr,
                        item?.SchemePerformances?.[0]?.CategoryAvgReturns10yr,
                      ),
                    },
                    styles.returnIcon,
                  ]}
                  name="arrow-up-outline"
                  color={
                    showArraow(
                      item?.SchemePerformances?.[0]?.Returns10yr,
                      item?.SchemePerformances?.[0]?.CategoryAvgReturns10yr,
                    ) == '#ffff00'
                      ? colors.black
                      : colors.white
                  }
                  size={responsiveWidth(3)}
                />

                <CusText
                  semibold
                  text={toFixedDataForReturn(
                    item?.SchemePerformances?.[0]?.Returns10yr,
                  )}
                  size="N"
                  color={colors.gray}
                />
              </Wrapper>
            </Wrapper>
            <Wrapper align="center">
              <CusText
                extraBold
                text={'Return (3 Yr.)'}
                size="S"
                color={colors.gray}
              />
              <Wrapper
                row
                align="center"
                customStyles={{gap: responsiveWidth(1)}}>
                <IonIcon
                  style={[
                    {
                      backgroundColor: showArraow(
                        item?.SchemePerformances?.[0]?.Returns3yr,
                        item?.SchemePerformances?.[0]?.CategoryAvgReturns3yr,
                      ),
                    },
                    styles.returnIcon,
                  ]}
                  name="arrow-up-outline"
                  color={
                    showArraow(
                      item?.SchemePerformances?.[0]?.Returns3yr,
                      item?.SchemePerformances?.[0]?.CategoryAvgReturns3yr,
                    ) == '#ffff00'
                      ? colors.black
                      : colors.white
                  }
                  size={responsiveWidth(3)}
                />

                <CusText
                  semibold
                  text={toFixedDataForReturn(
                    item?.SchemePerformances?.[0]?.Returns3yr,
                  )}
                  size="N"
                  color={colors.gray}
                />
              </Wrapper>
              <Spacer y="XS" />
              <CusText
                extraBold
                text={'AUM (Cr.)'}
                size="S"
                color={colors.gray}
              />
              <Wrapper
                row
                align="center"
                customStyles={{gap: responsiveWidth(1)}}>
                <CusText
                  semibold
                  text={convertToCrores(
                    item?.SchemePerformances?.[0]?.AUM
                      ? item?.SchemePerformances?.[0]?.AUM
                      : 0,
                  )}
                  size="N"
                  color={colors.gray}
                />
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Wrapper> */}
       

        <Spacer y="S" />
      </>
    );
  };
 const renderFundItem = ({ item }:any) => (
    <Wrapper customStyles={styles.row}>
     
      <View style={[styles.cell,{width:responsiveWidth(45)}]}>
        <CusText customStyles={styles.fundName} text={item?.name} />
        <Wrapper row>
        <CusText style={styles.fundCategory} text={item?.SchemeCategory?.Name}/>
         <CusText text={' - '} size="XS" color={colors.black} />
                      <CusText
                        text={item?.SchemeSubcategory?.Name}
                       style={styles.fundCategory}
                      />

        </Wrapper>
         <Wrapper row>
          <Wrapper color={'#f9f9f9'} customStyles={styles.swipebutton}>
            <Ionicons name='swap-horizontal-outline'/>
            </Wrapper>
             <Wrapper color={colors.secondary} customStyles={styles.swipebutton}>
            <Ionicons name='cart' color={colors.white}/>
            </Wrapper>
         </Wrapper>
      </View>
       <View style={[styles.cell,{width:responsiveWidth(25)}]}>
          <Wrapper align="center" row>
        {(item?.SchemePerformances.length
                      ? item?.SchemePerformances[0]?.OverallRating
                      : 0) && (
                      <CusText
                        text={
                          item?.SchemePerformances.length
                            ? item?.SchemePerformances[0]?.OverallRating
                            : 0
                        }
                        size="S"
                        color={colors.gray}
                      />
                    )}
                    {(item?.SchemePerformances.length
                      ? item?.SchemePerformances[0]?.OverallRating
                      : 0) && (
                      <Ionicons
                        name="star"
                        size={responsiveWidth(3)}
                        color={colors.secondary}
                      />
                    )}
                    </Wrapper>
      </View>
      <CusText customStyles={styles.cell} text={item?.SchemePerformances[0]?.Nav} />
      <CusText customStyles={styles.cell} text={convertToCrores(
                    item?.SchemePerformances?.[0]?.AUM
                      ? item?.SchemePerformances?.[0]?.AUM
                      : 0,
                  )}/>
      <CusText customStyles={styles.cell} text={item.net_expense_ratio} />
      <CusText customStyles={styles.cell} text={toFixedDataForReturn(
                    item?.SchemePerformances?.[0]?.Return1yr,
                  )} />
      <CusText customStyles={styles.cell} text={toFixedDataForReturn(
                    item?.SchemePerformances?.[0]?.Returns3yr,
                  )} />
      <CusText customStyles={styles.cell} text={toFixedDataForReturn(
                    item?.SchemePerformances?.[0]?.Returns5yr,
                  )} />
      <CusText customStyles={styles.cell} text={item?.SchemePerformances[0]?.ReturnSinceIncep ? item?.SchemePerformances[0]?.ReturnSinceIncep.toFixed(2) : '-'} />
      <CusText customStyles={styles.cell} text={item?.inception_date
                          ? moment(item?.inception_date).format('DD-MM-yyyy')
                          : '-'} />
    </Wrapper>
  );
  return (
    <>
      <Header menubtn name={'Fund Picker'} />
      <Wrapper
        width={responsiveWidth(95)}
        position="center"
        row
        justify="apart">
        <InputField
          fieldColor={colors.Hard_White}
          width={responsiveWidth(80)}
          placeholder="Search Here"
          value={search}
          //onChangeText={debouncedGetFundPickerScheme}
          onChangeText={(text: string) => {
            setsearch(text);
            debouncedGetFundPickerScheme(text);
          }}
          borderColor={colors.gray}
          suffixIcon={search ? 'close' : 'search'}
          suffixPress={() => {
            if (search) {
              setPage(1);
              setsearch('');
              getFundPickerscheme('', filterObj, 1, true);
            }
          }}
        />
        <Spacer x="XXS" />
        <CusButton
          onPress={() => {
            setIsVisible(true);
          }}
          iconFirst
          iconPress={() => {
            //setIsVisible(true);
          }}
          iconName="filter-outline"
          width={responsiveWidth(13)}
        />
      </Wrapper>
      <Spacer y="S" />
      {/* <Container Xcenter > */}
      <Wrapper >
      
         {/* <FlatList
          data={fundPickerList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          nestedScrollEnabled={true}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          ListFooterComponent={loader ? <ActivityIndicator /> : null}
        ListEmptyComponent={
          !loader && (
            <Wrapper align="center" customStyles={{ marginVertical : responsiveWidth(5)}}>
              <CusText
                text="No funds found."
                size="N"
                color={colors.gray}
              />
            </Wrapper>
          )
        }
        /> */}
        <ScrollView horizontal={true}>
            <View style={styles.tableContainer}>
        {renderTableHeader()}
            <FlatList
          data={fundPickerList}
          renderItem={renderFundItem}
          keyExtractor={item => item.id}
        />
        </View>
        </ScrollView>
      </Wrapper>
      <FundPickerFilter
        filterObj={filterObj}
        isVisible={isVisible}
        setisVisible={(value: any) => setIsVisible(value)}
        categoryData={categoryData}
        natureList={natureList}
        setCategoryData={(value: any[]) => {
          setCategoryData(value);
        }}
        setNatureList={(value: any[]) => {
          setNatureList(value);
        }}
        amcList={amcList}
        setAmcList={(value: any[]) => {
          setAmcList(value);
        }}
        onFilterApply={(newFilters: any) => {
          setFilterObj(newFilters);
          setPage(1);
          getFundPickerscheme(search, newFilters, 1, true);
        }}
        ListEmptyComponent={
          !loader && (
            <Wrapper align="center">
              <CusText text="No data found." />
            </Wrapper>
          )
        }
      />
      {/* </Container> */}
    </>
  );
};
export default FundPicker;
