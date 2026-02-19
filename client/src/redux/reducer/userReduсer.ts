import {
  SET_REGISTER_USER,
  SET_AUTH_USER,
  SET_EDIT_USER,
  SET_REGISTER_ERROR,
  LOGOUT_USER,
} from "../types/userTypes";

import type { UserActions } from "../types/userTypes";

export type UserState = {
  userId: string | null;
  username: string | null;
  avatar: string | null;
  isAuthenticated: boolean;
  error: string | null;
};

const initialState: UserState = {
  userId: null,
  username: null,
  avatar: null,
  isAuthenticated: false,
  error: null,
};

// Функция userReduser принимает:
// state типа UserState
// action типа UserAction
// И всегда возвращает UserState
export default function userReduсer(
  state: UserState = initialState,
  action: UserActions,
): UserState {
  switch (action.type) {
    // Регистарция и аутентификация пользовтеля
    case SET_REGISTER_USER:
    case SET_AUTH_USER:
      return {
        ...state,
        userId: action.payload.userId,
        username: action.payload.username,
        avatar: action.payload.avatar,
        isAuthenticated: true,
        error: null,
      };

    case LOGOUT_USER:
      return initialState;

    case SET_REGISTER_ERROR:
      return { ...state, error: action.payload.error };

    case SET_EDIT_USER: {
      const { username, avatar } = action.payload;
      return {
        ...state,
        username: username ?? state.username, // если не было изменений, возвращаем старый
        avatar: avatar ?? state.avatar, // если не было изменений, возвращаем старый
      };
    }
    default:
      return state;
  }
}
