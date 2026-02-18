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

// Тип reactionType
export type ReactionType = "LIKE" | "DISLIKE";

// Тип реакции. форма одного объекта реакции
export type CommentReaction = {
  id: string;
  userId: string;
  commentId: string;
  reactionType: ReactionType;
  createdAt: string;
  updatedAt: string;
};

// тип для счетчика реакций
export type CommentRectionCounts = {
  like: number;
  dislike: number;
};

// тип для работы с реакциями
export type CommetReactionDate = {
  reactions: CommentReaction[]; // список реакций
  counts: CommentRectionCounts; // счетчики
  myReaction: ReactionType | null; // реакция текущего юзера на этот comment
  loaded: boolean;
};

// state
export interface CommentReactionState {
  byCommentId: Record<string, CommetReactionDate>;
}

// Типы экшенов
export type CommentReactionActions =
  | { type: typeof SET_REACTION_COMMENT_CREATE; payload: CommentReaction }
  | {
      type: typeof GET_REACTION_COMMENT_LIST;
      payload: {
        commentId: string;
        reactions: CommentReaction[];
        userId?: string | null; //  для вычисления myReaction
      };
    };
