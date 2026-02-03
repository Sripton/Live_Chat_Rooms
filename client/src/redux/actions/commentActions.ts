import { SET_CREATE_COMMENT, GET_POST_COMMENTS } from "../types/commentTypes";
import axios from "axios";
import type { AppDispatch } from "../store/store";
import type { CreateCommentDTO, Comment } from "../types/commentTypes";

export const fetchAll = () => {};

export const createComment =
  (postId: string, inputs: CreateCommentDTO) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.post<Comment>(
        `/api/comments/${postId}`,
        inputs,
      );
      dispatch({ type: SET_CREATE_COMMENT, payload: data });
    } catch (error) {
      console.log("Ошибка при создании коммнетария", error);
    }
  };

export const getComments =
  (postId: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.get<Comment[]>(`/api/comments/${postId}`);
      dispatch({
        type: GET_POST_COMMENTS,
        payload: { postId, comments: data },
      });
    } catch (error) {
      console.log(error);
    }
  };
