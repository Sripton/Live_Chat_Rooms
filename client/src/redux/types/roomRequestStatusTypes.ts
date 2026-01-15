// ------------------ RoomRequestStatus -----------------
// Тип экшена. Для загрузки входящих и исходящих запросов пользователя. Типа спиннера
export const ROOM_REQUESTS_FETCH_START = "ROOM_REQUESTS_FETCH_START" as const;

// Тип экшена. Для получения запросов  с сервера”.
export const ROOM_REQUESTS_FETCH_SUCCESS =
  "ROOM_REQUESTS_FETCH_SUCCESS" as const;

// Тип экшена. Для Ошибки при получении запросов
export const ROOM_REQUESTS_FETCH_ERROR = "ROOM_REQUESTS_FETCH_ERROR" as const;

// Тип экшена. Полностью очистить состояние списка запросов. Например при выходе пользователя
export const ROOM_REQUESTS_CLEAR = "ROOM_REQUESTS_CLEAR" as const;

// Тип экшена. loading - обновлять статус запроса
export const ROOM_REQUEST_UPDATE_START = "ROOM_REQUEST_UPDATE_START" as const;

// Тип экшена. Запрос успешно обновлён на сервере
export const ROOM_REQUEST_UPDATE_SUCCESS =
  "ROOM_REQUEST_UPDATE_SUCCESS" as const;

// Тип экшена. Ошибка при попытке обновить запрос
export const ROOM_REQUEST_UPDATE_ERROR = "ROOM_REQUEST_UPDATE_ERROR" as const;

//--------------------- Типы сущностей и state --------------------
export type Id = string;

// стытусы запросов
export type RoomRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

// Extract-  условный тип в TypeScript  -> Extract<T, U>
// Берет объединение типов T
// И оставляет только те типы из T, которые присваиваемы типу U
export type UpdatingStatus = Extract<
  RoomRequestStatus,
  "APPROVED" | "REJECTED"
>;

// тип для определения к какой/какую комнату запрос
export interface RoomDTO {
  id: Id;
  nameRoom: string;
  ownerId: Id;
  isPrivate: boolean;
}

//  тип для определения  кто просит доступ / кто отправляет запрос
export interface UserDTO {
  id: Id;
  username: string | null;
  avatar: string | null;
}

export interface RoomRequestDTO {
  id: Id;
  userId: Id;
  ownerId: Id;
  roomId: Id;
  status: RoomRequestStatus;
  createdAt?: string;
  updatedAt?: string;
  requester?: UserDTO;
  room?: RoomDTO;
}

export interface RoomRequestsState {
  incoming: RoomRequestDTO[]; // входящие запросы (другие пользователи отправили)
  outgoing: RoomRequestDTO[]; // исходящие запросы (пользователь сам отправил)
  loading: boolean; // индикатор загрузки (фетчинг запросов)
  updatingById: Record<Id, UpdatingStatus>; //  Record<KeysType, ValuesType>. id (ключ) -> 'accepted' | 'rejected' (значение)
  error: string | null; //  сообщение об ошибке
  counters: {
    incomingPending: number; // счетчик входящих запрсов
    outgoingPending: number; // счетчик исходящих запрсов
  };
}

// --------------- Типы экшенов --------------------
// экшен спинер для загрузки входящих и исходящих запросов пользователя
export type RoomRequestsFetchStartAction = {
  type: typeof ROOM_REQUESTS_FETCH_START;
};

// экшен  для получения запросов  с сервера
export type RoomRequestsFetchSuccessAction = {
  type: typeof ROOM_REQUESTS_FETCH_SUCCESS;
  payload: { incoming: RoomRequestDTO[]; outgoing: RoomRequestDTO[] };
};

// экшен для Ошибки при получении запросов
export type RoomRequestsFetchErrorAction = {
  type: typeof ROOM_REQUESTS_FETCH_ERROR;
  payload: string;
};

// экшен очистки состояния списка запросов. Например при выходе пользователя
export type RoomRequestsClearAction = { type: typeof ROOM_REQUESTS_CLEAR };

// экшен loading - обновления статуса запроса
export type RoomRequestUpdateStartAction = {
  type: typeof ROOM_REQUEST_UPDATE_START;
  payload: { id: Id; nextStatus: UpdatingStatus };
};

// экшен запрос об успешном обновлении на сервере
export type RoomRequestUpdateSuccessAction = {
  type: typeof ROOM_REQUEST_UPDATE_SUCCESS;
  payload: { id: Id; status: RoomRequestStatus };
};

// экшен Ошибка при попытке обновить запрос
export type RoomRequestUpdateErrorAction = {
  type: typeof ROOM_REQUEST_UPDATE_ERROR;
  payload: { id: Id; error: string };
};

export type RoomRequestActions =
  | RoomRequestsFetchStartAction
  | RoomRequestsFetchSuccessAction
  | RoomRequestsFetchErrorAction
  | RoomRequestsClearAction
  | RoomRequestUpdateStartAction
  | RoomRequestUpdateSuccessAction
  | RoomRequestUpdateErrorAction;
