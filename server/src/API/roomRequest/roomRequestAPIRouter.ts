import express from "express";
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";

const router = express.Router();
type CreateRoomRequestBody = {
  roomId: string;
};
router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { roomId } = req.body as CreateRoomRequestBody;
    // Проверяем действительно ли пользователь авторизован
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }
    //  Проверяем: действительно ли комната существует и принадлежит указанному владельцу
    const room = await prisma.room.findUnique({ where: { id: roomId } });

    if (!room || !room.isPrivate) {
      return res
        .status(404)
        .json({ message: "Комната не найдена или не приватная" });
    }

    // Если пользователь владелец комнаты, запрос делать не нужно:
    if (room.ownerId === userId) {
      return res.status(400).json({
        message: "Вы являетесь владельцем комнаты",
      });
    }

    //  Проверка: уже существует такой запрос?
    const lastRequest = await prisma.roomRequest.findUnique({
      where: {
        // композитный unique
        userId_roomId: {
          userId: userId,
          roomId: room.id,
        },
      },
    });

    // Если запрос сущесвтует, даем пользовтаелю информацию об статусе
    if (lastRequest) {
      if (lastRequest.status === "PENDING") {
        return res.status(400).json({ message: "Запрос уже отправлен" });
      }
      if (lastRequest.status === "REJECTED") {
        return res.status(403).json({ message: "Доступ отклонён." });
      }
    }

    // Создаём новый запрос
    const createRequest = await prisma.roomRequest.create({
      data: {
        userId,
        ownerId: room.ownerId,
        roomId: room.id,
        status: "PENDING",
      },
    });

    // Отправляем на клиент 
    res.status(200).json({
      message: "Запрос на доступ отправлен",
      request: createRequest,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(400).json({
        message: "Запрос в эту комнату уже существует",
      });
    }
    console.error(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
