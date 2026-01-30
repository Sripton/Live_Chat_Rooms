import {
  SET_CREATE_POST,
  GET_ROOM_POSTS,
  SET_EDIT_POST,
  DELETE_POST,
} from "../types/postTypes";
import type { AppDispatch } from "../store/store";
import type { Post, CreatePostDTO } from "../types/postTypes";
import axios from "axios";

// создание нового поста
export const createPostSubmit =
  (
    roomId: string,
    inputs: CreatePostDTO, // тип из postTypes
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      // POST-запрос на создание поста внутри конкретной комнаты
      const { data } = await axios.post<Post>(`/api/posts/${roomId}`, inputs);
      dispatch({ type: SET_CREATE_POST, payload: data });
    } catch (error) {
      console.error("Ошибка при создании   поста:", error);
    }
  };

// забираем все посты с сервера
export const fetchPosts = (roomId: string) => async (dispatch: AppDispatch) => {
  try {
    const { data } = await axios.get<Post[]>(`/api/posts/${roomId}`);
    dispatch({ type: GET_ROOM_POSTS, payload: data });
  } catch (error) {
    console.error("Ошибка при получении всех постов:", error);
  }
};

// Функция изменения поста
export const editPost =
  (postId: string, postTitle: string) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.patch(`/api/posts/changepost/${postId}`, {
        postTitle, // отправляем объект
      });
      dispatch({
        type: SET_EDIT_POST,
        payload: { postId: data.id, postTitle: data.postTitle },
      });
    } catch (error) {
      console.log("Ошибка при изменени поста", error);
    }
  };

// Функция изменения поста
export const deletepost =
  (
    postId: string, // функция принимает только строку — id поста
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.delete<{ postId: string }>( // тип ответа сервера.
        `/api/posts/deletepost/${postId}`,
      );
      dispatch({ type: DELETE_POST, payload: { postId: data?.postId } });
    } catch (error) {
      console.log("Не удалось удалить пост", error);
    }
  };
