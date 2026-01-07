// ----------------- RoomRequest -------------------
// Тип экшена если  статус запроса - положительный
export const ROOM_REQUEST_SUCCESS = "ROOM_REQUEST_SUCCESS";

// Тип экшена если  статус запроса - отрицательный
export const ROOM_REQUEST_ERROR = "ROOM_REQUEST_ERROR";

// Тип экшена. Очистить статус после закрытия модалки
export const CLEAR_ROOM_REQUEST_STATE = "CLEAR_ROOM_REQUEST_STATE";

export type RoomRequest = {
  id: string;
  userId: string;
  ownerId: string;
  roomId: string;
  status: "PENDING" | "REJECTED" | "APPROVED";
  createdAt: string; // json дата всегда строка
  updatedAt: string;
};

type RoomRequestSuccessResponse = {
  message: string;
  request: RoomRequest;
};

type RoomRequestErrorResponse = {
  message: string;
};

export type RoomRequestState = {
  status: string | null;
  error: string | null;
  request: RoomRequest | null;
};

export type RequestActions =
  | { type: typeof ROOM_REQUEST_SUCCESS; payload: RoomRequestSuccessResponse }
  | { type: typeof ROOM_REQUEST_ERROR; payload: RoomRequestErrorResponse }
  | { type: typeof CLEAR_ROOM_REQUEST_STATE; payload: RoomRequestState };
