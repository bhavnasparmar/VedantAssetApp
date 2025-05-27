import API from "../utils/API";
import { API_URL, endPoints, promiseHandler } from "../utils/Commanutils";



export const getAllGoalTypeApi = () => {

    const promise = API.get(`${API_URL}${endPoints.getAllGoalType}`);
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
    console.log('get Risk Scheme API ',`${API_URL}${endPoints.getRiskCatWiseSchemeData}/${payload}`)
    const promise = API.get(`${API_URL}${endPoints.getRiskCatWiseSchemeData}/${payload}`);
    return promiseHandler(promise);
};
