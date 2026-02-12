import {
  SET_CREATE_COMMENT,
  GET_POST_COMMENTS,
  SET_EDIT_COMMENT,
  DELETE_COMMENT,
} from "../types/commentTypes";
import axios from "axios";
import type { AppDispatch } from "../store/store";
import type { CreateCommentDTO, Comment } from "../types/commentTypes";

export const fetchAll = () => {};

// экшен для создания коммнетрия
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

// экшен для полчучения всех  коммнетриев
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

// экшен для изменения коммнетрия
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

// экшен для удаления коммнетрия
export const deleteCommentActions =
  (postId: string, commentId: string) => async (dispatch: AppDispatch) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      dispatch({
        type: DELETE_COMMENT,
        payload: { postId, commentId },
      });
    } catch (error) {
      console.log(error);
    }
  };
