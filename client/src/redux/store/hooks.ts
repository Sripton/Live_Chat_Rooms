import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "./store";

// useDispatch — обычная функция. подставляем тип dispatch нашего store
// Возвращает  dispatch конкретного типа”
// Тип возвращаемого значения один и тот же всегда, поэтому можно просто обернуть в функцию
export const useAppDispatch = () => useDispatch<AppDispatch>();

// useSelector — generic-хук, который зависит от типа state
// useSelector ВСЕГДА работает с RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
