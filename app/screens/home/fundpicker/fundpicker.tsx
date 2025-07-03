import { useIsFocused, useNavigation } from '@react-navigation/native';
import { debounce, sortBy } from 'lodash';
import React, { useCallback, useEffect,  useState } from 'react';
import {  ActivityIndicator, Alert, FlatList, Image, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  downloadPDFApi,
  getAmcApi,
  getCategoryWithSubCategoryApi,
  getFundPickerListDataApi,
  getNatureApi,
} from '../../../api/homeapi';
import { showToast, toastTypes } from '../../../services/toastService';
import Header from '../../../shared/components/Header/Header';
import {  borderRadius, colors, fontSize, responsiveHeight, responsiveWidth } from '../../../styles/variables';
import InputField from '../../../ui/InputField';
import CusButton from '../../../ui/custom-button';
import CusText from '../../../ui/custom-text';
import Spacer from '../../../ui/spacer';
import Wrapper from '../../../ui/wrapper';
import FundPickerFilter from './component/fundPickerFilter';
import { styles } from './fundpickerStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { convertToCrores, PDF_URL, toFixedDataForReturn } from '../../../utils/Commanutils';
import moment from 'moment';
import { AppearanceContext } from '../../../context/appearanceContext';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as Progress from 'react-native-progress';
import DownloadProgressModal from '../../../shared/components/DownloadProgress/DownloadProgress';

const FundPicker = () => {
  const isFocused: any = useIsFocused();
  const navigation:any = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDownloadVisible, setIsDownloadVisible] = useState(false);
  const [isReturnsVisible, setIsReturnsVisible] = useState(false);
  const [fundPickerList, setfundPickerList] = useState<any[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<any[]>([]);
  const [search, setsearch] = useState<any>('');
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [natureList, setNatureList] = useState<any[]>([]);
  const [amcList, setAmcList] = useState<any>([]);
  const [filterObj, setFilterObj] = React.useState<any>({});
  const [loader, setloader] = React.useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState(0); 
    const [isModalVisible, setModalVisible] = useState(false);
    const [isDownloaded, setIsDownload] = useState<boolean>(false);
  const pagesize = 30;
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState('');
const [sortOrder, setSortOrder] = useState('');
  //const [hasMoreData, setHasMoreData] = useState(true);
  const [funds, setFunds] = useState([
    { id: '1', name: 'HDFC Mid-Cap Opportunities Gr', category: 'Equity - Mid Cap', nav: '178.234', totalAum: '78201.08', stars: 5, return1Y: '41.86%', return3Y: '29.47%', return5Y: '33.39%', stdDev: '17.21%', date: '25/06/2023' },
    { id: '2', name: 'SBI Infrastructure Fund Gr', category: 'Equity - Sectoral Infrastructure', nav: '40.98', totalAum: '2770.33', stars: 3, return1Y: '17.77%', return3Y: '22.81%', return5Y: '29.34%', stdDev: '12.85%', date: '31/03/2023' },
    { id: '3', name: 'Invesco India Mid Cap Gr', category: 'Equity - Mid Cap', nav: '87.83', totalAum: '4680.96', stars: 4, return1Y: '1.97%', return3Y: '22.45%', return5Y: '31.28%', stdDev: '16.84%', date: '04/07/2007' },
    // Add more funds as needed
  ]);

  const [defaultReturns,setDefaultReturns]:any = useState<any[]>(
    [
      {
        id:1,
        name:'Return 1 Day'
      },
      {
        id:2,
        name:'Return 1 Week'
      },
      {
        id:3,
        name:'Return 1 Month'
      },
      {
        id:4,
        name:'Return 3 Month'
      },
      {
        id:5,
        name:'Return 6 Month'
      },
      {
        id:6,
        name:'Return 1 Year'
      },
      {
        id:7,
        name:'Return 2 Year'
      },
       {
        id:8,
        name:'Return 3 Year'
      },
       {
        id:9,
        name:'Return 5 Year'
      },
       {
        id:10,
        name:'Return 7 Year'
      },
      {
        id:11,
        name:'Return 10 Year'
      },
       {
        id:12,
        name:'Return Since Incep'
      },
    ]
  )

  const debouncedGetFundPickerScheme = useCallback(
    debounce((text: string) => {
      // setPage(1);
      getFundPickerscheme(text, filterObj, 1);
    }, 500),
    [filterObj],
  );

  useEffect(() => {
    setSelectedReturn([6,8,9])
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
    sort : any= null
  ) => {
    try {
      // if (!isRefresh) setloader(true);
      setloader(true);
      let filter = {};
      if ((searchValue || '').trim() && filterVal) {
        let data :any =  {
          "categoryid": filterVal?.categoryid
          , "subcategory_id": filterVal?.subcategory_id
          , "amc_id": filterVal?.amc_id
          , "option_id": Number(filterVal?.option_id)
        }
        // filter = { name: searchValue.trim(), ...filterVal };
        filter = { ms_fullname: searchValue.trim(), ...data };
      } else if ((searchValue || '').trim()) {
        filter = { ms_fullname: searchValue.trim() };
      } else if (filterVal) {
        filter = {
          "categoryid": filterVal?.categoryid
          , "subcategory_id": filterVal?.subcategory_id
          , "amc_id": filterVal?.amc_id
          , "option_id": Number(filterVal?.option_id)
        }
      }
      console.log("filterVal",filterVal)
      console.log("filter",filterVal)
      console.log("Sort Data : ",sort)

    
      
      const payload = {
        page: pageNumber,
        limit: pagesize,
        // filters: filterVal ? {
        //   "categoryid": filterVal?.categoryid
        //   , "subcategory_id": filterVal?.subcategory_id
        //   , "amc_id": filterVal?.amc_id
        //   , "option_id": Number(filterVal?.option_id)
        // } : false,
          filters: filterVal ? filter : false,
        sort: sort !==null ? sort : { "SchemePerformances.Returns3yr": "DESC" },
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


  const handleSort = (field: string) => {
    let newOrder = 'ASC';

   
    if (sortField === field) {
      if (sortOrder === 'ASC') {
        newOrder = 'DESC';
      } else if (sortOrder === 'DESC') {
        setSortField('');
        setSortOrder('');
        const defaultSort = { "SchemePerformances.Returns3yr": "DESC" };
        getFundPickerscheme('', filterObj, 1, false, defaultSort);
        return;
      }
    }

    setSortField(field);
    setSortOrder(newOrder);

    const sort = { [field]: newOrder };
    getFundPickerscheme('', filterObj, 1, false, sort);
  };
 
    const renderTableHeader = () => {

    return (
      <Wrapper customStyles={styles.headerRow}>
        <Wrapper align='center' justify='center' row width={responsiveWidth(45)} customStyles={{paddingHorizontal: responsiveWidth(2),gap:responsiveWidth(1)}}>
        <CusText style={styles.headerCell} size='SS' semibold text={'Scheme'} />
        <TouchableOpacity onPress={()=>{
            handleSort('ms_fullname') 
        }}>
        <Ionicons
              name={
                sortField === 'ms_fullname'
                  ? sortOrder === 'ASC'
                    ? 'arrow-up-outline'
                    : 'arrow-down-outline'
                  : 'swap-vertical-outline'
              }
              color={colors.gray}
              size={responsiveWidth(3.5)}
            />
         </TouchableOpacity>
        </Wrapper>
        <Wrapper row align='center' justify='center' width={responsiveWidth(30)} customStyles={{paddingHorizontal: responsiveWidth(2),gap:responsiveWidth(1)}}>
        <CusText style={styles.headerCell} size='SS' semibold text={'Morning star'} />
        <TouchableOpacity onPress={() => {
            handleSort('SchemePerformances.OverallRating') 
          }}>
         <Ionicons
              name={
                sortField === 'SchemePerformances.OverallRating'
                  ? sortOrder === 'ASC'
                    ? 'arrow-up-outline'
                    : 'arrow-down-outline'
                  : 'swap-vertical-outline'
              }
              color={colors.gray}
              size={responsiveWidth(3.5)}
            />
         </TouchableOpacity>
        </Wrapper>
       
        <Wrapper row align='center' justify='center' width={responsiveWidth(20)} customStyles={{ ...{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) } }}>
          <CusText style={styles.headerCell} size='SS' semibold text={'NAV'} />
          <TouchableOpacity onPress={() => {
            handleSort('SchemePerformances.Nav')
            // let sort: any = { "SchemePerformances.Nav": "ASC" }
            // getFundPickerscheme('', null, 1, filterObj, sort)
            
          }}>
            <Ionicons
              name={
                sortField === 'SchemePerformances.Nav'
                  ? sortOrder === 'ASC'
                    ? 'arrow-up-outline'
                    : 'arrow-down-outline'
                  : 'swap-vertical-outline'
              }
              color={colors.gray}
              size={responsiveWidth(3.5)}
            />
          </TouchableOpacity>
        </Wrapper>

        <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
          <CusText style={styles.headerCell} size='SS' semibold text={'AUM (Cr.)'} />
          <TouchableOpacity onPress={() => {
               handleSort('SchemePerformances.AUM')
          }}>
           <Ionicons
              name={
                sortField === 'SchemePerformances.AUM'
                  ? sortOrder === 'ASC'
                    ? 'arrow-up-outline'
                    : 'arrow-down-outline'
                  : 'swap-vertical-outline'
              }
              color={colors.gray}
              size={responsiveWidth(3.5)}
            />
          </TouchableOpacity>
        </Wrapper>
        <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
          <CusText style={styles.headerCell} size='SS' semibold text={'Exp. Ratio'} />
          <TouchableOpacity onPress={() => {
            handleSort('SchemePerformances.AUM')
          }}>
            <Ionicons
              name={
                sortField === 'SchemePerformances.AUM'
                  ? sortOrder === 'ASC'
                    ? 'arrow-up-outline'
                    : 'arrow-down-outline'
                  : 'swap-vertical-outline'
              }
              color={colors.gray}
              size={responsiveWidth(3.5)}
            />
          </TouchableOpacity>
        </Wrapper>
        {
          selectedReturn?.includes(1) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'1D'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Return1d')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Return1d'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
        {
          selectedReturn?.includes(2) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'1W'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Return1w')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Return1w'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
         {
          selectedReturn?.includes(3) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'1M'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Return1mth')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Return1mth'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
        {
          selectedReturn?.includes(4) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'3M'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Return3mth')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Return3mth'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
         {
          selectedReturn?.includes(5) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'6M'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Return6mth')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Return6mth'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
        {
          selectedReturn?.includes(6) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'1Y'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Return1yr')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Return1yr'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
         {
          selectedReturn?.includes(7) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'2Y'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Returns2yr')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Returns2yr'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
        {
          selectedReturn?.includes(8) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'3Y'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Returns3yr')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Returns3yr'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
        {
          selectedReturn?.includes(9) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'5Y'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Returns5yr')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Returns5yr'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
        {
          selectedReturn?.includes(10) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'7Y'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Returns7yr')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Returns7yr'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
        {
          selectedReturn?.includes(11) && (
            <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
              <CusText style={styles.headerCell} size='SS' semibold text={'10Y'} />
              <TouchableOpacity onPress={() => {
                handleSort('SchemePerformances.Returns10yr')
              }}>
                <Ionicons
                  name={
                    sortField === 'SchemePerformances.Returns10yr'
                      ? sortOrder === 'ASC'
                        ? 'arrow-up-outline'
                        : 'arrow-down-outline'
                      : 'swap-vertical-outline'
                  }
                  color={colors.gray}
                  size={responsiveWidth(3.5)}
                />
              </TouchableOpacity>
            </Wrapper>
          )
        }
       
       
        <Wrapper row align='center' justify='center' width={responsiveWidth(25)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1) }}>
          <CusText style={styles.headerCell} size='SS' semibold text={'Since Incep'} />
          <TouchableOpacity onPress={() => {
             handleSort('SchemePerformances.ReturnSinceIncep')
          }}>
         <Ionicons
              name={
                sortField === 'SchemePerformances.ReturnSinceIncep'
                  ? sortOrder === 'ASC'
                    ? 'arrow-up-outline'
                    : 'arrow-down-outline'
                  : 'swap-vertical-outline'
              }
              color={colors.gray}
              size={responsiveWidth(3.5)}
            />
          </TouchableOpacity>
        </Wrapper>
        <Wrapper row align='center' justify='center' width={responsiveWidth(40)} customStyles={{ paddingHorizontal: responsiveWidth(2), gap: responsiveWidth(1)}}>
          <CusText style={styles.headerCell} size='SS' semibold text={'Launch Date'} />
          <TouchableOpacity onPress={() => {
            // let sort: any = { "inception_date": "ASC" }
            // getFundPickerscheme('', null, 1, filterObj, sort)
             handleSort('inception_date')
          }}>
           <Ionicons
              name={
                sortField === 'inception_date'
                  ? sortOrder === 'ASC'
                    ? 'arrow-up-outline'
                    : 'arrow-down-outline'
                  : 'swap-vertical-outline'
              }
              color={colors.gray}
              size={responsiveWidth(3.5)}
            />
           </TouchableOpacity>
        </Wrapper>
      </Wrapper>
    );
  };

  const toggleReturnColums = (item: any) => {
  setSelectedReturn(prevSelected => {
    if (prevSelected.includes(item.id)) {
      return prevSelected.filter(id => id !== item.id);
    } else {
      return [...prevSelected, item.id];
    }
  });
};

  const downloadFile = (type: any) => {
    if (type === 'PDF') {
      setIsReturnsVisible(false),
      setIsDownloadVisible(!isDownloadVisible)
      donwloadPDF()
    }else{
      showToast('info','Coming Soon...')
       setIsReturnsVisible(false),
      setIsDownloadVisible(!isDownloadVisible)
    }

  }

  const generateTimestamp = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); 
  const year = now.getFullYear().toString().slice(-2); 
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${day}_${month}_${year}_${seconds}`;
};

  const donwloadPDF = async () => {
    try {
      setIsDownload(true)
      let payload: any = {
        exportData: fundPickerList,
        visibleColumns: {
          "return1day": selectedReturn?.includes(1) ? true : false,
          "return7days": selectedReturn?.includes(2) ? true : false,
          "return1month": selectedReturn?.includes(3) ? true : false,
          "return3months": selectedReturn?.includes(4) ? true : false,
          "return6months": selectedReturn?.includes(5) ? true : false,
          "return1y": selectedReturn?.includes(6) ? true : false,
          "return2y": selectedReturn?.includes(7) ? true : false,
          "return3y": selectedReturn?.includes(8) ? true : false,
          "return5y": selectedReturn?.includes(9) ? true : false,
          "return7y": selectedReturn?.includes(10) ? true : false,
          "return10y": selectedReturn?.includes(11) ? true : false,
        },
        visibleColumnsCount: selectedReturn?.length ? selectedReturn?.length : 0
      }
      console.log('Payload PDF: ', payload)
      const [result, error]: any = await downloadPDFApi(payload);
      if (result) {
        console.log('Result : ', result)
        let pdfPath:any = `${PDF_URL}Fundpdf/${result?.data}`
        console.log('pdfPath : ', pdfPath)
          const timestamp = generateTimestamp();
           const fileName = `Fund${timestamp}_data.pdf`;
        donloadFiles(pdfPath,fileName)
      } else {
        console.log('error ', error)
         setIsDownload(false)
        showToast(toastTypes.info, error)
        
      }
    } catch (error: any) {
      console.log('donwloadPDF catch error ', error)
      showToast(toastTypes.error, error)
       setIsDownload(false)
    }

  }

  

  const donloadFiles = async (pdfPath: any, fileName: any) => {
    try {
    
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    console.log('Permission Granted : ', granted)
    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
       setModalVisible(false);
      setDownloadProgress(0);
      const { config, fs, ios } = ReactNativeBlobUtil;
      const downloadDir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.LegacyDownloadDir;
      const configOptions : any = Platform.select({
        ios: {
          title: fileName,
          path: `${downloadDir}/${fileName}`,
        },
        android: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: fileName,
          path: `${downloadDir}/${fileName}`,
          mime: 'application/pdf',
        },
      });
      config(configOptions)
      .fetch('GET', pdfPath)
      .progress({ interval: 250 }, (received, total) => { 
        const percentage = (received / total) * 100;
        setDownloadProgress(percentage);
      })
      .then(res => {
        if (Platform.OS === 'ios') {
          ios.openDocument(res.data);
        } else {
          console.log('PDF downloaded successfully to:', res.path());
          showToast('success','Downloaded Successfully')
           
        }
        setIsDownload(false)
         setModalVisible(false);
          setDownloadProgress(0);
      })
      .catch(error => {
        console.error('Download error:', error);
         setIsDownload(false)
         setModalVisible(false);
      setDownloadProgress(0);
      });
    // } else {
    //   Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
    // }
    } catch (error:any) {
      console.log('donloadFiles catch Error : ',error)
       setIsDownload(false)
    }
  }

 const renderFundItem = ({ item }:any) => (
  <TouchableOpacity onPress={() => {
    navigation.navigate('FunpickerDetail', { item })
  }}>
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
       <View style={[styles.cell,{width:responsiveWidth(25),}]}>
          <Wrapper  position='center' align="center" row>
        {(item?.SchemePerformances.length
                      ? item?.SchemePerformances[0]?.OverallRating
                      : 0) && (
                      <CusText
                        text={
                          item?.SchemePerformances.length
                            ? item?.SchemePerformances[0]?.OverallRating
                            : 0
                        }
                       size='SS'
                      //  semibold
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
     <View style={[styles.cell, { width: responsiveWidth(25), }]}>
       <Wrapper position='center' align="center" row>
         <CusText size='SS' position='center' text={item?.SchemePerformances[0]?.Nav} />
       </Wrapper>
     </View>
     <View style={[styles.cell, { width: responsiveWidth(25), }]}>
       <Wrapper position='center' align="center" row>
         <CusText size='SS' position='center' text={convertToCrores(
           item?.SchemePerformances?.[0]?.AUM
             ? item?.SchemePerformances?.[0]?.AUM
             : 0,
         )} />
       </Wrapper>
     </View>
     <View style={[styles.cell, { width: responsiveWidth(25), }]}>
       <Wrapper position='center' align="center" row>
         <CusText size='SS' position='center' text={item.net_expense_ratio} />
       </Wrapper>
     </View>
     {
       selectedReturn?.includes(1) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
           <Wrapper position='center' align="center" row>
             <CusText size='SS' position='center' text={toFixedDataForReturn(
               item?.SchemePerformances?.[0]?.Return1d,
             )} />
           </Wrapper>
         </View>
       )
     }
     {
       selectedReturn?.includes(2) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
           <Wrapper position='center' align="center" row>
             <CusText size='SS' position='center' text={toFixedDataForReturn(
               item?.SchemePerformances?.[0]?.Return1w,
             )} />
           </Wrapper>
         </View>
       )
     }
     {
       selectedReturn?.includes(3) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
           <Wrapper position='center' align="center" row>
             <CusText size='SS' position='center' text={toFixedDataForReturn(
               item?.SchemePerformances?.[0]?.Return1mth,
             )} />
           </Wrapper>
         </View>
       )
     }
     {
       selectedReturn?.includes(4) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
           <Wrapper position='center' align="center" row>
             <CusText size='SS' position='center' text={toFixedDataForReturn(
               item?.SchemePerformances?.[0]?.Return3mth,
             )} />
           </Wrapper>
         </View>
       )
     }
     {
       selectedReturn?.includes(5) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
           <Wrapper position='center' align="center" row>
             <CusText size='SS' position='center' text={toFixedDataForReturn(
               item?.SchemePerformances?.[0]?.Return6mth,
             )} />
           </Wrapper>
         </View>
       )
     }
     {
       selectedReturn?.includes(6) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
           <Wrapper position='center' align="center" row>
             <CusText size='SS' position='center' text={toFixedDataForReturn(
               item?.SchemePerformances?.[0]?.Return1yr,
             )} />
           </Wrapper>
         </View>
       )
     }
     {
       selectedReturn?.includes(7) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
           <Wrapper position='center' align="center" row>
             <CusText size='SS' position='center' text={toFixedDataForReturn(
               item?.SchemePerformances?.[0]?.Returns2yr,
             )} />
           </Wrapper>
         </View>
       )
     }
     {
       selectedReturn?.includes(8) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
           <Wrapper position='center' align="center" row>
             <CusText size='SS' position='center' text={toFixedDataForReturn(
               item?.SchemePerformances?.[0]?.Returns3yr,
             )} />
           </Wrapper>
         </View>
       )
     }
     {
       selectedReturn?.includes(9) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
       <Wrapper position='center' align="center" row>
         <CusText size='SS' position='center' text={toFixedDataForReturn(
           item?.SchemePerformances?.[0]?.Returns5yr,
         )} />
       </Wrapper>
     </View>
       )
     }
     {
       selectedReturn?.includes(10) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
       <Wrapper position='center' align="center" row>
         <CusText size='SS' position='center' text={toFixedDataForReturn(
           item?.SchemePerformances?.[0]?.Returns7yr,
         )} />
       </Wrapper>
     </View>
       )
     }
     {
       selectedReturn?.includes(11) && (
         <View style={[styles.cell, { width: responsiveWidth(25), }]}>
       <Wrapper position='center' align="center" row>
         <CusText size='SS' position='center' text={toFixedDataForReturn(
           item?.SchemePerformances?.[0]?.Returns10yr,
         )} />
       </Wrapper>
     </View>
       )
     }
   
   
    
     <View style={[styles.cell, { width: responsiveWidth(25), }]}>
       <Wrapper position='center' align="center" row>
         <CusText size='SS' position='center' text={item?.SchemePerformances[0]?.ReturnSinceIncep ? item?.SchemePerformances[0]?.ReturnSinceIncep.toFixed(2) : '-'} />
       </Wrapper>
     </View>
     <View style={[styles.cell, { width: responsiveWidth(40), }]}>
       <Wrapper position='center' align="center" row>
         <CusText size='SS' position='center' text={item?.inception_date
           ? moment(item?.inception_date).format('DD-MM-yyyy')
           : '-'} />
       </Wrapper>
     </View>
    </Wrapper>
    </TouchableOpacity>
  );
  return (
    <>
      <Header backBtn menubtn name={'Fund Explore'} />
      <Wrapper  color={colors.headerColor} row align='center'  customStyles={{paddingHorizontal:responsiveWidth(2.5),gap:responsiveWidth(1.5),paddingVertical:responsiveWidth(2)}}>
        <InputField
          fieldColor={colors.Hard_White}
          width={responsiveWidth(60)}
          placeholder="Search"
          value={search}
          onChangeText={(text: string) => {
            setsearch(text);
            debouncedGetFundPickerScheme(text);
          }}
          placeholderColor={colors.gray}
          borderColor={colors.fieldborder}
          fieldViewStyle={{
            height:responsiveWidth(11),
            borderRadius:borderRadius.normal
          }}
          
          style={{
            borderColor:colors.fieldborder
          }}
          // suffixIcon={search ? 'close' : 'search'}
          // suffixPress={() => {
          //   if (search) {
          //     setPage(1);
          //     setsearch('');
          //     getFundPickerscheme('', filterObj, 1, true);
          //   }
          // }}
        />
        <TouchableOpacity activeOpacity={0.6} onPress={() => { setIsVisible(true); }}>
          <Wrapper customStyles={{ padding: responsiveWidth(2.5), borderRadius: borderRadius.normal, borderColor: colors.inputBorder, borderWidth: 1 }}>
            <Ionicons name='funnel' color={colors.secondary} size={responsiveWidth(5)} />
          </Wrapper>
        </TouchableOpacity>
        <Wrapper customStyles={{ position: "relative" }}>
          <TouchableOpacity activeOpacity={0.6} onPress={() => {setIsReturnsVisible(false) , setIsDownloadVisible(!isDownloadVisible) }}>
            <Wrapper customStyles={{ padding: responsiveWidth(2.5), borderRadius: borderRadius.normal, borderColor: colors.inputBorder, borderWidth: 1 }}>
              {
                isDownloaded ? 
                <Wrapper>
                   <ActivityIndicator
                        color={colors.orange}
                        size={fontSize.normal}
                      />
                    </Wrapper>:
              <Image resizeMode='contain' source={require('../../../assets/Images/downloadfile.png')} style={{ height: responsiveWidth(5), width: responsiveWidth(5) }} />

              }
            </Wrapper>
          </TouchableOpacity>
          {
            isDownloadVisible ?
              <Wrapper position='end' width={responsiveWidth(20)} color={colors.Hard_White} customStyles={{ position: "absolute", top: "95%", zIndex: 1, borderRadius: borderRadius.normal,borderColor:colors.inputBorder,borderWidth:1 }}>
                <TouchableOpacity onPress={() => {downloadFile('EXCEL') }}>
                  <Wrapper row align='center' position='start' justify='center' customStyles={{ paddingHorizontal:responsiveWidth(2), paddingVertical: responsiveHeight(1),gap:responsiveWidth(1) }}>
                   <Image resizeMode='contain' style={{height:responsiveWidth(3.5),width:responsiveWidth(3.5)}} source={require('../../../assets/Images/excelpic.png')} />
                    <CusText semibold text={'EXCEL'} />
                  </Wrapper>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { downloadFile('PDF') }}>
                  <Wrapper row align='center' position='start' justify='center' customStyles={{ paddingHorizontal:responsiveWidth(2), paddingVertical: responsiveHeight(1),gap:responsiveWidth(1) }}>
                    <Image resizeMode='contain' style={{height:responsiveWidth(3.5),width:responsiveWidth(3.5)}} source={require('../../../assets/Images/pdfpic.png')} />
                    <CusText semibold text={'PDF'} />
                  </Wrapper>
                </TouchableOpacity>
              </Wrapper>
              :
              null
          }
        </Wrapper>
        <Wrapper customStyles={{ position: "relative" }}>
          <TouchableOpacity activeOpacity={0.6} onPress={() => { setIsDownloadVisible(false),setIsReturnsVisible(!isReturnsVisible) }}>
            <Wrapper customStyles={{ padding: responsiveWidth(2.5), borderRadius: borderRadius.normal, borderColor: colors.inputBorder, borderWidth: 1 }}>
              <Image resizeMode='contain' source={require('../../../assets/Images/openfile.png')} style={{ height: responsiveWidth(5), width: responsiveWidth(5) }} />
            </Wrapper>
          </TouchableOpacity>
          {
            isReturnsVisible ?
              <Wrapper position='end' width={responsiveWidth(40)} color={colors.Hard_White} customStyles={{ position: "absolute", top: "95%", zIndex: 1, borderRadius: borderRadius.normal, borderColor: colors.inputBorder, borderWidth: 1 }}>
                {
                  defaultReturns?.map((item: any, index: any) => {
                    return (
                      <>
                        <TouchableOpacity onPress={() => { toggleReturnColums(item) }}>
                          <Wrapper row align='center' customStyles={{ paddingHorizontal: responsiveWidth(2), paddingVertical: responsiveHeight(1), gap: responsiveWidth(1) }}>
                        
                         <Ionicons name={selectedReturn.includes(item?.id) ? 'checkbox' : 'square-outline'} size={responsiveWidth(4)} />
                            <CusText semibold text={item?.name} />
                          </Wrapper>
                        </TouchableOpacity>
                      </>
                    )
                  })
                }

              </Wrapper>
              :
              null
          }
        </Wrapper>
      </Wrapper>
      <Wrapper color='white' >
        <ScrollView horizontal={true}>
          <View style={styles.tableContainer}>
            {renderTableHeader()}
            <FlatList
              data={fundPickerList}
              renderItem={renderFundItem}
              keyExtractor={item => item.id}
              // style={{paddingBottom:responsiveWidth(10)}}
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
        onResetApply={() => {
         
          getFundPickerscheme(search, null, 1, false,null);
        }}
        ListEmptyComponent={
          !loader && (
            <Wrapper align="center">
              <CusText text="No data found." />
            </Wrapper>
          )
        }
      />
       <DownloadProgressModal isVisible={isModalVisible} progress={downloadProgress} />
    </>
  );
};
export default FundPicker;
