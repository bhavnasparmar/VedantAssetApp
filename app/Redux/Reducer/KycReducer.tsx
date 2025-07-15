import React from 'react';
import { TokenTypes } from '../Actions/KycAction';



let PanDetailsObj: any = null;
let KycDetailsObj: any = {};

const initialState: any = {
    PanDetailsObj: null,
    KycDetailsObj: null,
};

function kycReducer(state = initialState, action: any) {
    switch (action.type) {
        case TokenTypes.PAN_DETAILS:
            PanDetailsObj = action.payload;
            return { ...state, PanDetailsObj: action.payload };
        case TokenTypes.KYC_DETAILS:
            KycDetailsObj = action.payload;
            return { ...state, KycDetailsObj: action.payload };
        default:
            return state;
    }
}

export default kycReducer;
