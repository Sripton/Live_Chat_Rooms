import {
  SET_POST_REACTION_CREATE,
  GET_POST_REACTION_LIST,
} from "../types/postReactionsTypes";

import type {
  ReactionState,
  ReactionActions,
} from "../types/postReactionsTypes";

// начальное состояние Redux. первое значение state, когда приложение загрузилось.
const initialState: ReactionState = {
  byPostId: {}, // как быстро это найти
  entities: {}, // “что есть” [массив всех реакций]
  errorByPostId: {},
};

export default function postReactionReducer(
  state: ReactionState = initialState,
  action: ReactionActions,
): ReactionState {
  switch (action.type) {
    // создание реакции
    case SET_POST_REACTION_CREATE: {
      // const reaction = action.payload; // созданная реакция
      // state.entities[reaction.id] = reaction; // добавляем в entities {reaction.id: reaction}

      // // создаем список реакций
      // // {postId: [reactionId1,reactionId2, reactionId3 ]}
      // const list = state.byPostId[reaction.postId] ?? []; // на данном этапе создания либо пустой либо нет
      // // если по ключу postId нету такой реакции добавляем  id реакции в массив
      // if (!list.includes(reaction.id)) {
      //   state.byPostId[reaction.postId] = [...list, reaction.id];
      // }
      // return state; // возвращаем state

      const reaction = action.payload;

      const prevList = state.byPostId[reaction.postId] ?? []; // [r1,r2,r3,r4]  || []
      const nextList = prevList.includes(reaction.id)
        ? prevList
        : [...prevList, reaction.id];

      return {
        ...state,
        entities: { ...state.entities, [reaction.id]: reaction },
        byPostId: {
          ...state.byPostId,
          [reaction.postId]: nextList,
        },
      };
    }

    case GET_POST_REACTION_LIST: {
      const reactions = action.payload;

      // не мутируем state
      const newEntities = { ...state.entities }; // не мутируем state.entities
      const newByPostId = { ...state.byPostId }; // не мутируем state.byPostId
      reactions.forEach((r) => {
        // если реакция обновилась (LIKE → DISLIKE) — всё ок
        newEntities[r.id] = r; // перезапишется, если id существует

        if (!newByPostId[r.postId]) {
          // гарантируем, что массив существует
          newByPostId[r.postId] = [];
        }
        // защита от дублей
        if (!newByPostId[r.postId].includes(r.id)) {
          newByPostId[r.postId].push(r.id);
        }
      });
      return {
        ...state,
        byPostId: newByPostId,
        entities: newEntities,
      };
    }
    default:
      return state;
  }
}
