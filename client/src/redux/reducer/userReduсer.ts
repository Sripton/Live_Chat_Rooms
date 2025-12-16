import {
  SET_REGISTER_USER,
  SET_AUTH_USER,
  SET_EDIT_USER,
  SET_REGISTER_ERROR,
  LOGOUT_USER,
} from "../types/types";

import type { UserActions } from "../types/types";

export type UserState = {
  userId: string | null;
  userName: string | null;
  userAvatar: string | null;
  isAuthenticated: boolean;
  error: string | null;
};

const initialState: UserState = {
  userId: null,
  userName: null,
  userAvatar: null,
  isAuthenticated: false,
  error: null,
};

// Функция userReduser принимает:
// state типа UserState
// action типа UserAction
// И всегда возвращает UserState
export default function userReduсer(
  state: UserState = initialState,
  action: UserActions
): UserState {
  switch (action.type) {
    // Регистарция и аутентификация пользовтеля
    case SET_REGISTER_USER:
    case SET_AUTH_USER:
      return {
        ...state,
        userId: action.payload.userId,
        userName: action.payload.userName,
        userAvatar: action.payload.userAvatar,
        isAuthenticated: true,
        error: null,
      };

    default:
      return state;
  }
}
