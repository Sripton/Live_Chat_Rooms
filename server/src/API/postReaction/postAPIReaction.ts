import express from "express";
import { prisma } from "../../lib/prisma";
import { Reaction } from "@prisma/client";
const router = express.Router();

// тип id
type ParamsPostId = {
  postId: string;
};

// тип body
type ParamsBody = {
  reactionType: Reaction;
};

// generic-параметры в express.Request
// Тип для req.params
// Тип для res.locals (объект, содержащий локальные переменные ответа)
// Тип для req.body
// Тип для req.query (необязательный)

// маршрут для создания реакций к постам
router.post(
  "/:postId",
  async (
    req: express.Request<ParamsPostId, any, ParamsBody>,
    res: express.Response,
  ) => {
    const { postId } = req.params;
    const { reactionType } = req.body;
    try {
      // забираем id пользователя из сессии
      const userId = req.session.userId;

      if (!userId) {
        return res
          .status(401) // код 401 не зарегистрирован
          .json({ message: "Пользователь не зарегистрирвован" });
      }

      // имещь пост под которым хотят оставить реакцию
      const post = await prisma.post.findUnique({ where: { id: postId } });

      if (!post) {
        return res
          .status(404) // код не найдено
          .json({ message: "Пост не найден" });
      }

      // Проверка, оставлял ли пользователь уже реакцию на этот пост
      const existingReaction = await prisma.postReaction.findUnique({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });

      // Если реакция уже существует, обновляем её
      if (existingReaction) {
        // prisma !== save() для обновления. явно обновляем
        const updated = await prisma.postReaction.update({
          where: { id: existingReaction.id }, // находим реакцию по id
          data: { reactionType }, // обновляем реакцию
        });
        return res.status(200).json(updated); // отпраляем обновление на клиент
      }
      // Если реакции нет, создаем новую
      const reaction = await prisma.postReaction.create({
        data: {
          userId,
          postId: post.id, // нужно явно вернуть ответ на наличие поста в условии if (!post)
          reactionType: reactionType,
        },
      });

      //  отправляем созданную реакцию на сервер
      return res.status(200).json(reaction);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Не поставить лайк" });
    }
  },
);

// маршрут для передачи реакций
router.get("/:postId", async (req: express.Request, res: express.Response) => {
  const { postId } = req.params as ParamsPostId;
  try {
    // забираем все реакции с сервера
    const reactions = await prisma.postReaction.findMany({
      where: { postId: postId },
    });
    // страхуем если реакций нет совсем
    if (!reactions.length) {
      return res.json([]);
    }
    // отдаем данные на клиент
    return res.status(200).json(reactions);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Ошибка при передачи реакций" });
  }
});

export default router;
