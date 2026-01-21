import {
  SET_CREATE_POST,
  GET_ROOM_POSTS,
  SET_EDIT_POST,
  DELETE_POST,
} from "../types/postTypes";

import type { PostActions, PostsState } from "../types/postTypes";

// начальное состояние Redux. первое значение state, когда приложение загрузилось.
const initialState: PostsState = {
  allPosts: [], // список всех постов текущей комнаты
};

export default function postReducer(
  state: PostsState = initialState,
  action: PostActions,
): PostsState { // возвращаемый тип
  switch (action.type) {
    case SET_CREATE_POST:
      // защита от дубликатов
      if (state.allPosts.some((post) => post.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        allPosts: [action.payload, ...state.allPosts], // новый пост сверху всегда
      };

    default:
      return state;
  }
}
