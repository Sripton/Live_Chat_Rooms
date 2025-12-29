import {
  SET_CREATE_ROOM,
  GET_ALL_ROOMS,
  GET_USER_ROOM,
  GET_ONE_ROOM,
} from "../types/roomTypes";

import type { RoomActions, RoomState } from "../types/roomTypes";

const initialState: RoomState = {
  allRooms: [],
  userRooms: [],
  currentRoom: null,
};

export default function roomReducer(
  state: RoomState = initialState, // state: RoomState — тип аргумента, = initialState — значение по умолчанию
  action: RoomActions
): RoomState {
  // TS проверит, что в каждом case  возвращаем RoomState
  const { type, payload } = action;
  switch (type) {
    case SET_CREATE_ROOM:
      return {
        ...state,
        allRooms: [payload, ...state.allRooms],
        userRooms: [payload, ...state.userRooms],
        currentRoom: payload,
      };

    case GET_ALL_ROOMS:
      return {
        ...state,
        allRooms: payload,
      };

    case GET_USER_ROOM:
      return {
        ...state,
        userRooms: payload,
      };

    case GET_ONE_ROOM:
      return {
        ...state,
        currentRoom: payload,
      };
    default:
      return state;
  }
}
