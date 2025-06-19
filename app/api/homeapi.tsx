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

export const getFundPickerListDataApi = (payload: any) => {
    console.log('get getFundPickerListDataApi Scheme API111', `${API_URL}${endPoints.getFundPickerListData}?filters=${payload?.filters}&limit=${payload?.limit}&sort={"SchemePerformances.Returns3yr":"DESC"}&page=${payload?.page}`)
    // const promise = API.get(`${API_URL}${endPoints.getFundPickerListData}`,{params:payload});
    const promise = API.get(`${API_URL}${endPoints.getFundPickerListData}?filters=${payload?.filters}&limit=${payload?.limit}&sort={"SchemePerformances.Returns3yr":"DESC"}&page=${payload?.page}`);
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