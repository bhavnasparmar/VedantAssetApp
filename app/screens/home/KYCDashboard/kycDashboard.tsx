import { useIsFocused, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import PersonalInfo from "./Components/personalInfo";
import AddressDetails from "./Components/addressDetails";
import { getKYC_Details } from "../../../utils/Commanutils";

const KycDashboard = () => {
    const route: any = useRoute();
    const [selectedTab, setSelectedTab] = useState<any>('');
    const isFocused = useIsFocused();
    useEffect(() => {
        setSelectedTab('')
        if (route?.params?.screen) {
            setSelectedTab(route?.params?.screen)
        } else {
            const step: any = getKYC_Details()?.user_basic_details?.last_kyc_step;
            if (step === 3) {
                setSelectedTab('AddressInfo')
                return
            }
            setSelectedTab('PersonalInfo')
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
        </>
    )
}

export default KycDashboard