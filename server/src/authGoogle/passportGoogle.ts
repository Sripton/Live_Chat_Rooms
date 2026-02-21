import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../lib/prisma";

// passport-google-oauth20 -> string not undefined

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    // функция вызывается посде того, как пользователь ушёл на Google, залогиниля и гугл вернул ok
    async (_accessToken, _refreshToken, profile, done) => {
      // _accessToken -> делаем запросы к Google API
      // _refreshToken -> токен для обновления access token
      // profile -> данные пользователя Google, запрашиваемые через scope
      // profile: scope: ["profile", "email"]:
      // profile.id                // уникальный Google ID
      // profile.displayName       // имя пользователя
      // profile.emails[0].value   // email
      // profile.photos[0].value   // аватар
      // done -> Callback
      try {
        const provider = "google";
        const providerAccountId = profile.id;

        // Если акаунт есть
        const existing = await prisma.account.findUnique({
          where: {
            // (provider, providerAccountId) → уникальны вместе
            // Найди одну запись Account у которой provider = "google"  и providerAccountId = profile.id
            provider_providerAccountId: { provider, providerAccountId },
          },
          include: { user: true },
        });

        // error = null → ошибок нет
        // user = existing.user → пользователь из БД
        if (existing) return done(null, existing.user);

        // создаём нового пользователя (login/password = null)
        const avatar = profile.photos?.[0]?.value ?? null;
        const username = profile.displayName ?? null;

        const user = await prisma.user.create({
          data: {
            username,
            avatar,
            accounts: {
              create: { provider, providerAccountId },
            },
          },
          select: { id: true, username: true, avatar: true },
        });
        return done(null, user);
      } catch (error) {
        return done(null, error as Error);
      }
    },
  ),
);

export default passport;
