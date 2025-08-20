import { useIsFocused, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import PersonalInfo from "./Components/personalInfo";
import AddressDetails from "./Components/addressDetails";
import { formatNumber, getKYC_Details, getKYC_ISMember } from "../../../utils/Commanutils";
import Fatca from "./Components/fatca";
import BankDetails from "./Components/bankDetails";
import NomineeDetails from "./Components/nomineeDetails";
import InPersonVerification from "./Components/inPersonVerification";
import KycComplete from './Components/kycComplete';
import QuickSummary from "./Components/quickSummary";
import KycWebView from "./Components/kycWebView";

const KycDashboard = () => {
    const route: any = useRoute();
    const [selectedTab, setSelectedTab] = useState<any>('');
    const isFocused = useIsFocused();
    useEffect(() => {
        setSelectedTab('')
        if (route?.params?.screen) {
            setSelectedTab(route?.params?.screen)
        } else {
            const step: any = getKYC_ISMember() ? getKYC_Details()?.member_basic_details?.last_kyc_step : getKYC_Details()?.user_basic_details?.last_kyc_step;
            const userDetails: any = getKYC_ISMember() ? getKYC_Details()?.member_basic_details : getKYC_Details()?.user_basic_details;
            console.log('userDetails   1 : ', userDetails);
            if (userDetails?.is_kyc_complete) {
                setSelectedTab('QuickSummary')
                return
            }
            if (step === 3) {
                setSelectedTab('AddressInfo')
                return
            }
            if (step === 4) {
                setSelectedTab('Fatca')
                return
            }
            if (step === 5) {
                setSelectedTab('BankDetails')
                return
            }
            if (step === 6) {
                setSelectedTab('Nominee')
                return
            }
            if (step === 7) {

                // const basicDetails = getKYC_ISMember() ? getKYC_Details()?.member_basic_details : getKYC_Details()?.user_basic_details;

                // if (basicDetails?.isKYCDone && basicDetails?.annualFund === '<50K') {
                //     setSelectedTab('QuickSummary')
                //     return
                // }
                setSelectedTab('InPersonVerification')
                return
            }
            if (step === 8) {
                const basicDetails = getKYC_ISMember() ? getKYC_Details()?.member_basic_details : getKYC_Details()?.user_basic_details;

                if (basicDetails?.isKYCDone && basicDetails?.annualFund === '<50K') {
                    setSelectedTab('QuickSummary')
                    return
                } else {
                    setSelectedTab('QuickSummary')
                    return
                }
            }
            setSelectedTab('PersonalInfo')
            // setSelectedTab('InPersonVerification')
        }
    }, [isFocused]);
    return (
        <>
            {selectedTab == 'PersonalInfo' ? (
                <PersonalInfo selectedTab={selectedTab}
                    setSelectedTab={(value: string) => setSelectedTab(value)} />) : null}
            {selectedTab == 'AddressInfo' ? (
                <AddressDetails selectedTab={selectedTab}
                    setSelectedTab={(value: string) => setSelectedTab(value)} />) : null}
            {selectedTab == 'Fatca' ? (
                <Fatca selectedTab={selectedTab}
                    setSelectedTab={(value: string) => setSelectedTab(value)} />) : null}
            {selectedTab == 'BankDetails' ? (
                <BankDetails selectedTab={selectedTab}
                    setSelectedTab={(value: string) => setSelectedTab(value)} />) : null}
            {selectedTab == 'Nominee' ? (
                <NomineeDetails selectedTab={selectedTab}
                    setSelectedTab={(value: string) => setSelectedTab(value)} />) : null}
            {selectedTab == 'InPersonVerification' ? (
                <InPersonVerification selectedTab={selectedTab}
                    setSelectedTab={(value: string) => setSelectedTab(value)} />) : null}
            {selectedTab == 'KycComplete' ? (
                <KycComplete />) : null}
            {selectedTab == 'QuickSummary' ? (
                <QuickSummary selectedTab={selectedTab}
                    setSelectedTab={(value: string) => setSelectedTab(value)} />) : null}
            {selectedTab == 'KycWebView' ? (
                <KycWebView selectedTab={selectedTab}
                    setSelectedTab={(value: string) => setSelectedTab(value)} />) : null}
        </>
    )
}

export default KycDashboard
