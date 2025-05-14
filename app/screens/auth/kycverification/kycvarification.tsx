import { useIsFocused, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import ProofOfIdentity from "./components/ProofofIdentity";
import AddressDetails from "./components/addressDetails";
import BankAccountDetail from "./components/bankAccountDetails";
import CapturePhoto from "./components/capturePhoto";
import CaptureVideo from "./components/captureVideo";
import NomineeDetail from "./components/nomineeDetails";
import PersonalInformation from "./components/personalInfo";
import ProofOfAddress from "./components/proofofAddress";
import Success from "./components/sucess";
import UploadSignature from "./components/uploadSignature";

const Kycvarification = () => {
  const route: any = useRoute();
  const [selectedTab, setSelectedTab] = useState<any>('');
 const isFocused = useIsFocused();
  useEffect(() => {
    setSelectedTab('')
    if (route?.params?.screen) {
      setSelectedTab(route?.params?.screen)
    } else {
      setSelectedTab('proofofIdentity')
    }
  }, [isFocused]);

  return (
    <>
      {selectedTab == 'PersonalRoute' ? (
        <PersonalInformation selectedTab={selectedTab}
          setSelectedTab={(value: string) => setSelectedTab(value)} />) : null}
      {selectedTab == 'proofofIdentity' ?
        <ProofOfIdentity
          selectedTab={selectedTab}
          step={4}
          setSelectedTab={(value: string) => setSelectedTab(value)} /> : null}
      {selectedTab == "proofAddressRoute" ?
        <ProofOfAddress
          selectedTab={selectedTab}
          step={5}
          setSelectedTab={(value: string) => setSelectedTab(value)} /> : null}
      {selectedTab == 'addressDetailRoute' ?
        <AddressDetails
          selectedTab={selectedTab}
          step={6}
          setSelectedTab={(value: string) => setSelectedTab(value)} /> : null}
      {selectedTab == 'nomineeRoute' ?
        <NomineeDetail
          selectedTab={selectedTab}
          step={7}
          setSelectedTab={(value: string) => setSelectedTab(value)} /> : null}
      {selectedTab == 'bankDetailRoute' ?
        <BankAccountDetail
          selectedTab={selectedTab}
          step={8}
          setSelectedTab={(value: string) => setSelectedTab(value)} /> : null}
      {selectedTab == 'uploadSignatureRoute' ?
        <UploadSignature
          selectedTab={selectedTab}
          step={route?.params?.step}
          setSelectedTab={(value: string) => setSelectedTab(value)} /> : null}
      {selectedTab == "capturePhotoRoute" ?
        <CapturePhoto selectedTab={selectedTab}
          step={route?.params?.step}
          setSelectedTab={(value: string) => setSelectedTab(value)} /> : null}
      {selectedTab == 'captureVideoRoute' ?
        <CaptureVideo selectedTab={selectedTab}
          step={9}
          setSelectedTab={(value: string) => setSelectedTab(value)} /> : null}
      {selectedTab == 'successRoute' ?
        <Success /> : null}
    </>
  )
}
export default Kycvarification