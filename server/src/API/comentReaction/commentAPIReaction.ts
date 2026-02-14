import express from "express";
import { Reaction } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const router = express.Router();

// type id
type ParamsCommentId = {
  commentId: string;
};

// type body
type ParamsBody = {
  reactionType: Reaction;
};

// Маршрут для создания реакций к комментариям
router.post(
  `/:commentId`,
  async (req: express.Request, res: express.Response) => {
    const { commentId } = req.params as ParamsCommentId;
    const { reactionType } = req.body as ParamsBody;

    try {
      // заюираем сессию пользовтеля
      const userId = req.session.userId;

      if (!userId) {
        return res
          .status(401) // код 401 не зарегистрирован
          .json({ message: "Пользователь не зарегистрирвован" });
      }

      // имещь комментарий под которым хотят оставить реакцию
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        return res
          .status(404) // код не найдено
          .json({ message: "Комментарий не найден" });
      }

      // Проверка, оставлял ли пользователь уже реакцию на этот пост
      const existingReaction = await prisma.commentReaction.findUnique({
        where: {
          userId_commentId: {
            userId: userId,
            commentId: commentId,
          },
        },
      });

      // // Если реакция уже существует, обновляем её
      if (existingReaction) {
        const updated = await prisma.commentReaction.update({
          where: { id: existingReaction.id },
          data: { reactionType },
        });
        return res.status(200).json(updated);
      }

      // Если реакции нет, создаем новую
      const reaction = await prisma.commentReaction.create({
        data: {
          userId,
          commentId: comment.id,
          reactionType: reactionType,
        },
      });

      //  отправляем созданную реакцию на сервер
      return res.status(200).json(reaction);
    } catch (error) {
      console.log(error);
    }
  },
);

export default router;
