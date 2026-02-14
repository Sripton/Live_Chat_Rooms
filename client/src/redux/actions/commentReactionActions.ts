import {
  SET_REACTION_COMMENT_CREATE,
  GET_REACTION_COMMENT_LIST,
} from "../../redux/types/commentReactionTypes";
import axios from "axios";

// redux store
import type { AppDispatch } from "../store/store";

// redux Reaction type
import type { CommentReaction } from "../../redux/types/commentReactionTypes";

export const fetch = () => {};

// экшен для создания реакции на комментарии
export const createCommentReaction =
  (commentId: string, reactionType: string) =>
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
