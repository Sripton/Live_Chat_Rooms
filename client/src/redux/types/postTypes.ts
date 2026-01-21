// ----------------------- Post ------------------------
// Тип экшена для создания поста пользователем
export const SET_CREATE_POST = "SET_CREATE_POST";

// Тип экшена для получения всех постов к одной комнате
export const GET_ROOM_POSTS = "GET_ROOM_POSTS";

// Тип экшена для изменения  поста
export const SET_EDIT_POST = "SET_EDIT_POST";

// Тип экшена для удаления  поста
export const DELETE_POST = "DELETE_POST";

// {
//   "id": "cmknny4b80000gtos8de06zst",
//   "postTitle": "Elmar create post",
//   "userId": "cmkm9yn4k0000j1osk5frt0sm",
//   "roomId": "cmkm9z1850002j1osel7qbrh9",
//   "createdAt": "2026-01-21T06:50:01.939Z",
//   "updatedAt": "2026-01-21T06:50:01.939Z",
//   "user": {
//     "id": "cmkm9yn4k0000j1osk5frt0sm",
//     "username": "Elmar",
//     "avatar": null
//   }
// }

// Тип поста, который приходит с сервера. Описание одного поста
// Для работы с одним постом
export interface Post {
  id: string;
  postTitle: string;
  userId: string;
  roomId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string | null;
    avatar: string | null;
  };
}

// то, что отправляем на сервер. объект передаваемый в API.
export interface CreatePostDTO {
  postTitle: string;
}

// стейт. как посты лежат в Redux. форма хранилища состояния.
//Тип состояния в Redux. Для работы со всем состоянием Redux
export interface PostsState {
  allPosts: Post[];
}

export type PostActions =
  | { type: typeof SET_CREATE_POST; payload: Post } // сервер вернул созданный пост
  | { type: typeof GET_ROOM_POSTS; payload: Post[] } // список постов комнаты
  | { type: typeof SET_EDIT_POST; payload: { id: string; postTitle: string } } // что и где меняем
  | { type: typeof DELETE_POST; payload: { id: string } }; // какой пост удалить по id
