import express from "express";
import { prisma } from "../../lib/prisma";

const router = express.Router();

// тип ID
type ParamsId = {
  postId: string;
};

// тип ID
type ParamsBody = {
  commentTitle: string;
  parentId?: string | null;
};

// Маршрут API для создания комментария
router.post(`/:postId`, async (req: express.Request, res: express.Response) => {
  const { postId } = req.params as ParamsId;
  const { commentTitle, parentId } = req.body as ParamsBody;
  try {
    // Забираем сессию пользователя
    // const userId = req.session.userId;
    const userId = "cmkmia3lz00011yosti9uuj96";

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

export default router;
