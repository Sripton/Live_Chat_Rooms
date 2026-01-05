import {
  ROOM_REQUEST_SUCCESS,
  ROOM_REQUEST_ERROR,
} from "../types/requestTypes";
import axios, { AxiosError } from "axios";
import type { AppDispatch } from "../store/store";

// Тип тела POST-запроса.
type CreateRoomRequestBody = { roomId: string };
// Тип ошибки, которую сервер возвращает в JSON:
type RoomRequestErrorResponse = { message: string };
export const checkRequest = () => {};

// Thunk action для отправки запроса доступа к приватной комнате
export const sendRoomRequest =
  (roomId: string) => async (dispatch: AppDispatch) => {
    try {
      // Отправляем POST-запрос на сервер.
      const { data } = await axios.post(`/api/roomRequest`, {
        // Второй аргумент — тело запроса.
        roomId,
      } satisfies CreateRoomRequestBody); //  проверка, что объект ТОЧНО соответствует форме

      // { message: string, request: RoomRequest } -> Если запрос успешен
      dispatch({ type: ROOM_REQUEST_SUCCESS, payload: data });
    } catch (error) {
      // В случае ошибки axios бросает исключение.
      const err = error as AxiosError<RoomRequestErrorResponse>;
      dispatch({
        // Диспатчим ERROR-экшен.
        type: ROOM_REQUEST_ERROR,
        // В payload кладём объект { message }. текст ошибки для UI 
        payload: { message: err?.response?.data.message ?? "Ошибка запроса" },
      });
    }
  };
