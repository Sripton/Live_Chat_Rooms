import type {
  RoomRequestActions,
  RoomRequestsState,
  RoomRequestDTO,
} from "../types/roomRequestStatusTypes";

import {
  ROOM_REQUESTS_FETCH_SUCCESS,
  ROOM_REQUESTS_FETCH_ERROR,
  ROOM_REQUESTS_CLEAR,
  ROOM_REQUEST_UPDATE_START,
  ROOM_REQUEST_UPDATE_SUCCESS,
  ROOM_REQUEST_UPDATE_ERROR,
} from "../types/roomRequestStatusTypes";

const countPending = (items: RoomRequestDTO[]) =>
  items.reduce((accum, room) => accum + (room.status === "PENDING" ? 1 : 0), 0);

const initialState: RoomRequestsState = {
  incoming: [], // входящие запросы (другие пользователи отправили)
  outgoing: [], // исходящие запросы (пользователь сам отправил)
  loading: false, // индикатор загрузки (фетчинг запросов)
  updatingById: {}, //  Record<KeysType, ValuesType>. id (ключ) -> 'APPROVED' | 'REJECTED' (значение)
  error: null, //  сообщение об ошибке
  counters: {
    incomingPending: 0, // счетчик входящих запрсов
    outgoingPending: 0, // счетчик исходящих запрсов
  },
};

export default function roomRequestStatusReducer(
  state: RoomRequestsState = initialState,
  action: RoomRequestActions
): RoomRequestsState {
  switch (action.type) {
    // Успешная загрузка входящих и исходящих запросов
    case ROOM_REQUESTS_FETCH_SUCCESS: {
      const { incoming, outgoing } = action.payload;
      return {
        ...state,
        incoming,
        outgoing,
        loading: false,
        error: null,
        counters: {
          incomingPending: countPending(incoming),
          outgoingPending: countPending(outgoing),
        },
      };
    }

    // состоние для спинера обновляющегося статуса запроса
    case ROOM_REQUEST_UPDATE_START: {
      // используется в редьюсере, когда завершается обновление конкретного запроса.
      const { id, nextStatus } = action.payload;
      return {
        ...state,
        // updatingById: объект id -> nextStatus
        // чтобы показать "что именно происходит" на кнопке
        updatingById: { ...state.updatingById, [id]: nextStatus },
        error: null,
      };
    }

    // состояние для  обновления статуса запроса
    case ROOM_REQUEST_UPDATE_SUCCESS: {
      const { id, status } = action.payload; // только данные о том, что поменялось в одной сущности, а полный список остаётся в state
      // полный список входящих/исходящих запросов  хранится в state.
      // мы берём текущие массивы incoming и outgoing из state;
      const incoming = state.incoming.map((req) =>
        // меняем статсу у текущего/входящего запроса
        req.id === id ? { ...req, status } : req
      );
      const outgoing = state.outgoing.map((req) =>
        // меняем статсу у текущего/исзодящего запроса
        req.id === id ? { ...req, status } : req
      );

      // Обновляем элементы в текущих массивах стора
      const counters = {
        incomingPending: incoming.filter((req) => req.status === "PENDING")
          .length,
        outgoingPending: outgoing.filter((req) => req.status === "PENDING")
          .length,
      };
      const restUpdatingById = { ...state.updatingById };
      delete restUpdatingById[id];

      return {
        ...state,
        incoming,
        outgoing,
        counters,
        updatingById: restUpdatingById,
      };
    }
    default:
      return state;
  }
}
