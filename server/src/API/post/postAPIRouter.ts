import express from "express";
import { prisma } from "../../lib/prisma";
const router = express.Router();

// тип параметр
type Params = { roomId: string };
// тип body
type Body = { postTitle?: unknown };

router.post(
  `/:roomId`,
  async (req: express.Request<Params, any, Body>, res: express.Response) => {
    const { roomId } = req.params;
    const postTitle = String(req.body?.postTitle ?? "").trim();

    // Забираем id пользовтаеля из сессии
    const userId = req.session.userId;
    if (!userId)
      return res.status(401).json({ message: "Необходима авторизация." });

    // Валидация поста
    if (!postTitle)
      return res.status(400).json({ message: "Пост не может быть пустым" });
    try {
      // Ищем объект Room по его первичному ключу (id)
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room)
        return res.status(404).json({ message: "Комната не найдена." });

      // если приватная — проверяем доступ
      if (room.isPrivate && room.ownerId !== userId) {
        const admission = await prisma.roomAdmission.findUnique({
          where: {
            userId_roomId: { userId, roomId },
          },
        });
        if (!admission)
          return res.status(403).json({ message: "Нет доступа к комнате." });
      }

      //создаем post
      const post = await prisma.post.create({
        data: {
          userId,
          roomId: room.id,
          postTitle,
        },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
        },
      });

      return res.status(201).json(post);
    } catch (error: unknown) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка при создании поста" });
    }
  },
);

export default router;
