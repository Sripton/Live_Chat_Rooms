import {
  SET_REGISTER_USER,
  SET_AUTH_USER,
  SET_EDIT_USER,
  SET_REGISTER_ERROR,
  LOGOUT_USER,
} from "../types/types";
import axios from "axios";
import type { Dispatch } from "redux";
import type { UserActions } from "../types/types";

// Проверяет, авторизован ли пользователь при загрузке страницы (например, при обновлении).
export const checkUserSession = () => async (dispatch: Dispatch) => {};

type RegisterInputs = {
  login: string;
  password: string;
  username?: string;
  avatar?: string | null;
};
// Регистрация нового пользователя
export const registersUser =
  (inputs: RegisterInputs) =>
  // dispatch —  функция Redux, которая может принимать ТОЛЬКО экшены типа UserActions
  async (dispatch: Dispatch<UserActions>) => {
    try {
      // POST-запрос с данными формы (login, password, username)
      const { data } = await axios.post(`/api/users/signup`, inputs);
      dispatch({
        type: SET_REGISTER_USER,
        payload: {
          userId: data.id,
          userName: data.username,
          userAvatar: data.avatar,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
    }
  };
