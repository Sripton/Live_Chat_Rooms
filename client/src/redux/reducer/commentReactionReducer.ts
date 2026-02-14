import {
  SET_REACTION_COMMENT_CREATE,
  GET_REACTION_COMMENT_LIST,
} from "../types/commentReactionTypes";

import type {
  CommentReactionState,
  CommentReactions,
} from "../types/commentReactionTypes";

// начальное состояние Redux. первое значение state, когда приложение загрузилось.
const initialState: CommentReactionState = {
  userId: "",
  commentId: "",
  reactionType: null,
  allCommentReactions: [],
};

export default function commentReactionReducer(
  state: CommentReactionState = initialState,
  action: CommentReactions,
): CommentReactionState {
  switch (action.type) {
    case SET_REACTION_COMMENT_CREATE: {
      const reaction = action.payload;
      // функция проверки на реакцию
      const match = (req: any) =>
        req.userId === reaction.userId && req.commentId === reaction.commentId;

      // проверяем существует ли реакция на данный комментарий
      const existingReaction = state.allCommentReactions.some(match);

      return {
        ...state,
        userId: action.payload.userId,
        commentId: action.payload.commentId,
        reactionType: action.payload.reactionType,
        allCommentReactions: existingReaction
          ? state.allCommentReactions.map((req: any) =>
              req.id === reaction.id ? reaction : req,
            )
          : [...state.allCommentReactions, reaction],
      };
    }
    default:
      return state;
  }
}
