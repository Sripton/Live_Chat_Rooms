// ----------------------- Reaction Comments ------------------------
// Тип экшена для создания реакций на  комментарии  пользователем
export const SET_REACTION_COMMENT_CREATE = "SET_REACTION_COMMENT_CREATE";

// Тип экшена для получения реакций на  посты  пользователем
export const GET_REACTION_COMMENT_LIST = "GET_REACTION_COMMENT_LIST";

// пример данныx с сервера
// {
//   "id": "cmlm9oel20000fbosshm7bqjp",
//   "userId": "cmlj628ia0006j2os3z2x91zg",
//   "commentId": "cmljjicas0001k8osl739ixdx",
//   "reactionType": "DISLIKE",
//   "createdAt": "2026-02-14T12:02:30.230Z",
//   "updatedAt": "2026-02-14T12:08:31.273Z"
// }

// Тип реакции
export type ReactionType = "LIKE" | "DISLIKE";

// Тип реакции. форма одного объекта реакции
export interface CommentReaction {
  id: string;
  userId: string;
  commentId: string;
  reactionType: ReactionType;
  createdAt: string;
  updatedAt: string;
}

// то, что отправляем на сервер. объект передаваемый в API.
export interface CreateReactionDTO {
  reactionType: ReactionType;
}

export interface CommentReactionState {
  userId: string;
  commentId: string;
  reactionType: ReactionType | null;
  allCommentReactions: CommentReaction[];
}

// Типы экшенов
export type CommentReactions =
  | { type: typeof SET_REACTION_COMMENT_CREATE; payload: CommentReaction }
  | { type: typeof GET_REACTION_COMMENT_LIST; payload: CommentReaction[] };
