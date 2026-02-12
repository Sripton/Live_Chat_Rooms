import express from "express";
import { prisma } from "../../lib/prisma";
import { Comment } from "@prisma/client";

const router = express.Router();

// тип postID
type ParamsPostId = {
  postId: string;
};

// тип запроса для создания комментария
type ParamsBodyCreate = {
  commentTitle: string;
  parentId?: string | null;
};

// тип запроса для изменения комментария
type ParamsBodyEdit = {
  commentTitle: string;
};

// тип commentID
type ParamsCommentId = {
  commentId: string;
};

// Маршрут API для создания комментария
router.post(`/:postId`, async (req: express.Request, res: express.Response) => {
  const { postId } = req.params as ParamsPostId;
  const { commentTitle, parentId } = req.body as ParamsBodyCreate;
  try {
    // Забираем сессию пользователя
    const userId = req.session.userId;

    // Если пользовтаель не зарегистрирован не пропускаем дальше
    if (!userId)
      return res
        .status(401)
        .json({ message: "Пользователь не зарегистрирован" });

    // Ищем пост под которым хотим оставить комменатрий
    const post = await prisma.post.findUnique({ where: { id: postId } });

    // выкидываем ошибку
    if (!post) return res.status(404).json({ message: "Пост не найден" });

    let parent = null;

    // Если parentID передан
    if (parentId) {
      // Ищем коммнетрий по parent_id
      parent = await prisma.comment.findUnique({ where: { id: parentId } });

      if (!parent) {
        // нельзя ответить на несуществующий комментарий
        return res.status(400).json({ message: "Комментарий не найден" });
      }
      if (parent.postId !== post.id) {
        // нельзя ответить на комментарий из другого поста
        return res.status(400).json({ message: "Принадлежит к другому посту" });
      }
    }

    //Создаем новый комментарий
    const data: any = {
      userId,
      postId: post.id,
      commentTitle,
    };

    // Нормализация parentId
    if (parentId?.trim()) data.parentId = parentId.trim();

    // Создание комментария
    const comment = await prisma.comment.create({
      data,
      // возвращаем коммнентарий с User
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ошибка при написании ответа",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Маршрут API для передачи комментариев на клиент
router.get("/:postId", async (req: express.Request, res: express.Response) => {
  const { postId } = req.params as ParamsPostId;
  try {
    const comments = await prisma.comment.findMany({
      // ищем все комментарии к посту по postId
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    res.json(comments);
  } catch (error) {
    res.status(404).json({ message: "Сервер ответил с ошибкой" });
  }
});

// Мрашрут для изменения комментария
router.patch(
  "/:commentId",
  async (req: express.Request, res: express.Response) => {
    const { commentId } = req.params as ParamsCommentId;
    const { commentTitle } = req.body as ParamsBodyEdit;
    try {
      //  ищем сам комментарий по id
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment)
        return res.status(404).json({ message: "Коммнетрий не обнаружен" });

      // Обновляем комментарий
      const updatedComment = await prisma.comment.update({
        where: { id: comment.id },
        data: { commentTitle },
      });

      // отдаем обновленный комментарий на клиент
      return res.status(200).json(updatedComment);
    } catch (error) {
      console.log(error);
    }
  },
);

// Мрашрут для удаления комментария
router.delete(
  "/:commentId",
  async (req: express.Request, res: express.Response) => {
    const { commentId } = req.params as ParamsCommentId;
    try {
      // удаляем комментарий по его id
      await prisma.comment.delete({
        where: { id: commentId },
      });
      return res.status(200).json({ commentId });
    } catch (error) {
      console.log(error);
    }
  },
);

export default router;
