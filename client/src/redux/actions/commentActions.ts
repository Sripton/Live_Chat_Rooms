import {
  SET_CREATE_COMMENT,
  GET_POST_COMMENTS,
  SET_EDIT_COMMENT,
} from "../types/commentTypes";
import axios from "axios";
import type { AppDispatch } from "../store/store";
import type {
  CreateCommentDTO,
  Comment,
  UpdateCommentDTO,
} from "../types/commentTypes";

export const fetchAll = () => {};

export const createCommentActions =
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

export const editCommentActions =
  (commentId: string, commentTitle: string) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.patch<Comment>(
        `/api/comments/${commentId}`,
        { commentTitle },
      );

      dispatch({ type: SET_EDIT_COMMENT, payload: data });
    } catch (error) {
      console.log(error);
    }
  };
