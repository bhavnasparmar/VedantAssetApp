export enum TokenTypes {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  BRANCH_ID = 'BRANCH_ID',
  PAGER = 'PAGER',
}

export function tokenExpiredToggle(data: any) {
  return (dispatch: any) => {
    dispatch({
      type: TokenTypes.TOKEN_EXPIRED,
      payload: data,
    });
  };
}

export function getPager(data: any) {
  return (dispatch: any) => {
    dispatch({
      type: TokenTypes.PAGER,
      payload: data,
    });
  };
}

