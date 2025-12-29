import express from "express";
import { prisma } from "../../lib/prisma";
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
export default router;
