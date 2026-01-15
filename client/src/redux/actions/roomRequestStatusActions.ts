import {
  ROOM_REQUESTS_FETCH_SUCCESS,
  ROOM_REQUEST_UPDATE_START,
  ROOM_REQUEST_UPDATE_SUCCESS,
  ROOM_REQUEST_UPDATE_ERROR,
} from "../types/roomRequestStatusTypes";

import type { AppDispatch } from "../store/store";

//Тип для статуса запросв
import type { UpdatingStatus } from "../types/roomRequestStatusTypes";
import axios from "axios";

// ??????
export const fetchgAll = () => {};

export const fetchUserRequestsStatus = () => async (dispatch: AppDispatch) => {
  try {
    //  запрос к API, чтобы получить все запросы (и входящие, и исходящие) для текущего пользователя
    const { data } = await axios.get(`/api/roomRequest/userRequest`);
    dispatch({ type: ROOM_REQUESTS_FETCH_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

// Экшен для  обновления статуса конкретного запроса
export const updateRoomRequestStatus =
  (id: string, nextStatus: UpdatingStatus) => async (dispatch: AppDispatch) => {
    const MIN_SHOW = 350; // мс
    const start = Date.now(); // фиксируем старт. текущее время в миллисекундах
    // для спинера обновляющегося статуса запроса
    dispatch({ type: ROOM_REQUEST_UPDATE_START, payload: { id, nextStatus } });
    try {
      // Забираем данные из patch запроса
      const { data } = await axios.patch(`/api/roomRequest/${id}`, {
        status: nextStatus,
      });
      const timeHassPassed = Date.now() - start;
      const wait = Math.max(0, MIN_SHOW - timeHassPassed);

      setTimeout(() => {
        dispatch({
          type: ROOM_REQUEST_UPDATE_SUCCESS,
          payload: {
            id: id, //гарантированно удалить правильный ключ из updatingById
            status: data.request.status,
          },
        });
      }, wait);
    } catch (error: any) {
      const passed = Date.now() - start;
      const wait = Math.max(0, MIN_SHOW - passed);
      // забираем сообзение из сервера
      const serverMessage = error?.response?.data?.message; // сообщение об ошибке
      const statusCode = error?.response?.status; // код ошибки

      const message =
        serverMessage ??
        (statusCode ? `Ошибка ${statusCode}` : "Сетевая ошибка");

      setTimeout(() => {
        dispatch({
          type: ROOM_REQUEST_UPDATE_ERROR,
          payload: { id, error: message },
        });
      }, wait);
    }
  };
