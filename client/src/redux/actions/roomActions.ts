import {
  SET_CREATE_ROOM,
  GET_ALL_ROOMS,
  GET_ONE_ROOM,
  GET_USER_ROOM,
} from "../types/roomTypes";
import type { AppDispatch } from "../store/store";
import type { Room, RoomListDTO, RoomOneDTO } from "../types/roomTypes";
import axios from "axios";

export const fetchAllRooms = () => async (dispatch: AppDispatch) => {
  try {
    //  GET-запрос к API — получаем массив всех комнат
    const { data } = await axios.get<RoomListDTO[]>(`/api/rooms`);
    dispatch({ type: GET_ALL_ROOMS, payload: data });
  } catch (error) {
    console.error("Ошибка при получении всех комнат:", error);
  }
};

// тип для создания комнаты
type RoomCreate = {
  nameRoom: string;
  isPrivate: boolean;
};
// Асинхронная функция для отправки формы создания комнаты на сервер
export const createRoomsSubmit =
  (inputs: RoomCreate) => async (dispatch: AppDispatch) => {
    try {
      //const { data } = await axios.post<Room>(`/api/rooms`, inputs);
      // dispatch({ type: SET_CREATE_ROOM, payload: data });

      await axios.post<Room>(`/api/rooms`, inputs);
      // после создания комнаты перезагрузить список
      dispatch(fetchAllRooms()); // перетрет allRooms правильным DTO
    } catch (error) {
      console.log(error);
    }
  };

// Асинхронная функция для получения всех комнат пользователя
export const fetchUserRooms = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await axios.get(`/api/rooms/userrooms`);
    dispatch({ type: GET_USER_ROOM, payload: data });
  } catch (error) {
    console.error("Ошибка при получении  комнат для пользователя:", error);
  }
};

// Асинхронная функция для получения комнаты по ID
export const getRoomById =
  (roomId: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.get<RoomOneDTO>(
        `/api/rooms/getOneRoom/${roomId}`,
      );
      dispatch({ type: GET_ONE_ROOM, payload: data });
    } catch (error) {
      console.error("Ошибка при получении  комнаты:", error);
    }
  };
