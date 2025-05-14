import React from 'react';
import { TokenTypes } from '../Actions/TokenAction';

let tokenExpiredFlag: boolean = false;


const initialState: any = {
  tokenExpiredFlag: false,


};

function tokenReducer(state = initialState, action: any) {
  switch (action.type) {
    case TokenTypes.TOKEN_EXPIRED:
      tokenExpiredFlag = action.payload;
      return { ...state, tokenExpiredFlag: action.payload };

    default:
      return state;
  }
}

export default tokenReducer;
