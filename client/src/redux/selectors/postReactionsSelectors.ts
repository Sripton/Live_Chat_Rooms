import type { RootState } from "../store/store";

export const selectReactionIdsByPostId = (state: RootState, postId: string) =>
  // страховка что бы приложение не падало
  state.postReaction.byPostId[postId] ?? []; // возвращает массив реакций [r1,r2,r3,r4] или []

export const selectReactionsByPostId = (state: RootState, postId: string) => {
  const ids = selectReactionIdsByPostId(state, postId); // [r1,r2,r3,r4] или []
  return ids.map((id) => state.postReaction.entities[id]).filter(Boolean); // возвращает все объекты по id
};

export const selectReactionCountsByPostId = (
  state: RootState,
  postId: string,
) => {
  const reactions = selectReactionsByPostId(state, postId); // все объекты по id
  let like = 0;
  let dislike = 0;

  for (const r of reactions) {
    if (r?.reactionType === "LIKE") like++;
    if (r?.reactionType === "DISLIKE") dislike++;
  }

  return {
    like,
    dislike,
    total: reactions.length,
  };
};
