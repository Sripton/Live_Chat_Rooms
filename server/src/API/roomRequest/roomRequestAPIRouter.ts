import express from "express";
import { prisma } from "../../lib/prisma";
import { type Prisma, RoomRequestStatus } from "@prisma/client";

const router = express.Router();

// Тип  запроса
type CreateRoomRequestBody = {
  roomId: string;
};

// post запрос для создания запроса к приватным комнатам
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
        return res.status(403).json({ message: "Доступ отклонён!." });
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

// get запрос для получения запросов для определенного пользователя
router.get(
  "/userRequest",
  async (req: express.Request, res: express.Response) => {
    try {
      // Забираем id пользовтаеля из сессии
      const userId = req.session.userId;

      // // 1. Проверим, существует ли вообще таблица и соединение
      // console.log("✅ Prisma подключен:", prisma ? "Да" : "Нет");

      // Исходящие запросы пользователя (где он requester / userId)
      // const outgoing = await prisma.roomRequest.findMany({
      //   where: { userId: userId },
      //   orderBy: { createdAt: "desc" },
      //   include: {
      //     room: {
      //       select: {
      //         id: true,
      //         nameRoom: true,
      //         ownerId: true,
      //         // isPrivate: ???
      //       },
      //     },
      //   },
      // });

      // Входящие запросы пользователя (где он ownerId)
      // const incoming = await prisma.roomRequest.findMany({
      //   where: { ownerId: userId },
      //   orderBy: { createdAt: "desc" },
      //   include: {
      //     requester: {
      //       select: {
      //         username: true,
      //         avatar: true,
      //       },
      //     },

      //     room: {
      //       select: {
      //         id: true,
      //         nameRoom: true,
      //         ownerId: true,
      //         // isPrivate: ???
      //       },
      //     },
      //   },
      // });

      const [incomingRequests, outgoingRequests] = await prisma.$transaction([
        // Входящие запросы пользователя (где он ownerId)
        prisma.roomRequest.findMany({
          // кто является воалдельцем данной комнаты
          where: { ownerId: userId },
          orderBy: { createdAt: "desc" },
          include: {
            // кто просит доступ
            requester: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            // к какой комнате запрос
            room: {
              select: {
                id: true,
                nameRoom: true,
                ownerId: true,
                isPrivate: true,
              },
            },
          },
        }),

        // Исходящие запросы пользователя (где он requester / userId)
        prisma.roomRequest.findMany({
          // кто отправялет запрос
          where: { userId: userId },
          orderBy: { createdAt: "desc" },
          include: {
            // в какую комнату
            room: {
              select: {
                id: true,
                nameRoom: true,
                ownerId: true,
                isPrivate: true,
              },
            },
          },
        }),
      ]);
      // отдаем резульаты
      res
        .status(200)
        .json({ incoming: incomingRequests, outgoing: outgoingRequests });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка получения запросов" });
    }
  }
);

// тип статуса запроса
type ChangeStatusBody = {
  // Extract безопасный, проверяет на этапе компиляции, что "APPROVED" и "REJECTED" действительно существуют в RoomRequestStatus
  status: Extract<RoomRequestStatus, "APPROVED" | "REJECTED">;
};

router.patch(
  "/:id",
  async (
    req: express.Request<{ id: string }, any, ChangeStatusBody>,
    res: express.Response
  ) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      //  текущий пользователь
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }

      // валидация статуса (строго enum)
      if (
        status !== RoomRequestStatus.APPROVED &&
        status !== RoomRequestStatus.REJECTED
      ) {
        return res.status(400).json({ message: "Неверный статус" });
      }

      // транзакция
      await prisma.$transaction(async (tx) => {
        // ищем текущий запрос
        const request = await tx.roomRequest.findUnique({
          where: { id },
          select: {
            id: true,
            ownerId: true,
            userId: true,
            roomId: true,
            status: true,
          },
        });

        if (!request) {
          throw Object.assign(new Error("Запрос не найден"), { code: 404 });
        }

        // проверка прав
        if (request.ownerId !== userId) {
          throw Object.assign(new Error("Вы не являетесь владельцем комнаты"), {
            code: 403,
          });
        }

        // обновляем статус только если он изменился
        if (request.status !== status) {
          await tx.roomRequest.update({
            where: { id: request.id },
            // обновляем статус
            data: { status },
          });
        }
        // если APPROVED — добавляем участника
        if (status === RoomRequestStatus.APPROVED) {
          await tx.roomAdmission.upsert({
            where: {
              userId_roomId: {
                userId: request.userId,
                roomId: request.roomId,
              },
            },

            update: {},

            create: {
              userId: request.userId,
              roomId: request.roomId,
            },
          });
        }
      });
      // возвращаем обновлённый запрос
      const updated = await prisma.roomRequest.findUnique({
        where: { id },
        include: {
          requester: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },

          owner: {
            select: {
              id: true,
              username: true,
            },
          },

          room: {
            select: {
              id: true,
              nameRoom: true,
              ownerId: true,
            },
          },
        },
      });

      // отдаем на клиент
      return res.status(200).json({
        message: "Статус запроса обновлён",
        request: updated,
      });
    } catch (error: any) {
      console.log(error);
      // На сервере   error.code
      // На клиенте err.response.status (HTTP статус)
      if (typeof error?.code === "number") {
        console.log(error);
        // err.response.data.message (сообщение)
        return res.status(error.code).json({ message: error.message });
      }

      return res
        .status(500)
        .json({ message: "Ошибка при изменении статуса запроса" });
    }
  }
);

export default router;
