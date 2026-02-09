import type { RootState } from "../store/store";
import { createSelector } from "reselect";

// export const selectReactionIdsByPostId = (state: RootState, postId: string) =>
//   // страховка что бы приложение не падало
//   state.postReaction.byPostId[postId] ?? []; // возвращает массив реакций  по ключу postId: [r1,r2,r3,r4] или []

// export const selectReactionsByPostId = (state: RootState, postId: string) => {
//   const ids = selectReactionIdsByPostId(state, postId); // [r1,r2,r3,r4] или []
//   // Селектор всегда делает: map, filter
//   return ids.map((id) => state.postReaction.entities[id]).filter(Boolean); // возвращает все объекты по id
// };

// Проблема: селектор каждый вызов возвращает новый объект, лишние ререндеры
// Нужно мемоизировать селектор или вернуть примитивы, стабильную ссылку.
// export const selectReactionCountsByPostId = (
//   state: RootState,
//   postId: string,
// ) => {
//   const reactions = selectReactionsByPostId(state, postId); // все объекты по id
//   let like = 0;
//   let dislike = 0;

//   for (const r of reactions) {
//     if (r?.reactionType === "LIKE") like++;
//     if (r?.reactionType === "DISLIKE") dislike++;
//   }

//   // создаёт { like, dislike, total } даже если данные не изменились, ссылка новая
//   return {
//     like,
//     dislike,
//     total: reactions.length,
//   };
// };

// reselect + фабрика селектора на PostCard
export const makeSelectReactionCountsByPostId = () =>
  // каждый раз создаём новый селектор с собственным кешем
  createSelector(
    [
      (state: RootState) => state.postReaction.byPostId,
      (state: RootState) => state.postReaction.entities,
      (_: RootState, postId: string) => postId,
    ],
    (byPostId, entities, postId) => {
      const ids = byPostId[postId] ?? []; // по ключу postId: [массив реакций на пост]
      let like = 0;
      let dislike = 0;

      for (const id of ids) {
        const r = entities[id];
        if (!r) continue;
        if (r.reactionType === "LIKE") like++;
        else if (r.reactionType === "DISLIKE") dislike++;
      }
      return { like, dislike, total: ids.length };
    },
  );
