export enum TokenTypes {
    PAN_DETAILS = 'PAN_DETAILS',
    KYC_DETAILS = 'KYC_DETAILS',
    KYC_MEMBER_DETAILS = 'KYC_MEMBER_DETAILS',
    IS_KYCMEMBER = 'IS_KYCMEMBER',
}

export function KYCPanDetailsObj(data: any) {
    return (dispatch: any) => {
        dispatch({
            type: TokenTypes.PAN_DETAILS,
            payload: data,
        });
    };
}

export function KYCDetailsObj(data: any) {
    return (dispatch: any) => {
        dispatch({
            type: TokenTypes.KYC_DETAILS,
            payload: data,
        });
    };
}

export function ISKYCMember(data: any) {
    return (dispatch: any) => {
        dispatch({
            type: TokenTypes.IS_KYCMEMBER,
            payload: data,
        });
    };
}


export function KYCMemberDetailsObj(data: any) {
    return (dispatch: any) => {
        dispatch({
            type: TokenTypes.KYC_MEMBER_DETAILS,
            payload: data,
        });
    };
}
