// ----------------------- Reaction Posts ------------------------
// Тип экшена для создания реакций на  посты  пользователем
export const SET_POST_REACTION_CREATE = "SET_REACTION_POST_CREATE";

// Тип экшена для получения реакций на  посты  пользователем
export const GET_POST_REACTION_LIST = "GET_REACTION_POST_LIST";

// пример данныx с сервера
// [
//   {
//     "id": "cmks04r6h0001haos7bnp29sg",
//     "userId": "cmkm9zvz90008j1oskmuom1vt",
//     "postId": "cmks03d080000haosydwmlq1o",
//     "reactionType": "LIKE",
//     "createdAt": "2026-01-24T07:42:11.609Z",
//     "updatedAt": "2026-01-24T07:42:11.609Z"
//   },
//   {
//     "id": "cmktgecvy0000mhoskl96gygb",
//     "userId": "cmkmi9cx700001yosy0bga6rb",
//     "postId": "cmks03d080000haosydwmlq1o",
//     "reactionType": "DISLIKE",
//     "createdAt": "2026-01-25T08:05:19.678Z",
//     "updatedAt": "2026-01-25T08:05:19.678Z"
//   }
// ]

export type ReactionType = "LIKE" | "DISLIKE";

// Тип реакции. форма одного объекта реакции
export interface Reaction {
  id: string;
  userId: string;
  postId: string;
  reactionType: ReactionType;
  createdAt: string;
  updatedAt: string;
}

// то, что отправляем на сервер. объект передаваемый в API.
export interface CreateReactionDTO {
  reactionType: ReactionType;
}

// стейт. как реакции лежат в Redux. форма хранилища состояния.
// форма куска состояния Redux
// export interface ReactionState {
//   // включает в себя  и другие поля loader, error... в будущем
//   reactions: Reaction[];
// }

export interface ReactionState {
  byPostId: Record<string, string[]>; // postId -> массив reactionId
  entities: Record<string, Reaction | undefined>; // reactionId -> Reaction
  // isLoadingByPostId: Record<string, boolean>; на будушее если мне понадобится
  myReactionByPostId: Record<string, ReactionType | null>;
  errorByPostId: Record<string, string | null>;
}

// Типы экшенов
export type ReactionActions =
  | {
      type: typeof SET_POST_REACTION_CREATE;
      payload: Reaction;
    }
  | {
      type: typeof GET_POST_REACTION_LIST;
      payload: {
        postId: string;
        userId: string;
        reactions: Reaction[];
      };
    };
