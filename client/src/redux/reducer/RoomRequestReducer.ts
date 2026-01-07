import {
  ROOM_REQUEST_SUCCESS,
  ROOM_REQUEST_ERROR,
  CLEAR_ROOM_REQUEST_STATE,
} from "../types/requestTypes";

import type { RequestActions, RoomRequestState } from "../types/requestTypes";

const initialState: RoomRequestState = {
  status: null,
  error: null,
  request: null,
};

export default function roomRequestReducer(
  state: RoomRequestState = initialState,
  action: RequestActions
): RoomRequestState {
  switch (action.type) {
    case ROOM_REQUEST_SUCCESS:
      return {
        ...state,
        status: action.payload.message,
        request: action.payload.request,
        error: null,
      };

    case ROOM_REQUEST_ERROR:
      return {
        ...state,
        status: null,
        error: action.payload.message,
        request: null,
      };

    case CLEAR_ROOM_REQUEST_STATE:
      return initialState;

    default:
      return state;
  }
}
