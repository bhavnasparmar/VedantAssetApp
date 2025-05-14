import {parseJSON} from 'date-fns';
import API from '../utils/API';
import {promiseHandler, API_URL, endPoints} from '../utils/Commanutils';

export const regularLogin = (payload: any) => {
  console.log('payload', payload);
  const promise = API.post(`${API_URL}${endPoints.login}`, payload);
    return promiseHandler(promise);
};

export const regularLoginWithOtp = (payload: any) => {
  console.log('payload', payload);
  const promise = API.post(`${API_URL}${endPoints.loginWithOtp}`, payload);
    return promiseHandler(promise);
};

export const userRegiter = (payload: any) => {
  console.log('payload', payload);
  const promise = API.post(`${API_URL}${endPoints.register}`, payload);
  return promiseHandler(promise);
};

export const userOtpVerify = (id: string, payload: any) => {
  console.log('payload', payload);
  const promise = API.put(
    `${API_URL}${endPoints.registerVerify}/${id}`,
    payload,
  );
  return promiseHandler(promise);
};

export const resendOtp = (payload: any) => {
  console.log('payload', payload);
  const promise = API.post(`${API_URL}${endPoints.resendOTP}`, payload);
  return promiseHandler(promise);
};

export const forgotpassword = (payload: any) => {
    console.log("payload",payload)
    const promise = API.post(`${API_URL}${endPoints.forgotPassword}`, payload);
    return promiseHandler(promise);
};


export const changePassword = (payload: any) => {
    console.log("payload",payload)
    const promise = API.post(`${API_URL}${endPoints.changePassword}`, payload);
    return promiseHandler(promise);
};


// export const sendOTPLogin = (payload: any) => {
//     const promise = API.post(`${API_URL}${endPoints.sendLoginOTP}`, payload);
//     return promiseHandler(promise);
// };

// export const checkReferralCodeAPI = (payload: any) => {
//     const promise = API.post(`${API_URL}${endPoints.getReferralCheck}`, payload);
//     return promiseHandler(promise);
// };
