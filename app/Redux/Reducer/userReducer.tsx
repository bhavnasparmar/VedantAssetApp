import React from 'react';
import { TokenTypes } from '../Actions/userAction';


let RiskObject: any = null;
let UserDetails: any = null;
let GoalPlanningDetails: any = null;
const initialState: any = {
     UserDetails: null,
    RiskObject: null,
     GoalPlanningDetails: null,
};

function userReducer(state = initialState, action: any) {
    switch (action.type) {
          case TokenTypes.USER_DETAILS:
            UserDetails = action.payload;
            return { ...state, UserDetails: action.payload };
        case TokenTypes.RISK_OBJECT:
            RiskObject = action.payload;
            return { ...state, RiskObject: action.payload };
       case TokenTypes.GOAL_PLANNING_OBJECT:
            GoalPlanningDetails = action.payload;
            return { ...state, GoalPlanningDetails: action.payload };
        default:
            return state;
    }
}

export default userReducer;
