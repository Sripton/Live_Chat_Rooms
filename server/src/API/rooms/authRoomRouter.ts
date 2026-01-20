import express, { NextFunction } from "express";
import { prisma } from "../../lib/prisma";

export async function requireRoomAccess(
  req: express.Request,
  res: express.Response,
  next: NextFunction,
) {
  // Забираем id комнаты из параметра
  const roomId = String(req.params.id ?? "");
  // ошибка если не найден
  if (!roomId) return res.status(400).json({ message: "id is required" });

  // ищем комнату
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { id: true, isPrivate: true, ownerId: true },
  });

  if (!room) return res.status(404).json({ message: "Комната не найдена." });

  // Открытая — можно всем
  if (!room.isPrivate) {
    (req as any).room = room;
    return next();
  }

  // Приватная — нужна авторизация
  const userId = req.session.userId;
  if (!userId)
    return res.status(401).json({ message: "Необходима авторизация." });

  // Владелец — ок
  if (room.ownerId === userId) {
    (req as any).room = room;
    return next();
  }
  // Проверяем membership
  const admission = await prisma.roomAdmission.findUnique({
    where: { userId_roomId: { userId, roomId } },
    select: { id: true },
  });

  if (!admission)
    return res.status(403).json({ message: "Нет доступа к комнате." });

  (req as any).room = room;
  return next();
}
