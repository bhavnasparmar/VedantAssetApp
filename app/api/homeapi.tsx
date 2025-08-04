import API from "../utils/API";
import { API_URL, endPoints, promiseHandler } from "../utils/Commanutils";



export const getAllGoalTypeApi = () => {

    const promise = API.get(`${API_URL}${endPoints.getAllGoalType}`);
    return promiseHandler(promise);
};

export const getAllongoingGoal = () => {

    const promise = API.get(`${API_URL}${endPoints.getAllGoalPalnList}`);
    return promiseHandler(promise);
};

export const getRiskProfileInvestorAPi = () => {

    const promise = API.get(`${API_URL}${endPoints.getRiskProfileInvestor}`);
    return promiseHandler(promise);
};

export const getAllRiskQuestionAPi = () => {

    const promise = API.get(`${API_URL}${endPoints.getAllRiskQuestion}`);
    return promiseHandler(promise);
};
export const addRiskProfileQuestionAnswerApi = (payload: any) => {

    const promise = API.post(`${API_URL}${endPoints.addRiskProfileQuestionAnswer}`, payload);
    return promiseHandler(promise);
};


export const getRiskCatWiseSchemeDataAPi = (payload: any) => {
    console.log('get Risk Scheme API ', `${API_URL}${endPoints.getRiskCatWiseSchemeData}/${payload}`)
    const promise = API.get(`${API_URL}${endPoints.getRiskCatWiseSchemeData}/${payload}`);
    return promiseHandler(promise);
};

// fund picker Api
export const getPlanDataApi = (payload: any) => {
    const promise = API.get(`${API_URL}${endPoints.getGoalPlanWiseSchemeData}/${payload}`);
    return promiseHandler(promise);
};

export const saveGoalDataApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.addGoalPlanData}`, payload);
    return promiseHandler(promise);
};

export const saveGoalDataAllocApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.adduseralloc}`, payload);
    return promiseHandler(promise);
};

export const deleteGoalPlanApi = (payload: any) => {
    const promise = API.delete(`${API_URL}${endPoints.deleteGoal}/${payload?.id}`);
    return promiseHandler(promise);
};

export const getSuggestedSchemesApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.getSuggestedSchemes}`, payload);
    return promiseHandler(promise);
};




export const getFundPickerListDataApi = (payload: any) => {
    console.log('get getFundPickerListDataApi Scheme API111', `${API_URL}${endPoints.getFundPickerListData}?filters=${JSON.stringify(payload?.filters)}&limit=${payload?.limit}&sort=${JSON.stringify(payload?.sort)}&page=${payload?.page}`)
    // const promise = API.get(`${API_URL}${endPoints.getFundPickerListData}`,{params:payload});
    const promise = API.get(`${API_URL}${endPoints.getFundPickerListData}?filters=${JSON.stringify(payload?.filters)}&limit=${payload?.limit}&sort=${JSON.stringify(payload?.sort)}&page=${payload?.page}`);


    return promiseHandler(promise);
};

export const downloadPDFApi = (payload: any) => {

    const promise = API.post(`${API_URL}${endPoints.downloadPDF}`, payload);
    return promiseHandler(promise);
};

export const downloadEXCELApi = (payload: any) => {

    const promise = API.post(`${API_URL}${endPoints.downloadExcel}`, payload);
    return promiseHandler(promise);
};

export const getCategoryWithSubCategoryApi = () => {
    const promise = API.get(`${API_URL}${endPoints.getCategoryWithSubCategoryData}`);
    return promiseHandler(promise);
};

export const getNatureApi = () => {
    const promise = API.get(`${API_URL}${endPoints.getNatureData}`);
    return promiseHandler(promise);
};
export const getAmcApi = () => {
    const promise = API.get(`${API_URL}${endPoints.getAmcListData}`);
    return promiseHandler(promise);
};

export const goalcal = (payload: any) => {

    const promise = API.post(`${API_URL}${endPoints.goalcalss}`, payload);
    return promiseHandler(promise);
};

export const CheckKycStatus = (payload: any) => {

    const promise = API.post(`${API_URL}${endPoints.kycStatus}`, payload);
    return promiseHandler(promise);
};

export const ValidateStatus = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.kycotpStatus}`, payload);
    return promiseHandler(promise);
};

export const ValidateOtpVerify = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.kycotpVerify}`, payload);
    return promiseHandler(promise);
};

export const CreateKYCInvs = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.createKycInv}`, payload);
    return promiseHandler(promise);
};

export const CreateKYCInvsSignZy = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.signZyApi}`, payload);
    return promiseHandler(promise);
};

export const initiateDlConsent = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.initiateDlConsent}`, payload);
    return promiseHandler(promise);
};

export const getDlDetailsApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.getDLDetails}`, payload);
    return promiseHandler(promise);
};

export const getOnBoardingListingsApi = () => {
    const promise = API.get(`${API_URL}${endPoints.onBoardingListings}`);
    return promiseHandler(promise);
};

export const updatePersonalDetailApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.updatePersonalDetail}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return promiseHandler(promise);
};

export const updateCancelledChequeApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.updateCancelledChequeDetail}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return promiseHandler(promise);
};


export const getAddressTypeApi = () => {
    const promise = API.get(`${API_URL}${endPoints.getAddressType}`);
    return promiseHandler(promise);
};

export const getPersonalInfoApi = (userId: any) => {
    const promise = API.get(`${API_URL}${endPoints.getPersonalInfo}/${userId}`);
    return promiseHandler(promise);
};

export const getAllCountryApi = () => {
    const promise = API.get(`${API_URL}${endPoints.getAllCountry}`);
    return promiseHandler(promise);
};

export const getFatcaDDApi = () => {
    const promise = API.get(`${API_URL}${endPoints.getFatcaDD}`);
    return promiseHandler(promise);
};

export const getAllStateByCountryApi = (countryId: any) => {
    const promise = API.get(`${API_URL}${endPoints.getAllStateByCountry}/${countryId}`);
    return promiseHandler(promise);
};

export const getAddressInfoApi = (userId: any) => {
    const promise = API.get(`${API_URL}${endPoints.getAddressInfo}/${userId}`);
    return promiseHandler(promise);
};

export const updateAddressDetailApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.updateAddress}`, payload);
    return promiseHandler(promise);
};

export const InvestorDeclarationApi = (userId: any) => {
    const promise = API.get(`${API_URL}${endPoints.investorDeclaration}/${userId}`);
    return promiseHandler(promise);
};

export const saveFatcaDeclarationApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.fatcaDeclaration}`, payload);
    return promiseHandler(promise);
};

export const saveBankDetailsApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.saveBankDetail}`, payload);
    return promiseHandler(promise);
};

export const getBankInfoApi = (userId: any) => {
    const promise = API.get(`${API_URL}${endPoints.getBankInfo}/${userId}`);
    return promiseHandler(promise);
};

export const saveNomineeDetailsApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.saveNomineeDetails}`, payload);
    return promiseHandler(promise);
};

export const getNomineeInfoApi = (userId: any) => {
    const promise = API.get(`${API_URL}${endPoints.getNomineeInfo}/${userId}`);
    return promiseHandler(promise);
};

export const uploadImagesApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.uploadImages}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return promiseHandler(promise);
};

export const uploadLiveImagesApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.uploadLiveImages}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return promiseHandler(promise);
};


export const investorSignatureApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.investorSignature}`, payload);
    return promiseHandler(promise);
};

export const investorPhotoApi = (payload: any) => {
    const promise = API.post(`${API_URL}kyc/investor-photo`, payload);
    return promiseHandler(promise);
};

export const changeKycStepApi = (payload: any) => {
    const promise = API.post(`${API_URL}${endPoints.changeKycStep}`, payload);
    return promiseHandler(promise);
};

export const getPersonalDocumentInfoApi = (investorId: any) => {
    const promise = API.get(`${API_URL}kyc/get-personal-document-info/${investorId}`);
    return promiseHandler(promise);
};

export const getInvestorSummaryApi = (investorId: any) => {
    const promise = API.get(`${API_URL}kyc/investor-summary/${investorId}`);
    return promiseHandler(promise);
};

export const completeKycApi = (payload: any) => {
    const promise = API.post(`${API_URL}kyc/create-contract`, payload);
    return promiseHandler(promise);
};

export const completeKycFinalApi = (payload: any) => {
    const promise = API.post(`${API_URL}kyc/genarate-aadhar`, payload);
    return promiseHandler(promise);
};

export const saveAadharPDFApi = (payload: any) => {
    const promise = API.post(`${API_URL}kyc/save_aaddher_PDF`, payload);
    return promiseHandler(promise);
};

export const registerFinalKYCApi = (payload: any) => {
    const promise = API.post(`${API_URL}kyc/execute_verification_engine`, payload);
    return promiseHandler(promise);
};

export const getKycUsersApi = (payload: any) => {
    const promise = API.post(`${API_URL}investor/kyc-users`, payload);
    return promiseHandler(promise);
};
