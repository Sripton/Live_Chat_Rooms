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
// не Redux, модель данных
export type Room = {
  id: string;
  nameRoom: string; // имя создаваемой комнаты
  isPrivate: boolean; // приватность комнаты
  ownerId: string;
};

// состояние редьюсера
// то, что хранится в Redux store
// контейнер, внутри которого лежат сущности
export type RoomState = {
  allRooms: Room[]; // массив всех комнат
  userRooms: Room[]; // массив всех комнат пользователя
  currentRoom: Room | null; // данные текущей выбранной комнаты
};

export type RoomActions =
  | { type: typeof SET_CREATE_ROOM; payload: Room }
  | { type: typeof GET_ALL_ROOMS; payload: Room[] }
  | { type: typeof GET_USER_ROOM; payload: Room[] }
  | { type: typeof GET_ONE_ROOM; payload: Room | null };
