export enum TokenTypes {
  RISK_OBJECT = 'RISK_OBJECT',
  USER_DETAILS = 'USER_DETAILS',
  GOAL_PLANNING_OBJECT = 'GOAL_PLANNING_OBJECT',
}



export function getRiskObject(data: any) {
  return (dispatch: any) => {
    dispatch({
      type: TokenTypes.RISK_OBJECT,
      payload: data,
    });
  };
}

export function getGoalPlanningDetails(data: any) {
  return (dispatch: any) => {
    dispatch({
      type: TokenTypes.GOAL_PLANNING_OBJECT,
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