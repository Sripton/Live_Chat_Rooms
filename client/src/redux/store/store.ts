// Импорт функции configureStore из Redux Toolkit — упрощает настройку Redux store
import { configureStore } from "@reduxjs/toolkit";

// Импорт редьюсера для пользователя, который обрабатывает действия, связанные с аутентификацией и данными пользователя
import userReduser from "../reducer/userReduсer";

// Экспорт конфигурированного хранилища (store)
export const store = configureStore({
  // Объект всех редьюсеров приложения
  reducer: {
    user: userReduser, // Ключ `user` определяет ветку состояния Redux: state.user будет обрабатываться userReducer'ом
  },
});

// тип состояния всего стора
// RootState === { user: UserState; }
// store.getState — функция, которая возвращает текущее состояние Redux
export type RootState = ReturnType<typeof store.getState>; // тип ВСЕГО Redux-состояния приложения.

// тип dispatch (важно для thunk)
export type AppDispatch = typeof store.dispatch;
