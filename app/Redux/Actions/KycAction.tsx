export enum TokenTypes {
    PAN_DETAILS = 'PAN_DETAILS',
    KYC_DETAILS = 'KYC_DETAILS',
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