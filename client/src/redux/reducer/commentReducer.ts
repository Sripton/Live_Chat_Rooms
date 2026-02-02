import {
  SET_CREATE_COMMENT,
  GET_POST_COMMENTS,
  SET_EDIT_COMMENT,
  DELETE_COMMENT,
} from "../types/commentTypes";

import type { CommentState, CommentAction } from "../types/commentTypes";

// начальное состояние Redux. первое значение state, когда приложение загрузилось.
const initialState: CommentState = {
  byPostId: {},
  countsByPostId: {},
  profile: {
    commentsOnUserPostsByUserId: {},
    repliesToUserCommentsByUserId: {},
  },
};
export default function commentReducer(
  state: CommentState = initialState,
  action: CommentAction,
): CommentState {
  switch (action.type) {
    case SET_CREATE_COMMENT: {
      const comment = action.payload; // создаем комментарий
      const postId = comment.postId; // забираем его PostId
      const prevList = state.byPostId[postId] ?? []; // забираем из state.byPostId[по ключу postId] комментарии либо если нету []
      return {
        ...state, //  возвразаем текущий state
        byPostId: { // по ключу byPostId
          ...state.byPostId, // вохвращаем все поля 
          [postId]: [...prevList, comment], // по ключу [postId]: [...сохраняем старые поля, добавялем новый сomment]
        },
      };
    }

    


    default:
      return state;
  }
}
