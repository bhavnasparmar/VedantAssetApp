import CryptoJS from "crypto-js";
import { tokenExpiredToggle } from "../Redux/Actions/TokenAction";
import { store } from "../Redux/Store";
import { parseJSON } from "date-fns";

//live server base url
export const API_URL = 'http://192.168.1.41:9065/';
export const IMAGE_URL = `${API_URL}static/`;
export const IMAGE_URL_GOAL = 'https://prosesenv.com/';
export const TOKEN_PREFIX = 'TOKEN_PREFIX';
export const REFRESH_TOKEN_PREFIX = 'REFRESH_TOKEN_PREFIX';
export const FCM_TOKEN = 'FCM_TOKEN';
export const USER_DATA = 'USER_DATA';

const endPoints = {

  // Auth APIs
  login: 'app-api/app-login',
 loginWithOtp : 'user/login-otp',
  register: 'user/register-user',
  registerVerify : 'user/register-otp',
  resendOTP : 'user/resend-otp',
  forgotPassword: 'user/forgotPassword',
  changePassword: 'user/changePassword',
}

export { endPoints };

export const promiseHandler = async (promise: Promise<any>) => {
  try {
    if (!promise) {
      return null;
    }
    const result = await promise;
    let res = await decryptData(result?.data);
   let finalData = {
    data :res ?  JSON.parse(res) : null,
    msg : result?.msg ? result?.msg : null
   }
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

export const getNew_User = () => {
  return  null;//store?.getState()?.userReducer?.New_User;
};

export const setNew_User = (data: any) => {
  //store.dispatch(getNewUser(data));
};

export const decryptData = async (data: string) => {
   console.log('Data : ', data)
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

export const tokenExpiredflagChange = async (data: any) => {
  // console.log(" ", data)
  //  Store.dispatch(tokenExpiredToggle(data))
  store.dispatch(tokenExpiredToggle(data));
};

export const getTokenExpiredflagChange = async () => {
  console.log("token",store?.getState()?.tokenReducer?.tokenExpiredFlag)
 return store?.getState()?.tokenReducer?.tokenExpiredFlag;
};


