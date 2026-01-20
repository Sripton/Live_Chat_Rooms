import express from "express";
import { prisma } from "../../lib/prisma";
import { RoomRequestStatus } from "@prisma/client";
import { requireRoomAccess } from "../../API/rooms/authRoomRouter";
const router = express.Router();

type Room = {
  nameRoom: string;
  isPrivate: boolean;
};

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    // Получаем данные из тела запроса
    const { nameRoom, isPrivate } = req.body as Room;

    // Получаем ID пользователя из сессии
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    // Создаем новую комнату в базе данных  через transaction
    // Чтобы не было ситуации, когда комната создалась, а admission — нет:
    // const room = await prisma.$transaction(async (tx) => {
    //   const room = await tx.room.create({
    //     data: {
    //       nameRoom,
    //       isPrivate,
    //       ownerId: userId,
    //     },
    //   });
    //   if (isPrivate) {
    //     await tx.roomAdmission.create({
    //       data: {
    //         userId: userId,
    //         roomId: room.id,
    //       },
    //     });
    //   }

    //   return room;
    // });

    // Без transaction
    const room = await prisma.room.create({
      data: {
        nameRoom,
        isPrivate,
        ownerId: userId,
        // связь Room -> RoomAdmission через admissions
        admissions: isPrivate ? { create: { userId } } : undefined, // prisma дополнит roomId, а userId передаем
      },
    });

    res.status(201).json(room);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка при создании комнаты" });
  }
});

//
router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.session.userId;
    // ищем все комнаты
    const rooms = await prisma.room.findMany({
      select: {
        id: true,
        nameRoom: true,
        isPrivate: true,
        ownerId: true,

        // Мой запрос в комнату (0..1)
        requests: userId
          ? {
              where: { userId },
              select: { status: true },
              take: 1,
            }
          : false,

        // Я участник комнаты?
        admissions: userId
          ? {
              where: { userId },
              select: { id: true },
              take: 1,
            }
          : false,
      },
      orderBy: { nameRoom: "asc" },
    });

    const payload = rooms.map((room) => {
      // является ли пользователь владельцем комнаты
      const isOwner = userId ? room.ownerId === userId : false;

      // Является ли пользователь участником комнаты
      const isMember =
        isOwner || // если я владелец → я участник // или
        ("admissions" in room && room.admissions?.length > 0); // если есть запись в RoomAdmission для меня → я участник

      // Мои запросы к данной комнате
      const myRequestStatus =
        "requests" in room && room.requests.length
          ? room.requests[0].status
          : null;

      const hasAccess = room.isPrivate
        ? isOwner || isMember || myRequestStatus === RoomRequestStatus.APPROVED
        : true;

      return {
        id: room.id,
        nameRoom: room.nameRoom,
        isPrivate: room.isPrivate,
        ownerId: room.ownerId,

        isOwner,
        isMember,
        myRequestStatus,
        hasAccess,
      };
    });

    res.json(payload);
  } catch (error) {
    console.log(error);
  }
});

// Маршрут для получения конкретной комнаты по её ID
router.get(
  "/userrooms",
  async (req: express.Request, res: express.Response) => {
    try {
      // забираем id из сессии
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      // ищем все комнаты данного пользователя
      const rooms = await prisma.room.findMany({ where: { ownerId: userId } });

      // возвращаем резултат
      res.status(200).json(rooms);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Ошибка при получении комнат" });
    }
  },
);

// Маршрут для получения конкретной комнаты по её ID
router.get(
  "/getOneRoom/:id",
  requireRoomAccess, // для защиты перехода в комнату где нет доступа
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      // находим комнату по ее id
      const room = await prisma.room.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
        },
      });

      // если комната не найдена
      if (!room) {
        return res.status(404).json({ message: "Комната не найдена" });
      }
      return res.status(200).json(room);
    } catch (error) {}
  },
);

// router.delete("/del", async (req, res) => {
//   await prisma.room.delete({
//     where: { id: "cmkma0xz2000ej1os4l35nifm" },
//   });
//   return res.status(200).json({ message: "Delete cool" });
// });

export default router;
