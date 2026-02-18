import {
  SET_REACTION_COMMENT_CREATE,
  GET_REACTION_COMMENT_LIST,
} from "../../redux/types/commentReactionTypes";
import axios from "axios";

// redux store
import type { AppDispatch } from "../store/store";

// redux Reaction type
import type {
  ReactionType,
  CommentReaction,
} from "../../redux/types/commentReactionTypes";

// экшен для создания реакции на комментарии
export const createCommentReaction =
  (commentId: string, reactionType: ReactionType) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.post<CommentReaction>(
        `/api/comment_reactions/${commentId}`,
        { reactionType },
      );
      dispatch({ type: SET_REACTION_COMMENT_CREATE, payload: data });
    } catch (error) {
      console.log(error);
    }
  };

// экшен для получения реакций на комментарии
export const getCommentReaction =
  (commentId: string, userId: string | null) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.get<CommentReaction[]>(
        `/api/comment_reactions/${commentId}`,
      );
      dispatch({
        type: GET_REACTION_COMMENT_LIST,
        payload: { commentId, reactions: data, userId },
      });
    } catch (error) {
      console.log(error);
    }
  };
