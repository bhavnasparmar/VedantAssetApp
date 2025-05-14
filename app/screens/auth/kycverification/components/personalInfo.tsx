import React, { useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import IonIcon from 'react-native-vector-icons/Ionicons';
import { AppearanceContext } from "../../../../context/appearanceContext";
import { borderRadius, marginHorizontal, responsiveWidth } from "../../../../styles/variables";
import InputField from "../../../../ui/InputField";
import Container from "../../../../ui/container";
import CusButton from "../../../../ui/custom-button";
import CusText from "../../../../ui/custom-text";
import Spacer from "../../../../ui/spacer";
import Wrapper from "../../../../ui/wrapper";
import HeaderComponent from "../headercomponent/headercomponent";
import { styles } from "../kycverificationStyles";
// import DropDown from "../../../../ui/dropdown";
import { TouchableOpacity } from "react-native";
import DropDown from "../../../../ui/dropdown";

const PersonalInformation = ({ setSelectedTab }: any) => {
  const { colors }: any = React.useContext(AppearanceContext);
  const [addressProof, setaddressProof] = useState([
    {
      value: 'adhaarCard',
      Address: 'Adhaar Card'
    },
    {
      value: 'Drivinglicense',
      Address: 'Driving License'
    },
  ])
  return (
    <>
      <HeaderComponent />
      <LinearGradient
        style={styles.subHeader}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={[
          colors.gradient3,
          colors.gradient4,
          colors.gradient5,
        ]}>
        <Wrapper row justify="apart" customStyles={styles.HeaderRow}>
          <TouchableOpacity onPress={() => { setSelectedTab('addressDetailRoute') }}>
            <IonIcon name={'chevron-back-outline'} color={colors.primary1} size={25} />
          </TouchableOpacity>
          <CusText text={'Personal Information'} color={colors.Hard_white} size='N' />
          <TouchableOpacity onPress={() => { setSelectedTab('nomineeRoute') }}>
            <IonIcon name={'chevron-forward-outline'} color={colors.primary1} size={25} />
          </TouchableOpacity>
        </Wrapper>
      </LinearGradient>
      <Container Xcenter>
        <Wrapper position="center">
          <CusText
            customStyles={{
              paddingTop: marginHorizontal.extraSmall,
              paddingBottom: responsiveWidth(2),
            }}
            text={'Your Gender'}
            size="XS"
            color={colors.gray}
            medium
          />
          <Wrapper row>
            <Wrapper customStyles={styles.checkbox}>
              <CusText text="Male" size='SN'
                customStyles={styles.subtitle} position="center" color={colors.black} />
            </Wrapper>
            <Wrapper customStyles={styles.checkbox}>
              <CusText text="Female" size='SN'
                customStyles={styles.subtitle} position="center" color={colors.black} />
            </Wrapper>
            <Wrapper customStyles={styles.checkbox}>
              <CusText text="Transgender" size='SN'
                customStyles={styles.subtitle} position="center" color={colors.black} />
            </Wrapper>
          </Wrapper>
          <Spacer y='XXS' />
          <CusText
            customStyles={{
              paddingTop: marginHorizontal.extraSmall,
              paddingBottom: responsiveWidth(2),
            }}
            text={'Marital Status'}
            size="XS"
            color={colors.gray}
            medium
          />
          <Spacer y='XXS' />
          <Wrapper row>
            <Wrapper customStyles={styles.checkbox}>
              <CusText text="Married" size='SN'
                customStyles={styles.subtitle} position="center" color={colors.black} />
            </Wrapper>
            <Wrapper customStyles={styles.checkbox}>
              <CusText text="Unmarried" size='SN'
                customStyles={styles.subtitle} position="center" color={colors.black} />
            </Wrapper>
            <Wrapper customStyles={styles.checkbox}>
              <CusText text="Other" size='SN'
                customStyles={styles.subtitle} position="center" color={colors.black} />
            </Wrapper>
          </Wrapper>

          <InputField
            label="Mother's Name"
            width={responsiveWidth(90)}
            placeholder="Enter Your Email"
            value={'Sunita Kamat'}
            labelStyle={{ color: colors.gray }}
            onChangeText={(value: string) => { }}
            borderColor={colors.gray}
          />
          <InputField
            label="Father's Name"
            width={responsiveWidth(90)}
            placeholder="Enter Your Email"
            value={'Sunil Kamat'}
            labelStyle={{ color: colors.gray }}
            onChangeText={(value: string) => { }}
            borderColor={colors.gray}
          />

          <DropDown
            data={addressProof}
            placeholder={'Select Occupation'}
            placeholdercolor={colors.gray}
            labelText="Occupation"
            required
            value={''}
            valueField="value"
            labelField={'Address'}
            onChange={(data: any) => {

            }}
            onClear={() => {

            }}
          />
          <DropDown
            data={addressProof}
            placeholder={'Select Address Type'}
            placeholdercolor={colors.gray}
            labelText="Address Type"
            required
            value={''}
            valueField="value"
            labelField={'Address'}
            onChange={(data: any) => {

            }}
            onClear={() => {

            }}
          />
          <DropDown
            data={addressProof}
            placeholder={'Select Annual Income'}
            placeholdercolor={colors.gray}
            labelText="Annual Income"
            required
            value={''}
            valueField="value"
            labelField={'Address'}
            onChange={(data: any) => {

            }}
            onClear={() => {

            }}
          />
          <DropDown
            data={addressProof}
            placeholder={'Select Source of Income'}
            placeholdercolor={colors.gray}
            labelText="Source of Income"
            required
            value={''}
            valueField="value"
            labelField={'Address'}
            onChange={(data: any) => {

            }}
            onClear={() => {

            }}
          />
        </Wrapper>
        <Spacer y='N' />

        <CusButton
          customStyle={{ borderRadius: borderRadius.medium }}
          width={responsiveWidth(90)}
          title="Next"
          lgcolor1={colors.primary}
          lgcolor2={colors.secondry}
          position="center"
          onPress={() => { setSelectedTab('nomineeRoute') }}
        />
      </Container>
    </>
  )
}
export default PersonalInformation