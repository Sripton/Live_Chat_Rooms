import {
  SET_POST_REACTION_CREATE,
  GET_POST_REACTION_LIST,
} from "../types/postReactionsTypes";

import type {
  ReactionState,
  ReactionActions,
  ReactionType,
} from "../types/postReactionsTypes";

// начальное состояние Redux. первое значение state, когда приложение загрузилось.
const initialState: ReactionState = {
  byPostId: {}, // как быстро это найти
  entities: {}, //  массив всех реакций: [raction.id]: [reaction]
  errorByPostId: {},
  myReactionByPostId: {},
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
      const nextList = prevList.includes(reaction.id) // если такая реакция есть
        ? prevList // возвращаем обнавленную реакцию
        : [...prevList, reaction.id]; // сохраняем старые реакции в масииве и добавляем новые

      return {
        ...state,
        entities: { ...state.entities, [reaction.id]: reaction },
        byPostId: {
          ...state.byPostId,
          [reaction.postId]: nextList, // возвращаем обнавленный массив реакций
        },
        myReactionByPostId: {
          ...state.myReactionByPostId,
          [reaction.postId]: reaction.reactionType, // сохраняем реакцию пользовтаеля для подсветки 
        },
      };
    }

    case GET_POST_REACTION_LIST: {
      const { postId, userId, reactions } = action.payload; // массив реакций

      // не мутируем state при redux tunk
      const newEntities = { ...state.entities }; // не мутируем state.entities
      const newByPostId = { ...state.byPostId }; // не мутируем state.byPostId
      const ids: string[] = []; // для хранения [id] реакций

      let myReactions: ReactionType | null = null; // для обозначения моих реакций
      for (const r of reactions) {
        newEntities[r.id] = r;
        ids.push(r.id);

        if (r.userId === userId) {
          myReactions = r.reactionType; // определям мою реакцию
        }
      }

      newByPostId[postId] = ids;
      return {
        ...state,
        byPostId: newByPostId,
        entities: newEntities,
        myReactionByPostId: {
          ...state.myReactionByPostId,
          [postId]: myReactions,
        },
      };
    }
    default:
      return state;
  }
}
