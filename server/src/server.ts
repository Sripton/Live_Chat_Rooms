import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session"; // Подключаем express-session для управления сессиями
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import userAPIRouter from "./API/users/userAPIRouter";
import passport from "passport";
import "./auth/passportGoogle";
import authAPIRouter from "./API/users/authAPIRouter";
import roomAPIRouter from "./API/rooms/roomAPIRouter";
import roomRequestAPIRouter from "./API/roomRequest/roomRequestAPIRouter";
import postAPIRouter from "./API/post/postAPIRouter";
import postReactionsAPIRouter from "./API/postReaction/postAPIReaction";
import commentAPIRouter from "./API/comment/commentAPIRouter";

const app = express();
const PORT = process.env.PORT;

app.use(morgan("dev")); // Включаем логирование HTTP-запросов в режиме "dev"
app.use(express.json()); // Подключаем встроенный middleware для обработки JSON-запросов
app.use(express.urlencoded({ extended: true })); // Подключаем middleware для обработки данных формы
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: true,
    credentials: true,
  }),
); // Настраиваем CORS, чтобы разрешить кросс-доменные запросы с передачей куков
async function main() {
  const redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on("error", console.error);
  await redisClient.connect();

  // session.SessionOptions ->  тип из express-session, который описывает, какие именно настройки сессии допустимы.
  // TS  проверяeт объект по правилам express-session
  const sessionConfig: session.SessionOptions = {
    name: "user_live", // Название cookie сессии
    secret: process.env.SESSION_SECRET ?? "test", // Секретный ключ для подписи сессий (из .env или дефолтное "test")
    //resave: false - Этот параметр управляет поведением express-session при первой инициализации сессии — т.е. когда в req.session ещё ничего нет.
    // saveUninitialized: true
    //     — сохраняет даже пустую сессию в хранилище при первом запросе.
    // saveUninitialized: false
    //     — НЕ сохраняет сессию, пока ты не положишь туда данные вручную (например, req.session.userID = ...).
    // saveUninitialized: false — это нормально и правильно, особенно если ты работаешь с логином, профилем, пользовательскими данными.
    resave: false, // Принудительное сохранение сессии в хранилище при каждом запросе
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false, // Не сохраняем сессию, если она пустая
    cookie: {
      maxAge: 1000 * 60 * 60 * 12, // Время жизни куки (12 часов)
      httpOnly: true, // Делаем куку недоступной для JavaScript (только сервер)
      sameSite: "lax", // Политика sameSite (предотвращает CSRF-атаки). Должно быть none в продакшене
      secure: false, // Должно быть true в продакшене (только HTTPS)
    },
  };
  app.use(session(sessionConfig));
  app.use(passport.initialize());

  app.use("/auth", authAPIRouter);
  app.use("/api/users", userAPIRouter);
  app.use("/api/rooms", roomAPIRouter);
  app.use(`/api/roomRequest`, roomRequestAPIRouter);
  app.use("/api/posts", postAPIRouter);
  app.use(`/api/post_reactions`, postReactionsAPIRouter);
  app.use("/api/comments", commentAPIRouter);

  app.listen(PORT, () => console.log(`Server started on ${PORT} PORT`));
}

main().catch(console.error);
