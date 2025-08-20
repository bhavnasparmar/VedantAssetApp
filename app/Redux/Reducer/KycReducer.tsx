import React from 'react';
import { TokenTypes } from '../Actions/KycAction';



let PanDetailsObj: any = null;
let KycDetailsObj: any = {};
let KycMemberDetailsObj: any = {};
let ISKYCMember: any = false;

const initialState: any = {
    PanDetailsObj: null,
    KycDetailsObj: null,
    KycMemberDetailsObj: null,
    ISKYCMember: false,
};

function kycReducer(state = initialState, action: any) {
    switch (action.type) {
        case TokenTypes.PAN_DETAILS:
            PanDetailsObj = action.payload;
            return { ...state, PanDetailsObj: action.payload };
        case TokenTypes.KYC_DETAILS:
            KycDetailsObj = action.payload;
            return { ...state, KycDetailsObj: action.payload };
        case TokenTypes.KYC_MEMBER_DETAILS:
            KycMemberDetailsObj = action.payload;
            return { ...state, KycMemberDetailsObj: action.payload };
        case TokenTypes.IS_KYCMEMBER:
            ISKYCMember = action.payload;
            return { ...state, ISKYCMember: action.payload };
        default:
            return state;
    }
}

export default kycReducer;
