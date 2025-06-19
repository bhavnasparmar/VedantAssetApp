import {useIsFocused} from '@react-navigation/native';
import {debounce} from 'lodash';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {
  getAmcApi,
  getCategoryWithSubCategoryApi,
  getFundPickerListDataApi,
  getNatureApi,
} from '../../../api/homeapi';
import {showToast, toastTypes} from '../../../services/toastService';
import Header from '../../../shared/components/Header/Header';
import {borderRadius, colors, responsiveWidth} from '../../../styles/variables';
import InputField from '../../../ui/InputField';
import Container from '../../../ui/container';
import CusButton from '../../../ui/custom-button';
import CusText from '../../../ui/custom-text';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
import API from '../../../utils/API';
import {
  convertToCrores,
  showArraow,
  toFixedDataForReturn,
} from '../../../utils/Commanutils';
import FundPickerFilter from './component/fundPickerFilter';
import {styles} from './fundpickerStyles';

const FundPicker = () => {
  const isFocused: any = useIsFocused();
  const [isVisible, setIsVisible] = useState(false);
  const [data, setdata] = useState<any[]>([]);
  const [fundPickerList, setfundPickerList] = useState<any[]>([]);
  const [search, setsearch] = useState<any>('');
  const scrollIndex = React.useRef<number>(1);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [natureList, setNatureList] = useState<any[]>([]);
  const [amcList, setAmcList] = useState<any>([]);
  const [listEnd, setlistEnd] = React.useState<boolean>(false);
  const [filterObj, setFilterObj] = React.useState<any>({});
  const [loader, setloader] = React.useState<boolean>(false);
  const pagesize = 1000;
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  //const [hasMoreData, setHasMoreData] = useState(true);

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
        filter = {name: searchValue.trim(), ...filterVal};
      } else if ((searchValue || '').trim()) {
        filter = {name: searchValue.trim()};
      } else if (filterVal) {
        filter = filterVal;
      }

      const payload = {
        page: pageNumber,
        limit: pagesize,
        filters: false,
        //sort: false,
        sort:{"SchemePerformances.Returns3yr":"DESC"}
      };
      console.log('payload', payload);
      const [result, error]: any = await getFundPickerListDataApi(payload);
      console.log('getFundPickerListDataApi=======', error);
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
  const renderItem = ({item}: any) => {
    return (
      <>
        <Wrapper
          color={colors.cardBg}
          customStyles={{
            borderRadius: borderRadius.medium,
            marginHorizontal: responsiveWidth(1),
            paddingVertical: responsiveWidth(3),
          }}>
          <Wrapper
            // color='red'
            row
            align="center"
            justify="apart"
            width={responsiveWidth(90)}>
            {/* Wrapper for name and star */}

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
                    //  gap: responsiveWidth(0.07),
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
                    //  marginLeft: responsiveWidth(6),
                    //gap: responsiveWidth(5),
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
                    //  marginLeft: responsiveWidth(6),
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
            {/* Wrapper for + button */}
            <Wrapper>
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
            </Wrapper>
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
            // color='red'
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
        </Wrapper>
        <Spacer y="S" />
      </>
    );
  };

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
          //  setIsVisible(true);
          }}
          iconFirst
          iconPress={()=>{
            //setIsVisible(true);
          }}
          iconName="filter-outline"
          width={responsiveWidth(13)}
        />
      </Wrapper>
      <Spacer y="S" />
      <Container Xcenter contentWidth={responsiveWidth(95)}>
        <Wrapper customStyles={{}}>
          <FlatList
            data={fundPickerList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            // onEndReached={loadMore}
            //onEndReachedThreshold={0.5}
            //refreshing={isRefreshing}
            // onRefresh={onRefresh}
            ListFooterComponent={loader ? <ActivityIndicator /> : null}
            // ListEmptyComponent={
            //   !loader && (
            //     <Wrapper align="center" customStyles={{ marginVertical : responsiveWidth(5)}}>
            //       <CusText
            //         text="No funds found."
            //         size="N"
            //         color={colors.gray}
            //       />
            //     </Wrapper>
            //   )
            // }
          />
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
      </Container>
    </>
  );
};
export default FundPicker;
