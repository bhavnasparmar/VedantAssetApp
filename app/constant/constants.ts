export const emojis = {
  success: '✅',
  error: '❌',
  warn: '⚠️',
};

export const toastTypes = {
  success: 'success',
  error: 'error',
  info: 'info',
};

export const REGEX = {
  mobile:
    /^(?=(?:\D*\d){10,10}\D*$)\+?[0-9]{1,3}[\s-]?(?:\(0?[0-9]{1,5}\)|[0-9]{1,5})[-\s]?[0-9][\d\s-]{5,7}\s?(?:x[\d-]{0,4})?$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
  password: /^.{6,}$/,
  zipcode: /^[0-9]{6,6}$/,
  zipCode: /^\d{6}$/,
  onlyNumber: /^[0-9]\d*$/,
  numeric: /[\d]/, ///^[0-9\b]+$/,
  capital: /[A-Z]/,
  specialCharacter: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

export const messages = {
  EMAIL_NOT_ENTERED: 'Enter your email',
  INVALID_EMAIL: 'Please enter a valid email',
  EDIT_PROFILE_IN_GUEST_MODE: 'Please login to your account',
  PLEASE_LOGIN: 'To place your order, please log in or create an account.',
};

