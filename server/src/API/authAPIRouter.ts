import express from "express";
import passport from "passport";

const router = express.Router();

// Стартовая точка Google/OAuth
router.get(
  "/google",
  // Express передаёт управление Passport. HTTP 302 Redirect → Google
  // scope — какие данные  запрашиваем у Google
  // "profile" -> доступ к profile.id, profile.displayName, profile.photos
  // "email" -> "elmar@mail.ru"
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// возврат пользователя от Google
router.get(
  "/google/callback",
  // Вызывает твою функцию: async (_accessToken, _refreshToken, profile, done) => { ... }
  // passport.authenticate - находим или создаём пользователя
  // вызываем done(null, user)
  passport.authenticate("google", {
    session: false, // используем express-session
    // failureRedirect - в случае ошибки редирект на error
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google`,
  }),

  // код выполняется ТОЛЬКО если Auth прошёл успешно.
  (req, res) => {
    // Passport кладёт user в req.user
    const user = req.user as { id: string };
    // записываем в redis-session
    req.session.userId = user.id;

    // фронт после редиректа дернет /api/users/checkuser
    // возвращаем пользователя обратно на фронт
    return res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

export default router;
