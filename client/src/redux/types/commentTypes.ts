// -----------------------  Comments ------------------------
// Тип экшена для создания комментария к посту пользователем
export const SET_CREATE_COMMENT = "SET_CREATE_COMMENT";

// Тип экшена для получения комментариув к посту
export const GET_POST_COMMENTS = "GET_POST_COMMENTS";

// Тип экшена для получения ко-ва комментариев к посту
export const SET_COMMENT_COUNTS = "SET_COMMENT_COUNTS";

// Тип экшена для изменения  комментария
export const SET_EDIT_COMMENT = "SET_EDIT_COMMENT";

// Тип экшена для удаления  комментария
export const DELETE_COMMENT = "DELETE_COMMENT";

// Тип экшена для получения  комментариев к посту и комментариям
export const REPLIES_SET = "REPLIES_SET";

// пример данныx с сервера
// {
//   "id": "cmkz6f4dc0000qeosqz3py96l",
//   "commentTitle": "Farid create comment from Elmar post",
//   "userId": "cmkmia3lz00011yosti9uuj96",
//   "postId": "cmkwccat600007wosrp0alyzf",
//   "parentId": null,
//   "createdAt": "2026-01-29T08:12:36.191Z",
//   "updatedAt": "2026-01-29T08:12:36.191Z",
//   "user": {
//     "id": "cmkmia3lz00011yosti9uuj96",
//     "username": "Farid",
//     "avatar": null
//   }
// }

export interface CommentUser {
  id: string;
  username: string | null;
  avatar: string | null;
}

// Тип комментария, который приходит с сервера. Описание одного комментария
// Для работы с одним комментарием
// то что  получаем от сервера и кладём в Redux
export interface Comment {
  id: string;
  commentTitle: string;
  userId: string;
  postId: string;
  parentId: string | null; // ответ к посту/комментарию
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
}

// DTO для создания
// то что отправляем на сервер
export interface CreateCommentDTO {
  commentTitle: string;
  parentId?: string | null;
}

export interface CommentState {
  // включает в себя  и другие поля.
  byPostId: Record<string, Comment[]>; // все комментарии по ключу postId
  countsByPostId: Record<string, number>; // ко-во всех комментариев по ключу postId
  profile: {
    // ответы на посты пользовтаеля
    commentsOnUserPostsByUserId: Record<string, Comment[]>;
    // ответы к комментариям пользовтаеля
    repliesToUserCommentsByUserId: Record<string, Comment[]>;
  };
}

export type CommentAction =
  | { type: typeof SET_CREATE_COMMENT; payload: Comment }
  | {
      type: typeof GET_POST_COMMENTS;
      payload: { postId: string; comments: Comment[] };
    }
  | {
      type: typeof SET_COMMENT_COUNTS;
      payload: { postId: string; count: number };
    }
  | { type: typeof SET_EDIT_COMMENT; payload: Comment }
  | {
      type: typeof DELETE_COMMENT;
      payload: { postId: string; commentId: string };
    };
