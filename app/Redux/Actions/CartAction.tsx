export enum TokenTypes {
    ITEM = 'ITEM',
    ADDRESS = 'ADDRESS',
    LABITEM = 'LABITEM',
    AVAILABLE_LOCATION = 'AVAILABLE_LOCATION'
}

export function cartItemToggle(data: any) {
    return (dispatch: any) => {
        dispatch({
            type: TokenTypes.ITEM,
            payload: data,
        });
    };
}

export function AddressToggle(data: any) {
    return (dispatch: any) => {
        dispatch({
            type: TokenTypes.ADDRESS,
            payload: data,
        });
    };
}

export function LabItemToggle(data: any) {
    return (dispatch: any) => {
        dispatch({
            type: TokenTypes.LABITEM,
            payload: data,
        });
    };
}

export function setLocationAvailableToggle(data: any) {
    return (dispatch: any) => {
        dispatch({
            type: TokenTypes.AVAILABLE_LOCATION,
            payload: data,
        });
    };
}

