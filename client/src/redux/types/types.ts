// -------------------- User -------------------
// Тип экшена для установки данных пользователя после регистрации
export const SET_REGISTER_USER = "SET_REGISTER_USER";

// Тип экшена для установки данных пользователя после входа в систему
export const SET_AUTH_USER = "SET_AUTH_USER";

// Тип экшена для установки данных пользователя после изменения профиля
export const SET_EDIT_USER = "SET_EDIT_USER";

// Тип экшена для получения error при регистарции
export const SET_REGISTER_ERROR = "SET_REGISTER_ERROR";

// Тип экшена для выхода пользователя (очистка пользовательских данных из хранилища)
export const LOGOUT_USER = "LOGOUT_USER";

// Описываем  то, что нужно Redux-стору
export type UserPayload = {
  userId: string;
  userName: string | null;
  userAvatar: string | null;
};

export type UserActions =
  | { type: typeof SET_REGISTER_USER; payload: UserPayload }
  | { type: typeof SET_AUTH_USER; payload: UserPayload }
  | { type: typeof SET_EDIT_USER; payload: Partial<UserPayload> } // все поля становятся необязательными
  | { type: typeof SET_REGISTER_ERROR; payload: string }
  | { type: typeof LOGOUT_USER };
