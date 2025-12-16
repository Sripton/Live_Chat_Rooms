import express from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/signup", async (req: express.Request, res: express.Response) => {
  try {
    const { login, password, username, avatar } = req.body as {
      login?: string;
      password?: string;
      username?: string;
      avatar?: string;
    };

    // Если пользовтаель не ввел логин и пароль
    if (!login || !password) {
      return res.status(400).json({ message: "login и password обязательны" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Пароль минимум 6 символов" });
    }

    //  Проверка уникальности login
    const existing = await prisma.user.findUnique({
      where: { login },
    });

    if (existing) {
      return res.status(409).json({
        message: "Пользователь с таким login уже существует",
      });
    }

    // Хеширование пароля
    const hashPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await prisma.user.create({
      // данные для INSERT. обязательные поля обязаны быть в data
      data: {
        login,
        passwordHash: hashPassword,
        username: username ?? null,
        avatar: avatar ?? null,
      },
      // select определяет, какие поля ВЕРНУТСЯ из БД
      select: {
        id: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    });

    // id  после регистрации
    req.session.userId = user.id;
    return res.status(201).json(user);
  } catch (error: any) {
    console.log(error);
  }
});

router.post("/signin", async (req: express.Request, res: express.Response) => {
  try {
    const { login, password } = req.body as {
      login?: string;
      password?: string;
    };

    if (!login || !password) {
      return res.status(400).json({ message: "Логин и пароль обязательны" });
    }

    // Ищем пользователя в базе данных по логину
    const user = await prisma.user.findUnique({
      where: { login },
      // взять его passwordHash
      select: {
        id: true,
        login: true,
        username: true,
        avatar: true,
        passwordHash: true, // для сервера, чтобы сравнить пароль.
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Неверный login или пароль" });
    }

    // user.passwordHash: string | null
    // Нужно явно проверить, что passwordHash существует
    if (!user.passwordHash) {
      return res
        .status(401)
        .json({ message: "У пользователя не установлен пароль" });
    }

    // сравнить пароль с хэшем
    const comparePassword = await bcrypt.compare(password, user.passwordHash);

    // сохранить сессию
    req.session.userId = user.id;

    // отдаем данные для redux
    return res.json({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
