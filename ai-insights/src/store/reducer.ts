import { ACTIONS } from './actions';

const initialState = {
  campaigns: [],
  offers: [],
};

export default function appReducer(
  state = initialState,
  action: {
    type: string;
    payload: any;
  },
) {
  switch (action.type) {
    case ACTIONS.SET_CAMPAIGNS:
      return {
        ...state,
        campaigns: action.payload,
      };
    case ACTIONS.SET_OFFERS:
      return {
        ...state,
        offers: action.payload,
      };
    default:
      return state;
  }
}
