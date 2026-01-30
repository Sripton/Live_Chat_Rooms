import {
  SET_CREATE_COMMENT,
  GET_POST_COMMENTS,
  SET_EDIT_COMMENT,
  DELETE_COMMENT,
} from "../types/commentTypes";

import { CommentState, CommentAction } from "../types/commentTypes";

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
      const comment = action.payload;
      const postId = comment.postId;
      const prevList = state.byPostId[postId] ?? [];
      return {
        ...state,
        byPostId: {
          ...state.byPostId,
          [postId]: [...prevList, comment],
        },
      };
    }
    default:
      return state;
  }
}
