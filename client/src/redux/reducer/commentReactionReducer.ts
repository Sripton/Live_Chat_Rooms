import {
  SET_REACTION_COMMENT_CREATE,
  GET_REACTION_COMMENT_LIST,
  type CommentReactionState,
  type CommentReactionActions,
  type CommentReaction,
} from "../types/commentReactionTypes";

// начальное состояние Redux. первое значение state, когда приложение загрузилось.
const initialState: CommentReactionState = {
  byCommentId: {},
};

function buildReactionDate(
  reactions: CommentReaction[],
  userId?: string | null,
) {
  // для моих реакций
  let myReaction: "LIKE" | "DISLIKE" | null = null;

  // для подсчета ко-ва реакций
  const counts = { like: 0, dislike: 0 };
  // вычисляем счетчики like/dislike а также реакцию даннного пользовтеля на коммнетрий
  for (const r of reactions) {
    if (r.reactionType === "LIKE") counts.like += 1;
    if (r.reactionType === "DISLIKE") counts.dislike += 1;
    if (r.userId === userId) myReaction = r.reactionType;
  }
  // возвращаем данные
  return {
    reactions,
    counts,
    myReaction,
    loaded: true,
  };
}

export default function commentReactionReducer(
  state: CommentReactionState = initialState,
  action: CommentReactionActions,
): CommentReactionState {
  switch (action.type) {
    case GET_REACTION_COMMENT_LIST: {
      const { commentId, reactions, userId } = action.payload;
      return {
        ...state,
        byCommentId: {
          ...state.byCommentId,
          [commentId]: buildReactionDate(reactions, userId ?? null),
        },
      };
    }

    case SET_REACTION_COMMENT_CREATE: {
      const reaction = action.payload;
      const commentId = reaction.commentId;

      // текущее состояние реакций
      const prev = state.byCommentId[commentId] ?? buildReactionDate([], null);

      // обновляем/вставляем реакцию пользователя для этого commentId
      const match = (r: CommentReaction) =>
        r.userId === reaction.userId && r.commentId === reaction.commentId;

      //  проверка на существование
      const exist = prev.reactions.some(match); // true/false

      const nextReactions = exist
        ? prev.reactions.map((r) => (match(r) ? reaction : r))
        : [...prev.reactions, reaction];

      // подсчет реакций
      const nextCounts = { like: 0, dislike: 0 };
      for (const r of nextReactions) {
        if (r.reactionType === "LIKE") nextCounts.like += 1;
        if (r.reactionType === "DISLIKE") nextCounts.dislike += 1;
      }

      return {
        ...state,
        byCommentId: {
          ...state.byCommentId,
          [commentId]: {
            reactions: nextReactions,
            counts: nextCounts,
            myReaction: reaction.reactionType,
            loaded: true,
          },
        },
      };
    }

    default:
      return state;
  }
}
