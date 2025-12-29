import {
  SET_CREATE_ROOM,
  GET_ALL_ROOMS,
  GET_ONE_ROOM,
  GET_USER_ROOM,
} from "../types/roomTypes";
import type { AppDispatch } from "../store/store";
import type { Room } from "../types/roomTypes";
import axios from "axios";

// export const fetchAllRooms =
//   () => async (dispatch: Dispatch<RoomActions>) => {};

type RoomCreate = {
  nameRoom: string;
  isPrivate: boolean;
};
export const createRoomsSubmit =
  (inputs: RoomCreate) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.post<Room>(`/api/rooms`, inputs);
      dispatch({ type: SET_CREATE_ROOM, payload: data });
    } catch (error) {
      console.log(error);
    }
  };
