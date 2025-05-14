export enum TokenTypes {
    USERS = 'USERS',
}

export function LabTestUsersToggle(data: any) {
    return (dispatch: any) => {
        dispatch({
            type: TokenTypes.USERS,
            payload: data,
        });
    };
}

