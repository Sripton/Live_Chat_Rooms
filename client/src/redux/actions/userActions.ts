import {
  SET_REGISTER_USER,
  SET_AUTH_USER,
  SET_EDIT_USER,
  SET_REGISTER_ERROR,
  LOGOUT_USER,
} from "../types/types";
import axios, { AxiosError } from "axios";
import type { Dispatch } from "redux";
import type { UserActions } from "../types/types";

// Проверяет, авторизован ли пользователь при загрузке страницы (например, при обновлении).
export const checkUserSession =
  () => async (dispatch: Dispatch<UserActions>) => {
    try {
      const { data } = await axios.get(`/api/users/checkuser`);
      dispatch({
        type: SET_AUTH_USER,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

// Тип для регистарции
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
        payload: data,
      });
      return true;
    } catch (error) {
      const errorRegister = error as AxiosError<{ error: string }>;
      dispatch({
        type: SET_REGISTER_ERROR,
        payload: {
          error: errorRegister.response?.data?.error ?? "Ошибка регистрации",
        },
      });
    }
    return false;
  };

// Тип для логирования
type LoginInputs = {
  login: string;
  password: string;
};

// Вход пользователя (логин)
export const loginUser =
  (inputs: LoginInputs) => async (dispatch: Dispatch<UserActions>) => {
    try {
      const { data } = await axios.post(`/api/users/signin`, inputs);
      dispatch({
        type: SET_AUTH_USER,
        payload: data,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

// Выход пользователя из аккаунта
export const logoutUser = () => async (dispatch: Dispatch<UserActions>) => {
  try {
    await axios.get(`/api/users/logout`);
    dispatch({ type: LOGOUT_USER });
    return true;
  } catch (error) {
    console.log(error);
  }
};
