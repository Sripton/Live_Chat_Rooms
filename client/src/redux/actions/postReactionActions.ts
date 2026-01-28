import {
  SET_POST_REACTION_CREATE,
  GET_POST_REACTION_LIST,
} from "../types/postReactionsTypes";
import axios from "axios";

import type { AppDispatch } from "../store/store";
import type { Reaction, ReactionType } from "../types/postReactionsTypes";

// экшен функция для создания реакций
export const createPostReaction =
  (postId: string, reactionType: ReactionType) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.post<Reaction>(
        `/api/post_reactions/${postId}`,
        {
          reactionType,
        },
      );

      dispatch({ type: SET_POST_REACTION_CREATE, payload: data });
    } catch (error) {
      console.log("Реакция не создалась", error);
    }
  };

// экшен функция для загрузки всех  реакций
export const getPostReactions =
  (postId: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.get<Reaction[]>(
        `/api/post_reactions/${postId}`,
      );
      dispatch({ type: GET_POST_REACTION_LIST, payload: data });
    } catch (error) {
      console.log("Ошибка при подгрузке реакций", error);
    }
  };
