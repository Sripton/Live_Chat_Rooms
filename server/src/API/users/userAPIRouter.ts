import express from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import upload from "../../MiddleWare/uploadUser";
import path from "path";
import fs from "fs";
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
      username: user.username,
      avatar: user.avatar,
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
      username: user.username,
      avatar: user.avatar,
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

      // лучше не хранить данные в в сессии.  Источник истины — база данных
      // обновляем данные в сессии
      // req.session.userName = findUser.username ?? undefined;
      // req.session.userAvatar = findUser.avatar;

      return res.json({
        userId: findUser.id,
        username: findUser.username,
        avatar: findUser.avatar,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  },
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

// мрашрут для редактирвоания профиля пользователя
router.patch(
  `/uploadprofile`,
  upload.single("avatar"),
  async (req: express.Request, res: express.Response) => {
    // при редактировании профиля пользователем удаляем старые файлы
    const removeOldAvatarFile = async (avatarPath: string | null) => {
      try {
        // если путь не найден ничего не удаляем
        if (!avatarPath) return;

        // Защита: удаляем только файлы внутри /usersimg/.
        // Если по какой-то причине в БД лежит другой путь — игнорируем.
        if (!avatarPath.startsWith("/usersimg")) return;

        // Собираем абсолютный путь до файла, который лежит в ../public/usersimg
        // avatarPath хранится с начальным слешем ("/usersimg/..."),
        // поэтому добавляем точку перед ним, чтобы path.resolve корректно соединил.
        const absolutePath = path.resolve(
          // path.resolve() - Преобразует относительные пути в абсолютные. Склеивает части пути правильно для текущей ОС
          __dirname,
          "../public",
          `.${avatarPath}`,
        );

        // Проверяем существование файла перед удалением
        if (fs.existsSync(absolutePath)) {
          await fs.unlink(absolutePath);
        }
      } catch (error) {
        console.log(error);
      }
    };
    // забираем id пользователя из сессии
    const userId = req.session.userId;

    // если нет сессии
    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    // данные имени пользовтеля
    const { username } = req.body as { username: string };

    // описываем  обновляемые поля профиля
    // data содержит два необязательных поля: username, avatar
    const data: { username?: string | null; avatar?: string | null } = {};

    // обновлять имя только в том случае, если нам передали строку
    if (typeof username === "string") {
      const trimmed = username.trim(); // убираем лишние пробелы

      // если после удаления пробелов строка не пустая, присваиваем её полю username в объекте data
      if (trimmed.length > 0) data.username = trimmed;
    }

    // если файл был выбран  сохраняем его  в поле avatar в объекте data
    if (req.file) {
      data.avatar = `/usersimg/${req.file.filename}`;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Нечего обновлять" });
    }

    // обновляем данные в бд
    const update = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, username: true, avatar: true },
    });

    // отправляем на фронт новые данные
    return res.json({
      userId: update.id,
      username: update.username,
      avatar: update.avatar,
    });
  },
);

export default router;
