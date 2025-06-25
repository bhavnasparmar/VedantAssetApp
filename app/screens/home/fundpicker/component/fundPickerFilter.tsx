import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import Wrapper from '../../../../ui/wrapper';
import CusText from '../../../../ui/custom-text';
import {
  borderRadius,
  colors,
  responsiveHeight,
  responsiveWidth,
} from '../../../../styles/variables';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DropDown from '../../../../ui/dropdown';
import CusButton from '../../../../ui/custom-button';
import Spacer from '../../../../ui/spacer';
import { useIsFocused } from '@react-navigation/native';
import { Switch, TouchableOpacity, ScrollView, View } from 'react-native';

import { MultiSelect } from 'react-native-element-dropdown';
import { styles } from './fundPickerFilterStyle';
import LinearGradient from 'react-native-linear-gradient';

const FundPickerFilter = ({
  filterObj,
  isVisible,
  setisVisible,
  categoryData,
  natureList,
  amcList,
  onFilterApply,
}: any) => {
  const [selectCategory, setSelectCategory] = useState<any>([]);
  const [selectSubCategory, setSelectSubCategory] = useState<any>([]);
  const [SubCategories, setSubCategories] = useState<any>([]);
  const [returnData, setReturnData] = useState<any>([
    {
      id:1,
      name:'Absolute',
    },
    {
      id:2,
      name:'Annualised',
    },
  ]);
  const [type, setType] = useState<any>([
    {
      id:1,
      name:'SIP',
    },
    {
      id:2,
      name:'Lumpsum',
    },
  ]);
   const [included, setIncluded] = useState<any>([
    {
      id:1,
      name:'Closed ended',
    },
    {
      id:2,
      name:'Open ended',
    },
    {
      id:3,
      name:'Index',
    },
    {
      id:4,
      name:'ETF',
    },
  ]);
  const nameToKeyMap: any = {
  'Closed ended': 'selectCloseEnded',
  'Open ended': 'selectOpenEnded',
  'Index': 'selectIndex',
  'ETF': 'selectETF',
};
  const [selectNature, setSelectNature] = useState<number | null>(null);
  const [selectReturn, setSelectReturn] = useState<number | null>(null);
  const [selectIncluded, setSelectIncluded] = useState<any>([]);
  const [selectType, setSelectType] = useState<number | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isSubmited, setisSubmited] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [selectAmc, setSelectAmc] = useState<any>(null);
  const [activeList, setActiveList] = useState<any>(null);
  const [selectInclude, setSelectInclude] = useState<any>({
    selectCloseEnded: false,
    selectOpenEnded: false,
    selectIndex: false,
    selectETF: false,
  });

  console.log('Category Data ====>>>: ', categoryData)

  useEffect(() => {
    if (isVisible && filterObj) {
      setSelectCategory(filterObj?.categoryid || []);
      setSelectSubCategory(filterObj?.subcategory_id || []);
      setSelectAmc(filterObj?.amc_id || []);
      setSelectNature(filterObj?.option_id || null);
    }
  }, [isVisible]);

  const clearModal = () => {
    setisVisible(false);
  };

  const handleCategoryChange = (categoryId: number) => {
    const category = categoryData.find(
      (cat: any) => Number(cat.ID) === categoryId,
    );
    const subCategoryIds =
      category?.SchemeSubcategories?.map((sub: any) => Number(sub.Id)) || [];

    if (selectCategory.includes(categoryId)) {
      // Deselect category and its subcategories
      setSelectCategory(
        selectCategory.filter((id: number) => id !== categoryId),
      );

      setSelectSubCategory(
        selectSubCategory.filter((id: number) => !subCategoryIds.includes(id)),
      );
    } else {
      // Select category and its subcategories
      setSelectCategory([...selectCategory, categoryId]);
      setSelectSubCategory([
        ...new Set([...selectSubCategory, ...subCategoryIds]),
      ]);
    }
  };

  const handleSubCategoryChange = (subCategoryId: number) => {
    let updatedSubCategories;
    if (selectSubCategory.includes(subCategoryId)) {
      // Deselect subcategory
      updatedSubCategories = selectSubCategory.filter(
        (id: number) => id !== subCategoryId,
      );
      setSelectSubCategory(updatedSubCategories);
    } else {
      // Select subcategory
      updatedSubCategories = [...selectSubCategory, subCategoryId];
      setSelectSubCategory(updatedSubCategories);

      // Auto-select parent category if not selected
      const parentCategory = categoryData.find((cat: any) =>
        cat.SchemeSubcategories?.some(
          (sub: any) => Number(sub.Id) === subCategoryId,
        ),
      );

      if (
        parentCategory &&
        !selectCategory.includes(Number(parentCategory.ID))
      ) {
        setSelectCategory([...selectCategory, Number(parentCategory.ID)]);
      }
    }
  };
  const resetFilter = () => {
    setSelectAmc([]);
    setSelectCategory([]);
    setSelectNature(null);
    setSelectSubCategory([]);
  };

  const toggleAssetClass = (data: any) => {
    if (SubCategories?.Name === data?.Name) {
      setSubCategories([])
    } else {
      setSubCategories(data)
    }

  }

const toggleIncluded = (item: any) => {
  const key = nameToKeyMap[item.name];
  setSelectInclude((prev: any) => ({
    ...prev,
    [key]: !prev[key],
  }));
};

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
      useNativeDriver={true}
      style={{ marginRight: 0 }}>
      <Wrapper
        customStyles={{
          flex: 1,
          backgroundColor: colors.Hard_White,
          borderTopLeftRadius: borderRadius.normal,
          borderBottomLeftRadius: borderRadius.normal,
          paddingBottom: responsiveHeight(2),
        }}>
        {/* Header */}
        <Wrapper
          customStyles={{
            paddingHorizontal: responsiveWidth(3)
          }}
        >
          <Wrapper customStyles={{ paddingTop: responsiveWidth(3) }} row align='center' justify='apart'>
            <CusText size="N" text="Filter" semibold />
            <TouchableOpacity
              onPress={() => {
                clearModal();
              }}>
              <IonIcon
                name="close-outline"
                size={responsiveWidth(7)}
                color={colors.blackd}
                onPress={clearModal}
              />
            </TouchableOpacity>
          </Wrapper>
          <Wrapper align='center'>
            <LinearGradient
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[colors.primary, colors.primary, colors.primary]}
              style={{ width: '100%', height: 1, opacity: 0.5 }}></LinearGradient>
          </Wrapper>
        </Wrapper>

        {/* Content */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: responsiveWidth(4),
            paddingTop: responsiveHeight(1),
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Asset Class */}
          <CusText semibold size="N" text="Asset Class" />

          <Wrapper customStyles={{ marginTop: responsiveWidth(1) }}>
            {
              categoryData?.map((citem: any, cindex: any) => {
                return (
                  <>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => { toggleAssetClass(citem) }}>
                      <Wrapper customStyles={{ paddingHorizontal: responsiveWidth(2.5), paddingVertical: responsiveWidth(1.5), borderRadius: borderRadius.middleSmall }} row justify='apart' align='center' color={colors.headerlist}>
                        <CusText medium size='SS' text={citem?.Name} />
                        <IonIcon name='caret-down-outline' size={responsiveWidth(5)} />
                      </Wrapper>
                    </TouchableOpacity>
                    {
                      SubCategories?.Name === citem?.Name && (
                        <>
                          <Spacer y='XXS' />
                          <TouchableOpacity activeOpacity={0.6} onPress={() => { handleCategoryChange(Number(citem.ID)); }}>
                            <Wrapper width={responsiveWidth(40)} row align='start' customStyles={{ paddingBottom: responsiveWidth(2), paddingHorizontal: responsiveWidth(2) }}>
                              <IonIcon name={selectCategory.includes(Number(citem.ID))
                                ? "checkbox-outline" : 'square-outline'} size={responsiveWidth(4)} />
                              {/* checkbox-outline */}
                              <Spacer x='XXS' />
                              <Wrapper customStyles={{}}>
                                <CusText medium color={colors.primary} size='S' text={'Select all'} />
                              </Wrapper>

                            </Wrapper>
                          </TouchableOpacity>
                          <Wrapper height={responsiveWidth(50)}>
                            <ScrollView nestedScrollEnabled={true}>
                              <Wrapper row customStyles={{ flexWrap: 'wrap', paddingLeft: responsiveWidth(5) }} >
                                {
                                  SubCategories?.SchemeSubcategories?.map((sitem: any, sindex: any) => {
                                    return (
                                      <>
                                        <TouchableOpacity activeOpacity={0.6} onPress={() => {  handleSubCategoryChange(Number(sitem.Id)); }}>
                                          <Wrapper width={responsiveWidth(40)} row align='start' customStyles={{ paddingVertical: responsiveWidth(1) }}>
                                            <IonIcon name={selectSubCategory.includes(Number(sitem.Id))
                                              ? "checkbox-outline" : 'square-outline'} size={responsiveWidth(4)} />
                                            <Spacer x='XXS' />
                                            <Wrapper width={responsiveWidth(30)} customStyles={{}}>
                                              <CusText size='S' text={sitem?.Name} />
                                            </Wrapper>

                                          </Wrapper>
                                        </TouchableOpacity>
                                      </>
                                    )
                                  })
                                }
                              </Wrapper>
                            </ScrollView>
                          </Wrapper>
                        </>
                      )
                    }
                    {
                      cindex + 1 < categoryData?.length && (
                        <>
                          <Spacer y='XXS' />
                        </>
                      )
                    }
                  </>
                )
              })
            }
          </Wrapper>
          <Spacer y="XXS" />
          {/* Nature */}
          <CusText semibold size="N" text="Nature" />
          <Wrapper row customStyles={{ marginTop: responsiveWidth(1),  }}>
            {natureList.map((item: any, nindex: any) => (
              <>
                <TouchableOpacity
                  onPress={() => {
                    if (item?.id == selectNature) {
                      setSelectNature(null);
                    } else {
                      setSelectNature(item.id);
                    }
                  }}>
                  <Wrapper
                    color={
                      item?.id == selectNature
                        ? colors.primary1
                        : colors.headerlist
                    }
                    row
                    customStyles={{
                      // borderWidth: 1,
                      paddingHorizontal: responsiveWidth(5),
                      paddingVertical: responsiveWidth(2.5),
                      // marginRight: responsiveWidth(2),
                      borderRadius: borderRadius.middleSmall,
                      borderColor: colors.lightGray,
                    }}>
                    <CusText
                      size='S'
                      semibold
                      color={
                        item?.id == selectNature
                          ? colors.Hard_White
                          : colors.Hard_Black
                      }
                      text={item.option}
                    />
                  </Wrapper>
                </TouchableOpacity>
                {
                  nindex + 1 < categoryData?.length && (
                    <>
                      <Spacer x='XXS' />
                    </>
                  )
                }
              </>
            ))}
          </Wrapper>

          <Spacer y="XXS" />
            {/* Returns */}
          <CusText semibold size="N" text="Returns" />
          <Wrapper customStyles={{ marginTop: responsiveWidth(1), }}>
            <Wrapper row>
              {returnData.map((item: any, nindex: any) => (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      if (item?.id == selectReturn) {
                        setSelectReturn(null);
                      } else {
                        setSelectReturn(item.id);
                      }
                    }}>
                    <Wrapper
                      color={
                        item?.id == selectReturn
                          ? colors.primary1
                          : colors.headerlist
                      }
                      row
                      customStyles={{
                        // borderWidth: 1,
                        paddingHorizontal: responsiveWidth(5),
                        paddingVertical: responsiveWidth(2.5),
                        // marginRight: responsiveWidth(2),
                        borderRadius: borderRadius.middleSmall,
                        borderColor: colors.lightGray,
                      }}>
                      <CusText
                        size='S'
                        semibold
                        color={
                          item?.id == selectReturn
                            ? colors.Hard_White
                            : colors.Hard_Black
                        }
                        text={item.name}
                      />
                    </Wrapper>
                  </TouchableOpacity>
                  {
                    nindex + 1 < categoryData?.length && (
                      <>
                        <Spacer x='XXS' />
                      </>
                    )
                  }
                </>
              ))}
            </Wrapper>
            <Wrapper row>

              {type.map((item: any, nindex: any) => (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      if (item?.id == selectType) {
                        setSelectType(null);
                      } else {
                        setSelectType(item.id);
                      }
                    }}>
                    <Wrapper
                      // color={
                      //   item?.id == selectReturn
                      //     ? colors.primary1
                      //     : colors.headerlist
                      // }
                      row
                      align='center'

                      position='start'
                      customStyles={{
                        // borderWidth: 1,
                        paddingHorizontal: responsiveWidth(1),
                        paddingVertical: responsiveWidth(2.5),
                        // marginRight: responsiveWidth(2),
                        borderRadius: borderRadius.middleSmall,
                        borderColor: colors.lightGray,
                        gap: responsiveWidth(1)
                      }}>
                      <IonIcon color={item?.id == selectType
                        ? colors.primary1
                        : colors.Hard_Black} name={item?.id == selectType ? 'radio-button-on-outline' : 'radio-button-off-outline'} size={responsiveWidth(6)} />
                      <CusText
                        size='S'
                        semibold
                        color={
                          item?.id == selectType
                            ? colors.primary1
                            : colors.Hard_Black
                        }
                        text={item.name}
                      />
                    </Wrapper>
                  </TouchableOpacity>
                  {
                    nindex + 1 < categoryData?.length && (
                      <>
                        <Spacer x='XXS' />
                      </>
                    )
                  }
                </>
              ))}
            </Wrapper>

          </Wrapper>

           <Spacer y="XXS" />
            {/* Returns */}
          <CusText semibold size="N" text="Include" />
          <Wrapper row customStyles={{flexWrap:'wrap',marginTop:responsiveWidth(1)}}>
          {
            included?.map((Iitem: any, Iinex: any) => {
               const key = nameToKeyMap[Iitem.name];
  const isSelected = selectInclude[key];

              return (
                <>
                  <TouchableOpacity activeOpacity={0.6} onPress={() => { toggleIncluded(Iitem) }}>
                    <Wrapper width={responsiveWidth(40)} row align='start' customStyles={{ paddingVertical: responsiveWidth(1) }}>
                      <IonIcon color={isSelected ? colors.primary1 : colors.Hard_Black} name={isSelected ? 'checkbox' : 'square-outline'} size={responsiveWidth(5)} />
                      <Spacer x='XXS' />
                      <Wrapper width={responsiveWidth(30)} customStyles={{}}>
                        <CusText color={isSelected ? colors.primary1 : colors.Hard_Black} size='SN' text={Iitem?.name} />
                      </Wrapper>

                    </Wrapper>
                  </TouchableOpacity>
                </>
              )
            })
          }
          </Wrapper>

            <Spacer y="XXS" />
          {/* AMC Dropdown */}
          <CusText semibold size="N" text="AMC" />
          <Wrapper position='center' customStyles={{ marginTop: responsiveWidth(1), paddingHorizontal: responsiveWidth(1.5) }}>
            <DropDown
              suffixIcon={selectAmc ? 'close-outline' : null}
              suffixColor={colors.primary}
              suffixPress={() => {
                if (selectAmc) {
                  setSelectAmc([]);
                }
              }}
              suffixStyle={[
                styles.clear,
                {
                  backgroundColor: 'transparent',
                  height: responsiveWidth(9),
                  position: 'absolute',
                  right: 30,
                },
              ]}
              multiSelection={true}
              // label="AMC"
              width={responsiveWidth(87)}
              placeholder={'Select AMC'}
              data={amcList}
              valueField="Name"
              labelField="Name"
              value={selectAmc}
              // disable={!FieldsEdit}
              onChange={(item: any) => {
                console.log('item----', item);
                setSelectAmc(item);
                //console.log(item);
                //setForm({...Form, organizationId: item});
              }}
            />
          </Wrapper>


          <Spacer y="S" />
        </ScrollView>

        {/* Apply Button */}
        <Wrapper row justify="center">
          <CusButton
            width={responsiveWidth(40)}
            height={responsiveHeight(5)}
            title="Reset"
            lgcolor1={colors.Hard_White}
            lgcolor2={colors.Hard_White}
            textcolor={colors.gray}
            position="center"
            textSize='SS'
            radius={borderRadius.middleSmall}
            buttonStyle={{
              borderWidth:1,
              borderColor:colors.gray
            }}
            onPress={resetFilter}
          />
          <Spacer x="S" />
          <CusButton
            loading={loader}
            width={responsiveWidth(40)}
            height={responsiveHeight(5)}
            title="Apply"
            lgcolor1={colors.transparent}
            lgcolor2={colors.transparent}
            position="center"
              textSize='SS'
            radius={borderRadius.middleSmall}
            onPress={() => {
              onFilterApply({
                categoryid: selectCategory,
                subcategory_id: selectSubCategory,
                amc_id: selectAmc,
                option_id: selectNature,
                selectInclude:selectInclude
              });
              setisVisible(false);
            }}
          />
        </Wrapper>
      </Wrapper>
    </Modal>
  );
};

export default FundPickerFilter;
