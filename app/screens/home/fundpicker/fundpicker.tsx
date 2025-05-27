import {
  Alert,
  Animated,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Container from '../../../ui/container';
import CusText from '../../../ui/custom-text';
import Wrapper from '../../../ui/wrapper';
import {styles} from './fundpickerStyles';
import {Dimensions} from 'react-native';
import {
  borderRadius,
  colors,
  fontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../styles/variables';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Spacer from '../../../ui/spacer';
import {useEffect, useRef, useState} from 'react';
import API from '../../../utils/API';
import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {debounce} from 'lodash';
import React, {useMemo} from 'react';
// import * as echarts from 'echarts/core';
// import { BarChart } from 'echarts/charts';
// import { GridComponent } from 'echarts/components';
// import { SVGRenderer, SvgChart } from '@wuba/react-native-echarts';
// import RNFS from 'react-native-fs';
import InputField from '../../../ui/InputField';
import CusButton from '../../../ui/custom-button';
import {showToast, toastTypes} from '../../../services/toastService';
import Header from '../../../shared/components/Header/Header';
import {
  getAmcApi,
  getCategoryWithSubCategoryApi,
  getFundPickerListDataApi,
  getNatureApi,
} from '../../../api/homeapi';
import moment from 'moment';
import {
  convertToCrores,
  toFixedDataForReturn,
} from '../../../utils/Commanutils';
import FundPickerFilter from './component/fundPickerFilter';

const FundPicker = () => {
  const isFocused: any = useIsFocused();
  const [isVisible, setIsVisible] = useState(true);
  const [schemeFilters, setSchemeFilter] = useState<any[]>([]);
  const [data, setdata] = useState<any[]>([]);
  const [schemeFiltersText, setSchemeFilterText] = useState<any[]>([]);
  const [fundPickerList, setfundPickerList] = useState<any[]>([]);
  const [gaugeValue, setGaugeValue] = useState<any[]>([]);
  const [search, setsearch] = useState<any>('');
  const [filterSearch, setFIlterSearch] = useState<any>('');
  const debouncedGetFundPickerScheme = useMemo(
    () => debounce((value: string) => getFundPickerscheme(value), 500),
    [],
  );
  const scrollIndex = React.useRef<number>(1);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [natureList, setNatureList] = useState<any[]>([]);
  const [amcList, setAmcList] = useState<any>([]);
  const [listEnd, setlistEnd] = React.useState<boolean>(false);
  const [isFilterShow, setIsFilterShow] = React.useState<boolean>(false);
  const [isSubFilterShow, setIsSubFilterShow] = React.useState<boolean>(false);
  const [filterObj, setFilterObj] = React.useState<any>({});
  // const [selectedSubs, setSelectedSubs] = useState<{ [key: number]: number[] }>({});
  const [selectedSubs, setSelectedSubs] = useState<any>({});
  const [schemeCat, setSchemeCat] = useState<any>(null);
  const [loader, setloader] = React.useState<boolean>(false);
  const pagesize = 50;
  useEffect(() => {
    getFundPickerscheme(search);
    getCategories();
    getNatureList();
    getAmcList();
    return () => {
      scrollIndex.current = 1;
      setlistEnd(true);
    };
  }, [isFocused]);
  const showArraow = (returnNumber: number, categoryNumber: number) => {
    let ratio: any =
      categoryNumber && categoryNumber > 0
        ? ((returnNumber - categoryNumber) / categoryNumber) * 100
        : returnNumber;
    ratio = ratio?.toFixed(2);
    if (ratio >= 10) {
      return '#056106';
    } else if (5 <= ratio || ratio >= 9.99) {
      return '#00ff00';
    } else if (0 <= ratio || ratio >= 4.99) {
      return '#ffff00';
    } else if (-5 <= ratio || ratio >= -0.99) {
      return '#f79b00';
    } else if (ratio < -5) {
      return '#ff0000';
    }
  };

  const getSchemesFilter = async () => {
    try {
      const result: any = await API.get(
        'schemes/get-category-with-subCategory',
      );
      if (result?.code === 200) {
        const data: any = result?.data;
        // console.log('Data : ',data)
        setSchemeFilterText(data);
        setSchemeFilter(data);
        const firstCat = data[0];
        const subIds =
          firstCat.scheme_subcategories?.map((sub: any) => sub.id) || [];
        setSchemeCat(firstCat);
        setSelectedSubs({[firstCat.ID]: subIds});
        //  setSchemeCat(data[0]);
      } else {
        showToast(toastTypes.info, result.msg);
      }
    } catch (error: any) {
      console.log('getSchemesFilter Catch Error ; ', error[0].msg);
      showToast(toastTypes.info, error[0].msg);
    }
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
  const getFundPickerscheme = async (search: any) => {
    try {
      setloader(true);
      let data: any = {};

      const pagenumber = scrollIndex.current || 1;
      data = {
        page: pagenumber,
        limit: pagesize,
        filters: false,
        sort: false,
      };
      if (search) {
        data.search = search || '';
      }

      const [result, error]: any = await getFundPickerListDataApi({
        params: data,
      });
      console.log('getFundPickerListDataApi result', result?.data?.rows);
      if (result != null) {
        setfundPickerList(result?.data?.rows);
        setloader(false);
        setlistEnd(result?.data?.rows?.length < pagesize);
      } else {
        if (error.msg) {
          setloader(false);
          showToast(`${toastTypes.error}`, error.msg);
        } else {
          showToast(`${toastTypes.error}`, error[0].msg);
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  //  echarts.use([SVGRenderer, BarChart, GridComponent]);
  const svgRef = useRef<any>(null);

  const loadMore = () => {
    if (loader || listEnd) {
      return;
    }
    scrollIndex.current++;
    getFundPickerscheme(search);
  };
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
                    {/* <IonIcon
                      name="person"
                      color={colors.gray}
                      size={responsiveWidth(2)}
                    />
                    <CusText text={'Ramananda'} size="XS" color={colors.gray} /> */}
                  </Wrapper>
                  {/* <Wrapper row>
                    {[1, 2, 3, 4, 5].map((items: any, i: number) => (
                      <>
                        <IonIcon
                          name="star"
                          size={responsiveWidth(2)}
                          color={
                            i > item?.SchemePerformances[0]?.OverallRating
                              ? colors.gray
                              : '#F9BD36'
                          }
                        />
                      </>
                    ))}
                  </Wrapper> */}
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
          onChangeText={(value: string) => {
            //   handleFormChange({ key: 'bankName', value })
            setsearch(value);
            //  schemewithholding(selectScheme1, value, schemesort, '')
          }}
          borderColor={colors.gray}
          suffixIcon={search ? 'close' : 'search'}
          suffixPress={() => {
            if (search) {
              setsearch('');
              //setschemeswithholding([])

              //schemewithholding(selectScheme1, '', schemesort, '')
            }
          }}
        />
        <Spacer x="XXS" />
        <CusButton
          onPress={() => {
            setIsVisible(true);
          }}
          iconFirst
          iconName="filter-outline"
          width={responsiveWidth(13)}
        />
      </Wrapper>
      <Spacer y="S" />
      <Container Xcenter contentWidth={responsiveWidth(95)}>
        <Wrapper customStyles={{}}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={fundPickerList}
            renderItem={renderItem}
            initialNumToRender={5}
            // onEndReached={loadMore}
            // onEndReachedThreshold={2}
            // ListFooterComponent={() => loader && <ActivityIndicator />}
            // refreshing={loader}
            // onRefresh={onRefresh}
            //  removeClippedSubviews={true}
            // ItemSeparatorComponent={() => {
            //   return (
            //     <>
            //     <Spacer y='N' />
            //       {/* <Wrapper
            //         customStyles={{
            //           borderColor: 'rgba(153, 153, 153, 0.6)',
            //           borderWidth: responsiveWidth(0.07),
            //         }}
            //         color="rgba(153, 153, 153, 0.6)"
            //       /> */}
            //     </>
            //   );
            // }}
          />
        </Wrapper>
        <FundPickerFilter
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
          applyFilter ={()=>{
            
          }}
        />
      </Container>
    </>
  );
};
export default FundPicker;
