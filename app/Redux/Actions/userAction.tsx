export enum TokenTypes {
  RISK_OBJECT = 'RISK_OBJECT',
  USER_DETAILS = 'USER_DETAILS'
}



export function getRiskObject(data: any) {
  return (dispatch: any) => {
    dispatch({
      type: TokenTypes.RISK_OBJECT,
      payload: data,
    });
  };
}

export function getuserDetails(data: any) {
  return (dispatch: any) => {
    dispatch({
      type: TokenTypes.USER_DETAILS,
      payload: data,
    });
  };
}