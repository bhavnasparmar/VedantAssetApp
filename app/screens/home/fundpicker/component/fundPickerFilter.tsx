import React, {useEffect, useState} from 'react';
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
import {useIsFocused} from '@react-navigation/native';
import {Switch, TouchableOpacity, ScrollView, View} from 'react-native';
import {styles} from './fundPickerFilterStyle';
import { MultiSelect } from 'react-native-element-dropdown';

const FundPickerFilter = ({
  isVisible,
  setisVisible,
  categoryData,
  natureList,
  amcList,
  setAmcList,
  applyFilter,
}: any) => {
  const [selectCategory, setSelectCategory] = useState<any>([]);
  const [selectSubCategory, setSelectSubCategory] = useState<any>([]);
  const [selectNature, setSelectNature] = useState<number | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isSubmited, setisSubmited] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [selectAmc, setSelectAmc] = useState<any>(null);

  console.log('amcList----', amcList);
  const months = [
    {id: 1, Name: 'Months'},
    {id: 2, Name: 'Year'},
  ];

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

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
      useNativeDriver={true}
      style={{margin: 0}}>
      <Wrapper
        customStyles={{
          flex: 1,
          backgroundColor: colors.Hard_White,
          borderRadius: borderRadius.normal,
          paddingBottom: responsiveHeight(2),
        }}>
        {/* Header */}
        <Wrapper
          row
          justify="apart"
          align="center"
          customStyles={{
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveHeight(2),
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
          <CusText size="N" text="Filter" semibold />
          <TouchableOpacity
            onPress={() => {
              clearModal();
            }}>
            <IonIcon
              name="close-outline"
              size={30}
              color={colors.blackd}
              onPress={clearModal}
            />
          </TouchableOpacity>
        </Wrapper>

        {/* Content */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: responsiveWidth(4),
            paddingTop: responsiveHeight(1),
          }}
          showsVerticalScrollIndicator={false}>
          {/* Asset Class */}
          <CusText semibold size="N" text="Asset Class" />

          <Wrapper>
            {categoryData.map((category: any) => (
              <>
                <Wrapper row>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      handleCategoryChange(Number(category.ID));
                    }}>
                    <IonIcon
                      name={
                        selectCategory.includes(Number(category.ID))
                          ? 'checkmark-circle'
                          : 'ellipse-outline'
                      }
                      size={responsiveWidth(6)}
                      color={
                        selectCategory.includes(Number(category.ID))
                          ? colors.primary1
                          : colors.gray
                      }></IonIcon>
                  </TouchableOpacity>
                  <Spacer x="XS" />
                  <CusText size="SS" semibold text={category?.Name || ''} />
                </Wrapper>
                {/* <Spacer y='XXS' /> */}
                {category?.SchemeSubcategories?.length > 0 && (
                  <Wrapper row customStyles={{flexWrap: 'wrap'}}>
                    {category.SchemeSubcategories.map((subCategory: any) => (
                      <Wrapper row width={responsiveWidth(46)}>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            handleSubCategoryChange(Number(subCategory.Id));
                          }}>
                          <IonIcon
                            name={
                              selectSubCategory.includes(Number(subCategory.Id))
                                ? 'checkmark-circle'
                                : 'ellipse-outline'
                            }
                            size={responsiveWidth(5)}
                            color={
                              selectSubCategory.includes(Number(subCategory.Id))
                                ? colors.primary1
                                : colors.gray
                            }></IonIcon>
                        </TouchableOpacity>
                        <Spacer x="XS" />
                        <CusText text={subCategory?.Name || ''} />
                      </Wrapper>
                    ))}
                  </Wrapper>
                )}
                <Spacer y="XXS" />
              </>
            ))}
          </Wrapper>
          <Spacer y="S" />

          {/* Nature */}
          <CusText semibold size="N" text="Nature" />
          <Spacer y="XS" />
          <Wrapper row>
            {natureList.map((item: any) => (
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
                      : colors.transparent
                  }
                  row
                  customStyles={{
                    borderWidth: 1,
                    paddingHorizontal: responsiveWidth(4),
                    paddingVertical: responsiveWidth(2),
                    marginRight: responsiveWidth(2),
                    borderRadius: borderRadius.medium,
                    borderColor: colors.lightGray,
                  }}>
                  <CusText
                    color={
                      item?.id == selectNature
                        ? colors.Hard_White
                        : colors.Hard_Black
                    }
                    text={item.option}
                  />
                </Wrapper>
              </TouchableOpacity>
            ))}
          </Wrapper>
          <Spacer y="S" />

          {/* AMC Dropdown */}
          <CusText semibold size="N" text="AMC" />
          <Spacer y="XS" />
          {/* <DropDown
            multiSelection
            search
            data={amcList}
            placeholder="Select AMC"
            width={'100%'}
            placeholdercolor={colors.gray}
            value={selectAmc}
            fieldColor={colors.inputBg}
            valueField="Name"
            labelField="Name"
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item: any) => setMYType(item?.id)}
            onClear={() => setMYType('')}
          /> */}

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
            width={responsiveWidth(90)}
            placeholder={'Select AMC'}
            data={amcList}
            valueField="Name"
            labelField="Name"
            value={selectAmc}
            // disable={!FieldsEdit}
            onChange={(item: any) => {
              console.log("item----",item)
              setSelectAmc(item);
              //console.log(item);
              //setForm({...Form, organizationId: item});
            }}
          />

          {/* <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          data={amcList}
          labelField="Name"
          valueField="id"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={selectAmc}
          onChange={item => {
            setSelectAmc(item);
          }}
        
          selectedStyle={styles.selectedStyle}
        /> */}

          <Spacer y="S" />
        </ScrollView>

        {/* Apply Button */}
        <CusButton
          loading={loader}
          width={'90%'}
          height={responsiveHeight(6)}
          title="Apply"
          lgcolor1={colors.primary}
          lgcolor2={colors.primary}
          position="center"
          radius={borderRadius.ring}
          onPress={() => {
            setisVisible(false);
          }}
        />
      </Wrapper>
    </Modal>
  );
};

export default FundPickerFilter;
