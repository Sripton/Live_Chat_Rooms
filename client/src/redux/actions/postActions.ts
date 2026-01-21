import { SET_CREATE_POST } from "../types/postTypes";
import type { AppDispatch } from "../store/store";
import type { Post, CreatePostDTO } from "../types/postTypes";
import axios from "axios";
export const fetchAllPost = () => {};

// создание нового поста
export const createPostSubmit =
  (roomId: string, 
    inputs: CreatePostDTO // тип из postTypes
  ) => async (dispatch: AppDispatch) => {
    try {
      // POST-запрос на создание поста внутри конкретной комнаты
      const { data } = await axios.post<Post>(`/api/posts/${roomId}`, inputs);
      dispatch({ type: SET_CREATE_POST, payload: data });
    } catch (error) {
      console.error("Ошибка при создании   поста:", error);
    }
  };
