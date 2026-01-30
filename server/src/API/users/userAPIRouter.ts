import express from "express";
import { prisma } from "../../lib/prisma";
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

    if (password.length < 3) {
      return res.status(400).json({ message: "Пароль минимум 6 символов" });
    }

    //  Проверка уникальности login
    const existing = await prisma.user.findUnique({
      where: { login },
    });

    if (existing) {
      return res.status(409).json({
        error: "Пользователь с таким логином уже существует",
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
    return res.status(201).json({
      userId: user.id,
      userName: user.username,
      userAvatar: user.avatar,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/signin", async (req: express.Request, res: express.Response) => {
  // console.log("CONTENT-TYPE:", req.headers["content-type"]);
  // console.log("RAW BODY:", req.body);
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
    if (!comparePassword)
      return res.status(401).json({ message: "Неверный login или пароль" });

    // сохранить сессию
    req.session.userId = user.id;

    // отдаем данные для redux
    //(Redux) нужны данные, чтобы:
    // сразу показать UI как “залогинен” (имя, аватар, id)
    // не хранить пароль/хэш на клиенте (это критично по безопасности)
    return res.json({
      userId: user.id,
      userName: user.username,
      userAvatar: user.avatar,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обработчик GET-запроса на маршрут "/checkUser" для проверки авторизованного пользователя
// Берём userId из сессии
// По нему делаем findUnique
// Через select берём актуальные данные из БД
router.get(
  "/checkuser",
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.session.userId;

      // если нет сессии
      if (!userId) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }

      // ищем пользователя в БД
      const findUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, avatar: true }, // select —  запрос к БД
      });
      // если в сессии id есть, но в БД пользователя нет
      if (!findUser) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }

      // обновляем данные в сессии
      req.session.userName = findUser.username ?? undefined;
      req.session.userAvatar = findUser.avatar;

      return res.json({
        userId: findUser.id,
        userName: findUser.username,
        userAvatar: findUser.avatar,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }
);

router.get("/logout", (req: express.Request, res: express.Response) => {
  try {
    // Удаляем текущую сессию пользователя на сервере
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Ошибка при выходе" });
      }
    });
    res.clearCookie("user_live");
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});
export default router;
