// -------------------- Rooms -------------------
// Тип экшена для создания комнаты пользователем
export const SET_CREATE_ROOM = "SET_CREATE_ROOM";

// Тип экшена для получения всех комнат
export const GET_ALL_ROOMS = "GET_ALL_ROOMS";

// Тип экшена для получения всех комнат пользователя
export const GET_USER_ROOM = "GET_USER_ROOM";

// Тип экшена для получения одной  комнаты
export const GET_ONE_ROOM = "GET_ONE_ROOM";

// описание одной комнаты
// форма данных, которые приходят с сервера
// то, что реально в бд
export type Room = {
  id: string;
  nameRoom: string; // имя создаваемой комнаты
  isPrivate: boolean; // приватность комнаты
  ownerId: string;
};

// расширенный тип для списка (то, что приходит из GET /api/rooms)
export type RoomRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

// RoomListDTO расширяет базовый тип Room, добавляя к нему новые поля
export type RoomListDTO = Room & {
  isOwner: boolean;
  isMember: boolean;
  myRequestStatus: RoomRequestStatus | null;
  hasAccess: boolean;
};

// тип для owner ( для одной комнаты)
export type RoomOwner = {
  id: string;
  avatar: string | null;
  username: string | null;
};

// отдельный DTO для “одной комнаты”. Расшиярем Room
export type RoomOneDTO = Room & {
  owner: RoomOwner;
};

// состояние редьюсера
// то, что хранится в Redux store
// контейнер, внутри которого лежат сущности
export type RoomState = {
  allRooms: RoomListDTO[]; // массив всех комнат
  userRooms: Room[]; // массив всех комнат пользователя
  currentRoom: RoomOneDTO | null; // данные текущей выбранной комнаты
};

export type RoomActions =
  | { type: typeof SET_CREATE_ROOM; payload: Room }
  | { type: typeof GET_ALL_ROOMS; payload: RoomListDTO[] }
  | { type: typeof GET_USER_ROOM; payload: Room[] }
  | { type: typeof GET_ONE_ROOM; payload: RoomOneDTO | null };
