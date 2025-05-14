import AsyncStorage from '@react-native-async-storage/async-storage';
export const localStorageKeys = {
  TOKEN:'USER_TOKEN',
  LOGIN_CRED: 'LOGIN_CRED',
  USER_DATA: 'USER_DATA',
  LABEL_DATA: 'LABEL_DATA',
  SETTINGS: 'SETTINGS',
  USER_RULES: 'USER_RULES',
  DRAFT_OBSERVATION: 'DRAFT_OBSERVATION',
  DRAFT_INCIDENT: 'DRAFT_INCIDENT',
  PERMISSION: 'PERMISSION',
  SYNC_SETTINGS: 'SYNC_SETTINGS',
  NOTIFICATION_TESTIMONY: 'NOTIFICATION_TESTIMONY',
  SYNC_TASK: 'SYNC_TASK',
  DATE_RANGE: 'DATE_RANGE',
  COMPANY_CONFIG: 'COMPANY_CONFIG',
  COMPLETE_PROFILE:'COMPLETE_PROFILE',
  PERSONAL_INFORMATION:'PERSONAL_INFORMATION',
  UPDATE_DATA:'UPDATE_DATA',
  KYC_INFORMATION:'KYC_INFORMATION',
  BANK_INFORMATION:'BANK_INFORMATION',
  DOCUMENTS_INFORMATION:'DOCUMENTS_INFORMATION',
  IS_ACTIVE_PLAN:'IS_ACTIVE_PLAN'
};
export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = value;
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    return null;
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue) {
      return jsonValue;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    return null;
  }
};

export const getUser = async () => {
  return await getData(localStorageKeys.TOKEN);
};

export const setUser = async (data: any) => {
  await storeData(localStorageKeys.USER_DATA, data);
};

export const removeUser = async () => {
  await removeData(localStorageKeys.USER_DATA);
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    return null;
  }
};

