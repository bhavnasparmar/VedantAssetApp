import CryptoJS from 'crypto-js';
import { tokenExpiredToggle } from '../Redux/Actions/TokenAction';
import { store } from '../Redux/Store';
import { parseJSON } from 'date-fns';
import { getGoalPlanningDetails, getRiskObject, getuserDetails } from '../Redux/Actions/userAction';

//live server base url
// export const API_URL = 'https://prosesenv.com:9065/';
//export const API_URL = 'http://192.168.1.26:9065/';
export const API_URL = 'https://vedant.prosesenv.com:9065/';
export const IMAGE_URL = `${API_URL}static/`;
export const IMAGE_URL_GOAL = `${API_URL}static/`;
export const TOKEN_PREFIX = 'TOKEN_PREFIX';
export const REFRESH_TOKEN_PREFIX = 'REFRESH_TOKEN_PREFIX';
export const FCM_TOKEN = 'FCM_TOKEN';
export const USER_DATA = 'USER_DATA';
export const RISK_PROFILE_FINAL = 'RISK_PROFILE_FINAL';
export const RISK_PROFILE_INFODATA = 'RISK_PROFILE_INFODATA';

const endPoints = {
  // Auth APIs
  login: 'app-api/app-login',
  loginWithOtp: 'user/login-otp',
  register: 'user/register-user',
  registerVerify: 'user/register-otp',
  resendOTP: 'user/resend-otp',
  forgotPassword: 'user/forgotPassword',
  changePassword: 'user/changePassword',  
  //home api
  getAllGoalType: 'goal-plan/getAllGoalType',
  getAllGoalPalnList:'goal-plan/getAllGoalPalnList',
  goalcalss:'goal-plan/calculator/goal',
  getRiskCatWiseSchemeData: 'goal-plan/getRiskCatWiseSchemeData',
  getRiskProfileInvestor: 'risk-profile/get-risk-profile-investor',
  getAllRiskQuestion: 'risk-profile/getAllRiskQuestion',
  addRiskProfileQuestionAnswer: 'risk-profile/add-question-answer',
  getFundPickerListData : 'fund-picker/getFundPickerData',
  getCategoryWithSubCategoryData : 'fund-picker/get-category-with-subCategory',
  getNatureData : 'fund-picker/get-nature-list',
  getAmcListData : 'fund-picker/get-AMC',
  getGoalPlanWiseSchemeData : 'goal-plan/getGoalPlanWiseSchemeData',
  addGoalPlanData : 'goal-plan/addGoalPlanData',
  adduseralloc : 'goal-plan/add-user-alloc',
  getSuggestedSchemes: 'goal-plan/suggested-subcategory-schemes',
  deleteGoal: 'goal-plan/deleteGoalPlanData',
};

export { endPoints };

export const promiseHandler = async (promise: Promise<any>) => {
  try {
    if (!promise) {
      return null;
    }
    const result = await promise;
    let res = await decryptData(result?.data);
    let finalData = {
      data: res ? JSON.parse(res) : null,
      msg: result?.msg ? result?.msg : null,
    };
    // console.log("res",res?.data)
    // if(res?.data){
    //    res.data = // JSON.parse(decryptData(res?.data))
    // }
    // console.log("final data= ",finalData)
    return [finalData, null];
  } catch (e) {
    return [null, e];
  }
};

export const REGEX = {
  mobile:
    /^(?=(?:\D*\d){10,10}\D*$)\+?[0-9]{1,3}[\s-]?(?:\(0?[0-9]{1,5}\)|[0-9]{1,5})[-\s]?[0-9][\d\s-]{5,7}\s?(?:x[\d-]{0,4})?$/,
  email:
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  password: /^.{6,}$/,
  zipcode: /^[0-9]{6,6}$/,
  zipCode: /^\d{6}$/,
  onlyNumber: /^[0-9]\d*$/,
  numeric: /[\d]/, ///^[0-9\b]+$/,
  capital: /[A-Z]/,
  specialCharacter: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  usernametest: /^[a-zA-Z0-9]+$/,
  name: /^[a-zA-Z0-9 ]*$/,
};
const key = 'va*proses';

 export const toFixedDataForReturn = (number: number) => {
    return number ? `${number?.toFixed(2)}%` : "--";
  };

  export const convertToCrores = (amount: number) => {
  const crores = amount / 10000000;
  return `${crores.toFixed(2)}`;
}
  


export const getNew_User = () => {
  return null; //store?.getState()?.userReducer?.New_User;
};

export const setNew_User = (data: any) => {
  //store.dispatch(getNewUser(data));
};

export const decryptData = async (data: string) => {
  console.log('Data : ', data);
  try {
    if (!data) {
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(data, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedData;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

export const getGoalTypeImage = (imageData: any) => {
  console.log(`${IMAGE_URL_GOAL}/goalplanning/${imageData}`);
  return `${IMAGE_URL_GOAL}/goalplanning/${imageData}`;
};

export const tokenExpiredflagChange = async (data: any) => {
  // console.log(" ", data)
  //  Store.dispatch(tokenExpiredToggle(data))
  store.dispatch(tokenExpiredToggle(data));
};

export const getTokenExpiredflagChange = async () => {
  console.log('token---', store?.getState()?.tokenReducer?.tokenExpiredFlag);
  return store?.getState()?.tokenReducer?.tokenExpiredFlag;
};
export const setGoalPlanningDetails = (data: any) => {
  store.dispatch(getGoalPlanningDetails(data));
};
export const setRiskObject = (data: any) => {
  store.dispatch(getRiskObject(data));
};

export const getRiskObjectData = () => {
  return store?.getState()?.userReducer?.RiskObject;
};

export const getLoginUserDetails = () => {
  return store?.getState()?.userReducer?.UserDetails;
};
export const setLoginUserDetails = (data: any) => {
  store.dispatch(getuserDetails(data));
};
export const getGoalPlanning = () => {
  return store?.getState()?.userReducer?.GoalPlanningDetails;
};
export const updateObjectKey = (obj: any, keyPath: any, value: any) => {
  const keys = keyPath.split('.');
  const lastKey = keys.pop();

  // Navigate through the object to the second-to-last key
  const nestedObj = keys.reduce((acc: any, key: any) => {
    if (!acc[key]) {
      acc[key] = {}; // Create an empty object if it doesn't exist
    }
    return acc[key];
  }, obj);

  // Update the value at the specified key
  nestedObj[lastKey] = value;

  return { ...obj }; // Return a new object
};

  export const showArraow = (returnNumber: number, categoryNumber: number) => {
    let ratio: any =
      categoryNumber && categoryNumber > 0
        ? ((returnNumber - categoryNumber) / categoryNumber) * 100
        : returnNumber;
    ratio = ratio?.toFixed(2);
    if (ratio >= 10) {
      return '#056106';
    } else if (5 <= ratio || ratio >= 9.99) {
      return '#00ff00';
    } else if (0 <= ratio || ratio >= 4.99) {
      return '#ffff00';
    } else if (-5 <= ratio || ratio >= -0.99) {
      return '#f79b00';
    } else if (ratio < -5) {
      return '#ff0000';
    }
  };
